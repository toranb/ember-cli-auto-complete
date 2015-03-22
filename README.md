# ember-cli-auto-complete

[![Build Status][]](https://travis-ci.org/toranb/ember-cli-auto-complete)

## Description

[ember-cli][] addon that provides type-ahead selection for text inputs

## Installation

```
npm install ember-cli-auto-complete --save-dev
```

## How to use this component

First add a custom component that extends AutoComplete. In this component you need to add 2 computed properties and 1 string variable.

```
1) suggestions:    this computed will determine how the list of options is filtered as the user enters text
2) optionsToMatch: this computed will determine if the value entered is valid (when the user omits to click/enter/tab the selection)
3) valueProperty:  this string should be the value property for the options passed in (think selectbox value/label)
```

```js
import AutoComplete from "ember-cli-auto-complete/components/auto-complete";

export default AutoComplete.extend({
  valueProperty: "code",
  suggestions: function() {
      var inputVal = this.get("inputVal") || "";
      return this.get("options").filter(function(item) {
          return item.get("code").toLowerCase().indexOf(inputVal.toLowerCase()) > -1;
      });
  }.property("inputVal", "options.@each"),
  optionsToMatch: function() {
      var caseInsensitiveOptions = [];
      this.get("options").forEach(function(item) {
          var value = item.get("code");
          caseInsensitiveOptions.push(value);
          caseInsensitiveOptions.push(value.toLowerCase());
      });
      return caseInsensitiveOptions;
  }.property("options.@each")
});
```

Next add the component to your template including a block with html for the options (requires ember 1.11)

```js
{{#my-auto-complete options=codes inputClass="foobar" selectedValue=model.code placeHolderText="Find a thing" noMesssagePlaceHolderText="No things are found" as |result|}}
  <p><b>{{result.code}}</b>{{result.text}}</p>
{{/my-auto-complete}}
```

Finally prepare a list of options for the component in the route or controller

```js
var Foo = Ember.Object.extend({});
var Bar = Ember.Object.extend({code: ""});

export default Ember.Route.extend({
    model: function() {
        var codes = [];
        codes.pushObject(Foo.create({code: "ABC", text: "SOMETHING 1"}));
        codes.pushObject(Foo.create({code: "ABCD", text: "SOMETHING 2"}));
        codes.pushObject(Foo.create({code: "ABCDE", text: "SOMETHING 3"}));
        return Ember.RSVP.hash({
            model: Bar.create(),
            codes: codes
        });
    },
    setupController: function(controller, hash) {
        controller.set("model", hash.model);
        controller.set("codes", hash.codes);
    }
});
```

## Running the unit tests

    npm install
    bower install
    ember test

## Example project built in

```
1) npm install
2) bower install
3) ember server
4) localhost:4200
```

## Credits

First I'd like to thank [Nick Christus] for the design work that made this great component happen to begin with. Next I'd like to thank [Charlie] for his amazing project [ember-cli-suggest] as this project truly represents a fork of his work.

## License

Copyright © 2015 Toran Billups http://toranbillups.com

Licensed under the MIT License


[Build Status]: https://travis-ci.org/toranb/ember-cli-auto-complete.svg?branch=master
[ember-cli]: http://www.ember-cli.com/
[ember.js]: http://emberjs.com/
[Nick Christus]: https://github.com/nchristus
[Charlie]: https://github.com/klclee
[ember-cli-suggest]: https://github.com/klclee/ember-cli-suggest
