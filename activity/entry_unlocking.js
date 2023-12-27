"ui";
importClass(android.app.Activity);
importClass(android.view.View);

ui.layout(
    <vertical>
        <canvas layout_weight="1" id="canvas" />
        <frame>
            <HorizontalScrollView  w="*"h="50" bg="#dddddd">
                <horizontal h="auto">
                    <button id="openImage" text="打开图片" margin="-3 5"/>
                    
                    <button id="but_q" layout_weight="1" h="auto" text="清空动作" margin="-3 5"/>
                   <button id="but_s" layout_weight="1" h="auto" text="启动测试" margin="-3 5"/>
                    <button id="but_b" layout_weight="1" h="auto" text="保存并导入模块" margin="-3 5"/>
                </horizontal>
            </HorizontalScrollView>
        </frame>
    </vertical>
);

var storage = storages.create("解锁模块录制");

var MainImg;


var paint = new Paint;
//paint.setTextAlign(Paint.Align.CENTER);
paint.setStrokeWidth(5);
paint.setStyle(Paint.Style.STROKE);
paint.setARGB(255, 0, 0, 0);
var textSize = 50;
paint.setTextSize(textSize);

var paint1 = new Paint;

//paint1.setTextSize(75);
//paint.setTextAlign(Paint.Align.CENTER);
paint1.setStrokeWidth(3);
paint1.setStyle(Paint.Style.FILL);
paint1.setTextSize(textSize);

//paint.setARGB(255, 0, 0, 0);
paint.setColor(colors.RED);
paint1.setColor(colors.GREEN);

activity.window.addFlags(android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS); //设置状态栏透明

//每次动作。
var MainGesturesAry = new Array; //↓↓↓↓
//一次中的手指动作。
var gesturesAry = new Array; //↓↓↓↓[[0,100,[x1,y1],[x2,y2],[x3,y3],[x4,y4],………],………]
//每个手指的动作。
var TouchPointRecord = new Array; //[[0,1000,[x1,y1],………],………]

var TouchPointStart = new Array; //[[x1,y1],[x2,y2],[x3,y3],[x4,y4],………]
var TouchPointCurrent = new Array; //[[x1,y1],[x2,y2],[x3,y3],[x4,y4],………]

var vrx = 0,
    vry = 0; //屏幕坐标差。

threads.start(function() {
    //console.show();
});


var Ts = 50; //动作精度。越小精度越高。//但实际上没卵用。自动操作函数gestures会自动缩减
var Tss = 400; //动作间隔
var kg = false;
var jishi = 0;
//new android.graphics.RectF

var SystemUiVisibility = (ve) => {
    var option =
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
        (ve ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
};
SystemUiVisibility(true);

setInterval(() => {
    if (kg) {
        jishi++;
        for (let i = 0; i < TouchPointRecord.length; i++) {
            let x = Math.floor(TouchPointCurrent[i][0] + vrx);
            let y = Math.floor(TouchPointCurrent[i][1] + vry);
            TouchPointRecord[i].push([x, y]);
            TouchPointRecord[i][1] += Ts;
        };
    };
}, Ts);

ui.but_q.click(function() {
    MainGesturesAry = new Array;
});

ui.but_s.click(function() {
    测试()
});


ui.but_b.click(function() {
    threads.start(function() {
        if (MainGesturesAry.length == 0) {
            toastLog("请先录制解锁动作")
            return
        }
        var p = dialogs.prompt("保存路径", storage.get("模块路径", files.path("/sdcard/脚本/自定义解锁模块.js")));

        if (p) {
            files.ensureDir(p)
            storage.put("模块路径", p)
            var js = "//自定义一个适用于大部分手机划开图层的手势操作\n" +
                "function 上滑() {\n" +
                "  toastLog('上滑，划开图层');\n" +
                "  let x = parseInt(device.width * 0.2);\n" +
                "  //手势操作\n" +
                "  gesture(320, [x, parseInt(device.height * 0.8)], [x, parseInt(device.height * 0.3)]);\n" +
                "  //sleep，延时，1200毫秒=1.2秒\n" +
                "  sleep(1200);\n" +
                "};\n" +

                "function implement() {\n" +

                "  上滑();\n" +
                "  toastLog('开始执行 动作');\n" +
                "  //执行自定义的函数\n" +
                "  var gesturesAry=" + JSON.stringify(MainGesturesAry) + ";\nfor(let i=0;i<gesturesAry.length;i++){\ngestures.apply(null, gesturesAry[i]);\nsleep(400);\n};\n" +
                "  console.info(gesturesAry);\n" +

                "};\n" +

                "function preface(script_file_path) {\n" +
                "  let modular_data = {\n" +
                "id: '屏幕解锁',\n" +
                "  };\n" +
                //返回模块信息给明日计划
                "  return modular_data;\n" +
                "};\n" +

                "exports.preface = preface;\n" +
                "exports.implement = implement;\n"
            files.write(p, js);
            var sto_ = storages.create("time");
            var password = sto_.put("password", p);
            toastLog("已生成模块文件并导入")
        };
    });


});

ui.openImage.click(function() {
    threads.start(function() {
        switch (dialogs.singleChoice("选择方式", ["媒体库", "本机文件"])) {
            case 0:
                媒体库选择(function(path) {
                    var img = MainImg;
                    MainImg = 加载图片(path);
                    if (MainImg) {
                        imageRect.set(new android.graphics.RectF(0, 0, MainImg.getWidth(), MainImg.getHeight()));
                        canvasMatrix.setRectToRect(imageRect, canvasRect, android.graphics.Matrix.ScaleToFit.CENTER);
                    };
                    if (img) {
                        img.recycle();
                    };
                });
                break;
            case 1:
                选择图片(function(path) {
                    var img = MainImg;
                    MainImg = 加载图片(path);
                    if (MainImg) {
                        imageRect.set(new android.graphics.RectF(0, 0, MainImg.getWidth(), MainImg.getHeight()));
                        canvasMatrix.setRectToRect(imageRect, canvasRect, android.graphics.Matrix.ScaleToFit.CENTER);
                    };
                    if (img) {
                        img.recycle();
                    };
                });

                break;
        };
    });
});
ui.emitter.on("activity_result", (requestCode, resultCode, data) => {

    if (resultCode != Activity.RESULT_OK) {

        return;
    }

    var uri = data.getData();
    //  var uri = Uri.parse("file:///sdcard/1.png");
    if (uri == null) {
        return
    }
    let uriArr = URIUtils_uriToFile(uri)

    function URIUtils_uriToFile(uri) { //Source : https://www.cnblogs.com/panhouye/archive/2017/04/23/6751710.html
        var r = null,
            cursor, column_index, selection = null,
            selectionArgs = null,
            isKitKat = android.os.Build.VERSION.SDK_INT >= 19,
            docs;
        if (uri.getScheme().equalsIgnoreCase("content")) {
            if (isKitKat && android.provider.DocumentsContract.isDocumentUri(activity, uri)) {
                if (String(uri.getAuthority()) == "com.android.externalstorage.documents") {
                    docs = String(android.provider.DocumentsContract.getDocumentId(uri)).split(":");
                    if (docs[0] == "primary") {
                        return android.os.Environment.getExternalStorageDirectory() + "/" + docs[1];
                    }
                } else if (String(uri.getAuthority()) == "com.android.providers.downloads.documents") {
                    uri = android.content.ContentUris.withAppendedId(
                        android.net.Uri.parse("content://downloads/public_downloads"),
                        parseInt(android.provider.DocumentsContract.getDocumentId(uri))
                    );
                } else if (String(uri.getAuthority()) == "com.android.providers.media.documents") {
                    docs = String(android.provider.DocumentsContract.getDocumentId(uri)).split(":");
                    if (docs[0] == "image") {
                        uri = android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                    }
                    selection = "_id=?";
                    selectionArgs = [docs[1]];
                }
            }
            try {
                cursor = activity.getContentResolver().query(uri, ["_data"], selection, selectionArgs, null);
                if (cursor && cursor.moveToFirst()) {
                    r = String(cursor.getString(cursor.getColumnIndexOrThrow("_data")));
                }
            } catch (e) {
                log(e)
            }
            if (cursor) cursor.close();
            console.info(r)
            return r;
        } else if (uri.getScheme().equalsIgnoreCase("file")) {
            console.info(uri.getPath())
            return String(uri.getPath());
        }
        return null;
    }

    MainImg = images.read(uriArr)
});




ui.canvas.on("draw", (canvas) => {
    canvas.drawARGB(255, 127, 127, 127);
    var w = canvas.getWidth();
    var h = canvas.getHeight();
    var AX = w / 2;
    var AY = h / 2;
    if (MainImg) {
        let scale = ASX.getScaling();
        let strokeWidth = 5 / scale;
        let TextSize = 75 / scale;
        let radius = 50 / scale;
        paint.setStrokeWidth(strokeWidth); //画笔边缘宽度
        paint1.setStrokeWidth(strokeWidth); //画笔边缘宽度
        paint.setTextSize(TextSize);
        paint1.setTextSize(TextSize);
        //canvas.drawImage(MainImg, 0, 0, paint1);
        //canvas.setMatrix(canvasMatrix);
        canvas.setMatrix(ASX.matrix);
        // let matrix = canvas.getMatrix();
        //绘制背景色
        // matrix.postConcat(ASX.matrix);
        //canvas.setMatrix(matrix);

        canvas.drawImage(MainImg, 0, 0, paint);

    } else {
        canvas.drawText("请先手动在锁屏待解锁界面，截图.(可选)", textSize, h / 2.2, paint1);
        canvas.drawText("再在本脚本打开锁屏界面图片(或类似图片)", textSize, h / 2, paint1);
        canvas.drawText("在此界面模拟解锁动作，录制解锁动作", textSize, h / 1.8, paint1);
        canvas.drawText("启动测试，确认可以自动解锁屏幕", textSize, h / 1.65, paint1);
        canvas.drawText("右下角保存并导入模块，即可", textSize, h / 1.5, paint1);

    };


    paint.setStyle(Paint.Style.STROKE);
    canvas.drawText(String(MainGesturesAry.length + "个动作"), textSize, textSize * 4, paint)

    if (TouchPointStart.length) {

        for (let i = 0; i < TouchPointStart.length; i++) {
            try {
                let X = TouchPointStart[i][0];
                let Y = TouchPointStart[i][1];
                let x = TouchPointCurrent[i][0];
                let y = TouchPointCurrent[i][1];
                X = X || 0;
                Y = Y || 0;
                x = x || 0;
                y = y || 0;
                let a = X - (x - X);
                let b = Y - (y - Y);
                //let rect = new android.graphics.RectF(X, Y, x, y);
                //canvas.drawRect(rect, paint);
                //let rect2 = new android.graphics.RectF(X, Y, a, b);
                //canvas.drawRect(rect2, paint);
                //let rect3 = new android.graphics.RectF(x, y, a, b);
                //canvas.drawRect(rect3, paint);
                //canvas.drawLine(X, Y, x, y, paint);
                //canvas.drawLine(X, Y, a, b, paint);
                canvas.drawText(String("A"), X, Y, paint)
                canvas.drawText(String("B"), x, y, paint);
                canvas.drawCircle(X, Y, 10, paint);
                canvas.drawCircle(x, y, 10, paint);
                //canvas.drawCircle(a, b, 10, paint);
            } catch (e) {};
        };
        for (let ii = 0; ii < TouchPointRecord.length; ii++) {
            let ge = TouchPointRecord[ii];
            canvas.drawText(String("▽"), ge[0] / 10 * ii + jishi * Ts / 25, textSize * (ii + 2), paint)
            for (let i = 2; i < ge.length - 1; i++) {

                let X = ge[i][0] - vrx;
                let Y = ge[i][1] - vry;
                let x = ge[i + 1][0] - vrx;
                let y = ge[i + 1][1] - vry;
                X = X || 0;
                Y = Y || 0;
                x = x || 0;
                y = y || 0;
                //let a = X - (x - X);
                //let b = Y - (y - Y);
                //let rect = new android.graphics.RectF(X, Y, x, y);
                //canvas.drawRect(rect, paint);
                //let rect2 = new android.graphics.RectF(X, Y, a, b);
                //canvas.drawRect(rect2, paint);
                //let rect3 = new android.graphics.RectF(x, y, a, b);
                //canvas.drawRect(rect3, paint);
                canvas.drawLine(X, Y, x, y, paint);
                //canvas.drawLine(X, Y, a, b, paint);
                //canvas.drawText(String("A"), X, Y, paint)
                //canvas.drawText(String("B"), x, y, paint);
                //canvas.drawCircle(X, Y, 10, paint);
                //canvas.drawCircle(x, y, 10, paint);
                //canvas.drawCircle(a, b, 10, paint);
            };
        };
    };

});



ui.canvas.setOnTouchListener(new android.view.View.OnTouchListener((view, event) => {
    try {
        var W = view.getWidth();
        var H = view.getHeight();
        var PC = event.getPointerCount();
        switch (event.getActionMasked()) {
            case event.ACTION_MOVE:
                for (let i = 0; i < PC; i++) {
                    let id = event.getPointerId(i);
                    let X = event.getX(i);
                    let Y = event.getY(i);
                    TouchPointCurrent[i][0] = X;
                    TouchPointCurrent[i][1] = Y;
                };


                break;
            case event.ACTION_CANCEL:
                //log("CANCEL");
                kg = false;
                TouchPointStart = new Array;
                TouchPointCurrent = new Array;

                break;
            case event.ACTION_OUTSIDE:
                //log("OUTSIDE");

                break;
            default:
                var I = Math.floor(event.getAction() / 256);
                var ID = event.getPointerId(I);
                var X = event.getX(I);
                var Y = event.getY(I);
                var RX = event.getRawX();
                var RY = event.getRawY();
                switch (event.getActionMasked()) {
                    case event.ACTION_DOWN:
                        //第一个手指按下。
                        //log("down");
                        vrx = RX - X, vry = RY - Y;
                        kg = true;
                        TouchPointRecord.splice(I, 0, [0, 1, [Math.floor(X + vrx), Math.floor(Y + vry)]]);
                        TouchPointStart.splice(I, 0, [X, Y]);
                        TouchPointCurrent.splice(I, 0, [X, Y]);

                        break;
                    case event.ACTION_UP:
                        //最后一个手指抬起。
                        //log("up");
                        kg = false;
                        jishi = 0;


                        gesturesAry.push(TouchPointRecord[I]);
                        MainGesturesAry.push(gesturesAry);
                        gesturesAry = new Array;


                        TouchPointStart = new Array;
                        TouchPointCurrent = new Array;
                        TouchPointRecord = new Array;

                        break;
                    case event.ACTION_POINTER_DOWN:
                        //log("POINTER_DOWN");
                        TouchPointRecord.splice(I, 0, [jishi * Ts, 1, [Math.floor(X + vrx), Math.floor(Y + vry)]]);
                        TouchPointStart.splice(I, 0, [X, Y]);
                        TouchPointCurrent.splice(I, 0, [X, Y]);


                        break;
                    case event.ACTION_POINTER_UP:
                        //log("POINTER_UP");
                        gesturesAry.push(TouchPointRecord[I]);

                        TouchPointStart.splice(I, 1);
                        TouchPointCurrent.splice(I, 1);
                        TouchPointRecord.splice(I, 1);

                        break;
                };
        };
    } catch (e) {
        log("0: " + e);
    };

    return true;
}));


反色 = function(color) {
    return (-1 - colors.argb(0, colors.red(color), colors.green(color), colors.blue(color)));
};

toJavaArray = function(type, ary) {
    //var Ary = java.lang.reflect.Array.newInstance(		java.lang.Float.TYPE, 4);
    var Ary = util.java.array(type, ary.length);
    for (let i in ary) {
        Ary[i] = ary[i];
    };
    return Ary;
};

SolvePos = function(a, b, r, k, c) {
    let a1 = k * k + 1;
    let b1 = 2 * k * (c - b) - 2 * a;
    let c1 = a * a + (c - b) * (c - b) - r * r;
    let delta = b1 * b1 - 4 * a1 * c1;
    let result = [];
    if (delta == 0) {
        let x0 = Math.sqrt(delta);
        let x1 = -b1 / (2 * a1);
        let y1 = k * x1 + c;
        result.push(x1, y1);
    } else if (delta > 0) {
        let x0 = Math.sqrt(delta);
        let x1 = (-b1 - x0) / (2 * a1);
        let y1 = k * x1 + c;
        result.push(x1, y1);
        let x2 = (-b1 + x0) / (2 * a1);
        let y2 = k * x2 + c;
        result.push(x2, y2);
    }
    return result;
};

weiyi = function(ary) {
    var sum = 0;
    for (var i = 0; i < ary.length; i++) {
        sum += Math.pow(ary[i], 2);
    };
    return Math.sqrt(sum);
};

kdfx = function(Y) {
    var x = Math.cos(Y % 360 / 360 * 2 * Math.PI);
    var y = Math.sin(Y % 360 / 360 * 2 * Math.PI);
    return {
        x: x,
        y: y
    };
};

ydfx = function(obj) {
    var ary = getsd(1, [obj.x, obj.y]);
    var x = ary[0],
        y = ary[1];
    var Y = Math.asin(y) / (2 * Math.PI) * 360;
    if (x < 0) {
        Y = 180 - Y;
    };
    return Y;
};

getsd = function(s, ary) {
    var sum = weiyi(ary);
    var S = s / sum;
    for (var i = 0; i < ary.length; i++) {
        ary[i] = ary[i] * S;
    };
    return ary;
};

XYTOAB = function(x, y, x1, y1) {
    var A = (y1 - y) / (x1 - x);
    var B = y - A * x;
    return [A, B];
};


var imagesPath = new Array;

thread = threads.start(function() {
    sleep(1000);
    getPhotosInfo(25, imagesPath);
});



//paint.setTextSize(75);
//android.view.MotionEvent

var imageRect = new android.graphics.RectF;
var canvasRect = new android.graphics.RectF;
var canvasMatrix = new android.graphics.Matrix;

var ASX = new XYToMatrix(canvasMatrix);

function XYToMatrix(matrix, maxPoints) {
    //通过多点触控来设置matrix从而来缩放图像。
    //第2个参数。最大的手指数量。手指数量超过之后matrix将初始化。
    this.originalMatrix = matrix || new android.graphics.Matrix;
    this.matrix = new android.graphics.Matrix(this.originalMatrix);
    this.invertMatrix = new android.graphics.Matrix;
    this.matrix.invert(this.invertMatrix);
    this.getScaling = function(ary) {
        //获取缩放比例。
        ary = Array.isArray(ary) ? ary : [0, 0, 100, 100];
        try {
            var Ary = this.matrixPoints(this.matrix, ary);
            return this.weiyi([Ary[2] - Ary[0], Ary[3] - Ary[1]]) / this.weiyi(ary);
        } catch (e) {
            toastLog(e);
        };
    };
    this.maxPoints = maxPoints || 2;
    this.maxPointsListener = function() {
        this.matrix = new android.graphics.Matrix(this.originalMatrix);
        //this.invertMatrix = new android.graphics.Matrix;
        this.matrix.invert(this.invertMatrix);

    };
    this.Touch = {
        Matrix: this.matrix,
        PointStart: new Array,
        PointCurrent: new Array,

    };
    //new android.view.View.OnTouchListener();
    this.touchListener = (view, event) => {
        try {
            let W = view.getWidth();
            let H = view.getHeight();
            let PC = event.getPointerCount();
            switch (event.getActionMasked()) {
                case event.ACTION_MOVE:
                    try {
                        for (let i = 0; i < PC; i++) {
                            let id = event.getPointerId(i);
                            let x = event.getX(i);
                            let y = event.getY(i);
                            this.Touch.PointCurrent[i * 2] = x;
                            this.Touch.PointCurrent[i * 2 + 1] = y;
                        };

                        //记录当前各手指坐标信息。
                        if (PC > this.maxPoints) { //手指数大于4个虽然记录坐标信息，但是不进行矩阵操作。
                            this.maxPointsListener(view, event);
                            break;
                        };

                        let Matrix = new android.graphics.Matrix();
                        Matrix.setPolyToPoly(this.Touch.PointStart, 0, this.Touch.PointCurrent, 0, PC > 4 ? 4 : PC);
                        this.matrix = new android.graphics.Matrix();
                        this.matrix.setConcat(Matrix, this.Touch.Matrix);
                        //进行矩阵运算并刷新矩阵。
                        this.matrix.invert(this.invertMatrix);
                        //反矩阵
                    } catch (e) {
                        throw "MOVE " + e;
                    };


                    break;
                case event.ACTION_CANCEL:
                    log("CANCEL");
                    toast("触摸被系统拦截\n可能是三指截屏等功能");
                    this.Touch.PointStart = new Array;
                    this.Touch.PointCurrent = new Array;

                    break;
                case event.ACTION_OUTSIDE:
                    log("OUTSIDE");

                    break;
                default:
                    let I = event.getActionIndex();
                    let ID = event.getPointerId(I);
                    let X = event.getX(I);
                    let Y = event.getY(I);
                    switch (event.getActionMasked()) {
                        case event.ACTION_DOWN:
                            try {
                                log("down");
                                //当有新的手指按下时使坐标差为零。//开始新的多指矩阵运算方式
                                this.Touch.PointStart.splice(I * 2, 0, X, Y);
                                this.Touch.PointCurrent.splice(I * 2, 0, X, Y);
                                this.Touch.Matrix = this.matrix;
                                //log(this.Touch.Matrix);
                            } catch (e) {
                                throw "DOWN " + e;
                            };
                            break;
                        case event.ACTION_UP:
                            //最后一个手指抬起。
                            log("up");
                            this.Touch.PointStart = new Array;
                            this.Touch.PointCurrent = new Array;

                            break;
                        case event.ACTION_POINTER_DOWN:
                            log("POINTER_DOWN");
                            try {
                                //当有新的手指按下时使坐标差为零。//开始新的多指矩阵运算方式
                                this.Touch.PointStart.splice(I * 2, 0, X, Y);
                                this.Touch.PointCurrent.splice(I * 2, 0, X, Y);
                                //获取点的总数量。
                                this.Touch.Matrix = this.matrix;
                                for (let i = 0; i < PC; i++) {
                                    this.Touch.PointStart[i * 2] = this.Touch.PointCurrent[i * 2];
                                    this.Touch.PointStart[i * 2 + 1] = this.Touch.PointCurrent[i * 2 + 1];
                                };
                                //保存坐标的数组。
                                if (PC > this.maxPoints) { //手指数大于4个化为原始矩阵虽然记录坐标信息，但是不进行矩阵操作。
                                    this.maxPointsListener(view, event);
                                    break;
                                };

                                let Matrix = new android.graphics.Matrix();
                                Matrix.setPolyToPoly(this.Touch.PointStart, 0, this.Touch.PointCurrent, 0, PC > 4 ? 4 : PC);
                                this.matrix = new android.graphics.Matrix();
                                this.matrix.setConcat(Matrix, this.Touch.Matrix);
                                //进行矩阵运算并刷新矩阵。
                                this.matrix.invert(this.invertMatrix);
                                //反矩阵
                            } catch (e) {
                                throw "P_DOWN " + e;
                            };

                            break;
                        case event.ACTION_POINTER_UP:
                            log("POINTER_UP");
                            try {
                                this.Touch.Matrix = this.matrix;
                                for (let i = 0; i < PC; i++) {
                                    this.Touch.PointStart[i * 2] = this.Touch.PointCurrent[i * 2];
                                    this.Touch.PointStart[i * 2 + 1] = this.Touch.PointCurrent[i * 2 + 1];
                                };
                                this.Touch.PointStart.splice(I * 2, 2);
                                this.Touch.PointCurrent.splice(I * 2, 2);

                            } catch (e) {
                                throw "P_UP " + e;
                            };
                            break;
                    };
            };
        } catch (e) {
            throw "imgTouch: " + e;
        };

        return true;

    };

    this.matrixPoints = function(matrix, ary) {
        //通过矩阵运算坐标数组。但是需要转换为浮点数组。
        var ary = this.toJavaArray("float", ary);
        matrix.mapPoints(ary);
        return this.toJsArray(ary);
    };
    this.toJavaArray = function(type, ary) {
        //var Ary = java.lang.reflect.Array.newInstance(		java.lang.Float.TYPE, 4);
        var Ary = util.java.array(type, ary.length);
        for (let i in ary) {
            Ary[i] = ary[i];
        };
        return Ary;
    };
    this.toJsArray = function(ary) {
        var Ary = new Array(ary.length);
        for (let i in ary) {
            Ary[i] = ary[i];
        };
        return Ary;
    };
    this.getsd = (s, ary) => {
        var sum = this.weiyi(ary);
        var S = (s / sum) || 0;
        for (var i = 0; i < ary.length; i++) {
            ary[i] = ary[i] * S;
        };
        return ary;
    };
    this.weiyi = function(ary) {
        var sum = 0;
        for (var i = 0; i < ary.length; i++) {
            sum += Math.pow(ary[i], 2);
        };
        return Math.sqrt(sum);
    };
    this.kdfx = function(Y) {
        var x = Math.cos(Y % 360 / 360 * 2 * Math.PI);
        var y = Math.sin(Y % 360 / 360 * 2 * Math.PI);
        return [x, y];
    };
    this.ydfx = (ary) => {
        var ary = this.getsd(1, ary);
        var x = ary[0],
            y = ary[1];
        var Y = Math.asin(y) / (2 * Math.PI) * 360;
        if (x < 0) {
            Y = 180 - Y;
        };
        return Y;
    };


};


function 加载图片(A) {
    if (files.isFile(A)) {
        imagePath = A;
        return images.read(A);
    };
    return null;
    var dir = "/storage/emulated/0/DCIM";
    var jsFiles = files.listDir(dir, function(name) {
        return (name.endsWith(".jpg") || name.endsWith(".png")) && files.isFile(files.join(dir, name));
    });
    if (jsFiles.length) {
        return images.read(files.join(dir, jsFiles[jsFiles.length - 1]));
    } else {
        toastLog("没有图片可以查看");
        toastLog("请自己修改路径");
        toastLog("后使用");
        exit();
    };
};


function 选择图片(fun) {
   let intent = new Intent(Intent.ACTION_PICK, null);
    intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
    activity.startActivityForResult(intent, 2);

};


function 媒体库选择(fun) {
    ui.run(function() {
        var ctx = activity;
        var window = new android.widget.PopupWindow();
        var view = XmlToView(
            <vertical padding="5">
                        <text text="选择图片" textSize="25sp" gravity="center"/>
                        <list id="list" w="*">
                            <vertical w="*" margin="5" bg={colors.toString(colors.GRAY)} gravity="center">
                                <img w="auto" h="auto" margin="6" src="file://{{filePath}}"/>
                                <text w="*" h="25" margin="2" text="{{title}}" textSize="20sp" line="1"  gravity="center"/>
                            </vertical>
                        </list>
                    </vertical>
        );
        view.list.setDataSource(imagesPath);

        view.list.on("item_click", function(item) {
            fun(item.filePath);
            window.dismiss();
        });
        //log(view);
        window.setContentView(view);
        window.setWidth(device.width * 0.8);
        window.setHeight(device.height * 0.8);
        window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.LTGRAY));
        window.setFocusable(true);
        window.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, -1, -1);
    });
};




function XmlToView(xml) {
    runtime.ui.layoutInflater.setContext(context);
    return runtime.ui.layoutInflater.inflate(xml.toXMLString().toString(), null, true);
};



//获取设备上所有的照片信息
function getPhotosInfo(maxAmount, ary) {
    MediaStore = android.provider.MediaStore;
    var Ary = ary || new Array;
    let contentResolver = context.getContentResolver();
    let photoColumns = [
        MediaStore.Images.Media._ID,
        MediaStore.Images.Media.DATA,
        MediaStore.Images.Media.TITLE,
        MediaStore.Images.Media.MIME_TYPE,
        MediaStore.Images.Media.SIZE,
        MediaStore.Images.Media.ORIENTATION
    ];
    let cursor = contentResolver.query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, photoColumns, null, null, null);
    maxAmount = maxAmount ? (maxAmount < cursor.getCount() ? maxAmount : cursor.getCount()) : cursor.getCount();
    cursor.moveToLast();
    while (Ary.length < maxAmount) {
        var ob = {};
        //ob._id = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID));
        ob.filePath = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA));
        ob.title = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Images.Media.TITLE));
        //ob.mime_type = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Images.Media.MIME_TYPE));
        ob.size = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Images.Media.SIZE));
        if (files.exists(ob.filePath)) {
            Ary.push(ob);
            //sleep(100);
        };
        cursor.moveToPrevious();

    }
    return Ary;
};

function 测试() {
    if (MainGesturesAry.length == 0) {
        toastLog("请先录制解锁动作")
        return
    }
    toastLog("开始测试")
    let thread = threads.start(function() {
        let unlocker = require('./lib/Unlock.js').unlocker

        while (!unlocker.is_locked()) {
            let lock = threads.lock()
            let complete = lock.newCondition()
            let awaitDialog = dialogs.build({
                    cancelable: false,
                    negative: '取消',
                    positive: '确定',
                    title: '请手动锁屏',
                    content: '请手动锁定屏幕，脚本将在点击确定5秒后开始执行测试'
                })
                .on('negative', () => {
                    lock.lock()
                    complete.signal()
                    lock.unlock()
                    
                    awaitDialog.dismiss()
                    if (thread.isAlive()) {
                        thread.interrupt()
                    }
                })
                .on('positive', () => {
                    lock.lock()
                    complete.signal()
                    lock.unlock()
                    
                    awaitDialog.setActionButton("positive", null);
                    awaitDialog.setCancelable(false);
                    awaitDialog.show()
                }).show()
            lock.lock()
            complete.await()
            lock.unlock()
            let limit = 5
            while (limit >= 0) {
                awaitDialog.setContent('倒计时' + limit-- + '秒')
                sleep(1000)
                if (limit == 0) {
                    awaitDialog.dismiss()
                }
            }
        }

        toastLog("尝试唤醒屏幕");
        unlocker.wakeup()
        sleep(1000)
        if (!device.isScreenOn()) {
            unlocker.wakeup()
            device.wakeUpIfNeeded();
        }
        toastLog("上滑，划开图层");
        //自定义一个适用于大部分手机划开图层的手势操作

        let x = parseInt(device.width * 0.2);
        //手势操作
        gesture(320, [x, parseInt(device.height * 0.8)], [x, parseInt(device.height * 0.3)]);
        //sleep，延时，1200毫秒=1.2秒
        sleep(1200);
        toastLog("开始执行 动作");

        //执行自定义的函数
        let gestures_ = JSON.parse(JSON.stringify(MainGesturesAry));
        console.info(gestures_.toString())
        for (let i = 0; i < gestures_.length; i++) {
            gestures.apply(null, gestures_[i]);
            sleep(400);
        }
        sleep(1500)
        toastLog("测试结束")

    })
}