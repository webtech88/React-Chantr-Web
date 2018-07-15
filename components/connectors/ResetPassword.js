import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ResetPassword from '../pages/ResetPassword';
import * as Actions from '../../Actions';

function mapStateToProps(state) {
  return {
    ...state,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
