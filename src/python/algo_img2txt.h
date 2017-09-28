// Copyright: Ramiro Polla
// License: WTFPL

#include <inttypes.h>
#include <stddef.h>

#define IMG2TXT_CHAR_W 2
#define IMG2TXT_CHAR_H 3

#define IMG2TXT_PIXNUM (IMG2TXT_CHAR_H * IMG2TXT_CHAR_W)
#define IMG2TXT_WEIGHT_COUNT (1 + IMG2TXT_PIXNUM)

void img2txt_fix_weights(void);
void img2txt_convert(char *out_data, uint8_t *in_data, size_t width, size_t height, float factor);
