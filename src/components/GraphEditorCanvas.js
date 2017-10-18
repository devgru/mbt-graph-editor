import {connect} from 'react-redux';

import D3Canvas from './D3Canvas';

import {
  addPoint,
  removePoint,
  toggleLink
} from '../duck';
import {bindActionCreators} from 'redux';

class GraphEditorCanvas extends D3Canvas {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      radius: 2.5
    };
  }

  getSubjectPoint = (x, y) => {
    const {radius} = this.state;

    let result = undefined;
    const radius2 = radius * radius;
    const {points} = this.props;

    points.some((point) => {
      const dx = x - point.x;
      const dy = y - point.y;
      const distance = dx ** 2 + dy ** 2;

      if (distance < radius2) {
        result = point;
        return true;
      }
      return false;
    });

    return result;
  };

  onDrag = (x, y) => {
    const {currentPoint} = this.state;
    currentPoint.x = x;
    currentPoint.y = y;
    this.renderCanvas();
  };

  renderCanvasContents = (context) => {
    const {points, links} = this.props;
    const {
      radius,
      selectedPoint,
      currentPoint,
      currentMousePosition
    } = this.state;

    if (selectedPoint) {
      context.beginPath();
      context.strokeStyle = '#930';
      context.moveTo(selectedPoint.x, selectedPoint.y);
      context.lineTo(currentMousePosition.x, currentMousePosition.y);
      context.stroke();

      if (currentPoint && currentPoint !== selectedPoint) {
        const {x, y} = currentPoint;

        context.beginPath();
        context.strokeStyle = '#930';
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.stroke();
      }
    } else {
      if (!currentPoint && currentMousePosition) {
        const {x, y} = currentMousePosition;
        context.beginPath();
        context.strokeStyle = '#333';
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.stroke();
      }
    }

    links.forEach(({id1, id2}) => {
      context.beginPath();

      const p1 = points.filter(({id}) => id === id1)[0];
      const p2 = points.filter(({id}) => id === id2)[0];

      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);

      context.strokeStyle = '#333';

      context.stroke();
    });

    points.forEach(point => {
      const {x, y} = point;
      if (point === selectedPoint) {
        context.fillStyle = '#930';
      } else {
        context.fillStyle = '#333';
      }
      context.beginPath();
      context.moveTo(x + radius, y);
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();
    });
  };

  onDoubleClick = (x, y) => {
    const {currentPoint, selectedPoint} = this.state;
    if (currentPoint) {
      this.props.removePoint(currentPoint.id);
      if (selectedPoint === currentPoint) {
        this.setState({selectedPoint: null});
      }
    } else {
      this.props.addPoint(x, y);
      this.setState({currentMousePosition: null});
    }
  };

  onClick = () => {
    const {selectedPoint, currentPoint} = this.state;

    if (selectedPoint) {
      if (currentPoint && currentPoint !== selectedPoint) {
        this.props.toggleLink(selectedPoint.id, currentPoint.id);
      }
      this.setState({
        selectedPoint: null
      });
    } else {
      this.setState({
        selectedPoint: currentPoint
      });
    }
  };

  onMouseMove = (x, y, point) => {
    this.setState({
      currentPoint: point,
      currentMousePosition: {x, y}
    });
    this.renderCanvas();
  };
}

const mapStateToProps = Object;

const mapDispatchToProps = dispatch => bindActionCreators({
  addPoint,
  removePoint,
  toggleLink
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphEditorCanvas);
