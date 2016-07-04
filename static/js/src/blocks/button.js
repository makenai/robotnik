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

    // used to add the returned block definitions to the right categories
    this.categories = {
        "button": "sensor",
    };
    // this is for the dropdown selector.
    buttonSelector = []; // reset this between exercises
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
                this.setColour(260);
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

