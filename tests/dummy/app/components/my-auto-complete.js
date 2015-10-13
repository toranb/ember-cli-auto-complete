import Ember from 'ember';
import AutoComplete from "ember-cli-auto-complete/components/auto-complete";
const { get } = Ember;

export default AutoComplete.extend({
  valueProperty: "code",
  determineSuggestions: function(options, input) {
      var list = options.filter(function(item) {
          return get(item, "code").toLowerCase().indexOf(input.toLowerCase()) > -1;
      });

      return Ember.A(list);
  }
});
