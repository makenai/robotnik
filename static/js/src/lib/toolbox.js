/**
 * Toolbox Generation Functions
 */

export default function Toolbox() {
  this.blocks = [];
};

Toolbox.prototype.addBlock = function(name) {
  return this.blocks.push('<block type="' + name + '"></block>');
}

Toolbox.prototype.generate = function() {
  return "<xml>\n" + this.blocks.join("\n") + "\n</xml>";
};

Toolbox.forWorkshop = function(workshop) {
    var toolbox = new Toolbox();
    toolbox.addBlock('console_log');
    toolbox.addBlock('while_button');
    toolbox.addBlock('led_on');
    toolbox.addBlock('led_off');
    toolbox.addBlock('motor_on');
    toolbox.addBlock('if_distance');
    return toolbox.generate();
}