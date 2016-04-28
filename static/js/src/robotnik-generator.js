export default {
  init: init
};

function init() {

  Blockly.JavaScript['console_log'] = function(block) {
    return "console.log('" + block.getFieldValue('TEXT') + "');\n";
  }

  Blockly.JavaScript['while_button'] = function(block) {

    var controller_button = block.getFieldValue('BUTTON'),
      code = Blockly.JavaScript.statementToCode(block, 'DO'),
      otherwise = Blockly.JavaScript.statementToCode(block, 'OTHERWISE'),
      generated = '';

    if ( code )
      generated = generated + "controller.on('" + controller_button + "', function() {\n" + code + "})\n";

    if ( otherwise )
      generated = generated + "controller.off('" + controller_button + "', function() {\n" + otherwise + "})\n";

    return generated;
  }


/**  Blockly.JavaScript['motor_on'] = function(block) {
    var motor = block.getFieldValue('MOTOR'),
      direction = block.getFieldValue('DIRECTION');
    return motor + '.' + direction + "();\n";
  }**/

  Blockly.JavaScript['if_distance'] = function(block) {
    return 'distance';
  }
}
