import sys
import serial

from twisted.internet import reactor

from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.websocket import WebSocketServerProtocol

ser = serial.Serial('COM3', 9600, timeout=1)


class MyServerProtocol(WebSocketServerProtocol):
    def onMessage(self, payload, isBinary):
        payload = ser.readline().encode('utf8')
        self.sendMessage(payload, isBinary=False)

factory = WebSocketServerFactory()
factory.protocol = MyServerProtocol

reactor.listenTCP(9999, factory)
reactor.run()
