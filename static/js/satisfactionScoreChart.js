// satisfactionScoreChart.js - 제품 별 고객 만족도 점수 bar chart
$(function() {
    var cardBody = $("#SatisfactionScoreChart").closest(".card-body");

    const margin = {top:50, right:30, bottom:30, left: 50};
    var height = cardBody.height() - margin.left - margin.right;
    var width = cardBody.width() - margin.top - margin.bottom;

    const svg=d3.select("#SatisfactionScoreChart")
        .append("svg")
        .attr("width", width +margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Bar Chart Title 설정
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("제품 별 고객 만족도 점수");

    // X축 생성
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Products");

    // Y축 생성
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Sales Amount");

    // 데이터 로드
    d3.csv("../static/data/customer_feedback_data.csv", function(d) {
        return {
            product: d.Product,
            satisfaction: +d.Customer_Satisfaction_Score
        };
    }).then(function(data) {
            // 제품 별 만족도 점수 계산
            const productSatisfaction =d3.rollup(
                data,
                v=> d3.mean(v, d=> d.satisfaction),
                d=> d.product
            );
            
            const productSatisfactionArray=Array.from(productSatisfaction, ([product, satisfaction]) => ({ product, satisfaction}));

            // x축, y축 스케일 설정
            const x=d3.scaleBand()
                .domain(productSatisfactionArray.map(d=> d.product))
                .range([0, width])
                .padding(0.2);

            const y=d3.scaleLinear()
                .domain([0, d3.max(productSatisfactionArray, d=> d.satisfaction)])
                .nice()
                .range([height, 0]);

            // x, y축 생성
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));

            // bar chart의 bar 생성
            svg.selectAll(".bar")
                .data(productSatisfactionArray)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d=> x(d.product))
                .attr("y", d=> y(d.satisfaction))
                .attr("width", x.bandwidth())
                .attr("height", d=> height-y(d.satisfaction))
                .attr("fill", "steelblue");

            // bar에 label 추가
            svg.selectAll(".label")
                .data(productSatisfactionArray)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", d=> x(d.product) +x.bandwidth() /2)
                .attr("y", d=> y(d.satisfaction) -5)
                .attr("text-anchor", "middle")
                .text(d=> d.satisfaction.toFixed(1));
        }).catch(function(error) {
            console.error("Error loading or processing data:", error);
        });
    });
   