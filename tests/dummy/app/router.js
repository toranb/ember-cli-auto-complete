import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route("foo", {path: "/"});
    this.route("bar", {path: "/bar"});
});

export default Router;
