// Copyright: Ramiro Polla
// License: WTFPL

// image to text algorithm
// (based on the algorithm from aalib by Jan Hubicka)

#include <inttypes.h>
#include <limits.h>
#include <float.h>

#include "algo_img2txt.h"
#include "weights.c"

static float fweights[0x100][IMG2TXT_WEIGHT_COUNT];
void img2txt_fix_weights(void)
{
	size_t max_total = 0;
	size_t max_cell = 0;
	for ( size_t c = 0x20; c < 0x7f; c++ )
	{
		size_t total = weights[c][0];
		if ( total > max_total )
			max_total = total;
		for ( size_t i = 1; i < 7; i++ )
		{
			size_t cell = weights[c][i];
			if ( cell > max_cell )
				max_cell = cell;
		}
	}

	float mult_total = 255. / max_total;
	float mult_cell = 255. / max_cell;
	for ( size_t c = 0x20; c < 0x7f; c++ )
	{
		fweights[c][0] = weights[c][0] * mult_total;
		for ( size_t i = 1; i < IMG2TXT_WEIGHT_COUNT; i++ )
			fweights[c][i] = weights[c][i] * mult_cell;
	}
}

static void apply_fs(float *fdata, size_t width, size_t height, size_t y, size_t x, float err)
{
	if ( x < 0 || x + IMG2TXT_CHAR_W >= width
	  || y < 0 || y + IMG2TXT_CHAR_H >= height )
		return;

	err /= (float) IMG2TXT_PIXNUM;
	for ( size_t i = 0; i < IMG2TXT_CHAR_H; i++ )
		for ( size_t j = 0; j < IMG2TXT_CHAR_W; j++ )
			fdata[(y + i) * width + (x + j)] += err;
}

void img2txt_convert(char *out_data, uint8_t *in_data, size_t width, size_t height, float factor)
{
	float fdata[height * width];
	for ( size_t y = 0; y < height; y++ )
		for ( size_t x = 0; x < width; x++ )
			fdata[y * width + x] = 0xff - in_data[y * width + x];

	for ( size_t y = 0; y + IMG2TXT_CHAR_H <= height; y += IMG2TXT_CHAR_H )
	{
		for ( size_t x = 0; x + IMG2TXT_CHAR_W <= width; x += IMG2TXT_CHAR_W )
		{
			float pix_data[IMG2TXT_WEIGHT_COUNT] = {0};
			for ( size_t i = 0; i < IMG2TXT_CHAR_H; i++ )
			{
				for ( size_t j = 0; j < IMG2TXT_CHAR_W; j++ )
				{
					float val = fdata[(y + i) * width + (x + j)];
					pix_data[0] += val;
					pix_data[1 + i * IMG2TXT_CHAR_W + j] = val;
				}
			}

			pix_data[0] /= (float) IMG2TXT_PIXNUM;

			float best = FLT_MAX;
			size_t best_z = 0x20;
			for ( size_t z = 0x20; z < 0x7f; z++ )
			{
				float *fweight = fweights[z];
				float val = pix_data[0] - fweight[0];
				float ssd = factor * val * val;
				for ( size_t i = 1; i < IMG2TXT_WEIGHT_COUNT; i++ )
				{
					val = pix_data[i] - fweight[i];
					ssd += val * val;
				}
				if ( ssd < best )
				{
					best = ssd;
					best_z = z;
				}
			}
			*out_data++ = best_z;

			// floyd-steinberg
			float cell_diff = pix_data[0] - fweights[best_z][0];
			apply_fs(fdata, width, height, y                 , x + IMG2TXT_CHAR_W, cell_diff * 7. / 16.);
			apply_fs(fdata, width, height, y + IMG2TXT_CHAR_H, x - IMG2TXT_CHAR_W, cell_diff * 3. / 16.);
			apply_fs(fdata, width, height, y + IMG2TXT_CHAR_H, x                 , cell_diff * 5. / 16.);
			apply_fs(fdata, width, height, y + IMG2TXT_CHAR_H, x + IMG2TXT_CHAR_W, cell_diff * 1. / 16.);
		}
		*out_data++ = '\n';
	}
}
