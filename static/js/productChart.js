// productChart.js - 제품 별 누적 판매량 bar chart
function drawProductChart(data) {
    var cardBody = $("#ProductChart").closest(".card-body");

    const margin = {top: 50, right: 30, bottom: 30, left: 50};
    var height = cardBody.height() - margin.left - margin.right;
    var width = cardBody.width() - margin.top - margin.bottom;

    // 기존 svg 제거
    d3.select("#ProductChart").select("svg").remove();

    // 새로운 SVG 생성
    const svg = d3.select("#ProductChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 차트의 title 설정
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("제품 별 누적 판매량");

    // 축 label 설정
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Products");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Sales Amount");

    // 제품 별 판매량 계산
    console.log(data);
    const productSales = d3.rollup(
        data,
        v=> d3.sum(v, d => d.sales),
        d=> d.product
    );

    const productSalesArray = Array.from(
        productSales, 
        ([product, sales]) => ({product, sales})
    );

    // x, y 스케일 설정
    const x = d3.scaleBand()
        .domain(productSalesArray.map(d => d.product))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(productSalesArray, d => d.sales)])
        .nice()
        .range([height, 0]);

    // x축, y축 생성
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));

    // bar chart의 bar , label 생성
    svg.selectAll(".bar")
        .data(productSalesArray)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.product))
        .attr("y", d => y(d.sales))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.sales))
        .attr("fill", "steelblue");

    svg.selectAll(".label")
        .data(productSalesArray)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.product) + x.bandwidth() / 2)
        .attr("y", d => y(d.sales) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.sales);
}