'use strict';

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
  },
  init: function() {
    this.joystick = new RetroJoyStick({
      container: document.getElementById('runningWindow'),
      position: 'custom'
    })
  }
};

$( document ).ready(function() {

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
    path: './js/vendor/blockly/',
    toolbox: document.getElementById('toolbox'),
    trashcan: true
  });

  var editor = ace.edit("code");
  editor.getSession().setMode("ace/mode/javascript");

  RunningWindow.init();

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

  // Bad things happened
  // socket.on( 'error', function() {
  //   RunningWindow.close();
  //   alert('The program closed unexpectedly. Please check the arduino is plugged in and your program.');
  // })

  // Run window controls

  $('#stop').on('click', function(e) {
    e.preventDefault();
    RunningWindow.close();
    sendMessage( 'control', 'stop' );
  });

  $('#red').on('mousedown', function(e) {
    sendMessage( 'control', 'red_down' );
  }).on('mouseup', function(e) {
    sendMessage( 'control', 'red_up' );
  }).on('click', function(e) {
    e.preventDefault();
  });

  $('#green').on('mousedown', function(e) {
    sendMessage( 'control', 'green_down' );
  }).on('mouseup', function(e) {
    sendMessage( 'control', 'green_up' );
  }).on('click', function(e) {
    e.preventDefault();
  });

  // Joystick controls!
  var past_directions = {
    up:    false,
    down:  false,
    left:  false,
    right: false
  };

  RunningWindow.joystick.on('change', function(e) {

    if ( this.distance > 40 && this.angle > 40 && this.angle < 140 ) {
      sendMessage( 'control', 'right_down' );
      past_directions.right = true;
    } else {
      if ( past_directions.right ) {
        sendMessage( 'control', 'right_up' );
        past_directions.right = false;
      }
    }

    if ( this.distance > 40 && this.angle < 320 && this.angle > 240 ) {
      sendMessage( 'control', 'left_down' );
      past_directions.left = true;
    } else {
      if ( past_directions.left ) {
        sendMessage( 'control', 'left_up' );
        past_directions.left = false;
      }
    }

    if ( this.distance > 40 && ( this.angle < 40 || this.angle > 320 ) ) {
      sendMessage('control', 'up_down');
      past_directions.up = true;
    } else {
      if ( past_directions.up ) {
        sendMessage( 'control', 'up_up' );
        past_directions.up = false;
      }
    }

    if ( this.distance > 40 && this.angle > 120 && this.angle < 240 ) {
      sendMessage( 'control', 'down_down' );
      past_directions.down = true;
    } else {
      if ( past_directions.down ) {
        sendMessage( 'control', 'down_up' );
        past_directions.down = false;
      }
    }

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
