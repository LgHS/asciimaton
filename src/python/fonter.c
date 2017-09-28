// Copyright: Ramiro Polla
// License: WTFPL

#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

#include "algo_txt2img.h"
#include "pgm.h"

static void print_parts(
	uint8_t *pix,
	int stride,
	int off_x,
	int off_y,
	int len_w,
	int len_h)
{
	for ( int y = 0; y < len_h; y++ )
	{
		int idx_y = off_y + y;
		printf("\n   { ");
		for ( int x = 0; x < len_w; x++ )
		{
			int idx_x = off_x + x;
			uint8_t val = pix[idx_y * stride + idx_x];
			printf(" 0x%02X,", val);
		}
		printf(" },");
	}
}

int main(int argc, char *argv[])
{
	size_t width;
	size_t height;
	uint8_t *pix;

	if ( argc < 2 )
	{
		fprintf(stderr, "usage: %s <file>\n", argv[0]);
		return -1;
	}

	pix = pgm_read(argv[1], &width, &height);
	if ( pix == NULL )
		return -1;

	int off_x = 0;
	int off_y = 0;
	uint8_t c = ' ';
	printf("#include <inttypes.h>\n");
	printf("static uint8_t font[0x100][%d][%d] =\n",
	       TXT2IMG_CHAR_H, TXT2IMG_CHAR_W);
	printf("{\n");
	while ( off_y <= height )
	{
		const char *prepend_str = "";
		if ( c == '\'' || c == '\\' )
			prepend_str = "\\";
		printf("  ['%s%c'] = {", prepend_str, c);
		print_parts(pix, width, off_x, off_y, TXT2IMG_CHAR_W, TXT2IMG_CHAR_H);
		printf("  },\n");

		off_x += TXT2IMG_CHAR_W + 1;
		if ( off_x > width )
		{
			off_x = 0;
			off_y += TXT2IMG_CHAR_H + 1;
		}

		c++;
	}
	printf("};\n");

	free(pix);

	return 0;
}
