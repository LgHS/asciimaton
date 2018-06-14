#define DEBOUNCE    30

typedef unsigned char uint8_t;
typedef unsigned long uint32_t;

static const uint8_t buttons[] = { /*R*/  4, /*G*/  3, /*B*/  2 };
static const uint8_t chars  [] = {  'R',      'G',      'B'     };
static const uint8_t leds   [] = { /*R*/ 12, /*G*/ 11, /*B*/ 10 };
static uint8_t leds_in[0x100] = { 0 };


void setup()
{
    Serial.begin(115200);


    for ( uint8_t i = 0; i < 3; i++ )
    {
        pinMode(buttons[i], INPUT_PULLUP);
        pinMode(leds[i], OUTPUT);
        digitalWrite(leds[i], LOW);
    }

    leds_in['r'] = 0x00;
    leds_in['g'] = 0x10;
    leds_in['b'] = 0x20;
    leds_in['R'] = 0x01;
    leds_in['G'] = 0x11;
    leds_in['B'] = 0x21;
}

static uint8_t button_status[3];
static uint8_t last_status[3];
static uint32_t last_time[3];
static uint32_t cur_time;
__attribute__((always_inline))
static void debounce_button(uint8_t idx)
{
    uint8_t cur_status = digitalRead(buttons[idx]);
    if ( cur_status != last_status[idx] )
        last_time[idx] = cur_time;

    if ( (cur_time - last_time[idx]) > DEBOUNCE )
    {
        if ( cur_status != button_status[idx] )
        {
            if ( cur_status == 0 )
                Serial.write(chars[idx]);
            button_status[idx] = cur_status;
        }
    }

    last_status[idx] = cur_status;
}

void loop()
{
    cur_time = millis();

    debounce_button(0);
    debounce_button(1);
    debounce_button(2);

    while ( Serial.available() > 0 )
    {
        uint8_t val = Serial.read();
        uint8_t idx;

        val = leds_in[val];
        idx = val >> 4;
        val &= 0x0F;

        digitalWrite(leds[idx], val);
    }
}
