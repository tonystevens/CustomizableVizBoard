Template.circleDataTree.rendered = function(){
	var datas = this.data;

  var diameter = window.innerHeight;

  var tree = d3.layout.tree()
      .size([360, diameter / 2 - 100])
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var svg = d3.select("#dataTree_circle").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


  var tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("opacity", 0);

  function mouseOverArc(d) {
       d3.select(this).attr("stroke","black")
       
          tooltip.html(format_description(d));
          return tooltip.transition()
            .duration(50)
            .style("opacity", 0.9);
        }

  function mouseOutArc(){
    d3.select(this).attr("stroke","")
    return tooltip.style("opacity", 0);
  }

  function mouseMoveArc (d) {
            return tooltip
              .style("top", (d3.event.pageY-10)+"px")
              .style("left", (d3.event.pageX+10)+"px");
  }

  function format_description(d) {
  var description = d.description;
      return  '<b>' + d.name + '</b></br>'+ d.status + ')';
  }

  Deps.autorun(function(){
    d3.json(datas.data, function(error, root) {
      if (error) throw error;

      var nodes = tree.nodes(root),
          links = tree.links(nodes);

      var link = svg.selectAll(".link")
          .data(links)
          .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

      var node = svg.selectAll(".node")
          .data(nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

      node.append("circle")
          .attr("r", 4.5);

      node.append("text")
          .attr("dy", ".31em")
          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
          .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
          .text(function(d) { return d.name; })
          .on("mouseover", mouseOverArc)
          .on("mousemove", mouseMoveArc)
          .on("mouseout", mouseOutArc);
    })
  });

  d3.select(self.frameElement).style("height", diameter - 150 + "px");
}
