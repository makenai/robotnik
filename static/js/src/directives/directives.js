import main from './main.js';
import runningControls from './running-controls.js';
import upDownButton from './up-down-button.js';
import joystick from './joystick.js';

export default [
  {name: 'robotnikMain', directive: main},
  {name: 'runningControls', directive: runningControls},
  {name: 'upDownButton', directive: upDownButton},
  {name: 'joystick', directive: joystick}
];