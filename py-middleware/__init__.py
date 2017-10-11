import base64
import datetime
import io
import operator
import subprocess
import sys
from enum import Enum
from time import sleep

from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from PIL import Image
import serial

try:
    import asciimaton
except ImportError as e:
    print('Failed to load asciimaton')

try:
    import RPi.GPIO as GPIO
except (RuntimeError, ImportError):
    print('-- Not on a Raspberry Pi / No GPIO module found')
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
socketio = SocketIO(app, async_mode='threading')
# socketio = SocketIO(app)

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
    """For all your testing desires..."""

    pgm = open("static/lena420.pgm", "rb").read()
    txt = asciimaton.img2txt(pgm)
    new_pgm = asciimaton.txt2img(txt)
    with open('static/test.pgm', 'wb') as f:
        f.write(new_pgm)

    # with open('/dev/usb/lp0', "wb") as f:
    #    f.write(txt)

    return 'henlo!'


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/controller/')
def controller():
    return render_template('controller.html')


@socketio.on('connect', namespace="/ui")
def on_connect():
    emit('printer.isReady', is_rdy, namespace="/ui")


@socketio.on('webcam.output', namespace='/ui')
def on_webcam_processing(json):
    print('webcam.output')

    json = json['picture'][len('data:image/png;base64,'):]

    print(json[:128])

    img = base64.b64decode(
        json
    )

    # with open('static/lena420.pgm', 'rb') as f:
    #    foo = f.read()
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
            #    f.write(pgm)

    now = datetime.datetime.now()
    watermark = '\n'.join(WATERMARKS).format(now, DATETIME='{:%Y-%m-%d %H:%M}'.format(now))

    justifications = {'RIGHT': 'rjust', 'CENTER': 'center'}

    if JUSTIFICATION in justifications:
        watermark = watermark.splitlines()

        justifier = operator.methodcaller(
            justifications[JUSTIFICATION],
            max(*[len(line) for line in watermark])
        )

        watermark = '\n'.join(map(justifier, watermark))

    txt = asciimaton.img2txt(pgm, watermark)
    print('img2txt done!')
    new_pgm = asciimaton.txt2img(txt)
    print('txt2img done!')

    with open('current.txt', 'w', encoding='utf-8') as f:
        f.write(txt)

    # with open('static/current.pgm', 'wb') as f:
    #    f.write(new_pgm)

    data = io.BytesIO(new_pgm)
    with Image.open(data) as img:
        out_png = io.BytesIO()
        img.convert('RGB').save(out_png, 'PNG')
        out_png.seek(0)
        out_png = out_png.read()

    emit(
        'asciimaton.output',
        {'picture': 'data:image/png;base64,'+base64.b64encode(out_png).decode('utf-8')},
        namespace='/ui'
    )


@socketio.on('led.changeState', namespace='/ui')
def on_led_state_change(json):
    # ({'color': 'RED', 'state': 'high'})

    states_name = {'high': 'on', 'low': 'off'}

    led = 'L_{}'.format(json['color'].upper())

    states = {'high': 1, 'low': 0}
    state = states[json['state']]

    _LEDS[led] = state

    # print('Turning {} {}'.format(states_name[json['state']], led))
    print(' '.join(['{}: {}'.format(k, v) for k,v in _LEDS.items()]))

    if GPIO:
        GPIO.output(LEDS[led].value, state)
    else:
        color = json['color'][0]

        if state:
            color = color.upper()
        else:
            color = color.lower()

        # print(color.encode('utf-8'), state)

        ser.write(color.encode('utf-8'))

@socketio.on('button.isPressed', namespace="/control")
def on_button_press(json):
    socketio.emit('button.isPressed', json, namespace='/ui', broadcast=True)
    print('button.isPressed', json)


@socketio.on('webcam.updateFilter', namespace="/control")
def on_webcam_update_filter(json):
    print('webcam.updateFilter')
    emit('webcam.updateFilter', json, namespace="/ui", broadcast=True)


@socketio.on('ui.reload', namespace="/control")
def on_ui_reload():
    print('ui.reload')
    emit('ui.reload', namespace="/ui", broadcast=True)


@socketio.on('printer.setLineThickness', namespace="/control")
def on_printer_set_line_thickness(json):
    # {'thickness': 0...4}
    global THICKNESS

    print('printer.setLineThickness', json)

    n = int(json['thickness'])

    THICKNESS = min(3, max(0, n))


@socketio.on('asciimaton.save', namespace='/ui')
def on_asciimaton_save():
    print('asciimaton.save')

    with open('current.txt', 'r', encoding='utf-8') as txt_file:
        txt = txt_file.read()

        # TODO: Use copy instead? :)
        filename = 'upload/{:%Y-%m-%d %H:%M:%S}.txt'.format(datetime.datetime.now())
        with open(filename, 'w+', encoding='utf-8') as f:
            f.write(txt)


@socketio.on('printer.print', namespace="/ui")
def on_printer_print():
    print('printer.print')

    socketio.start_background_task(target=_printer_print)


def _printer_print():
    with open('current.txt', 'r', encoding='utf-8') as txt_file:
        txt = txt_file.read()
        txt_split = txt.split('\n')

        if THICKNESS > 1:
            txt = '\n'.join(
                '\r'.join(el) for el in zip(*([txt_split]*THICKNESS))
            ) + '\n'

        try:
            with open('/dev/usb/lp0', "w") as printer:
                try:
                    printer.write('\x1B0\x1BM'+txt)
                except OSError as e:
                    print(e)
        except FileNotFoundError as e:
            print('ERROR!\nCan\'t seem to contact printer')
            emit('error', {'msg': 'Can\'t contact printer!'}, broadcast='/ui')

        socketio.emit('printer.isReady', is_rdy, namespace="/ui")


if __name__ == '__main__':
    # ADDR = ('127.0.0.1', 54321)
    ADDR = ('0.0.0.0', 54321)

    WATERMARKS = [
        'ASCIIMATON - lghs.be',

        # Extra new line
        '',

        # Syntax: {:<insert your unix date format here>} eg: {:%Y-%m-%d %H:%M}
        # '{:%Y-%m-%d %H:%M}',

        # Alternatively just use {DATETIME} to use the default
        '{DATETIME}',
    ]

    # CENTER|RIGHT|LEFT
    JUSTIFICATION = 'CENTER'

    THICKNESS = 1

    try:
        GPIOHandler.init(GPIO)

        try:
            ser = serial.Serial(sys.argv[1], 115200)
            # subprocess.Popen(['python', 'buttonListener.py', sys.argv[1]])
            def buttonListener():
                while 42:
                    on_button_press(
                        {'color': {'R': 'red', 'G': 'green', 'B': 'blue'}[ser.read(1).decode('utf-8')]}
                    )

            socketio.start_background_task(target=buttonListener)
        except IndexError:
            print('ERROR: Please provide an USB to i/o on (eg: python __init__.py /dev/ttyUSB0)')
            sys.exit(1)

        print("Starting websocket server")
        # socketio.run(app, host=ADDR[0], port=ADDR[1])
        socketio.run(app, host=ADDR[0], port=ADDR[1], debug=True)
    finally:
        GPIOHandler.cleanup(GPIO)
        ser.close()
