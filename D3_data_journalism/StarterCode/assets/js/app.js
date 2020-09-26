// @TODO: YOUR CODE HERE!

//     // SVG Wrapper dimensions are determined by the current width and height of the browser window.
//     var svgWidth = window.innerWidth;
//     var svgHeight = window.innerHeight;
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 40,
    bottom: 90,
    right: 40,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(paperData, chosenXAxis) {
    // Create Scales.
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(paperData, d => d[chosenXAxis]) * .8,
            d3.max(paperData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

function yScale(paperData, chosenYAxis) {
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(paperData, d => d[chosenYAxis]) * .8,
            d3.max(paperData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}


function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circletextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    
    return circletextGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // Conditional for X Axis.
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    }
    else {
        var xlabel = "Age: "
    }

    // Conditional for Y Axis.
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers: "
    }
    else {
        var ylabel = "Obesity: "
    }

    var toolTip = d3.tip()
            .attr("class", "tooltip")
            .style("background", "black")
            .style("color", "white")
            .offset([120, -60])
            .html(function(d) {
                if (chosenXAxis === "age") {
                    // All yAxis tooltip labels presented and formated as %.
                    // Display Age without format for xAxis.
                    return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                  } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
                    // Display Income in dollars for xAxis.
                    return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                  } else {
                    // Display Poverty as percentage for xAxis.
                    return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
                  }      
            });
        
        circlesGroup.call(toolTip);
