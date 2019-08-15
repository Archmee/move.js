# move.js

## 说明
其中move.js是最新版本，oldVersion均为以前版本，dist下为可压缩版本，同时保存在这里是为了方便希望学习的同学直接查看对比每一个版本的变化
或许应该增加一个changeLog...

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
- "linear"
- "easeInQuad"
- "easeOutQuad"
- "easeInOutQuad"
- "easeInCubic"
- "easeOutCubic"
- "easeInOutCubic"
- "easeInQuart"
- "easeOutQuart"
- "easeInOutQuart"
- "easeInQuint"
- "easeOutQuint"
- "easeInOutQuint"
- "easeInSine"
- "easeOutSine"
- "easeInOutSine"
- "easeInExpo"
- "easeOutExpo"
- "easeInOutExpo"
- "easeInCirc"
- "easeOutCirc"
- "easeInOutCirc"
- "easeInElastic"
- "easeOutElastic"
- "easeInOutElastic"
- "easeInBack"
- "easeOutBack"
- "easeInOutBack"
- "easeInBounce"
- "easeOutBounce"
- "easeInOutBounce"
> 直线：linear,
减速: Expo,
弹性: Elastic,
回退: Back,
反弹:Bounce 等等
