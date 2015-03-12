'use strict';

import robotnikBlocks from './robotnik-blocks.js';
import robotnikGenerator from './robotnik-generator.js';

export default {
  init: init
};

function init() {
  var RunningWindow = {
    center: function() {
      $('#runningWindow').css({
        top: ( $(window).height() / 2 ) - ( $('#runningWindow').height() / 2 ),
        left: ( $(window).width() / 2 ) - ( $('#runningWindow').width() / 2 )
      });
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

    

    $('#execute').on('click', function(e) {
      if ( $('#code-tab').parent().is('.active') ) {
        sendMessage( 'code', editor.getValue() );
      } else {
        sendMessage( 'code', generateCode() );
      }
    });

    // Keep the tabs sized to the window minus the header
    $( window ).resize(function() {
      $('.tab-content').css('height', $(window).height() - 100 + 'px' );
      RunningWindow.center();
    });

// code tab enter
//editor.setValue( generateCode() );
//editor.gotoLine(1);

  });
}
