# Asciimaton web interface

Made with Reactjs.

## How to run
### UI :

- `yarn`
- `yarn start`
- serves on `localhost:8080` with hot reloading

### Controller

- `yarn run start-controller`
- serves on `localhost:8081/controller.html`

## How to Build :

- `yarn`
- `yarn run build:ui`
- `yarn run build:controller`

Build files are in `static/` and html in `templates/`

## Build on the ASCIIMATON

- `yarn`
- `yarn run prod:ui`
- `yarn run prod:controller`

### Test

**/!\ Currently broken because of led blinking messing with
the console**

Test middleware with `node ./test/fake-middleware.js`.
It will instanciate a socket on `localhost:54321`.


## Structure

```
./src // JS, CSS and images
./static // assets generated with webpack (npm run build)
./templates // prod html files
index.html // dev html entry point (for npm start command)
```

## Communication
### From Server
- printer.isReady
- button.isPressed({color: "red"|"green"|"blue"})
- asciimaton.output({asciimaton: base64buffer})
- webcam.updateFilter({filter: "contrast"|"brightness", action: "increase"|"decrease"})
- ui.reload

### From client
- led.changeState({color: "red"|"green"|"blue", state: "high"|"low"})
- webcam.output({asciimaton: base64buffer})
- printer.print
- asciimaton.save

### Remote control
Namespace: /control
- webcam.updateFilter({filter: "contrast"|"brightness", action: "increase"|"decrease"})
- button.isPressed({color: "red"|"green"|"blue"})
- ui.reload
- printer.setLineOverwrite({number: 0...4})

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
