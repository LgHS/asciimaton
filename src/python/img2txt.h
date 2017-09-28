// Copyright: Ramiro Polla
// License: WTFPL

#include <inttypes.h>
#include <stddef.h>

char *img2txt(
        uint8_t *pix,
        size_t pix_w,
        size_t pix_h,
        size_t *txt_w,
        size_t *txt_h,
        float factor,
        const char *footer);
