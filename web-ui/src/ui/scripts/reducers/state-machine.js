import {CHANGE_STATE} from "../actions/actions";

// export const COLORS = ['green', 'red', 'blue'];
export const COLORS = {
  green: 'green',
  red: 'red',
  blue: 'blue',
};

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
    leds: [],
    buttons: {
      green: {next: null},
      red: {next: null},
      blue: {next: null}
    }
  },

  [STATES.WAITING]: {
    name: STATES.WAITING,
    url: null,
    leds: [],
    buttons: {
      green: {next: null},
      red: {next: null},
      blue: {next: null}
    }
  },

  [STATES.LOGO]: {
    name: STATES.LOGO,
    url: "/",
    leds: [COLORS.green, COLORS.red, COLORS.blue],
    buttons: {
      green: {next: STATES.LIVE},
      red: {next: STATES.LIVE},
      blue: {next: STATES.LIVE}
    }
  },

  [STATES.LIVE]: {
    name: STATES.LIVE,
    url: "/live",
    leds: [COLORS.green, COLORS.red],
    buttons: {
      green: {next: STATES.COUNTDOWN},
      red: {next: STATES.LOGO},
      blue: {next: null}
    }
  },

  [STATES.COUNTDOWN]: {
    name: STATES.COUNTDOWN,
    url: null,
    leds: [],
    buttons: {
      green: {next: null},
      red: {next: null},
      blue: {next: null}
    }
  },

  [STATES.STILL]: {
    name: STATES.STILL,
    url: "/still",
    leds: [COLORS.red, COLORS.blue],
    buttons: {
      green: {next: null},
      red: {next: STATES.LIVE},
      blue: {next: STATES.SHARE}
    }
  },

  [STATES.SHARE]: {
    name: STATES.SHARE,
    url: "/share",
    leds: [COLORS.green, COLORS.red],
    buttons: {
      green: {next: STATES.PRINT, payload: {share: true}},
      red: {next: STATES.PRINT, payload: {share: false}},
      blue: {next: null}
    }
  },
  [STATES.PRINT]: {
    name: STATES.PRINT,
    url: "/print",
    leds: [],
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