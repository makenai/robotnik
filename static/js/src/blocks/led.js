// used to hold context of LEDs for when blocks is used.
var ledSelector = [];

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
                    .appendField(new Blockly.FieldDropdown([
                                ['turns on', 'on'],
                                ['turns off', 'off'],
                                ['blinks', 'blink'],
                                ['stop', 'stop'],
                    ]), 'ledstate');
                this.setInputsInline(true);
                this.setNextStatement(true);
                this.setPreviousStatement(true);
            },
            onchange: function(e) {
                // this happens when the interface changes.
                if (this.getFieldValue('ledstate') == "blink") {
                    // use the input list to determine how many controllable
                    // inputs there are. 1 means it's just the dropdown
                    // 2 or more means there are other fields added.
                    if (this.inputList.length == 1) {
                        // add the blink items to the block
                        this.appendDummyInput("BLINK")
                            .appendField('every')
                            .appendField(new Blockly.FieldTextInput('1000'), 'ledblinkspeed')
                            .appendField('milliseconds');
                    }
                } else {
                    if (this.inputList.length > 1) {
                        // remove the blink items we've previously added.
                        this.removeInput("BLINK");
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
        } else {
            return selectedLED + '.' + ledstate + '();\n';
        }
    }
    return {
        led: generator,
    };
};

