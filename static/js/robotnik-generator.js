Blockly.JavaScript['led_on'] = function(block) {
  return 'led.on();';
}

Blockly.JavaScript['led_off'] = function(block) {
  return 'led.off();';
}

Blockly.JavaScript['while_button'] = function(block) {

  var button = block.getFieldValue('BUTTON'),
    code = Blockly.JavaScript.statementToCode(block, 'DO'),
    otherwise = Blockly.JavaScript.statementToCode(block, 'OTHERWISE'),
    generated = '';

  if ( code )
    generated = generated + "button.on('" + button + "', function() {\n" + code + "\n})\n";

  if ( otherwise )
    generated = generated + "button.off('" + button + "', function() {\n" + otherwise + "\n})\n";

  return generated;
}

Blockly.JavaScript['motor_on'] = function(block) {
  var motor = block.getFieldValue('MOTOR'),
    direction = block.getFieldValue('DIRECTION');
  return motor + '.' + direction + '()';
}

Blockly.JavaScript['if_distance'] = function(block) {
  return 'distance';
}