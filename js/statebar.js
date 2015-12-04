            var w = 700;
			var h = 600;
			var padding = [ 20, 10, 30, 120 ];  //Top, right, bottom, left



			var widthScale = d3.scale.linear()
								.range([ 0, w - padding[1] - padding[3] ]);

            var colorScale = d3.scale.linear()
								.range(["red", "gray"]);

			var heightScale = d3.scale.ordinal()
								.rangeRoundBands([ padding[0], h - padding[2] ], 0.1);

			var xAxis = d3.svg.axis()
							.scale(widthScale)
							.orient("bottom")
                            .ticks(4);

			var yAxis = d3.svg.axis()
							.scale(heightScale)
							.orient("left");

			var svg = d3.select("#statebar")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

            var policies = ["Open carry index", "Concealed carry index", "Assault weapons ban?", "Saturday Night Special ban?"]

            var rects;

            var alldata;

            d3.select("#policybardrop")
                .append("select")
                .on("change", function(d) {
                    var policy = d3.select("select").property("value")
                    colorScale.domain([ 0,
                        d3.max(alldata, function(d) {
                            return +d[policy];
                        })
                    ]);
                    svg.selectAll(".bar")
                        .attr("fill", function(d) {
                            console.log(d);
                            return colorScale(d[policy]);
                        })
                })

                .selectAll("option")
                .data(policies)
                .enter()
                .append("option")
                .text(function(d) {
                    return d
                });

			d3.csv("HomicidebyState.csv", function(data) {
                alldata=data;
				data.sort(function(a, b) {
					return d3.descending(+a["Total Firearms"], +b["Total Firearms"]);
				});

                data = data.filter(function(d) {
                return !d.Hide
                })

				widthScale.domain([ 0, d3.max(data, function(d) {
					return +d["Total Firearms"];
				}) ]);

                colorScale.domain([ 0,
                    d3.max(data, function(d) {
                        return +d["Open carry index"];
                    })
                ]);

				heightScale.domain(data.map(function(d) { return d.State; } ));

				rects = svg.selectAll("rect")
                    .data(data);

                rects.enter()
                    .append("rect")
                    .attr('class', 'bar')
                    .attr("fill", function(d) {
                        return colorScale(d["Open carry index"]);
                    })
                    .attr("x", padding[3])
                    .attr("y", function(d) {
                        return heightScale(d.State);
                    })
                    .attr("width", function(d) {
                        return widthScale(d["Total Firearms"]);
                    })
                    .attr("height", heightScale.rangeBand())
                    .append("title")
                    .text(function(d) {
                        return d.State + "'s total number of Firearm Homicides is " + d["Total Firearms"];
                    });

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(" + padding[3] + "," + (h - padding[2]) + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate(" + padding[3] + ",0)")
					.call(yAxis);
			});
