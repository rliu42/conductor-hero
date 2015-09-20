import sys
import serial

from twisted.internet import reactor

from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.websocket import WebSocketServerProtocol

from threading import Thread

ser = serial.Serial('COM3', 9600, timeout=1)


def receiving(ser):
    global last_received

    buffer_string = ''
    while True:
        buffer_string = buffer_string + ser.read(ser.inWaiting())
        if '\n' in buffer_string:
            lines = buffer_string.split('\n')
            # Guaranteed to have at least 2 entries
            last_received = lines[-2]
            buffer_string = lines[-1]

Thread(target=receiving, args=(ser,)).start()


class MyServerProtocol(WebSocketServerProtocol):
    def onMessage(self, payload, isBinary):
        print("got ping")
        print("going to send %s" % (last_received))
        payload = last_received.encode('utf8')
        self.sendMessage(payload, isBinary=False)

factory = WebSocketServerFactory()
factory.protocol = MyServerProtocol

reactor.listenTCP(9999, factory)
reactor.run()
