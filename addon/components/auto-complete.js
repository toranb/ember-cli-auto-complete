import Ember from "ember";
import KeyCodes from "../utilities/key-codes";
const { get, set } = Ember;

var focusOutEvent;

const VISIBLE = "visible";
const HIDDEN = "hidden";

export default Ember.Component.extend({
  _keepHighlightInView(event) {
    let highlighted = this.$(".tt-cursor")[0];
    if (highlighted) {
      if (KeyCodes.keyPressed(event) === "downArrow") {
        highlighted.scrollIntoView(false);
      } else if (KeyCodes.keyPressed(event) === "upArrow") {
        highlighted.scrollIntoView();
      }
    }
  },
  _getNewHighlightIndex(direction, index, length) {
    if (direction === "down" && index < length - 1) {
      return index + 1;
    } else if (direction === "up" && index > 0) {
      return index - 1;
    }
    return index;
  },
  layoutName: "components/auto-complete",
  highlightIndex: -1,
  visibility: HIDDEN,
  hideWhenNoSuggestions: false,
  inputClass: "",
  inputClazz: Ember.computed(function () {
    return "typeahead text-input " + this.get("inputClass");
  }),
  suggestions: [],
  optionsToMatch() {
    return this.get("options");
  },
  keyUp(event) {
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
    this._keepHighlightInView(event);
  },
  focusIn() {
    if (this.get("visibility") === HIDDEN) {
      this.setVisible();
    }
  },
  focusOut() {
    clearTimeout(focusOutEvent);
    focusOutEvent = Ember.run.later(this, () => {
      if (this.isDestroyed) {
        return;
      }
      this.set("visibility", HIDDEN);
      if (!this.get("selectedFromList") && !this.hasInputMatchingSuggestion()) {
        this.set("inputVal", "");
        this.set("selectedValue", "");
      }
    }, 200);
  },
  keyDown(event) {
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

  onInput: Ember.observer("selectedValue", function() {
    let options = this.get("options");
    let input = this.getWithDefault("selectedValue", "");
    this.set("suggestions", this.determineSuggestions(options, input));
  }),

  highlight(direction) {
    let length = this.get("suggestions").length;
    let currentHighlight = this.get("highlightIndex");
    let nextHighlight = this._getNewHighlightIndex(direction, currentHighlight, length);

    if (currentHighlight >= 0) {
      let suggestion = this.get("suggestions").objectAt(currentHighlight);
      set(suggestion, "highlight", false);
    }

    let newSelectedItem = this.get("suggestions").objectAt(nextHighlight);
    set(newSelectedItem, "highlight", true);
    this.set("selectableSuggestion", newSelectedItem);
    this.set("highlightIndex", nextHighlight);
  },
  hasInputMatchingSuggestion() {
    let suggestions = this.get("suggestions");
    let input = this.getWithDefault("selectedValue", "").toLowerCase();

    if (suggestions.length !== 1) { return false; }

    return input === get(suggestions[0], this.get("valueProperty")).toLowerCase();
  },
  setVisible(){
    let visible =  !this.get("hideWhenNoSuggestions") || this.get("suggestions").length > 0;
    this.set("visibility", (visible ? VISIBLE : HIDDEN));
  },
  actions: {
    selectItem(item) {
      let valueProperty = this.get("valueProperty");
      this.set("selectedFromList", true);
      this.set("selectedValue", get(item, valueProperty));
      this.sendAction("selectItem", item);
    }
  }
});
