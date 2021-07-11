
var svg = d3.select("svg"),
  margin = 300,
  diameter = +svg.attr("width"),
  g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 3.2 + ")");

var color = d3.scaleLinear()
  .domain([-1, 5])
  .range(["#1E3932", "#02754B"])
  .interpolate(d3.interpolateHcl);

var pack = d3.pack()
  .size([diameter - margin, diameter - margin])
  .padding(2);

d3.json("components.json", function (error, root) {
  if (error) throw error;

  root = d3.hierarchy(root)
    .sum(function (d) { return 10; })
    .sort(function (a, b) { return b.value - a.value; });

  var focus = root,
    nodes = pack(root).descendants(),
    view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
    .style("fill", function (d) { return d.children ? color(d.depth) : null; })
    .on("click", function (d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", function (d) { return d.parent === root ? 2 : 0; })
    .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
    .text(function (d) { return d.data.name; });

  var node = g.selectAll("circle,text");

  svg
    .style("background", color(-1))
    .on("click", function () { zoom(root); });

  zoomTo([root.x, root.y, root.r * 3 + margin]);

  function zoom(d) {
    var parentName = document.getElementById("parentname");
    console.log(d.depth, d.data.name);
    parentName.innerHTML = d.data.name;
    
    var focus0 = focus; focus = d;

    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function (d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 4]);
        return function (t) { zoomTo(i(t)); };
      });

    transition.selectAll("text")
      .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
      .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
      .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
      .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function (d) { return d.r * k; });
  }

  /////////////////////////////////////////////////////////
  /* context menu - when click mouse right button on node */
  // Add a context menu
  node.on('contextmenu', d3.contextMenu(menu));

  var menu = [
    {
            title: 'Rename node',
            action: function(elm, d, i) {
                    console.log('Rename node');
            }
    },
    {
            title: 'Delete node',
            action: function(elm, d, i) {
                    console.log('Delete node');
            }
    },
    {
            title: 'Create child node',
            action: function(elm, d, i) {
                    console.log('Create child node');
            }
    }
]


});


    
//  d3.event.preventDefault();


// show modals 
$(".test").click(function(){
  $("#renameNodeModal").modal("show");
});

$(".close_modal").on('click',function(){
  $(".modal").modal("hide");
});

$(".rename_node").on('click', function(){
  console.log("rename node");
});
