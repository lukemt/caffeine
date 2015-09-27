let utils = require('./utils.js');
let dispatcher = require('./flux/dispatcher.js');
let actionIdentifiers = require('./action-identifiers.js');
let Store = require('./flux/store.js');
let Maybe = require('./maybe.js');
const MAXIMUM_POSSIBLE_INTENSITY = 13;

class ArticleStore extends Store {
  constructor() {
    super();
    this.shoppingCart = {};
    this.intensityFilter = Maybe.Not;
    this.maybeSelectedArticle = Maybe.Not;
    dispatcher.register(this.onActionDispatched.bind(this));
  }

  getCategories() {
    return utils.clone(this.data.categories);
  }

  getArticles() {
    let articles = utils.clone(this.data.articles);

    let result = articles.map((article) => {
      article.isMatchingFilter = this.articleMatchesFilter(article);
      return article;
    });
    return result;
  }

  getMaybeSelectedArticle() {
    return this.maybeSelectedArticle;
  }

  articleMatchesFilter(article) {
    if (!this.intensityFilter.hasValue) return true;
    return article.intensity === this.intensityFilter.value;
  }

  getMaximumPossibleIntensity() {
    return MAXIMUM_POSSIBLE_INTENSITY;
  }

  getAvailableIntensities() {
    let intensities = [];
    if (this.intensityFilter.hasValue) {
      intensities.push(this.intensityFilter.value);
      return intensities;
    }

    if (!this.data || !this.data.articles) return intensities;

    return this.data.articles.reduce((acc, current) => {
      if (acc.indexOf(current.intensity) === -1) {
        acc.push(current.intensity);
      }
      return acc;
    }, intensities);
  }

  getShoppingCartBadgeInformation() {
    let shoppingCartInfo = { articleCount: 0, totalPrice: 0 };
    if (!this.data || !this.data.articles) return shoppingCartInfo;

    return this.data.articles.reduce((acc, article) => {
      let amount = this.shoppingCart[article.id];

      if (amount) {
        acc.articleCount += amount;
        acc.totalPrice += article.price * amount;
      }
      return acc;
    }, shoppingCartInfo);
  }

  getShoppingCartContent() {
    let shoppingCartContent = {
      totalAmount: 0,
      totalPrice: 0,
      packagingSizeInvalid: false,
      items: []
    };

    if (!this.data || !this.data.articles) return shoppingCartContent;

    let items = this.data.articles.reduce((acc, article) => {
      let amount = this.shoppingCart[article.id];

      if (amount) {
        acc.push({
          id: article.id,
          name: article.name,
          amount: amount,
          price: article.price,
          totalPrice: amount * article.price,
          color: article.color
        });
      }
      return acc;
    }, []);

    shoppingCartContent.items = items;
    shoppingCartContent.totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    shoppingCartContent.totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    shoppingCartContent.packagingSizeInvalid = shoppingCartContent.totalAmount % 50 !== 0;
    return shoppingCartContent;
  }

  onInitialize(data) {
    this.data = data;
    this.emitChange('changed');
  }

  onFilterByIntensity(intensity) {
    this.intensityFilter = this.intensityFilter.hasValue && this.intensityFilter.value === intensity
      ? Maybe.Not
      : new Maybe(intensity);
    this.emitChange('changed');
  }

  onSelectArticle(articleId) {
    let selectedArticle = this.data.articles.filter((article) => {
      return article.id === articleId;
    })[0];
    this.maybeSelectedArticle = new Maybe(selectedArticle);
    this.emitChange('changed');
  }

  onAddArticleToShoppingCart(articleId, amount) {
    let previousAmount = this.shoppingCart[articleId];
    let currentAmount = previousAmount ? previousAmount + amount : amount;
    this.shoppingCart[articleId] = currentAmount;
    this.emitChange('changed');
  }

  onRemoveArticleFromShoppingCart(articleId, amount) {
    let previousAmount = this.shoppingCart[articleId];
    let currentAmount = previousAmount - amount;
    this.shoppingCart[articleId] = currentAmount;
    if (currentAmount <= 0) delete this.shoppingCart[articleId];
    this.emitChange('changed');
  }

  onActionDispatched(action) {
    switch (action.type) {
      case actionIdentifiers.articleList.initialize:
        this.onInitialize(action.data);
        break;
      case actionIdentifiers.articleList.filterByIntensity:
        this.onFilterByIntensity(action.intensity);
        break;
      case actionIdentifiers.articleList.selectArticle:
        this.onSelectArticle(action.articleId);
        break;
      case actionIdentifiers.shoppingCart.addArticle:
        this.onAddArticleToShoppingCart(action.articleId, action.amount);
        break;
      case actionIdentifiers.shoppingCart.removeArticle:
        this.onRemoveArticleFromShoppingCart(action.articleId, action.amount);
        break;
      default:
        // nothing to do here
    }
  }
}

module.exports = ArticleStore;