import React, {useEffect, useRef, useState} from "react";

type CanvasChartProps = {
  width: number
  height: number;
  data: Data[]
}

export const COLORS = ['red', 'orange', 'yellow', 'green', '#2196f3', 'blue', 'purple', 'gray', 'lightgray', 'black'];
export const DIMMED_COLORS = ['rgba(255,0,0,0.3)', 'rgba(255,165,0,0.3)', 'rgba(255,255,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(33,150,243,0.3)', 'rgba(0,0,255,0.3)', 'rgba(128,0,128,0.3)', 'rgba(128,128,128,0.3)', 'rgba(211,211,211,0.3)', 'rgba(0,0,0,0.3)'];


const coordinatesTranslator = (width: number, height: number, zoom: number, maxX: number, maxY: number) => {
  const xF = width / maxX * zoom;
  const yF = height / maxY * zoom;

  return {
    X: (x: number) => x * xF,
    Y: (y: number) => y * yF
  };
}


export function CanvasChart({width, height, data}: CanvasChartProps) {

  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [frame, setFrame] = useState<Coordinates>({x: 0, y: 0});
  const [panStart, setPanStart] = useState<Coordinates>();


  useEffect(() => {
    const canvas = canvasEl.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const {X, Y} = coordinatesTranslator(width, height, zoom, 1000000, 1000000);

    for (const i of data) {
      const x = X(i.x) + frame.x;
      const y = Y(i.y) + frame.y;

      if (x < 0 || x > width) continue;
      if (y < 0 || y > height) continue;

      ctx.fillStyle = i.dimmed ? DIMMED_COLORS[i.color] : COLORS[i.color];
      ctx.beginPath();
      ctx.arc(x, y, i.radius, 0, 360);
      ctx.fill();
    }
  }, [data, zoom, frame])

  const startPan = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setPanStart({x: e.clientX - frame.x, y: e.clientY - frame.y});
  }

  const doPan = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!panStart) return;
    const x = e.clientX - panStart.x;
    const y = e.clientY - panStart.y;

    setFrame({x, y});
  }

  const endPan = () => {
    setPanStart(undefined);
  }

  const handleZoom = (delta: number) => {
    setZoom(z => {
      let newZ = z + delta;
      if (newZ > 100) newZ = 100;
      if (newZ < 1) newZ = 1;
      return newZ;
    })
  }

  const wheelZoom = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!e.ctrlKey) return;
    handleZoom(e.deltaY * 0.8 / 100);
  }

  return <div>
    <canvas id="canvas" width={width} height={height} ref={canvasEl}
            onMouseDown={startPan}
            onMouseMove={doPan}
            onMouseUp={endPan}
            onWheel={wheelZoom}></canvas>
    <div>
      zoom
      <button onClick={() => handleZoom(-0.1)}>-</button>
      <button onClick={() => handleZoom(0.1)}>+</button>
      ({Math.floor(zoom * 1000) / 1000})
      <button onClick={() => {
        setZoom(1);
        setFrame({x: 0, y: 0})
        setPanStart(undefined)
      }}>reset</button>
    </div>

  </div>
}
