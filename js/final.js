
			var w = 700;
			var h = 600;
			var padding = [ 20, 10, 30, 180 ];  //Top, right, bottom, left



			var widthScale = d3.scale.linear()
								.range([ 0, w - padding[1] - padding[3] ]);
			
			var heightScale = d3.scale.ordinal()
								.rangeRoundBands([ padding[0], h - padding[2] ], 0.1);



			var xAxis = d3.svg.axis()
							.scale(widthScale)
							.orient("bottom");

			var yAxis = d3.svg.axis()
							.scale(heightScale)
							.orient("left");



			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);



			d3.csv("OffensebyWeapon.csv", function(data) {

				data.sort(function(a, b) {
					return d3.descending(+a.Total, +b.Total);
				});

				widthScale.domain([ 0, d3.max(data, function(d) {
					return +d.Firearms;
				}) ]);

				heightScale.domain(data.map(function(d) { return d.Freq; } ));

				var rects = svg.selectAll("rect")
								.data(data)
								.enter()
								.append("rect");

				rects.attr("x", padding[3])
					.attr("y", function(d) {
						return heightScale(d.Freq);
					})
					.attr("width", function(d) {
						return widthScale(d.Firearms);
					})
					.attr("height", heightScale.rangeBand())
					.attr("fill", "steelblue")
					.append("title")
					.text(function(d) {
						return d.Total +" of respondants " + d.Firearms;
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
