/**
 *作者QQ: 3465344901
  * 优化滑动执行的方法,更稳定,但是懒得支持多手指
  * API 28
 
**/



importClass(android.graphics.Path);
importClass(android.accessibilityservice.GestureDescription);
importClass(android.accessibilityservice.AccessibilityService.GestureResultCallback);
var accessibilityService = runtime.accessibilityBridge.getService();
var packageName = context.getPackageName();
var result;
//log(auto.service)
module.exports = function(gesturesAry) {
    if (device.sdkInt < 26) {
        log("API:" + device.sdkInt)
        let dialog = dialogs.build({
            title: "警告⚠",
            titleColor: "#F44336",
            type: "foreground-or-overlay",
            content: "你的设备环境无法执行变速手势动作，当前安卓版本：" + device.release + ", API:" + device.sdkInt + ", 非兼容版本，仅支持安卓8及以上版本",
            contentColor: "#F44336",
            positive: "我已知晓",
            positiveColor: "#000000",
            canceledOnTouchOutside: false
        }).show();

        return false;
    }
    if (!accessibilityService) {
        let message = '无障碍服务未运行，请尝试开启无障碍服务';
        throw new Error(message);
    }

    result = threads.disposable();

    for (let stroke_gestures of JSON.parse(JSON.stringify(gesturesAry))) {
        createStroke(stroke_gestures);

    }
    return result.blockedGet();
}



//createStroke(gestures)
/**
 * @description:Added in API level 26
 * @param {array} points
 * gesture = [
 * [time,duratio, [x,y]]
 * [time,duratio, [x,y]]
 * ....
 * ],
 * 
 * https://developer.android.google.cn/reference/android/accessibilityservice/GestureDescription.StrokeDescription
 * @return: void
 */
function createStroke(points) {
    let currentStroke;
    let max = points.length - 1;
    var strokeArr = toStrokes(points)

    for (let i = 0; i < max; i++) {
        autojsGestures(strokeArr[i]);
    }
    //执行最后一步并通知返回结果
    autojsGestures(strokeArr[max], true)


}

function toStrokes(args) {
    let len = args.length;
    let max = args.length - 1;

    let currentStroke;
    let strokes = [];
    for (var i = 0; i < len; i++) {
        let gesture = args[i];
        let pointsIndex = 2;
        let start = gesture[0];
        let duration = gesture[1];
        let path = new Path();
        path.moveTo(gesture[pointsIndex][0], gesture[pointsIndex][1]);
        if (args[i + 1]) {
            path.lineTo(args[i + 1][pointsIndex][0], args[i + 1][pointsIndex][1]);
        } else {
            path.lineTo(args[i][pointsIndex][0], args[i][pointsIndex][1]);

        }

        if (i == 0) {
            currentStroke = new GestureDescription.StrokeDescription(path, start, duration, i === max ? false : true);
        } else if (i === max) {
            currentStroke = currentStroke.continueStroke(path, start, duration, false)
        } else {
            //中继
            currentStroke = currentStroke.continueStroke(path, start, duration, true);
        }
        strokes[i] = currentStroke;

    }

    return strokes;
}

function autojsGestures(stroke, end) {

    let gestureDescription = new GestureDescription.Builder().addStroke(stroke).build();
    const succed = accessibilityService.dispatchGesture(
        gestureDescription,
        new android.accessibilityservice.AccessibilityService.GestureResultCallback({
            onCompleted: function(stroke) {

                if (end) {
                    result.setAndNotify(true)
                }
                return true;
            },
            onCancelled: function(e) {
                result.setAndNotify(false)
            },
        }),
        null
    );
    if (!succed) {
        toastLog("手势执行失败：")
        console.error("手势执行失败：");
        result.setAndNotify(false);
    }

}