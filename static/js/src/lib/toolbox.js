/**
 * Toolbox Generation Functions
 */

import _ from 'lodash';

var logic_blocks = ['console_log', 'while_button'];

export default function Toolbox(workshop) {
    // takes a workshop as part of declaration so it can then process them.
    if (workshop == undefined) {
        throw Error("Toolbox must have a workshop to work with");
    }

    if (!(this instanceof Toolbox)) {
        return new Toolbox(workshop);
    }

    this.categories = [];
    this.components = workshop.getComponents();

    // go through each of the components and figure out what categories exist
    // then dedupe them
    this.components.forEach(function(component) {
        this.categories.push(component.category);
    }.bind(this));

    this.categories = _.uniq(this.categories);

    Object.defineProperty(this, "xml", {
        get: function() {
            return generateXML(this);
        }
    });
    console.log(this);
};

function generateXML(toolbox) {
    // this generates the actual xml - used to keep the Toolbox object with a
    // small surface
    console.log("getting XML for toolbox");
    var blocks = [];
    blocks.push(makeCategory({
        name: 'Logic',
        blocks: logic_blocks,
    }));

    toolbox.categories.forEach(function(category) {
        blocks.push(makeCategory({
            name: category[0].toUpperCase() + category.slice(1),
            blocks: _.filter(toolbox.components, {category: category}),
        }));
    });

    return generate(blocks);
};

function makeBlock(component) {
    // takes a component and makes a block of the appropriate type

    let block_name = "";
    let field = "";
    if (typeof component == "string") {
        block_name = component;
    } else {
        // AF: we may need to do more work here in the future because simply
        // using the class name as the block may not be sufficient (eg in
        // cases where we have multiple blocks per component type)
        block_name = component.class.toLowerCase();
        field = component.name;
        // TODO: Deal with the case where we have multiple cases of the one
    }

    let block_fragment = '<block type="' + block_name + '">';
    if (field != "") {
        block_fragment += '<field name="VAR">LED</field>';
    }
    block_fragment += '</block>';

    return block_fragment;
}

function makeCategory(category) {
    // category is an object with a name and an array of components to be added.

    var xmlfragment = [];
    category.blocks.forEach(function(block) {
        xmlfragment.push(makeBlock(block));
    });
    return '<category name="' + category.name + '">\n' + xmlfragment.join("\n") + "\n</category>";
}

function generate(blocks) {
  return '<xml>\n' + blocks.join("\n") + '\n</xml>';
};

