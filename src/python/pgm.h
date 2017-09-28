// Copyright: Ramiro Polla
// License: WTFPL

#include <inttypes.h>

// Read gray pgm file <fname>.
// Returns dimensions in <width> and <height>.
// Return pixel data must be free()'d
uint8_t *pgm_read(const char *fname, size_t *width, size_t *height);

// Write gray bitmap from <pix> to <fname>.
int pgm_write(const char *fname, uint8_t *pix, size_t width, size_t height);
