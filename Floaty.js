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
let gallery_info = JSON.parse(files.read("./mrfz/tuku/gallery_info.json"), (encoding = "utf-8"));
let tool = require("./modules/tool.js");
var setting = tool.readJSON("configure");
var progra;
//图标运行状态,是否手动暂停
var active_end = false;
let size = setting.Floaty_size;
size = Number(size);
if (size == undefined || isNaN(size) == true || size == 0) {
    size = 0.75;
}
let {
    dp2px,
    px2dp,
    iStatusBarHeight,
    createShape
} = require('./modules/__util__.js');

if (!Object.values) {
    /**
     * @param {Iterable|Object} o
     * @return {*[]}
     */
    Object.values = function(o) {
        if (o[Symbol['iterator']] !== undefined) {
            let _res = [];
            for (let v of o) {
                _res.push(v);
            }
            return _res;
        }
        return Object.keys(o).map(k => o[k]);
    };
};
//设置悬浮窗初始属性{!
var layoutAttribute = {
    //设置悬浮窗左上角小圆点的尺寸
    windowOperate: {
        w: zoom(75),
        h: zoom(75)
    },
    //设置悬浮窗的尺寸和启动时的初始位置
    whole: {
        w: zoom(650),
        h: zoom(240),
        iniX: zoom(65),
        iniY: zoom(140)
    },
    //设置标题栏的名称及高度a
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
    "@drawable/ic_pause_circle_outline_black_48dp",
    "file://./res/ic_Rational_exchange_black_48dp.png",
    "@drawable/ic_assignment_ind_black_48dp",
    "@drawable/ic_settings_applications_black_48dp",
    "@drawable/ic_power_settings_new_black_48dp",
];
var 操作图标 = [
    "file://res/to_left.png",
    "file://res/to_right.png",
    "file://res/ic_refresh.webp",
    "file://res/ic_share.webp",
    "file://res/zhuye.webp",
    "file://res/ic_signout.webp",
];
var optionList = [
    "@drawable/ic_border_outer_black_48dp",
    "@drawable/ic_language_black_48dp",
];

var window = 创建悬浮窗();

if (setting.作战汇报) {
    optionList[0] = "@drawable/ic_assignment_black_48dp";
    var Combat_report = require("./subview/Combat_report.js");
}

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
/**
 * 获取类内部私有变量
 * @param {*} javaObject
 * @param {*} name
 */
function getClassField(javaObject, name) {
    var field = javaObject.class.getDeclaredField(name);
    field.setAccessible(true);
    return field.get(javaObject);
}

function 创建悬浮窗() {
    var window = floaty.rawWindow(
        // var window = floaty.window(
        <frame w="auto" id="parent" h="auto">
            <vertical id="homepage" w="{{layoutAttribute.whole.w}}px" h="{{layoutAttribute.whole.h}}px" bg="{{layoutAttribute.setColor.bg}}">
                <frame id="title" w="{{layoutAttribute.whole.w - layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.title.h}}px" layout_gravity="right">
                    <text id="name" marginLeft="{{zoom(25)}}px" w="{{zoom(460)}}px" text="加载中..." textColor="{{layoutAttribute.setColor.theme}}" textSize="{{zoom(40)}}px" gravity="left|center" />
                    <horizontal w="*" gravity="right" id="operation" >
                        <grid id="功能" w="auto" h="auto" spanCount="5" layout_gravity="right">
                            <img text="1" w="{{zoom(75)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                        </grid>
                    </horizontal>
                    <horizontal w="*" gravity="right|center" id="operation2" visibility="gone">
                        <img id="daxiao" w="{{zoom(75)}}px" h="*" margin="4 0 2 0 " tint="{{layoutAttribute.setColor.theme}}" src="@drawable/ic_crop_free_black_48dp" />
                        
                        <grid id="操作" w="auto" h="auto" spanCount="6" layout_gravity="right">
                            <img text="1" w="{{zoom(60)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" margin="8 0" />
                        </grid>
                        <spinner id="工具" background="file://res/ic_bookmark.webp" margin="8 0" spinnerMode="dropdown" backgroundTint="{{layoutAttribute.setColor.theme}}" w="{{zoom(60)}}px" h="{{zoom(60)}}px" popupBackground="#dcdcdc" dropDownHorizontalOffset="{{zoom(-300)}}px" />
                    </horizontal>
                </frame>
                <frame id="xxbj" w="*" h="*">
                    <text id="tos" text="状态：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="top" lines="1" />
                    <text id="tod" text="行动：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="center" lines="1" />
                    <text id="tof" text="理智：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="bottom" lines="1" />
                    <horizontal id="Material_Science" w="*" h="20" marginLeft="-3" layout_gravity="bottom">
                        
                    </horizontal>
                    <frame w="auto" h="auto" marginRight="{{zoom(3)}}px" layout_gravity="center_vertical|right">
                        <list id="optionList" w="*" h="auto">
                            <img id="option" w="{{zoom(70)}}px" h="{{zoom(80)}}px" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                        </list>
                    </frame>
                </frame>
                <vertical id="xxbr" padding="{{zoom(5)}}px" bg="#00BFFF" h="0px" visibility="gone">
                    <progressbar id="progress" visibility="gone" h="{{zoom(5)}}px" bg="#00BFFF" indeterminate="true" layout_gravity="top" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                    <frame layout_weight="1">
                        <webview id='webview' />
                    </frame>
                </vertical>
            </vertical>
            <card w="{{layoutAttribute.windowOperate.w}}px" h="{{layoutAttribute.windowOperate.h}}px" cardCornerRadius="{{zoom(40)}}px" backgroundTint="{{layoutAttribute.setColor.bg}}" cardElevation="0">
                <img id="windowOperate" w="*" h="*" src="@drawable/ic_ac_unit_black_48dp" tint="{{layoutAttribute.setColor.theme}}" />
            </card>
        </frame>
    );
    if (device.brand != "HUAWEI" && device.brand != "HONOR" && device.brand != "NZONE") {
        旋转动画(window.windowOperate, 720, 'z', 2000);
    } else {
        log("HUAWEI && HONOR && Nzone");
    }
    sleep(50)
    window.setPosition(layoutAttribute.whole.iniX, layoutAttribute.whole.iniY);

    /* threads.start(function() {
         let i = window.getX();
          for (let iy = window.getY(); iy < layoutAttribute.whole.iniY; iy++) {
             if(i < layoutAttribute.whole.iniX){
             i = i + 0.5;
             }
             sleep(8)
             ui.post(() => {
                 window.setPosition(i, iy);
             }, 1)
         }
     })*/

    /* if (params.flags == 83887656) {
         log("当前可以触摸, 修改为不可触摸");
         params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
         // params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
     } else if (params.flags == 83887672) {
         log("当前不可以触摸, 修改为可触摸");
         params.flags &= ~WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
     } else {
         //  throw new Error("params.flags 未知数: " + params.flags);
     }
     params.flags |= WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH
    params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
     */
    //悬浮窗待在屏幕里面
    //let WindowManager = android.view.WindowManager;
    let mWindow = getClassField(window, 'mWindow');
    let params = mWindow.getWindowLayoutParams();
    params.flags &= ~WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
    ui.run(function() {
        mWindow.updateWindowLayoutParams(params);
    });
    return window;
}

var sto_mod = storages.create("modular");
//sto_mod.clear()
var mod_data = sto_mod.get("modular", []);

function 悬浮窗监听(window) {
    //初始化悬浮窗及悬浮窗操作对象
    ui.post(() => {
        window.setTouchable(true);
        window.操作.setDataSource(操作图标);
        window.功能.setDataSource(功能图标)
        window.optionList.setDataSource(optionList);
        layoutAttribute.whole.x = window.getX();
        layoutAttribute.whole.y = window.getY();
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
                }
                */

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
                        blockHandle.setTimeout(() => {
                            隐藏主界面();
                        }, 0);
                    } else {

                        blockHandle.setTimeout(() => {
                            展开主界面();
                        }, 0);
                    };
                };
                return true;
        };
        return true;
    });

    if (mod_data[0] != undefined) {
        window.name.on("click", () => {
            mod_data = sto_mod.get("modular", []);
            let mod = require("./subview/modular_list.js");
            mod.create_modular(mod_data, function(i) {
                //  console.verbose("储存")
                sto_mod.put("modular", mod_data);
                mod_data = sto_mod.get("modular")
                mod = null;
            })
        });
    }
    window.tof.longClick(() => {
        tool.writeJSON("已兑理智", 0);
        tool.writeJSON("理智", 0);
        ui.run(function() {
            window.tof.setText("理智：已兑" + setting.已兑理智 + "次&上限" + setting.理智 + "次");
        });
        toastLog("已通过悬浮窗清除兑换理智上限次数");
    })
    window.daxiao.on("click", function() {
        confirm("是否切换悬浮窗大小为" + (获取屏幕方向() == "竖屏" ? "横屏" : "竖屏") + "？", "介绍：内置智能调节悬浮浏览器大小，但是由于无法准确获取屏幕方向，该功能可能失效，请手动切换。")
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
                    ui.run(() => {
                        window.homepage.attr("w", layoutAttribute.whole.w + "px");
                        window.homepage.attr("h", layoutAttribute.whole.h + "px");
                        window.title.attr("w", layoutAttribute.whole.w - layoutAttribute.windowOperate.w + "px");
                        window.webview.reload();
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
                if (delay) {
                    if (功能图标[0] == "@drawable/ic_pause_circle_outline_black_48dp") {
                        active_end = true;
                        threads.start(暂停);
                        $ui.post(() => {
                            window.tos.setText("状态：主程序暂停中");
                        }, 200)
                    } else {
                        threads.start(继续);
                    };
                    delay = false;
                    setTimeout(function() {
                        delay = true;
                    }, 1000);
                } else {
                    toast("你的操作太快啦");
                }
                break;
            case 功能图标[1]:
                执行次数()
                /* setting = tool.readJSON("configure");
                 //   Executionsettings = rewriteView.implement.getSelectedItemPosition();

                 rewriteDialogs.show();*/
                break;
            case 功能图标[2]:
                $ui.post(() => {
                    if (tool.script_locate("progra")) {
                        tool.writeJSON("侧边", "公招");
                        return;
                    };
                    tool.writeJSON("侧边", "公招");
                    blockHandle.setTimeout(() => {

                        隐藏主界面();
                    }, 0);
                    继续();
                }, 200);
                break;
            case 功能图标[3]:
                主页设置()
                break;
            case 功能图标[4]:

                active_end = true;
                暂停(true);
                $settings.setEnabled('foreground_service', false);
                threads.shutDownAll();
                window.close()
                toastLog("主动关闭PRTS辅助及悬浮窗");

                setTimeout(function() {
                    let execution = engines.all();
                    for (let i = 0; i < execution.length; i++) {
                        if (execution[i].getSource().toString().indexOf("PRTS辅助") > -1) {
                            toastLog("强行终止PRTS辅助")
                            execution[i].forceStop()
                        }
                    }
                    exit();
                }, 1500);

                break;
        }

    });
    window.操作.on("item_click", function(icon) {
        switch (icon) {
            case 操作图标[0]:
                ui.run(() => {
                    window.webview.goBack();
                });
                break;
            case 操作图标[1]:
                ui.run(() => {
                    window.webview.goForward();
                });
                break;
            case 操作图标[2]:
                ui.run(() => {
                    window.webview.reload();
                });
                toast("刷新")
                break;
            case 操作图标[3]:
                ui.run(() => {
                    blockHandle.setTimeout(() => {

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
            case 操作图标[4]:
                let web_set = storages.create("configure").get("web_set") //.toString()
                web_set.new_url = window.webview.url
                storages.create("configure").put("web_set", web_set)
                engines.execScriptFile("./main.js")
                ui.run(() => {
                    window.operation.setVisibility(0);
                    window.operation2.setVisibility(8);
                    window.disableFocus();
                    //window.webview.loadUrl("");
                    layoutAttribute.whole.w = zoom(650)
                    layoutAttribute.whole.h = zoom(240)
                    window.homepage.attr("w", layoutAttribute.whole.w + "px")
                    window.homepage.attr("h", layoutAttribute.whole.h + "px");
                    window.xxbj.setVisibility(0);
                    window.xxbr.attr("visibility", "gone");
                    window.title.attr("w", layoutAttribute.whole.w - layoutAttribute.windowOperate.w + "px");
                    switch (setting.执行) {
                        case "常规":
                            window.name.setText("行动基建");
                            break;
                        case "行动":
                            window.name.setText("行动作战");
                            break;
                        case "基建":
                            window.name.setText("基建收菜");
                            break;
                        case "剿灭":
                            window.name.setText("剿灭作战");
                            break;
                        case "上次":
                            window.name.setText("上次作战");
                            break;
                        case "定时剿灭":
                            window.name.setText("定时剿灭");
                            break;
                        case "自定义模块":
                            window.name.setText("明日计划");
                            break;
                        default:
                            window.name.setText("明日计划");
                            break;
                    };

                });

                blockHandle.setTimeout(() => {

                    隐藏主界面();
                }, 0);

                break;
            case 操作图标[5]:
                toastLog("关闭悬浮浏览器");
                ui.run(() => {
                    window.operation.setVisibility(0);
                    window.operation2.setVisibility(8);
                    window.disableFocus()
                    window.webview.loadUrl("")
                    layoutAttribute.whole.w = zoom(650)
                    layoutAttribute.whole.h = zoom(240)
                    window.homepage.attr("w", layoutAttribute.whole.w + "px")
                    window.homepage.attr("h", layoutAttribute.whole.h + "px");
                    window.xxbj.setVisibility(0);
                    window.xxbr.attr("visibility", "gone");
                    window.title.attr("w", layoutAttribute.whole.w - layoutAttribute.windowOperate.w + "px");
                    switch (setting.执行) {
                        case "常规":
                            window.name.setText("行动基建");
                            break;
                        case "行动":
                            window.name.setText("行动作战");
                            break;
                        case "基建":
                            window.name.setText("基建收菜");
                            break;
                        case "剿灭":
                            window.name.setText("剿灭作战");
                            break;
                        case "上次":
                            window.name.setText("上次作战");
                            break;
                        case "定时剿灭":
                            window.name.setText("定时剿灭");
                            break;
                        case "自定义模块":
                            window.name.setText("明日计划");
                            break;
                        default:
                            window.name.setText("明日计划");
                            break;
                    };
                    blockHandle.setTimeout(() => {

                        展开主界面();
                    }, 0);
                });

                break;
        }

    })
    window.optionList.on("item_click", function(icon) {

        switch (icon) {
            case optionList[0]:
                if (optionList[0] == "@drawable/ic_assignment_black_48dp") {
                    Combat_report.view_show();
                    return
                }
                if (tool.script_locate("progra")) {
                    toast("请先点击" + window.name.text() + "右侧的图标暂停");
                    return;
                };
                tool.writeJSON("侧边", "基建");
                继续();
                break;
            case optionList[1]:
                if (功能图标[0] == "@drawable/ic_pause_circle_outline_black_48dp") {
                    toast("当前行动中，访问完内容记得关闭浏览器面板，防止悬浮窗阻挡画面");
                };
                悬浮浏览器("http://ark.yituliu.cn/");
                //  tool.writeJSON("侧边", "任务")
                break;
        };
    });

    window.webview.on("touch_down", () => {
        window.requestFocus(); // window.webview.requestFocus();
    });


};


function web_initialization() {
    ui.run(() => {
        let wiki = [{
            title: "材料获取一图流",
            url: "http://ark.yituliu.cn/",
            icon: "http://ark.yituliu.cn/favicon.ico",
        }, {
            title: "明日方舟官网",
            url: "https://ak.hypergryph.com/",
            icon: "https://ak.hypergryph.com/favicon.ico",
        }, {
            title: "泰拉记事社",
            url: "https://terra-historicus.hypergryph.com/",
            icon: "https://terra-historicus.hypergryph.com/favicon.ico",
        }, {
            title: "塞壬唱片",
            url: "https://monster-siren.hypergryph.com/m",
            icon: "https://monster-siren.hypergryph.com/favicon.ico",
        }, {
            title: "企鹅物流",
            url: "https://penguin-stats.cn/",
            icon: "https://penguin-stats.cn/favicon.ico",
        }, {
            title: "明日方舟工具箱",
            url: "https://arkn.lolicon.app/#/",
            icon: "https://arkn.lolicon.app/favicon.ico",
        }, {
            title: "寻访记录分析",
            url: "https://arkgacha.kwer.top/",
            icon: "https://arkgacha.kwer.top/static/icon.ico",
        }, {
            title: "PRTS",
            url: "https://m.prts.wiki/w/%E9%A6%96%E9%A1%B5",
            icon: "https://m.prts.wiki/favicon.ico",
        }, {
            title: "Kokodayo",
            url: "https://kokodayo.fun/",
            icon: "https://kokodayo.fun/favicon.ico",
        }, {
            title: "Arknights DPS",
            url: "https://viktorlab.cn/akdata/dps/",
            icon: "https://viktorlab.cn/akdata/favicon.ico",
        }, {
            title: "干员培养表",
            url: "https://ark-nights.com/",
            icon: "https://ark-nights.com/favicon.ico",

        }, {
            /*
           title:"夏活攒抽规划",
           url:"https://xunfang.vercel.app/",
           icon:"https://pica.zhimg.com/80/v2-cc92c54352f3359e6ce94bfbb88c1fa6_720w.jpg?source=1940ef5c",
        },{*/
            title: "少人Wiki",
            url: "https://arkrec.com/",
            icon: "https://arkrec.com/favicon/apple-touch-icon.png",
        }, {
            title: "ArkStory",
            url: "https://arkstory.cc/story",
            icon: "https://arkstory.cc/static/images/favicon.png",
        }];
        myAdapterListener(window.工具, wiki.map(item => item.title))


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
                                                                    <TextView id="_text" padding="8dp" gravity="center"
                                                                    textColor="#000000" textSize="15sp" />
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
                            if (Options_menu) {
                                Options_menu = false;
                                url = wiki.find(item => item.title === r).url;
                                if (url) {
                                    window.webview.loadUrl(url);
                                };
                                toast(r);

                            };
                            Options_menu = false;
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

        //settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NARROW_COLUMNS); // 设置自适应屏幕的算法
        //settings.setAppCacheEnabled(false); // 是否启用app缓存
        //settings.setAppCachePath("/sdcard/aaa"); // app缓存文件路径
        settings.setAllowFileAccess(true); // 是否允许访问文件
        settings.setDatabaseEnabled(true); // 是否启用数据库
        settings.setDomStorageEnabled(true); // 是否本地存储
        let WebChromeClient = android.webkit.WebChromeClient;
        var webChromeClient = new JavaAdapter(WebChromeClient, {
            onShowFileChooser: function(webview, filePathCallback_, fileChooserParams) {
                filePathCallback = filePathCallback_
                if (files.exists(context.getExternalFilesDir(null).getAbsolutePath() + "be_identified.png")) {
                    infile("file://" + context.getExternalFilesDir(null).getAbsolutePath() + "be_identified.png");
                } else {
                    infile("file:///sdcard/7.png")
                    console.error("路径文件不存在！无法执行数据统计")
                    // return false

                }

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

function 悬浮浏览器(url) {
    if (settings == undefined) {
        web_initialization();
    }
    if (获取屏幕方向() == "横屏") {
        layoutAttribute.whole.w = zoom(1200)
        layoutAttribute.whole.h = zoom(900)
    } else {
        layoutAttribute.whole.w = zoom(1000)
        layoutAttribute.whole.h = zoom(1200)

    }
    $ui.post(() => {
        window.operation.setVisibility(8);
        window.operation2.setVisibility(0);
        window.xxbj.setVisibility(8);
        window.xxbr.attr("visibility", "visible");
        window.homepage.attr("w", layoutAttribute.whole.w + "px")
        window.homepage.attr("h", layoutAttribute.whole.h + "px");
        window.xxbr.attr("h", layoutAttribute.whole.h - layoutAttribute.windowOperate.h + "px")
        window.title.attr("w", layoutAttribute.whole.w - layoutAttribute.windowOperate.w + "px");
        window.webview.loadUrl(url);
    }, 100);

    blockHandle.setTimeout(() => {
        展开主界面();
    }, 0);
    $ui.post(() => {
        window.name.setText("wiki");
        if (获取屏幕方向() == "横屏") {
            window.setPosition(layoutAttribute.whole.iniX, layoutAttribute.whole.iniY);
        }
    }, 300);

}

function 材料显示() {
    ui.run(function() {

        if (setting.企鹅统计 && setting.指定材料) {


            var MaterialJson = tool.readJSON("material_await_obtain")
            console.info(MaterialJson)
            if (MaterialJson != undefined && MaterialJson.number.length >= 1) {
                window.tof.setVisibility(8);

                let ch = parseInt(window.tof.getHeight());
                window.Material_Science.attr("h", ch + MaterialJson.number.length * 20);

                for (let j = window.Material_Science.getChildCount() - 1; j > -1; j--) {
                    window.Material_Science.removeView(window.Material_Science.getChildAt(j))
                }
                for (let i = 0; i < MaterialJson.name.length; i++) {
                    if (i >= 3) {
                        break
                    }

                    let rgb =
                        random(16, 255).toString(16) +
                        random(16, 255).toString(16) +
                        random(16, 255).toString(16);
                    let AddView = ui.inflate(
                        '\
					<frame id="count_m' + i + '" layout_gravity="bottom" >\
						<horizontal  w="{{' + zoom(200) + '}}px" h="{{' + zoom(60) + '}}px" >\
							<img src="file://./res/material/' +
                        MaterialJson.name[i] +
                        '.png" h="auto" w="{{' + zoom(75) + '}}px" />\
							<text id="count_t" w="*"' +
                        ' hint="' + MaterialJson.name[i] + '" text="' + MaterialJson.done[i] + '/' +
                        MaterialJson.number[i] +
                        '" gravity="center_vertical" marginLeft="-6px" marginRight="-6px" textColor="' + layoutAttribute.setColor.toast + '" textSize="{{' + zoom(40) + '}}px" lines="1" ></text>\
						</horizontal>\
					</frame>',
                        window.Material_Science
                    );

                    window.Material_Science.addView(AddView);
                    for (let i = 0; i < window.Material_Science.getChildCount(); i++) {
                        window.Material_Science.getChildAt(i).removeAllListeners()
                        window.Material_Science.getChildAt(i).click(function(e) {
                            toastLog(e.getChildAt(0).getChildAt(1).getHint())
                        })
                    }
                }
            }
        }
    })
}

function Penguin_statistics() {

    let result = 0;
    ui.run(() => {
        window.webview.loadUrl("https://penguin-stats.cn/report/recognition");
    });
    threads.start(function() {
        sleep(3000);
        get_penguin();
    })

    function get_penguin() {
        sleep(500);
        console.verbose("加载网页")
        let _url;
        ui.run(() => {
            _url = window.webview.url;
        });
        if (_url != "https://penguin-stats.cn/report/recognition") {
            ui.run(() => {
                window.webview.loadUrl("https://penguin-stats.cn/report/recognition");
            });
            switch (result) {
                case 0:
                    sleep(4000);
                    break
                case 1:
                    sleep(4000);
                    break
                case 2:
                    sleep(5000)
                    break
                case 3:
                    sleep(6000)
                case 4:
                    sleep(7000)
                    break
                default:
                    sleep(8000)
                    break
            }
        }
        console.verbose("输入图片")
        ui.run(() => {
            //输入图片
            window.tos.setText("状态：材料统计..");
            window.webview.loadUrl("javascript:document.getElementById('input-138').click();document.getElementById('input-138').click();")
        })
        switch (result) {
            case 0:
                sleep(500);
                break
            case 1:
                sleep(1000);
                break
            default:
                sleep(1500)
                break
        }
        //确定
        ui.run(() => {
            window.webview.loadUrl("javascript:document.getElementsByClassName('px-4 py-2 mb-2 overflow-hidden transition-all position-relative v-btn v-btn--contained v-btn--rounded theme--light v-size--large primary')[0].click();");
        })
        switch (result) {
            case 0:
                sleep(3000);
                break
            case 1:
                sleep(4000);
                break
            default:
                sleep(5000)
                break
        }
        console.verbose("统计材料")
        ui.run(() => {
            window.tos.setText("状态：材料统计..");
            var getresult = files.read("./lib/prototype/obtain_Statistics.txt")
            window.webview.evaluateJavascript("javascript:" + getresult.toString() + "getresult();", new ValueCallback({
                onReceiveValue: function(value) {
                    result++;
                    if (value == "false" || value == "null") {
                        if (result <= 10) {
                            ui.run(() => {
                                //离开
                                window.webview.loadUrl("javascript:document.getElementsByClassName('v-list-item__title')[0].click();document.getElementsByClassName('v-btn v-btn--contained theme--light v-size--default error')[0].click();")
                            })

                            console.log("数据统计false，重新获取");
                            threads.start(get_penguin)
                            return false

                        } else {
                            ui.run(() => {
                                window.tos.setText("状态：统计失败..行动中..")
                            })
                            console.error("企鹅物流数据统计：超时！，无法获取材料掉落信息");
                            progra = tool.script_locate("progra");
                            if (progra) {
                                progra.emit("暂停", "继续");
                            }
                        }

                    } else {
                        handle(value);
                        value == "false";
                        ui.run(() => {
                            //离开
                            window.webview.loadUrl("javascript:document.getElementsByClassName('v-list-item__title')[0].click();document.getElementsByClassName('v-btn v-btn--contained theme--light v-size--default error')[0].click();")
                        })
                    }
                },
            }))
        })

    }

    function handle(value) {
        ui.run(() => {
            window.tos.setText("状态：数据校验中...");
        })
        value = JSON.parse(value);
        switch (value[0]) {
            case "成功 (1)":
                if (setting.汇报上传) {
                    ui.run(() => {
                        window.webview.loadUrl("javascript:document.getElementsByClassName('v-icon notranslate v-icon--left mdi mdi-upload theme--light')[0].click();");
                    })
                    ui.post(() => {
                        window.webview.loadUrl("javascript:document.getElementsByClassName('mx-2 v-divider v-divider--vertical theme--light')[0].click()");
                        console.verbose("上传汇报关卡掉落物数据");
                    }, 1500)
                } else {
                    log("汇报上传：" + setting.汇报上传)
                }
                let Material_data = tool.readJSON("material_await_obtain");
                //忘记干嘛用的了,也许
                let Material = tool.readJSON("material_accrued_obtain");

                let falling = [];

                for (let i = 0; i < value[2].length; i++) {
                    let name = value[2][i].goods;
                    let done = Number(value[2][i].amount.replace("×", ""))
                    let j = Material_data.name.indexOf(name)
                    if (j != -1) {
                        Material_data.done[j] += done;
                    }
                    falling.push(name + value[2][i].amount)

                    j = Material.name.indexOf(name)

                    if (j != -1) {
                        Material.done[j] += done;
                    } else {
                        Material.name.push(name);
                        Material.done.push(done)
                    }
                }

                value = "第" + setting.已执行动 + "次，企鹅物流数据统计：成功！\n            关卡：" + value[1] + " \n            掉落物品：" + falling
                console.info(value);
                record(value);
                toast(value);

                let value2 = "";
                for (let k = 0; k < Material.name.length; k++) {
                    value2 = value2 + "\n" + Material.name[k] + "×" + Material.done[k];
                }
                setting = tool.readJSON("configure");
                value2 = "PRTS辅助本次运行总材料掉落统计：\n行动" + setting.已执行动 + "次，材料：" + value2;
                console.warn(value2);
                record(value2)
                tool.putString("material_accrued_obtain", Material)
                tool.putString("material_await_obtain", Material_data);

                if (setting.指定材料) {
                    for (let i = 0; i < Material_data.name.length; i++) {
                        if (Material_data.done[i] >= Material_data.number[i]) {
                            let name = Material_data.name[i].toString();
                            let number = Material_data.number[i].toString()
                            ui.run(function() {
                                window.tos.setText("状态：" + name + "×" + number + "刷取完成")
                            })
                            Material_data.name.splice(i, 1);
                            Material_data.done.splice(i, 1);
                            Material_data.number.splice(i, 1);
                            value = "终止";
                            break;
                        }
                    }
                    材料显示()
                    tool.putString("material_await_obtain", Material_data);
                    if (value == "终止") {

                        threads.start(暂停)

                    } else {
                        progra = tool.script_locate("progra");
                        if (progra) {
                            progra.emit("暂停", "继续");
                        }
                    }
                }

                break
            case "异常 (1)":
                ui.run(() => {
                    window.tos.setText("状态：企鹅物流统计失败...")
                })
                value = "企鹅物流数据统计：失败！\n            错误原因：" + value[1]
                console.error(value)

                record(value)
                toast(value)
                progra = tool.script_locate("progra");
                if (progra) {
                    progra.emit("暂停", "继续");
                }
                break
        }

    }
}

//重写对话框
function 执行次数() {
    setting = tool.readJSON("configure")
    let rewriteView = ui.inflate(
        <vertical padding="10 0">
            <View bg="#ffffff" h="1" w="auto" />
            <card w="*" id="indx2" margin="0 0 0 1" h="45dp" cardCornerRadius="0"
            cardElevation="3dp" gravity="center_vertical"  >
            
            <linear clipChildren="false" elevation="0" gravity="center_vertical" >
                <spinner id="implement" layout_gravity="center" layout_weight="1" entries="指定关卡+基建|只执行行动刷图|只执行基建收菜|执行剿灭作战+基建" />
            </linear>
        </card>
        <View bg="#000000" h="1" w="auto" />
        <horizontal marginLeft="5" gravity="center">
            <text id="levelPickText" text="关卡选择" textSize="{{px2dp(48)}}" textColor="#212121" marginRight="50" />
            <spinner id="level_pick" textSize="{{px2dp(62)}}" entries=""
            gravity="center" layout_weight="1" margin="5 5" padding="4" />
            {/*  <TextView id="level_pick" textSize="{{px2dp(62)}}"
            margin="5 5" textColor="black" w="*" text="当前/上次" gravity="center" />
            */}
        </horizontal>
        <Switch id="ysrh" checked="{{setting.only_medicament}}" text="仅使用药剂恢复理智" padding="6 6 6 6" textSize="16sp" />
        <Switch id="unlimited_eat_expired_sane" checked="{{setting.无限吃24小时过期理智药}}" text="无限吃24小时过期理智药" padding="6 6 6 6" textSize="16" />
        <horizontal gravity="center" marginLeft="5">
            <text id="mr1" text="刷图上限:" textSize="15" textColor="#212121" />
            <input id="wordname3" inputType="number" hint="{{setting.剿灭}}次" layout_weight="1" visibility="gone" paddingLeft="6" w="auto" />
            <input id="wordname" inputType="number" hint="{{setting.行动}}次" layout_weight="1" paddingLeft="6" w="auto" />
            <text id="mr2" text="磕药/碎石:" textSize="15" textColor="#212121" />
            <input id="wordname2" inputType="number" hint="{{setting.理智}}个" layout_weight="1" w="auto" />
        </horizontal>
        <linear >
            <card id="WaitForRun" w="35" h="35" cardCornerRadius="25dp" cardElevation="0dp" margin="5 0"
            layout_gravity="right" cardBackgroundColor="#03a9f5" foreground="?attr/selectableItemBackground" clickable="true">
            <linear gravity="center">
                <img
                id="icon"
                w="25" h="25"
                tint="#ffffff"
                src="@drawable/ic_delete_forever_black_48dp"
                />
            </linear>
        </card>
        <button id="buiok" text="确认设置" margin="0 -5 0 -4" layout_weight="1" style="Widget.AppCompat.Button.Colored" h="auto" />
        </linear>
        </vertical>, null, false);
    let rewriteDialogs = dialogs.build({
        customView: rewriteView,
        wrapInScrollView: false,
        autoDismiss: true
    }).on("dismiss", (dialog) => {
        rewriteView = null;
        rewriteDialogs = null;
    });
    // gallery_info.服务器 = (gallery_info.服务器 ? gallery_info.服务器 : gallery_info.server);

    rewriteView.ysrh.on("check", (checked) => {
        tool.writeJSON("only_medicament", checked);
    });
    rewriteView.unlimited_eat_expired_sane.click((view) => {

        /*  if (view.checked) {
              if (gallery_info.服务器 == "简中服") {
                  if (!setting.ocrExtend) {
                      view.checked = false;
                      snakebar(language['OCR-Extensions-need-installed']);
                      return
                  }
              } else {
                  view.checked = false;
                  snakebar(language['ocr-sorry']);
              }
          }
          */
        tool.writeJSON("无限吃24小时过期理智药", view.checked);
    });
    rewriteView.buiok.on("click", () => {
        输入框事件()
    });
    let level_choices = JSON.parse(
        files.read("./lib/game_data/level_choices.json", (encoding = "utf-8"))
    );

    function isOpen(level, special) {
        let now = new Date();
        let day = now.getDay();
        let gnow = new Date().setHours(4, 0, 0, 0);
        // 判断当前时间是否在凌晨4点之前
        if (now < gnow) {
            // 如果是，日期减1
            if (day <= 0) {
                day = 6;
            } else {
                day = day - 1;
            }
        };
        //特别开放
        if (special) return true;
        if (level.day) {
            //不知道为什么在autojs Pro8上运行会报错cannot find function includes in object
            //  return level.day.includes(day);
            return (level.day.indexOf(day) != -1);

        } else {
            return true;
        }

    }

    let level_choices_open = [];
    for (let id of level_choices) {

        if (isOpen(id)) {
            if (typeof id.abbreviation == "object") {
                for (let k in id.abbreviation) {

                    level_choices_open.push(k);
                }
            } else {
                level_choices_open.push(id.abbreviation);
            }
        }
    };

    function change_list(item, fun) {
        adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        rewriteView.level_pick.setAdapter(adapter);
        rewriteView.level_pick.setBackground(createShape(5, 0, 0, [2, setting.bg]));
        rewriteView.level_pick.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
            onItemSelected: function(parent, view, position, id) {
                fun(parent, view, position, id);
            }
        }));
    };


    rewriteView.WaitForRun.attr("cardCornerRadius", "25dp");
    rewriteView.WaitForRun.on("click", () => {
        tool.writeJSON("已执行动", "0");
        toastLog("清空已执行动记录");
        setting = tool.readJSON("configure");
        ui.run(function() {
            rewriteView.WaitForRun.setVisibility(8)
            if (setting.执行 != "剿灭") {
                window.tod.setText("行动：执行" + setting.已执行动 + "次&上限" + setting.行动 + "次");
            } else {
                window.tod.setText("剿灭：执行" + setting.已执行动 + "次&上限" + setting.剿灭 + "次");
            }
        });

    });

    if (setting.已执行动 == 0) {
        rewriteView.WaitForRun.setVisibility(8)
    }
    rewriteView.wordname.on("key", function(keyCode, event) {
        if (event.getAction() == 0 && keyCode == 66) {
            输入框事件()
            event.consumed = true;
        }
    });
    rewriteView.wordname2.on("key", function(keyCode, event) {
        if (event.getAction() == 0 && keyCode == 66) {
            输入框事件()
            event.consumed = true;
        }
    });



    let modeGather = {
        "指定关卡+基建": "常规",
        "只执行行动": "行动",
        "只执行基建": "基建",
        "执行剿灭作战+基建": "剿灭",
    };
    if (setting.自定义模块) {
        modeGather["执行自定义模块"] = "自定义模块";
    }

    //   rewriteView.implement.attr("entries",mCountries)

    adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, Object.keys(modeGather));
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    rewriteView.implement.setAdapter(adapter);

    rewriteDialogs.show();
    rewriteView.implement.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener({
        onItemSelected: function(parent, view, position, id) {
            ui.run(function() {

                let r = parent.getSelectedItem();
                if (r == "执行剿灭作战+基建") {
                    rewriteView.wordname.attr("visibility", "gone")
                    rewriteView.wordname3.attr("visibility", "visible");

                } else {
                    rewriteView.wordname3.attr("visibility", "gone")
                    rewriteView.wordname.attr("visibility", "visible");

                };
                if (position == 4) {
                    rewriteView["levelPickText"].setText("模块选择");
                    let _modData_ = [];
                    for (let _modular_ of mod_data) {
                        if (_modular_.id == "自定义" && _modular_.path) {
                            _modData_.push(_modular_.script_name);
                        }
                    };
                    change_list(_modData_, function(parent, view, position, id) {
                        tool.writeJSON("自定义模块", parent.getSelectedItem());
                    });
                } else {
                    rewriteView["levelPickText"].setText("关卡选择");
                    change_list(level_choices_open, function(parent, view, position, id) {

                        setting.指定关卡 ? setting.指定关卡.levelAbbreviation = parent.getSelectedItem() : setting.指定关卡 = {
                            levelAbbreviation: parent.getSelectedItem(),
                        };
                        tool.writeJSON("指定关卡", setting.指定关卡);
                        // toastLog(setting.指定关卡.levelAbbreviation);
                    });

                    if (level_choices_open.indexOf(setting.指定关卡.levelAbbreviation) != -1) {
                        rewriteView.level_pick.setSelection(level_choices_open.indexOf(setting.指定关卡.levelAbbreviation));
                    };
                }

            })
        }
    }));

    let SE执行 = Object.values(modeGather).findIndex((text) => text == setting.执行);
    if (SE执行 != -1) {
        rewriteView.implement.setSelection(SE执行);
        if (SE执行 == 3) {
            rewriteView.wordname.attr("visibility", "gone")
            rewriteView.wordname3.attr("visibility", "visible");
        }
    };
    if (SE执行 == 4) {
        rewriteView["levelPickText"].setText("模块选择");
        let _modData_ = [];
        for (let _modular_ of mod_data) {
            if (_modular_.id == "自定义" && _modular_.path) {
                _modData_.push(_modular_.script_name);
            }
        };
        change_list(_modData_, function(parent, view, position, id) {
            tool.writeJSON("自定义模块", parent.getSelectedItem());
        });
    } else {
        rewriteView["levelPickText"].setText("关卡选择");
        change_list(level_choices_open, function(parent, view, position, id) {

            setting.指定关卡 ? setting.指定关卡.levelAbbreviation = parent.getSelectedItem() : setting.指定关卡 = {
                levelAbbreviation: parent.getSelectedItem(),
            };
            tool.writeJSON("指定关卡", setting.指定关卡);
            // toastLog(setting.指定关卡.levelAbbreviation);
        });

        SE执行 = level_choices_open.indexOf(setting.指定关卡.levelAbbreviation);
        if (SE执行 != -1) {
            rewriteView.level_pick.setSelection(SE执行);
        };
    }
    delete SE执行;


    function 输入框事件() {
        let Executionsettings = rewriteView.implement.getSelectedItemPosition();
        tool.writeJSON("执行", Object.values(modeGather)[Executionsettings]);
        /*  switch (Executionsettings) {
              case 0:
                  tool.writeJSON("执行", "常规");
                  break;
              case 1:
                  tool.writeJSON("执行", "行动");
                  tool.writeJSON("行动", "999")
                  //  files.write("./mrfz/行动.txt", "999");
                  break;
              case 2:
                  tool.writeJSON("执行", "基建");
                  break;
              case 3:
                  tool.writeJSON("执行", "剿灭");
                  tool.writeJSON("剿灭", "5")
                  break;
              case 4:
                  tool.writeJSON("执行", "自定义模块");
                  break;
          };
  */
        let rwt = rewriteView.wordname.text(),
            rwt2 = rewriteView.wordname2.text(),
            rwt3 = rewriteView.wordname3.text()

        if (rwt.length > 3) {
            rewriteView.wordname.setError("最高999次");
            return
        };
        if (rwt3.length > 2) {
            rewriteView.wordname3.setError("最高99次");
            return
        };
        if (rwt2.length > 2) {
            rewriteView.wordname2.setError("使用药剂、源石\n恢复理智最高99个");
            return
        };
        if (rwt.length > 0) {
            tool.writeJSON("行动", rwt);
            record("设置了刷图上限：" + rwt + "次");
        } else {
            rewriteView.wordname.setError("请输入数字");
        };
        if (rwt3.length > 0) {
            tool.writeJSON("剿灭", rwt3);
            record("设置了剿灭上限：" + rwt3 + "次");
        } else {
            rewriteView.wordname3.setError("请输入数字");
        };

        if (rwt2.length > 0) {
            tool.writeJSON("理智", rwt2)
            record("设置了磕药/碎石：" + rwt2 + "个");
        } else {
            rewriteView.wordname2.setError("请输入数字");
        };
        if (rwt.length == 0 && rwt2.length == 0 && rwt3.length == 0) {
            toastLog("没有输入任何内容，仅更换执行选项，需要手动暂停当前运行选项");
        }
        Executionsettingss = null;
        rwt = null;
        rwt2 = null;
        ui.run(function() {
            setting = tool.readJSON("configure");
            if (setting.执行 != "剿灭") {
                window.tod.setText("行动：执行" + setting.已执行动 + "次&上限" + setting.行动 + "次");
            } else {
                window.tod.setText("剿灭：执行" + setting.已执行动 + "次&上限" + setting.剿灭 + "次");
            }
            window.tof.setText("理智：已兑" + setting.已兑理智 + "次&上限" + setting.理智 + "个");
            rewriteView.wordname.setHint(" " + setting.行动);
            rewriteView.wordname3.setHint(" " + setting.剿灭);
            rewriteView.wordname2.setHint(" " + setting.理智);
            rewriteView.wordname.setText("");
            rewriteView.wordname3.setText("")
            rewriteView.wordname2.setText("");
            switch (setting.执行) {
                case "常规":
                    window.name.setText("行动基建");
                    break;
                case "行动":
                    window.name.setText("行动作战");
                    break;
                case "基建":
                    window.name.setText("基建收菜");
                    break;
                case "剿灭":
                    window.name.setText("剿灭作战");
                    break;
                case "定时剿灭":
                    window.name.setText("定时剿灭");
                    break;
                case "自定义模块":
                    window.name.setText("明日计划");
                    break;
            };
            if (setting.指定关卡.levelAbbreviation == "上次") {
                window.name.setText("上次作战");
            }

        });
        rewriteDialogs.dismiss();

    }

}

function 主页设置() {
    setting = tool.readJSON("configure");

    let setupView = ui.inflate(
        <vertical margin="10 0">
            <ScrollView>
                <vertical>
                    <horizontal margin="5 0" id="home_" >
                        <vertical layout_weight="1" >
                            <text text="任务结束返回桌面" textColor="black" textSize="16sp" />
                            <text text="PRTS辅助运行结束后自动返回桌面,如PRTS运行期间出现报错将无法执行" textColor="#95000000" textSize="10sp" marginTop="2" />
                        </vertical>
                        <Switch id="home" checked="{{setting.end_action.home}}" layout_gravity="center" textSize="18sp"
                        thumbSize='24' radius='24' />
                    </horizontal>
                    <horizontal margin="5 0" id="lock_screen_" >
                        <vertical layout_weight="1" >
                            <text text="任务结束锁屏" textColor="black" textSize="16sp" />
                            <text text="PRTS辅助运行结束后自动锁定屏幕,需Android 9.0 (API 28)才能生效" textColor="#95000000" textSize="10sp" marginTop="2" />
                        </vertical>
                        <Switch id="lock_screen" checked="{{setting.end_action.lock_screen}}" layout_gravity="center" textSize="18sp"
                        thumbSize='24' radius='24' />
                    </horizontal>
                    
                    <Switch id="jjhb" checked="{{setting.基建换班}}" text="基建换班模块" padding="6 6 6 6" textSize="16sp" />
                    
                    <Switch id="jjjs" checked="{{setting.无人机加速}}" text="基建内无人机加速" padding="6 6 6 6" textSize="16sp" />
                    <radiogroup id="rawrj" orientation="horizontal">
                        <radio id="raw1" text="无人机加速生产" w="auto" />
                        <radio id="raw2" text="无人机加速贸易" w="auto" />
                    </radiogroup>
                    <Switch id="hkxs" checked="{{setting.会客室线索}}" text="基建会客室线索" padding="6 6 6 6" textSize="16sp" />
                    <radiogroup id="hks" orientation="horizontal" visibility="{{setting.会客室线索 ? 'visible':'gone'}}">
                        <checkbox id="hks1" text="处理线索溢出" w="auto" checked="{{setting.处理线索溢出}}" />
                    </radiogroup>
                    <Switch id="hyfw" checked="{{setting.好友访问}}" text="基建内好友访问" padding="6 6 6 6" textSize="16sp" />
                    <Switch id="hyqk" checked="{{setting.好友限制}}" text="仅访问10位好友" padding="6 6 6 6" textSize="16sp" />
                    
                    <Switch id="sqxy" checked="{{setting.收取信用}}" text="收取每日信用" padding="6 6 6 6" textSize="16sp" />
                    <Switch id="gmcs" text="购买信用物品" padding="6 6 6 6" textSize="16sp" visibility="gone" />
                    
                    <Switch id="gozh" checked="{{setting.公招}}" text="自动公开招募" padding="6 6 6 6" textSize="16sp" />
                    <radiogroup id="tag_" orientation="horizontal" visibility="{{setting.公招 ? 'visible':'gone'}}">
                        <checkbox id="tag1" text="8小时无tag招募" w="auto" checked="{{setting.无tag招募}}" />
                        <checkbox id="tag2" text="聘用候选人" w="auto" checked="{{setting.自动聘用}}" />
                    </radiogroup>
                    <Switch id="rwjl" checked="{{setting.任务奖励}}" text="领取任务奖励" padding="6 6 6 6" textSize="16" />
                    
                    <Switch id="dili" checked="{{setting.设置电量}}" text="低电量暂停辅助" padding="6 6 6 6" textSize="16sp" />
                    <linear id="szdl">
                        <input id="inputd" inputType="number" hint="设置低电量自暂停：{{setting.电量}}" layout_weight="2" textColor="black" textSize="16sp" marginLeft="15" />
                        <button id="searchd" text="   确定  " style="Widget.AppCompat.Button.Borderless.Colored" />
                    </linear>
                </vertical>
            </ScrollView>
        </vertical>);
    var setup = dialogs.build({
        customView: setupView,
        wrapInScrollView: true,
        autoDismiss: true
    }).on("dismiss", (dialog) => {
        setupView = null;
        setup = null;
    })

    setupView.home_.on("click", () => {
        setupView.home.performClick();
    });
    setupView.home.on("click", (view) => {
        setting.end_action.home = view.checked;
        tool.writeJSON("end_action", setting.end_action);
    });

    setupView.lock_screen_.on("click", () => {
        setupView.lock_screen.performClick();
    });
    setupView.lock_screen.on("click", (view) => {
        setting.end_action.lock_screen = view.checked;
        tool.writeJSON("end_action", setting.end_action);
    });

    //点击是否无人机加速
    setupView.jjjs.on("check", (checked) => {
        tool.writeJSON("无人机加速", checked)
        checked ? setupView.rawrj.attr("visibility", "visible") : setupView.rawrj.attr("visibility", "gone");

    });

    setupView.raw1.on("check", (checked) => {
        tool.writeJSON("加速生产", checked);
    });
    setupView.hyfw.on("check", (checked) => {
        tool.writeJSON("好友访问", checked);
        checked ? setupView.hyqk.attr("visibility", "visible") : setupView.hyqk.attr("visibility", "gone");

    });
    setupView.hkxs.on("check", (checked) => {
        setupView.hks.setVisibility(checked ? 0 : 8)
        tool.writeJSON("会客室线索", checked);
    });
    setupView.hks1.on("check", (checked) => {

        if (checked) {
            if (!files.exists("./mrfz/tuku/线索_传递.png")) {
                modular_d.Dialog_Tips("确认图库", "当前图库不完整,请在左上角头像-更换图库-检查图库!")
                return;
            }

            language = (gallery_info.服务器 ? gallery_info.服务器 : gallery_info.server);
            switch (true) {
                case language != "简中服":
                    language = "外服";
                    break;
            }
            if (language == "外服") {

                setupView.hks1.checked = false;
                toastLog("很抱歉，OCR不支持识别外服文字")
                return
            }

        }
        tool.writeJSON("处理线索溢出", checked)
    })

    setupView.sqxy.on("check", (checked) => {
        checked ? setupView.gmcs.attr("visibility", "visible") : setupView.gmcs.attr("visibility", "gone");
        tool.writeJSON("收取信用", checked);
    });
    setupView.gmcs.on("check", (checked) => {
        setting = tool.readJSON("configure");
        tool.writeJSON("信用处理", {
            "信用购买": checked,
            "优先顺序": setting.信用处理.优先顺序,
            "购买列表": setting.信用处理.购买列表,
            "三百信用": setting.信用处理.三百信用
        });
    });
    setupView.gozh.on("check", (checked) => {
        checked ? setupView.tag_.setVisibility(0) : setupView.tag_.setVisibility(8);
        tool.writeJSON("公招", checked);

    });
    setupView.tag1.on("check", (checked) => {
        tool.writeJSON("无tag招募", checked)
    })
    setupView.tag2.on("check", (checked) => {
        tool.writeJSON("自动聘用", checked)
    })
    setupView.rwjl.on("check", (checked) => {
        tool.writeJSON("任务奖励", checked)
    })

    setupView.hyqk.on("check", (checked) => {
        tool.writeJSON("好友限制", checked);
    });
    setupView.dili.on("check", (checked) => {
        tool.writeJSON("设置电量", checked);
        checked ? setupView.szdl.attr("visibility", "visible") : setupView.szdl.attr("visibility", "gone");

    });
    setupView.searchd.click(() => {
        电量输入框()
    });
    setupView.inputd.on("key", function(keyCode, event) {
        if (event.getAction() == 0 && keyCode == 66) {
            电量输入框()
            event.consumed = true;
        }
    });

    setupView.jjhb.on("check", (checked) => {
let shift = mod_data.findIndex((item) => item.id == "基建换班");
    if (shift) {
        mod_data[shift].suspend = !checked;
         sto_mod.put("modular", mod_data);
               
    }
    });
    //判断是否显示无人机加速、加速那个
    if (!setting.无人机加速) setupView.rawrj.attr("visibility", "gone");
    if (!setting.好友访问) setupView.hyqk.attr("visibility", "gone");
    if (!setting.设置电量) setupView.szdl.attr("visibility", "gone");
    if (setting.加速生产) {
        setupView.raw1.checked = true;
    } else {
        setupView.raw2.checked = true;
    }
    let shift = mod_data.find((item) => item.id == "基建换班");
    if (shift) {
        if (!shift.suspend) setupView.jjhb.checked = true;
        setupView.jjhb.attr("visibility", "visible");
    } else {
        setupView.jjhb.attr("visibility", "gone");
    }

    setting.公招 ? setupView.tag_.setVisibility(0) : setupView.tag_.setVisibility(8);

    setting.信用处理.信用购买 ? setupView.gmcs.checked = true : setupView.gmcs.checked = false;
    setting.信用处理 ? setupView.gmcs.attr("visibility", "visible") : setupView.gmcs.attr("visibility", "gone");

    setup.show();

    function 电量输入框() {
        var rwtd = setupView.inputd.text();

        if (rwtd.length == 0) {
            setupView.inputd.setError("输入不能为空");
            return;
        }
        if (rwtd > 100) {
            setupView.inputd.setError("核电池?");
            return;
        } else {
            tool.writeJSON("电量", rwtd);
            toast("低于百分比电量自动暂停成功设置为" + rwtd)
            setupView.inputd.setText(null);
            setupView.inputd.setHint("设置低电量自暂停：" + rwtd);
        }
        rwtd = null;
    }

}

function 暂停(form) {
    //  themeJs = "night";
    form = form || "无";
    功能图标[0] = "@drawable/ic_play_circle_outline_black_48dp";

    ui.run(function() {
        window.功能.setDataSource(功能图标);
    });

    progra = tool.script_locate("progra.js");
    if (progra) {
        progra.emit("暂停", "结束程序");
    }

    tool.writeJSON("侧边", "0");
    setTimeout(function() {
        progra = tool.script_locate("progra.js");
        if (progra) {
            progra.emit("暂停", "结束程序");
        }
    }, 500);

    //判断不是手动暂停的

    if (active_end == false && setting.侧边 != "公招") {
        tool.writeJSON("已执行动", 0)
        tool.writeJSON("理智", 0);
        try {
            if (setting.音量 && setting.当前音量) {
                device.setMusicVolume(Number(setting.当前音量))
                tool.writeJSON("当前音量", false);
            }
        } catch (err) {
            console.error("恢复音量失败" + err)
        }

        tool.writeJSON("已兑理智", 0);

    }

    /*setTimeout(function() {
        let execution = engines.all();
        for (let i = 0; i < execution.length; i++) {
            if (execution[i].getSource().toString().match(/([^/]+)$/)[1] == "PRTS辅助.js") {
                console.verbose("强行终止PRTS辅助")
                execution[i].forceStop()
            }
        }
    }, 7000)*/
};

function 继续() {
    功能图标[0] = "@drawable/ic_pause_circle_outline_black_48dp";

    ui.run(function() {
        window.功能.setDataSource(功能图标);
        window.tos.setText("状态：等待程序重启中");
        if (setting.设置电量) {
            if (!device.isCharging() && device.getBattery() < setting.电量) {
                toast("警告:电量低于设定值" + setting.电量 + "%且未充电");
                console.error("警告:电量低于设定值" + setting.电量 + "%且未充电");
                device.vibrate(1500);
                window.tos.setText("警告：电量低且未充电");
            };
        };
        setting = tool.readJSON("configure");
        程序(setting.执行);
    });

};

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
    layoutAttribute.homepage.show = false;
    ui.post(() => {
        旋转动画(window.windowOperate, 720, 'z', 1200);
        window.disableFocus()

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
        window.homepage.setVisibility(8);
    }, 150)
    if (callback) callback(true);
};

function 展开主界面(callback) {
    layoutAttribute.homepage.show = true;
    ui.post(() => {
        旋转动画(window.windowOperate, -720, 'z', 1200);
        window.homepage.setVisibility(0);
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
    if (!window) {
        return;
    }
    try {
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
    } catch (e) {
        console.error("悬浮窗复位出错:", e);
    }
};

function 旋转动画(控件, 角度, 方向, 时间) {
    var animator = ObjectAnimator.ofFloat(控件, 方向 == 'x' ? 'rotationX' : 方向 == 'y' ? 'rotationY' : 'rotation', 0, 角度, 角度);
    animator.setDuration(时间);
    animator.start();
};

function 旋转监听() {
    this.cutter_package = false;
    //screenAttribute.direction == "横屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
    setInterval(() => {
        let cutter_package;
        if (setting.front_display) {
            try {
                cutter_package = tool.currentPackage();
                for (let package of setting.front_display_list) {
                    if (cutter_package != package.app_package && cutter_package != context.getPackageName()) {
                        this.cutter_package = false;
                    } else {
                        this.cutter_package = true;
                        break
                    }
                }
                if (this.cutter_package && layoutAttribute.whole.x == -500) {
                    layoutAttribute.whole.x = 65;
                    layoutAttribute.whole.y = 140;
                    window.setPosition(layoutAttribute.whole.x, layoutAttribute.whole.y);

                } else if (!this.cutter_package && layoutAttribute.whole.x != -500) {
                    layoutAttribute.whole.x = -500;
                    layoutAttribute.whole.y = -500;
                    window.setPosition(layoutAttribute.whole.x, layoutAttribute.whole.y);
                    console.verbose("当前包名:" + cutter_package + ", 隐藏悬浮窗");

                }
            } catch (e) {
                console.error("获取悬浮窗白名单设置出错" + e)
            }
        }
        /*   if (this.cutter_package) {
               let getDirection = 获取屏幕方向();
               if (getDirection != screenAttribute.direction) {
                   screenAttribute.direction = getDirection;
                   // screenAttribute.direction == "竖屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
                   threads.start(function () {
                       悬浮窗复位();
                   })
               };
           }*/
    }, 1500);
    setInterval(() => {
        ui.run(() => {
            if (setting.offset && window) {
                window.setPosition(zoom(random(layoutAttribute.whole.iniX, layoutAttribute.whole.iniX + 20)), zoom(random(layoutAttribute.whole.iniY, layoutAttribute.whole.iniY + 20)))
            }
        })
    }, 300 * 1000)
};


function 获取屏幕方向() {
    /*
        let wmanager_width = new ContextWrapper(context).getSystemService(context.WINDOW_SERVICE).getDefaultDisplay().getWidth();
         log(wmanager_width)
         if((wmanager_width-device.width) >= 250){
             return "横屏";
         }else{
             return "竖屏";
         }*/

    if (context.resources.configuration.orientation == 2) {
        //横屏
        return "横屏";
    } else if (context.resources.configuration.orientation == 1) {
        //竖屏
        return "竖屏";
    }
};

tool.putString("material_accrued_obtain", {
    name: [],
    done: [],
})
材料显示()
tool.writeJSON("已执行动", 0)
tool.writeJSON("已兑理智", 0)
程序(setting.执行);

function 程序(implem) {

    ui.run(function() {
        if (setting.执行 != "剿灭") {
            window.tod.setText("行动：已执" + setting.已执行动 + "次，上限" + setting.行动 + "次");
        } else {
            window.tod.setText("剿灭：已执" + setting.已执行动 + "次，上限" + setting.剿灭 + "次");
        }
        window.tof.setText("理智：已兑" + setting.已兑理智 + "次，上限" + setting.理智 + "个");
        switch (implem) {
            case "常规":
                window.name.setText("行动基建");
                if (setting.指定关卡.levelAbbreviation == "上次") {
                    window.name.setText("上次作战");
                }
                break;
            case "行动":
                window.name.setText("行动作战");
                if (setting.指定关卡.levelAbbreviation == "上次") {
                    window.name.setText("上次作战");
                }
                break;
            case "基建":
                window.name.setText("基建收菜");
                break;
            case "剿灭":
                window.name.setText("剿灭作战");
                break;
            case "定时剿灭":
                window.name.setText("定时剿灭");
                break;
            case "定时基建":
                window.name.setText("定时基建");
                break;
            case "自定义模块":
                window.name.setText("明日计划");
                break;
        };
    });
    if (setting.侧边 == "悬浮窗") {
        threads.start(暂停);
        ui.run(function() {
            window.tos.setText("状态：主程序暂停中");
        })
        tool.writeJSON("侧边", "0");
    } else {
        active_end = false;
        console.verbose("开始运行PRTS辅助");
        engines.execScriptFile("./progra.js", {
            delay: 200,
            path: files.path('./'),
        });


        setTimeout(function() {
            if (!active_end && !tool.script_locate("progra.js")) {
                switch (window.tos.text()) {
                    case "状态：主程序暂停中":
                        break
                    case "状态：识别结束，暂停中":
                        break;
                    case "状态：暂停，未安装插件":
                        break;
                    default:
                        toastLog("PRTS辅助启动失败，请尝试重新启动");
                        暂停();
                        ui.run(function() {
                            window.tos.setText("状态：PRTS辅助启动失败");
                        })
                        return
                }
            }

            return
        }, 5000);

    }
}

threads.start(function() {
    events.on("暂停", function(words) {
        暂停();
        switch (words) {
            case "状态异常":
                ui.run(function() {
                    window.tos.setText("状态：异常，超时暂停处理");
                });
                home();
                home();
                break
            case "低电量":
                if (setting.公告 == true) {
                    关闭应用(setting.执行, "电量低于设定值且未充电");
                } else {
                    ui.run(function() {
                        window.tos.setText("状态：暂停，电量低且未充电");
                    })
                }
                break
            case "关闭程序":
                ui.post(function() {
                    toastLog("停止悬浮窗及PRTS辅助中...")
                    exit();
                }, 200);
                break
        }
    });

    setTimeout(function() {
        events.on("展示文本", function(words, text) {
            if (active_end) {
                return
            }
            switch (words) {
                case "状态":
                    ui.run(function() {
                        window.tos.setText(text);
                    });
                    break;
                case "行动":
                    ui.run(function() {
                        window.tod.setText(text);
                    });
                    break;
                case "理智":
                    ui.run(function() {
                        window.tof.setText(text);
                    });
                    break;
                case "材料":
                    材料显示();
                    break
                default:
                    toast("无法处理传递的悬浮窗展示文本");
                    console.error("无法处理传递的悬浮窗展示文本")
                    break;
            }
        });

        events.on("面板", function(words, xy) {

            switch (words) {
                case "展开":
                    threads.start(function() {

                        展开主界面();
                    })

                    break;
                case "隐藏":
                    threads.start(function() {

                        隐藏主界面();
                    })
                    break;
                case "复位":
                    threads.start(function() {
                        悬浮窗复位();
                    })
                    break;
                case "触摸":
                    xy ? log("修改为可触摸") : log("修改为不可触摸");
                    if (xy) {
                        window.setTouchable(true);
                    } else {
                        window.setTouchable(false);
                    }
                    break
                case "位置":
                    try {
                        if (xy == "统计") {
                            xy = "-500,-500";
                            setTimeout(function() {
                                window.setPosition(layoutAttribute.whole.x, layoutAttribute.whole.y);
                            }, 1500);
                        } else {
                            setTimeout(function() {
                                layoutAttribute.whole.x = window.getX();
                                layoutAttribute.whole.y = window.getY();
                            }, 500)

                        }
                        xy = xy.split(",");
                        let x = Number(xy[0])
                        let y = Number(xy[1])

                        window.setPosition(zoom(x), zoom(y));
                    } catch (err) {
                        toast("设置面板位置异常：" + err)
                        console.error("设置面板位置异常：" + err)
                    }
                    break
                case "浏览器":
                    悬浮浏览器("https://arkn.lolicon.app/#/");
                    //悬浮浏览器("https://prts.wiki/index.php?title=%E5%B9%B2%E5%91%98%E4%B8%80%E8%A7%88&filter=AAACAAAEQAAAAAAAAAAAAAAAAAAAA")
                    break;
                case "材料统计":
                    if (settings == undefined) {
                        web_initialization()
                    }
                    Penguin_statistics()
                    break
            }
        });

        console.verbose("悬浮窗加载完成")
        /*
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
        */

    }, 500);
})