import _ from 'lodash';

// used to hold context of servos for when blocks is used.
var motorSelector = [];

var motorMethods = [
    ['turns clockwise ↻', 'forward'],
    ['turns counter clockwise ↺', 'reverse'],
    ['stops', 'stop'],
];


export default function motor(opts) {
    // initialises the motor object

    this.components = opts.components || null;

    // used to add the returned block definitions to the right categories
    this.categories = {
        "motor": "actuator",
    };
    // this is for the dropdown selector.
    motorSelector = []; // reset between exercises.
    this.components.forEach(motor => {
        motorSelector.push([
            motor.name,
            motor.name
        ]);
    });
};

motor.prototype.blocks = function() {
    return {
        motor: {
            init: function() {
                this.setColour(60);
                this.appendDummyInput()
                    .appendField('The')
                    .appendField(new Blockly.FieldDropdown(motorSelector), 'motorobject')
                    .appendField(new Blockly.FieldDropdown(motorMethods), 'motorstate')
                this.setInputsInline(true);
                this.setTooltip("Control a DC motor");
                this.setNextStatement(true);
                this.setPreviousStatement(true);
            },
            onchange: function(e) {
                // this happens when the interface changes.

                // update block with speed values if needed.
                if (this.getFieldValue('motorstate') == "forward" ||
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
                            .appendField(new Blockly.FieldTextInput('150'), 'motorspeed')
                    } else {
                        // item already exists so do some range checks
                        let speed = parseInt(this.getFieldValue('motorspeed'));
                        if (speed > 255 || speed < 0) {
                            this.setWarningText("Speed must be between 0-255 (255 is full speed)");
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
                }
            },
        },
    };

};

motor.prototype.generators = function() {
    var generator = function(block) {

        var selectedMotor = block.getFieldValue('motorobject');
        var motorState = block.getFieldValue('motorstate');
        var speed = "";
        if (motorState == "forward" || motorState == "reverse") {
            speed = block.getFieldValue('motorspeed');
        }
        return selectedMotor + '.' + motorState + '(' + speed + ');\n';
    }

    return {
        motor: generator,
    };
};


