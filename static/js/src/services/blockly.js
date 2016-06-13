'use strict';

import robotnikBlocks from '../robotnik-blocks.js';
import robotnikGenerator from '../robotnik-generator.js';

import button from '../blocks/button.js';
import led from '../blocks/led.js';
import motor from '../blocks/motor.js';
import sensor from '../blocks/sensor.js';
import servo from '../blocks/servo.js';

export default function(Workspaces) {

    return { init, code, serialize, reloadWorkspace, saveWorkspace };

    function init(canvas, toolbox) {


        // this now goes through all the components that are available to
        // the workshop and then adds the appropriate blocks and generators
        // to the workspace for those components.

        // go through all of the blocks in the toolbox and make sure
        // they have been added to Blockly as definitions. If not then add it.

        let categories = toolbox.categories;

        Object.keys(categories).forEach(category => {
            Object.keys(categories[category].blockdefs).forEach(blockdef => {
                if (Blockly.Blocks[blockdef] == undefined) {
                    // add it to the block list and get the appropriate generator
                    // as well and add that too.
                    Blockly.Blocks[blockdef] = categories[category].blockdefs[blockdef];
                    Blockly.JavaScript[blockdef] = categories[category].blockgenerators[blockdef];
                }
            });
        });

        // TODO: refactor these out to something else along the same style
        // as above.
        robotnikGenerator.init();
        robotnikBlocks.init();

        Blockly.inject(canvas, {
            path: './vendor/blockly/',
            toolbox: toolbox.xml,
            trashcan: true
        });
    }

    function code() {
        return Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace);
    }

    function saveWorkspace(workshopId) {
        var data = serialize();
        Workspaces.save({ workshopId, data });
    }

    function serialize() {
        let workspace = Blockly.mainWorkspace;
        let xml = Blockly.Xml.workspaceToDom(workspace);
        let serialized = Blockly.Xml.domToText(xml);
        return serialized;
    }

    function reloadWorkspace(data) {
        let xml = Blockly.Xml.textToDom(data);
        Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
    }

};
