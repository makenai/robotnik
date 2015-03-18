import commands from './commands.js';
import code from './code.js';
import blockly from './blockly.js';

export default [
  {name: 'commands', service: commands},
  {name: 'code', service: code},
  {name: 'blockly', service: blockly}
];