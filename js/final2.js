(function () {
var w = 500;
var h = 400;
var padding = [20, 45, 40, 180]; //Top, right, bottom, left

var widthScale = d3.scale.linear()
    .range([0, w - padding[1] - padding[3]]);

var heightScale = d3.scale.ordinal()
    .rangeRoundBands([padding[0], h - padding[2]], 0.1);

var xAxis = d3.svg.axis()
    .scale(widthScale)
    .ticks(3)  //set number of ticks to three
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(heightScale)
    .orient("left");

var svg2 = d3.select("#finalchart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 10])
  .direction('e');

var crimes = ["Assault", "Homicide", "Kidnapping or Abduction", "Sex Offenses", "Extortion", "Robbery"];

function drawchart(currentdata, alldata, crime) {

    $(".y.axis:first").empty();

    currentdata.sort(function(a, b) {
        return d3.descending(+a[crime], +b[crime]);
    });

    tip.html(function(d) {
    return "Number of violent offenses that involved the use of a " +d[crime];
    })

    widthScale.domain([0, d3.max(currentdata, function(d) {
        return +d[crime];
    })])
        .nice();

    heightScale.domain(currentdata.filter(function(d) {
        return d[crime] > 0;
    }).map(function(d) {
        return d.Type;
    }));

    var rects = svg2.selectAll("rect")
        .data(currentdata.filter(function(d) {
            return d[crime] > 0;
        }));
    rects.exit().remove();
    rects.enter()
        .append("rect")
        .on("click", function(d) { //filter so that only top level cats show
            var Parent = d.Type
            var toplevel = alldata.filter(function(d) {
                return d.Parent === Parent
            })
            if (toplevel.length === 0) { //make sure empty categories don't show up
                return
            }
            d3.select('.back-button').style('display', 'block');

            drawchart(toplevel, alldata, crime)
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    rects
        .attr("x", padding[3])
        .attr("y", function(d) {
            return heightScale(d.Type);
        })
        .attr('width', 0)
        .attr("height", heightScale.rangeBand())
        .transition().duration(1000)
        .attr("width", function(d) {
        return widthScale(d[crime]);
    })
/*
    .select("title")
        .text(function(d) {
            return "Number of violent offenses that involved the use of a" + d.Type;
        });
*/
    //inserting tooltip code here


/*
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/

    svg2.call(tip);

//end of tooltip code

    var imageSizes = {
        "img/fisttext.png": [100, 100],
        "img/guntext.png": [140, 50],
        "img/knifetext.png": [120, 90]
    };

    svg2.select("g.x.axis")
        .attr("transform", "translate(" + padding[3] + "," + (h - padding[2]) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dy", "1em") //rotate labels
 //       .attr("transform", "rotate(0)")
        .style("text-anchor", "start"); //end rotate labels

    svg2.select("g.y.axis")
        .attr("transform", "translate(" + padding[3] + ",0)")
        .call(yAxis);

    //svg2.select(".axis.y").selectAll("text").remove();

    var ticks = svg2.select(".axis.y").selectAll(".tick")
        .data(currentdata)
        .attr('class', function(d) {
            return d.img ? 'has-image' : 'no-image';
        })
        .filter(function(d) {     //if there is an image attribute, keep the element, otherwise filter
            return d.img !=null
        })
        .append("svg:image")
        .attr("xlink:href", function(d) {
            return d.img;
        })
        .attr("width", function (d) {
            return Object(imageSizes[d.img])[0] || 100;
        })
        .attr("height", function (d) {
            return Object(imageSizes[d.img])[1] || heightScale.rangeBand();
        })
        .attr("y", function (d) {
            return -(Object(imageSizes[d.img])[1] || heightScale.rangeBand()) / 2;
        })
        .attr("x", function() { return -this.getBBox().width; });  //add or substract to make an exact fit, after width
}

d3.csv("OffensebyWeapon.csv", function(data) {
    var toplevel = data.filter(function(d) {
        return !d.Parent
    });

    svg2.append("g")
        .attr("class", "x axis");
    svg2.append("g")
        .attr("class", "y axis");

    drawchart(toplevel, data, "Total Offenses Involving Weapons");

    var crime;

    //change the name of "body" to the div name for the dropdown //
    d3.select(".statedropbar")
        .append("select")
        .on("change", function(d) {
            crime = this.value;
            drawchart(toplevel, data, crime)
        })
        .selectAll("option")
        .data(crimes)
        .enter()
        .append("option")
        .text(function(d) {
            return d
        })
        .property("selected", function(d) {
            if (d === crime) {
                return (true)
            }
        });

    d3.select('.statebarback')
        .append('button')
        .text('Back')
        .attr('class', 'back-button')
        .on('click', function() {
            var toplevel = data.filter(function(d) {
                return !d.Parent && !d.Hide
            });
            d3.select('.back-button').style('display', 'none');
            drawchart(toplevel, data, "Total Offenses Involving Weapons");
        });

    // hide on first level
    d3.select('.back-button').style('display', 'none');

});

}) ();
