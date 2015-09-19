import os, sys, inspect, thread, time
src_dir = os.path.dirname(inspect.getfile(inspect.currentframe()))
arch_dir = 'lib/x64' if sys.maxsize > 2**32 else 'lib/x86'
sys.path.insert(0, os.path.abspath(os.path.join(src_dir, arch_dir)))

import serial
ser = serial.Serial('COM3', 9600, timeout=1)

import Leap
from Leap import CircleGesture, KeyTapGesture, ScreenTapGesture, SwipeGesture

from Drawing import Drawing, Sphere


low_pot = 33
high_pot = 867
low_radius = 0.1
high_radius = 2.0

class Listener(Leap.Listener):

    def on_connect(self, controller):
        print "Connected"
        self.drawing = Drawing()
        # controller.enable_gesture(Leap.Gesture.TYPE_SWIPE);

    def on_frame(self, controller):
        frame = controller.frame()

        #print "Frame id: %d, timestamp: %d, hands: %d, fingers: %d, tools: %d, gestures: %d" % (
          #frame.id, frame.timestamp, len(frame.hands), len(frame.fingers), len(frame.tools), len(frame.gestures()))
        if len(frame.tools) > 0:
            pen = frame.tools[0]
            ## radius 33 - 867
            reading = ser.readline()
            # print reading
            try:
                pot = int(reading.split(' ')[0])
                button = int(reading.split(' ')[1][0])
                #print (pot, button)
            except:
                pot = 400
                button = 1
            radius = float(pot-low_pot)/(high_pot-low_pot)*(high_radius-low_radius) + low_radius
            if button == 1:
                print (pen.tip_position, radius)
                self.drawing.add_sphere(Sphere(pen.tip_position, radius))


def main():
    # Create a sample listener and controller
    listener = Listener()
    controller = Leap.Controller()

    # Have the sample listener receive events from the controller
    controller.add_listener(listener)

    # Keep this process running until Enter is pressed
    print "Press Enter to quit..."
    try:
        sys.stdin.readline()
    except KeyboardInterrupt:
        pass
    finally:
        # Remove the sample listener when done
        controller.remove_listener(listener)



if __name__ == "__main__":
    main()