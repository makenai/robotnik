export default {
  init: init
};

function init() {

  Blockly.Blocks['console_log'] = {
    init: function() {
      this.setColour(320);
      this.appendDummyInput()
          .appendField('console.log')
          .appendField(new Blockly.FieldTextInput('Hello World.'), 'TEXT');
      this.setNextStatement(true);
      this.setPreviousStatement(true);
    }
  };

/**  Blockly.Blocks['servo'] = {
    init: function() {
        console.log("initialising servo block");
        console.log(this);
      this.setColour(0);
      this.appendDummyInput()
          .appendField('the')
          .appendField(new Blockly.FieldDropdown([
            ['left', 'left'],
            ['right', 'right']
          ]), 'MOTOR')
          .appendField('motor')
          .appendField(new Blockly.FieldDropdown([
            ['goes clockwise', 'cw'],
            ['goes counter-clockwise', 'ccw'],
            ['stops', 'stop']
          ]), 'DIRECTION');
      this.setNextStatement(true);
      this.setPreviousStatement(true);
    }
  };**/

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
