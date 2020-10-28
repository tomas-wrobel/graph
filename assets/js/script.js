document.getElementById("main-content").insertBefore(new BarGraph("Programming languages", {
 "HTML": 587,
 "JavaScript": 1578,
 "Java": 400,
 "Python": 100,
}).output, document.getElementById("react-version"))
document.getElementById("main-content").insertBefore(new PieChart({
 "HTML": 587,
 "JavaScript": 1578,
 "Java": 400,
 "Python": 100,
}, [
  null,
  "#FF0"
]).output, document.getElementById("react-version"))
