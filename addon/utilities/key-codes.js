var keyCodeList = [
  {key: "tab", code: 9},
  {key: "enter", code: 13, escaped: true},
  {key: "escape", code: 27},
  {key: "upArrow", code: 38, escaped: true},
  {key: "downArrow", code: 40, escaped: true}
];

export default {
  isEscapedCode: function (event) {
    var escapedCodes = keyCodeList.map(function (keyCode) {
      return keyCode.escaped;
    });
    return escapedCodes.indexOf(event.keyCode) === -1;
  },
  keyPressed: function (event) {
    return keyCodeList.filter(function (keyCode) {
      return keyCode.code === event.keyCode;
    }).map(function (keyCode) {
      return keyCode.key;
    })[0];
  }
};
