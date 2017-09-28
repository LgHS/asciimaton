// Copyright: Ramiro Polla
// License: WTFPL

#include <inttypes.h>
#include <stddef.h>

#define TXT2IMG_CHAR_W 14
#define TXT2IMG_CHAR_H  9

void txt2img_convert(uint8_t *out_data, const char *in_data, size_t in_w, size_t in_h);
