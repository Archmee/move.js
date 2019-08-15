// 更新：使用新的requestAnimationFrame API来优化动画
// 相关文章 https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/

// obj：Element, 运动对象
// attr：Object, 运动属性
// duration：INT, 期望时长，在固定时间内对所有属性进行相应运动
// effect：String, 效果函数，可用参数见Tween对象
// callback: Function, 回调
// example: startMove(div1, {width: 500, height:300}, 1000, 'easeOut')
function startMove(obj, attr, duration, effect, func) {
    // 处理省略参数的默认值
    if (!duration) {duration = 3000;}
    if (!effect) {effect = 'linear';}

    cancelAnimFrame(obj.timer);
    var curr = {},
        diff = {}; //距离或说差值

    for (var attrName in attr ) {
        // 防止字符串以及px后缀
        attr[attrName] = parseFloat(attr[attrName]);
        // 获取当前属性值并保存
        curr[attrName] = parseFloat(getStyle(obj, attrName));
        diff[attrName] = attr[attrName] - curr[attrName];
    }
    
    var start = Date.now(); //记录当前时间
    (function begin() {
    	//打开下一个定时器，为确保时间间隔精度，放在其他语句执行前
        obj.timer = requestAnimFrame(begin);

        var time = Date.now() - start; //已执行时间

        // 因为定时器不是按照1ms来加的，现在是16ms，所以time不一定严格等于duration，也有可能是大于
        // 所以要把这次循环执行才算完，也是等于的时候还要执行的操作
        if (time >= duration) {
            time = duration;
        }

        // 计算该物体所有属性在当前时间下的运动位置
        for (var attrName in attr) {
            var value = Tween[effect](time, curr[attrName], diff[attrName], duration);
            setStyle(obj, attrName, value);
        }

        //执行时间到了，停止运动，执行回调，退出
        if (time === duration) {
        	cancelAnimFrame(obj.timer);
            if (typeof func === 'function') {
                func.call(obj);
            }
            return ;
        }

    }()); //now
}

// 简单兼容
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
				return window.setTimeout(callback, 1000 / 60);
			};
})();

window.cancelAnimFrame = (function() {
	return  window.cancelAnimationFrame    || 
			window.mozCancelAnimationFrame ||
			window.clearTimeout;
})();

/* Erik Möller requestAnimationFrame/cancelAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { 
		            	callback(currTime + timeToCall); 
		             }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());*/


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

/*Tween是一个算法对象，里面存储了运动算法函数，函数参数说明如下
t : 已执行时间
b : 当前值
c : change 变化量：期望目标值和当前值之差
d : duration 需要执行时时间 
*/
/* 共有可用属性名如下:直线:linear, 减速: Expo, 弹性: Elastic, 回退: Back, 反弹:Bounce 等等
    0: "linear"
    1: "easeInQuad"
    2: "easeOutQuad"
    3: "easeInOutQuad"
    4: "easeInCubic"
    5: "easeOutCubic"
    6: "easeInOutCubic"
    7: "easeInQuart"
    8: "easeOutQuart"
    9: "easeInOutQuart"
    10: "easeInQuint"
    11: "easeOutQuint"
    12: "easeInOutQuint"
    13: "easeInSine"
    14: "easeOutSine"
    15: "easeInOutSine"
    16: "easeInExpo"
    17: "easeOutExpo"
    18: "easeInOutExpo"
    19: "easeInCirc"
    20: "easeOutCirc"
    21: "easeInOutCirc"
    22: "easeInElastic"
    23: "easeOutElastic"
    24: "easeInOutElastic"
    25: "easeInBack"
    26: "easeOutBack"
    27: "easeInOutBack"
    28: "easeInBounce"
    29: "easeOutBounce"
    30: "easeInOutBounce"
*/
var Tween = {
    // 线性运动
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    
    //二次方的缓动（t^2）；
    easeInQuad: function(t,b,c,d){ //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function(t,b,c,d){ //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function(t,b,c,d){ //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    //三次方的缓动（t^3）
    easeInCubic: function(t,b,c,d){
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function(t,b,c,d){
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function(t,b,c,d){
        if ((t/=d/2) < 1) {
            return c/2*t*t*t + b;
        }
        return c/2*((t-=2)*t*t + 2) + b;
   },

    //四次方的缓动（t^4）；
    easeInQuart: function(t,b,c,d){
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function(t,b,c,d){
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function(t,b,c,d){
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    //5次方的缓动（t^5）；
    easeInQuint: function(t,b,c,d){
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function(t,b,c,d){
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function(t,b,c,d){
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t*t + b;
        }
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },

    //正弦曲线的缓动（sin(t)）
    easeInSine: function(t,b,c,d){
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function(t,b,c,d){
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function(t,b,c,d){
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },

    //指数曲线的缓动（2^t）；
    easeInExpo: function(t,b,c,d){
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function(t,b,c,d){
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function(t,b,c,d){
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },


    //圆形曲线的缓动（sqrt(1-t^2)）；
    easeInCirc: function(t,b,c,d){
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function(t,b,c,d){
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function(t,b,c,d){
        if ((t/=d/2) < 1) {
            return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        }
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },

    //指数衰减的正弦曲线缓动
    easeInElastic: function(t,b,c,d,a,p){ //弹动渐入
        if (t==0) return b;  
        if ((t/=d)==1) return b+c;  
        if (!p) p=d*.3;
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function(t,b,c,d,a,p){ //弹动渐出
        if (t==0) return b;  
        if ((t/=d)==1) return b+c;  
        if (!p) p=d*.3;
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
    },
    easeInOutElastic: function(t,b,c,d,a,p){
        if (t==0) return b;  
        if ((t/=d/2)==2) return b+c;  
        if (!p) p=d*(.3*1.5);
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },

    //超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
    easeInBack: function(t,b,c,d,s){ //回退渐入
        if (typeof s == 'undefined') s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function(t,b,c,d,s){ //回退渐出
        if (typeof s == 'undefined') s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function(t,b,c,d,s){
        if (typeof s == 'undefined') s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    //指数衰减的反弹缓动。
    easeInBounce: function(t,b,c,d){ //弹球减振（弹球渐出）
        return c - Tween['easeOutBounce'](d-t, 0, c, d) + b;
    },
    easeOutBounce: function(t,b,c,d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    easeInOutBounce: function(t,b,c,d){
        if (t < d/2) return Tween['easeInBounce'](t*2, 0, c, d) * 0.5 + b;
        return Tween['easeOutBounce'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
}