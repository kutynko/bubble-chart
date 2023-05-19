type ChartLegendProps = {
  allColors: string [];
  onSelect: (color: string) => void
}
export function ChartLegend({allColors, onSelect}: ChartLegendProps) {
  return <div>
    {allColors.map(c => <div key={c} style={{margin: '0.3em', backgroundColor: c, width: '60px', height: '40px'}} onClick={() => onSelect(c)}>&nbsp;</div>)}
  </div>
}
