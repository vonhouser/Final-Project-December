var width = 700,
    height = 500;

var diameter = 500, //max size of the bubbles
    color = d3.scale.category20b(); //color category

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg1 = d3.select("#bubblechart")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var states = ["Alaska", "Arizona", "Arkansas","California","Colorado", "Connecticut", "Delaware", "DC", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Virgin Islands"]

function drawbubblechart(data, alldata2, state) {
        if (!state) {
            state = "weaponTotalParent";
            }

     //convert numerical values from strings to numbers
        data = data.map(function(d) {
        d.value = +d[state];
        return d;
        });

        svg1.selectAll("*").remove()
        d3.select("select").remove();
        d3.select(".back-button").remove();

        d3.select('#bubbles')
            .append('button')
            .text('Back')
            .attr('class', 'back-button')
            .on('click', function () {
                var data = alldata2.filter(function(d) {
                    return !d.Parent && !d.Hide
                });
                drawbubblechart(data, alldata2);
            });

        d3.select("#bubbles")
            .append("select")
            .on("change", function(d) {
            var state = d3.select("select").property("value")
            drawbubblechart(data, alldata2, state)
            })

            .selectAll("option")
            .data(states)
            .enter()
            .append("option")
            .text(function(d) {
                return d
            })
            .property("selected", function(d) {
                if (d === state) {
                    return(true)
                }
            });

    //bubbles needs very specific format, convert data to this.
        var nodes = bubble.nodes({
        children: data
        }).filter(function(d) {
        return !d.children;
        });

    //setup the chart
        var bubbles = svg1.append("g")
            .attr("transform", "translate(0,0)")
            .selectAll(".bubble")
            .data(nodes)
            .enter();

    //create the bubbles
        bubbles.append("circle")
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .style("fill", function(d) {
                return color(d.value);
            })
            .attr('r', 0)
            .on("click", function(d) { //filter so that only top level cats show
                var Parent = d.Type
                var toplevel2 = alldata2.filter(function(d) {
                    return d.Parent === Parent
                })
                if (toplevel2.length === 0) { //make sure empty categories don't show up
                    return
                }
                drawbubblechart(toplevel2, alldata2)
            })
            .transition()
            .duration(1000)
            .attr("r", function(d) {
                return d.r;
            });



    var force = d3.layout.force()
    .nodes(state)
    .charge(-120)
    .linkDistance(30)
    .size([width, height])
    .start();

    //format the text for each bubble
        bubbles.append("text")
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y + 5;
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d["Type"];
            })
            .style({
                "fill": "white",
                "font-family": "Helvetica Neue, Helvetica, Arial, san-serif",
                "font-size": "12px"
            });
    }

d3.csv("UCRStateWeapons3.csv", function(error, data) {

/*trying to call the force variable
    force
      .nodes(data.nodes)
      .links(data.links)
      .start();
*/
    //trying to initialize force layout//


    var alldata2 = data;

    //filter data for parents
    data = data.filter(function(d) {
    return !d.Parent && !d.Hide
     })

drawbubblechart(data, alldata2);

});
