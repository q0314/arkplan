/*
 * @Author: 大柒
 * @QQ: 531310591@qq.com
 * @Date: 2021-04-18 04:29:01
 * @Version: Auto.Js Pro
 * @Description: 工具类
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-17 20:17:41
 */
importClass(android.graphics.drawable.GradientDrawable);

const _resources_ = context.getResources();
const scale = _resources_.getDisplayMetrics().density;




module.exports = {
    dp2px:
        /**
         * dp转px , 密度比例
         * @param {Number} dp 
         * @returns 
         */
        dp => Math.floor(dp * scale + 0.5),
    px2dp:

        /**
         * px转dp
         * @param {Number} px 
         * @returns 
         */
        px => Math.floor(px / scale + 0.5),
    isHorizontalScreen:
        /**
         * 是否横屏
         * @returns 
         */
        function() {
            let ori;

            try {
                ori = context.getSystemService(context.WINDOW_SERVICE).getDefaultDisplay().getRotation();
                //0竖屏 1横屏
                return ori
            } catch (e) {
                let config = _resources_.getConfiguration();
                ori = config.orientation;
                if (ori == config.ORIENTATION_LANDSCAPE) {
                    //横屏2
                    return true;
                } else if (ori == config.ORIENTATION_PORTRAIT) {
                    //竖屏1
                    return false;
                }
            }


        },
    getWidthHeight:
        /**
         * 返回分辨率宽，高
         * 跟随屏幕方向变化
         * 不好用，在某些系统上获取到的分辨率与测试机获取到的完全相反
         * 其次，也有些系统获取到的状态栏高度好像是0，
         */
        function() {
            //方法1
            let wPixel = _resources_.getDisplayMetrics().widthPixels;
            let hPixel = _resources_.getDisplayMetrics().heightPixels;
            
            if (wPixel > hPixel) {
                wPixel += this.iStatusBarHeight;
            } else {
                hPixel += this.iStatusBarHeight;
            };
            
            return [wPixel, hPixel];

        },
    createShape:
        /**
         * 创建样式
         * @param {px} roundRadius 圆角
         * @param {Number} shape  设置样式形状类型:包括默认RECTANGLE（矩形）, OVAL（椭圆）, LINE（线条）, RING（环形）；
         * @param {ColorString} fillColor 背景颜色 null:透明 
         * @param {Array} strokes 边框线样式 [宽度:px ,颜色:ColorStr ,间隔:px ,长度:px]
         */
        function(roundRadius, shape, fillColor, strokes) {
            strokes = strokes || null;
            if (strokes != null && strokes[1] != "") strokes[1] = colors.parseColor(strokes[1]);
            fillColor = colors.parseColor((fillColor && fillColor != "") ? fillColor : "#00000000");
            var gd = new GradientDrawable();
            gd.setColor(fillColor);
            gd.setShape(shape ? GradientDrawable[shape] : GradientDrawable.RECTANGLE);
            if (roundRadius != -1) gd.setCornerRadius(roundRadius);
            if (strokes != null && strokes[0] != -1) gd.setStroke.apply(gd, strokes);
            return gd;
        },
    ObjectDefinePro: function(obj, key, action) {
        var mValue = obj[key];
        Object.defineProperty(obj, key, {
            get: function() {
                return mValue;
            },
            set: function(newval) {
                mValue = newval;
                action(newval);
            }
        })
    },
    ColorEvaluator: ColorEvaluator,
    resources: _resources_,
    // log(context.getDisplay)
    //context.getSystemService(context.WINDOW_SERVICE).getDefaultDisplay().getHeight();

    getWidthPixels: _resources_.getDisplayMetrics().widthPixels,
    getHeightPixels: _resources_.getDisplayMetrics().heightPixels,
    iStatusBarHeight: _resources_.getDimensionPixelSize(_resources_.getIdentifier("status_bar_height", "dimen", "android")),
};

/**
 * 颜色过度算法
 * 参考链接:https://blog.csdn.net/a136447572/article/details/89954075
 */
function ColorEvaluator(value, action) {
    action = action || new Function();
    let mCurrentRed, mCurrentGreen, mCurrentBlue, mCurrentColor;

    // 在evaluate（）里写入对象动画过渡的逻辑:此处是写颜色过渡的逻辑
    this.evaluate = function(fraction, startValue, endValue) {
        // 获取到颜色的初始值和结束值
        let startColor = mCurrentColor || startValue;
        let endColor = colors.parseColor(endValue);
        // 通过字符串截取的方式将初始化颜色分为RGB三个部分，并将RGB的值转换成十进制数字
        // 那么每个颜色的取值范围就是0-255
        let [startRed, startGreen, startBlue] = [colors.red(startColor), colors.green(startColor), colors.blue(startColor)]
        let [endRed, endGreen, endBlue] = [colors.red(endColor), colors.green(endColor), colors.blue(endColor)];
        // 将初始化颜色的值定义为当前需要操作的颜色值
        [mCurrentRed, mCurrentGreen, mCurrentBlue] = [startRed, startGreen, startBlue];
        // 计算初始颜色和结束颜色之间的差值
        // 该差值决定着颜色变化的快慢:初始颜色值和结束颜色值很相近，那么颜色变化就会比较缓慢;否则,变化则很快
        // 具体如何根据差值来决定颜色变化快慢的逻辑写在getCurrentColor()里.
        var redDiff = Math.abs(startRed - endRed);
        var greenDiff = Math.abs(startGreen - endGreen);
        var blueDiff = Math.abs(startBlue - endBlue);
        var colorDiff = redDiff + greenDiff + blueDiff;
        if (mCurrentRed != endRed) {
            mCurrentRed = getCurrentColor(startRed, endRed, colorDiff, 0, fraction);
        }
        if (mCurrentGreen != endGreen) {
            mCurrentGreen = getCurrentColor(startGreen, endGreen, colorDiff, redDiff, fraction);
        }
        if (mCurrentBlue != endBlue) {
            mCurrentBlue = getCurrentColor(startBlue, endBlue, colorDiff, redDiff + greenDiff, fraction);
        }
        // 将计算出的当前颜色的值组装返回
        var color = colors.rgb(mCurrentRed, mCurrentGreen, mCurrentBlue)
        var currentColor = colors.toString(color);
        action(value, currentColor, color, colorStr => {
            mCurrentColor = colorStr
        }, fraction); //执行回调方法
        return currentColor;
    }

    // 具体是根据fraction值来计算当前的颜色。
    function getCurrentColor(startColor, endColor, colorDiff, offset, fraction) {
        var currentColor;
        if (startColor > endColor) {
            currentColor = startColor - parseInt((startColor - endColor) * fraction);
        } else {
            currentColor = startColor + parseInt((endColor - startColor) * fraction);
        }
        return currentColor;
    }
}