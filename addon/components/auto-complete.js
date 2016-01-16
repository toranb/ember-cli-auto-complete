import Ember from "ember";
import KeyCodes from '../utilities/key-codes';
const { get, set } = Ember;

var focusOutEvent;

const VISIBLE = "visible";
const HIDDEN = "hidden";

function getNewHighlightIndex(direction, index, length) {
  if (direction === "down" && index < length - 1) {
    return index + 1;
  } else if (direction === "up" && index > 0) {
    return index - 1;
  }
  return index;
}

function keepHighlightInView() {
  const highlighted = document.getElementsByClassName("tt-cursor")[0];
  if (highlighted == null) { return; }

  const parent = highlighted.parentNode;
  const needsScroll = (highlighted.offsetTop < parent.scrollTop) ||
                      (highlighted.offsetTop + highlighted.offsetHeight > parent.offsetHeight);

  if (needsScroll) {
    highlighted.parentNode.scrollTop = highlighted.offsetTop;
  }
}
export default Ember.Component.extend({
  layoutName: "components/auto-complete",
  highlightIndex: -1,
  visibility: HIDDEN,
  hideWhenNoSuggestions: false,
  inputClass: '',
  inputClazz: Ember.computed(function () {
    return "typeahead text-input " + this.get('inputClass');
  }),
  suggestions: [],
  optionsToMatch: function() {
    return this.get("options");
  },
  keyUp: function (event) {
    if (KeyCodes.keyPressed(event) === "escape") {
      this.set("visibility", HIDDEN);
    } else if (!KeyCodes.isEscapedCode(event)) {
      this.set("highlightIndex", -1);
      this.get("options").forEach(function (item) {
        set(item, "highlight", false);
      });
      this.set("inputVal", Ember.$(event.target).val());
      this.setVisible();
    }
    keepHighlightInView(event);
  },
  focusIn: function () {
    if (this.get("visibility") === HIDDEN) {
      this.setVisible();
    }
  },
  focusOut: function () {
    clearTimeout(focusOutEvent);
    var self = this;
    var func = function () {
      if (self.isDestroyed) {
        return;
      }
      self.set("visibility", HIDDEN);
      if (!self.get("selectedFromList") && !self.hasInputMatchingSuggestion()) {
        self.set("inputVal", "");
        self.set("selectedValue", "");
      }
    };
    focusOutEvent = Ember.run.later(this, func, 200);
  },
  keyDown: function (event) {
    if (this.get("visibility") !== HIDDEN) {
      if (KeyCodes.keyPressed(event) === "downArrow") {
        this.highlight("down");
      } else if (KeyCodes.keyPressed(event) === "upArrow") {
        this.highlight("up");
      } else if (KeyCodes.keyPressed(event) === "enter" || KeyCodes.keyPressed(event) === "tab") {
        if (!Ember.isBlank(this.selectableSuggestion)) {
          this.send("selectItem", this.selectableSuggestion);
          this.set("visibility", HIDDEN);
        } else if (this.hasInputMatchingSuggestion()) {
          this.set("selectedFromList", true);
          this.set("visibility", HIDDEN);
        }
      }
    } else {
      this.setVisible();
    }
  },

  onInput: Ember.observer('selectedValue', function() {
    var options = this.get("options");
    var input = this.getWithDefault("selectedValue", "");
    this.set("suggestions", this.determineSuggestions(options, input));
  }),

  highlight: function (direction) {
    var length = this.get("suggestions").length;
    var currentHighlight = this.get("highlightIndex");
    var nextHighlight = getNewHighlightIndex(direction, currentHighlight, length);

    if (currentHighlight >= 0) {
      var suggestion = this.get("suggestions").objectAt(currentHighlight);
      set(suggestion, "highlight", false);
    }

    var newSelectedItem = this.get("suggestions").objectAt(nextHighlight);
    set(newSelectedItem, "highlight", true);
    this.set("selectableSuggestion", newSelectedItem);
    this.set("highlightIndex", nextHighlight);
  },
  hasInputMatchingSuggestion: function() {
    var suggestions = this.get('suggestions');
    var input = this.getWithDefault('selectedValue', '').toLowerCase();

    if (suggestions.length !== 1) { return false; }

    return input === get(suggestions[0], this.get('valueProperty')).toLowerCase();
  },
  setVisible(){
    let visible =  !this.get('hideWhenNoSuggestions') || this.get('suggestions').length > 0;
    this.set('visibility', (visible ? VISIBLE : HIDDEN));
  },
  actions: {
    selectItem: function (item) {
      var valueProperty = this.get("valueProperty");
      this.set("selectedFromList", true);
      this.set("selectedValue", get(item, valueProperty));
      this.sendAction('selectItem', item);
    }
  }
});
