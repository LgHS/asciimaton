import base64
import datetime
import io
from enum import Enum
from time import sleep

from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from PIL import Image

try:
	import asciimaton
except ImportError as e:
	print('Failed to load asciimaton')

try:
    import RPi.GPIO as GPIO
except RuntimeError:
    print('-- Not on a Raspberry Pi! Emulating env... (WIP)')
    print()

    GPIO = None

# LEDS
class PI_OUT(Enum):
	L_RED = 27
	L_BLUE = 17
	L_GREEN = 22


# Buttons
class PI_IN(Enum):
	B_RED = 24
	B_BLUE = 25
	B_GREEN = 23

	B_UP = 5
	B_DOWN = 13
	B_RIGHT = 6
	B_LEFT = 19

#######

app = Flask(__name__)
socketio = SocketIO(app)

# We'll assume we didn't crash
is_rdy = True


class GPIOHandler:
    @staticmethod
    def init(GPIO):
        if not GPIO:
            return

        print("Initializing GPIO")

        GPIO.setmode(GPIO.BCM)
        # GPIO.setmode(GPIO.BOARD)

        # Init to HIGH for testing purpose
        GPIO.setup([p.value for p in PI_OUT], GPIO.OUT, initial=GPIO.HIGH)
        GPIO.setup([p.value for p in PI_IN], GPIO.IN)

        sleep(1.5)

        GPIO.output([p.value for p in PI_OUT], GPIO.LOW)


    @staticmethod
    def cleanup(GPIO):
        if GPIO:
            GPIO.cleanup()


@app.route('/test/')
def test():
	pgm = open("static/lena420.pgm", "rb").read()
	txt = asciimaton.img2txt(pgm)
	new_pgm = asciimaton.txt2img(txt)
	with open('static/test.pgm', 'wb') as f:
		f.write(new_pgm)

	# with open('/dev/usb/lp0', "wb") as f:
	#	f.write(txt)

	return 'henlo!'


@app.route('/')
def main():
	return render_template('index.html')


@socketio.on('connect')
def on_connect():
	emit('printer.isReady', is_rdy)


@socketio.on('webcam.output')
def on_webcam_processing(json):
	img = base64.b64decode(
		json['picture']
	)

	# with open('static/lena420.pgm', 'rb') as f:
	#	foo = f.read()
	# print(pgm == foo)

	# TODO: Doesn't work yet
	CONVERT = False

	if CONVERT:
		with io.BytesIO() as output:
			img = Image.open(io.BytesIO(img))
			# img.convert('RGB')
			img.save(output, 'PPM')  # Format for .pgm

			pgm = output.getvalue()
	else:
		pgm = img

	print('webcam.output')

	txt = asciimaton.img2txt(pgm)
	# print('img2txt done!')
	new_pgm = asciimaton.txt2img(txt)
	# print('txt2img done!')

	with open('current.txt', 'w', encoding='utf-8') as f:
		f.write(txt.decode('utf-8'))

	# Test
	with open('static/current.pgm', 'wb') as f:
		f.write(new_pgm)

	emit('asciimaton.output', {'picture': base64.b64encode(new_pgm).decode('utf-8')})


@socketio.on('led.changeState')
def on_led_state_change(json):
	# ({'led': 'RED', 'state': 'HIGH'})
	states = {'HIGH': GPIO.HIGH, 'LOW': GPIO.LOW}
	GPIO.output(PI_OUT['L_{}'.format(json['led'])], states[json['state']])

# TODO: Listen to GPIO
# button.isPressed({'color': 'RED'})

@socketio.on('printer.print')
def on_printer_print(json):
	# {'save': True|False}
	print('printer.print', json)

	save = json['save']

	# TODO: Use copy instead? :)
	with open('current.txt', 'r', encoding='utf-8') as txt_file:
		with open('/dev/usb/lp0', "wb") as printer:
			txt = txt_file.read()
			printer.write(txt)

		if save:
			filename = '/upload/{:%Y-%m-%d %H:%M:%S}.txt'.format(datetime.datetime.now())
			with open(filename, 'w', encoding='utf-8') as f:
				f.write(txt)


if __name__ == '__main__':
    try:
        GPIOHandler.init(GPIO)

        print("Starting websocket server")
        socketio.run(app, host='192.168.12.182', port='54321')
        # socketio.run(app, host='192.168.12.182', port='54321', debug=True)
    finally:
        GPIO.cleanup()
