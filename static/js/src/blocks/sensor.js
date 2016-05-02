import _ from 'lodash';

// used to hold context of servos for when blocks is used.
var componentSelector = [];

var sensorEvents = [
    ['sensor changes', 'change'],
    ['sensor data arrives', 'data'],
];

export default function sensor(opts) {
    // initialises the motor object

    this.components = opts.components || null;

    // used to add the returned block definitions to the right categories
    this.categories = {
        "value": "value",
        "sensor": "sensor",
    };

    // this is for the dropdown selector.
    componentSelector = []; // clear it out between refreshes
    this.components.forEach(sensor => {
        componentSelector.push([
            sensor.name,
            sensor.name
        ]);
    });

};

sensor.prototype.blocks = function() {
    return {
        sensor: {
            init: function() {
                this.setColour(60);
                this.appendDummyInput()
                    .appendField('When the')
                    .appendField(new Blockly.FieldDropdown(componentSelector), 'sensorobject')
                    .appendField(new Blockly.FieldDropdown(sensorEvents), 'sensorevent')
                this.appendStatementInput('sensorDO');
                this.setInputsInline(true);
                this.setTooltip("Add a generic sensor that can take action on values");
                this.setNextStatement(false);
                this.setPreviousStatement(true);
            },
            onchange: function(e) {
            },
        },
        value: {
            // used for the value of this sensor
            init: function() {
                this.setColour(60);
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(componentSelector), 'sensorvalueobject')
                    .appendField('Sensor Reading');
                this.setOutput(true, 'Number');
                this.setInputsInline(true);
                this.setTooltip("get the value of a sensor");
                this.setNextStatement(false);
                this.setPreviousStatement(false);
            },
            onchange: function(e) {
            },
        },

    };

};

sensor.prototype.generators = function() {
    var sensor_generator = function(block) {

        var selectedComponent = block.getFieldValue('sensorobject');
        var sensorEvent = block.getFieldValue('sensorevent');
        var internalCode = Blockly.JavaScript.statementToCode(block, 'sensorDO');

        var generatedCode = "";
        generatedCode = selectedComponent + ".on('" + sensorEvent + "', function() {\n" + internalCode + "});\n";

        return generatedCode;
    };

    var value_generator = function(block) {
        var selectedComponent = block.getFieldValue('sensorvalueobject');
        var generatedCode = selectedComponent + '.value';
        return [generatedCode, Blockly.JavaScript.ORDER_ATOMIC];
    };


    return {
        sensor: sensor_generator,
        value: value_generator,
    };
};

