import main from './main.js';
import runningControls from './running-controls.js';
import upDownButton from './up-down-button.js';
import joystick from './joystick.js';
import editor from './editor.js';
import workshops from './workshops.js';
import workshop from './workshop.js';

export default [
  {name: 'robotnikMain', directive: main},
  {name: 'runningControls', directive: runningControls},
  {name: 'upDownButton', directive: upDownButton},
  {name: 'joystick', directive: joystick},
  {name: 'editor', directive: editor},
  {name: 'workshops', directive: workshops},
  {name: 'workshop', directive: workshop}
];