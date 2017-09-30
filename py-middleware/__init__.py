from enum import Enum
from time import sleep

from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

try:
    import RPi.GPIO as GPIO
except RuntimeError:
    print('-- Not on a Raspberry Pi! Emulating env...')
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
	return 'henlo!'


@app.route('/')
def main():
	return render_template('index.html')


@socketio.on('connect')
def on_connect():
	emit('printer.isReady', is_rdy)


@socketio.on('webcam.output')
def on_webcam_processing(json):
	img = json['picture']
	print('webcam.output', img)

	# Inset ASCIImaton's processing here

	emit('asciimaton.output', {'picture': img})


@socketio.on('led.changeState')
def on_led_state_change(json):
	# ({'led': 'RED', 'state': 'HIGH'})
	states = {'HIGH': GPIO.HIGH, 'LOW': GPIO.LOW}
	GPIO.output(PI_OUT['L_{}'.format(json['led'])], states[json['state']])

# TODO: Listen to GPIO
# button.isPressed({'color': 'RED'})

@socketio.on('printer.print')
def on_printer_print(json):
	# {}
	# TODO
	pass

@socketio.on('asciimaton.save')
def on_save(json):
	# {}
	# TODO
	pass


if __name__ == '__main__':
    try:
        GPIOHandler.init(GPIO)

        print("Starting websocket server")
        socketio.run(app, host='192.168.12.182', port='54321', debug=True)
    finally:
        GPIO.cleanup()
