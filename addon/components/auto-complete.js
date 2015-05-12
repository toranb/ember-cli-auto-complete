import Ember from "ember";

var htmlSafe = Ember.String.htmlSafe;
var focusOutEvent;

export default Ember.Component.extend({
  layoutName: "components/auto-complete",
  hightlightIndex: -1,
  escapedChars: [40, 38, 13],
  visibility: "display:none;",
  inputClass: '',
  inputClazz: Ember.computed(function() {
    return "typeahead text-input " + this.get('inputClass');
  }),
  keyUp: function(event){
    if(event.keyCode === 27) {
        this.set("visibility", htmlSafe("display:none;"));
    }else if(this.escapedChars.indexOf(event.keyCode) === -1){
        this.set("visibility", htmlSafe("display:block;"));
        this.set("inputVal", Ember.$(event.target).val());
    }
  },
  focusIn: function(){
      if( this.get("visibility") === "display:none;"){
        this.set("visibility", htmlSafe("display:block;"));
      }
  },
  focusOut: function(){
    clearTimeout(focusOutEvent);
    var self = this;
    var func = function(){
        if(self.isDestroyed) {
            return;
        }
        self.set("visibility", "display:none;");
        if(!self.get("selectedFromList")) {
            var value = this.get("selectedValue");
            var optionsToMatch = this.get("optionsToMatch");
            if (optionsToMatch.indexOf(value) === -1) {
                self.set("inputVal", "");
                self.set("selectedValue", "");
            }
        }
    };
    focusOutEvent = Ember.run.later(this, func, 200);
  },
  keyDown: function(event){
      if(this.get("visibility") !== "display:none;"){
          if (event.keyCode === 40){
            this.highlight("down");
          }else if (event.keyCode === 38){
            this.highlight("up");
          }else if(event.keyCode === 13 || event.keyCode === 9){
            if(!Ember.isBlank(this.selectableSuggestion)){
              this.send("selectItem", this.selectableSuggestion);
              this.set("visibility", htmlSafe("display:none;"));
            }else{
                var value = this.get("selectedValue");
                var optionsToMatch = this.get("optionsToMatch");
                if (optionsToMatch.indexOf(value) >= 0) {
                  this.set("selectedFromList", true);
                  this.set("visibility", htmlSafe("display:none;"));
                }
            }
          }
      }else{
        this.set("visibility", htmlSafe("display:block;"));
      }
  },
  highlight: function(direction) {
    var newHighlightIndex = -1;
    if(direction === "down"){
      newHighlightIndex = this.hightlightIndex + 1;
    }else if( this.hightlightIndex > 0){
      newHighlightIndex = this.hightlightIndex - 1;
    }
    if(newHighlightIndex < this.get("suggestions").length) {
      if(this.hightlightIndex > -1){
        var currentResult = this.get("suggestions").objectAt(this.hightlightIndex);
        currentResult.set("highlight", false);
      }
      this.set("hightlightIndex", newHighlightIndex);
      if(this.hightlightIndex > -1){
        var nextResult = this.get("suggestions").objectAt(this.hightlightIndex);
        nextResult.set("highlight", true);
        this.set("selectableSuggestion", nextResult);
      }
    }
  },
  actions: {
    selectItem: function(item){
      var valueProperty = this.get("valueProperty");
      this.set("selectedFromList", true);
      this.set("selectedValue", item.get(valueProperty));

      this.sendAction('selectItem', item);
    }
  }
});
