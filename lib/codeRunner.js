var childProcess = require("child_process");
var EventEmitter = require("events");
var util = require("util");

function CodeRunner() {
}

CodeRunner.prototype = {

  /**
   * run - run a script
   *
   * @param  {string} code to execute
   */
  run: function(code) {
    this.stop();
    this.child = childProcess.fork('./lib/codeRunnerContainer');
    this.send( 'code', code );

    this.child.on('message', function(data) {
        // we use this to grab the message from the chile process
        this.emit("consoledata", {
            data: data
        });
    }.bind(this));
  },


  /**
   * stop - Stop and kill the currently running process
   */
  stop: function() {
    if (this.child) {
      this.child.kill();
    }
  },

  /**
   * controlEvent - Send a robotnik-controls key event
   *
   * @param  {string} button name
   * @param  {string} state - either 'up' or 'down'
   */
  controlEvent: function( button, state ) {
    this.child.send({ button: button, state: state });
  },


  /**
   * send - Send a command to the running process
   *
   * @param  {string} type - type of data
   * @param  {object} data
   */
  send: function(type, data) {
    // TODO : Check to see if child is running
    this.child.send({ type: type, data: data });
  }

};

util.inherits(CodeRunner, EventEmitter);

module.exports = CodeRunner;
