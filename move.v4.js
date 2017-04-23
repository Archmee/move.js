// 更新：做了一点优化，把只需要单独计算一次的初始值提出来放到要执行的定时器任务外面
// 现在定时器任务在一个闭包内执行，
// 测试运动差距上很大时的和上一版对比也只有1~2ms的优化(要保证和上一版的定时间隔相同的情况下，现在16ms)

// 运动函数
// obj: 运动对象
// attrJson：同时运动的属性
// stopFactor：阻碍系数，值越大，运动速度越慢
// fn: 回调函数
function startMove(obj, attrJson, stopFactor, fn) {
    clearTimeout(obj.timer); //清除定时器

    // 为防止没有阻碍系数，但是有fn回调
    if (typeof stopFactor === 'function') {
        fn = stopFactor;
        stopFactor = null;
    }

    var currValue = {},     //操作obj的相应属性的当前值
        speed = 0,          //经过计算此次应该移动的速度
        isEnd = true;       //标记json属性数据是否到达目标值

    for (var attrName in attrJson ) {
        // 将参数转换一下，以防是字符串，或者带有px后缀
        attrJson[attrName] = parseFloat(attrJson[attrName]);
        // 获取当前属性值并保存
        currValue[attrName] = parseFloat(getStyle(obj, attrName));
    }

    var move = function () {
        isEnd = true;
        for (var attrName in attrJson) {
            //检测该属性值是否到达目标值，到达了就跳过，没有到达则继续处理且 定时器不能结束
            if (currValue[attrName] != attrJson[attrName]) {
                // 标记未结束
                isEnd = false;

                // 计算此次前进的速度
                speed = (attrJson[attrName]-currValue[attrName])/(stopFactor ? stopFactor : 6);//阻碍
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); //剩余值处理
                
                // 物体新的目标位置 = 前进的速度+物体上一次的位置
                currValue[attrName] += speed;
                setStyle(obj, attrName, currValue[attrName]);
            } 

        } //end for

        // 属性列表循环结束，是否全部属性都到达目标，是则清除定时器
        if (isEnd) { 
            //结束了 执行链式调用 然后返回
            if (typeof fn === "function") {
                fn();
            }
            return ;
        }
        
        //还没结束 继续开定时器
        obj.timer = setTimeout(arguments.callee, 16); //游戏运动缓冲时的值为1000/60比较好
    }
    
    move();
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