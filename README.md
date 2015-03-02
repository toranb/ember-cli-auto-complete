# ember-cli-auto-complete

[![Build Status][]](https://travis-ci.org/toranb/ember-cli-auto-complete)

## Description

[ember-cli][] addon that provides type-ahead selection for text inputs

## Installation

```
npm install ember-cli-auto-complete --save-dev
```

## How to use this component

First add a custom component that extends the AutoComplete component. In this component you will need to declare 2 computed properties.

```
1) the suggestions computed that will let you define a filter function
2) the options that are available for the end user
```

```js
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
```

Next prepare a list of options for the component with both a value and label property

```js
export default Ember.Route.extend({
    model: function() {
        var options = [];
        options.pushObject(Foo.create({value: "ABC", label: "SOMETHING 1"}));
        options.pushObject(Foo.create({value: "ABCD", label: "SOMETHING 2"}));
        options.pushObject(Foo.create({value: "ABCDE", label: "SOMETHING 3"}));
        return Ember.RSVP.hash({
            model: Bar.create(),
            options: options
        });
    },
    setupController: function(controller, hash) {
        controller.set("model", hash.model);
        controller.set("options", hash.options);
    }
});
```

Now add the html to your template for the custom component you declared above.

```js
{{my-auto-complete options=options selectedValue=model.code placeHolderText="Find a thing" noMesssagePlaceHolderText="No things are found" showValue=true}}
```

```
1) you must pass in options (again- value/label are the expected properties)
2) selectedValue should be model bound
3) optional placeHolderText for the input
4) optional placeHolderText for the no match message
5) if you wish to show the value in the dropdown (along side the label) set this to true
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
