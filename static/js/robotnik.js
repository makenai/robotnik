var RunningWindow = {
  show: function() {

  },
  close: function() {

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
  Blockly.addChangeListener(onBlockChange);

  var codeMirror = CodeMirror( document.getElementById('code'), {
    mode:  "javascript",
    lineNumbers: true,
    value: 'This is a test'
  });

  RunningWindow.init();

  var preCode = [ 'var five = require("johnny-five"),',
    '\tboard = new five.Board()',
    '',
    'board.on("ready", function() {',
    '' ];

  var postCode = [ '', '})' ];

  function generateCode() {
    return preCode.join("\n") + Blockly.JavaScript.workspaceToCode() + postCode.join("\n");
  }

  function onBlockChange() {
    codeMirror.setValue( generateCode() );
  }

  $('#execute').on('click', function(e) {
    RunningWindow.show();
    var code = Blockly.JavaScript.workspaceToCode();
    console.log( generateCode() );
  });

  // Keep the tabs sized to the window minus the header
  $( window ).resize(function() {
    $('#tab-content').css('height', $(window).height() - 100 + 'px' );
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
    codeMirror.refresh();
  });

});