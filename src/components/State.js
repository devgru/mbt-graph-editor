import React, {Component} from 'react';
import {connect} from 'react-redux';

import Cover from './Cover';
import Loading from './Loading';
import Failed from './Failed';

class State extends Component {
  render() {
    const {loading, failed} = this.props;

    return failed ? (
      <Cover>
        <Failed />
      </Cover>
    ) : loading ? (
      <Cover>
        <Loading />
      </Cover>
    ) : null;
  }
}

const mapStateToProps = ({loading, failed}) => ({loading, failed});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(State);
