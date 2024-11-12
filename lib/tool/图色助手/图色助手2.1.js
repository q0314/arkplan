"ui";
/*
作者QQ:936910749

开发配置:
android版本:10
分辨率:1080*2240
autojsPro版本:8.3.16

还有几处BUG没有处理好,截图阻塞也不知道怎么处理
悬浮窗启动时不够平滑，动态添加布局是不是会好点？？？
大佬如果处理好了的话希望能够分享一下，谢谢

另外希望大佬有时间可以帮忙画一套图标，感激不尽
*/
importClass(android.animation.ObjectAnimator);
importClass(android.provider.MediaStore);
var storage = storages.create("图色助手Pro");
var imagePath = storage.get("imagePath");
var path = storage.get("储存路径", "/sdcard/脚本/图色/");

var imagesPath = new Array;


//启动一个线程用于处理可能阻塞UI线程的操作
var blockHandle = threads.start(function() {
    //启动一个计时器保证线程不会终止运行
    setInterval(() => {}, 1000);
});
$dialogs.setDefaultDialogType("foreground-or-overlay");


/*
if (storage.get("储存路径") == "undefined") {
    rawInput("请输入图片存储路径", "/脚本/图片/", inp => {
        if (inp == null) {
            inp = "/脚本/图片/";
        }
        if (inp[0] != "/") {
            inp = "/" + inp;
        }
        if (!inp.startsWith("/sdcard") && !inp.startsWith("/storage/emulated/0")) {
            inp = "/sdcard" + inp
        }

        files.ensureDir(inp);
        storage.put("路径", inp)

    })
}
*/
//设置悬浮窗初始属性
var layoutAttribute = {
    //设置悬浮窗左上角小圆点的尺寸
    uiOperate: {
        w: zoom(0),
        h: zoom(80)
    },
    //设置悬浮窗的尺寸和启动时的初始位置
    whole: {
        w: Math.floor(device.width * 0.95),
        h: Math.floor(device.width * 0.9),
        iniX: 0,
        iniY: 100
    },
    //设置标题栏的名称及高度
    title: {
        name: "图色助手Pro Max",
        h: zoom(100)
    },
    //用于程序运行时判断布局是否显示
    homepage: {
        show: true
    },
    //同上
    rightList: {
        show: false
    },
    //设置布局的配色
    setColor: {
        bg: "#000000",
        theme: "#ffe785"
    }
};

//设置侧边栏功能键图标
var optionList = [
    "@drawable/ic_dns_black_48dp",
    "@drawable/ic_colorize_black_48dp",
    "@drawable/ic_check_circle_black_48dp",
    "@drawable/ic_my_location_black_48dp",
    "@drawable/ic_create_new_folder_black_48dp",
    "@drawable/ic_layers_black_48dp",
    "@drawable/ic_memory_black_48dp",
];

//设置顶部功能键图标
var 功能图标 = [

    "@drawable/ic_assignment_black_48dp",
    "@drawable/ic_exposure_black_48dp",
    "@drawable/ic_wallpaper_black_48dp",
    "@drawable/ic_donut_large_black_48dp",
    "@drawable/ic_remove_circle_outline_black_48dp",
    "@drawable/ic_queue_black_48dp",


    "@drawable/ic_settings_applications_black_48dp",
];
//保存绘图属性
var pictureAttribute = {
    //canvas绘制图片的设置
    image: {
        //设置imgList中被选中的图片，将其绘制在canvas中
        select: 0,
        //绘制图片时图片左上角位于canvas中的坐标
        topX: 0,
        topY: 0,
        //图片中心点偏离canvas中心点的距离
        deviationX: 0,
        deviationY: 0,
        //绘制图片时缩放的比例
        ratio: 0.4
    },
    //判断指针操作时的最大半径
    pointer: {
        operateRadius: zoom(40)
    },
    //展示点色数据的方框
    showFrame: {
        region: []
    },
    //设置点色展示框及展示内容在canvas中的显示区域
    colorShow: {
        showFrame: [zoom(5), zoom(5), zoom(390), zoom(55)],
        x: [zoom(20), zoom(40)],
        y: [zoom(140), zoom(40)],
        color: [zoom(260), zoom(40)],
    },
    //设置选图区域展示框及展示内容在canvas中的显示区域
    regionShow: {
        showFrame: [zoom(5), zoom(5), zoom(520), zoom(55)],
        x1: [zoom(20), zoom(40)],
        y1: [zoom(140), zoom(40)],
        x2: [zoom(260), zoom(40)],
        y2: [zoom(400), zoom(40)]
    },
    //设置绘制提示时的提示框及内容在canvas中的显示区域

    systemPrompt: {
        showFrame: [zoom(600), zoom(5), zoom(1050), zoom(55)],
        prompt: [zoom(630), zoom(40)]
    },
};

//保存多张图片使用时随时切换
var imgList = [{
    sn: 0,
    select: true,
    img: null
}, ];
//存储从大图片裁剪出来的小图
var smallImg = null;
//保存提取出来的点色
var colorList = [];
//保存指针焦点坐标实时输出的点色数据
var nowColor = {};
//更准确的屏幕属性
var screenAttribute = {
    w: device.width,
    h: device.height,
    titleH: 0,
    direction: "竖屏"
};
//设置系统提示的内容，这个提示将绘制在canvas中
var prompt = {
    message: null,
    time: null
};
//用于判断运行状态是取色还是截图
var pattern = "getColor";

//将可能存在阻塞的操作丢给阻塞处理线程处理
blockHandle.waitFor();
blockHandle.setTimeout(() => {

    //  旋转监听();
}, 0);
blockHandle.setTimeout(() => {
    getPhotosInfo(25, imagesPath);
}, 1000);

ui.layout(
    <vertical>
        <vertical id="homepage" w="*" h="*" bg="{{layoutAttribute.setColor.bg}}">
            {/**顶部 */}
            <frame id="title" w="{{layoutAttribute.whole.w - layoutAttribute.uiOperate.w}}px" h="{{layoutAttribute.title.h}}px" layout_gravity="right">
                <text id="name" text="加载中..." textColor="{{layoutAttribute.setColor.theme}}" textSize="{{zoom(45)}}px" gravity="center_vertical" />
                <grid id="图色功能" w="auto" h="*" spanCount="7" layout_gravity="right">
                    <img w="{{zoom(100)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" gravity="right" />
                </grid>
            </frame>
            
            <frame w="*" h="*">
                <canvas id="canvas" w="*" h="*" marginTop="0px" marginBottom="{{zoom(5)}}px" marginLeft="{{zoom(5)}}px" marginRight="{{zoom(5)}}px" />
                
                {/**底部滑条 */}
                <horizontal w="*" h="{{zoom(100)}}px" bg="#60000000" layout_gravity="bottom" marginTop="0px" marginBottom="{{zoom(30)}}px" marginLeft="{{zoom(100)}}px" marginRight="{{zoom(100)}}px">
                    <text id="ratio" w="{{zoom(100)}}px" h="*" textSize="{{zoom(28)}}px" text="0.40X" textColor="{{layoutAttribute.setColor.theme}}" gravity="center_vertical" marginLeft="{{zoom(5)}}px" />
                    <seekbar id="zoom" progress="0" max="500" w="*" h="*" />
                </horizontal>
                
                <frame w="{{zoom(60)}}px" h="{{device.width * 0.6}}px" bg="#60000000" marginLeft="{{zoom(5)}}px" layout_gravity="center_vertical">
                    <list id="imgList" w="*" h="auto">
                        <text id="sn" w="*" h="{{zoom(60)}}px" textSize="{{zoom(40)}}px" textColor="{{layoutAttribute.setColor.theme}}" bg="{{select ? layoutAttribute.setColor.bg : img ? '#88000000' : '#30000000'}}" text="{{img ? sn + 1 : '+'}}" gravity="center" marginBottom="3px" />
                    </list>
                </frame>
                {/**
                * 右侧
                */}
                <frame w="auto" h="{{device.width * 0.6}}px" marginRight="{{zoom(5)}}px" layout_gravity="center_vertical|right">
                    <horizontal>
                        <vertical w="{{zoom(60)}}px" h="*" bg="#60000000">
                            <list id="optionList" w="*" h="*">
                                <img id="option" w="*" h="{{zoom(92)}}px" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                            </list>
                        </vertical>
                        <frame id="rightList" w="{{zoom(420)}}px" h="*">
                            <vertical id="colorRecord" w="*" h="*">
                                <frame w="*" h="{{zoom(60)}}px" bg="#60000000">
                                    <text w="*" h="*" text="颜色记录" textSize="{{zoom(28)}}px" textColor="#ffe785" margin="{{zoom(10)}}px 0" gravity="left|center_vertical" />
                                    <text id="清空" w="{{zoom(100)}}px" h="*" bg="{{layoutAttribute.setColor.theme}}" text="清空" textSize="{{zoom(28)}}px" textColor="#ff0000" margin="{{zoom(5)}}px" layout_gravity="right|center_vertical" gravity="center" />
                                </frame>
                                <frame w="*" h="*" bg="#30000000">
                                    <list id="colorList" h="auto">
                                        <vertical w="*">
                                            <horizontal w="*" h="{{zoom(50)}}px" bg="?selectableItemBackground">
                                                <img id="delColor" w="{{zoom(50)}}px" h="*" bg="#88000000" tint="#ffe785" src="@drawable/ic_clear_black_48dp" margin="{{zoom(3)}}px" gravity="center" />
                                                <horizontal id="点色" w="*" h="*">
                                                    <text w="{{zoom(90)}}px" h="*" text="{{x}}" textColor="#ffe785" textSize="{{zoom(28)}}px" gravity="center" />
                                                    <text w="{{zoom(90)}}px" h="*" text="{{y}}" textColor="#ffe785" textSize="{{zoom(28)}}px" gravity="center" />
                                                    <text w="{{zoom(150)}}px" h="*" text="{{color}}" textColor="#ffe785" textSize="{{zoom(28)}}px" gravity="center" />
                                                    <frame w="*" h="*" bg="{{color}}" margin="{{zoom(3)}}px" />
                                                </horizontal>
                                            </horizontal>
                                            <frame w="*" h="{{zoom(3)}}px" bg="#88000000" />
                                        </vertical>
                                    </list>
                                </frame>
                            </vertical>
                            <vertical id="smallImg" w="*" h="*">
                                <text w="*" h="{{zoom(60)}}px" text="图片记录" bg="#60000000" textSize="{{zoom(28)}}px" textColor="#ffe785" padding="{{zoom(10)}}px 0" gravity="left|center_vertical" />
                                <img id="smImg" w="*" h="*" bg="#30000000" />
                            </vertical>
                        </frame>
                    </horizontal>
                </frame>
            </frame>
        </vertical>
        
    </vertical>
);
if (device.brand != "HUAWEI" && device.brand != "HONOR" && device.brand != "NZONE") {
    旋转动画(ui.uiOperate, 720, 'z', 2000);
} else {
    log("HUAWEI && HONOR && NZONE");
}
var paint1 = new Paint; //绘制指针
paint1.setTextAlign(Paint.Align.CENTER);
paint1.setStrokeWidth(3); //设置笔尖宽度为3像素
paint1.setStyle(Paint.Style.STROKE); //设置画笔为描边
paint1.setARGB(255, 255, 230, 130);

var paint2 = new Paint; //绘制文字
paint2.setTextSize(zoom(28)); //设置文字大小为28像素
paint2.setARGB(255, 255, 255, 255);

var paint3 = new Paint; //填充画笔，填充背景
paint3.setARGB(255, 0, 0, 0);

var paint4 = new Paint; //绘制文字
paint4.setTextSize(zoom(50)); //设置文字大小为28像素
paint4.setARGB(255, 255, 255, 255);

ui.canvas.on("draw", function(canvas) {
    try {

        canvas.drawARGB(255, 127, 127, 127)
        if (!imgList[pictureAttribute.image.select].img) {
            if (prompt.message) {
                canvas.drawRect(pictureAttribute.systemPrompt.showFrame[0], pictureAttribute.systemPrompt.showFrame[1], pictureAttribute.systemPrompt.showFrame[2], pictureAttribute.systemPrompt.showFrame[3], paint3);
                canvas.drawRect(pictureAttribute.systemPrompt.showFrame[0], pictureAttribute.systemPrompt.showFrame[1], pictureAttribute.systemPrompt.showFrame[2], pictureAttribute.systemPrompt.showFrame[3], paint1);
                canvas.drawText(prompt.message, pictureAttribute.systemPrompt.prompt[0], pictureAttribute.systemPrompt.prompt[1], paint2);
            }
            canvas.drawText("请点击右上角第二个按钮打开一个图片", 100, screenAttribute.h / 2, paint4);
            return;
        }
        let matrix = new android.graphics.Matrix();
        matrix.postScale(pictureAttribute.image.ratio, pictureAttribute.image.ratio);
        matrix.postTranslate(pictureAttribute.image.topX, pictureAttribute.image.topY);

        canvas.drawImage(imgList[pictureAttribute.image.select].img, matrix, paint1);

        实时取色();
        paint1.setARGB(255, nowColor.colorR > 127 ? 0 : 255, nowColor.colorG > 127 ? 0 : 255, nowColor.colorB > 127 ? 0 : 255);
        paint2.setARGB(255, nowColor.colorR > 127 ? 0 : 255, nowColor.colorG > 127 ? 0 : 255, nowColor.colorB > 127 ? 0 : 255);
        paint3.setARGB(255, nowColor.colorR, nowColor.colorG, nowColor.colorB);

        canvas.drawRect(pictureAttribute.showFrame.region[0], pictureAttribute.showFrame.region[1], pictureAttribute.showFrame.region[2], pictureAttribute.showFrame.region[3], paint3);
        canvas.drawRect(pictureAttribute.showFrame.region[0], pictureAttribute.showFrame.region[1], pictureAttribute.showFrame.region[2], pictureAttribute.showFrame.region[3], paint1);
        if (pattern == "getColor") {
            canvas.drawCircle(pictureAttribute.pointer.focusX, pictureAttribute.pointer.focusY, 10, paint1);
            canvas.drawText("X:" + nowColor.x, pictureAttribute.colorShow.x[0], pictureAttribute.colorShow.x[1], paint2);
            canvas.drawText("Y:" + nowColor.y, pictureAttribute.colorShow.y[0], pictureAttribute.colorShow.y[1], paint2);
            canvas.drawText(nowColor.colorString, pictureAttribute.colorShow.color[0], pictureAttribute.colorShow.color[1], paint2);
        } else {
            canvas.drawRect(pictureAttribute.pointer.x1, pictureAttribute.pointer.y1, pictureAttribute.pointer.x2, pictureAttribute.pointer.y2, paint1);
            canvas.drawCircle(pictureAttribute.pointer.focusX, pictureAttribute.pointer.focusY, 10, paint1);
            canvas.drawText("X1:" + nowColor.x1, pictureAttribute.regionShow.x1[0], pictureAttribute.regionShow.x1[1], paint2);
            canvas.drawText("Y1:" + nowColor.y1, pictureAttribute.regionShow.y1[0], pictureAttribute.regionShow.y1[1], paint2);
            canvas.drawText("X2:" + nowColor.x2, pictureAttribute.regionShow.x2[0], pictureAttribute.regionShow.x2[1], paint2);
            canvas.drawText("Y2:" + nowColor.y2, pictureAttribute.regionShow.y2[0], pictureAttribute.regionShow.y2[1], paint2);
        }
        if (prompt.message) {
            canvas.drawRect(pictureAttribute.systemPrompt.showFrame[0], pictureAttribute.systemPrompt.showFrame[1], pictureAttribute.systemPrompt.showFrame[2], pictureAttribute.systemPrompt.showFrame[3], paint3);
            canvas.drawRect(pictureAttribute.systemPrompt.showFrame[0], pictureAttribute.systemPrompt.showFrame[1], pictureAttribute.systemPrompt.showFrame[2], pictureAttribute.systemPrompt.showFrame[3], paint1);
            canvas.drawText(prompt.message, pictureAttribute.systemPrompt.prompt[0], pictureAttribute.systemPrompt.prompt[1], paint2);
        }
    } catch (e) {
        log("绘图出现错误:" + e);
    }
});



function 解析路径加载图片(A) {
    if (files.isFile(A)) {
        imagePath = A;
        MainImg = images.read(A);
        imgList[pictureAttribute.image.select].img = images.copy(MainImg);
        try {
            MainImg.recycle();
        } catch (e) {}
        移动图片(pictureAttribute.image.deviationY, pictureAttribute.image.deviationX);

        pictureAttribute.image.deviationX = 0;
        pictureAttribute.image.deviationY = 0;
        选中图片(pictureAttribute.image.select);
        缩放图片(0.4);

        return true
    };
    return null;
    var dir = "/storage/emulated/0/DCIM";
    var jsFiles = files.listDir(dir, function(name) {
        return (name.endsWith(".jpg") || name.endsWith(".png")) && files.isFile(files.join(dir, name));
    });
    if (jsFiles.length) {
        return images.read(files.join(dir, jsFiles[jsFiles.length - 1]));
    } else {
        toastLog("没有图片可以查看\n请自己修改路径");
        exit();
    };
};


function 选择图片(fun) {
    let intent = new Intent(Intent.ACTION_PICK, null);
    intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
    activity.startActivityForResult(intent, 2);

};
ui.emitter.on("back_pressed", e => {
    if (smallImg) !smallImg.isRecycled() && smallImg.recycle();
    if (imgList) {
        for (let img in imgList) {
            if (imgList[img].img) {
                !imgList[img].img.isRecycled() && imgList[img].img.recycle();
            }
        }
    }
    ui.canvas.removeAllListeners();
    e.consumed = false;
})

ui.emitter.on("activity_result", (requestCode, resultCode, data) => {
    //Activity.RESULT_OK==2;
    if (requestCode != 2) {
        return
    }
    // 从相册返回的数据

    if (data == null) {
        return
    }
    // 得到图片的全路径
    let uri = data.getData();
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

    if (uriArr == null) {
        toastLog("图片路径为空")
        return
    }

    解析路径加载图片(uriArr)


});



function 媒体库选择(fun) {
    ui.run(function() {
        var ctx = activity;
        var window = new android.widget.PopupWindow();
        var view = XmlToView(
            <vertical padding="5">
                        <text text="选择图片" textSize="25sp" gravity="center" />
                        <list id="list" w="*">
                            <vertical w="*" margin="5" bg={colors.toString(colors.GRAY)} gravity="center">
                                <img w="auto" h="auto" margin="6" src="file://{{filePath}}" />
                                <text w="*" h="25" text="{{title}}" textSize="20sp" line="1" margin="5" gravity="center" />
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


界面监听();

function 界面监听() {

    ui.post(() => {
        //初始化悬浮窗及悬浮窗操作对象
        ui.name.setText(layoutAttribute.title.name);

        ui.rightList.setVisibility('8');
        ui.图色功能.setDataSource(功能图标);
        ui.optionList.setDataSource(optionList);
        ui.colorList.setDataSource(colorList);
        ui.imgList.setDataSource(imgList);
        pattern == 'getColor' ? 取色模式() : 取图模式();

        pictureAttribute.pointer.focusX = ui.canvas.getWidth() / 2;
        pictureAttribute.pointer.focusY = ui.canvas.getHeight() / 2;
        pictureAttribute.pointer.x1 = ui.canvas.getWidth() / 2 - 100;
        pictureAttribute.pointer.y1 = ui.canvas.getHeight() / 2 - 100;
        pictureAttribute.pointer.x2 = ui.canvas.getWidth() / 2 + 100;
        pictureAttribute.pointer.y2 = ui.canvas.getHeight() / 2 + 100;
    });

    ui.图色功能.on("item_click", function(icon) {
        switch (icon) {
            case 功能图标[3]:
                if (!imgList[pictureAttribute.image.select].img) {

                    系统提示("请先截图才能执行图色操作");

                    return;
                }
                blockHandle.setTimeout(() => {

                    图片旋转((i) => {
                        blockHandle.setTimeout(() => {

                        }, 0);
                        if (i) 系统提示("图片旋转成功");
                    });

                }, 0);
                break
            case 功能图标[1]:
                if (!imgList[pictureAttribute.image.select].img) {
                    系统提示("请先截图才能执行图色操作");
                    return;
                }
                blockHandle.setTimeout(() => {

                    图片二值化((i) => {
                        blockHandle.setTimeout(() => {

                        }, 0);
                        if (i) 系统提示("图片二值化成功");
                    });

                }, 0);
                break;
            case 功能图标[2]:
                if (!imgList[pictureAttribute.image.select].img) {
                    系统提示("请先截图才能执行图色操作");
                    return;
                }
                blockHandle.setTimeout(() => {
                    设置图片尺寸((i) => {

                        if (i) 系统提示("调整图片尺寸成功");

                    });
                }, 0);
                break;
            case 功能图标[5]:
                blockHandle.setTimeout(() => {
                    获取图片();
                }, 0);
                break;
            case 功能图标[4]:
                /*快速点击删除图片时可能出现闪退的情况
                try无法捕获异常？？？*/
                if (!imgList[pictureAttribute.image.select].img) {
                    系统提示("请先截图才能执行图色操作");
                    return;
                }
                blockHandle.setTimeout(() => {
                    try {
                        let sn = pictureAttribute.image.select;
                        if (sn > 0) {
                            //如果当前选中的图片序号大于0，则选中当前选项的前一张图片
                            pictureAttribute.image.select = sn - 1;
                            imgList[sn - 1].select = true;
                        } else {
                            //如果当前选中的图片序号等于0，则选中当前选项的后一张图片
                            pictureAttribute.image.select = sn;
                            imgList[sn + 1].select = true;
                        }
                        //删除当前选中的图片

                        imgList[sn].img.recycle();
                        imgList.splice(sn, 1);
                        选中图片(pictureAttribute.image.select);

                    } catch (e) {
                        log("未知错误:" + e);
                    }
                    ui.post(() => {
                        ui.imgList.adapter.notifyDataSetChanged();
                    }, 100);
                }, 0);
                break;
            case 功能图标[0]:
                app.startActivity("console");
                break
                //设置
            case 功能图标[6]:
                let otherSettingView = ui.inflate(
                    <vertical padding="20 10">
                                <View bg="#666666" h="1" w="*" />
                                <horizontal id="tuse" h="{{zoom(120)}}px" >
                                    <text text="启动悬浮图色助手" textColor="#999999" layout_gravity="center" />
                                    
                                </horizontal>
                                <View bg="#666666" h="1" w="*" />
                                <horizontal h="{{zoom(120)}}px" gravity="left|center">
                                    <text text="媒体库" textColor="#999999" />
                                    <checkbox id="imgxz1" checked="{{storage.get('imgxz')}}" />
                                    <text text="本机文件" textColor="#999999" />
                                    <checkbox id="imgxz2" checked="{{storage.get('imgxz') ? false:true}}" />
                                    
                                </horizontal>
                                <View bg="#666666" h="1" w="*" />
                                
                                <horizontal>
                                    <text text="更改保存目录:" textColor="#999999" />
                                    <input id="download_catalogue" w="*" hint="{{path}}" />
                                </horizontal>
                                <View bg="#666666" h="1" w="*" />
                            </vertical>, null, false);
                //设置对话框
                let dina = dialogs.build({
                    type: "app-or-overlay",
                    customView: otherSettingView,
                    title: "设置",
                    titleColor: "#DDDDDD",
                    wrapInScrollView: false,
                    autoDismiss: false
                }).show()
                otherSettingView.getParent().getParent().attr("bg", "#424242");
                otherSettingView.tuse.on("click", (view) => {
                    if (!files.exists("./图色助手Pro Max.js")) {
                        系统提示("对应文件不存在");
                        return
                    }
                    engines.execScriptFile("./图色助手Pro Max.js");
                    dina.dismiss();
                })
                otherSettingView.imgxz1.on("click", (view) => {
                    if (view.checked) otherSettingView.imgxz2.checked = false;
                    storage.put("imgxz", true);
                });
                otherSettingView.imgxz2.on("click", (view) => {
                    if (view.checked) otherSettingView.imgxz1.checked = false;
                    storage.put("imgxz", false);
                });
                otherSettingView.download_catalogue.on("key", function(keyCode, event) {
                    if (event.getAction() == 0 && keyCode == 66) {
                        let text = otherSettingView.download_catalogue.text()
                        if (text.charAt(text.length - 1) != "/") {
                            text = text + "/";
                        }
                        text = files.path(text)
                        storage.put("储存路径", text);
                        otherSettingView.download_catalogue.setHint(text)
                        otherSettingView.download_catalogue.setText(null)
                        event.consumed = true;
                    }
                });

                break
        }
    });

    var uiX, uiY, downTime, x, y, maxSwipeW, maxSwipeH, swipe;


    var clickScreenX, clickScreenY; //记录手指按下时相对于屏幕的坐标
    var clickImgTopX, clickImgTopY; //记录手指按下时图片的顶点坐标
    var clickImgDeviationX, clickImgDeviationY; //记录手指按下时图片偏离中心的坐标
    var aim = ""; //记录手指按下时点击的焦点
    var pointerX1, pointerY1, pointerX2, pointerY2, pointer; //记录手指按下时指针的坐标
    ui.canvas.setOnTouchListener(function(view, event) {
        try {
            switch (event.getAction()) {
                case event.ACTION_DOWN:
                    aim = 计算点击焦点(event.getX(), event.getY());
                    clickScreenX = event.getRawX();
                    clickScreenY = event.getRawY();
                    clickImgTopX = pictureAttribute.image.topX;
                    clickImgTopY = pictureAttribute.image.topY;
                    clickImgDeviationX = pictureAttribute.image.deviationX;
                    clickImgDeviationY = pictureAttribute.image.deviationY;

                    pointerX1 = pictureAttribute.pointer.x1;
                    pointerY1 = pictureAttribute.pointer.y1;
                    pointerX2 = pictureAttribute.pointer.x2;
                    pointerY2 = pictureAttribute.pointer.y2;
                    pointer = [pictureAttribute.pointer.focusX,
                        pictureAttribute.pointer.focusY
                    ];
                    break;
                case event.ACTION_MOVE:
                    let sX = event.getRawX() - clickScreenX;
                    let sY = event.getRawY() - clickScreenY;

                    switch (aim) {
                        case "pointerXY1":
                            缩放指针("xy1", pointerX1 + sX, pointerY1 + sY);
                            pictureAttribute.image.deviationX = clickImgDeviationX - (pointer[0] - pictureAttribute.pointer.focusX) / pictureAttribute.image.ratio;
                            pictureAttribute.image.deviationY = clickImgDeviationY - (pointer[1] - pictureAttribute.pointer.focusY) / pictureAttribute.image.ratio;
                            break;
                        case "pointerXY2":
                            缩放指针("xy2", pointerX2 + sX, pointerY2 + sY);
                            pictureAttribute.image.deviationX = clickImgDeviationX - (pointer[0] - pictureAttribute.pointer.focusX) / pictureAttribute.image.ratio;
                            pictureAttribute.image.deviationY = clickImgDeviationY - (pointer[1] - pictureAttribute.pointer.focusY) / pictureAttribute.image.ratio;
                            break;
                        case "pointerFocus":
                            移动指针(pointerX1 + sX, pointerY1 + sY);
                            pictureAttribute.image.deviationX = clickImgDeviationX - (pointer[0] - pictureAttribute.pointer.focusX) / pictureAttribute.image.ratio;
                            pictureAttribute.image.deviationY = clickImgDeviationY - (pointer[1] - pictureAttribute.pointer.focusY) / pictureAttribute.image.ratio;
                            break;
                        case "showFrame":
                            if (Math.abs(sX) > 10 || Math.abs(sY) > 10) aim = "img";
                            break;
                        case "img":
                            移动图片(clickImgTopX + sX, clickImgTopY + sY);
                            pictureAttribute.image.deviationX = clickImgDeviationX - sX / pictureAttribute.image.ratio;
                            pictureAttribute.image.deviationY = clickImgDeviationY - sY / pictureAttribute.image.ratio;
                            break;
                    };
                    break;
                case event.ACTION_UP:
                    if (aim == "showFrame" && Math.abs(event.getRawY() - clickScreenY) < 10 && Math.abs(event.getRawX() - clickScreenX) < 10) {
                        var str = "";
                        if (pattern == "getColor") {
                            str = nowColor.x + ',' + nowColor.y + ',' + nowColor.colorString;
                        } else {
                            str = nowColor.x1 + ',' + nowColor.y1 + ',' + nowColor.x2 + ',' + nowColor.y2;
                        }
                        blockHandle.setTimeout(() => {
                            复制点色数据(str, (i) => {

                                if (i) 系统提示("复制点色数据成功");
                            });

                        }, 0);
                    }
                    break;
            };
            return true;
        } catch (e) {
            return true;
        };
    });

    ui.zoom.setOnSeekBarChangeListener({
        onProgressChanged: function(seekbar, p, fromUser) {
            if (!fromUser) return;
            let ratio = Number(ui.zoom.getProgress().toString());
            ratio = (0.4 + (ratio * 0.1) * (ratio * 0.002)).toFixed(2);
            ui.ratio.setText(ratio + "X");
            if (imgList[pictureAttribute.image.select].img) 缩放图片(ratio);
        }
    });

    ui.imgList.on("item_bind", function(itemView, itemHolder) {
        itemView.sn.on("click", function() {
            选中图片(itemHolder.position);
            pictureAttribute.image.deviationX = 0;
            pictureAttribute.image.deviationY = 0;
            if (imgList[itemHolder.position].img) 缩放图片(0.3);
            ui.imgList.adapter.notifyDataSetChanged();
        });
    });

    ui.optionList.on("item_click", function(icon) {
        if (icon != optionList[6]) {
            if (!imgList[pictureAttribute.image.select].img) {
                系统提示("请先截图才能执行图色操作");
                return;
            };
        }
        switch (icon) {
            case optionList[0]:
                if (layoutAttribute.rightList.show) {
                    ui.rightList.setVisibility('8');
                    layoutAttribute.rightList.show = false;
                } else {
                    ui.rightList.setVisibility('0');
                    layoutAttribute.rightList.show = true;
                };
                break;
            case optionList[1]:
                if (pattern == "getImg") {
                    取色模式();
                    系统提示("切换为取点色");
                } else {
                    取图模式();
                    系统提示("切换为取小图");
                };
                break;
            case optionList[2]:
                if (pattern == "getColor") {
                    取色();
                } else {
                    裁剪图片();
                }
                break;
            case optionList[3]:
                if (pattern == "getColor") {
                    if (!blockHandle.isAlive) {
                        blockHandle = threads.start(function() {
                            //启动一个计时器保证线程不会终止运行
                            setInterval(() => {}, 1000);
                        });
                        系统提示("线程被终止,重启中..");
                        break
                    }
                    blockHandle.setTimeout(() => {
                        dialogs.singleChoice("点色测试", ["多点找色", "多点比色"], 0, (i) => {
                            blockHandle.setTimeout(() => {
                                系统提示("正在处理...");

                                if (i == 0) {
                                    if (colorList.length >= 2) {
                                        多点找色测试(转多点找色数组());
                                    } else {
                                        系统提示("取2个以上点才能进行多点找色")
                                    }
                                } else {
                                    let n = 多点比色(转多点比色数组());
                                    系统提示("找到" + n + "个与点色匹配的坐标");
                                }
                            }, 0);
                        });

                    }, 0);
                } else {
                    if (smallImg) {
                        找图测试();
                    } else {
                        系统提示("请先截取小图才能进行找图");
                    }
                }
                break;
            case optionList[4]:
                if (pattern == "getColor") {
                    if (colorList.length >= 2) {
                        dialogs.singleChoice("坐标点色", ["滑动手势", "点阵"], 0, (i) => {
                            blockHandle.setTimeout(() => {
                                系统提示("正在处理...");

                                switch (i) {
                                    case 0:
                                        生成swipe坐标((i) => {
                                            if (i) 系统提示("生成swipe成功");
                                        })
                                        break
                                    case 1:
                                        保存点色数据((i) => {

                                            if (i) 系统提示("保存点色数据成功");

                                        });

                                        break
                                }
                            }, 0);
                        })
                    } else {
                        系统提示("取2个以上点才能保存");
                    }
                } else {
                    if (smallImg) {
                        blockHandle.setTimeout(() => {
                            保存图片((i) => {

                                if (i) 系统提示("保存图片成功");
                            });

                        }, 0);
                    } else {
                        系统提示("无法保存空白图片");
                    }
                }
                break;
            case optionList[5]:
                if (pattern == "getColor") {
                    if (colorList.length >= 2) {
                        blockHandle.setTimeout(() => {
                            复制点色数组((i) => {

                                if (i) 系统提示("复制点色数组成功");
                            });

                        }, 0);
                    } else {
                        系统提示("取2个以上点才能复制数组");
                    }
                } else {
                    if (smallImg) {
                        blockHandle.setTimeout(() => {
                            复制图片base64编码((i) => {

                                if (i) 系统提示("复制图片base64编码成功");

                            });
                        }, 0);
                    } else {
                        系统提示("无法对空白图片进行base64编码");
                    }
                }
                break;
            case optionList[6]:
                系统提示("暂无功能:占位用");
                //  File_selector(".png")

                //    
                break;
        }
        ui.optionList.adapter.notifyDataSetChanged();
    });

    ui.清空.click(() => {
        colorList.splice(0, colorList.length);
    });

    ui.colorList.on("item_bind", function(itemView, itemHolder) {
        itemView.delColor.on("click", function() {
            colorList.splice(itemHolder.position, 1);
        });
        itemView.点色.on("click", function() {
            var str = colorList[itemHolder.position].x + ',' + colorList[itemHolder.position].y + ',' + colorList[itemHolder.position].color;
            blockHandle.setTimeout(() => {
                复制点色数据(str, (i) => {

                    if (i) 系统提示("复制点色数据成功");
                });

            }, 0);
        });
    });
}

function File_selector(mime_Type, fun) {
    /*toastLog("请选择后缀为.png/.jpg类型的图片文件");
    let FileChooserDialog = require("./file_chooser_dialog");
    FileChooserDialog.build({
        title: '请选择后缀为.png/.jpg的文件',
        type: "app-or-overlay",
        // 初始文件夹路径
        dir: "/sdcard/",
        // 可选择的类型，file为文件，dir为文件夹
        canChoose: ["file"],
        mimeType: mime_Type,
        wrapInScrollView: true,
        // 选择文件后的回调
        fileCallback: (file) => {
            if (file == null) {
                toastLog("未选择路径");
                return
            }*/
    file = "/sdcard/1920.png";

    console.info("选择的文件路径：" + file);
    let img = images.read(file);
    imgList[pictureAttribute.image.select].img = images.copy(img);
    pictureAttribute.image.deviationX = 0;
    pictureAttribute.image.deviationY = 0;
    选中图片(pictureAttribute.image.select);
    if (imgList[pictureAttribute.image.select].img) 缩放图片(0.3);
    系统提示("设置图片成功");
    img.recycle();


    //  }

    //  }).show();

}

function 计算点击焦点(x, y) {
    if (x > (pictureAttribute.pointer.x2 - pictureAttribute.pointer.operateRadius) && x < (pictureAttribute.pointer.x2 + pictureAttribute.pointer.operateRadius) && y > (pictureAttribute.pointer.y2 - pictureAttribute.pointer.operateRadius) && y < (pictureAttribute.pointer.y2 + pictureAttribute.pointer.operateRadius)) {
        return "pointerXY2";
    } else if (x > (pictureAttribute.pointer.x1 - pictureAttribute.pointer.operateRadius) && x < (pictureAttribute.pointer.x1 + pictureAttribute.pointer.operateRadius) && y > (pictureAttribute.pointer.y1 - pictureAttribute.pointer.operateRadius) && y < (pictureAttribute.pointer.y1 + pictureAttribute.pointer.operateRadius)) {
        return ("pointerXY1");
    } else if (x > (pictureAttribute.pointer.focusX - pictureAttribute.pointer.operateRadius) && x < (pictureAttribute.pointer.focusX + pictureAttribute.pointer.operateRadius) && y > (pictureAttribute.pointer.focusY - pictureAttribute.pointer.operateRadius) && y < (pictureAttribute.pointer.focusY + pictureAttribute.pointer.operateRadius)) {
        return "pointerFocus";
    } else if (x > pictureAttribute.showFrame.region[0] && x < pictureAttribute.showFrame.region[2] && y > pictureAttribute.showFrame.region[1] && y < pictureAttribute.showFrame.region[3] && imgList[pictureAttribute.image.select].img) {
        return "showFrame";
    } else {
        return "img";
    };
};

function 获取图片() {
    threads.start(function() {

        if (storage.get("imgxz") == false) {
            选择图片()
            return
        } else if (storage.get("imgxz") == true) {
            媒体库选择(function(path_) {

                解析路径加载图片(path_);

            });
            return

        }
        let imgxzui = ui.inflate(
            <vertical padding="25 0">
                        <radiogroup id="imgxz" orientation="vertical" w="*" h="*">
                            <radio id="xz1" text="媒体库" w="*" textSize="20" margin="0 5" checked="true" />
                            <radio id="xz2" text="本机文件" w="*" textSize="20" margin="0 5" />
                        </radiogroup>
                        <checkbox id="mr" text="下次默认选择，可在设置更改" margin="0 5" />
                        
                        <text id="ok" text="确定" padding="20 6" textSize="16sp" bg="#b4b4b4" w="auto" layout_gravity="right" />
                    </vertical>, null, false);
        var imgxz = dialogs.build({
            type: 'app',
            title: "选择打开方式",
            customView: imgxzui,
            wrapInScrollView: false,
            autoDismiss: true
        }).show()
        imgxzui.ok.click(() => {
            imgxz.dismiss()
            if (storage.get("imgxz") == false || imgxzui.xz1.checked == false) {
                选择图片()
                return
            }
            媒体库选择(function(path_) {

                解析路径加载图片(path_);

            });


        })
        imgxzui.mr.click(() => {
            storage.put("imgxz", imgxzui.xz1.checked);
        })

    });


};

function 选中图片(sn) {
    //如果空白位被占用则再次添加空白位;
    if (imgList[imgList.length - 1].img) {
        imgList.push({
            sn: imgList.length,
            select: false,
            img: null
        });
    };

    //重新生成序号并把所有选中状态设为false
    for (let i = 0; i < imgList.length; i++) {
        imgList[i].sn = i;
        imgList[i].select = false;
    };

    //根据传入序号设置选中项
    pictureAttribute.image.select = sn;
    imgList[sn].select = true;
    ui.post(() => {
        ui.imgList.adapter.notifyDataSetChanged();
    });
}

function 上传图片() {
    /*将截图以base64的形式上传至云端，方便同步到其它的设备上测试
    需自行添加上传下载模块*/
    系统提示("正在上传图片到云端");
    try {
        let imgBase64 = images.toBase64(imgList[pictureAttribute.image.select].img, "png", 100);
        坚果云.上传文件("图色助手Pro/imgBase64.txt", imgBase64);
        系统提示("上传图片成功");
    } catch (e) {
        系统提示("错误:上传失败或网络错误");
    }
}

function 下载图片() {
    系统提示("正在从云端下载图片");
    try {
        let imgBase64 = 坚果云.读取文件("图色助手Pro/imgBase64.txt");
        let img = images.fromBase64(imgBase64);
        imgList[pictureAttribute.image.select].img = images.copy(img);
        pictureAttribute.image.deviationX = 0;
        pictureAttribute.image.deviationY = 0;
        选中图片(pictureAttribute.image.select);
        if (imgList[pictureAttribute.image.select].img) 缩放图片(0.3);
        系统提示("下载图片成功");
        img.recycle();
    } catch (e) {
        系统提示("错误:下载失败或网络错误");
    }
}

function 缩放图片(ratio) {
    pictureAttribute.image.topX = 0 - ((imgList[pictureAttribute.image.select].img.getWidth() / 2 + pictureAttribute.image.deviationX) * ratio) + pictureAttribute.pointer.focusX;
    pictureAttribute.image.topY = 0 - ((imgList[pictureAttribute.image.select].img.getHeight() / 2 + pictureAttribute.image.deviationY) * ratio) + pictureAttribute.pointer.focusY;

    pictureAttribute.image.ratio = ratio;
};

function 移动图片(x, y) {
    pictureAttribute.image.topX = x;
    pictureAttribute.image.topY = y;
};

function 定位坐标(xy) {
    pictureAttribute.image.deviationX = xy.x - imgList[pictureAttribute.image.select].img.getWidth() / 2;
    pictureAttribute.image.deviationY = xy.y - imgList[pictureAttribute.image.select].img.getHeight() / 2;
    缩放图片(pictureAttribute.image.ratio);
};

function 图片旋转() {
    let img = images.rotate(imgList[pictureAttribute.image.select].img, 90);
    imgList[imgList.length - 1].img = images.copy(img);
    选中图片(imgList.length - 1);
    pictureAttribute.image.deviationX = 0;
    pictureAttribute.image.deviationY = 0;
    缩放图片(pictureAttribute.image.ratio);
    img.recycle();
}

function 设置图片尺寸(callback) {
    let view = ui.inflate(
        <vertical padding="16 0">
            <horizontal margin="22px 0">
                <text text="W:" />
                <input id="X" w="250px" />
                <text text="H:" />
                <input id="Y" w="250px" />
            </horizontal>
        </vertical>,
        null, false);

    view.X.setText(storage.get("inputX", "720") + "");
    view.Y.setText(storage.get("inputY", "1280") + "");

    dialogs.build({
        customView: view,
        title: "设置图片尺寸",
        type: "foreground-or-overlay",
        positive: "确定",
        negative: "取消",
        wrapInScrollView: false,
        autoDismiss: false
    }).on("positive", (dialog) => {
        let x = Number(view.X.getText());
        let y = Number(view.Y.getText());
        if (x == NaN || x == 0) {
            view.X.setError("请输入宽度数值");
        } else if (y == NaN || y == 0) {
            view.Y.setError("请输入高度数值");
        } else {
            callback(true);
            let img = images.resize(imgList[pictureAttribute.image.select].img, [x, y]);
            imgList[imgList.length - 1].img = images.copy(img);
            选中图片(imgList.length - 1);
            pictureAttribute.image.deviationX = 0;
            pictureAttribute.image.deviationY = 0;
            缩放图片(pictureAttribute.image.ratio);
            storage.put("inputX", x);
            storage.put("inputY", y);
            img.recycle()
            dialog.dismiss();
        };
    }).on("negative", (dialog) => {
        callback(false);
        dialog.dismiss();
    }).show();

};

function 图片二值化(callback) {
    let view = ui.inflate(
        <vertical padding="16 0">
            <horizontal margin="22px 0">
                <text text="颜色值:" />
                <input id="color" w="300px" />
                <text text="范围:" />
                <input id="about" w="100px" />
            </horizontal>
        </vertical>,
        null, false);

    view.color.setText(nowColor.colorString);
    view.about.setText(storage.get("about", "8") + "");

    dialogs.build({
        customView: view,
        title: "图片二值化",
        type: "foreground-or-overlay",
        positive: "确定",
        negative: "取消",
        wrapInScrollView: false,
        autoDismiss: false
    }).on("positive", (dialog) => {
        let color = view.color.getText() + "";
        let about = view.about.getText() + "";
        if (color == "") {
            view.color.setError("请输入16进制颜色字符串");
        } else if (about == "") {
            view.about.setError("请输入偏色范围数值");
        } else {
            callback(true);
            let img = images.rotate(imgList[pictureAttribute.image.select].img, color, about);
            let img1 = images.clip(img, 0, 0, img.getWidth(), img.getHeight());
            imgList[imgList.length - 1].img = images.copy(img1);
            选中图片(imgList.length - 1);
            缩放图片(pictureAttribute.image.ratio);
            storage.put("about", about);
            img.recycle();
            img1.recycle();
            dialog.dismiss();
        };
    }).on("negative", (dialog) => {
        callback(false);
        dialog.dismiss();
    }).show();

};


function 转多点找色数组() {
    let arr = [];
    let base = colorList[0];
    for (let i of colorList) {
        arr.push([i.x - base.x, i.y - base.y, i.color]);
    }
    return [base.color, arr];
}

function 转多点比色数组() {
    let arr = [];
    for (let i of colorList) {
        arr.push([i.x, i.y, i.color]);
    }
    return arr;
}

function 转swipe数组() {
    return [colorList[colorList.length - 2].x, colorList[colorList.length - 2].y, colorList[colorList.length - 1].x, colorList[colorList.length - 1].y]
}

function 多点找色测试(colorArr) {
    let t = new Date().getTime();

    var p = images.findMultiColors(imgList[pictureAttribute.image.select].img, "#1d1f21", [
        [colorArr[1][0][0], colorArr[1][0][1], colorArr[1][0][2].toString()],
        [colorArr[1][1][0], colorArr[1][1][1], colorArr[1][1][2].toString()]
    ], {
        threshold: [4],
    });

    if (p) {
        系统提示("多点找色耗时:" + (new Date().getTime() - t) + "毫秒");
        定位坐标(p);
    } else {
        系统提示("多点找色失败");
    };
}

function 多点比色(colorArr) {
    var n = 0;
    for (var c of colorArr) {
        if (images.detectsColor(imgList[pictureAttribute.image.select].img, c[2], c[0], c[1], 4)) n++;
    };
    return n;
}

function 找图测试() {
    let t = new Date().getTime();
    let p = findImage(imgList[pictureAttribute.image.select].img, smallImg, {
        threshold: [0.9],
    });
    if (p) {
        系统提示("找到图片，耗时:" + (new Date().getTime() - t) + "毫秒");
        定位坐标(p);
    } else {
        系统提示("没有找到图片");
    };
}

function 实时取色() {
    var X = pictureAttribute.pointer.focusX - pictureAttribute.image.topX;
    var Y = pictureAttribute.pointer.focusY - pictureAttribute.image.topY;
    var x = X / pictureAttribute.image.ratio;
    var y = Y / pictureAttribute.image.ratio;
    var x = Math.floor((0 <= x && x < imgList[pictureAttribute.image.select].img.getWidth()) ? x : (0 <= x ? imgList[pictureAttribute.image.select].img.getWidth() - 1 : 0));
    var y = Math.floor((0 <= y && y < imgList[pictureAttribute.image.select].img.getHeight()) ? y : (0 <= y ? imgList[pictureAttribute.image.select].img.getHeight() - 1 : 0));

    try {
        var colorNumber = images.pixel(imgList[pictureAttribute.image.select].img, x, y);
    } catch (e) {
        console.error("实时取色出现错误:" + e)
        return
    }
    var colorString = colors.toString(colorNumber);

    var colorR = colors.red(colorString);
    var colorG = colors.green(colorString);
    var colorB = colors.blue(colorString);
    var xy1 = 计算坐标(pictureAttribute.pointer.x1, pictureAttribute.pointer.y1);
    var xy2 = 计算坐标(pictureAttribute.pointer.x2, pictureAttribute.pointer.y2);
    nowColor = {
        x: x,
        y: y,
        x1: xy1.x,
        y1: xy1.y,
        x2: xy2.x,
        y2: xy2.y,
        colorNumber: colorNumber,
        colorString: "#" + colorString.slice(3),
        colorR: colorR,
        colorG: colorG,
        colorB: colorB
    };
};

function 取色() {
    colorList.push({
        x: nowColor.x,
        y: nowColor.y,
        color: nowColor.colorString
    });
};

function 裁剪图片() {
    let xy1 = 计算坐标(pictureAttribute.pointer.x1, pictureAttribute.pointer.y1);
    let xy2 = 计算坐标(pictureAttribute.pointer.x2, pictureAttribute.pointer.y2);
    x = xy1.x;
    y = xy1.y;
    w = xy2.x - xy1.x;
    h = xy2.y - xy1.y;
    try {
        smallImg = images.clip(imgList[pictureAttribute.image.select].img, x, y, w, h);
        ui.smImg.setSource(smallImg);
    } catch (e) {
        系统提示("面积过小,无法继续裁剪");
    };
};

function 复制点色数据(str, callback) {
    let view = ui.inflate(
        <vertical padding="{{zoom(50)}}px 0">
            <input id="str" w="*" />
        </vertical>,
        null, false);

    view.str.setText(str);

    dialogs.build({
        customView: view,
        title: "复制点色数据",
        type: "foreground-or-overlay",
        positive: "复制",
        negative: "取消",
        canceledOnTouchOutside: false,
        wrapInScrollView: false,
        autoDismiss: false
    }).on("positive", (dialog) => {
        setClip(view.str.getText());
        dialog.dismiss();
        callback(true);
    }).on("negative", (dialog) => {
        dialog.dismiss();
        callback(false);
    }).show();
}

function 复制点色数组(callback) {
    dialogs.singleChoice("复制点色数组:", ["多点找色", "多点比色"], 0, (i) => {
        if (i == 0) {
            setClip(JSON.stringify(转多点找色数组()));
            callback(true);
        } else if (i == 1) {
            setClip(JSON.stringify(转多点比色数组()));
            callback(true);
        } else {
            callback(false);
        };
    });
};

function 复制图片base64编码(callback) {
    confirm("是否复制图片base64编码", "", (i) => {
        if (i) {
            var base64 = images.toBase64(smallImg, "png", 100);
            setClip(base64);
            callback(true);
        } else {
            callback(false);
        }
    });
};

function 生成swipe坐标(callback) {
    importClass(android.content.DialogInterface);
    importClass(android.graphics.drawable.GradientDrawable);
    importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
    importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);
    let ui_add = ui.inflate(
        <vertical padding="10 0" >
            <text id="add_text" text="修改swipe参数" margin="15 20" textSize="20sp" />
            <com.google.android.material.textfield.TextInputLayout
            id="sleep" margin="1 0"
            layout_weight="1"
            layout_height="wrap_content">
            <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
            singleLine="true" inputType="number" txet="500" width="400px" />
        </com.google.android.material.textfield.TextInputLayout>
        <text margin="8 0" text="1000毫秒 = 1秒。不需要等待留空即可" />
        
        <horizontal marginTop="15">
            <com.google.android.material.textfield.TextInputLayout
            id="axis_x1" margin="1 0"
            layout_weight="1"
            layout_height="wrap_content">
            <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
            singleLine="true" inputType="number" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
        id="axis_y1"
        layout_weight="1" margin="1 0"
        layout_height="wrap_content">
        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
        singleLine="true" inputType="number" />
        </com.google.android.material.textfield.TextInputLayout>
        <com.google.android.material.textfield.TextInputLayout
        id="axis_x2" margin="1 0"
        layout_weight="1"
        layout_height="wrap_content">
        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
        singleLine="true" inputType="number" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
        id="axis_y2"
        layout_weight="1" margin="1 0"
        layout_height="wrap_content">
        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
        singleLine="true" inputType="number" />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
        id="duration" margin="1 0"
        layout_weight="1"
        layout_height="wrap_content">
        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
        singleLine="true" inputType="number" />
        </com.google.android.material.textfield.TextInputLayout>
        
        </horizontal>
        <text margin="8 0" text="请确认swipe参数,设置滑动时长。建议800-1800毫秒，远大近小。" />
        <text margin="8 0" id="axis_tips" text="有多组坐标时,只能取最后两个组坐标值填入" textColor="#FF0000" visibility="gone" />
        </vertical>, null, false)
    var d_add = dialogs.build({
        type: 'app',
        customView: ui_add,
        positive: "确定",
        positiveColor: "#424242",
        negative: "取消",
        negativeColor: "#cc423232",
        //  cancelable: true,
        //  canceledOnTouchOutside:false,
        wrapInScrollView: false
    }).on("positive", (dialog) => {
        let axis_x1 = ui_add.axis_x1.getEditText().getText()
        let axis_x2 = ui_add.axis_x2.getEditText().getText()
        let axis_y1 = ui_add.axis_y1.getEditText().getText()
        let axis_y2 = ui_add.axis_y2.getEditText().getText()

        let sleep_ = ui_add.sleep.getEditText().getText()
        let duration = ui_add.duration.getEditText().getText()
        if (duration == "") {
            toastLog("滑动执行时长不可为空");
            dialog.show()
            return
        }
        let text_stroke_gestures = "";
        if (sleep_ != "") {
            text_stroke_gestures = "\n('<---等待 " + sleep_ + " 毫秒--->'); \nsleep(" + sleep_ + ");\n"
        }
        text_stroke_gestures += "\n('<---滑动手势,从 " + axis_x1 + "," + axis_y1 + " 到 " + axis_x2 + "," + axis_y2 + " ,耗时 " + duration + " 毫秒. 注:滑动部署干员步骤x2,y2终点要在地板偏左上,才好放上干员--->');" +
            "\nswipe(" + axis_x1 + "," + axis_y1 + ", " + axis_x2 + "," + axis_y2 + "," + duration + ");\n";
        setClip(text_stroke_gestures);
        console.info(text_stroke_gestures);
        snakebar("已复制/打印swipe数据");
        dialog.dismiss()
        callback(true);
    }).on("negative", (dialog) => {

        dialog.dismiss()
        callback(false);
    }).on("show", (dialog) => {
        let arr = 转swipe数组();
        log(arr);
        ui_add.axis_x1.setHint("x1坐标轴")
        ui_add.axis_x2.setHint("x2坐标轴")

        ui_add.axis_y1.setHint("y1坐标轴")
        ui_add.axis_y2.setHint("y2坐标轴")

        ui_add.sleep.setHint("等待?秒开始执行")
        ui_add.duration.setHint("滑动执行时长")

        ui_add.axis_x1.getEditText().setText(arr[0].toString())
        ui_add.axis_y1.getEditText().setText(arr[1].toString())

        ui_add.axis_x2.getEditText().setText(arr[2].toString())
        ui_add.axis_y2.getEditText().setText(arr[3].toString())

        ui_add.sleep.getEditText().setText("500");
        if (colorList.length > 2) {
            ui_add.axis_tips.setVisibility(0);
        }
    }).show()

}

function 保存点色数据(callback) {
    dialogs.build({
        title: "请输入点阵名称",
        inputPrefill: "点阵1",
        negative: "取消",
        type: "foreground-or-overlay",
        positive: "保存",
        canceledOnTouchOutside: false,
    }).on("input", (name) => {
        if (name == null || name == "") {
            系统提示("名称不可为空");
        } else {
            path_ = path + "点色/" + name + ".txt"
            files.createWithDirs(path_);
            let colorArr = {};
            colorArr["多点找色"] = 转多点找色数组();
            colorArr["多点比色"] = 转多点比色数组();
            var str = JSON.stringify(colorArr);
            files.write(path_, str);
            snakebar("保存至" + path_);
        };
        callback(true);
    }).on("negative", () => {
        callback(false);
    }).show();
};

function 保存图片(callback) {
    dialogs.build({
        title: "请输入图片名称",
        inputPrefill: "图片1",
        negative: "取消",
        type: "foreground-or-overlay",
        positive: "保存",
        canceledOnTouchOutside: false,
    }).on("input", (name) => {
        if (name == null || name == "") {
            系统提示("名称不可为空");
        } else {
            path_ = path + name + ".png"
            files.createWithDirs(path_);
            images.saveImage(smallImg, path_);
            snakebar("保存至" + path_);
        };
        callback(true);
    }).on("negative", () => {
        callback(false);
    }).show();
};

function 缩放指针(xy, x, y) {
    let edge = zoom(60);
    if (xy == "xy2") {
        x < ui.canvas.getWidth() - edge && x - pictureAttribute.pointer.x1 > 100 ? pictureAttribute.pointer.x2 = x : x - pictureAttribute.pointer.x1 > 100 ? pictureAttribute.pointer.x2 = ui.canvas.getWidth() - edge : pictureAttribute.pointer.x2 = pictureAttribute.pointer.x1 + 100;
        y < ui.canvas.getHeight() - edge && y - pictureAttribute.pointer.y1 > 100 ? pictureAttribute.pointer.y2 = y : y - pictureAttribute.pointer.y1 > 100 ? pictureAttribute.pointer.y2 = ui.canvas.getHeight() - edge : pictureAttribute.pointer.y2 = pictureAttribute.pointer.y1 + 100;
    } else {
        x > 0 + edge && pictureAttribute.pointer.x2 - x > 100 ? pictureAttribute.pointer.x1 = x : pictureAttribute.pointer.x2 - x > 100 ? pictureAttribute.pointer.x1 = 0 + edge : pictureAttribute.pointer.x1 = pictureAttribute.pointer.x2 - 100;
        y > 0 + edge && pictureAttribute.pointer.y2 - y > 100 ? pictureAttribute.pointer.y1 = y : pictureAttribute.pointer.y2 - y > 100 ? pictureAttribute.pointer.y1 = 0 + edge : pictureAttribute.pointer.y1 = pictureAttribute.pointer.y2 - 100;
    };
    pictureAttribute.pointer.focusX = pictureAttribute.pointer.x1 + (pictureAttribute.pointer.x2 - pictureAttribute.pointer.x1) / 2;
    pictureAttribute.pointer.focusY = pictureAttribute.pointer.y1 + (pictureAttribute.pointer.y2 - pictureAttribute.pointer.y1) / 2;
};

function 移动指针(x, y) {
    let edge = zoom(60);
    let w = pictureAttribute.pointer.x2 - pictureAttribute.pointer.x1;
    let h = pictureAttribute.pointer.y2 - pictureAttribute.pointer.y1;
    x > 0 + edge && x + w < ui.canvas.getWidth() - edge ? pictureAttribute.pointer.x1 = x : x + w < ui.canvas.getWidth() - edge ? pictureAttribute.pointer.x1 = 0 + edge : pictureAttribute.pointer.x1 = ui.canvas.getWidth() - edge - w;
    y > 0 + edge && y + h < ui.canvas.getHeight() - edge ? pictureAttribute.pointer.y1 = y : y + h < ui.canvas.getHeight() - edge ? pictureAttribute.pointer.y1 = 0 + edge : pictureAttribute.pointer.y1 = ui.canvas.getHeight() - edge - h;
    pictureAttribute.pointer.x2 = pictureAttribute.pointer.x1 + w;
    pictureAttribute.pointer.y2 = pictureAttribute.pointer.y1 + h;
    pictureAttribute.pointer.focusX = pictureAttribute.pointer.x1 + (pictureAttribute.pointer.x2 - pictureAttribute.pointer.x1) / 2;
    pictureAttribute.pointer.focusY = pictureAttribute.pointer.y1 + (pictureAttribute.pointer.y2 - pictureAttribute.pointer.y1) / 2;
};

function 取图模式() {
    pattern = "getImg";
    pictureAttribute.pointer.operateRadius = 40;
    pictureAttribute.showFrame.region = pictureAttribute.regionShow.showFrame;
    ui.colorRecord.setVisibility('8');
    ui.smallImg.setVisibility('0');
    optionList[1] = "@drawable/ic_crop_free_black_48dp";
};

function 取色模式() {
    pattern = "getColor";
    pictureAttribute.pointer.operateRadius = 0;
    pictureAttribute.showFrame.region = pictureAttribute.colorShow.showFrame;
    ui.smallImg.setVisibility('8');
    ui.colorRecord.setVisibility('0');
    optionList[1] = "@drawable/ic_colorize_black_48dp";
};





function 求最小值(array) {
    var small = array[0];
    var n = 0;
    var sn = n;
    for (var i of array) {
        if (i < small)(small = i, sn = n);
        n++;
    };
    return [sn, small];
};

function 计算坐标(X, Y) {
    var X = X - pictureAttribute.image.topX;
    var Y = Y - pictureAttribute.image.topY;
    var x = X / pictureAttribute.image.ratio;
    var y = Y / pictureAttribute.image.ratio;
    return {
        x: Math.floor((0 <= x && x < imgList[pictureAttribute.image.select].img.getWidth()) ? x : (0 <= x ? imgList[pictureAttribute.image.select].img.getWidth() - 1 : 0)),
        y: Math.floor((0 <= y && y < imgList[pictureAttribute.image.select].img.getHeight()) ? y : (0 <= y ? imgList[pictureAttribute.image.select].img.getHeight() - 1 : 0))
    };
};


function 系统提示(s) {
    prompt.message = s;
    if (prompt.time != null) {
        clearTimeout(prompt.time);
    };
    prompt.time = setTimeout(() => {
        prompt.message = null;
        prompt.time = null;
    }, 3000);
};

function 旋转动画(控件, 角度, 方向, 时间) {
    var animator = ObjectAnimator.ofFloat(控件, 方向 == 'x' ? 'rotationX' : 方向 == 'y' ? 'rotationY' : 'rotation', 0, 角度, 角度);
    animator.setDuration(时间);
    animator.start();
}

function 缩放动画(控件, 比例, 方向, 时间) {
    var animator = ObjectAnimator.ofFloat(控件, 方向 == 'Y' ? 'scaleY' : 'scaleX', 1, 比例, 比例);
    animator.setDuration(时间);
    animator.start();
}

function 平移动画(控件, 距离, 方向, 时间) {
    var animator = ObjectAnimator.ofFloat(控件, 方向 == 'x' ? 'translationX' : 'translationY', 0, 距离, 距离, 0);
    animator.setDuration(时间);
    animator.start();
}

function 旋转监听() {
    screenAttribute.direction == "竖屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
    setInterval(() => {
        var getDirection = 获取屏幕方向();
        if (getDirection != screenAttribute.direction) {
            screenAttribute.direction = getDirection;
            screenAttribute.direction == "竖屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);

        };
    }, 100);
};

function 获取屏幕方向() {
    if (ui && ui.homepage && ui.homepage.getWidth() != device.width) {
        return "横屏";
    } else {
        return "竖屏";
    };
    /*
    let config = context.getResources().getConfiguration();
    let ori = config.orientation;
    if (ori == config.ORIENTATION_LANDSCAPE) {
        return "横屏";
    } else if (ori == config.ORIENTATION_PORTRAIT) {
        return "竖屏";
    };
    */
};

function zoom(n) {
    return Math.floor((device.width / 1080) * n);
};

function snakebar(text) {
    log(text)
    com.google.android.material.snackbar.Snackbar.make(ui.homepage, text, 2000).show();
}