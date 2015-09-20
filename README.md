# Doodlr
HackMIT 2015 - Landon Carter, Runpeng Liu, Aaron Shim, Haohang Xu

## Overview
Doodlr allows users to draw in 3D and export doodles into 3D-printable STL files. 

## Usage
* Pen over sensor - doodle!
* Hand over sensor - turns on pen 
* R - toggles between sphere and beam mode
* S - exports doodle into a 3D-printable STL file
* Ctrl-Z - undo
* Ctrl-Y - redo
* Arrow-Up - increase pen size
* Arrow-Down - decrease pen size

## Technology
We used the [Leap Motion sensor](https://www.leapmotion.com/) and APIs in order to build the controller interface for this project. The sensor communicates information about the location of the pen, which is then sent to our rendering engine, written using [three.js](http://threejs.org/).
