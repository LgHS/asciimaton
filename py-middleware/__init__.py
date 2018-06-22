import base64
import datetime
import io
import operator
import random
import sys

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from PIL import Image, ImageEnhance

import serial

try:
    import asciimaton
except ImportError as e:
    print('Failed to load asciimaton!')
    print("Switching to Printer filter.")
    asciimaton = None

#######

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# We'll assume we didn't crash
is_rdy = True

# (Presumably) current state of LEDS
_LEDS = {
    'L_RED': 0,
    'L_BLUE': 0,
    'L_GREEN': 0
}


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

    print(json['picture'][:128])

    json = json['picture'][len('data:image/png;base64,'):]

    img = base64.b64decode(
        json
    )

    if asciimaton is not None:
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

        data = Image.open(io.BytesIO(new_pgm))
    else:
        pil_image = Image.open(io.BytesIO(img)).convert('LA')
        source_w, source_h = pil_image.size

        hover_list = ["hover_1.jpg"]
        i = random.randint(0, len(hover_list)-1)
        hover_file = Image.open(hover_list[i]).convert('LA')

        # Images must have the same mode and size to be blended together.
        hover_file = hover_file.resize(pil_image.size, Image.ANTIALIAS)

        hover_w, hover_h = hover_file.size

        watermark = Image.open("watermark.png")
        watermark.thumbnail(
            (source_w * WATERMARK_RATIO, source_h * WATERMARK_RATIO),
            Image.ANTIALIAS
        )

        watermark_w, watermark_h = watermark.size

        pil_image = ImageEnhance.Contrast(pil_image).enhance(1.5)
        pil_image = ImageEnhance.Brightness(pil_image).enhance(1.5)

        pil_image = Image.blend(
            pil_image,
            hover_file,
            COPIER_FILTER_ALPHA
        )
        pil_image = pil_image.convert("1")
        pil_image.paste(
            watermark,
            (
                source_w - watermark_w - 25,  # (1 - watermark_relPos[0]) * source_w,
                source_h - watermark_h - 25,  # (1 - watermark_relPos[1]) * source_h
            )
        )

        pil_image.save("current.png")

        data = pil_image

    with data as img:
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

    led = 'L_{}'.format(json['color'].upper())

    states = {'high': 1, 'low': 0}
    state = states[json['state']]

    _LEDS[led] = state

    # states_name = {'high': 'on', 'low': 'off'}
    # print('Turning {} {}'.format(states_name[json['state']], led))
    # print(' '.join(['{}: {}'.format(k, v) for k, v in _LEDS.items()]))

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

    if asciimaton is None:
        with open("current.png", "rb") as png_file:
            png = png_file.read()

            # TODO: Use copy instead? :)
            filename = 'upload/batch/{:%Y-%m-%d %Hh%Mm %Ss}.png'.format(datetime.datetime.now())
            with open(filename, 'wb+') as f:
                f.write(png)
    else:
        with open('current.txt', 'r', encoding='utf-8') as txt_file:
            txt = txt_file.read()

            # TODO: Use copy instead? :)
            filename = 'upload/{:%Y-%m-%d %Hh%Mm %Ss}.txt'.format(datetime.datetime.now())
            with open(filename, 'w+', encoding='utf-8') as f:
                f.write(txt)


@socketio.on('printer.print', namespace="/ui")
def on_printer_print():
    print('printer.print')

    socketio.start_background_task(target=_printer_print)


def _printer_print():
    printer_func = None
    txt = None

    if asciimaton is None:
        import os.path
        if not os.path.isFile("current.png"):
            print("Already printed! Aborting")
            return

        import os
        os.system("lp -d HP_LaserJet_1320_series current.png")
        os.remove("current.png")

        socketio.emit('printer.isReady', is_rdy, namespace="/ui")
        return
    else:
        with open('current.txt', 'r', encoding='utf-8') as txt_file:
            txt = txt_file.read()

        txt_split = txt.split('\n')

        if THICKNESS > 1:
            txt = '\n'.join(
                '\r'.join(el) for el in zip(*([txt_split]*THICKNESS))
            ) + '\n'

        # print 8 more lines to position paper correctly for next photo
        txt += "\n\n\n\n\n\n\n\n"

        def printerFunc(printer, txt):
            try:
                printer.write('\x1B0\x1BM' + txt)
            except OSError as e:
                print(e)

    try:
        with open('/dev/usb/lp0', "w") as printer:
            printer_func(printer, txt)
    except FileNotFoundError as e:
        print('ERROR!\nCan\'t seem to contact printer')
        emit('error', {'msg': 'Can\'t contact printer!'}, broadcast='/ui')

    # Probably sent too soon! Estimate printing time. (Doable with the asciimaton printer + line thickness)


class FakeSerial:
    @staticmethod
    def write(msg: str):
        return
        # print("ERROR: No serial found!")
        # print("Message sent: {}".format(msg))


ser = FakeSerial()

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

    COPIER_FILTER_ALPHA = .3
    WATERMARK_RATIO = 1 / 3
    WATERMARK_REL_POS = (.9, .9)

    try:
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

        print("Starting websocket server")
        socketio.run(app, host=ADDR[0], port=ADDR[1])
        # socketio.run(app, host=ADDR[0], port=ADDR[1], debug=True)
    finally:
        try:
            ser.close()
        except AttributeError:
            pass
