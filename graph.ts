type GraphData = {
	[x: string]: number
};

type Attributes = {
	[x: string]: string|number;
}

abstract class Graph {
	public names: string[];
	public values: number[];
	public colors: string[];
	protected total: number;
	public constructor(data: GraphData = {}, colors: string[] = []) {
		this.names = Object.keys(data);
		this.values = this.names.map(name => data[name]);
		this.total = this.values.reduce((a, b) => a + b, 0);
		this.colors = this.names.map((_j, i) => colors[i] || `hsl(${i / this.names.length * 360}, 66%, 50%)`);
	}
	protected abstract drawGraph(): HTMLElement|SVGSVGElement;
	public get output(): HTMLElement|SVGSVGElement {
		// you can add more elements
		return this.drawGraph();
	}
	public appendTo(el: Node) {
		el.appendChild(this.output);
	}
	protected createSVGElement<tagName extends keyof SVGElementTagNameMap>(name: tagName, content = "", attributes: Attributes = {}, style = {}): SVGElementTagNameMap[tagName] {
		var el = document.createElementNS("http://www.w3.org/2000/svg", name);
		Object.assign(el.style, style);
		el.innerHTML = content;
		for (const attr in attributes) {
			el.setAttribute(attr, attributes[attr].toString());
		}
		return el;
	}
	protected createHTMLElement<tagName extends keyof HTMLElementTagNameMap>(name: tagName, content = "", attributes: Attributes = {}, style = {}): HTMLElementTagNameMap[tagName] {
		var el = document.createElement(name);
		Object.assign(el.style, style);
		el.innerHTML = content;
		for (const attr in attributes) {
			el.setAttribute(attr, attributes[attr].toString());
		}
		return el;
	}
	public percents(i: number) {
		return (100 / (this.total / i)).toFixed(2) + "%";
	}
}

class BarGraph extends Graph {
	axisName: string;
	constructor(axisName: string, data: GraphData = {}, colors: string[] = []) {
		super(data, colors);
		this.axisName = axisName;
	}
	drawGraph() {
		const paper = this.createSVGElement(
			"svg", "",
			{
				viewBox: `0 0 400 300`
			},
			{
				border: "1px solid black"
			}
		);
		paper.appendChild(this.createSVGElement(
			"text", this.axisName,
			{
				"text-anchor": "middle",
				x: "8", y: "150",
			},
			{
				writingMode: "vertical-rl",
				textOrientation: "mixed",
				fontFamily: "Arial"
			}
		));
		const offsetBottom = 2, offsetTop = 25,
		max = Math.max(...this.values),
		yAxisScale = (300 - offsetTop) / max,
		xAxisScale = 400 / (this.values.length + 2);
		for (let axisValue = max, count = 0; axisValue >= 0; axisValue--, count++) {
			let axisY = offsetTop - offsetBottom + yAxisScale *  count;
			paper.appendChild(this.createSVGElement(
				"text", Math.max(axisValue, 0) + "", {
					x: 30, y: axisY,
					"font-family": "Arial"
				}
			));
			paper.appendChild(this.createSVGElement(
				"line", "", {
					x1: 0, y1: axisY,
					x2: 400, y2: axisY,
					"stroke-width": 0.1,
					stroke: "black"
				} 
			));
		}
		const axisY = this.values.map(value => yAxisScale * value);
		let x = 0;
		axisY.forEach((y, i) => {
			paper.appendChild(
				this.createSVGElement(
					"rect", "", {
						width: xAxisScale,
						height: yAxisScale * this.values[i],
						x: xAxisScale + i * xAxisScale + x,
						y: 300 - offsetBottom - y,
						fill: this.colors[i]
					}
				)
			).innerHTML = `
				<animate attributeName="height" from="0" to "${yAxisScale * this.values[i]}" dur="1s" />
				<animate attributeName="y" from="300" to="${300 - offsetBottom - y}" dur="1s" />
			`;
			x += 400 / this.values.length / this.values.length;
		});
		x = 0;
		axisY.forEach((y, i) => {
			paper.appendChild(
				this.createSVGElement(
					"text", this.names[i], {
						"text-anchor": "bottom",
						x: xAxisScale + i * xAxisScale + x,
						y: 300 - offsetBottom - y,
						"font-family": "Arial"
					}
				)
			)
			x += 400 / this.values.length / this.values.length;
		});
		return paper;
	}
}

class PieChart extends Graph {
	public constructor(data?: GraphData, colors?: string[]) {
		super(data, colors);
	}
	protected drawGraph() {
		const paper = this.createSVGElement(
			"svg", "", {
				viewBox: "0 0 400 400"
			}
		),
		sectorAngleArr = this.values.map(v => 360 * v / this.total);
		let startAngle = 0, endAngle = 0;

		for (let i = 0; i < this.names.length; i++) {
			startAngle = endAngle;
			endAngle += sectorAngleArr[i];

			let x1 = Math.round(200 + 195 * Math.cos(Math.PI*startAngle/180));
			let y1 = Math.round(200 + 195 * Math.sin(Math.PI*startAngle/180));

			let x2 = Math.round(200 + 195 * Math.cos(Math.PI*endAngle/180));
			let y2 = Math.round(200 + 195 * Math.sin(Math.PI*endAngle/180));

			paper.appendChild(this.createSVGElement(
				"path", "", {
					fill: this.colors[i],
					d: `M200,200  L${x1},${y1}  A195,195 0 ${endAngle - startAngle > 180 ? 1 : 0},1 ${x2},${y2} z`
				}
			));
		}

		return paper;
	}
	protected drawInfo() {
		return this.createHTMLElement(
			"p", this.values.map((value, i) => `<span style="color: ${this.colors[i]}">&#9632;</span> ${this.names[i]}: ${value} (${this.percents(i)})`).join("<br />"),
			{
				align: "center"
			}
		);
	}
	get output() {
		const div = document.createElement("div");
		div.appendChild(this.drawGraph());
		div.appendChild(this.drawInfo());
		return div;
	}
}