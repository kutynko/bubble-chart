import './App.css'
import {CanvasChart, COLORS} from "./CanvasChart.tsx";
import {useMemo, useState} from "react";
import {ChartLegend} from "./ChartLegend.tsx";


const random = (max: number, min = 0) => Math.random() * (max - min) + min;


const generateData = () => Array(20000).fill(0).map(_ => ({
  x: random(1000000),
  y: random(1000000),
  color: Math.floor(random(10)),
  radius: Math.floor(random(10)),
  dimmed: false
}));

function App() {

  const [data, setData] = useState<Data[]>(generateData());
  const [highlightedColor, setHighlightedColor] = useState<string>();

  const d = useMemo(() => data.map(i => COLORS[i.color] === highlightedColor || !highlightedColor ? i : {
    ...i,
    dimmed: true
  }), [data, highlightedColor])

  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h1>canvas</h1>
        <button style={{marginLeft: '50px'}} onClick={() => setData(generateData())}>refresh</button>
      </div>
      <div style={{display: 'flex'}}>
        <CanvasChart width={800} height={600} data={d}/>
        <ChartLegend allColors={COLORS}
                     onSelect={c => c === highlightedColor ? setHighlightedColor(undefined) : setHighlightedColor(c)}/>
        <p>
          <ul>
            <li>приближение ctrl+scroll или кнопками внизу</li>
            <li>можно перемещать мышкой</li>
            <li>по клику в цвет в легенде, все остальные цвета приглушаются</li>
          </ul>
        </p>
      </div>
    </>
  )
}

export default App
