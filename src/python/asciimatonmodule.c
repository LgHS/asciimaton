// Copyright: Ramiro Polla
// License: WTFPL

#include <Python.h>
#include <stdio.h>

#include "img2txt.h"
#include "txt2img.h"
#include "algo_img2txt.h"
#include "algo_txt2img.h"

//---------------------------------------------------------------------
static PyObject *asciimaton_pgm;

//---------------------------------------------------------------------
static char *
next_line(char *p)
{
	while ( *p != '\n' )
		p++;
	return ++p;
}

//---------------------------------------------------------------------
static PyObject *
asciimaton_img2txt(PyObject *self, PyObject *args)
{
	PyObject *ascii = NULL;
	PyObject *arg;
	char *start;
	char *pgm;
	const char *footer = NULL;
	ssize_t length;
	int maxval;
	char *txt;
	size_t pgm_w;
	size_t pgm_h;
	size_t txt_w;
	size_t txt_h;
	PyObject *ret;

	arg = PyTuple_GetItem(args, 0);
	if ( arg == NULL )
		return NULL;
	if ( PyBytes_AsStringAndSize(arg, &start, &length) < 0 )
		return NULL;

	arg = PyTuple_GetItem(args, 1);
	if ( arg == NULL )
	{
		PyErr_Clear();
	}
	else
	{
		ascii = PyUnicode_AsASCIIString(arg);
		if ( ascii == NULL )
			return NULL;
		footer = PyBytes_AsString(ascii);
		if ( footer == NULL )
		{
			Py_DECREF(ascii);
			return NULL;
		}
	}

	pgm = start;
	if ( strncmp(pgm, "P5\n", 3) != 0 )
		goto bad_pgm;
	pgm = next_line(pgm);
	if ( sscanf(pgm, "%zd %zd\n", &pgm_w, &pgm_h) != 2 )
		goto bad_pgm;
	pgm = next_line(pgm);
	if ( sscanf(pgm, "%d\n", &maxval) != 1 )
		goto bad_pgm;
	pgm = next_line(pgm);
	length -= pgm - start;
	if ( length != (ssize_t) (pgm_w * pgm_h) )
		goto bad_pgm;

	txt = img2txt((uint8_t *) pgm, pgm_w, pgm_h, &txt_w, &txt_h, 6.0, footer);
	ret = PyUnicode_FromString(txt);
	free(txt);

	Py_XDECREF(ascii);
	return ret;

bad_pgm:
	Py_XDECREF(ascii);
	PyErr_SetString(asciimaton_pgm, "Invalid PGM header");
	return NULL;
}

//---------------------------------------------------------------------
static PyObject *
asciimaton_txt2img(PyObject *self, PyObject *args)
{
	PyObject *ascii = NULL;
	PyObject *arg;
	char header[0x100];
	char *txt;
	uint8_t *pix;
	size_t txt_w = 0;
	size_t txt_h = 0;
	size_t pix_w;
	size_t pix_h;
    PyObject *ret;
    PyObject *pgm_body;

	arg = PyTuple_GetItem(args, 0);
	if ( arg == NULL )
		return NULL;
	ascii = PyUnicode_AsASCIIString(arg);
	if ( ascii == NULL )
		return NULL;
	txt = PyBytes_AsString(ascii);
	if ( txt == NULL )
	{
		Py_DECREF(ascii);
		return NULL;
	}

	for ( char *p = txt; *p != '\0'; )
	{
		p = next_line(p);
		if ( txt_w == 0 )
			txt_w = p - txt - 1;
		txt_h++;
	}

	pix = txt2img(txt, txt_w, txt_h, &pix_w, &pix_h);

	snprintf(header, sizeof(header),
	         "P5\n"
	         "%zd %zd\n"
	         "255\n", pix_w, pix_h);

	ret = PyBytes_FromString(header);
	pgm_body = PyBytes_FromStringAndSize((const char *) pix, pix_h * pix_w);
	PyBytes_ConcatAndDel(&ret, pgm_body);
	free(pix);

	Py_XDECREF(ascii);

	return ret;
}

static const char img2txt_docstring[] =
"Converts PGM image (bytes) to string";
static const char txt2img_docstring[] =
"Converts string to PGM image (bytes)\n"
"May take an optional second argument (string) that will be printed as footer";

static PyMethodDef asciimaton_methods[] = {
	{ "img2txt", asciimaton_img2txt, METH_VARARGS, img2txt_docstring },
	{ "txt2img", asciimaton_txt2img, METH_VARARGS, txt2img_docstring },
	{ NULL, NULL, 0, NULL },
};

static PyModuleDef asciimaton_moduledef = {
	PyModuleDef_HEAD_INIT,
	"asciimaton",
	NULL,
	0,
	asciimaton_methods,
	NULL,
	NULL,
	NULL,
	NULL,
};

PyMODINIT_FUNC
PyInit_asciimaton(void)
{
	PyObject *module = PyModule_Create(&asciimaton_moduledef);

	asciimaton_pgm = PyErr_NewException("asciimaton.pgm", NULL, NULL);
	Py_INCREF(asciimaton_pgm);
	PyModule_AddObject(module, "error", asciimaton_pgm);

	img2txt_fix_weights();

	return module;
}
