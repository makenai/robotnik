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

    let components = workshop.getComponents();
    let componentLines = [
      "// Initialize Components"
    ];

    components.forEach(function(component) {
      componentLines.push('var ' + component.name + ' = new five.' + component.class + '(' + JSON.stringify(component.config) + ');');
    });

    componentLines.push("");

    return componentLines.join("\n");
  }

  function generate() {

    // Get board-specific before / after code
    var boardReqs = '', boardPre = '', boardPost = '', boardInit = '';
    var board = Boards.getForWorkshop( currentWorkshop );
    if (board && board.code) {
      boardReqs = board.code.requires ? board.code.requires.join("\n") : '';
      boardPre = board.code.before ? board.code.before.join("\n") : '';
      boardPost = board.code.after ? board.code.after.join("\n") : '';
      boardInit = board.code.boardInit ? board.code.boardInit : '';
    }

    // get the board options for the current workshop
    var boardopts = currentWorkshop.getBoardConfig();
    if (boardopts == "") {
        boardInit = boardInit.replace('opts', "");
    } else {
        boardInit = boardInit.replace('opts', JSON.stringify(boardopts));
    }
    //boardInit = "var board = new five.Board();"

    // Get component initialization code
    var componentCode = getComponentCode( currentWorkshop );

    // Get blockly code
    var blocklyCode = blockly.code();

    var code = [ boardReqs, boardInit, boardPre,
                componentCode, blocklyCode, boardPost
               ].join("\n");
    return jsBeautify(code, {});
  }
}

export default code;
