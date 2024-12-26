// complaintsChart.js - 제품 별 고객 불만 사항 pie chart
$(function () {
    // chart의 크기 설정
    var cardBody = $("#ComplaintsChart").closest(".card-body");

    const margin = 10;

    // card-body의 높이와 넓이를 가져옴
    var height = cardBody.height();
    var width = cardBody.width();

    // 파이 차트의 반지름 설정
    const radius = Math.min(width, height) / 2 - margin;

    // ComplaintsChart div 내부에 SVG element 생성
    const svg = d3.select("#ComplaintsChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    // CSV data 로드
    d3.csv("../static/data/customer_feedback_data.csv", function(d) {
        return {
            product: d.Product,
            complaints: +d.Customer_Complaints  // +기호는 숫자로 변환을 의미
        };
    }).then(function(data) {
        // 총 불만 사항 개수 계산
        const totalComplaints = d3.sum(data, d => d.complaints);

        // 제품 별 불만 사항 개수 계산
        const productComplaints = d3.rollup(
            data,
            v => d3.sum(v, d => d.complaints),  // 그룹 내 complaints 합계 계산
            d => d.product                      // product 속성을 기준으로 그룹화
        );

        // Map을 배열로 변환
        const productComplaintsArray = Array.from(
            productComplaints, 
            ([product, complaints]) => ({product, complaints})
        );

        // color scale 설정
        const color = d3.scaleOrdinal() 
            .domain(productComplaintsArray.map(d => d.product))
            .range(d3.schemeCategory10)
        
        // pie generator 정의
        const pie = d3.pie()
            .value(d => d.complaints);
        
        // 파이 차트 조각 (arc) generator 정의
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        
        // pie chart의 arc 생성
        const arcs = svg.selectAll("arc")
            .data(pie(productComplaintsArray))
            .enter()
            .append("g")
            .attr("class", "arc");

        // pie chart 그리기
        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.product))
        
        // arc에 퍼센티지와 제품 이름 추가
        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .text(d => {
                const percentage = (d.data.complaints / totalComplaints * 100).toFixed(1);
                return `${percentage}%`;
            });
        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 15})`)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .text(d => d.data.product);

    }).catch(function(error) {
        console.error("Error loading or processing data:", error);
    });
});