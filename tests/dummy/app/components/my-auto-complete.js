import AutoComplete from "ember-cli-auto-complete/components/auto-complete";

export default AutoComplete.extend({
  suggestions: function() {
      var inputVal = this.get("inputVal") || "";
      return this.get("options").filter(function(item) {
          return item.get("value").toLowerCase().indexOf(inputVal.toLowerCase()) > -1;
      });
  }.property("inputVal", "options.@each"),
  optionsToMatch: function() {
      var caseInsensitiveOptions = [];
      this.get("options").forEach(function(item) {
          var value = item.get("value");
          caseInsensitiveOptions.push(value);
          caseInsensitiveOptions.push(value.toLowerCase());
      });
      return caseInsensitiveOptions;
  }.property("options.@each")
});
