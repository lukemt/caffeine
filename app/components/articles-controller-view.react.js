let React = require('react');
let Navigation = require('./navigation.react.js');
let ShoppingCartBadge = require('./shopping-cart-badge.react.js');
let ArticleList = require('./article-list.react.js');
let ArticleInformation = require('./article-information.react.js');
let IntensityFilter = require('./intensity-filter.react.js');
let Maybe = require('../maybe.js');

class ArticlesControllerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      articles: [],
      selectedArticle: Maybe.Not,
      shoppingCartInfo: {}
    };
  }

  handleDataChanged() {
    this.setState(
      {
        categories: this.props.store.getCategories(),
        articles: this.props.store.getArticles(),
        selectedArticle: this.props.store.getMaybeSelectedArticle(),
        shoppingCartInfo: this.props.store.getShoppingCartBadgeInformation()
      }
    );
  }

  componentDidMount() {
    this.deregisterChangeListener = this.props.store.addChangeListener('changed', this.handleDataChanged.bind(this));
    this.props.actionCreator.initialize();
  }

  componentWillUnmount() {
    this.deregisterChangeListener();
  }

  filterByIntensity(intensity) {
    this.props.actionCreator.filterByIntensity(intensity);
  }

  render() {
    let articleInformation;
    if (this.state.selectedArticle.hasValue) {
      articleInformation = <ArticleInformation actionCreator={this.props.actionCreator} article={this.state.selectedArticle.value}/>;
    }
    let maximumIntensity = this.props.store.getMaximumPossibleIntensity();
    let availableIntensities = this.props.store.getAvailableIntensities();

    return <div>
            <Navigation>
              <ShoppingCartBadge shoppingCartInfo={this.state.shoppingCartInfo} navigate={this.props.navigate} />
            </Navigation>

            <div className="container contentWrapper">
              <h1>Unsere Kaffee-</h1>
              <IntensityFilter actionCreator={this.props.actionCreator}
                               maximumIntensity={maximumIntensity}
                               availableIntensities={availableIntensities} />
              <ArticleList categories={this.state.categories}
                           articles={this.state.articles}
                           actionCreator={this.props.actionCreator}/>
              {articleInformation}
            </div>
          </div>;
  }
}

ArticlesControllerView.propTypes = {
  store: React.PropTypes.object.isRequired,
  actionCreator: React.PropTypes.object.isRequired
};
module.exports = ArticlesControllerView;
