'use strict';

function code(commands, blockly) {
  return { generate, execute };

  function execute(code) {
    commands.send('code', code ? code : generate());
  }

  function generate() {
    var generated = blockly.code();

    var code = `
var five = require('johnny-five'),
  board = new five.Board(),
  button = require('robotnik-controls');

board.on("ready", function() {

  var led = new five.Led(13),
    left = new five.Servo({ pin:  7, type: 'continuous' }).stop(),
    right = new five.Servo({ pin: 11, type: 'continuous' }).stop(),
    sensor = new five.Sensor('A0');

    ${generated}
});`;
    return jsBeautify(code, {});
  }
}

export default code;
