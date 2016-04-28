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
    var tempCategories = [];
    this.components.forEach(function(component) {
        tempCategories.push(component.category);
    }.bind(this));

    tempCategories = _.uniq(tempCategories);

    // now for each category find all the component classes that are relevant
    // and then add to the category deduplicated also.
    tempCategories.forEach(category => {
        let tmpcomponents = _.filter(this.components, {category: category});
        tmpcomponents = _.uniq(_.map(tmpcomponents, function(o) {
            // check to see if the components have types and if they do then
            // we'll need to return a composite component type
            if (o.config != undefined && o.config.type != undefined) {
                return (o.class + "_" + o.config.type);
            } else {
                return (o.class);
            }
        }));

        this.categories.push({
            name: category,
            componentClasses: tmpcomponents,
        });
    });

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
    var blocks = [];
    blocks.push(makeCategory({
        name: 'Logic',
        blocks: logic_blocks,
    }));

    toolbox.categories.forEach(function(category) {
        blocks.push(makeCategory({
            name: category.name[0].toUpperCase() + category.name.slice(1),
            blocks: category.componentClasses,
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

