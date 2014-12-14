/**
 * =================================================================
 * 
 * @author   King Deng
 * @email    kuohsing_don@163.com
 * @date     2014-12
 * @version  1.0
 * 
 *  ================================================================
 */
var timeout;			//setTimeOut返回值
var sideLength = 16;	//六边形边长
var mineSize = 35;		//地雷个数
var mineId = [];		//地雷所在位置
var mineFlag = [];		//记录当前区域是否被翻开
var mineNum = [];		//周围地雷个数
var square = [];		//记录所有格子的中心坐标
var firstXY = {};		//左上角第一个六边形中心点坐标
firstXY.x = 50;
firstXY.y = 40;

$(document).ready(function(){
	var row = 13, col = 20, index = 0;
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
			
			var tempP = createPolygon(index, centerXY, sideLength);
			$("#panel").append(tempP);
			square.push(centerXY);
			mineNum[index] = 0;
			index++;
		}
	}
	$("#needOpen").text(index - mineSize);
	$("#minesRest").text(mineSize);
	$("#panel polygon").on("click", sweep);
	$("#btnNew").on("click", newStart);
});
/**
 * 扫雷事件(即单击雷区事件)
 */
function sweep(){
	var id = parseInt($(this).attr("id"));
	var tempTime = parseInt($("#time").text());
	if(tempTime == 0){
		timing();
		initMines(id);
	}
	
	
	$(this).css("fill", "#009900");
	sweepZone($(this));
}

function sweepZone(current){
	var curr = parseInt(current.attr("id"));
	if(mineFlag[curr])
		return;
	if(mineNum[curr] > 0 && mineNum[curr] < 7){
		mineFlag[curr] = true;
		$("#panel").append(createText(mineNum[curr], square[curr]));
		current.css("fill", "#009900");
		return;
	} else if(mineNum[curr] > 6) {
		
	} else {
		mineFlag[curr] = true;
		current.css("fill", "#009900");
	}
	
	var six = [], lt, rt, l, r, lb, rb;
	lt = curr - 19;
	rt = curr - 18;
	l = curr - 1;
	r = curr + 1;
	lb = curr + 18;
	rb = curr + 19;
	if(lt >= 0 && (curr - 18) % 37 != 0){
		six.push($("#" + lt));
	}
	if(rt >= 0 && (rt + 1) % 37 != 0){
		six.push($("#" + rt));
	}
	if(l >= 0 && ((l + 1) % 37 != 0) && (l - 17) % 37 != 0){
		six.push($("#" + l));
	}
	if(r < 240 && ((curr + 1) % 37 != 0) && (curr - 17) % 37 != 0){
		six.push($("#" + r));
	}
	if(lb < 240 && (curr - 18) % 37 != 0){
		six.push($("#" + lb));
	}
	if(rb < 240 && (curr + 1) % 37 != 0){
		six.push($("#" + rb));
	}
	for(var i in six){
		sweepZone(six[i]);
	}
	return;
}
/**
 * 生成地雷
 */
function initMines(first){
	while(mineId.length < 40){
		var flag = true;
		var temp = Math.floor(Math.random() * 240);
		for(var i = 0; i < mineId.length; i++){
			if(mineId[i] == temp || first == temp){
				flag = false;
				break;
			}
		}
		if(flag)
			mineId.push(temp);
	}
	countMineNum();
}
/**
 * 计算每个格子周围地雷个数
 */
function countMineNum(){
	for(var i = 0; i < mineId.length; i++){
		mineNum[mineId[i]] = 7;
		var curr, lt, rt, l, r, lb, rb;
		curr = mineId[i];
		lt = curr - 19;
		rt = curr - 18;
		l = curr - 1;
		r = curr + 1;
		lb = curr + 18;
		rb = curr + 19;
		if(lt >= 0 && (curr - 18) % 37 != 0)
			mineNum[lt]++;
		if(rt >= 0 && (rt + 1) % 37 != 0)
			mineNum[rt]++;
		if(l >= 0 && ((l + 1) % 37 != 0) && (l - 17) % 37 != 0)
			mineNum[l]++;
		if(r < 240 && ((curr + 1) % 37 != 0) && (curr - 17) % 37 != 0)
			mineNum[r]++;
		if(lb < 240 && (curr - 18) % 37 != 0)
			mineNum[lb]++;
		if(rb < 240 && (curr + 1) % 37 != 0)
			mineNum[rb]++;
	}
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
 * 重新开始游戏，停止计时
 */
function newStart(){
	mineId = [];
	mineFlag = [];
	mineNum = [];
	square = [];
	for(var i = 0; i < 240; i++){
		mineNum[i] = 0;
	}
	
	$("#panel text").remove();
	$("#time").text("0");
	clearTimeout(timeout);
	$("#panel polygon").css("fill", "#a0a0a0");
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

function createText(num, centerXY){
	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	$(text).attr("x", centerXY.x);
	$(text).attr("y", centerXY.y + 5);
	$(text).text(num);
	$(text).css("text-anchor", "middle");
	return text;
}
String.prototype.trim = function(){
    return this.replace(/(^[\s]*)|([\s]*$)/g, "");
};