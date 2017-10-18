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

    const {transform} = this.state;
    const canvas = d3.select(node);
    const context = canvas.node().getContext('2d');
    const width = canvas.property('width');
    const height = canvas.property('height');

    context.save();
    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    this.renderCanvasContents(context);
    context.restore();
  };

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