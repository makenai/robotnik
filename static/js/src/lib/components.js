var _ = require('lodash');

function Components() {
  this.variableCounter = {};
}

Components.prototype = {

  /**
   * Convert a class name into a variable name, keeping track of the how many
   * instances there are and appending a number as needed. Each call returns
   * a new variable name.
   *
   * ex:
   *
   * variablize('Servo') -> 'servo'
   * variablize('Servo') -> 'servo2'
   *
   * @param {string} className
   * @return {string} variableName
   */

   variablize: function (className) {
     var varName = className.toLowerCase();
     if ( variableCounter[ varName ] ) {

     } else {
       variableCounter[ varName ] = 1;
     }

     return varName;
   },

   componentsToCode: function(components) {
     var declarations = [];

     _.each(components, function(component,i) {
       var name = component.name || variablize( component.class );

       declarations.push( name );
     });

     if ( declarations.length ) {
       return 'var ' + declarations.join(",\n") + ';';
     } else {
       return '';
     }
   }

};
module.exports = Components;
