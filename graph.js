var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Graph = /** @class */ (function () {
    function Graph(data, colors) {
        var _this = this;
        if (colors === void 0) { colors = []; }
        this.names = Object.keys(data);
        this.values = this.names.map(function (name) { return data[name]; });
        this.total = this.values.reduce(function (a, b) { return a + b; }, 0);
        this.colors = this.names.map(function (_j, i) { return colors[i] || "hsl(" + i / _this.names.length * 360 + ", 66%, 50%)"; });
    }
    Object.defineProperty(Graph.prototype, "output", {
        get: function () {
            // you can add more elements
            return this.drawGraph();
        },
        enumerable: false,
        configurable: true
    });
    Graph.prototype.appendTo = function (el) {
        el.appendChild(this.output);
    };
    Graph.prototype.createSVGElement = function (name, content, attributes, style) {
        if (content === void 0) { content = ""; }
        if (attributes === void 0) { attributes = {}; }
        if (style === void 0) { style = {}; }
        var el = document.createElementNS("http://www.w3.org/2000/svg", name);
        Object.assign(el.style, style);
        el.innerHTML = content;
        for (var attr in attributes) {
            el.setAttribute(attr, attributes[attr].toString());
        }
        return el;
    };
    Graph.prototype.createHTMLElement = function (name, content, attributes, style) {
        if (content === void 0) { content = ""; }
        if (attributes === void 0) { attributes = {}; }
        if (style === void 0) { style = {}; }
        var el = document.createElement(name);
        Object.assign(el.style, style);
        el.innerHTML = content;
        for (var attr in attributes) {
            el.setAttribute(attr, attributes[attr].toString());
        }
        return el;
    };
    Graph.prototype.percents = function (i) {
        return (100 / (this.total / i)).toFixed(2) + "%";
    };
    return Graph;
}());
var BarGraph = /** @class */ (function (_super) {
    __extends(BarGraph, _super);
    function BarGraph(axisName, data, colors) {
        if (data === void 0) { data = {}; }
        if (colors === void 0) { colors = []; }
        var _this = _super.call(this, data, colors) || this;
        _this.axisName = axisName;
        return _this;
    }
    BarGraph.prototype.drawGraph = function () {
        var _this = this;
        var paper = this.createSVGElement("svg", "", {
            viewBox: "0 0 400 300"
        }, {
            border: "1px solid black"
        });
        paper.appendChild(this.createSVGElement("text", this.axisName, {
            "text-anchor": "middle",
            x: "8", y: "150"
        }, {
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: "sans-serif"
        }));
        var offsetBottom = 2, offsetTop = 25, max = Math.max.apply(Math, this.values), min = Math.min.apply(Math, this.values), orderOfMagniture = Number.parseInt("1" + "0".repeat((max - min).toFixed(0).length - 1)), maxAxisValue = Math.ceil(max / orderOfMagniture) * orderOfMagniture, yAxisScale = (300 - offsetTop) / (maxAxisValue / orderOfMagniture), xAxisScale = 400 / (this.values.length + 2);
        for (var axisValue = maxAxisValue, count = 0; axisValue >= 0; axisValue -= orderOfMagniture, count++) {
            var axisY_1 = offsetTop - offsetBottom + yAxisScale * count;
            paper.appendChild(this.createSVGElement("text", axisValue + "", {
                x: 30, y: axisY_1,
                "font-family": "sans-serif"
            }));
            paper.appendChild(this.createSVGElement("line", "", {
                x1: 0, y1: axisY_1,
                x2: 400, y2: axisY_1,
                "stroke-width": 0.1,
                stroke: "black"
            }));
        }
        var axisY = this.values.map(function (value) { return yAxisScale * (value / orderOfMagniture); });
        var x = 0;
        axisY.forEach(function (y, i) {
            if (_this.values[i] % orderOfMagniture === 0)
                return;
            paper.appendChild(_this.createSVGElement("line", "", {
                y1: 300 - offsetBottom - y,
                y2: 300 - offsetBottom - y,
                x1: 0, x2: 400,
                "stroke-dasharray": 4,
                "stroke": "gray",
                "stroke-width": 0.09
            }));
            paper.appendChild(_this.createSVGElement("text", _this.values[i] + "", {
                x: 30, y: 300 - offsetBottom - y,
                fill: "gray", "font-size": "50%",
                "font-family": "sans-serif"
            }));
        });
        axisY.forEach(function (y, i) {
            paper.appendChild(_this.createSVGElement("rect", "", {
                width: xAxisScale,
                height: y,
                x: xAxisScale + i * xAxisScale + x,
                y: 300 - offsetBottom - y,
                fill: _this.colors[i]
            })).innerHTML = "\n\t\t\t\t<animate attributeName=\"height\" from=\"0\" to=\"" + y + "\" dur=\"1s\" />\n\t\t\t\t<animate attributeName=\"y\" from=\"300\" to=\"" + (300 - offsetBottom - y) + "\" dur=\"1s\" />\n\t\t\t";
            x += 400 / _this.values.length / _this.values.length;
        });
        x = 0;
        axisY.forEach(function (y, i) {
            paper.appendChild(_this.createSVGElement("text", _this.names[i], {
                "text-anchor": "bottom",
                x: xAxisScale + i * xAxisScale + x,
                y: 300 - offsetBottom - y,
                "font-family": "sans-serif"
            }));
            x += 400 / _this.values.length / _this.values.length;
        });
        return paper;
    };
    return BarGraph;
}(Graph));
var PieChart = /** @class */ (function (_super) {
    __extends(PieChart, _super);
    function PieChart(data, colors) {
        return _super.call(this, data, colors) || this;
    }
    PieChart.prototype.drawGraph = function () {
        var _this = this;
        var paper = this.createSVGElement("svg", "", {
            viewBox: "0 0 400 400"
        }), sectorAngleArr = this.values.map(function (v) { return 360 * v / _this.total; });
        var startAngle = 0, endAngle = 0;
        for (var i = 0; i < this.names.length; i++) {
            startAngle = endAngle;
            endAngle += sectorAngleArr[i];
            var x1 = Math.round(200 + 195 * Math.cos(Math.PI * startAngle / 180));
            var y1 = Math.round(200 + 195 * Math.sin(Math.PI * startAngle / 180));
            var x2 = Math.round(200 + 195 * Math.cos(Math.PI * endAngle / 180));
            var y2 = Math.round(200 + 195 * Math.sin(Math.PI * endAngle / 180));
            paper.appendChild(this.createSVGElement("path", "", {
                fill: this.colors[i],
                d: "M200,200  L" + x1 + "," + y1 + "  A195,195 0 " + (endAngle - startAngle > 180 ? 1 : 0) + ",1 " + x2 + "," + y2 + " z"
            }));
        }
        return paper;
    };
    PieChart.prototype.drawInfo = function () {
        var _this = this;
        return this.createHTMLElement("p", this.values.map(function (value, i) { return "<span style=\"color: " + _this.colors[i] + "\">&#9632;</span> " + _this.names[i] + ": " + value + " (" + _this.percents(i) + ")"; }).join("<br />"), {
            align: "center"
        });
    };
    Object.defineProperty(PieChart.prototype, "output", {
        get: function () {
            var div = document.createElement("div");
            div.appendChild(this.drawGraph());
            div.appendChild(this.drawInfo());
            return div;
        },
        enumerable: false,
        configurable: true
    });
    return PieChart;
}(Graph));
