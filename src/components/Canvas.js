import React, {Component} from 'react';

import { drag } from 'd3-drag';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
import * as d3 from 'd3-selection';
import { range } from 'd3-array';

function phyllotaxis(radius) {
  const theta = Math.PI * (3 - Math.sqrt(5));
  return function (i) {
    const r = radius * Math.sqrt(i), a = theta * i;
    return [
      r * Math.cos(a),
      r * Math.sin(a)
    ];
  };
}

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 100,
      height: 100,
      points: range(1, 2000).map(phyllotaxis(10)),
      transform: zoomIdentity,
      radius: 2.5
    };
  }

  canvasRef = (node) => {
    this.node = node;

    if (!node) {
      return;
    }

    const canvas = select(node);

    const { points, radius } = this.state;

    const zoomed = () => {
      this.setState({
        transform: d3.event.transform
      });
    };

    const dragged = () => {
      const { transform } = this.state;
      d3.event.subject[0] = transform.invertX(d3.event.x);
      d3.event.subject[1] = transform.invertY(d3.event.y);
      this.renderCanvas();
    };

    const dragPoint = () => {
      const { transform } = this.state;
      const x = transform.invertX(d3.event.x);
      const y = transform.invertY(d3.event.y);

      for (let i = points.length - 1; i >= 0; --i) {
        const point = points[i];
        const dx = x - point[0];
        const dy = y - point[1];
        if (dx * dx + dy * dy < radius * radius) {
          point.x = transform.applyX(point[0]);
          point.y = transform.applyY(point[1]);
          return point;
        }
      }
    };

    canvas
      .call(drag().subject(dragPoint).on('drag', dragged))
      .call(zoom().scaleExtent([1 / 2, 8]).on('zoom', zoomed));
  };

  renderCanvas = () => {
    const { node } = this;
    if (!node) {
      return;
    }

    const { points, transform, radius } = this.state;
    const canvas = select(node);
    const context = canvas.node().getContext('2d');
    const width = canvas.property('width');
    const height = canvas.property('height');

    context.save();
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
    points.forEach((point) => {
      context.moveTo(point[0] + radius, point[1]);
      context.arc(point[0], point[1], radius, 0, 2 * Math.PI);
    });
    context.fill();
    context.restore();
  };

  handleResize = () => {
    this.setState({
      width: this.node.clientWidth,
      height: this.node.clientHeight
    });
  };

  componentDidUpdate() {
    const { node } = this;
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
    const { width, height } = this.state;

    return <canvas
      width={width}
      height={height}
      ref={this.canvasRef}
    />;
  }
}

export default Canvas;