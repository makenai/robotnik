$( document ).ready(function() {

  $('#execute').on('click', function(e) {
    var code = Blockly.JavaScript.workspaceToCode();
    console.log( code );
  });

});