'use strict';

function code(commands, blockly, Boards) {
  return { generate, execute, setWorkshop };
  var currentWorkshop = null;

  // TODO - this seems pretty wrong. Let's ask Brian or someone who knows Angular
  // pretty well to take a look!
  function setWorkshop(workshop) {
    currentWorkshop = workshop;
  }

  function execute(code) {
    commands.send('code', code ? code : generate());
  }

  function getComponentCode(workshop) {
    if (!workshop.components) return '';

    var componentLines = [
      "// Initialize Components"
    ];

    workshop.components.forEach(function(component) {
      componentLines.push('var ' + component.name + ' = new five.' + component.class + '(' + JSON.stringify(component.config) + ');');
    });

    componentLines.push("");

    return componentLines.join("\n");
  }

  function generate() {

    // Get board-specific before / after code
    var boardPre = '', boardPost = '';
    var board = Boards.getForWorkshop( currentWorkshop );
    if (board && board.code) {
      boardPre = board.code.before ? board.code.before.join("\n") : '';
      boardPost = board.code.after ? board.code.after.join("\n") : '';
    }

    // Get component initialization code
    var componentCode = getComponentCode( currentWorkshop );

    // Get blockly code
    var blocklyCode = blockly.code();

    var code = [ boardPre, componentCode, blocklyCode, boardPost ].join("\n");
    return jsBeautify(code, {});
  }
}

export default code;
