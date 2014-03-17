Blockly.Blocks['led_on'] = {
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendField('turn LED on');
    this.setNextStatement(true);
    this.setPreviousStatement(true);    
  }
};

Blockly.Blocks['motor_on'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField('turn')
        .appendField(new Blockly.FieldDropdown([
          ['left', 'left'],
          ['right', 'right']
        ]), 'MOTOR')
        .appendField('motor')
        .appendField(new Blockly.FieldDropdown([
          ['clockwise', 'cw'],
          ['counter-clockwise', 'ccw'],
          ['stop', 'stop']
        ]), 'DIRECTION');
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
  }
};

