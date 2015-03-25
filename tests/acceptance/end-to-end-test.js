import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: EndToEnd', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test("options are not showing by default after the component is rendered", function(assert) {
  visit("/");
  andThen(function() {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("will show the options when the input is focused and hide onblur", function(assert) {
  visit("/");
  andThen(function() {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), false);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function() {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("escape will hide the options when they are showing", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), false);
  });
  triggerEvent("input.typeahead", "keyup", { keyCode: 27 });
  andThen(function() {
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("typing into the input with a valid value and doing onblur will set value", function(assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "ABC");
  triggerEvent("input.typeahead", "keyup", { keyCode: 65 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 66 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 67 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "ABC");
  });
});

test("typing into the input with an invalid value and doing onblur will not set value", function(assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "AB");
  triggerEvent("input.typeahead", "keyup", { keyCode: 65 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 66 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "");
  });
});

test("typing into the input with a valid value and hitting enter will set value", function(assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "ABC");
  triggerEvent("input.typeahead", "keyup", { keyCode: 65 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 66 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 67 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 1);
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), false);
  });
  triggerEvent("input.typeahead", "keyup", { keyCode: 13 });
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "ABC");
  });
});

test("typing into the input with an invalid value and hitting enter will not set value and hide options", function(assert) {
  visit("/");
  click("input.typeahead");
  fillIn("input.typeahead", "AB");
  triggerEvent("input.typeahead", "keyup", { keyCode: 65 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 66 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  triggerEvent("input.typeahead", "keyup", { keyCode: 13 });
  triggerEvent("input.typeahead", "blur");
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("clicking a value from the options will set value", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  click(".tt-suggestion:eq(1)");
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "ABD");
  });
});

test("selecting an item bubbles up select action", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  click(".tt-suggestion:eq(1)");
  andThen(function() {
    assert.equal(find(".selection").text(), "ABD");
  });
});

test("arrow down and then the enter key will set value the correct value and hide the options", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 13 });
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "ABZ");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("arrow down and then the tab key will set value the correct value and hide the options", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 9 });
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "ABZ");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("arrow down and up will highlight the next option and unhighlight the previous", function(assert) {
  visit("/");
  click("input.typeahead");
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  andThen(function() {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class"), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class").trim(), "tt-suggestion");
  });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  andThen(function() {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class"), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class").trim(), "tt-suggestion");
  });
  triggerEvent("input.typeahead", "keydown", { keyCode: 40 });
  andThen(function() {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class"), "tt-suggestion tt-cursor");
  });
  triggerEvent("input.typeahead", "keydown", { keyCode: 38 });
  andThen(function() {
    assert.equal(find(".tt-suggestion:eq(0)").attr("class").trim(), "tt-suggestion");
    assert.equal(find(".tt-suggestion:eq(1)").attr("class"), "tt-suggestion tt-cursor");
    assert.equal(find(".tt-suggestion:eq(2)").attr("class").trim(), "tt-suggestion");
  });
});

test("typing into the input will show options matching the filter applied", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "A");
  triggerEvent("input.typeahead", "keyup", { keyCode: 65 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 4);
  });
  fillIn("input.typeahead", "AB");
  triggerEvent("input.typeahead", "keyup", { keyCode: 66 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  fillIn("input.typeahead", "ABC");
  triggerEvent("input.typeahead", "keyup", { keyCode: 67 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "ABC");
  });
});

test("typing into the input will show no matching message when filter does not match", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "X");
  triggerEvent("input.typeahead", "keyup", { keyCode: 88 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 0);
    assert.equal(find(".tt-dropdown-menu .message").text().trim(), "No things are found");
  });
});

test("typing a value that matches based on filter is set using the original/raw input value", function(assert) {
  visit("/");
  click("input.typeahead");
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 14);
  });
  fillIn("input.typeahead", "a");
  triggerEvent("input.typeahead", "keyup", { keyCode: 65 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 4);
  });
  fillIn("input.typeahead", "ab");
  triggerEvent("input.typeahead", "keyup", { keyCode: 66 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 3);
  });
  fillIn("input.typeahead", "abc");
  triggerEvent("input.typeahead", "keyup", { keyCode: 67 });
  andThen(function() {
    assert.equal(find(".tt-suggestion").length, 1);
  });
  triggerEvent("input.typeahead", "blur");
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "abc");
  });
});

test("arrow down and then the enter key will set value using the original/raw input value and hide options", function(assert) {
  visit("/");
  fillIn("input.typeahead", "abc");
  triggerEvent("input.typeahead", "keyup", { keyCode: 65 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 66 });
  triggerEvent("input.typeahead", "keyup", { keyCode: 67 });
  triggerEvent("input.typeahead", "keydown", { keyCode: 13 });
  andThen(function() {
    assert.equal(find("input.typeahead").val(), "abc");
    assert.equal(find(".tt-dropdown-menu").is(":hidden"), true);
  });
});

test("the input class will have typeahead and text-input along with configured class name", function(assert) {
  visit("/");
  andThen(function() {
    var input = find("input");
    assert.ok(input.hasClass("typeahead"));
    assert.ok(input.hasClass("text-input"));
    assert.ok(input.hasClass("my-fun-input-thing"));
    assert.ok(input.hasClass("andTwo"));
  });
});
