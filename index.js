(async function getData() {
    let movies = await (await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')).json()

    const margin = { top: 50, bottom: 50, left: 75, right: 50 }
    const width = 1200;
    const height = 600;

    let svg = d3.select("main")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("viewbox", [0, 0, width, height])

    let categories = movies.children.map(x => x.name)

    let color = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeCategory10)

    let root = d3.hierarchy(movies).sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value )

    d3.treemap()
    .size([width, height])
    .padding(1)
    (root)

    let tooltip = d3.select("main")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("opacity", "0")

    let mouseover = (data) => {
        let {name, category, value} = data.data
        return tooltip
            .style("top", (d3.event.pageY)-10 + "px")
            .style("left", (d3.event.pageX)+25 + "px")
            .style("opacity", ".8")
            .attr("data-value", value)
            .html(`Name: ${name}<br>Category: ${category}<br>Value: ${value}`)
    }

    let mouseleave = d => tooltip.style("opacity", "0")

    let g = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")

    g.append("rect")
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr("fill", d => d.children ? null : color(d.parent.data.name))
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    g.append("text")
        .attr("x", d => d.x0 + 5 )
        .attr("y", d => d.y0 + 10 )
        .attr("font-size", "10px")
        .attr("class", "label")
        .text(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).join("\n"))

    let legend = d3.select("main")
        .append("svg")
        .data(categories)
        .attr("id", "legend")
        .attr("height", 150)
        .attr("width", 300)
        .attr("viewbox", [0, 0, width, height])

    legend.selectAll("rect")
        .attr("class", "legend-item")

    let colHeight = 150 / 6
    let colWidth = 300 / 3

    for (let i = 0; i < Math.ceil(categories.length / 6); i++) {
        for (let j = 0; j < 6; j++) {
            let g = legend.append('g').attr("class", "category")
            let cat = categories[j + (i * 6)]
            if (!cat) break
            g.append("rect")
                .attr("class", "legend-item")
                .attr("x", colWidth * i)
                .attr("y", colHeight * j + 5)
                .attr("height", 10)
                .attr("width", 10)
                .attr("fill", color(cat))
            g.append("text")
                .attr("x", colWidth * i + 15)
                .attr("y", colHeight * j + 15)
                .text(cat)
        }
    }
})()
