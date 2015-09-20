import sys

from twisted.internet import reactor

from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.websocket import WebSocketServerProtocol

import pykinect
from pykinect import nui
from pykinect.nui import JointId

left = nui.structs.Vector
right = nui.structs.Vector

def stringize(vect):
    return '%s %s %s' % (vect.x, vect.y, vect.z)

def updateLastFrame(frame):
    skeletons = frame.SkeletonData
    for index, data in enumerate(skeletons):
        global left
        global right
        l = data.SkeletonPositions[JointId.WristLeft]
        r = data.SkeletonPositions[JointId.WristRight]
        if l.x != 0:
            left = l
            right = r
            print(l)
            print(r)

class MyServerProtocol(WebSocketServerProtocol):
    def onMessage(self, payload, isBinary):
        global left
        global right
        print("got ping")
        print("going to send %s %s" % (stringize(left), stringize(right)))
        payload = ('%s %s' % (stringize(left), stringize(right))).encode('utf8')
        self.sendMessage(payload, isBinary=False)

print("defined things")
kinect = nui.Runtime()
print('create kinect')
kinect.skeleton_engine.enabled = True
print('set skeleton_engine')
kinect.skeleton_frame_ready += updateLastFrame
print('attach handler')

factory = WebSocketServerFactory()
factory.protocol = MyServerProtocol

reactor.listenTCP(9999, factory)
reactor.run()
