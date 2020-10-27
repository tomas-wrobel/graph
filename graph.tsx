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
		max = Math.max(...values),
		itemsLength = React.Children.count(this.props.children),
		yAxisScale = (300 - offsetTop) / max,
		xAxisScale = 400 / (itemsLength + 2),
		yAxis = values.map(v => v * yAxisScale),
		numberedLines = Array(max).fill(0).map((_zero, i) => {
			const y = offsetTop - offsetBottom + yAxisScale *  i;
			return <g key={y}>
				<line x1={0} x2={400} y1={y} y2={y} stroke="#000" strokeWidth={0.5} />
				<text x={30} y={y} style={{fontFamily: "sans-serif"}}>{max - i}</text>
			</g>
		});
		let x = 0;
		const rects = React.Children.map(this.props.children, (item: Item, i) => {
			const {name, value} = item.props;
			let result = <g key={name}>
				<rect width={xAxisScale} height={yAxisScale * value} x={xAxisScale + i * xAxisScale + x} y={300 - offsetBottom - yAxis[i]} fill={colors[i]}>
					<animate attributeName="height" from={0} to={yAxisScale * value} dur="1s" />
					<animate attributeName="y" from={300} to={300 - offsetBottom - yAxis[i]} dur="1s" />
				</rect>
				<text style={{textAnchor: "start", fontFamily: "sans-serif"}} x={xAxisScale + i * xAxisScale + x} y={300 - offsetBottom - yAxis[i]}>{name}</text>
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

ReactDOM.render(
	<div>
		<BarGraph heading="Graph">
			<GraphItem value={5} name="USA" color="#0F0" />
			<GraphItem value={8} name="Canada" />
			<GraphItem value={11} name="Russia" />
		</BarGraph>
		<PieChart>
			<GraphItem value={5} name="USA" />
			<GraphItem value={8} name="Canada" color="#0FF" />
			<GraphItem value={11} name="Russia" color="#FF0" />
		</PieChart>
	</div>,
	document.body
);