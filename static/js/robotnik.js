$( document ).ready(function() {

  var preCode = [ 'var five = require("johnny-five")',
    'board = new five.Board(),',
    'led = new five.'
    'board.on("ready", function() {',
    '' ];

  var postCode = [ '', '});' ];

  $('#execute').on('click', function(e) {
    var code = Blockly.JavaScript.workspaceToCode();
    console.log( preCode.join("\n") + code + postCode.join("\n") );
  });

});