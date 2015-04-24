import template from './editor.html';

export default function() {
  return {
    template: template,
    controllerAs: 'vm',
    scope: {
      code: '=?'
    },
    link: function(scope, element) {
      var editor = ace.edit(element.find('#code')[0]);
      editor.getSession().setMode("ace/mode/javascript");

      scope.$watch('code', function(newVal, oldVal) {
        if(newVal === oldVal) return;
        
        editor.setValue(scope.code);
        editor.gotoLine(1);
      });

      editor.on('blur', function(e) {
        var editorValue = editor.getValue();

        if(editorValue !== scope.code) {
          scope.$applyAsync(function() {
            scope.code = editorValue;
          })
        }
      });
    }
  }
};