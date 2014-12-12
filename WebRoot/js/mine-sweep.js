/**
 * =================================================================
 * 
 * @author   King Deng
 * @email    kuohsing_don@163.com
 * @date     2014-12
 * @version  1.0
 * 
 *  =================================================================
 */
var timeout;					//setTimeOut返回值
var begin = false;		//扫雷开始标识
var sideLength = 16;	//六边形边长
var firstXY = {};		//左上角第一个六边形中心点坐标
firstXY.x = 50;
firstXY.y = 40;

$(document).ready(function(){
	var row = 13, col = 20;
	for(var i = 0; i < row; i++){
		if(i % 2 != 0)
			col = 19;
		else 
			col = 18;
		
		for(var j = 0; j < col; j++){
			var centerXY = {};
			if(i % 2 == 0)
				centerXY.x = firstXY.x + sideLength * Math.sqrt(3) / 2 + sideLength * Math.sqrt(3) * j;
			else
				centerXY.x = firstXY.x + sideLength * Math.sqrt(3) * j;
			
			centerXY.y = firstXY.y + sideLength * i * 3 / 2;
			
			var tempP = createPolygon(i, centerXY, sideLength);
			$("#panel").append(tempP);
		}
	}
	$("#panel polygon").on("click", sweep);
	$("#btnNew").on("click", newStart);
});
/**
 * 扫雷事件(即单击雷区事件)
 */
function sweep(){
	var tempTime = parseInt($("#time").text());
	if(tempTime == 0){
		timing();
		initMines();
	}
	$(this).css("fill", "#009900");
	
}
/**
 * 生成地雷
 */
function initMines(){
	
}
/**
 * 计时函数
 */
function timing(){
	var temp = parseInt($("#time").text());
	temp = temp + 1;
	$("#time").text(temp);
	timeout = setTimeout(timing,1000);
}
/**
 * 生成整个雷区
 * @param index 	六边形的ID
 * @param centerXY	六边形中心点坐标
 * @param sideLen	六边形边长
 * @returns
 */
function createPolygon(index, centerXY, sideLen){
	var x = centerXY.x, y = centerXY.y;
	var points = [];
	var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	var first = {}, second = {}, third = {}, 
		fourth = {}, fifth = {}, sixth = {};
	first.x = x - Math.sqrt(3) * sideLen / 2;
	first.y = y - sideLen / 2;
	second.x = x;
	second.y = y - sideLen;
	third.x = x + Math.sqrt(3) * sideLen / 2;
	third.y = y - sideLen / 2;
	fourth.x = x + Math.sqrt(3) * sideLen / 2;
	fourth.y = y + sideLen / 2;
	fifth.x = x;
	fifth.y = y + sideLen;
	sixth.x = x - Math.sqrt(3) * sideLen / 2;
	sixth.y = y + sideLen / 2;
	
	points.push(first);
	points.push(second);
	points.push(third);
	points.push(fourth);
	points.push(fifth);
	points.push(sixth);
	
	var pointStr = "";
	for(var i = 0; i < points.length; i++){
		pointStr += points[i].x + "," + points[i].y + " ";
	}
	
	$(polygon).attr("id", index);
	$(polygon).attr("points", pointStr.trim());
	return polygon;
}
/**
 * 重新开始游戏
 */
function newStart(){
	$("#time").text("0");
	clearTimeout(timeout);
	$("#panel polygon").css("fill", "#a0a0a0");
}

String.prototype.trim = function(){
    return this.replace(/(^[\s]*)|([\s]*$)/g, "");
};