Blockly.JavaScript['led_on'] = function(block) {
  return 'led.on();';
}

Blockly.JavaScript['while_button'] = function(block) {

  var code = Blockly.JavaScript.statementToCode(block, 'DO');

  console.log( code );

  return '// while';
}

Blockly.JavaScript['motor_on'] = function(block) {
  var motor = block.getFieldValue('MOTOR'),
    direction = block.getFieldValue('DIRECTION');
  return motor + '.' + direction + '()';
}

Blockly.JavaScript['if_distance'] = function(block) {
  return 'distance';
}