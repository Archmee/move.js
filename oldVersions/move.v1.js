// 原始版智能社move.js

// 运动函数
function startMove(obj, attrJson, fn) {
	clearInterval(obj.timer);

	obj.timer = setInterval(function() {
		var attrValue, 	//操作obj的相应属性的当前值
			speed, 		//经过计算此次应该移动的速度
			isEnd = true; //标记json属性数据是否到达目标值

		for (var attrName in attrJson) {
		
			// 获取属性值
			if (attrName === 'opacity') {//获取opacity的值的处理方式稍有不同
				attrValue = Math.round(parseFloat(getStyle(obj, attrName))*100); 
			} else {
				attrValue = parseInt(getStyle(obj, attrName));
			}

			//检测该属性值是否到达目标值，到达了就跳过，没有到达则继续处理且 定时器不能结束
			if (attrValue != attrJson[attrName]) {
				isEnd = false;

				// 计算此次前进的速度
				speed = (attrJson[attrName]-attrValue)/10; //除数越大，速度越慢
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

				speed += attrValue; // 前进的速度+物体原来的位置=物体新的目标位置

				// 设置元素属性值
				if (attrName === 'opacity') {
					obj.style[attrName] = speed/100; //opacity设置值是0~1
					obj.style['filter'] = 'alpha(opacity='+speed+')'; // 兼容IE <= 8的时候数值是0~100
				} else {
					obj.style[attrName] = speed+'px';
				}
			} //end if

		} //end for

		// 属性列表循环结束，是否全部属性都到达目标，是则清除定时器
		if (isEnd) {
			clearInterval(obj.timer);
			
			if (typeof fn === "function") fn(); //执行链式操作
		} //end if
		
	}, 30);//end interval	
} //end function

// 获取样式
function getStyle(element, attr) {
	if (element.currentStyle) {
		return element.currentStyle[attr];
	} else {
		return getComputedStyle(element, false)[attr];
	}
}