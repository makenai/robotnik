export default {
  init: init
};

function init() {

    Blockly.Blocks['console_log_value'] = {
        init: function() {
            this.setColour(320);
            this.appendValueInput("consolevalue")
                .appendField('console.log');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };

    Blockly.Blocks['while_button'] = {
        init: function() {
            this.setColour(180);
            this.appendDummyInput()
                .appendField('while')
                .appendField(new Blockly.FieldDropdown([
                            ['red', 'red'],
                            ['green', 'green'],
                            ['up', 'up'],
                            ['down', 'down'],
                            ['left', 'left'],
                            ['right', 'right']
                ]), 'BUTTON')
                .appendField('button is pressed');
            this.appendStatementInput('DO');
            this.appendDummyInput()
                .appendField('otherwise');
            this.appendStatementInput('OTHERWISE');
        }
    };

    Blockly.Blocks['if_distance'] = {
        init: function() {
            this.setColour(280);
            this.appendDummyInput()
                .appendField('when')
                .appendField(new Blockly.FieldTextInput('15'), 'DISTANCE')
                .appendField('cm away');
            this.appendStatementInput('DO');
            this.appendDummyInput()
                .appendField('otherwise');
            this.appendStatementInput('OTHERWISE');
        }
    };
}
