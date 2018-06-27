#!/bin/bash

# start screen with jerome's python stuff
screen -dmS python  /home/pi/fessomaton/python_start.sh

# Run this script in display 0 - the monitor
export DISPLAY=:0

# Hide the mouse from the display
# unclutter &

# If Chromium crashes (usually due to rebooting), clear the crash flag so we don't have the annoying warning bar
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

/usr/bin/chromium-browser --start-maximized --kiosk --window-position=0,0 http://localhost:54321 &
