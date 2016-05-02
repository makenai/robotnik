/**
 * A single workshop / smart wrapper for workshop data from the databaase.
 */
import _ from 'lodash';

// get the component block and generator definitions.
import button from '../blocks/button.js';
import led from '../blocks/led.js';
import motor from '../blocks/motor.js';
import ledrgb from '../blocks/led.rgb.js';
import servo from '../blocks/servo.js';
import sensor from '../blocks/sensor.js';

export default function Workshop(data) {
    this.data = data;
    if (this.hasExercises()) {
        this.setExercise(0);
    } else {
        throw Error("Workshop has no exercises to run");
    }
}

Workshop.prototype.getId = function() {
  return this.data._id;
}

Workshop.prototype.setExercise = function( num ) {
  this.currentExercise = num;
}

Workshop.prototype.getExercises = function() {
  return this.data.exercises;
}

Workshop.prototype.getExercise = function() {
  if (this.hasExercises() ) {
    return this.data.exercises[ this.currentExercise ];
  } else {
    return null;
  }
}

Workshop.prototype.hasExercises = function() {
  return this.data.exercises && this.data.exercises.length > 0;
}

Workshop.prototype.getBlocks = function() {
    // returns a hierarchy of all the blocks and their categories back as an object

    // get the list of blocks defined in the exercise.
    // TODO: We may need to add blocks from the workshop and maybe some
    // default ones to this list as well in the future.
    let exerciseBlocks = this.data.exercises[this.currentExercise].exercise_blocks || null;

    let categories = {};
    let components = this.getComponents();

    exerciseBlocks = _.concat(exerciseBlocks, components);

    // go through each of the components and figure out what categories exist
    // then dedupe them
    var tempCategories = [];
    exerciseBlocks.forEach(block => {
        if (block.category != undefined) {
            tempCategories.push(block.category);
        }
    });
    tempCategories = _.uniq(tempCategories);

    // now go through each category and start assigning the category.
    // This is where we also add things like block definitions and generators
    tempCategories.forEach(category => {
        let tmpBlocks = _.filter(exerciseBlocks, {category: category});
        tmpBlocks = _.uniq(_.map(tmpBlocks, function(o) {
            // check to see if the components have types and if they do then
            // we'll need to return a composite component type
            if (o.config != undefined && o.config.type != undefined) {
                // if there's a type then add the subtype to the list
                return (o.class + "_" + o.config.type);
            } else if (o.class != undefined) {
                // if there's a class then add that.
                return (o.class);
            } else {
                // if not, we're probably an exercise  logic block so just grab the name
                return (o.name);
            }
        }));
        categories[category] = {
            blocks: tmpBlocks,
            blockdefs: {},
            blockgenerators: {},
        };
    });

    // now we have the category structure okay we need to go through each of the
    // components in the workshop and build the generators and block definitions
    // we don't need to do this for predefined blockly components, only our
    // custom ones. Note that as a side effect, new categories and block requirements
    // may happen here as some types of components may generate multiple blocks.

    this.getComponentClasses().forEach(classname => {

        // J5 uses capitalised names and has '.'s in them which we need to get
        // rid of so we just take them out entirely.
        let cname = classname.toLowerCase().replace('.','');

        // get the robotnik component as well as any potential generators
        // and blocks we wil be using.
        let component = eval(cname);
        // we pass in the actual components from this exercise so they can
        // be consolidated into one block object.
        let componentDef = new component({components: this.getComponentsFromClass(classname)});
        let b = componentDef.blocks();
        let g = componentDef.generators();

        // depending on the type of component we may need to add multiple
        // blocks and generators to the workspace which is determined below.
        // This is all determined based on what the workshop exercise needs
        // so there's no redundant blocks even if a particular component
        // may generate multiple types.
        //
        Object.keys(b).forEach(blockdef => {
            let blockCategory = componentDef.categories[blockdef];

            // just make sure the category exists so we can add the definitions
            // to it in the next bit
            if (categories[blockCategory] == undefined) {
                categories[blockCategory] = {
                    blocks: [],
                    blockdefs: {},
                    blockgenerators: {},
                };
            }

            let defname = ""
            if (cname === blockdef) {
                // we basically have one type of a simple block and generator
                // so we just add that to the category hierarchy
                defname = cname;
            } else {
                // this is a more complex component with potentially numerous
                // blocks, so we have to add them without name collisions.
                defname = cname + "_" + blockdef;
            }
            categories[blockCategory].blocks.push(defname);
            categories[blockCategory].blockdefs[defname] = b[blockdef];
            categories[blockCategory].blockgenerators[defname] = g[blockdef];
        });
    });

    return categories;
}

Workshop.prototype.getComponents = function() {
  // uses the currently selected exercise to generate an array of relevant components

  let workshopComponents = [];
  if (this.data.components && this.data.components.length > 0) {
    workshopComponents = this.data.components;
  }

  let exerciseComponents = [];
  if (this.data.exercises[this.currentExercise].components &&
          this.data.exercises[this.currentExercise].components.length > 0) {

    // get the component list then find the ones relevant and push onto the
    // exercise component list.
    let componentList = this.data.exercises[this.currentExercise].components;
    for (let i = 0; i < componentList.length; i++) {
        exerciseComponents.push(
            _.find(workshopComponents, { "name": componentList[i] })
        );
    }
  } else {
      console.warn("No components for this exercise, using all workshop ones instead");
      exerciseComponents = workshopComponents;
  }

  return exerciseComponents;
};

Workshop.prototype.getComponentClasses = function() {
    // gets a list of all the Johnny Five component classes that are represented
    // in this exercise

    // get the exercise components and then dedupe the classes from them
    let exerciseComponents = this.getComponents();

    let classList = [];
    exerciseComponents.forEach(function(c) {
        classList.push(c.class);
    });

    return _.uniq(classList);
};

Workshop.prototype.getComponentsFromClass = function(classtype) {
    // returns an array of all components of the type of class given

    return _.filter(this.getComponents(), {class: classtype});
};
