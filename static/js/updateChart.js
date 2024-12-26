var salesData;

$(function() {
    // 날짜 형식 지정
    const parseData = d3.timeParse("%Y-%m-%d");

    // 필요한 정보를 모두 읽어 옴
    d3.csv("../static/data/sales_data.csv", function(d) {
        return {
            date: parseData(d.Date),
            sales: +d.Sales,
            product: d.Product,
            returns: +d.Returns
        };
    }).then(function(data) {
        // 시각화를 그리는 함수를 한번에 불러옴
        salesData = data;
        drawSalesChart(data);
        drawProductChart(data);
        drawReturnsChart(data);
    });
});

//날짜 필터링 기능
d3.select("#filterButton").on("click", function() {
    //필터링된 날짜을 읽음
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    
    //날짜 비교를 위한 시간 설정
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    //필터링된 날짜을 filteredData에 입력받음
    const filteredData = salesData.filter(d => d.date >= startDate && d.date <= endDate);

    //필터링된 날짜에 맞는 시각화 생성
    drawSalesChart(filteredData);
    drawProductChart(filteredData);
    drawReturnsChart(filteredData);
});
   

