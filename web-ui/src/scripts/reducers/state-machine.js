import {CHANGE_STATE} from "../actions/actions";

export const COLORS = ['green', 'red', 'blue'];

export const STATES = {
  NOT_CONNECTED: "notConnected",
  LOGO: "logo",
  LIVE: "live",
  COUNTDOWN: "countdown",
  STILL: "still",
  SHARE: "share",
  PRINT: "print"
};

export const STATE_MACHINE = {
  [STATES.NOT_CONNECTED]: {
    name: STATES.NOT_CONNECTED,
    url: "/",
    leds: {
      green: 0,
      red: 0,
      blue: 0
    },
    buttons: {
      green: null,
      red: null,
      blue: null
    }
  },

  [STATES.LOGO]: {
    name: STATES.LOGO,
    url: "/",
    leds: {
      green: 1,
      red: 1,
      blue: 1,
      blinking: true
    },
    buttons: {
      green: STATES.LIVE,
      red: STATES.LIVE,
      blue: STATES.LIVE
    }
  },

  [STATES.LIVE]: {
    name: STATES.LIVE,
    url: "/live",
    leds: {
      green: 1,
      red: 1,
      blue: 0
    },
    buttons: {
      green: STATES.STILL,
      red: STATES.LOGO,
      blue: null
    }
  },

  [STATES.STILL]: {
    name: STATES.STILL,
    url: "/still",
    leds: {
      green: 0,
      red: 1,
      blue: 1
    },
    buttons: {
      green: null,
      red: STATES.LIVE,
      blue: STATES.SHARE
    }
  },

  [STATES.SHARE]: {
    name: STATES.SHARE,
    url: "/share",
    leds: {
      green: 1,
      red: 1,
      blue: 0
    },
    buttons: {
      green: STATES.PRINT,
      red: STATES.PRINT,
      blue: null
    }
  },
  [STATES.PRINT]: {
    name: STATES.PRINT,
    url: "/print",
    leds: {
      green: 0,
      red: 0,
      blue: 0
    },
    buttons: {
      green: null,
      red: null,
      blue: null
    }
  }
};

const initialState = {
  ...STATE_MACHINE[STATES.NOT_CONNECTED]
};

const stateMachine = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_STATE:
      return {
        ...STATE_MACHINE[action.state]
      }
  }
  return state;
};

export default stateMachine;