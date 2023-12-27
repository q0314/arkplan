importClass(android.animation.ObjectAnimator);
importClass(android.content.Context);
importClass(android.widget.AdapterView);
importClass(android.content.ContextWrapper);
importClass(android.view.WindowManager)

importClass(android.net.Uri);
importClass(android.webkit.WebSettings);
importClass(android.webkit.ValueCallback);
var settings;


//启动一个线程用于处理可能阻塞UI线程的操作
var blockHandle = threads.start(function() {
    setInterval(() => {}, 1000);
});
let tool = require("./modules/tool.js");

var setting = tool.readJSON("configure");
var progra;
//图标运行状态,是否手动暂停
var eliminate = true;
let size = setting.Floaty_size;
size = Number(size);
if (size == undefined || isNaN(size) == true || size == 0) {
    size = 0.75;
}

//设置悬浮窗初始属性{!
var layoutAttribute = {
    //设置悬浮窗左上角小圆点的尺寸
    windowOperate: {
        w: zoom(75),
        h: zoom(75)
    },
    //设置悬浮窗的尺寸和启动时的初始位置
    whole: {
        w: zoom(1050),
        h: zoom(1000),
        iniX: zoom(30),
        iniY: zoom(130)
    },
    //设置标题栏的名称及高度
    title: {
        name: "明日计划",
        h: zoom(75)
    },
    //用于程序运行时判断布局是否显示
    homepage: {
        show: true
    },
    //设置布局的配色
    setColor: {
        bg: setting.bg,
        theme: setting.theme,
        toast: setting.toast
    },
};
//更准确的屏幕属性
var screenAttribute = {
    w: device.width,
    h: device.height,
    direction: 获取屏幕方向(),
};

//设置顶部功能键图标
var 功能图标 = [
    "file://res/to_left.png",
    "file://res/to_right.png",
    "file://res/ic_refresh.webp",
    "file://res/ic_share.webp",
    "file://res/zhuye.webp",
    "file://res/ic_signout.webp",
];

var window = 创建悬浮窗();


function record(text, time, log) {
    try {
        Combat_report
        if (Combat_report == undefined) {
            return;
        }
    } catch (err) {
        return
    }
    Combat_report.record(text, time, log);
}

//延迟1000毫秒再监听悬浮窗，否则可能出现监听失败的情况
setTimeout(() => {
    旋转监听();

    悬浮窗监听(window);
}, 800);

function 创建悬浮窗() {
    var window = floaty.rawWindow(
        // var window = floaty.window(
        <frame w="auto" id="parent" h="auto">
            <vertical id="homepage" w="{{layoutAttribute.whole.w}}px" h="{{layoutAttribute.whole.h}}px" bg="{{layoutAttribute.setColor.bg}}">
                <frame id="title" w="{{layoutAttribute.whole.w - layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.title.h}}px" layout_gravity="right">
                    <text id="name" marginLeft="{{zoom(25)}}px" w="{{zoom(100)}}px" text="wiki" textColor="{{layoutAttribute.setColor.theme}}" textSize="{{zoom(40)}}px" gravity="center_vertical"/>
                    <horizontal w="*" gravity="center|right" marginRight="15">
                       <img id="daxiao" w="{{zoom(75)}}px" h="*" margin="8 0 2 0 " tint="{{layoutAttribute.setColor.theme}}" src="@drawable/ic_crop_free_black_48dp" visibility="gone"/>
                        
                        <grid id="功能" w="auto" h="auto" spanCount="6" layout_gravity="right">
                            <img  text="1" w="{{zoom(60)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" margin="8 0" />
                        </grid>
                        <spinner id="工具" background="file://res/ic_bookmark.webp" marginLeft="8"  spinnerMode="dropdown" 
                        backgroundTint="{{layoutAttribute.setColor.theme}}" w="{{zoom(60)}}px" h="{{zoom(60)}}px"  popupBackground="#dcdcdc" dropDownHorizontalOffset="{{zoom(-300)}}px" visibility="gone"/>
                    </horizontal>
                    
                </frame>
                <vertical id="xxbr" padding="{{zoom(5)}}px" bg="#00BFFF" h="*" visibility="visible">
                    <progressbar id="progress" visibility="gone" h="{{zoom(5)}}px" bg="#00BFFF" indeterminate="true" layout_gravity="top" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal"/>
                    <frame layout_weight="1">
                        <webview id='webview' />
                    </frame>
                </vertical>
            </vertical>
            <card w="{{layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.windowOperate.h}}px" cardCornerRadius="{{zoom(40)}}px" backgroundTint="{{layoutAttribute.setColor.bg}}" cardElevation="0">
                <img id="windowOperate" w="*" h="*" src="@drawable/ic_ac_unit_black_48dp" tint="{{layoutAttribute.setColor.theme}}"/>
            </card>
        </frame>
    );
    if (device.brand != "HUAWEI" && device.brand != "HONOR"&& device.brand != "NZONE") {
        旋转动画(window.windowOperate, 720, 'z', 2000);
    } else {
        log("HUAWEI && HONOR && Nzone");
    }
    sleep(50)

    window.setPosition(layoutAttribute.whole.iniX, layoutAttribute.whole.iniY);
    return window;
}

function 悬浮窗监听(window) {
    //初始化悬浮窗及悬浮窗操作对象
    ui.post(() => {
        window.setTouchable(true);
        window.功能.setDataSource(功能图标);
        window.工具.setVisibility(0);
        window.daxiao.setVisibility(0)
        layoutAttribute.whole.x = window.getX();
        layoutAttribute.whole.y = window.getY();
        window.webview.loadUrl("https://prts.wiki/w/首页");

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
                /*if (获取屏幕方向() == "竖屏") {
                    maxSwipeW = screenAttribute.w - window.getWidth();
                    maxSwipeH = screenAttribute.h - window.getHeight();
                } else {
                    maxSwipeW = screenAttribute.h - window.getWidth();
                    maxSwipeH = screenAttribute.w - window.getHeight();
                }*/

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
                    ui.run(function() {
                        window.setPosition(sX, sY);
                    })

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
                };
                return true;
        };
        return true;
    });
    window.daxiao.on("click", function() {
        confirm("是否切换悬浮窗大小为" + (获取屏幕方向() == "竖屏" ? "横屏" : "竖屏") + "？","介绍：内置智能调节悬浮浏览器大小，但是由于无法准确获取屏幕方向，该功能可能失效，请手动切换。")
        .then(clear => {
                if (clear) {
                    if (获取屏幕方向() == "横屏") {
                        screenAttribute.direction = "竖屏";
                        layoutAttribute.whole.w = zoom(900)
                        layoutAttribute.whole.h = zoom(1200)
                    } else {
                        screenAttribute.direction = "横屏";
                        layoutAttribute.whole.w = zoom(1200)
                        layoutAttribute.whole.h = zoom(1000)
                    }
                    ui.run(()=>{
                    window.homepage.attr("w", layoutAttribute.whole.w + "px");
                    window.homepage.attr("h", layoutAttribute.whole.h + "px");
                    window.title.attr("w", layoutAttribute.whole.w - layoutAttribute.windowOperate.w + "px");
                    blockHandle.setTimeout(() => {
                        展开主界面();
                    }, 0);
                    })
                }
        })
            
    })
    
    let delay = true;
    window.功能.on("item_click", function(icon) {
        switch (icon) {
            case 功能图标[0]:
                ui.run(() => {
                    window.webview.goBack();
                });
                break;
            case 功能图标[1]:
                ui.run(() => {
                    window.webview.goForward();
                });
                break;
            case 功能图标[2]:
                ui.run(() => {
                    window.webview.reload();
                });
                toast("刷新")
                break;
            case 功能图标[3]:
                ui.run(() => {
                    blockHandle.setTimeout(() => {
                    layoutAttribute.homepage.show = false;
                    隐藏主界面();
                }, 0);
                    var Tw = window.webview.getTitle();
                    var context = String(Tw) + "：\n" + window.webview.url
                    app.startActivity({
                        action: "android.intent.action.SEND",
                        type: "text/*",
                        extras: {
                            "android.intent.extra.TEXT": context
                        }
                    });
                })
                break;
            case 功能图标[4]:
                let web_set = storages.create("configure").get("web_set") //.toString()
                web_set.new_url = window.webview.url
                storages.create("configure").put("web_set", web_set)
                engines.execScriptFile("./main.js")
                blockHandle.setTimeout(() => {
                    layoutAttribute.homepage.show = false;
                    隐藏主界面();
                }, 0);
                break;
            case 功能图标[5]:
                toast("关闭悬浮浏览器");
                exit()

                break;
        }

    });

    window.webview.on("touch_down", () => {
        window.requestFocus(); // window.webview.requestFocus();
    });


};
web_initialization();

function web_initialization() {
    ui.run(() => {
        myAdapterListener(window.工具, [
            "待添加..",
            "PRTS",
            "arkstory",
            "kokodayo",
            "干员培养表",
            "明日方舟工具箱",
            "企鹅物流数据统计",
            "明日方舟官网",
            "寻访记录分析"
        ])


        function myAdapterListener(spinner, dataList) {
            function setAdapter_gj(dataList) {
                let Options_menu = null;
                let adapter = JavaAdapter(android.widget.SpinnerAdapter, {
                    getCount: function() {
                        return dataList.length;
                    },
                    getItem: function(position) {
                        return dataList[position];
                    },
                    getItemId: function(position) {
                        return position;
                    },
                    getViewTypeCount: function() {
                        return 1;
                    },
                    getItemViewType: function(pos) {
                        return 0;
                    },
                    getDropDownView: function(position, convertView, parent) {
                        ui.run(function() {
                            if (!convertView) {
                                // let boxXml = <text textColor="#ff5722" paddingTop="34" gravity="center" textSize="20sp"></text>;
                                //展开菜单
                                let boxXml = (
                                    <frame>
                                                                    <TextView id="_text" padding="18px" gravity="center"
                                                                    textColor="#000000" textSize="16sp" />
                                                                </frame>
                                );
                                convertView = ui.inflate(boxXml);
                                convertView.attr("bg", "#00ff0000");
                                // convertView.getChildAt(0).setBackgroundDrawable(drawable);
                            }
                            let item = dataList[position];
                            convertView.getChildAt(0).setText(item);
                            Options_menu = true;
                        })

                        return convertView;
                    },
                    getView: function(position, convertView, parent) {
                        ui.run(function() {
                            if (!convertView) {
                                //在选中确认之后显示的控件?
                                let boxXml =
                                    <text id="name" textColor="#00000000"
                                                            gravity="center" textSize="2sp">
                                                            </text>;
                                convertView = ui.inflate(boxXml);
                            }
                            //点击事件
                            // let item = dataList[position];
                            let r = parent.getSelectedItem();
                            //toast(item)
                            if (Options_menu) {
                                Options_menu = false;
                                switch (r) {
                                    case '浏览器打开':
                                        toast(r)
                                        log(window.webview.url)
                                        app.openUrl(window.webview.url)
                                        break;
                                    case 'PRTS':
                                        url = "https://prts.wiki/w/首页";
                                        window.webview.loadUrl(url);
                                        toast(r)
                                        break;
                                    case "少人wiki":
                                    url = "https://arkrec.com/";
                                    window.webview.loadUrl(url);
                                    break;
                                    case "干员培养表":
                                    url = "https://ark-nights.com/";
                                    window.webview.loadUrl(url);
                                    break;
                                case "kokodayo":
                                    url = "https://kokodayo.fun/";
                                    window.webview.loadUrl(url);
                                    break;
                                    case "arkstory":
                                    url = "https://arkstory.cc/story";
                                    window.webview.loadUrl(url);
                                    break;
                                    case '明日方舟工具箱':
                                        url = "https://arkn.lolicon.app";
                                        window.webview.loadUrl(url);
                                        toast(r)
                                        break;
                                    case '企鹅物流数据统计':
                                        url = "https://penguin-stats.cn";
                                        window.webview.loadUrl(url);
                                        toast(r)
                                        break;
                                    case '明日方舟官网':
                                        url = "https://ak.hypergryph.com/";
                                        window.webview.loadUrl(url);
                                        toast(r);
                                        break;
                                    case '寻访记录分析':
                                        url = "https://arkgacha.kwer.top/";
                                        window.webview.loadUrl(url);
                                        toast(r);
                                        break;
                                };
                            }
                        })
                        return convertView;

                    },
                });

                return adapter;
            }
            ui.run(function() {
                spinner.setAdapter(setAdapter_gj(dataList));
            })
        }

        settings = window.webview.getSettings();

        settings.setLoadsImagesAutomatically(true); // 是否自动加载图片
        settings.setDefaultTextEncodingName("UTF-8"); // 设置默认的文本编码 UTF-8 GBK
        settings.setJavaScriptEnabled(true); // 设置是否支持js
        settings.setJavaScriptCanOpenWindowsAutomatically(true); // 设置是否允许js自动打开新窗口, window.open
        settings.setSupportZoom(true); // 是否支持页面缩放
        settings.setBuiltInZoomControls(true); // 是否出现缩放工具
        settings.setUseWideViewPort(true); // 容器超过页面大小时, 是否将页面放大到塞满容器宽度的尺寸
        settings.setLoadWithOverviewMode(true); // 页面超过容器大小时, 是否将页面缩小到容器能够装下的尺寸

        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.TEXT_AUTOSIZING); // 设置自适应屏幕的算法
        //settings.setAppCacheEnabled(false); // 是否启用app缓存
        //settings.setAppCachePath("/sdcard/aaa"); // app缓存文件路径
        settings.setAllowFileAccess(true); // 是否允许访问文件
        settings.setDatabaseEnabled(true); // 是否启用数据库
        settings.setDomStorageEnabled(true); // 是否本地存储
        let WebChromeClient = android.webkit.WebChromeClient;
        var webChromeClient = new JavaAdapter(WebChromeClient, {
            onShowFileChooser: function(webview, filePathCallback_, fileChooserParams) {
                filePathCallback = filePathCallback_
                toastLog("暂时无法通过悬浮窗选择文件")

                return true;
            },
            /*  onConsoleMessage: function(message) {
                  message.message && console.error("h5: " + message.message());
              },*/
        });
        window.webview.setWebChromeClient(webChromeClient);

    })

    function infile(path) {
        var uri = Uri.parse(path);
        let uriArr = java.lang.reflect.Array.newInstance(java.lang.Class.forName("android.net.Uri"), 1);
        uriArr[0] = uri;
        filePathCallback.onReceiveValue(uriArr);
        filePathCallback = null;
        return true
    }
}



function zoom(x) {
    var v;
    if (!setting.模拟器) {
        //  /2*0.9/520
        v = device.width / 2 * size / 420;
    } else {
        v = device.height / 2 * size / 420;
    }
    return parseInt(x * v)
    //  return Math.floor((device.width / 1080) * n);
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
    };
    ui.post(() => {
        window.homepage.setVisibility('8');
        window.disableFocus()
    });
    if (callback) callback(true);
};

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
    };
    if (callback) callback(true);
};

function 悬浮窗复位() {
    let fps = 60;
    var aim = [layoutAttribute.whole.iniX, layoutAttribute.whole.iniY];
    let nowXY = [window.getX(), window.getY()];
    let fpsXY = [(aim[0] - window.getX()) / fps, (aim[1] - window.getY()) / fps];
    let re = /\d+/;
    for (var i = 0; i <= fps; i++) {
        let sX = nowXY[0] + fpsXY[0] * i;
        let sY = nowXY[1] + fpsXY[1] * i;
        if (re.exec(aim[0] - window.getX()) < 10 && re.exec(aim[1] - window.getY()) < 5) {
            break
        }
        ui.run(() => {
            window.setPosition(sX, sY);
        })

        sleep(100 / fps);
    };
    layoutAttribute.whole.x = window.getX();
    layoutAttribute.whole.y = window.getY();
};

function 旋转动画(控件, 角度, 方向, 时间) {
    var animator = ObjectAnimator.ofFloat(控件, 方向 == 'x' ? 'rotationX' : 方向 == 'y' ? 'rotationY' : 'rotation', 0, 角度, 角度);
    animator.setDuration(时间);
    animator.start();
};

function 旋转监听() {
    //screenAttribute.direction == "横屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
    setInterval(() => {
        let getDirection = 获取屏幕方向();
        if (getDirection != screenAttribute.direction) {
            screenAttribute.direction = getDirection;
            // screenAttribute.direction == "竖屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
            threads.start(function() {
                悬浮窗复位();
            })
        };
    }, 1000);
};


function 获取屏幕方向() {

    if (context.resources.configuration.orientation == 2) {
        //横屏
        return "横屏";
    } else if (context.resources.configuration.orientation == 1) {
        //竖屏
        return "竖屏";
    }
};

setTimeout(function() {

    console.verbose("悬浮窗加载完成")

    function 重载悬浮窗() {

        try {
            if (device.brand != "HUAWEI") {
                ui.post(function() {
                    let parentParent = window.parent.parent //.parent//.parent;
                    let params = parentParent.getLayoutParams();
                    params.flags |= 0x1000;
                    // params.flags = 4136;
                    windowManager = context.getApplicationContext().getSystemService(context.WINDOW_SERVICE);
                    ui.run(function() {
                        windowManager.removeView(parentParent);
                        windowManager.addView(parentParent, params);
                    });
                })
            }
        } catch (err) {
            console.verbose("重载悬浮窗失败，可能非支持的设备!")
        }
    }
    let sto_mod = storages.create("modular");
    let mod_data = sto_mod.get("modular", []);
    for (let i = 0; i < mod_data.length; i++) {
        if (mod_data[i].id == "熄屏运行") {
            log("重载悬浮窗")
            重载悬浮窗()
            break;
        }
    }


}, 1500);