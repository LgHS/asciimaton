
from PIL import Image
import asciimaton
import sys
import io

out_w = int(sys.argv[3])
out_h = int(sys.argv[4])

with open(sys.argv[1], 'r') as inf:
    with open(sys.argv[2], 'wb') as outf:
        txt = inf.read()
        pgm = asciimaton.txt2img(txt)
        pgm_io = io.BytesIO(pgm)
        pgm_pil = Image.open(pgm_io)
        img_w = pgm_pil.size[0]
        img_h = pgm_pil.size[1]
        print("input width %d" % img_w)
        print("input height %d" % img_h)
        print("output width %d" % out_w)
        print("output height %d" % out_h)
        out_size = (out_w, out_h)
        resized = pgm_pil.resize(out_size, Image.ANTIALIAS)
        png_io = io.BytesIO()
        resized.convert("RGB").save(png_io, "PNG")
        png_io.seek(0)
        outf.write(png_io.read())
