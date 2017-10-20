const theta = Math.PI * (3 - Math.sqrt(5));

const phyllotaxis = radius => i => {
  const r = radius * Math.sqrt(i);
  const a = theta * i;
  return {
    id: i,
    x: 500 + r * Math.cos(a),
    y: 500 + r * Math.sin(a)
  };
};

export default phyllotaxis;
