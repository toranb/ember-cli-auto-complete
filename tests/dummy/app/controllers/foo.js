import Ember from "ember";

export default Ember.Controller.extend({
  selection: "",
  hideWhenNoSuggestions: false,
  noMessagePlaceholder: Ember.computed('hideWhenNoSuggestions', function(){
    return this.get('hideWhenNoSuggestions') ? null : "No things are found";
  }),
});
