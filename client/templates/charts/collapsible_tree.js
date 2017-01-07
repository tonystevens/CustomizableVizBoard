Template.collapsibleDataTree.rendered = function(){
  var datas = this.data;

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = window.innerWidth - margin.right - margin.left,
      height = window.innerHeight - margin.top - margin.bottom;

    var i = 0,
      duration = 750,
      root;
 
    var tree = d3.layout.tree()
      .size([height, width]);
 
    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });
 
    var svg = d3.select("#dataTree_collapse").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    Deps.autorun(function(){
      d3.json(datas.data, function(error, flare) {
        root = flare;
        root.x0 = height / 2;
        root.y0 = 0;
   
        function collapse(d) {
          if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
          }
        }

        function update(source) {
          // Compute the new tree layout.
          var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);
     
          // Normalize for fixed-depth.
          nodes.forEach(function(d) { d.y = d.depth * 180; });
     
          // Update the nodes¡­
          var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });
     
          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", click)
            .on("mouseover", function(d){
                var g = d3.select(this);
                var info = g.append('text')
                             .classed('info', true)
                             .attr('x', 20)
                             .attr('y', 20)
                             .text(d.link);
             })
            .on("mouseout", function() {
                d3.select(this).select('text.info').remove();
            });
     
          nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) {
              if (d._children) {
                if(d.status == "Complete" | d.status == "Closed"){
                  return "lightgreen";
                } else if (d.status == "Under Review" | d.status == "In Certification") {
                  return "#ffe700";
                } else {
                  return "lightsteelblue";
                }
              } else {
                if(d.status == "Complete" | d.status == "Closed"){
                  return "lightgreen";
                } else if (d.status == "Under Review" | d.status == "In Certification") {
                  return "#ffe700";
                } else {
                  return "#fff";
                }
              }
             });
     
          nodeEnter.append("text")
            .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) {
              if(d.hasOwnProperty("status")){
                return d.name+'-'+d.status;
              }else{
                return d.name;
              }
            })
            .style("fill-opacity", 1e-6);
     
          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
     
          nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d) {
              if (d._children) {
                if(d.status == "Complete" | d.status == "Closed"){
                  return "lightgreen";
                } else if (d.status == "Under Review" | d.status == "In Certification") {
                  return "#ffe700";
                } else {
                  return "lightsteelblue";
                }
              } else {
                if(d.status == "Complete" | d.status == "Closed"){
                  return "lightgreen";
                } else if (d.status == "Under Review" | d.status == "In Certification") {
                  return "#ffe700";
                } else {
                  return "#fff";
                }
              }
            });
     
          nodeUpdate.select("text")
            .style("fill-opacity", 1);
     
          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();
     
          nodeExit.select("circle")
            .attr("r", 1e-6);
     
          nodeExit.select("text")
            .style("fill-opacity", 1e-6);
     
          // Update the links¡­
          var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });
     
          // Enter any new links at the parent's previous position.
          link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
            });
     
          // Transition links to their new position.
          link.transition()
            .duration(duration)
            .attr("d", diagonal);
     
          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
            })
            .remove();
     
          // Stash the old positions for transition.
          nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
          });
        }

        function click(d) {
          if(d.hasOwnProperty("link")){
            window.open(d.link, '_blank');
          }

          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d);
        }
   
        root.children.forEach(collapse);
        update(root);
      })

    });

    d3.select(self.frameElement).style("height", "800px");
  }