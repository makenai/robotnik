/**
 * A single workshop / smart wrapper for workshop data from the databaase.
 */
import _ from 'lodash';

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
