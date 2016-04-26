/**
 * A single workshop / smart wrapper for workshop data from the databaase.
 */

export default function Workshop(data) {
  this.data = data;
  if (this.hasExercises()) {
    this.setExercise(0);
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