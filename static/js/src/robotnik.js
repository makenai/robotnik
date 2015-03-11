'use strict';

import robotnikBlocks from './robotnik-blocks.js';
import robotnikGenerator from './robotnik-generator.js';

export default {
  init: init
};

function init() {
  var RunningWindow = {
    show: function() {
      this.center();
      $('#runningWindow').show();
    },
    center: function() {
      $('#runningWindow').css({
        top: ( $(window).height() / 2 ) - ( $('#runningWindow').height() / 2 ),
        left: ( $(window).width() / 2 ) - ( $('#runningWindow').width() / 2 )
      });
    },
    close: function() {
      $('#runningWindow').hide()
    }
  };

  $( document ).ready(function() {

    robotnikGenerator.init();
    robotnikBlocks.init();

    // HTTP based sockets replacement that will probably work
    function sendMessage( channel, message ) {
      $.post('/message', {
        channel: channel,
        message: message
      }, function(data,status,xr) {
        console.log( data );
      });
    }

    // Initialize Blockly
    Blockly.inject(document.getElementById('blockly'), {
      path: './vendor/blockly/',
      toolbox: document.getElementById('toolbox'),
      trashcan: true
    });

    var editor = ace.edit("code");
    editor.getSession().setMode("ace/mode/javascript");

    var preCode = [ 'var five = require("johnny-five"),',
      '\tboard = new five.Board(),',
      "\tbutton = require('./lib/buttons')",
      '',
      'board.on("ready", function() {',
      "var led = new five.Led(13),",
      "\tleft = new five.Servo({ pin:  7, type: 'continuous' }).stop(),",
      "\tright = new five.Servo({ pin: 11, type: 'continuous' }).stop(),",
      "\tsensor = new five.Sensor('A0')",
      '',
      '' ];

    var postCode = [ '', '})' ];

    function generateCode() {
      return preCode.join("\n") + Blockly.JavaScript.workspaceToCode() + postCode.join("\n")
    }

    $('#execute').on('click', function(e) {
      e.preventDefault();
      setTimeout(function() {
        RunningWindow.show();
      }, 1000);
      if ( $('#code-tab').parent().is('.active') ) {
        sendMessage( 'code', editor.getValue() );
      } else {
        sendMessage( 'code', generateCode() );
      }
    });

    // Run window controls

    $('#stop').on('click', function(e) {
      e.preventDefault();
      RunningWindow.close();
    });

    // Keep the tabs sized to the window minus the header
    $( window ).resize(function() {
      $('#tab-content').css('height', $(window).height() - 100 + 'px' );
      RunningWindow.center();
    });

    // Tab Interface
    $('#blocks-tab').click(function(e) {
      e.preventDefault();

      $('#tabs li').removeClass('active');
      $(this).parent().addClass('active');

      $('#code').hide();
      $('#blockly').show();
      $('#docs').hide();
    });

    $('#code-tab').click(function(e) {
      e.preventDefault();

      $('#tabs li').removeClass('active');
      $(this).parent().addClass('active');

      $('#code').show();
      $('#blockly').hide();
      $('#docs').show();
      editor.setValue( generateCode() );
      editor.gotoLine(1);

    });


  });
}
