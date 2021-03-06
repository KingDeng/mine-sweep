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
var mineId = [];		//地雷所在位置Id
var mineFlag = [];		//记录当前区域是否被翻开
var mineNum = [];		//周围地雷个数
var square = [];		//记录所有格子的中心坐标
var flagId = [];		//记录红旗所在位置Id
var firstXY = {
		"x": 50,
		"y": 40
};						//左上角第一个六边形中心点坐标

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
	$("#panel polygon").on("contextmenu",flagMine);
	$("#btnNew").on("click", newStart);
});
/**
 * 鼠标右键标记地雷事件
 * @param e
 * @returns {Boolean}
 */
function flagMine(e){
	if(e.which == 3){
		var target = e.target;
		var id = $(target).attr("id");
		for(var i = 0; i < mineId.length; i++){
			if(id == mineId[i]){
				flagId.push(id);
			}
		}
		var rest = parseInt($("#minesRest").text());
		rest--;
		$("#minesRest").text(rest);
		$("#panel").append(createFlag(id));
	}
	return false;
}
/**
 * 扫雷事件(即单击鼠标左键事件)
 */
function sweep(){
	var id = parseInt($(this).attr("id"));
	var tempTime = parseInt($("#time").text());
	if(tempTime == 0){
		timing();
		initMines(id);
	}
	
	$(this).css("fill", "#009900");
	sweepZone(id);
}

function sweepZone(currId){
	var current = $("#" + currId);
	if(mineFlag[currId])
		return;
	if(mineNum[currId] > 0 && mineNum[currId] < 7){
		mineFlag[currId] = true;
		$("#gSize").append(createText(mineNum[currId], square[currId]));
		current.css("fill", "#009900");
		needOpen();
		return;
	} else if(mineNum[currId] > 6) {
		fail(currId);
		return;
	} else {
		mineFlag[currId] = true;
		current.css("fill", "#009900");
		needOpen();
	}
	
	var six = [], lt, rt, l, r, lb, rb;
	lt = currId - 19;
	rt = currId - 18;
	l = currId - 1;
	r = currId + 1;
	lb = currId + 18;
	rb = currId + 19;
	if(lt >= 0 && (currId - 18) % 37 != 0){
		six.push(lt);
	}
	if(rt >= 0 && (rt + 1) % 37 != 0){
		six.push(rt);
	}
	if(l >= 0 && ((l + 1) % 37 != 0) && (l - 17) % 37 != 0){
		six.push(l);
	}
	if(r < 240 && ((currId + 1) % 37 != 0) && (currId - 17) % 37 != 0){
		six.push(r);
	}
	if(lb < 240 && (currId - 18) % 37 != 0){
		six.push(lb);
	}
	if(rb < 240 && (currId + 1) % 37 != 0){
		six.push(rb);
	}
	for(var i in six){
		sweepZone(six[i]);
	}
	return;
}
/**
 * 更新剩余未翻开区域数目
 */
function needOpen(){
	var num = parseInt($("#needOpen").text());
	num--;
	$("#needOpen").text(num);
}
/**
 * 踩到地雷，失败
 * @param current
 */
function fail(currId){
	var err = true;
	var t = createUse(currId,err);
	for(var i in mineId){
		$("#" + mineId[i]).css("fill", "#009900");
		$("#panel").append(createUse(mineId[i]));
	}
	$("#panel").append(t);
	clearTimeout(timeout);
	alert("你输了！");
}
/**
 * 生成地雷
 */
function initMines(first){
	while(mineId.length < mineSize){
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
	flagId = [];
	for(var i = 0; i < 240; i++){
		mineNum[i] = 0;
	}
	
	$("#panel text").remove();
	$("#panel use").remove();
	$("#gSize text").remove();
	$("#time").text("0");
	$("#needOpen").text(240 - mineSize);
	$("#minesRest").text(mineSize);
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
function createUse(currId,flag){
	var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
	if(flag)
		use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#mineErr");
	else
		use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#mine");
	$(use).attr("x", square[currId].x - 15);
	$(use).attr("y", square[currId].y - 20);
	$(use).removeAttr("id");
	return use;
}
function createFlag(currId){
	var flag = document.createElementNS("http://www.w3.org/2000/svg", "use");
	flag.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#flagMark");
	$(flag).attr("x", square[currId].x);
	$(flag).attr("y", square[currId].y);
	$(flag).removeAttr("id");
	$(flag).on("click", function(){
		$(this).remove();
		var rest = parseInt($("#minesRest").text());
		rest++;
		$("#minesRest").text(rest);
	});
	return flag;
}
String.prototype.trim = function(){
    return this.replace(/(^[\s]*)|([\s]*$)/g, "");
};