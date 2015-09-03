var expect = require('chai').expect;
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var renderTarget, renderedComponent;

describe('displaying article overview', () => {
  var categories = [{id: 1, name: 'first category'}, {id: 2, name:'second category'}];
  var articles = [{id: 3, name: 'first article', intensity: 3, price: 42, isMatchingFilter: true, category: 1}, {id: 4, name: 'second article', intensity: 8, price: 38, isMatchingFilter: true, category:2}];

  beforeEach(() => {
    var ComponentClass = require('../../app/components/articles-controller-view.react.js');
    renderTarget = document.getElementsByTagName('body')[0];

    var dataAccess = {
      getCategoriesAndArticles: () => {
        return {
          categories: categories,
          articles: articles
        };
      }
    };

    var ActionCreator = require('../../app/action-creator.js');
    var actionCreator = new ActionCreator(dataAccess);
    var ArticleStore = require('../../app/article-store.js');
    var store = new ArticleStore();
    renderedComponent = React.render(<ComponentClass actionCreator={actionCreator} store={store}/>, renderTarget);

  });

  afterEach(() => {
    React.unmountComponentAtNode(renderTarget);
    renderedComponent = null;
  });

  describe('server has some categories and articles', () => {
    it('should display categories from server', () => {
      let actualCategoryNames = TestUtils.scryRenderedDOMComponentsWithClass(renderedComponent, 'category-name').map((category) => category.getDOMNode().textContent);
      let expectedCategoryNames = categories.map((category) => category.name);
      expect(actualCategoryNames).to.deep.equal(expectedCategoryNames);
    });

    it('should display articles from server', () => {
      let actualArticleNames = TestUtils.scryRenderedDOMComponentsWithClass(renderedComponent, 'article-name').map((article) => article.getDOMNode().textContent);
      let expectedArticleNames = articles.map((article) => article.name);
      expect(actualArticleNames).to.deep.equal(expectedArticleNames);
    });
  });
});
