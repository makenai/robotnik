var bundledBoards = require('../bundled-boards.json');

function Boards($q) {

  /**
   * If the 'board' property of a workshop is a string, treat it as an id and
   * return an appropriate board definition from our JSON. If it's an object,
   * assume that it's a custom board and return it unaltered. If there isn't a
   * board return the one that is default (Arduino UNO).
   *
   * @param {object} board - board definition
   */
  function getForWorkshop(doc) {
    if (doc.board && (typeof doc.board) === 'object') {
      return doc.board;
    } else if (doc.board && (typeof doc.board) === "string") {
      var board = bundledBoards.find( b => b._id === doc.board );
      if (board) {
        return board;
      } else {
        console.log('Board not found: ' + doc.board);
      }
    } else {
      var defaultBoard = bundledBoards.find( board => board.default );
      if (defaultBoard) {
        return defaultBoard;
      } else {
        console.log('No board specified in workshop and no default board found.');
      }
    }
  }

  return { getForWorkshop };
}

export default Boards;
