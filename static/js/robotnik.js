var RunningWindow = {
  show: function() {
    this.center();
    $('#runningWindow').show();
  },
  center: function() {
    $('#runningWindow').css({
      top: ( $(window).height() / 2 ) - ( $('#runningWindow').height() / 2 ),
      left: ( $(window).width() / 2 ) - ( $('#runningWindow').width() / 2 )
    })
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

  // Initialize Blockly
  Blockly.inject(document.getElementById('blockly'), { 
    path: './blockly/', 
    toolbox: document.getElementById('toolbox'),
    trashcan: true
  });

  var editor = ace.edit("code");
  editor.getSession().setMode("ace/mode/javascript");

  RunningWindow.init();

  var preCode = [ 'var five = require("johnny-five"),',
    '\tboard = new five.Board()',
    '',
    'board.on("ready", function() {',
    "var led = new five.Led(13),", 
    "\tleft = new five.Servo({ pin:  7, type: 'continuous' }).stop(),",
    "\tright = new five.Servo({ pin: 11, type: 'continuous' }).stop(),",
    "\tsensor = new five.Sensor('A0')",
    '',
    '' ];

  var postCode = [ '', '})' ];

  // var preCode = [
  //   "var replify = require('replify')", 
  //   "console.log('listening')", 
  //   "replify('realtime-101', 1)",
  //   "process.on('message', function(m) {",
  //   "\tconsole.log('CHILD got message:', m);",
  //   "});"
  // ];
  // var postCode = [''];


  var socket = io.connect('http://localhost');

  function generateCode() {
    return preCode.join("\n") + Blockly.JavaScript.workspaceToCode() + postCode.join("\n")
  }

  $('#execute').on('click', function(e) {
    e.preventDefault();
    RunningWindow.show();
    socket.emit( 'code', generateCode() );
  });

  // Bad things happened
  socket.on( 'error', function() {
    // RunningWindow.close();
    // alert('The program closed unexpectedly. Please check the arduino is plugged in and your program.');
  })

  // Run window controls

  $('#stop').on('click', function(e) {
    e.preventDefault();
    RunningWindow.close();
    socket.emit( 'control', 'stop' );
  });

  $('#red').on('mousedown', function(e) {
    e.preventDefault();
    socket.emit( 'control', 'red_down' );
  }).on('mouseup', function(e) {
    e.preventDefault();
    socket.emit( 'control', 'red_up' );
  });

  $('#green').on('mousedown', function(e) {
    e.preventDefault();
    socket.emit( 'control', 'green_down' );
  }).on('mouseup', function(e) {
    e.preventDefault();
    socket.emit( 'control', 'green_up' );
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
      socket.emit( 'control', 'right_down' );
      past_directions.right = true;
    } else {
      if ( past_directions.right ) {
        socket.emit( 'control', 'right_up' );
        past_directions.right = false;
      }
    }

    if ( this.distance > 40 && this.angle < 320 && this.angle > 240 ) {
      socket.emit( 'control', 'left_down' );
      past_directions.left = true;
    } else {
      if ( past_directions.left ) {
        socket.emit( 'control', 'left_up' );
        past_directions.left = false;
      }
    }

    if ( this.distance > 40 && ( this.angle < 40 || this.angle > 320 ) ) {
      socket.emit( 'control', 'up_down' );
      past_directions.up = true;
    } else {
      if ( past_directions.up ) {
        socket.emit( 'control', 'up_up' );
        past_directions.up = false;
      }
    }

    if ( this.distance > 40 && this.angle > 120 && this.angle < 240 ) {
      socket.emit( 'control', 'down_down' );
      past_directions.down = true;
    } else {
      if ( past_directions.down ) {
        socket.emit( 'control', 'down_up' );
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
  });

  $('#code-tab').click(function(e) {
    e.preventDefault();

    $('#tabs li').removeClass('active');
    $(this).parent().addClass('active');

    $('#code').show();
    $('#blockly').hide();
    editor.setValue( generateCode() );
    editor.gotoLine(1);
    
  });


});