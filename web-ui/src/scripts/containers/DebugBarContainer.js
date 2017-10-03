
import {enterGodMode, exitGodMode, openSettings} from "../actions/actions";
import {connect} from "react-redux";
import DebugBar from "../components/DebugBar";

const mapStateToProps = state => {
  return {
    godMode: state.ui.godMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onKonamiCode: () => {
      dispatch(enterGodMode());
    },
    onSettingsClick: () => {
      dispatch(openSettings());
    },
    onClose: () => {
      dispatch(exitGodMode());
    }
  }
};

const DebugBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugBar);

export default DebugBarContainer;