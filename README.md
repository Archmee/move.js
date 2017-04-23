# move.js

## 说明
其中move.latest.js是最新可下载版本，与当前最大版本文件是相同的。其余move.x.js均为以前版本，同时保存在这里是为了方便希望学习的同学直接查看对比每一个版本的变化

## 使用
引入js文件后
```js
startMove(
   element,     // 希望运动的元素
   attributes,  // 同时改变的属性和值，是一个对象
   duration,    // 期望动画在多长时间内执行完毕
   effect,      // 运动物理方程
   callback     // 动画完成后的回调函数
);
```
以上函数参数中只有effect参数是从内部提供的选项中选择的：
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
> 直线：linear,
减速: Expo,
弹性: Elastic,
回退: Back,
反弹:Bounce 等等