// used to hold context of LEDs for when blocks is used.
var componentSelector = [];

var ledMethods = [
        ['colour is', 'color'],
        ['turns on', 'on'],
        ['turns off', 'off'],
        ['toggles', 'toggle'],
        ['blinks', 'strobe'],
        ['intensity gets set to', 'intensity'],
        ['stops', 'stop'],
];

export default function ledrgb(opts) {
    // initialises the LED object

    this.components = opts.components || null;

    // used to add the returned block definitions to the right categories
    this.categories = {
        "ledrgb": "actuator",
    };
    // this is for the dropdown selector.
    componentSelector = [];
    this.components.forEach(led => {
        componentSelector.push([
            led.name,
            led.name
        ]);
    });
};

ledrgb.prototype.blocks = function() {
    return  {
        ledrgb: {
            init: function() {
                this.setColour(120);
                this.appendDummyInput()
                    .appendField('The RGB LED')
                .appendField(new Blockly.FieldDropdown(componentSelector), 'component')
                    .appendField(new Blockly.FieldDropdown(ledMethods), 'ledstate');
                this.setInputsInline(true);
                this.setTooltip("Control an LED");
                this.setNextStatement(true);
                this.setPreviousStatement(true);
            },
            onchange: function(e) {
                // this happens when the interface changes.
                if (this.getFieldValue('ledstate') == "strobe") {
                    // use the input list to determine how many controllable
                    // inputs there are. 1 means it's just the dropdown
                    // 2 or more means there are other fields added.
                    let addinput = false;
                    if (this.inputList.length > 1) {
                        if (this.inputList[1].name != "ledstrobecontainer") {
                            this.removeInput(this.inputList[1].name);
                            addinput = true;
                        }
                    } else {
                        addinput = true;
                    }

                    if (addinput) {
                        // add the blink items to the block
                        this.appendDummyInput("ledstrobecontainer")
                            .appendField('every')
                            .appendField(new Blockly.FieldTextInput('1000'), 'ledstrobespeed')
                            .appendField('milliseconds');
                    }

                } else if (this.getFieldValue('ledstate') == "intensity") {
                    // add the fields for setting the intensity value.
                    let addinput = false;

                    if (this.inputList.length > 1) {
                        // we need to remove items first
                        if (this.inputList[1].name != "ledintensitycontainer") {
                            this.removeInput(this.inputList[1].name);
                            addinput = true;
                        }
                    } else {
                        addinput = true;
                    }

                    // now add the input but only if we need to.
                    if (addinput) {
                        this.appendDummyInput("ledintensitycontainer")
                            .appendField("to")
                            .appendField(new Blockly.FieldTextInput('100'), 'ledintensitylevel')
                            .appendField("%");
                    }

                } else if (this.getFieldValue('ledstate') == "color") {
                    // add the fields for setting the color value.
                    let addinput = false;

                    if (this.inputList.length > 1) {
                        // we need to remove items first
                        if (this.inputList[1].name != "ledcolorcontainer") {
                            this.removeInput(this.inputList[1].name);
                            addinput = true;
                        }
                    } else {
                        addinput = true;
                    }

                    // now add the input but only if we need to.
                    if (addinput) {
                        this.appendDummyInput("ledcolorcontainer")
                            .appendField("to")
                            .appendField(new Blockly.FieldColour('#ff0000'), 'ledcolor');
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

ledrgb.prototype.generators = function() {
    var generator = function(block) {

        console.log(block);
        var selectedComponent = block.getFieldValue('component');
        var ledstate = block.getFieldValue('ledstate');

        if (ledstate === "strobe") {
            return selectedComponent + '.strobe(' + block.getFieldValue('ledstrobespeed') + ');\n';
        } else if (ledstate === "intensity") {
            return selectedComponent + '.intensity(' + block.getFieldValue('ledintensitylevel') + ');\n';
        } else if (ledstate === "color") {
            return selectedComponent + '.color("' + block.getFieldValue('ledcolor') + '");\n';
        } else {
            return selectedComponent + '.' + ledstate + '();\n';
        }
    }

    return {
        ledrgb: generator,
    };
};


