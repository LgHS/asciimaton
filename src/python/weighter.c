// Copyright: Ramiro Polla
// License: WTFPL

#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>

#include "algo_txt2img.h"
#include "pgm.h"

#define VAL(v) ((v) == 0 ? 1 : 0)

static void print_parts(
	uint8_t *pix,
	int stride,
	int off_x,
	int off_y,
	int len_w,
	int len_h)
{
	uint8_t total = 0;
	for ( int y = 0; y < len_h; y++ )
	{
		int idx_y = off_y + y;
		for ( int x = 0; x < len_w; x++ )
		{
			int idx_x = off_x + x;
			total += VAL(pix[idx_y * stride + idx_x]);
		}
	}
	printf(" 0x%02X,\n   ", total);
	for ( int y = 0; y < len_h / 3; y++ )
	{
		if ( y != 0 )
			printf("\n   ");
		for ( int x = 0; x < len_w / 7; x++ )
		{
			uint8_t val = 0;
			for ( int i = 0; i < 3; i++ )
			{
				int idx_y = off_y + y * 3 + i;
				for ( int j = 0; j < 7; j++ )
				{
					int idx_x = off_x + x * 7 + j;
					val += VAL(pix[idx_y * stride + idx_x]);
				}
			}
			printf(" 0x%02X,", val);
		}
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
	printf("static uint8_t weights[0x100][7] =\n");
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
