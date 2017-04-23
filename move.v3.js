// 更新：增加setStyle和setOpacity函数，减少主要代码冗余

// 运动函数
function startMove(obj, attrJson, fn) {
    clearTimeout(obj.timer); //清除定时器

    var currValue,    //操作obj的相应属性的当前值
        speed,        //经过计算此次应该移动的速度
        isEnd = true; //标记json属性数据是否到达目标值

    for (var attrName in attrJson) {
        // 将参数转换一下，以防是字符串，或者带有px后缀
        attrJson[attrName] = parseInt(attrJson[attrName]);
        // 获取当前属性值
        currValue = parseInt(getStyle(obj, attrName));

        //检测该属性值是否到达目标值，到达了就跳过，没有到达则继续处理且 定时器不能结束
        if (currValue != attrJson[attrName]) {
            isEnd = false;
            // 计算此次前进的速度
            speed = (attrJson[attrName]-currValue)/8; //除数越大，速度越慢
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            currValue += speed; // 前进的速度+物体原来的位置=物体新的目标位置

            // 设置元素属性值
            setStyle(obj, attrName, currValue);
        } //end if

    } //end for

    // 属性列表循环结束，是否全部属性都到达目标，是则清除定时器
    if (isEnd) { //结束了 执行链式调用 然后返回
        if (typeof fn === "function") fn(); //fn instanceof Function
        return ;
    } // else
    //还没结束 继续开定时器
    obj.timer = setTimeout(function() {
        startMove(obj, attrJson, fn);
    }, 30);
}

// 获取样式
function getStyle(element, attrName) {
    var value;
    if (element.currentStyle) {
        value = element.currentStyle[attrName];
    } else {
        value = getComputedStyle(element, false)[attrName];
    }
    // opacity特殊处理
    if (attrName === 'opacity') { //将opacity转换成0~100
        value = parseFloat(value) * 100;
    }
    return value;
}

// attrValue 只能为数字类型的值
function setStyle(element, attrName, attrValue, unit) {
    // opacity特殊处理
    if (attrName === 'opacity') {
        setOpacity(element, attrValue);
    } else if (typeof attrValue === 'string') {
        element.style[attrName] = attrValue;
    } else if (typeof attrValue === 'number') {
        element.style[attrName] = attrValue + (unit ? unit : 'px');
    }
}
// 设置兼容的透明度
function setOpacity(element, value) {
    element.style['opacity'] = value / 100; //opacity设置值是0~1
    element.style['filter'] = 'alpha(opacity=' + value + ')'; // 兼容IE <= 8的时候数值是0~100
}