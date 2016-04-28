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

    // this is for the dropdown selector.
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
            },
        },
    };

};

motor.prototype.generators = function() {
    var generator = function(block) {

        var selectedMotor = block.getFieldValue('motorobject');
        var motorState = block.getFieldValue('motorstate');
        return selectedMotor + '.' + motorState + '();\n';
    }

    return {
        motor: generator,
    };
};


