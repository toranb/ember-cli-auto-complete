import Ember from "ember";

var Foo = Ember.Object.extend({});
var Bar = Ember.Object.extend({code: ""});

export default Ember.Route.extend({
  model: function() {
    var codes = Ember.A([]);
    codes.pushObject(Foo.create({code: "ABC", text: "SOMETHING 1"}));
    codes.pushObject(Foo.create({code: "ABD", text: "SOMETHING 2"}));
    codes.pushObject(Foo.create({code: "ABZ", text: "SOMETHING 3"}));
    codes.pushObject(Foo.create({code: "BDE", text: "SOMETHING 4"}));
    codes.pushObject(Foo.create({code: "BFN", text: "SOMETHING 5"}));
    codes.pushObject(Foo.create({code: "BFZ", text: "SOMETHING 6"}));
    codes.pushObject(Foo.create({code: "BFC", text: "SOMETHING 7"}));
    codes.pushObject(Foo.create({code: "BZN", text: "SOMETHING 8"}));
    codes.pushObject(Foo.create({code: "BZZ", text: "SOMETHING 9"}));
    codes.pushObject(Foo.create({code: "BZA", text: "SOMETHING 10"}));
    codes.pushObject(Foo.create({code: "BZB", text: "SOMETHING 11"}));
    codes.pushObject(Foo.create({code: "BZC", text: "SOMETHING 12"}));
    codes.pushObject(Foo.create({code: "BZD", text: "SOMETHING 13"}));
    codes.pushObject(Foo.create({code: "BZE", text: "SOMETHING 14"}));
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
