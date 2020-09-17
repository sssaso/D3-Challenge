function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
  
    // clear svg if not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    // SVG params
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
    // margin
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
    //
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // Append SVG element
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    // Append SVG group element and set the position
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // read the data and convert them integer from string   
    d3.csv("./assets/data/data.csv").then(function(hData) {
        console.log(hData);
        //convert to integer
        hData.forEach(function(data) {
          data.smokes = +data.smokes;
          data.age = +data.age;
          data.poverty = +data.poverty;
          data.obesity = +data.obesity;
          data.healthcare = +data.healthcare;
          data.income = +data.income;
        });

        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain(d3.extent(hData, d => d.age))
          .range([0, width]);

        var yLinearScale = d3.scaleLinear()
          .domain([8, d3.max(hData, d => d.smokes)])
          .range([height, 0]);

        // create initial axis
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);

        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);

        chartGroup.append("g")
          .call(yAxis);

        // Create Circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(hData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("opacity", ".5");
        
        // add state (abbr) in each Circles
        chartGroup.append("g").selectAll("text")
        .data(hData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .style("font-weight", "bold");

        //add X-axis label
        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .style("font-weight", "bold")
        .text("Median Age");

        //add Y-axis label
        chartGroup.append("text")
        .attr("y", 0 - (margin.left / 2))
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .style("font-weight", "bold")
        .text("Smoke %");

    // Initialize tool tip

      var toolTip = d3.select("#scatter")
        .append("div")
        .classed("tooltip",true)
        .offset([60, -40])
        .html(function(d) {
           return (`${d.state}<br>Smokes: ${d.smokes}<br> Median Age: ${d.age}`);
        });

    // Create tooltip in the chart
        chartGroup.call(toolTip);

    //  Create event listeners to display and hide the tooltip
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
       })
    // onmouseout event
         .on("mouseout", function(data) {
           toolTip.hide(data);
   });

  })    
};

// call makeResponsive() 
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

