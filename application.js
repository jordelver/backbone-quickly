App = {
  start: function() {
    new App.SearchRouter();
    Backbone.history.start();
  }
}

App.SearchResult = Backbone.Model.extend({});

App.SearchResultList = Backbone.Collection.extend({
  model: App.SearchResult
});

App.searchResults = new App.SearchResultList();

App.SearchController = {
  search: function(term) {
    App.searchResults.add({term : term});
  }
}

App.SearchResultsView = Backbone.View.extend({
  el: '#search-results',

  initialize: function() {
    App.searchResults.bind('add', this.renderItem, this);
  },

  renderItem: function(model) {
    var view = new App.SearchResultView({model : model});
    this.$('ul').append(view.el);
  }
});

App.SearchResultView = Backbone.View.extend({
  tagName: 'li',

  events: {
    'click a' : 'addFavourite'
  },

  initialize: function() {
    this.template = _.template($('#imageTemplate').html());
    this.render();
  },

  render: function() {
    var html = this.template({model : this.model.toJSON()});
    $(this.el).append(html);
  },

  addFavourite: function() {
    App.favourites.add(this.model);
  }
});

App.Favourite = Backbone.Model.extend({});

App.FavouriteList = Backbone.Collection.extend({
  model: App.Favourite
});

App.favourites = new App.FavouriteList();

App.FavouritesView = Backbone.View.extend({

  el: '#favourites',

  initialize: function() {
    App.favourites.bind('add', this.renderItem, this);
  },

  renderItem: function(model) {
    var view = new App.FavouriteView({model : model});
    this.$('ul').append(view.el);
  }
});

App.FavouriteView = Backbone.View.extend({
  tagName: 'li',

  initialize: function() {
    this.template = _.template($('#imageTemplate').html());
    this.render();
  },

  render: function() {
    var html = this.template({model : this.model.toJSON()});
    $(this.el).append(html);
  }
});

App.SearchRouter = Backbone.Router.extend({
  routes: {
    'search/:term' : 'search'
  },

  initialize: function() {
    new App.SearchView({router : this});
    new App.SearchResultsView();
    new App.FavouritesView();
  },

  search: function(term) {
    App.SearchController.search(term);
  }
});

App.SearchView = Backbone.View.extend({
  el: '#search',

  events: {
    'keypress' : 'handleEnter'
  },

  initialize: function() {
    this.router = this.options.router;
    $(this.el).focus();
  },

  handleEnter: function(e) {
    if(e.keyCode == 13) {
      this.router.navigate('search/' + $(this.el).val(), true);
    }
  }
});
