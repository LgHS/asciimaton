export const INCREASE_BRIGHTNESS = "INCREASE_BRIGHTNESS";
export const DECREASE_BRIGHTNESS = "DECREASE_BRIGHTNESS";
export const INCREASE_CONTRAST = "INCREASE_CONTRAST";
export const DECREASE_CONTRAST = "DECREASE_CONTRAST";

export const increaseBrightness = () => {
  return {
    type: INCREASE_BRIGHTNESS
  }
};

export const decreaseBrightness = () => {
  return {
    type: DECREASE_BRIGHTNESS
  }
};

export const increaseContrast = () => {
  return {
    type: INCREASE_CONTRAST
  }
};

export const decreaseContrast = () => {
  return {
    type: DECREASE_CONTRAST
  }
};
