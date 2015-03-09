import main from './main.js';

export default Array.from(directives());

function* directives() {
  yield { name: 'robotnikMain', directive: main} ;
}