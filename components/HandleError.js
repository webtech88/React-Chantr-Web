import React from 'react';

class HandleError extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.success ?
            <div className="resStyle successStyle">
              <div className="msg">{this.props.success}</div>
              <button
                onClick={() => {
                  window.store.dispatch({ type: 'SUCCESS', success: undefined });
                }}
              >
                close
              </button>
            </div> : undefined
        }
        {
          this.props.failure ?
            <div className="resStyle failureStyle">
              <div className="msg">{this.props.failure}</div>
              <button
                onClick={() => {
                  window.store.dispatch({ type: 'FAILURE', failure: undefined });
                }}
              >
                close
              </button>
            </div> : undefined
        }
      </div>
    );
  }
}

export default HandleError;
