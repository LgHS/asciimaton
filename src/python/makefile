
all: asciimaton

.DELETE_ON_ERROR:

CFLAGS=-O2 -Wall
CXXFLAGS=-O2 -Wall

# comment this out to enable tty gpio emulation
TTY_EMU=1

ifndef TTY_EMU
io.o: CFLAGS+=-DRPI_GPIO
asciimaton: LDFLAGS+=-lpigpiod_if2
endif

asciimaton: LDFLAGS=`pkg-config --cflags --libs gstreamer-1.0` -lrt -lpthread

weighter: weighter.c pgm.o pgm.h algo_img2txt.h
	$(CC) -o $@ $< pgm.o $(CFLAGS)

weights.c: font.pgm weighter weighter.c pgm.c pgm.h
	./weighter $< > $@

fonter: fonter.c pgm.o pgm.h algo_img2txt.h
	$(CC) -o $@ $< pgm.c $(CFLAGS)

font.c: font.pgm fonter fonter.o pgm.c pgm.h
	./fonter $< > $@

algo_img2txt.o: algo_img2txt.c weights.c
algo_txt2img.o: algo_txt2img.c font.c

asciimaton: asciimaton.cpp pgm.o txt.o algo_img2txt.o img2txt.o algo_txt2img.o txt2img.o lp.o cp.o io.o
	$(CXX) -o $@ $^ $(CXXFLAGS) $(LDFLAGS)

img2txt: img2txt.cpp algo_img2txt.o pgm.o txt.o
	$(CXX) -o $@ $^ -DSTANDALONE

txt2img: txt2img.cpp algo_txt2img.o pgm.o txt.o
	$(CXX) -o $@ $^ -DSTANDALONE

print: print.o lp.o
	$(CXX) -o $@ $^ $(LDFLAGS)

%.o: %.cpp
	$(CXX) -o $@ -c $< $(CXXFLAGS)

%.o: %.c
	$(CC) -o $@ -c $< $(CFLAGS)

clean::
	rm -f asciimaton weighter weights.c fonter font.c *.o print txt2img img2txt
