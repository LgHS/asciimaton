// Copyright: Ramiro Polla
// License: WTFPL

// text to image converter

#include <inttypes.h>
#include <limits.h>
#include <float.h>

#include "algo_txt2img.h"
#include "font.c"

void txt2img_convert(uint8_t *out_data, char *in_data, size_t in_w, size_t in_h)
{
	size_t out_stride = in_w * TXT2IMG_CHAR_W;
	for ( size_t y = 0; y < in_h; y++ )
	{
		for ( size_t x = 0; x < in_w; x++ )
		{
			char c = in_data[y * in_w + x];
			for ( size_t i = 0; i < TXT2IMG_CHAR_H; i++ )
			{
				for ( size_t j = 0; j < TXT2IMG_CHAR_W; j++ )
				{
					uint8_t *inpt = &font[(size_t) c][i][j];
					size_t idx_y = y * TXT2IMG_CHAR_H + i;
					size_t idx_x = x * TXT2IMG_CHAR_W + j;
					uint8_t *outp = &out_data[idx_y * out_stride + idx_x];
					*outp = *inpt;
				}
			}
		}
	}
}
