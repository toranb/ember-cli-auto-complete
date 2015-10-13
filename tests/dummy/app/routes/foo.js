import Ember from "ember";
const { get } = Ember;

var Bar = Ember.Object.extend({code: ""});

export default Ember.Route.extend({
  model: function() {
    var codes = Ember.A([]);
    codes.pushObject({code: "ABC", text: "SOMETHING 1"});
    codes.pushObject({code: "ABD", text: "SOMETHING 2"});
    codes.pushObject({code: "ABZ", text: "SOMETHING 3"});
    codes.pushObject({code: "BDE", text: "SOMETHING 4"});
    codes.pushObject({code: "BFN", text: "SOMETHING 5"});
    codes.pushObject({code: "BFZ", text: "SOMETHING 6"});
    codes.pushObject({code: "BFC", text: "SOMETHING 7"});
    codes.pushObject({code: "BZN", text: "SOMETHING 8"});
    codes.pushObject({code: "BZZ", text: "SOMETHING 9"});
    codes.pushObject({code: "BZA", text: "SOMETHING 10"});
    codes.pushObject({code: "BZB", text: "SOMETHING 11"});
    codes.pushObject({code: "BZC", text: "SOMETHING 12"});
    codes.pushObject({code: "BZD", text: "SOMETHING 13"});
    codes.pushObject({code: "BZE", text: "SOMETHING 14"});
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
      this.get('controller').set('selection', get(item, 'code'));
    }
  }
});
