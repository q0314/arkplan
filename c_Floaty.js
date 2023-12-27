importClass(android.content.Context);

importClass(android.content.ContextWrapper);
importClass(android.view.WindowManager)


//启动一个线程用于处理可能阻塞UI线程的操作
var blockHandle = threads.start(function() {
    setInterval(() => {}, 1000);
});
let tool = require("./modules/tool.js");
let setting = tool.readJSON("configure");
let progra;
let gallery_info = JSON.parse(files.read("./mrfz/tuku/gallery_info.json"), (encoding = "utf-8"));
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
        w: zoom(650),
        h: zoom(240),
        iniX: zoom(65),
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
};

//设置顶部功能键图标
var 功能图标 = [
    "@drawable/ic_pause_circle_outline_black_48dp",
    "file://./res/ic_Rational_exchange_black_48dp.png",
    "@drawable/ic_assignment_ind_black_48dp",
    "@drawable/ic_settings_applications_black_48dp",
    "@drawable/ic_power_settings_new_black_48dp",
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

function record(text, time) {
    try {
        Combat_report
        if (Combat_report == undefined) {
            return;
        }
    } catch (err) {
        return
    }
    Combat_report.record(text, time);
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
                    <text id="name" marginLeft="{{zoom(25)}}px" w="{{zoom(460)}}px" text="加载中..." textColor="{{layoutAttribute.setColor.theme}}" textSize="{{zoom(40)}}px" gravity="center_vertical"/>
                    <horizontal w="*" gravity="right">
                        <grid id="设置" w="auto" h="auto" spanCount="5" layout_gravity="right">
                            <img  text="1" w="{{zoom(75)}}px" h="*" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                        </grid>
                    </horizontal>
                    
                </frame>
                <frame id="xxbj" w="*" h="*">
                    <text id="tos" text="状态：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="top"/>
                    <text id="tod" text="行动：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="center"/>
                    <text id="tof" text="理智：信息待更新中" textColor="{{layoutAttribute.setColor.toast}}" textSize="{{zoom(45)}}px" h="auto" layout_gravity="bottom"/>
                    <frame w="auto" h="auto" marginRight="{{zoom(3)}}px" layout_gravity="center_vertical|right">
                        <list id="optionList" w="*" h="auto">
                            <img id="option" w="{{zoom(70)}}px" h="{{zoom(80)}}px" src="{{this}}" tint="{{layoutAttribute.setColor.theme}}" />
                        </list>
                    </frame>
                </frame>
                <vertical id="xxbr"  padding="{{zoom(5)}}px" bg="#00BFFF" h="0px" visibility="gone">
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


    /*
      log(params)
      if (params.flags == 83887656) {
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
    return window;
}

function 悬浮窗监听(window) {
    //初始化悬浮窗及悬浮窗操作对象
    ui.post(() => {
        window.setTouchable(true);
        window.设置.setDataSource(功能图标);
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
                if (获取屏幕方向() == "竖屏") {
                    maxSwipeW = screenAttribute.w - window.getWidth();
                    maxSwipeH = screenAttribute.h - window.getHeight();
                } else {
                    maxSwipeW = screenAttribute.h - window.getWidth();
                    maxSwipeH = screenAttribute.w - window.getHeight();
                }

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

    var sto_mod = storages.create("modular");
    //sto_mod.clear()
    var mod_data = sto_mod.get("modular", []);
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
    let delay = true;
    window.设置.on("item_click", function(icon) {
        switch (icon) {
            case 功能图标[0]:
                if (delay) {
                    if (功能图标[0] == "@drawable/ic_pause_circle_outline_black_48dp") {
                        eliminate = false;
                        threads.start(暂停);
                        $ui.post(() => {
                            window.tos.setText("状态：主程序暂停中");
                        }, 200)
                    } else {
                        eliminate = true;
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
                    if (功能图标[0] == "@drawable/ic_pause_circle_outline_black_48dp") {
                        toast("请点击" + window.name.text() + "右侧的图标暂停\n然后再来尝试执行公招识别程序");
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
                toastLog("纯净版不可用")
                break;
            case 功能图标[4]:
                    eliminate = true;
                    暂停(true);
                    $settings.setEnabled('foreground_service', false);
                    threads.shutDownAll();
                    toastLog("主动关闭PRTS辅助及悬浮窗口");
                    setTimeout(function() {
                        exit();
                    }, 200);
                
                break;
        }

    });
    window.optionList.on("item_click", function(icon) {

        switch (icon) {
            case optionList[0]:
                if (optionList[0] == "@drawable/ic_assignment_black_48dp") {
                    Combat_report.view_show();
                    return
                }
                if (功能图标[0] == "@drawable/ic_pause_circle_outline_black_48dp") {
                    toast("请先点击" + window.name.text() + "右侧的图标暂停");
                    return;
                };
                tool.writeJSON("侧边", "基建");
                继续();
                break;
            case optionList[1]:
                toastLog("纯净版不可用")
                return
                if (功能图标[0] == "@drawable/ic_pause_circle_outline_black_48dp") {
                    toast("请先点击" + window.name.text() + "右侧的图标暂停");
                    return;
                };
                //  tool.writeJSON("侧边", "任务")
                break;
        };
    });

    window.webview.on("touch_down", () => {
        window.requestFocus(); // window.webview.requestFocus();
    });


 };


//重写对话框
function 执行次数() {
    setting = tool.readJSON("configure")
    let rewriteView = ui.inflate(
        <vertical padding="10 0">
            <View bg="#ffffff" h="1" w="auto"/>
            <card w="*" id="indx2" margin="0 0 0 1" h="45dp" cardCornerRadius="0"
            cardElevation="3dp" gravity="center_vertical"  >
            
            <linear clipChildren="false" elevation="0" gravity="center_vertical" >
                <spinner id="implement" layout_gravity="center" layout_weight="1" entries="手动指定关卡+基建|只执行行动刷图|只执行基建收菜|执行剿灭作战+基建|执行上一次作战"/>
            </linear>
        </card>
        <View bg="#000000" h="1" w="auto"/>
        <Switch id="ysrh" checked="{{setting.only_medicament}}" text="仅使用药剂恢复理智" padding="6 6 6 6" textSize="16sp"/>
        <horizontal gravity="center" marginLeft="5">
            <text id="mr1" text="刷图上限:" textSize="15" textColor="#212121"/>
            <input id="wordname3" inputType="number" hint="{{setting.剿灭}}次" layout_weight="1" visibility="gone" paddingLeft="6" w="auto"/>
            <input id="wordname" inputType="number" hint="{{setting.行动}}次" layout_weight="1" paddingLeft="6" w="auto"/>
            <text id="mr2" text="磕药/碎石:" textSize="15" textColor="#212121"/>
            <input id="wordname2" inputType="number" hint="{{setting.理智}}个" layout_weight="1" w="auto"/>
        </horizontal>
        <linear >
            <card id="WaitForRun" w="35" h="35" cardCornerRadius="25dp" cardElevation="0dp" margin="5 0"
            layout_gravity="right"  cardBackgroundColor="#03a9f5" foreground="?attr/selectableItemBackground" clickable="true">
            <linear gravity="center">
                <img
                id="icon"
                w="25" h="25"
                tint="#ffffff"
                src="@drawable/ic_delete_forever_black_48dp"
                />
            </linear>
        </card>
        <button id="buiok" text="确认设置"  margin="0 -5 0 -4" layout_weight="1" style="Widget.AppCompat.Button.Colored" h="auto"/>
        </linear>
        </vertical>, null, false);
    var rewriteDialogs = dialogs.build({
        customView: rewriteView,
        wrapInScrollView: false,
        autoDismiss: true
    }).on("dismiss", (dialog) => {
        rewriteView = null;
        rewriteDialogs = null;
    })

    rewriteView.ysrh.on("check", (checked) => {
        tool.writeJSON("only_medicament", checked);
    });
    rewriteView.buiok.on("click", () => {
        输入框事件()
    });
    rewriteView.WaitForRun.on("click", () => {
        tool.writeJSON("已执行动", "0");
        toastLog("清空已执行动记录")
        setting = tool.readJSON("configure");
        ui.run(function() {
            rewriteView.WaitForRun.setVisibility(8)
            if (setting.执行 != "剿灭") {
                window.tod.setText("行动：执行" + setting.已执行动 + "次&上限" + setting.行动 + "次");
            } else {
                window.tod.setText("剿灭：执行" + setting.已执行动 + "次&上限" + setting.剿灭 + "次");
            }
        })

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
 
   let language = (gallery_info.服务器 ? gallery_info.服务器 : gallery_info.server);

    //if(setting.执行== "自定义模块"){
    function Multistage_menu() {

       
        switch (true) {
            case language == "日服":
            case language == "美服":
                language = "禁用服";
                break;
        }

        if (setting.custom.length >= 5 && language == "禁用服") {
            return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建", "执行自定义模块"]
        } else if (setting.custom.length >= 5 && language != "禁用服") {
            return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建", "执行上一次作战", "执行自定义模块"]
        } else if (language == "禁用服") {
            return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建"]

        } else {
            return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建", "执行上一次作战"]
        }

    }
    //   rewriteView.implement.attr("entries",mCountries)
    adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, Multistage_menu());
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    rewriteView.implement.setAdapter(adapter);

    switch (setting.执行) {
        case '常规':
            rewriteView.implement.setSelection(0);
            break
        case '行动':
            rewriteView.implement.setSelection(1);
            break;
        case '基建':
            rewriteView.implement.setSelection(2);
            break;
        case '剿灭':
            rewriteView.implement.setSelection(3);
            rewriteView.wordname.attr("visibility", "gone")
            rewriteView.wordname3.attr("visibility", "visible");

            break;
        case '上次':
            rewriteView.implement.setSelection(4, true);
            break;
        case '自定义模块':
            if (language != "禁用服") {
                rewriteView.implement.setSelection(5, true);
            } else {
                rewriteView.implement.setSelection(4, true);

            }
            break;
    };

    rewriteDialogs.show()
    var my_Adapter = new android.widget.AdapterView.OnItemSelectedListener({
        onItemSelected: function(parent, view, position, id) {
            ui.run(function() {
                let r = parent.getSelectedItem();
                if (r == "执行剿灭作战+基建") {
                    rewriteView.wordname.attr("visibility", "gone")
                    rewriteView.wordname3.attr("visibility", "visible");

                } else {
                    rewriteView.wordname3.attr("visibility", "gone")
                    rewriteView.wordname.attr("visibility", "visible");

                }

            })
        }
    })
    rewriteView.implement.setOnItemSelectedListener(my_Adapter);

    function 输入框事件() {
        var Executionsettingss = rewriteView.implement.getSelectedItemPosition();
        switch (Executionsettingss) {
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
                if (language != "禁用服") {
                    tool.writeJSON("执行", "上次");
                } else {
                    tool.writeJSON("执行", "自定义模块");

                }
                break;
            case 5:
                tool.writeJSON("执行", "自定义模块");
                break;
        };

        var rwt = rewriteView.wordname.text(),
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
                case "上次":
                    window.name.setText("上次作战");
                    break;
                case "定时剿灭":
                    window.name.setText("定时剿灭");
                    break;
                case "自定义模块":
                    window.name.setText("明日计划");
                    break;
            }

        });
        rewriteDialogs.dismiss();

    }
}


function 暂停(form) {
    //  themeJs = "night";
    form = form || "无";
    功能图标[0] = "@drawable/ic_play_circle_outline_black_48dp";

    ui.run(function() {
        window.设置.setDataSource(功能图标);
    });
    //判断不是手动暂停的
    if (eliminate == true && setting.侧边 != "公招") {
        tool.writeJSON("已执行动", 0)
        try {
            tool.writeJSON("理智", 0);
            if (setting.音量 == true && setting.当前音量 != false) {
                device.setMusicVolume(Number(setting.当前音量))
                tool.writeJSON("当前音量", false);
            }
        } catch (err) {
            console.error("恢复音量失败" + err)
        }

        tool.writeJSON("已兑理智", 0)
    }
    tool.writeJSON("侧边", "0")

    progra = tool.script_locate("progra");
    if (progra) {
        progra.emit("暂停", "结束程序");
    }
   
    setTimeout(function() {
        progra = tool.script_locate("progra");
        if (progra) {
            progra.emit("暂停", "结束程序");
        }
    }, 300);
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
        window.设置.setDataSource(功能图标);
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
    layoutAttribute.homepage.show = true;
    ui.post(() => {
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
    if(!window){
        return;
    }
    try{
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
}catch(e){
    console.error("悬浮窗复位出错:",e);
}
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
        if (this.cutter_package) {
            let getDirection = 获取屏幕方向();
            if (getDirection != screenAttribute.direction) {
                screenAttribute.direction = getDirection;
                // screenAttribute.direction == "竖屏" ? (screenAttribute.w = device.width, screenAttribute.h = device.height - screenAttribute.titleH) : (screenAttribute.h = device.width, screenAttribute.w = device.height - screenAttribute.titleH);
                threads.start(function () {
                    悬浮窗复位();
                })
            };
        }
    }, 1500);
    setInterval(() => {
        ui.run(() => {
            if (setting.offset && window) {
                window.setPosition(zoom(random(layoutAttribute.whole.iniX, layoutAttribute.whole.iniX + 20)), zoom(random(layoutAttribute.whole.iniY, layoutAttribute.whole.iniY + 20)))
            }
        })
    }, 300 * 1000)
};


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
        ui.post(()=>{
            console.verbose("开始运行")
            engines.execScript("PRTS辅助", "require('./progra.js');");
        },200)
        setTimeout(function() {
            if (eliminate != false) {
                if (tool.script_locate("progra") == false ){
                    if (files.read("./mrfz/Byte.txt") == "true") {
                        files.write("./mrfz/Byte.txt", false)
                        return;
                    }
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
            }
            return
        }, 6000);

    }
}


events.on("暂停", function(words) {
    eliminate = true;
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
                Floaty.emit("展示文本", "状态", "状态：暂停，电量低且未充电");
            }
            break
        case "关闭程序":
            toastLog("停止悬浮窗及PRTS辅助中...")
            exit();
            break
    }
});

setTimeout(function() {
    events.on("展示文本", function(words, text) {
        if (eliminate == false) {
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
                toastLog("纯净版不支持浏览器")
               break;
            case "材料统计":
          toastLog("纯净版不支持材料统计")
                break
        }
    });

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


}, 500);

threads.start(function(){
    setInterval(() => {
        ui.run(() => {
            if (setting.offset && window) {
                window.setPosition(zoom(random(65, 80)), zoom(random(130, 160)))
            }
        })
    }, 300 * 1000)
})