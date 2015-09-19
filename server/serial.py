#!/usr/bin/python

import serial

ser = serial.Serial('COM3', 9600, timeout=1)

# read line wiht ser.readline()
# format is ''<pot> <button>'
# pot is from 33 to 867
# button is 0 if unpressed, 1 if pressed
