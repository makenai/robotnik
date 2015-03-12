'use strict';

import robotnikBlocks from '../robotnik-blocks.js';
import robotnikGenerator from '../robotnik-generator.js';

export default function() {
  return {
    init: init, 
    code: code
  };
};

function init(canvas, toolbox) {
  robotnikGenerator.init();
  robotnikBlocks.init();

  Blockly.inject(canvas, {
    path: './vendor/blockly/',
    toolbox: toolbox,
    trashcan: true
  });
}

function code() {
  return Blockly.JavaScript.workspaceToCode();
}
    
