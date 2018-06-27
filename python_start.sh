#!/bin/bash

cd /home/pi/fessomaton/py-middleware
. bin/activate
python __init__.py /dev/ttyUSB0
