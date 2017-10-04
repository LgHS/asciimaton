import {CHANGE_STATE} from "../actions/actions";

export const COLORS = ['green', 'red', 'blue'];

export const STATES = {
  COUNTDOWN: "countdown",
  LIVE: "live",
  LOGO: "logo",
  NOT_CONNECTED: "notConnected",
  PRINT: "print",
  SHARE: "share",
  STILL: "still",
  WAITING: "waiting",
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
      green: {next: null},
      red: {next: null},
      blue: {next: null}
    }
  },

  [STATES.WAITING]: {
    name: STATES.WAITING,
    url: null,
    leds: {
      green: 0,
      red: 0,
      blue: 0
    },
    buttons: {
      green: {next: null},
      red: {next: null},
      blue: {next: null}
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
      green: {next: STATES.LIVE},
      red: {next: STATES.LIVE},
      blue: {next: STATES.LIVE}
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
      green: {next: STATES.COUNTDOWN},
      red: {next: STATES.LOGO},
      blue: {next: null}
    }
  },

  [STATES.COUNTDOWN]: {
    name: STATES.COUNTDOWN,
    url: null,
    leds: {
      green: 0,
      red: 0,
      blue: 0
    },
    buttons: {
      green: {next: null},
      red: {next: STATES.LIVE},
      blue: {next: null}
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
      green: {next: null},
      red: {next: STATES.LIVE},
      blue: {next: STATES.SHARE}
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
      green: {next: STATES.PRINT, payload: {share: true}},
      red: {next: STATES.PRINT, payload: {share: false}},
      blue: {next: null}
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
      green: {next: null},
      red: {next: null},
      blue: {next: null}
    }
  }
};

const initialState = {
  ...STATE_MACHINE[STATES.NOT_CONNECTED],
  payload: {}
};

const stateMachine = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_STATE:
      return {
        ...STATE_MACHINE[action.state],
        payload: action.payload
      }
  }
  return state;
};

export default stateMachine;