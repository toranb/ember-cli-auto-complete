/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
    name: 'ember-cli-auto-complete',
    included: function(app) {
        app.import(path.join('vendor', 'auto-complete.css'));
    }
};
