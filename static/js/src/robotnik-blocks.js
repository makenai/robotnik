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

  Blockly.Blocks['led'] = {
      init: function() {
          this.setColour(120);
          this.appendDummyInput()
            .appendField('LED')
            .appendField(new Blockly.FieldDropdown([
                        ['turns on', 'on'],
                        ['turns off', 'off'],
                        ['blinks', 'blink'],
                        ['stop', 'stop'],
            ]), 'LED');
          this.setNextStatement(true);
          this.setPreviousStatement(true);
      },
      onchange: function(e) {
          // this happens when the interface changes.
          if (this.getFieldValue('LED') == "blink") {
              // use the input list to determine how many controllable
              // inputs there are. 1 means it's just the dropdown
              // 2 or more means there are other fields added.
              if (this.inputList.length == 1) {
                  // add the blink items to the block
                  this.appendDummyInput("BLINK")
                      .appendField('every')
                      .appendField(new Blockly.FieldTextInput('1000'), 'BLINKSPEED')
                      .appendField('milliseconds');
              }
          } else {
              if (this.inputList.length > 1) {
                  // remove the blink items we've previously added.
                  this.removeInput("BLINK");
              }
          }
      },
  };

  Blockly.Blocks['motor_on'] = {
    init: function() {
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
