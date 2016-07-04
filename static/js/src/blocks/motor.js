import _ from 'lodash';

// used to hold context of servos for when blocks is used.
var motorSelector = [];

var motorMethods = [
    ['turns clockwise ↻', 'forward'],
    ['turns counter clockwise ↺', 'reverse'],
    ['stops', 'stop'],
];

var mutatorStateFields = {
    "forward": [ "motorspeed" ],
    "reverse": [ "motorspeed" ],
};

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
                this.setColour(65);
                this.appendDummyInput()
                    .appendField('The')
                    .appendField(new Blockly.FieldDropdown(motorSelector), 'motorobject')
                    .appendField(new Blockly.FieldDropdown(motorMethods), 'motorstate')
                this.setInputsInline(true);
                this.setTooltip("Control a DC motor");
                this.setNextStatement(true);
                this.setPreviousStatement(true);
            },
            mutationToDom: function() {
                var container = document.createElement('mutation');
                var motorstate = this.getFieldValue('motorstate');
                container.setAttribute('motorstate', motorstate);

                // check if there's special fields we need to save based
                // on the state.
                if (mutatorStateFields[motorstate]) {
                    mutatorStateFields[motorstate].forEach(field => {
                        container.setAttribute(field, this.getFieldValue(field));
                    });
                }

                return container;
            },
            domToMutation: function(xmlElement) {
                // restore the state of the block.
                // Determine state which will determine the other fields
                // you'll get and then build the object.
                let options = {};
                options.state = xmlElement.getAttribute('motorstate');
                if (mutatorStateFields[options.state]) {
                    mutatorStateFields[options.state].forEach(field => {
                        options[field] = xmlElement.getAttribute(field);
                    });
                }

                this.shapechange_(options);
            },
            onchange: function(e) {
                this.shapechange_();
            },
            shapechange_: function(options) {
                // change the structure of the block depending on the type
                // of method being called.

                let opts = options || {};
                let state = opts.state || this.getFieldValue('motorstate');

                // update block with speed values if needed.
                if (state == "forward" || state == "reverse") {
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
                        // add the speed items to the block
                        this.setInputsInline(false);
                        this.appendDummyInput("motorspeedcontainer")
                            .appendField('and set the motor\'s speed to')
                            .appendField(new Blockly.FieldTextInput('200'), 'motorspeed')
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


