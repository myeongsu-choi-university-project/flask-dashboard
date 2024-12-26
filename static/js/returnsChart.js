 // returnsChart.js - 제품 별 반품 비율 pie chart
 function drawReturnsChart(data) {
    var cardBody = $("#ReturnsChart").closest(".card-body");

    const margin = 10;
    var height = cardBody.height();
    var width = cardBody.width();

    // pie chart 반지름 계산
    const radius = Math.min(width, height) / 2 - margin;

    // 기존 svg제거
    d3.select("#ReturnsChart").select("svg").remove();

    // 새로운 svg생성
    const svg = d3.select("#ReturnsChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height/ 2})`);

    // 전체 반품 개수 계산
    const totalReturns=d3.sum(data, d=> d.returns);

    // 제품별 반품 개수 계산
    const productReturns =d3.rollup(
        data,
        v => d3.sum(v, d=> d.returns),
        d => d.product
    );

    const productReturnsArray = Array.from(
        productReturns, 
        ([product, returns]) =>({product, returns})
    );

    // color scale 설정
    const color = d3.scaleOrdinal()
        .domain(productReturnsArray.map(d=> d.product))
        .range(d3.schemeCategory10);

    // pie, arc generator 정의
    const pie=d3.pie()
        .value(d=> d.returns);

    const arc=d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // arc 생성
    const arcs = svg.selectAll("arc")
        .data(pie(productReturnsArray))
        .enter()
        .append("g")
        .attr("class", "arc");

    // pie chart 그리기
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.product));

    // arc에 label 추가
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(d => {
            const percentage = (d.data.returns / totalReturns * 100).toFixed(1);
            return `${percentage}%`;
        });

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 15})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => d.data.product);
 }