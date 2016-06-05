# Workshop file definitions

This document outlines the structure of the workshop file and the various
parameters that make it up.

The file structure is valid JSON indicated in the sections below.

## Main workshop definitions

The main workshop object has the following parameters

| Parameter | Required | Description | Example | Default |
|-----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------|
| _id | True | String that can be used to identify this workshop | "mkw" | none |
| title | True | String that will be shown on the workshop selector screen as the title | "Melbourne Knowledge Week" | none |
| description | True | Longer string that will help explain the workshop | This is a longer description about the event and other details.  | none |
| board | False | The board type you want to use needs to be one of [uno] (more coming) | uno | uno |
| boards_opts | False | An object that is the same as the johnny five board opts that you would usually use to designate an io plugin or port. This will be applied to all exercises unless it is overridden in the exercise | {   "port": "/dev/rfcomm0" } | none |
| components | True | An array of component objects that indicate the components that are available for the workshop | See `components` section | [] |
| workshop_blocks | False | An array of blocks that is provided at workshop level | See `blocks` section | [] |
| exercises | True | An array of exercises that can be worked through | See `exercises` section | [] |


## Components

The components definition allows you to define a set of common components at
the workshop level and then use them in subsequent exercises. The `components`
property is an array of component objects as given in the table below.

| Parameter | Required | Description | Example | Default |
|-----------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|---------|
| name | True | The name you want to use to refer to this component in your exercises | leftMotor | none |
| class | True | The capitalised Johnny-Five class name of the component | Motor | none |
| config | False | The configuration object you would ordinarily pass to the Johnny Five object on it's creation. Behaves identically to standard configuration needs | {   "pins": {     "pwm": 6,      "dir": 8   } } | none |

## Workshop blocks

The workshop blocks definition allows you to set and categorise a common set
of blocks for use at the workshop level. The `workshop_blocks` property is an
array of `block_definitions` as given in the table below:

| Parameter | Required | Description | Example | Default |
|-----------|----------|---------------------------------------------------------------------------|----------------|---------|
| name | True | The blockly or robotnik name of the block you want to use in the workshop | "while_button" | none |
| category | True | The category the block should appear in the toolbox | "controller" | none |

## Exercises

The exercises definitions allow you to compose an exercise with just the blocks
and components you want. It also allows you to set out a specific set of
instructions. The `exercises` property is an array of `exercise definitions` as
given in the table below:

| Parameter | Required | Description | Example | Default |
|-----------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|---------|
| description | False | The description of the exercise that will be presented to the user | In this exercise you'll attempt to make an LED turn on and off by pressing and releasing the red button | none |
| board_opts | False | An object that contains the johnny-five board options for construction such as for a port etc. This allows an override specifically for an exercise eg switching to bluetooth | {   "port": "/dev/rfcomm0" } | none |
| components | True | A string array of component names to bring into the workspace for this exercise | [ "led13", "leftMotor", "lightSensor"] | none |
| exercise_blocks | False | An array of `block definition` objects (see above) specifying additional blocks to bring into the toolbox for this workshop | [ {"name":"controls_if", "category":"logic"}, {"name":"logic_compare", "category":"logic"} ] | none |
| diagram | False | A path to a diagram (svg preferred) that is the circuit diagram of what this exercise is building | image.svg | none |


