//Template.indentedDataTreeTitle.rendered = function(){
    //var jira_num_link = this.data.data.substring(this.data.data.indexOf("jira="));
    //if(jira_num_link.length > 5){
    //  $('#dataTree_indented_title').html(jira_num_link.substring(5));
    //}
//}

//Template.indentedDataTreeText.rendered = function(){
    //var jira_num_link = this.data.data.substring(this.data.data.indexOf("jira="));
    //$.ajax({url: "http://10.190.233.52:8080/reviewPlainText?"+jira_num_link, success: function(result){
    //    $('#dataTree_indented_text').html(result);
    //}});
//}

//Template.indentedDataTreeComponents.rendered = function(){
    //var jira_num_link = this.data.data.substring(this.data.data.indexOf("jira="));
    //$.ajax({url: "http://10.190.233.52:8080/componentsPlainText?"+jira_num_link, success: function(result){
    //    $('#dataTree_indented_components').html(result);
    //}});
//}

Template.indentedDataTree.rendered = function(){
  var serviceObj = this.data.service;

  var margin = {top: 30, right: 20, bottom: 30, left: 20},

  width = window.innerWidth - margin.right - margin.left,
  barHeight = 20,
  barWidth = width * .8;

  var i = 0,
      duration = 400,
      root;

  var tree = d3.layout.tree()
      .nodeSize([0, 20])
      .value(function(d){return d.value;});

  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("#dataTree_indented").append("svg")
      .attr("width", width + margin.right + margin.left)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  Deps.autorun(function(){
    d3.json(serviceObj.dataUrl, function(error, flare) {
      if (error) throw error;

      //Add Children to flare json if serviceObj.childrenId === ''
      if((typeof (serviceObj.childrenId) === 'undefined') || serviceObj.childrenId === ''){
        var tempTree = {};
        tempTree.name = 'root';
        tempTree.children = appendChildren(flare);
        flare = tempTree;
      }

      console.log(JSON.stringify(flare));
      flare.x0 = 0;
      flare.y0 = 0;
      update(root = flare);
    });
  });

  function appendChildren(dataObj) {
    var nodes = [];
    for (var k in dataObj) {
      if (typeof dataObj[k] !== "undefined" && dataObj[k] !== null){
        var node = {};
        node.name = k;
        if(typeof dataObj[k] === 'object'){
          node.children = appendChildren(dataObj[k]);
        }else{
          node.val = dataObj[k];
          node[((k !== 'id')?k:'_id')] = dataObj[k];
        }
        nodes.push(node);
      }
    }
    return nodes;
  }

  function displayLineContent(nodeEnter){
    nodeEnter.append("text")
        .attr("dy", 3.5)
        .attr("dx", 5.5)
        .text(function(d) {
          var lineContent = '';
          var firstDisplayPropertyName = true;
          if(typeof (serviceObj.property) === 'undefined'
              || serviceObj.property.length === 0
              || (serviceObj.property.length === 1 && serviceObj.property[0].propertyName === '')){
            return d.hasOwnProperty('val') ? d.name + ": " + d.val : d.name;
          }
          $.each(serviceObj.property, function(idx, property){
            if(d.hasOwnProperty(property.propertyName)){
              if(firstDisplayPropertyName){
                firstDisplayPropertyName = false;
                lineContent = lineContent + ((property.label !== null && property.label.length > 0) ? (property.label + ':') : '') + d[property.propertyName];
              }else{
                lineContent = lineContent + ', ' + ((property.label !== null && property.label.length > 0) ? (property.label + ':') : '') + d[property.propertyName];
              }
            }
          });
          return lineContent;
        });
  }

  //TODO need to filter out the children as well.
  function filterNodesByPropertyFilter(d){
    var result = true;
    if(typeof (serviceObj.propertyFilter) === 'undefined'
        || serviceObj.propertyFilter.length === 0
        || (serviceObj.propertyFilter.length === 1 && serviceObj.propertyFilter[0].propertyName === '')){
      return result;
    }
    $.each(serviceObj.propertyFilter, function(idx, filter){
      result = isValidElement(d, filter);
      if(result === false) return false;
    });
    return result;
  }

  function isValidElement(d, filter){
    if(d.hasOwnProperty(filter.propertyName)){
      if(filter.filterOption === 'in' && $.inArray(d[filter.propertyName],filter.value.split('|')) === -1){
        return false;
      }
      if(filter.filterOption === 'is' && d[filter.propertyName] !== filter.value){
        return false;
      }
      if(filter.filterOption === 'is not' && d[filter.propertyName] === filter.value){
        return false;
      }
    }
    return true;
  }

  function update(source) {
    // Compute the flattened node list. TODO use d3.layout.hierarchy.
    var nodes = tree
        .children(function(d){
          var children = (serviceObj.hasOwnProperty('childrenId') && serviceObj.childrenId !== '') ? d[serviceObj.childrenId] : d.children;
          if(isNaN(children)) {
            var filteredChildren = [];
            $.each(d3.entries(children), function(idx, child){
              if (filterNodesByPropertyFilter(child.value)) {
                filteredChildren.push(child.value);
              }
            });
            return filteredChildren;
          }
          else return null;
        })
        .nodes(root);
        //.filter(function(d){return filterNodesByPropertyFilter(d);});

    var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

    d3.select("svg").transition()
        .duration(duration)
        .attr("height", height);

    d3.select(self.frameElement).transition()
        .duration(duration)
        .style("height", height + "px");

    // Compute the "layout".
    nodes.forEach(function(n, i) {
      n.x = i * barHeight;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) {
          return d.id || (d.id = ++i);
        });

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function() { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .style("opacity", 1e-6);

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
        .attr("y", -barHeight / 2)
        .attr("height", barHeight)
        .attr("width", barWidth)
        .style("fill", getColor)
        .on("click", click);

    displayLineContent(nodeEnter);

    nodeEnter.filter(function(d) { return d.hasOwnProperty("link") })
        .append("svg:circle")
        .attr("r", 5)
        .attr("fill", "white")
        .on("click", function(d) {
          window.open(d.link, '_blank');
        });

    // Transition nodes to their new position.
    nodeEnter.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1);

    node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("opacity", 1)
        .select("rect")
        .style("fill", getColor);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
        .duration(duration)
        .attr("transform", function() { return "translate(" + source.y + "," + source.x + ")"; })
        .style("opacity", 1e-6)
        .remove();

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function() {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        })
      .transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function() {
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

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d.tmpSwapVal = ((typeof serviceObj.childrenId !== 'undefined') && serviceObj.childrenId !== '') ? d[serviceObj.childrenId] : d.children;
      d.children = null;
    } else {
      d.children = d.tmpSwapVal;
      d.tmpSwapVal = null;
    }
    update(d);
  }

  function getColor(d) {
    if (d.tmpSwapVal) {
      return displayColor(d, "#3182bd");
    } else if (((typeof serviceObj.childrenId !== 'undefined') && serviceObj.childrenId !== '') ? d[serviceObj.childrenId] : d.children) {
      return displayColor(d, "#c6dbef");
    } else {
      return displayColor(d, "#fd8d3c");
    }
  }

  function displayColor(d, defaultColor) {
    var displayColor = defaultColor;
    if((typeof (serviceObj.colorFilter) === 'undefined')
        || serviceObj.colorFilter.length === 0
        || (serviceObj.colorFilter.length === 1 && serviceObj.colorFilter[0].propertyName === '')) return defaultColor;

    $.each(serviceObj.colorFilter, function(idx, filter){
      if(d.hasOwnProperty(filter.propertyName)){
        displayColor = getColorByColorFilter(d, filter, defaultColor);
        return false;
      }
    });
    return displayColor;
  }

  function getColorByColorFilter(d, colorFilter, defaultColor) {
    if(colorFilter.filterOption === 'is' && d[colorFilter.propertyName] === colorFilter.value){
      return colorFilter.color;
    } else if(colorFilter.filterOption === 'is not' && d[colorFilter.propertyName] !== colorFilter.value){
      return colorFilter.color;
    } else if(colorFilter.filterOption === 'in' && $.inArray(d[colorFilter.propertyName], colorFilter.value.split('|')) > -1){
      return colorFilter.color;
    }
  }
}