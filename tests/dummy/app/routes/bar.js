import Ember from "ember";

var Foo = Ember.Object.extend({});
var Bar = Ember.Object.extend({code: ""});

export default Ember.Route.extend({
  model: function() {
    var codes = Ember.A([]);
    codes.pushObject(Foo.create({code: "AAA", text: "first"}));
    codes.pushObject(Foo.create({code: "AAB", text: "last"}));
    return Ember.RSVP.hash({
      model: Bar.create(),
      codes: codes
    });
  },
  setupController: function(controller, hash) {
    controller.set("model", hash.model);
    controller.set("codes", hash.codes);
  },
  actions: {
    itemSelected: function(item) {
      this.get('controller').set('selection', item.get('code'));
    }
  }
});
