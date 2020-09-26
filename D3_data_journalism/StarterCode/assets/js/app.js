// @TODO: YOUR CODE HERE!


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

    
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    }
    else {
        var xlabel = "Age: "
    }

    
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

                    return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                  } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
  
                    return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                  } else {

                    return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
                  }      
            });
        
        circlesGroup.call(toolTip);


 
        circlesGroup
 
            .on("click", function(data) {
                toolTip.show(data, this);
            })

            .on("mouseout", function(data) {
                toolTip.hide(data)
            });

        return circlesGroup;
    }

    d3.csv("assets/data/data.csv")
        .then(function(paperData) {
        
        paperData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.income = +data.income;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
            console.log(data);
        });
        var xLinearScale = xScale(paperData, chosenXAxis);

        var yLinearScale = yScale(paperData, chosenYAxis);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

         var circlesGroup = chartGroup.selectAll("circle")
            .data(paperData)
            .enter()
            .append("circle")

            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", "15")
            .attr("fill", "green")
            .attr("opacity", ".5");

        var circletextGroup = chartGroup.selectAll()
            .data(paperData)
            .enter()
            .append("text")
            .text(d => (d.abbr))
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style('fill', 'black');

        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") 
            .classed("active", true)
            .text("In Poverty (%)");

        var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") 
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") 
            .classed("inactive", true)
            .text("Household Income (Median)");

        var healthcareLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (margin.left) * 2.5)
            .attr("y", 0 - (height - 60))
            .attr("value", "healthcare") 
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        var smokeLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (margin.left) * 2.5)
            .attr("y", 0 - (height - 40))
            .attr("value", "smokes") 
            .classed("inactive", true)
            .text("Smokes (%)");

        var obesityLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (margin.left) * 2.5)
            .attr("y", 0 - (height - 20))
            .attr("value", "obesity") 
            .classed("inactive", true)
            .text("Obesity (%)");

        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        labelsGroup.selectAll("text")
            .on("click", function() {
               
                var value = d3.select(this).attr("value");

                if (true) {
                    if (value === "poverty" || value === "age" || value === "income") {

                        
                        chosenXAxis = value;

                        
                        xLinearScale = xScale(paperData, chosenXAxis);

                        
                        xAxis = renderXAxes(xLinearScale, xAxis);

                        
                        if (chosenXAxis === "poverty") {
                            povertyLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            
                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenXAxis === "age"){
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            ageLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true)

                            incomeLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    
                    } else {

                        chosenYAxis = value;

                        
                        yLinearScale = yScale(paperData, chosenYAxis);

                        
                        yAxis = renderYAxes(yLinearScale, yAxis);

                        
                        if (chosenYAxis === "healthcare") {
                            healthcareLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            smokeLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenYAxis === "smokes"){
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            smokeLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            smokeLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            obesityLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    
                    }
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // Update tool tips with new info.
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // Update circles text with new values.
                    circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                }
                
            });

    });

