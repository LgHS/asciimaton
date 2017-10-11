# asciimaton python middleware

_Requires Python3.5.3+_

## Install

```
virtualenv -p python3 py-middleware
cd py-middleware
. bin/activate
pip install -r requirements.txt
sudo adduser $USER gpio  # For GPIO
sudo usermod -a -G dialout $USER  # For pySerial
cd ../src/python
make
mv asciimaton.so ../../py-middleware/asciimaton.so
```


## How To

1. `. bin/activate`
1. `ls /dev/ # Look for ttyUSB0, ttyUSB1 or ttyACM0`
1. `python __init__.py /dev/ttyUSB0`

## TODO

* ...
