// Copyright: Ramiro Polla
// License: WTFPL

#include <inttypes.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include "algo_txt2img.h"

#include "txt2img.h"

//---------------------------------------------------------------------
uint8_t *txt2img(
        const char *txt,
        size_t txt_w,
        size_t txt_h,
        size_t *pix_w,
        size_t *pix_h)
{
	*pix_w = txt_w * TXT2IMG_CHAR_W;
	*pix_h = txt_h * TXT2IMG_CHAR_H;

	// convert
	size_t out_size = (*pix_w) * (*pix_h);
	uint8_t *out_buf = (uint8_t *) malloc(out_size);
	txt2img_convert(out_buf, txt, txt_w, txt_h);

	return out_buf;
}

#ifdef STANDALONE
#include <stdio.h>
#include <inttypes.h>
extern "C" {
#include "pgm.h"
#include "txt.h"
}

int main(int argc, char *argv[])
{
	if ( argc < 3 )
	{
		fprintf(stderr, "usage: %s <txt> <pgm>\n", argv[0]);
		return -1;
	}

	size_t txt_w;
	size_t txt_h;
	char *txt = txt_read(argv[1], &txt_w, &txt_h);
	if ( txt == NULL )
		return -1;

	size_t pix_w;
	size_t pix_h;
	uint8_t *pix = txt2img(txt, txt_w, txt_h, &pix_w, &pix_h);

	pgm_write(argv[2], pix, pix_w, pix_h);

	return 0;
}
#endif
