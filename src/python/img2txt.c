// Copyright: Ramiro Polla
// License: WTFPL

#include <inttypes.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include "algo_img2txt.h"
#include "img2txt.h"

//---------------------------------------------------------------------
static void write_footer(
        char *out_buf,
        size_t in_w,
        size_t in_h,
        const char *in_text)
{
	size_t txt_h = 0;
	size_t txt_w = 0;
	size_t width = 0;
	const char *ip = in_text;

	// detect width/height of text
	while ( *ip != '\0' )
	{
		width++;
		if ( *ip++ == '\n' )
		{
			width = 0;
			txt_h++;
		}
		if ( width > txt_w )
			txt_w = width;
	}
	if ( width != 0 )
		txt_h++;

	size_t line = in_h - (1 + txt_h + 1) - 1;
	size_t col  = in_w - (1 + txt_w + 1) - 1 - 1;

	memset(out_buf + line * (in_w+1) + col, ' ', txt_w + 2);
	ip = in_text;
	for ( size_t i = 0; i < txt_h; i++ )
	{
		char *op = out_buf + (line + i + 1) * (in_w+1) + col;
		memset(op++, ' ', txt_w + 2);
		while ( *ip != '\0' && *ip != '\n' )
			*op++ = *ip++;
		ip++;
	}
	memset(out_buf + (line + txt_h + 1) * (in_w+1) + col, ' ', txt_w + 2);
}

//---------------------------------------------------------------------
char *img2txt(
        uint8_t *pix,
        size_t pix_w,
        size_t pix_h,
        size_t *txt_w,
        size_t *txt_h,
        float factor,
        const char *footer)
{
	*txt_w = pix_w / IMG2TXT_CHAR_W;
	*txt_h = pix_h / IMG2TXT_CHAR_H;

	// convert
	size_t out_size = ((*txt_w) + 1 /* \n */) * (*txt_h);
	char *out_buf = (char *) malloc(out_size+1);
	img2txt_convert(out_buf, pix, pix_w, pix_h, factor);
	out_buf[out_size] = '\0';

	// write footer
	write_footer(out_buf, *txt_w, *txt_h, footer);

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
		fprintf(stderr, "usage: %s <pgm> <txt>\n", argv[0]);
		return -1;
	}

	img2txt_fix_weights();

	size_t pgm_w;
	size_t pgm_h;
	uint8_t *pix = pgm_read(argv[1], &pgm_w, &pgm_h);
	if ( pix == NULL )
		return -1;

	size_t txt_w;
	size_t txt_h;
	char *txt = img2txt(pix, pgm_w, pgm_h, &txt_w, &txt_h, 6.0, "footer");

	txt_write(argv[2], txt);

	return 0;
}
#endif
