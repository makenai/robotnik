// used to hold context of LEDs for when blocks is used.
var ledSelector = [];

var ledMethods = [
        ['turns on', 'on'],
        ['turns off', 'off'],
        ['toggles', 'toggle'],
        ['blinks', 'blink'],
        ['fades', 'fade'],
        ['stop', 'stop'],
];

export default function led(opts) {
    // initialises the LED object

    this.components = opts.components || null;

    // this is for the dropdown selector.
    this.components.forEach(led => {
        ledSelector.push([
            led.name,
            led.name
        ]);
    });
};

led.prototype.blocks = function() {
    return  {
        led: {
            init: function() {
                this.setColour(120);
                this.appendDummyInput()
                    .appendField('LED')
                    .appendField(new Blockly.FieldDropdown(ledSelector), 'ledobject')
                    .appendField(new Blockly.FieldDropdown(ledMethods), 'ledstate');
                this.setInputsInline(true);
                this.setTooltip("Control an LED");
                this.setNextStatement(true);
                this.setPreviousStatement(true);
            },
            onchange: function(e) {
                // this happens when the interface changes.
                if (this.getFieldValue('ledstate') == "blink") {
                    // use the input list to determine how many controllable
                    // inputs there are. 1 means it's just the dropdown
                    // 2 or more means there are other fields added.
                    let addinput = false;
                    if (this.inputList.length > 1) {
                        if (this.inputList[1].name != "ledblinkcontainer") {
                            this.removeInput(this.inputList[1].name);
                            addinput = true;
                        }
                    } else {
                        addinput = true;
                    }

                    if (addinput) {
                        // add the blink items to the block
                        this.appendDummyInput("ledblinkcontainer")
                            .appendField('every')
                            .appendField(new Blockly.FieldTextInput('1000'), 'ledblinkspeed')
                            .appendField('milliseconds');
                    }

                } else if (this.getFieldValue('ledstate') == "fade") {
                    // now we need to add the fields for the fade.

                    let addinput = false;

                    if (this.inputList.length > 1) {
                        // we need to remove items first
                        if (this.inputList[1].name != "ledfadecontainer") {
                            this.removeInput(this.inputList[1].name);
                            addinput = true;
                        }
                    } else {
                        addinput = true;
                    }

                    // now add the input but only if we need to.
                    if (addinput) {
                        this.appendDummyInput("ledfadecontainer")
                            .appendField("to")
                            .appendField(new Blockly.FieldTextInput('100'), 'ledfadelevel')
                            .appendField("over")
                            .appendField(new Blockly.FieldTextInput('500'), 'ledfadems')
                            .appendField("ms");
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

led.prototype.generators = function() {
    var generator = function(block) {

        var selectedLED = block.getFieldValue('ledobject');
        var ledstate = block.getFieldValue('ledstate');

        if (ledstate === "blink") {
            return selectedLED + '.blink(' + block.getFieldValue('ledblinkspeed') + ');\n';
        } else if (ledstate === "fade") {
            return selectedLED + '.fade(' + block.getFieldValue('ledfadelevel') +
                    ', ' + block.getFieldValue('ledfadems') + ');\n';
        } else {
            return selectedLED + '.' + ledstate + '();\n';
        }
    }

    return {
        led: generator,
    };
};

