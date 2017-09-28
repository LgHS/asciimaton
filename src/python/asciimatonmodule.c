// Copyright: Ramiro Polla
// License: WTFPL

#include <Python.h>
#include <stdio.h>

#include "img2txt.h"
#include "txt2img.h"
#include "algo_img2txt.h"
#include "algo_txt2img.h"

//---------------------------------------------------------------------
static const char *
next_line(const char *p)
{
	while ( *p != '\n' )
		p++;
	return ++p;
}

//---------------------------------------------------------------------
static PyObject *
asciimaton_img2txt(PyObject *self, PyObject *args)
{
	const char *pgm;
	int length;
	int maxval;
	char *txt;
	size_t pgm_w;
	size_t pgm_h;
	size_t txt_w;
	size_t txt_h;
	PyObject *ret;

	if ( !PyArg_ParseTuple(args, "s#", &pgm, &length) )
		return NULL;

	if ( strncmp(pgm, "P5\n", 3) != 0 )
		return NULL;
	pgm = next_line(pgm);
	if ( sscanf(pgm, "%zd %zd\n", &pgm_w, &pgm_h) != 2 )
		return NULL;
	pgm = next_line(pgm);
	if ( sscanf(pgm, "%d\n", &maxval) != 1 )
		return NULL;
	pgm = next_line(pgm);

	txt = img2txt((uint8_t *) pgm, pgm_w, pgm_h, &txt_w, &txt_h, 6.0, "footer");
	ret = PyString_FromString(txt);
	free(txt);

	return ret;
}

//---------------------------------------------------------------------
static PyObject *
asciimaton_txt2img(PyObject *self, PyObject *args)
{
	char header[0x100];
	const char *txt;
	int length;
	uint8_t *pix;
	size_t txt_w = 0;
	size_t txt_h = 0;
	size_t pix_w;
	size_t pix_h;
    PyObject *ret;
    PyObject *pgm_body;

	if ( !PyArg_ParseTuple(args, "s#", &txt, &length) )
		return NULL;

	for ( const char *p = txt; *p != '\0'; p++ )
	{
		p = next_line(p);
		if ( txt_w == 0 )
			txt_w = p - txt - 1;
		txt_h++;
	}

	pix = txt2img(txt, txt_w, txt_h, &pix_w, &pix_h);
	if ( pix == NULL )
		return NULL;

	snprintf(header, sizeof(header),
	         "P5\n"
	         "%zd %zd\n"
	         "255\n", pix_w, pix_h);

	ret = PyString_FromString(header);
	pgm_body = PyString_FromStringAndSize((const char *) pix, pix_h * pix_w);
	PyString_ConcatAndDel(&ret, pgm_body);
	free(pix);

	return ret;
}

static PyMethodDef asciimaton_methods[] = {
	{ "img2txt", asciimaton_img2txt, METH_VARARGS, "img2txt" },
	{ "txt2img", asciimaton_txt2img, METH_VARARGS, "txt2img" },
	{ NULL, NULL, 0, NULL },
};

PyMODINIT_FUNC
initasciimaton(void)
{
	img2txt_fix_weights();
	Py_InitModule("asciimaton", asciimaton_methods);
}
