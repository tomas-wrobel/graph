# Benefits
1. it uses SVG - it can be infinitely resizing without loss any quality and it fits to parent
2. Choose your framework - [Typescript](https://www.typescriptlang.org/) (by Microsoft), JavaScript, [React JS](https://reactjs.org/) (by Facebook) or [TypeScript React](https://www.typescriptlang.org/docs/handbook/react.html)
# Documentation
## TypeScript / JavaScript version
Every graph inherits from abstract class `Graph`. It has these public methods:
``` typescript
Graph.prototype.appendTo(el: Node) // append the whole graph / chart to the node
constructor(data: GraphData, colors?: string[]): Graph // data is simple object name: value; colors is automatically generated so it can be omitted for some or all values.
```
And these property: 
``` typescript
Graph.prototype.output: HTMLOrSVGElement
Graph.prototype.total: number // the sum of all values 
// added in constructor
Graph.prototype.names: string[]
Graph.prototype.values: string[]
Graph.prototype.colors: string[] // every color, generated includes
```
### `PieChart`
There is no added property or method, it only overrides rendering methods
### `BarGraph`
In addition to overriding the rendering, it also adds axis names, which is something like a title.
``` typescript
constructor(axisName: string, data: GraphData, colors?: string[]): BarGraph
BarGraph.prototype.axisName: string;
```
### Examples
``` javascript
new BarGraph("Programming languages", {
	"HTML": 587,
	"JavaScript": 1578,
	"Java": 400,
	"Python": 100,
}).appendTo(document.body);
new PieChart({
	"HTML": 587,
	"JavaScript": 1578,
	"Java": 400,
	"Python": 100,
}, [
  null,
  "#FF0"
]).appendTo(document.body);
```
## React version
In React version it doesn't use object, but each Graph contains GraphItem element.
### Examples
```JSX
var graph = <BarGraph heading="Programming Languages">
	<GraphItem value={578} name="HTML" />
	<GraphItem value={1587} name="JavaScript" />
	<GraphItem value={435} name="Java" />
	<GraphItem value={198} name="Python" />
</BarGraph>
var chart = <PieChart">
	<GraphItem value={578} name="HTML" />
	<GraphItem value={1587} name="JavaScript" color="#0F0" />
	<GraphItem value={435} name="Java" color="yellow" />
	<GraphItem value={198} name="Python" />
</BarGraph>
```
