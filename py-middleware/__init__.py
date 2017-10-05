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
except ImportError:
	print('No GPIO')
	GPIO = None
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

#######

app = Flask(__name__)
socketio = SocketIO(app)

# We'll assume we didn't crash
is_rdy = True

LEDS = PI_OUT

# (Presumably) current state of LEDS
_LEDS = {
	'L_RED': 0,
	'L_BLUE': 0,
	'L_GREEN': 0
}


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
	print('webcam.output')
	json = json['picture'][len('data:image/png;base64,'):]

	print(json[:128])

	img = base64.b64decode(
		json
	)

	# with open('static/lena420.pgm', 'rb') as f:
	#	foo = f.read()
	# print(pgm == foo)

	CONVERT = True

	if not CONVERT:
		pgm = img
	else:
		data = io.BytesIO(img)
		with Image.open(data) as img:
			out_pgm = io.BytesIO()

			# Format for .pgm
			img.convert('L').save(out_pgm, 'PPM')

			out_pgm.seek(0)
			pgm = out_pgm.read()

			# with open('static/test-pgn2pgm.pgm', 'wb') as f:
			#	f.write(pgm)

	txt = asciimaton.img2txt(pgm, WATERMARK)
	print('img2txt done!')
	new_pgm = asciimaton.txt2img(txt)
	print('txt2img done!')

	with open('current.txt', 'w', encoding='utf-8') as f:
		f.write(txt)


	# with open('static/current.pgm', 'wb') as f:
	#	f.write(new_pgm)

	data = io.BytesIO(new_pgm)
	with Image.open(data) as img:
		out_png = io.BytesIO()
		img.convert('RGB').save(out_png, 'PNG')
		out_png.seek(0)
		out_png = out_png.read()

	emit('asciimaton.output', {'picture': 'data:image/png;base64,'+base64.b64encode(out_png).decode('utf-8')})


@socketio.on('led.changeState')
def on_led_state_change(json):
	# ({'color': 'RED', 'state': 'high'})

	states_name = {'high': 'on', 'low': 'off'}

	led = 'L_{}'.format(json['color'])

	print('Turning {} {}'.format(states_name[json['state']], led))

	states = {'high': 1, 'low': 0}
	state = states[json['state']]

	_LEDS[led] = state
	print(' '.join(['{}: {}'.format(k, v) for k,v in _LEDS.items()]))

	if not GPIO:
		print('Error! No GPIO!')
		emit('error', {'msg': 'No GPIO to turn on leds'})
		return


	GPIO.output(LEDS[led].value, state)


# TODO: Listen to GPIO
# button.isPressed({'color': 'RED'})

# Emulating buttons press
@socketio.on('button.emulatePress')
def on_button_emulate_press(json):
	emit('button.isPressed', json)
	print('button.emulatePress', json)


@socketio.on('asciimaton.save')
def on_asciimaton_save():
    print('asciimaton.save')
    with open('current.txt', 'r', encoding='utf-8') as txt_file:
        txt = txt_file.read()

        # TODO: Use copy instead? :)
        filename = 'upload/{:%Y-%m-%d %H:%M:%S}.txt'.format(datetime.datetime.now())
        with open(filename, 'w+', encoding='utf-8') as f:
            f.write(txt)





@socketio.on('printer.print')
def on_printer_print():
    print('printer.print')

    with open('current.txt', 'r', encoding='utf-8') as txt_file:
        txt = txt_file.read()
        txt_split = txt.split('\n')
        
        txt = '\n'.join('\r'.join(el) for el in zip(*([txt_split]*THICKNESS)))+'\n' if THICKNESS > 1 else txt
        
        try:
            with open('/dev/usb/lp0', "w") as printer:
                printer.write('\x1B0\x1BM'+txt)
        except FileNotFoundError as e:
            print('ERROR!\nCan\'t seem to contact printer')
            emit('error', {'msg': 'Can\'t contact printer!'})
            

if __name__ == '__main__':
    ADDR = ('127.0.0.1', 54321) 

    WATERMARK = 'lghs.be'
    THICKNESS = 2

    try:
        GPIOHandler.init(GPIO)

        print("Starting websocket server")
        socketio.run(app, host=ADDR[0], port=ADDR[1])
    finally:
        GPIOHandler.cleanup(GPIO)
