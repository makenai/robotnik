export default {
  init: init
};

function init() {

    Blockly.JavaScript['console_log_value'] = function(block) {
        var genCode = Blockly.JavaScript.valueToCode(block, 'consolevalue') || '\'\'';

        return "console.log(" + genCode + ");\n";
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

    Blockly.JavaScript['if_distance'] = function(block) {
        return 'distance';
    }
}
