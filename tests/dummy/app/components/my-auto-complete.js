import Ember from 'ember';
import AutoComplete from "ember-cli-auto-complete/components/auto-complete";

export default AutoComplete.extend({
  valueProperty: "code",
  suggestions: Ember.computed("inputVal", "options.[]", function() {
      var inputVal = this.get("inputVal") || "";
      var list = this.get("options").filter(function(item) {
          return item.get("code").toLowerCase().indexOf(inputVal.toLowerCase()) > -1;
      });
      return Ember.A(list);
  }),
  optionsToMatch: Ember.computed("options.[]", function() {
      var caseInsensitiveOptions = [];
      this.get("options").forEach(function(item) {
          var value = item.get("code");
          caseInsensitiveOptions.push(value);
          caseInsensitiveOptions.push(value.toLowerCase());
      });
      return caseInsensitiveOptions;
  })
});
