var Service = require('lib/config/service');
var TitleBar = require('./views/title-bar');
var Menu = require('./views/menu');
var App = require('lib/config/application');

var Service = Service.extend({
  channelName: 'header',

  initialize: function(options) {
    options = options || {};
    this.header = options.headerContainer;
    this.menu = options.menuContainer;

    this.channel.reply({
      'update:title': this.updateTitle
    }, this);
  },

  onStart: function(){
    this.showTitleBar();
    this.showMenu();
  },

  showTitleBar: function(){
    var view = new TitleBar();
    this.header.show(view);
  },

  updateTitle: function(title){
    this.header.currentView.update(title);
  },

  showMenu: function(){
    var view = new Menu();

    this.channel.reply({
      'open:menu'   : view.open,
      'close:menu'  : view.close
    }, view);

    this.menu.show(view);
  },

  onStop: function(){
    this.channel.reset();
  }
});

module.exports = Service;
App.prototype.set('HeaderApp.Service', Service);