import _ from 'lodash';

// used to hold context of component for when blocks is used.
var componentSelector = [];

var temperatureEvents = [
    ['sensor changes', 'change'],
    ['sensor data arrives', 'data'],
];

var temperatureScales = [
    ['C°', 'celsius'],
    ['K°', 'kelvin'],
    ['F°', 'fahrenheit'],
];

export default function sensor(opts) {
    // initialises the motor object

    this.components = opts.components || null;

    // used to add the returned block definitions to the right categories
    this.categories = {
        "value": "value",
        "thermometer": "sensor",
    };

    // this is for the dropdown selector.
    componentSelector = []; // clear it out between refreshes
    this.components.forEach(component => {
        componentSelector.push([
            component.name,
            component.name
        ]);
    });

};

sensor.prototype.blocks = function() {
    return {
        thermometer: {
            init: function() {
                this.setColour(260);
                this.appendDummyInput()
                    .appendField('When the')
                    .appendField(new Blockly.FieldDropdown(componentSelector), 'temperatureobject')
                    .appendField(new Blockly.FieldDropdown(temperatureEvents), 'temperatureevent')
                this.appendStatementInput('temperatureDO');
                this.setInputsInline(true);
                this.setTooltip("Add a thermometer sensor that can take action on values");
                this.setNextStatement(false);
                this.setPreviousStatement(true);
            },
            onchange: function(e) {
            },
        },
        value: {
            // used for the celsius value of this sensor
            init: function() {
                this.setColour(60);
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(componentSelector), 'temperaturevalueobject')
                    .appendField('Temperature reading in')
                    .appendField(new Blockly.FieldDropdown(temperatureScales), 'temperaturevaluescale');
                this.setOutput(true, 'Number');
                this.setInputsInline(true);
                this.setTooltip("Get the temperature reading");
                this.setNextStatement(false);
                this.setPreviousStatement(false);
            },
            onchange: function(e) {
            },
        },

    };

};

sensor.prototype.generators = function() {
    var thermometer_generator = function(block) {

        var selectedComponent = block.getFieldValue('temperatureobject');
        var tempEvent = block.getFieldValue('temperatureevent');
        var internalCode = Blockly.JavaScript.statementToCode(block, 'temperatureDO');

        var generatedCode = "";
        generatedCode = selectedComponent + ".on('" + tempEvent + "', function() {\n" + internalCode + "});\n";

        return generatedCode;
    };

    var value_generator = function(block) {
        var selectedComponent = block.getFieldValue('temperaturevalueobject');
        var generatedCode = selectedComponent + '.' + block.getFieldValue('temperaturevaluescale');
        // note use of ORDER_ATOMIC here to make sure it comes back the right way
        // for use in evaluation blocks such as console.log etc.
        return [generatedCode, Blockly.JavaScript.ORDER_ATOMIC];
    };


    return {
        thermometer: thermometer_generator,
        value: value_generator,
    };
};


