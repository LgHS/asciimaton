#!/bin/bash
if hash v4l2-ctl 2>/dev/null; then
    v4l2-ctl \
    --set-ctrl brightness=27 \
    --set-ctrl contrast=38 \
    --set-ctrl saturation=0 \
    --set-ctrl gain_automatic=0 \
    --set-ctrl white_balance_automatic=0;

    echo "v4l2 settings modified";
else
    echo "v4l2-ctl not found"
fi


