// salesChart.js - 일일 판매량 line chart
// 함수 선언
 function drawSalesChart(data) {
    var cardBody = $("#SalesChart").closest(".card-body");
    const margin = {top: 50, right: 30, bottom: 40, left: 50};
    var height = cardBody.height() - margin.left - margin.right;
    var width = cardBody.width() - margin.top - margin.bottom;

    // 기존 svg제거
    d3.select("#SalesChart").select("svg").remove();

    // 새로운 SVG 생성
    const svg = d3.select("#SalesChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // line chart title 생성
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("일일 판매량");

    // x축, y축 label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Date");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Sales Amount");
    
    // x, y 스케일 설정
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([height, 0]);

    // 데이터 길이에 따라 동적으로 tick 개수 설정
    const tickCount = data.length

    // x축 생성
    svg.append("g")
        .attr("class", "x-axis") // x축에 class 추가
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .ticks(tickCount) // 동적으로 tick 개수 설정
            .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "end");

    // y축 생성
    svg.append("g")
        .attr("class", "y-axis") // y축에 class 추가
        .call(d3.axisLeft(y));

    // 라인 생성기 설정
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.sales));

    // 라인 차트 그리기
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // 데이터 포인트 추가
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.sales))
        .attr("r", 4)
        .attr("fill", "steelblue");
 };
