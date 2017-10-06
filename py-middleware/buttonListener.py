import sys
import urllib.request

import serial

ser = serial.Serial(sys.argv[1], 115200)

while True:
    print(
        urllib.request.urlopen(
            'http://localhost:54321/button.isPressed/' + ser.read(1).decode('utf-8')
        ).read(1000)
    )