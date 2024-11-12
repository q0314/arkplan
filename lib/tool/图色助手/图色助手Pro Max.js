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

var storage = storages.create("图色助手Pro");
//启动一个线程用于处理可能阻塞UI线程的操作
var blockHandle = threads.start(function() {
    //启动一个计时器保证线程不会终止运行
    setInterval(() => {}, 1000);
});

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
    windowOperate: {
        w: zoom(80),
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
        h: zoom(80)
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
        bg: "#ff6789",
        theme: "#ffe785"
    }
};

//设置侧边栏功能键图标
var optionList = [
    "@drawable/ic_assignment_black_48dp",
    "@drawable/ic_colorize_black_48dp",
    "@drawable/ic_check_circle_black_48dp",
    "@drawable/ic_my_location_black_48dp",
    "@drawable/ic_create_new_folder_black_48dp",
    "@drawable/ic_layers_black_48dp",
    "@drawable/ic_memory_black_48dp",
];

//设置顶部功能键图标
var 功能图标 = [
    "@drawable/ic_file_upload_black_48dp",
    "@drawable/ic_file_download_black_48dp",
    "@drawable/ic_exposure_black_48dp",
    "@drawable/ic_wallpaper_black_48dp",
    "@drawable/ic_satellite_black_48dp",
    "@drawable/ic_remove_circle_outline_black_48dp",
    "@drawable/ic_highlight_off_black_48dp"
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
        ratio: 0.3
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
        showFrame: [zoom(560), zoom(5), zoom(1010), zoom(55)],
        prompt: [zoom(580), zoom(40)]
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
    direction: 获取屏幕方向(),
    titleH: 计算状态栏高度()
};
//设置系统提示的内容，这个提示将绘制在canvas中
var prompt = {
    message: null,
    time: null
};
//用于判断运行状态是取色还是截图
var pattern = "getColor";

//将可能存在阻塞的操作丢给阻塞处理线程处理
blockHandle.setTimeout(() => {
    requestScreenCapture();
    旋转监听();
}, 0);

var window = 创建悬浮窗();

//延迟1000毫秒再监听悬浮窗，否则可能出现监听失败的情况
setTimeout(() => {
    悬浮窗监听(window);
}, 1000);



function 创建悬浮窗() {
    var window = floaty.rawWindow(
        <frame w="auto" h="auto">
            <vertical id="homepage" w="{{layoutAttribute.whole.w}}px" h="{{layoutAttribute.whole.h}}px" bg="{{layoutAttribute.setColor.bg}}">
                <frame id="title" w="{{layoutAttribute.whole.w - layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.title.h}}px" layout_gravity="right">
                    <text id="name" text="加载中..." textColor="{{layoutAttribute.setColor.theme}}" textSize="{{zoom(32)}}px" gravity="center_vertical"/>
                    <grid id="图色功能" w="auto" h="*" spanCount="7" layout_gravity="right">
                        <img w="{{zoom(80)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                    </grid>
                </frame>
                <frame w="*" h="*">
                    <canvas id="canvas" w="*" h="*" marginTop="0px" marginBottom="{{zoom(5)}}px" marginLeft="{{zoom(5)}}px" marginRight="{{zoom(5)}}px" />
                    
                    <horizontal w="*" h="{{zoom(50)}}px" bg="#60000000" layout_gravity="bottom" marginTop="0px" marginBottom="{{zoom(5)}}px" marginLeft="{{zoom(5)}}px" marginRight="{{zoom(5)}}px">
                        <text id="ratio" w="{{zoom(100)}}px" h="*" textSize="{{zoom(28)}}px" text="0.30X" textColor="{{layoutAttribute.setColor.theme}}" gravity="center_vertical" marginLeft="{{zoom(5)}}px"/>
                        <seekbar id="zoom" progress="0" max="500" w="*" h="*" />
                    </horizontal>
                    
                    <frame w="{{zoom(60)}}px" h="{{device.width * 0.6}}px" bg="#60000000" marginLeft="{{zoom(5)}}px" layout_gravity="center_vertical">
                        <list id="imgList" w="*" h="auto">
                            <text id="sn" w="*" h="{{zoom(60)}}px" textSize="{{zoom(40)}}px" textColor="{{layoutAttribute.setColor.theme}}" bg="{{select ? layoutAttribute.setColor.bg : img ? '#88000000' : '#30000000'}}" text="{{img ? sn + 1 : '+'}}" gravity="center" marginBottom="3px"/>
                        </list>
                    </frame>
                    
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
                                        <text id="清空" w="{{zoom(100)}}px" h="*" bg="{{layoutAttribute.setColor.theme}}" text="清空" textSize="{{zoom(28)}}px" textColor="#ff0000" margin="{{zoom(5)}}px" layout_gravity="right|center_vertical" gravity="center"/>
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
                                                        <frame w="*" h="*" bg="{{color}}" margin="{{zoom(3)}}px"/>
                                                    </horizontal>
                                                </horizontal>
                                                <frame w="*" h="{{zoom(3)}}px" bg="#88000000" />
                                            </vertical>
                                        </list>
                                    </frame>
                                </vertical>
                                <vertical id="smallImg" w="*" h="*">
                                    <text w="*" h="{{zoom(60)}}px" text="图片记录" bg="#60000000" textSize="{{zoom(28)}}px" textColor="#ffe785" padding="{{zoom(10)}}px 0" gravity="left|center_vertical" />
                                    <img id="smImg" w="*" h="*" bg="#30000000"/>
                                </vertical>
                            </frame>
                        </horizontal>
                    </frame>
                </frame>
            </vertical>
            <card w="{{layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.windowOperate.h}}px" cardCornerRadius="{{zoom(40)}}px" backgroundTint="{{layoutAttribute.setColor.bg}}" cardElevation="0">
                <img id="windowOperate" w="*" h="*" src="@drawable/ic_filter_tilt_shift_black_48dp" tint="{{layoutAttribute.setColor.theme}}"/>
            </card>
        </frame>
    );
    if (device.brand != "HUAWEI" && device.brand != "HONOR"&&device.brand != "NZONE") {
        旋转动画(window.windowOperate, 720, 'z', 2000);
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

    window.canvas.on("draw", function(canvas) {
        try {
            canvas.drawARGB(255, 250, 200, 170);
            if (!imgList[pictureAttribute.image.select].img) {
                if (prompt.message) {
                    canvas.drawRect(pictureAttribute.systemPrompt.showFrame[0], pictureAttribute.systemPrompt.showFrame[1], pictureAttribute.systemPrompt.showFrame[2], pictureAttribute.systemPrompt.showFrame[3], paint3);
                    canvas.drawRect(pictureAttribute.systemPrompt.showFrame[0], pictureAttribute.systemPrompt.showFrame[1], pictureAttribute.systemPrompt.showFrame[2], pictureAttribute.systemPrompt.showFrame[3], paint1);
                    canvas.drawText(prompt.message, pictureAttribute.systemPrompt.prompt[0], pictureAttribute.systemPrompt.prompt[1], paint2);
                }
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

    return window;
}

function 悬浮窗监听(window) {

    ui.post(() => {
        //初始化悬浮窗及悬浮窗操作对象
        window.name.setText(layoutAttribute.title.name);
        window.setPosition(layoutAttribute.whole.iniX, layoutAttribute.whole.iniY);
        window.setTouchable(true);
        window.rightList.setVisibility('8');
        window.图色功能.setDataSource(功能图标);
        window.optionList.setDataSource(optionList);
        window.colorList.setDataSource(colorList);
        window.imgList.setDataSource(imgList);
        pattern == 'getColor' ? 取色模式() : 取图模式();
        layoutAttribute.whole.x = window.getX();
        layoutAttribute.whole.y = window.getY();
        pictureAttribute.pointer.focusX = window.canvas.getWidth() / 2;
        pictureAttribute.pointer.focusY = window.canvas.getHeight() / 2;
        pictureAttribute.pointer.x1 = window.canvas.getWidth() / 2 - 100;
        pictureAttribute.pointer.y1 = window.canvas.getHeight() / 2 - 100;
        pictureAttribute.pointer.x2 = window.canvas.getWidth() / 2 + 100;
        pictureAttribute.pointer.y2 = window.canvas.getHeight() / 2 + 100;
    });

    window.图色功能.on("item_click", function(icon) {
        switch (icon) {
            case 功能图标[0]:
                blockHandle.setTimeout(() => {
                    上传图片();
                }, 0);
                break;
            case 功能图标[1]:
                blockHandle.setTimeout(() => {
                    下载图片();
                }, 0);
                break;
            case 功能图标[2]:
                if (!imgList[pictureAttribute.image.select].img) {
                    系统提示("请先截图才能执行图色操作");
                    return;
                }
                blockHandle.setTimeout(() => {
                    隐藏悬浮窗((oX, oY) => {
                        图片二值化((i) => {
                            blockHandle.setTimeout(() => {
                                显示悬浮窗(oX, oY);
                            }, 0);
                            if (i) 系统提示("图片二值化成功");
                        });
                    });
                }, 0);
                break;
            case 功能图标[3]:
                if (!imgList[pictureAttribute.image.select].img) {
                    系统提示("请先截图才能执行图色操作");
                    return;
                }
                blockHandle.setTimeout(() => {
                    隐藏悬浮窗((oX, oY) => {
                        设置图片尺寸((i) => {
                            blockHandle.setTimeout(() => {
                                显示悬浮窗(oX, oY);
                            }, 0);
                            if (i) 系统提示("调整图片尺寸成功");
                        });
                    });
                }, 0);
                break;
            case 功能图标[4]:
                blockHandle.setTimeout(() => {
                    屏幕截图();
                }, 0);
                break;
            case 功能图标[5]:
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
                        window.imgList.adapter.notifyDataSetChanged();
                    }, 100);
                }, 0);
                break;
            case 功能图标[6]:
                window.canvas.removeAllListeners();
                exit();
                break;
        }
    });

    var windowX, windowY, downTime, x, y, maxSwipeW, maxSwipeH, swipe;
    window.windowOperate.setOnTouchListener(function(view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window.getX();
                windowY = window.getY();
                downTime = new Date().getTime();
                maxSwipeW = screenAttribute.w - window.getWidth();
                maxSwipeH = screenAttribute.h - window.getHeight();
                swipe = false;
                return true;
            case event.ACTION_MOVE:
                let sX = windowX + (event.getRawX() - x);
                let sY = windowY + (event.getRawY() - y);
                if (sX <= 0) sX = 0;
                if (sY <= 0) sY = 0;
                if (sX >= maxSwipeW) sX = maxSwipeW;
                if (sY >= maxSwipeH) sY = maxSwipeH;
                if (new Date().getTime() - downTime > 100 && Math.abs(event.getRawY() - y) > 10 && Math.abs(event.getRawX() - x) > 10 || swipe) {
                    /* 第一次滑动时震动30ms，并且将swipe置为true以忽略滑动条件避免卡顿*/
                    if (swipe == false)(device.vibrate(30), swipe = true);
                    layoutAttribute.whole.x = sX;
                    layoutAttribute.whole.y = sY;
                    window.setPosition(sX, sY);
                };
                return true;
            case event.ACTION_UP:
                if (Math.abs(event.getRawY() - y) < 10 && Math.abs(event.getRawX() - x) < 10) {
                    if (layoutAttribute.homepage.show) {
                        layoutAttribute.homepage.show = false;
                        blockHandle.setTimeout(() => {
                            隐藏主界面();
                        }, 0);
                    } else {
                        layoutAttribute.homepage.show = true;
                        blockHandle.setTimeout(() => {
                            展开主界面();
                        }, 0);
                    };
                }
                return true;
        }
        return true;
    });

    var clickScreenX, clickScreenY; //记录手指按下时相对于屏幕的坐标
    var clickImgTopX, clickImgTopY; //记录手指按下时图片的顶点坐标
    var clickImgDeviationX, clickImgDeviationY; //记录手指按下时图片偏离中心的坐标
    var aim = ""; //记录手指按下时点击的焦点
    var pointerX1, pointerY1, pointerX2, pointerY2, pointer; //记录手指按下时指针的坐标
    window.canvas.setOnTouchListener(function(view, event) {
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
                            隐藏悬浮窗((oX, oY) => {
                                复制点色数据(str, (i) => {
                                    blockHandle.setTimeout(() => {
                                        显示悬浮窗(oX, oY, () => {});
                                    }, 0);
                                    if (i) 系统提示("复制点色数据成功");
                                });
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

    window.zoom.setOnSeekBarChangeListener({
        onProgressChanged: function(seekbar, p, fromUser) {
            if (!fromUser) return;
            let ratio = Number(window.zoom.getProgress().toString());
            ratio = (0.3 + (ratio * 0.1) * (ratio * 0.002)).toFixed(2);
            window.ratio.setText(ratio + "X");
            if (imgList[pictureAttribute.image.select].img) 缩放图片(ratio);
        }
    });

    window.imgList.on("item_bind", function(itemView, itemHolder) {
        itemView.sn.on("click", function() {
            选中图片(itemHolder.position);
            pictureAttribute.image.deviationX = 0;
            pictureAttribute.image.deviationY = 0;
            if (imgList[itemHolder.position].img) 缩放图片(0.3);
            window.imgList.adapter.notifyDataSetChanged();
        });
    });

    window.optionList.on("item_click", function(icon) {
        if (icon != optionList[6]) {
            if (!imgList[pictureAttribute.image.select].img) {
                系统提示("请先截图才能执行图色操作");
                return;
            };
        }
        switch (icon) {
            case optionList[0]:
                if (layoutAttribute.rightList.show) {
                    window.rightList.setVisibility('8');
                    layoutAttribute.rightList.show = false;
                } else {
                    window.rightList.setVisibility('0');
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
                    blockHandle.setTimeout(() => {
                        隐藏悬浮窗((oX, oY) => {
                            dialogs.singleChoice("点色测试", ["多点找色", "多点比色"], 0, (i) => {
                                blockHandle.setTimeout(() => {
                                    系统提示("正在处理...");
                                    显示悬浮窗(oX, oY);
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
                        blockHandle.setTimeout(() => {
                            隐藏悬浮窗((oX, oY) => {
                                保存点色数据((i) => {
                                    blockHandle.setTimeout(() => {
                                        显示悬浮窗(oX, oY, () => {});
                                    }, 0);
                                    if (i) 系统提示("保存点色数据成功");
                                });
                            });
                        }, 0);
                    } else {
                        系统提示("取2个以上点才能保存");
                    }
                } else {
                    if (smallImg) {
                        blockHandle.setTimeout(() => {
                            隐藏悬浮窗((oX, oY) => {
                                保存图片((i) => {
                                    blockHandle.setTimeout(() => {
                                        显示悬浮窗(oX, oY, () => {});
                                    }, 0);
                                    if (i) 系统提示("保存图片成功");
                                });
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
                            隐藏悬浮窗((oX, oY) => {
                                复制点色数组((i) => {
                                    blockHandle.setTimeout(() => {
                                        显示悬浮窗(oX, oY, () => {});
                                    }, 0);
                                    if (i) 系统提示("复制点色数组成功");
                                });
                            });
                        }, 0);
                    } else {
                        系统提示("取2个以上点才能复制数组");
                    }
                } else {
                    if (smallImg) {
                        blockHandle.setTimeout(() => {
                            隐藏悬浮窗((oX, oY) => {
                                复制图片base64编码((i) => {
                                    blockHandle.setTimeout(() => {
                                        显示悬浮窗(oX, oY, () => {});
                                    }, 0);
                                    if (i) 系统提示("复制图片base64编码成功");
                                });
                            });
                        }, 0);
                    } else {
                        系统提示("无法对空白图片进行base64编码");
                    }
                }
                break;
            case optionList[6]:
                File_selector(".png")

                //    系统提示("暂无功能:占位用");
                break;
        }
        window.optionList.adapter.notifyDataSetChanged();
    });

    window.清空.click(() => {
        colorList.splice(0, colorList.length);
    });

    window.colorList.on("item_bind", function(itemView, itemHolder) {
        itemView.delColor.on("click", function() {
            colorList.splice(itemHolder.position, 1);
        });
        itemView.点色.on("click", function() {
            var str = colorList[itemHolder.position].x + ',' + colorList[itemHolder.position].y + ',' + colorList[itemHolder.position].color;
            blockHandle.setTimeout(() => {
                隐藏悬浮窗((oX, oY) => {
                    复制点色数据(str, (i) => {
                        blockHandle.setTimeout(() => {
                            显示悬浮窗(oX, oY);
                        }, 0);
                        if (i) 系统提示("复制点色数据成功");
                    });
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

function 屏幕截图() {
    隐藏悬浮窗((oX, oY) => {
        sleep(100);
        let img = captureScreen();
        imgList[pictureAttribute.image.select].img = images.copy(img);
        移动图片(pictureAttribute.image.deviationY, pictureAttribute.image.deviationX);

        pictureAttribute.image.deviationX = 0;
        pictureAttribute.image.deviationY = 0;
        选中图片(pictureAttribute.image.select);
        缩放图片(0.3);

        显示悬浮窗(oX, oY, () => {});
        img.recycle();
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
        window.imgList.adapter.notifyDataSetChanged();
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

function 设置图片尺寸(callback) {
    let view = ui.inflate(
        <vertical padding="16 0">
            <horizontal margin="22px 0">
                <text text="W:" />
                <input id="X" w="150px"/>
                <text text="H:" />
                <input id="Y" w="150px"/>
            </horizontal>
        </vertical>,
        null, false);

    view.X.setText(storage.get("inputX", "720") + "");
    view.Y.setText(storage.get("inputY", "1280") + "");

    dialogs.build({
        customView: view,
        title: "设置图片尺寸",
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
                <input id="color" w="300px"/>
                <text text="范围:" />
                <input id="about" w="100px"/>
            </horizontal>
        </vertical>,
        null, false);

    view.color.setText(nowColor.colorString);
    view.about.setText(storage.get("about", "8") + "");

    dialogs.build({
        customView: view,
        title: "图片二值化",
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
            let img = images.interval(imgList[pictureAttribute.image.select].img, color, about);
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
        window.smImg.setSource(smallImg);
    } catch (e) {
        系统提示("面积过小,无法继续裁剪");
    };
};

function 复制点色数据(str, callback) {
    let view = ui.inflate(
        <vertical padding="{{zoom(50)}}px 0">
            <input id="str" w="*"/>
        </vertical>,
        null, false);

    view.str.setText(str);

    dialogs.build({
        customView: view,
        title: "复制点色数据",
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

function 保存点色数据(callback) {
    dialogs.build({
        title: "请输入点阵名称",
        inputPrefill: "点阵1",
        negative: "取消",
        positive: "保存",
        canceledOnTouchOutside: false,
    }).on("input", (name) => {
        if (name == null || name == "") {
            系统提示("名称不可为空");
        } else {
            var path = storage.get("储存路径") + "点色/" + name + ".txt"
            files.createWithDirs(path);
            let colorArr = {};
            colorArr["多点找色"] = 转多点找色数组();
            colorArr["多点比色"] = 转多点比色数组();
            var str = JSON.stringify(colorArr);
            files.write(path, str);
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
        positive: "保存",
        canceledOnTouchOutside: false,
    }).on("input", (name) => {
        if (name == null || name == "") {
            系统提示("名称不可为空");
        } else {
            var path = storage.get("储存路径") + name + ".png"
            files.createWithDirs(path);
            images.saveImage(smallImg, path);
        };
        callback(true);
    }).on("negative", () => {
        callback(false);
    }).show();
};

function 缩放指针(xy, x, y) {
    let edge = zoom(60);
    if (xy == "xy2") {
        x < window.canvas.getWidth() - edge && x - pictureAttribute.pointer.x1 > 100 ? pictureAttribute.pointer.x2 = x : x - pictureAttribute.pointer.x1 > 100 ? pictureAttribute.pointer.x2 = window.canvas.getWidth() - edge : pictureAttribute.pointer.x2 = pictureAttribute.pointer.x1 + 100;
        y < window.canvas.getHeight() - edge && y - pictureAttribute.pointer.y1 > 100 ? pictureAttribute.pointer.y2 = y : y - pictureAttribute.pointer.y1 > 100 ? pictureAttribute.pointer.y2 = window.canvas.getHeight() - edge : pictureAttribute.pointer.y2 = pictureAttribute.pointer.y1 + 100;
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
    x > 0 + edge && x + w < window.canvas.getWidth() - edge ? pictureAttribute.pointer.x1 = x : x + w < window.canvas.getWidth() - edge ? pictureAttribute.pointer.x1 = 0 + edge : pictureAttribute.pointer.x1 = window.canvas.getWidth() - edge - w;
    y > 0 + edge && y + h < window.canvas.getHeight() - edge ? pictureAttribute.pointer.y1 = y : y + h < window.canvas.getHeight() - edge ? pictureAttribute.pointer.y1 = 0 + edge : pictureAttribute.pointer.y1 = window.canvas.getHeight() - edge - h;
    pictureAttribute.pointer.x2 = pictureAttribute.pointer.x1 + w;
    pictureAttribute.pointer.y2 = pictureAttribute.pointer.y1 + h;
    pictureAttribute.pointer.focusX = pictureAttribute.pointer.x1 + (pictureAttribute.pointer.x2 - pictureAttribute.pointer.x1) / 2;
    pictureAttribute.pointer.focusY = pictureAttribute.pointer.y1 + (pictureAttribute.pointer.y2 - pictureAttribute.pointer.y1) / 2;
};

function 取图模式() {
    pattern = "getImg";
    pictureAttribute.pointer.operateRadius = 40;
    pictureAttribute.showFrame.region = pictureAttribute.regionShow.showFrame;
    window.colorRecord.setVisibility('8');
    window.smallImg.setVisibility('0');
    optionList[1] = "@drawable/ic_crop_free_black_48dp";
};

function 取色模式() {
    pattern = "getColor";
    pictureAttribute.pointer.operateRadius = 0;
    pictureAttribute.showFrame.region = pictureAttribute.colorShow.showFrame;
    window.smallImg.setVisibility('8');
    window.colorRecord.setVisibility('0');
    optionList[1] = "@drawable/ic_colorize_black_48dp";
};

function 隐藏悬浮窗(callback) {
    const fps = 20;
    let aim = [0, 0];
    let edge = 计算边距();
    let small = 求最小值([edge.top, edge.bottom, edge.left, edge.right]);
    if (small[0] == 0) {
        aim = [window.getX(), 0 - window.getHeight()];
    } else if (small[0] == 1) {
        aim = [window.getX(), screenAttribute.h];
    } else if (small[0] == 2) {
        aim = [0 - window.getWidth(), window.getY()];
    } else if (small[0] == 3) {
        aim = [screenAttribute.w, window.getY()];
    } else {
        aim = [0 - window.getWidth(), window.getY()];
    };
    let fpsX = (aim[0] - window.getX()) / fps;
    let fpsY = (aim[1] - window.getY()) / fps;
    let nowX = window.getX();
    let nowY = window.getY();
    for (let i = 0; i <= fps; i++) {
        let x = nowX + fpsX * i;
        let y = nowY + fpsY * i;
        ui.post(() => {
            window.setPosition(x, y);
        });
        sleep(150 / fps);
    };
    if (callback) callback(nowX, nowY);
};

function 显示悬浮窗(aimX, aimY, callback) {
    const fps = 20;
    let nowX = window.getX();
    let nowY = window.getY();
    let fpsX = (aimX - window.getX()) / fps;
    let fpsY = (aimY - window.getY()) / fps;
    for (let i = 0; i <= fps; i++) {
        let x = nowX + fpsX * i;
        let y = nowY + fpsY * i;
        ui.post(() => {
            window.setPosition(x, y);
        });
        sleep(150 / fps);
    };
    if (callback) callback(true);
};

function 隐藏主界面(callback) {
    ui.post(() => {
        旋转动画(window.windowOperate, 720, 'z', 1200);
    });
    const fps = 10;
    var fpsH = layoutAttribute.whole.h / fps;
    var fpsW = layoutAttribute.whole.w / fps;
    var fpsX = (window.getX() - layoutAttribute.whole.x) / fps;
    var fpsY = (window.getY() - layoutAttribute.whole.y) / fps;
    for (let i = fps - 1; i >= 0; i--) {
        let h = layoutAttribute.windowOperate.h + fpsH * i;
        let w = layoutAttribute.windowOperate.w + fpsW * i;
        let x = layoutAttribute.whole.x + fpsX * i;
        let y = layoutAttribute.whole.y + fpsY * i;
        ui.post(() => {
            window.setPosition(x, y);
            window.setSize(w, h);
        });
        sleep(200 / fps);
    }
    ui.post(() => {
        window.homepage.setVisibility('8');
    });
    if (callback) callback(true);
}

function 展开主界面(callback) {
    ui.post(() => {
        旋转动画(window.windowOperate, -720, 'z', 1200);
        window.homepage.setVisibility('0');
    });
    var fps = 10;
    var fpsH = (layoutAttribute.whole.h - layoutAttribute.windowOperate.h) / fps;
    var fpsW = (layoutAttribute.whole.w - layoutAttribute.windowOperate.w) / fps;
    for (let i = fps - 1; i >= 0; i--) {
        let h = layoutAttribute.whole.h - fpsH * i;
        let w = layoutAttribute.whole.w - fpsW * i;
        let x = window.getX() + w > screenAttribute.w ? screenAttribute.w - w : layoutAttribute.whole.x;
        let y = window.getY() + h > screenAttribute.h ? screenAttribute.h - h : layoutAttribute.whole.y;
        ui.post(() => {
            window.setPosition(x, y);
            window.setSize(w, h);
        });
        sleep(200 / fps);
    }
    if (callback) callback(true);
}

function 悬浮窗复位() {
    let fps = 60;
    var aim = [layoutAttribute.whole.iniX, layoutAttribute.whole.iniY];
    let nowXY = [window.getX(), window.getY()];
    let fpsXY = [(aim[0] - window.getX()) / fps, (aim[1] - window.getY()) / fps];
    for (var i = 0; i <= fps; i++) {
        let sX = nowXY[0] + fpsXY[0] * i;
        let sY = nowXY[1] + fpsXY[1] * i;
        ui.run(() => {
            window.setPosition(sX, sY);
        });
        sleep(100 / fps);
    };
    layoutAttribute.whole.x = window.getX();
    layoutAttribute.whole.y = window.getY();
};

function 计算边距() {
    return {
        top: window.getY(),
        bottom: screenAttribute.h - (window.getY() + window.getHeight()),
        left: window.getX(),
        right: screenAttribute.w - (window.getX() + window.getWidth()),
    };
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
            blockHandle.setTimeout(() => {
                悬浮窗复位();
            }, 0);
        };
    }, 100);
};

function 获取屏幕方向() {
    let config = context.getResources().getConfiguration();
    let ori = config.orientation;
    if (ori == config.ORIENTATION_LANDSCAPE) {
        return "横屏";
    } else if (ori == config.ORIENTATION_PORTRAIT) {
        return "竖屏";
    };
};

function 计算状态栏高度() {
    var w = floaty.rawWindow(
        <frame w="{{device.width}}px" h="{{device.height}}px" />
    );
    ui.run(function() {
        w.setTouchable(false);
    });
    var 显示分辨率 = [w.getWidth(),
        w.getHeight()
    ];
    var 物理分辨率 = [device.width,
        device.height
    ];
    var 状态栏高度 = 物理分辨率[1] - 显示分辨率[1];
    w.close();
    return 状态栏高度;
};

function zoom(n) {
    return Math.floor((device.width / 1080) * n);
};