type Item = React.Component<{
	color?: string,
	value: number,
	name: string
}>;

class GraphItem extends React.Component<{
	color?: string,
	value: number,
	name: string
}> {
	render() {
		return (<g></g>)
	}
}

class BarGraph extends React.Component<{heading: string}> {
	render() {
		const offsetBottom = 2, offsetTop = 25,
		values = React.Children.map(this.props.children, (item: Item) => item.props.value),
		colors = React.Children.map(this.props.children, (graphItem: Item, i) => graphItem.props.color || `hsl(${i / values.length * 360}, 66%, 50%)`),
		max = Math.max(...values), min = Math.min(...values),
		itemsLength = React.Children.count(this.props.children),
		orderOfMagniture = Number.parseInt("1" + "0".repeat((max - min).toFixed(0).length -1)),
		xAxisScale = 400 / (itemsLength + 2),
		maxAxisValue = Math.ceil(max / orderOfMagniture) * orderOfMagniture,
		yAxisScale = (300 - offsetTop) / (maxAxisValue / orderOfMagniture),
		yAxis = values.map(v => yAxisScale * (v / orderOfMagniture)),
		numberedLines = (function (arr) {
			for (let axisValue = maxAxisValue, count = 0; axisValue >= 0; axisValue -= orderOfMagniture, count++) {
				let y = offsetTop - offsetBottom + yAxisScale *  count;
				arr.push(
					<g key={axisValue}>
						<line x1={0} x2={400} y1={y} y2={y} stroke="gray" strokeWidth={0.1} />
						<text x={15} y={y} style={{fontFamily: "sans-serif"}}>{axisValue}</text>
					</g>
				);
			}
			return arr;
		})(new Array<JSX.Element>());
		let x = 0;
		const rects = React.Children.map(this.props.children, (item: Item, i) => {
			const {name, value} = item.props,
			y = 300 - offsetBottom - yAxis[i],
			numberedLine = <g>
				<line strokeDasharray={4} stroke="gray" strokeWidth={0.09} y1={y} y2={y} x1={0} x2={400} />
				<text fill="gray" style={{fontFamily: "sans-serif", fontSize: "50%"}} x={15} y={y}>{values[i]}</text>
			</g>
			let result = <g key={name}>
				<rect width={xAxisScale} height={yAxis[i]} x={xAxisScale + i * xAxisScale + x} y={y} fill={colors[i]}>
					<animate attributeName="height" from={0} to={yAxis[i]} dur="1s" />
					<animate attributeName="y" from={300} to={y} dur="1s" />
				</rect>
				<text style={{textAnchor: "start", fontFamily: "sans-serif"}} x={xAxisScale + i * xAxisScale + x} y={300 - offsetBottom - yAxis[i]}>{name}</text>
				{value % orderOfMagniture != 0 && numberedLine}
			</g>
			x += 400 / itemsLength / itemsLength;
			return result;
		})

		return <svg viewBox="0 0 400 300" style={{border: "1px solid black"}}>
			<text style={{
				fontFamily: "sans-serif",
				writingMode: "vertical-rl",
				textOrientation: "mixed"
			}} textAnchor="middle" x={8} y={150}>{this.props.heading}</text>
			{numberedLines}
			{rects}
		</svg>
	}
}

class PieChart extends React.Component {
	render() {
		let startAngle = 0, endAngle = 0;
		const total = React.Children.map(this.props.children, (pieItem: Item) => pieItem.props.value).reduce((a, b) => a + b, 0);
		const colors = React.Children.map(this.props.children, (pieItem: Item, i) => pieItem.props.color || `hsl(${i / React.Children.count(this.props.children) * 360}, 66%, 50%)`);
		const info = React.Children.map(this.props.children, (pieItem: Item, i) => (
			<div><span style={{color: colors[i]}}>&#9632;</span> {pieItem.props.name}: {pieItem.props.value} ({Math.round(100 / (total / pieItem.props.value))}%)</div>
		));
		const arcs = React.Children.map(this.props.children, (pieItem: Item, i) => {
			startAngle = endAngle;
			endAngle = startAngle + (360 * pieItem.props.value / total);
			let x1 = Math.round(200 + 195 * Math.cos(Math.PI*startAngle/180));
			let y1 = Math.round(200 + 195 * Math.sin(Math.PI*startAngle/180));

			let x2 = Math.round(200 + 195 * Math.cos(Math.PI*endAngle/180));
			let y2 = Math.round(200 + 195 * Math.sin(Math.PI*endAngle/180));
			return <path d={`M200,200  L${x1},${y1}  A195,195 0 ${endAngle - startAngle > 180 ? 1 : 0},1 ${x2},${y2} z`} fill={colors[i]} />
		});
		return <div style={{textAlign: "center", fontFamily: "sans-serif"}}>
			<svg viewBox="0 0 400 400">
				{arcs}
			</svg>
			{info}
		</div>
	}
}