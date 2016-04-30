'use strict';

import robotnikBlocks from '../robotnik-blocks.js';
import robotnikGenerator from '../robotnik-generator.js';

import button from '../blocks/button.js';
import led from '../blocks/led.js';
import motor from '../blocks/motor.js';
import servo from '../blocks/servo.js';

export default function(Workspaces) {

    return { init, code, serialize, reloadWorkspace, saveWorkspace };

    function init(canvas, toolbox, workshop) {


        // this now goes through all the components that are available to
        // the workshop and then adds the appropriate blocks and generators
        // to the workspace for those components.

        workshop.getComponentClasses().forEach(function(classname) {

            let cname = classname.toLowerCase(); // J5 classes are capitalised

            // get the robotnik component as well as the potential generators
            // and blocks we may be using.
            let component = eval(cname);
            let componentDef = new component({components: workshop.getComponentsFromClass(classname)});
            let b = componentDef.blocks();
            let g = componentDef.generators();

            // depending on the type of component we may need to add multiple
            // blocks and generators to the workspace which is determined below.
            // This is all determined based on what the workshop exercise needs
            // so there's no redundant blocks even if a particular component
            // may generate multiple types.
            Object.keys(b).forEach(blockdef => {
                if (cname === blockdef) {
                    // we basically have one type of simple block and generator
                    // so we just add that.
                    Blockly.Blocks[cname] = b[blockdef];
                    Blockly.JavaScript[cname] = g[blockdef];
                } else {
                    // this is a more complex component with potentially numerous
                    // blocks, so we have to add them without name collisions.
                    Blockly.Blocks[cname + "_" + blockdef] = b[blockdef];
                    Blockly.JavaScript[cname + "_" + blockdef] = g[blockdef];
                }
            });
        });

        // TODO: refactor these out to something else along the same style
        // as above.
        robotnikGenerator.init();
        robotnikBlocks.init();

        Blockly.inject(canvas, {
            path: './vendor/blockly/',
            toolbox: toolbox,
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
