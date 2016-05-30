/**
 * Toolbox Generation Functions
 */

import _ from 'lodash';

export default function Toolbox(workshop) {
    // takes a workshop as part of declaration so it can then process them.
    if (workshop == undefined) {
        throw Error("Toolbox must have a workshop to work with");
    }

    if (!(this instanceof Toolbox)) {
        return new Toolbox(workshop);
    }

    this.components = workshop.getComponents();
    this.categories = workshop.getBlocks();

    Object.defineProperty(this, "xml", {
        get: function() {
            return generateXML(this);
        }
    });
};

function generateXML(toolbox) {
    // this generates the actual xml - used to keep the Toolbox object with a
    // small surface
    var blocks = [];

    Object.keys(toolbox.categories).forEach(category => {
        blocks.push(makeCategory({
            name: category[0].toUpperCase() + category.slice(1),
            blocks: toolbox.categories[category].blocks,
        }));
    });

    return generate(blocks);
};

function makeBlock(component) {
    // takes a component and makes a block of the appropriate type

    let block_name = "";
    if (typeof component == "string") {
        block_name = component.toLowerCase();
    } else {
        block_name = component.class.toLowerCase();
    }

    return '<block type="' + block_name + '"></block>';
}

function makeCategory(category) {
    // category is an object with a name to add to the toolbox and an
    // array of blocks which are to be added in the category

    var xmlfragment = [];
    category.blocks.forEach(function(block) {
        xmlfragment.push(makeBlock(block));
    });
    return '<category name="' + category.name + '">\n' + xmlfragment.join("\n") + "\n</category>";
}

function generate(blocks) {
  return '<xml>\n' + blocks.join("\n") + '\n</xml>';
};

