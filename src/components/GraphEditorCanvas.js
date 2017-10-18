import D3Canvas from './D3Canvas';

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
    const {points} = this.props;
    const {radius, selectedPoint, currentMousePosition} = this.state;

    if (selectedPoint) {
      context.beginPath();
      context.strokeStyle = '#0F0';
      context.moveTo(selectedPoint.x, selectedPoint.y);
      context.lineTo(currentMousePosition.x, currentMousePosition.y);
      context.stroke();
    }

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

  onDoubleClick = (x, y, point) => {
    // delete point?
  };

  onClick = (x, y, point) => {
    if (this.state.selectedPoint) {
      // add point
    }
    this.setState({
      selectedPoint: point
    });
  };

  onMouseMove = (x, y, point) => {
    this.setState({
      currentPoint: point,
      currentMousePosition: {x, y}
    });
    this.renderCanvas();
  };
}

export default GraphEditorCanvas;