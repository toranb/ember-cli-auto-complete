import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

const BACKSPACE = {keyCode: 8};
const TAB = {keyCode: 9};
const ENTER = {keyCode: 13};
const ESCAPE = {keyCode: 27};
const UP_ARROW = {keyCode: 38};
const DOWN_ARROW = {keyCode: 40};
const LETTER_A = {keyCode: 65};
const LETTER_B = {keyCode: 66};
const LETTER_C = {keyCode: 67};
const LETTER_N = {keyCode: 78};
const LETTER_X = {keyCode: 88};
const LETTER_Z = {keyCode: 90};

module('Acceptance: EndToEnd', {
  beforeEach: function () {
    application = startApp();
  },
  afterEach: function () {
    Ember.run(application, 'destroy');
  }
});

test("options are not showing by default after the component is rendered", function (assert) {
  visit("/");
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("will show the options when the input is focused and hide onblur", function (assert) {
  visit("/");
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), false);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("escape will hide the options when they are showing", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), false);
  });
  triggerEvent("input.typeahead", "keyup", ESCAPE);
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("typing into the input with a valid value and doing onblur will set value", function (assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "ABC");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  triggerEvent("input.typeahead", "keyup", LETTER_C);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "ABC");
  });
});

test("typing into the input with a valid value in lowercase and doing onblur will set value", function (assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "Abc");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  triggerEvent("input.typeahead", "keyup", LETTER_C);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "Abc");
  });
});

test("typing into the input with an invalid value and doing onblur will not set value", function (assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "AB");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "");
  });
});

test("typing into the input with a valid value and hitting enter will set value", function (assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "ABC");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  triggerEvent("input.typeahead", "keyup", LETTER_C);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 1);
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), false);
  });
  triggerEvent("input.typeahead", "keyup", ENTER);
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "ABC");
  });
});

test("typing into the input with an invalid value and hitting enter will not set value and hide options", function (assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "AB");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  triggerEvent("input.typeahead", "keyup", ENTER);
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("clicking a value from the options will set value", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  click(".tt-suggestion:eq(1)");
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "ABD");
  });
});

test("selecting an item bubbles up select action", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  click(".tt-suggestion:eq(1)");
  andThen(function () {
    assert.equal(find(".selection").text(), "ABD");
  });
});

test("arrow down and then the enter key will set value the correct value and hide the options", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", ENTER);
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "ABZ");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("arrow down and then the tab key will set value the correct value and hide the options", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", TAB);
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "ABZ");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("arrow down and up will highlight the next option and unhighlight the previous", function (assert) {
  visit("/");
  click("input.typeahead");
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class"), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class").trim(), "tt-suggestion");
  });
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class"), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class").trim(), "tt-suggestion");
  });
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class"), "tt-suggestion tt-cursor");
  });
  triggerEvent("input.typeahead", "keydown", UP_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class"), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class").trim(), "tt-suggestion");
  });
});

test("typing into the input will show options matching the filter applied", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "A");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 4);
  });
  fillIn("input.typeahead", "AB");
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  fillIn("input.typeahead", "ABC");
  triggerEvent("input.typeahead", "keyup", LETTER_C);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "ABC");
  });
});

test("typing into the input will show no matching message when filter does not match", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "X");
  triggerEvent("input.typeahead", "keyup", LETTER_X);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 0);
    assert.equal(find(".tt-dropdown-menu .message").text().trim(), "No things are found");
  });
});

test("when hideWhenNoSuggestions set, drowdown is hidden when filter does not match", function (assert) {
  visit("/");
  click("#hide-when-no-suggestions");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "X");
  triggerEvent("input.typeahead", "keyup", LETTER_X);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 0);
    assert.equal(find(".tt-dropdown-menu.hidden").length, 1);
  });
});

test("typing a value that matches based on filter is set using the original/raw input value", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "a");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 4);
  });
  fillIn("input.typeahead", "ab");
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  fillIn("input.typeahead", "abc");
  triggerEvent("input.typeahead", "keyup", LETTER_C);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "abc");
  });
});

test("arrow down and then the enter key will set value using the original/raw input value and hide options", function (assert) {
  visit("/");
  fillIn("input.typeahead", "abc");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  triggerEvent("input.typeahead", "keyup", LETTER_C);
  triggerEvent("input.typeahead", "keydown", ENTER);
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "abc");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("the input class will have typeahead and text-input along with configured class name", function (assert) {
  visit("/");
  andThen(function () {
    var input = find("input");
    assert.ok(input.hasClass("typeahead"));
    assert.ok(input.hasClass("text-input"));
    assert.ok(input.hasClass("my-fun-input-thing"));
    assert.ok(input.hasClass("andTwo"));
  });
});

test("typing into the input with an invalid value and doing onblur will reset the input filter value", function (assert) {
  visit("/");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "AB");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  triggerEvent("input.typeahead", "blur");
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);
  });
});

test("typing in input field will reset highlights to prevent hidden highlights and defects", function (assert) {
  visit("/");

  click("input.typeahead");

  fillIn("input.typeahead", "A");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion tt-cursor");
  });

  fillIn("input.typeahead", "ABZ");
  triggerEvent("input.typeahead", "keyup", LETTER_B);
  triggerEvent("input.typeahead", "keyup", LETTER_Z);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion tt-cursor");
  });

  fillIn("input.typeahead", "A");
  triggerEvent("input.typeahead", "keyup", BACKSPACE);
  triggerEvent("input.typeahead", "keyup", BACKSPACE);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 4);
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(3)").attr("class").trim(), "tt-suggestion");
  });
});

test("once highlight exists in list; it can not be moved to an index out of range", function (assert) {
  visit("/");

  click("input.typeahead");

  fillIn("input.typeahead", "N");
  triggerEvent("input.typeahead", "keyup", LETTER_N);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 2);
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion");
  });
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion tt-cursor");
  });
  triggerEvent("input.typeahead", "keydown", UP_ARROW);
  triggerEvent("input.typeahead", "keydown", UP_ARROW);
  andThen(function () {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion");
  });
});

test("moving up and down will keep highlighted items in view", function (assert) {
  visit("/");

  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 14);

    var clientHeight = find(".tt-suggestion")[0].clientHeight;
    var parentClientHeight = find(".tt-suggestion")[0].parentElement.clientHeight;

    var timesToArrowDown = Math.ceil(parentClientHeight / clientHeight + 1);

    for (var i = 0; i < timesToArrowDown; i++) {
      triggerEvent("input.typeahead", "keydown", DOWN_ARROW);
      triggerEvent("input.typeahead", "keyup", DOWN_ARROW);
    }

    var expectedScrollTop = (clientHeight * timesToArrowDown) - parentClientHeight;
    andThen(function () {
      assert.equal(find(".tt-cursor")[0].parentElement.scrollTop, expectedScrollTop);
    });
  });
});

test("clicking out of the autocomplete will not throw null pointer exception", function (assert) {
  visit("/bar");
  click("input.typeahead");
  fillIn("input.typeahead", "AAA");
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  triggerEvent("input.typeahead", "keyup", LETTER_A);
  andThen(function () {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "keyup", ENTER);
  andThen(function () {
    assert.equal(find("input.typeahead").val(), "AAA");
  });
  click("input.typeahead");
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), false);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function () {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});
