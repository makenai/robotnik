Blockly.Blocks['led_on'] = {
  // Numeric value.
  init: function() {
    this.setHelpUrl("http://google.com");
    this.setColour(120);
    this.appendDummyInput()
        .appendField('turn LED on');
    this.setTooltip("Turn the LED on");
    this.setNextStatement(true);
    this.setPreviousStatement(true);    
  }
};

Blockly.Blocks['led_off'] = {
  // Numeric value.
  init: function() {
    this.setHelpUrl("http://google.com");
    this.setColour(360);
    this.appendDummyInput()
        .appendField('turn LED off');
    this.setTooltip("Turn the LED off");
    this.setNextStatement(true);
    this.setPreviousStatement(true);
  }
};

Blockly.Blocks['blink_led'] = {
  // Numeric value.
  init: function() {
    this.setHelpUrl("http://google.com");
    this.setColour(230);
    this.appendDummyInput()
        .appendField('Blink LED for')
        .appendField(new Blockly.FieldTextInput('500', Blockly.FieldTextInput.numberValidator), 'NUM')
        .appendField('ms every')
        .appendField(new Blockly.FieldTextInput('100', Blockly.FieldTextInput.numberValidator), 'NUM')
        .appendField('ms.');
    this.setOutput(true, 'Number');
    this.setTooltip("Blink a LED on and off for a specified amount of time");
  }
};

Blockly.Blocks['while_button'] = {
  // Numeric value.
  init: function() {
    this.setHelpUrl("http://google.com");
    this.setColour(180);
    this.appendDummyInput()
        .appendField('while')
        .appendField(new Blockly.FieldDropdown([['red', 'RED'], ['blue', 'BLUE']]))
        .appendField('button is pressed');
    this.appendStatementInput('DO')
      .appendField('do');
    this.setOutput(true, 'Number');
    this.setTooltip("Turn the LED off");
  }
};
