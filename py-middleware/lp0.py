import sys

def _printer_print(fname):
    with open(fname, 'r') as txt_file:
        txt = txt_file.read()
        txt_split = txt.split('\n')

        try:
            with open('/dev/usb/lp0', "w") as printer:
                try:
                    printer.write('\x1B0\x1BM'+txt)
                except OSError as e:
                    print(e)
        except FileNotFoundError as e:
            print('ERROR!\nCan\'t seem to contact printer')

if __name__ == '__main__':
    _printer_print(sys.argv[1])
