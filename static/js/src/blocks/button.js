import _ from 'lodash';

// used to hold context of servos for when blocks is used.
var buttonSelector = [];

var buttonEvents = [
    ['is pressed', 'down'],
    ['is released', 'up'],
    ['is held', 'held'],
];


export default function button(opts) {
    // initialises the motor object

    this.components = opts.components || null;

    // this is for the dropdown selector.
    this.components.forEach(button => {
        buttonSelector.push([
            button.name,
            button.name
        ]);
    });
};

button.prototype.blocks = function() {
    return {
        button: {
            init: function() {
                this.setColour(60);
                this.appendDummyInput()
                    .appendField('When the')
                    .appendField(new Blockly.FieldDropdown(buttonSelector), 'buttonobject')
                    .appendField(new Blockly.FieldDropdown(buttonEvents), 'buttonevent')
                this.appendStatementInput('buttonDO');
                this.setInputsInline(true);
                this.setTooltip("Press a button and do something");
                this.setNextStatement(false);
                this.setPreviousStatement(true);
            },
            onchange: function(e) {
                // this happens when the interface changes.

                // update block with speed values if needed.
                /**if (this.getFieldValue('motorstate') == "forward" ||
                        this.getFieldValue('motorstate') == "reverse") {
                    // use the input list to determine how many controllable
                    // inputs there are. 1 means it's just the dropdown
                    // 2 or more means there are other fields added.
                    let addinput = false;
                    if (this.inputList.length > 1) {
                        if (this.inputList[1].name != "motorspeedcontainer") {
                            this.removeInput(this.inputList[1].name);
                            addinput = true;
                        }
                    } else {
                        addinput = true;
                    }

                    if (addinput) {
                        // add the blink items to the block
                        this.appendDummyInput("motorspeedcontainer")
                            .appendField('and set speed to')
                            .appendField(new Blockly.FieldTextInput('1'), 'motorspeed')
                    } else {
                        // item already exists so do some range checks
                        let speed = parseFloat(this.getFieldValue('motorspeed'));
                        if (speed > 1 || speed < 0) {
                            this.setWarningText("Speed must be between 0-1 (1 is full speed)");
                        } else if (isNaN(speed)) {
                            this.setWarningText("Speed value needs to be a number");
                        } else {
                            this.setWarningText(null);
                        }
                    }
                } else {
                    if (this.inputList.length > 1) {
                        // remove the conainer items we've previously added.
                        this.removeInput(this.inputList[1].name);
                    }
                }**/
            },
        },
    };

};

button.prototype.generators = function() {
    var generator = function(block) {

        var selectedButton = block.getFieldValue('buttonobject');
        var buttonEvent = block.getFieldValue('buttonevent');
        var internalCode = Blockly.JavaScript.statementToCode(block, 'buttonDO');

        var generatedCode = "";
        generatedCode = selectedButton + ".on('" + buttonEvent + "', function() {\n" + internalCode + "})\n";

        return generatedCode;
    }

    return {
        button: generator,
    };
};

