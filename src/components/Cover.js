import React, {Component} from 'react';

import './Cover.css';

class Cover extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className="Cover">
        {children}
      </div>
    );
  }
}

export default Cover;
