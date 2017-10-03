# Asciimaton web interface

Made with Reactjs.

## Dev :

- `yarn` or `npm install`
- `npm start` 
- serves on `localhost:8080` with hot reloading

## Build :

- `yarn` or `npm install`
- `npm run build`

## Test

Test middleware with `node ./test/fake-middleware.js`.
It will instanciate a socket on `localhost:54321`.

## Communication
### From server

  - printer.isReady
  - button.isPressed({color: "RED"|"GREEN"|"BLUE"})
  - asciimaton.output({picture: base64buffer})
  
### From client
  - led.changeState({color: "RED"|"GREEN"|"BLUE", state: "HIGH|LOW"})
  - webcam.output({picture: base64buffer})
  - printer.print
  - asciimaton.save
  
## States
### NOT CONNECTED
Waiting for connection to socket server

LEDs:
- none

Buttons:
- none

### LOGO
Standby screen

LEDs: 
- all, blinking

Buttons: 
- all => LIVE

### LIVE
Webcam up

LEDs: 
- green 
- red

Buttons:
- green => COUNTDOWN
- red => LOGO

### COUNTDOWN
Countdown from 3 to 1, then take picture

LEDs:
- none

Buttons:
- none

### STILL
Display picture modified by ascii script.

LEDs:
- red
- blue

Buttons:
- red => LIVE
- blue => SHARE

### SHARE
Choose to share the picture or not

LEDs:
- green
- red

Buttons:
- green => PRINT
- red => PRINT

### PRINT
Printer is working

LEDs:
- none

Buttons:
- none