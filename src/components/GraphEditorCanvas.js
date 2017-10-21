import {connect} from 'react-redux';

import D3Canvas from './D3Canvas';

import {
  addPoint,
  removePoint,
  toggleLink,
  loadStore
} from '../duck';
import {bindActionCreators} from 'redux';

const basicColor = '#333';
const activeColor = '#5F5';

class GraphEditorCanvas extends D3Canvas {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      radius: 2.5
    };

    this.props.loadStore();
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

    if (currentMousePosition) {
      if (selectedPoint) {
        this.strokeLine(activeColor, selectedPoint, currentMousePosition);

        if (currentPoint && currentPoint !== selectedPoint) {
          const {x, y} = currentPoint;

          this.strokeCircle(activeColor, x, y, radius);
        }
      } else {
        if (currentPoint) {
          const {x, y} = currentPoint;
          this.strokeCircle(activeColor, x, y, radius);
        } else {
          const {x, y} = currentMousePosition;
          this.strokeCircle(basicColor, x, y, radius, 1);
        }
      }
    }

    if (selectedPoint) {
      const {x, y} = selectedPoint;
      this.strokeCircle(activeColor, x, y, radius);
    }

    links.forEach(({id1, id2}) => {
      const p1 = points.filter(({id}) => id === id1)[0];
      const p2 = points.filter(({id}) => id === id2)[0];

      if (p1 && p2) {
        this.strokeLine(basicColor, p1, p2);
      }
    });

    points.forEach(point => {
      const {x, y} = point;
      this.fillCircle(basicColor, x, y, radius);
    });
  };

  onDoubleClick = (x, y) => {
    const {currentPoint, selectedPoint} = this.state;
    if (currentPoint) {
      this.props.removePoint(currentPoint.id);
      if (selectedPoint === currentPoint) {
        this.setState({
          selectedPoint: null
        });
      }
    } else {
      this.props.addPoint(x, y);
      this.setState({
        currentMousePosition: null
      });
    }
  };

  onClick = () => {
    const {selectedPoint, currentPoint} = this.state;

    if (selectedPoint) {
      if (currentPoint && currentPoint !== selectedPoint) {
        this.props.toggleLink(selectedPoint.id, currentPoint.id);
        this.setState({
          selectedPoint: currentPoint
        });
      } else {
        this.setState({
          selectedPoint: null
        });
      }
    } else {
      if (currentPoint) {
        this.setState({
          selectedPoint: currentPoint
        });
      }
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
  toggleLink,
  loadStore
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphEditorCanvas);
