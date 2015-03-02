import Ember from "ember";

export default Ember.Controller.extend({
    options: function() {
        return this.get("codes").map(function(item) {
            var value = item.get("code");
            var label = item.get("text");
            return Ember.Object.create({value: value, label: label});
        });
    }.property("codes.@each")
});
