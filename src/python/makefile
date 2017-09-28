
all: asciimaton.so

.DELETE_ON_ERROR:

CFLAGS=-O2 -Wall
CXXFLAGS=-O2 -Wall

weighter: weighter.c pgm.o pgm.h algo_img2txt.h
	$(CC) -o $@ $< pgm.o $(CFLAGS)

weights.c: font.pgm weighter weighter.c pgm.c pgm.h
	./weighter $< > $@

fonter: fonter.c pgm.o pgm.h algo_img2txt.h
	$(CC) -o $@ $< pgm.c $(CFLAGS)

font.c: font.pgm fonter fonter.o pgm.c pgm.h
	./fonter $< > $@

asciimaton.so: asciimatonmodule.c algo_img2txt.o img2txt.o algo_txt2img.o txt2img.o
	$(CC) -shared -o $@ $^ -Wall `python2.7-config --cflags --ldflags`

algo_img2txt.o: algo_img2txt.c weights.c
algo_txt2img.o: algo_txt2img.c font.c

%.o: %.c
	$(CC) -o $@ -c $< $(CFLAGS)

clean::
	rm -f weighter weights.c fonter font.c *.o asciimaton.so
