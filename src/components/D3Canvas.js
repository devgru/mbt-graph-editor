import React, {Component} from 'react';

import {drag} from 'd3-drag';
import {zoom, zoomIdentity} from 'd3-zoom';
import * as d3 from 'd3-selection';

class D3Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 100,
      height: 100,
      transform: zoomIdentity
    };
  }

  canvasRef = (node) => {
    this.node = node;

    if (!node) {
      return;
    }

    const canvas = d3.select(node);

    const zoomed = () => {
      this.setState({
        transform: d3.event.transform
      });
    };

    const dragged = () => {
      const {transform} = this.state;
      const [x, y] = transform.invert([d3.event.x, d3.event.y]);
      this.onDrag(x, y);
    };

    const wrap = (fn) => () => {
      const {transform} = this.state;
      const [x, y] = transform.invert([
        d3.event.x,
        d3.event.y
      ]);

      fn(x, y, this.getSubjectPoint(x, y));
    };

    const getDragPoint = () => {
      const {transform} = this.state;
      const [x, y] = transform.invert([
        d3.event.x,
        d3.event.y
      ]);

      if (this.getSubjectPoint(x, y)) {
        return {};
      } else {
        return null;
      }
    };

    const dragInstance = drag()
      .subject(getDragPoint)
      .on('drag', dragged);
    const zoomInstance = zoom()
      .scaleExtent([1 / 2, 8])
      .on('zoom', zoomed);

    canvas
      .on('mousemove', wrap(this.onMouseMove))
      .on('click', wrap(this.onClick))
      .on('dblclick', wrap(this.onDoubleClick))
      .call(dragInstance)
      .call(zoomInstance)
      .on('dblclick.zoom', null);

    this.setState({
      context: canvas.node().getContext('2d')
    })
  };

  handleResize = () => {
    this.setState({
      width: this.node.clientWidth,
      height: this.node.clientHeight
    });
  };

  renderCanvas = () => {
    const {node} = this;
    if (!node) {
      return;
    }

    const {transform, context} = this.state;
    const canvas = d3.select(node);
    const width = canvas.property('width');
    const height = canvas.property('height');

    context.save();
    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    this.renderCanvasContents(context);
    context.restore();
  };

  fillCircle(color, x, y, radius) {
    const {context} = this.state;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  }

  strokeCircle(color, x, y, radius, width = 3) {
    const {context} = this.state;
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
  }

  strokeLine(color, p1, p2, width = 1) {
    const {context} = this.state;
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
  }

  componentDidUpdate() {
    const {node} = this;
    if (!node) {
      return;
    }

    this.renderCanvas();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const {width, height} = this.state;

    return <canvas
      width={width}
      height={height}
      ref={this.canvasRef}
    />;
  }

  ///////////////////

  getSubjectPoint = (x, y) => null;
  onDoubleClick = (x, y, point) => {};
  onClick = (x, y, point) => {};
  onMouseMove = (x, y, point) => {};
  onDrag = (x, y, point) => {};
  renderCanvasContents = (context) => {};
}

export default D3Canvas;
