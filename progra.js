importClass(android.content.ComponentName);
runtime.unloadDex('./lib/java/nlp-hanzi-similar-1.3.0.dex');
runtime.loadDex('./lib/java/nlp-hanzi-similar-1.3.0.dex');

var tool = require("./modules/tool.js");
var setting = tool.readJSON("configure");
var package_path = context.getExternalFilesDir(null).getAbsolutePath();
var {
    getRotation,
    getWidthHeight,
    iStatusBarHeight,
    isHorizontalScreen,
} = require('./modules/__util__.js');
//不能使用{function} = 导入方式，否则press会循环无效执行，
var MyAutomator = require("./modules/MyAutomator.js");
MyAutomator.setTapType(setting["operation_mode"])
var 唤醒 = require("./common/唤醒.js");

var agent = 0,
    /**
     * 在线程中运行重要逻辑可以避免events无法监听通知
     */
    threadMain,
    temporary_xy,
    Material_data,
    Material_await;
var height = device.height,
    width = device.width;

if (width > height || setting.模拟器) {
    height = device.width,
        width = device.height;
} else {
    if (setting.坐标) {
        setScreenMetrics(width, height);
    }
}
console.info("设备宽：" + width + "，高：" + height + "。是否横屏：" + isHorizontalScreen());


var zox = (value) => {
        return Math.floor((height / 2712) * value);
    },
    zoy = (value) => {
        return Math.floor((width / 1220) * value);
    };
var displayText = JSON.parse(
    files.read("./lib/game_data/displayText.json", (encoding = "utf-8"))
);
if (setting.企鹅统计 && setting.指定材料) {
    Material_data = tool.readJSON("material_await_obtain");
    try {
        if (Material_data.name.length == 0) {
            Material_data = undefined
        }
    } catch (err) {
        Material_data = undefined
    }
}

events.on("暂停", function(words) {
    log(words);
    if (words == "继续") {
        Material_await = "允许";
        return
    }
    device.cancelKeepingAwake()
    threads.shutDownAll();
    exit();
});


var Combat_report = require("./subview/Combat_report.js");
if (setting.image_memory_manage) {
    // 用于代理图片资源，请勿移除 否则需要手动添加recycle代码
    log("加载图片资源管理程序");
    require('./lib/ResourceMonitor.js')(runtime, this)
}


log("加载图片识别程序");
var ITimg = require("./ITimg.js"); //读取识图库

new ITimg.Prepare({}, {
    correction_path: "通用",
    picture_failed_further: true,
    similar: 0.75,
    saveSmallImg: true,
    visualization: setting.调试,
}, {}, {
    threshold: 0.75,
    filter_w: zox(20),
    filter_h: zoy(20),
    saveSmallImg: true,
    scale: 1,
    visualization: setting.调试,
}, setting);


//images.save(ITimg.captureScreen_(),"./nn.png");

var taglb;


if (setting.监听键 != "关闭") {
    threads.start(function() {
        sleep(100);
        events.observeKey();
        if (setting.监听键 == "音量上键") {
            events.setKeyInterceptionEnabled("volume_up", true);
        } else if (setting.监听键 == "音量下键") {
            events.setKeyInterceptionEnabled("volume_down", true);
        }
        events.on("key_down", function(keyCode, events) {
            if (keyCode == keys.volume_up && setting.监听键 == "音量上键") {
                toastLog("音量上键被按下，PRTS辅助将停止运行");
                tool.Floaty_emit("展示文本", "状态", "状态：暂停，音量上键按下");
                tool.Floaty_emit("暂停", "结束程序");
            } else if (keyCode == keys.volume_down && setting.监听键 == "音量下键") {
                toastLog("音量下键被按下，PRTS辅助将停止运行");
                tool.Floaty_emit("展示文本", "状态", "状态：暂停，音量下键按下");
                tool.Floaty_emit("暂停", "结束程序");
            }
        });

    });
}

if (ITimg.exit) {
    sleep(3000);
}

程序(setting.执行);


function 启动应用(package_) {
    if (package_ == undefined) {
        if (ITimg.language == "日服" || ITimg.language == "美服") {
            console.error("暂不支持启动 " + ITimg.language + " 方舟应用")
            return [false, ITimg.language]
        }
    } //api

    tool.Floaty_emit("展示文本", "状态", "状态：准备启动应用");
    // Combat_report.record("启动了明日方舟");
    if (typeof package_ == "string") {
        console.verbose(package_)
        setting.包名 = package_;
    }

    if (!app.getAppName(setting.包名)) {
        console.error("包名应用未安装:", setting.包名, "，默认启动官服");
        setting.包名 = "com.hypergryph.arknights";
    }
    let getpackage = tool.currentPackage();

    let package_names_list = [setting.包名, 'com.hypergryph.arknights',
        '_com.hypergryph.arknights',
        'com.hypergryph.arknights.bilibili',
        'tw.txwy.and.arknights'
    ]
    console.verbose("前台应用包名：" + getpackage)
    if (getpackage == null) {
        toastLog("暂时无法获取前台应用，默认启动")

    } else {

        for (let package_names of package_names_list) {
            if (package_names == getpackage) {
                getpackage = true;
                break
            }
        }
        if (getpackage === true) {
            return true;
        }

    }
    var gmvp = device.getMusicVolume();

    console.verbose("启动应用包名:" + setting.包名)

    toastLog("启动" + app.getAppName(setting.包名) + "中，等待启动完成");

    tool.launchPackage(setting.包名);

    sleep(3000);
    getpackage = tool.currentPackage();
    switch (getpackage) {
        case setting.包名:
        case "_" + setting.包名:
            break
        default:
            console.error("未匹配到的包名:" + getpackage + "，重新启动");

            function uiLaunchApp(appName) {
                var script = '"ui";\nvar args = engines.myEngine().execArgv;\nlet appName = args.appName;\app.launchPackage(appName);exit();';
                engines.execScript("uiLaunchApp", script, {
                    arguments: {
                        appName: appName
                    }
                });
            }

            uiLaunchApp(setting.包名);
            break
    }
    let start_request = (text("启动应用").findOne(500) || id("permission_group_title").findOne(500));
    if (start_request) {
        log("自动允许启动应用");
        className("android.widget.Button").text("允许").findOne().click();
    }
    if (setting.音量) {
        tool.writeJSON("当前音量", gmvp);
    }

    threads.start(function() {
        if (setting.音量) {
            device.setMusicVolume(0)
        } else if (setting.音量修复) {
            device.setMusicVolume(Number(gmvp))
        }
    })
    return true;

}


function 程序(implem) {
    threadMain = threads.start(function() {
        if (ITimg.exit) {
            return;
        }
        switch (setting.侧边) {
            case "基建":
                auto();
                Combat_report.record("开始运行PRTS辅助，执行模式：基建收菜");
                threadMain = threads.start(基建);
                return;
            case "公招":
                Combat_report.record("开始运行PRTS辅助，执行模式：公招识别");
                if (typeof 公招 == "undefined") {
                    公招 = require("./common/公招.js");
                }
                公招.main();
                return;
        }
        auto();
        Combat_report.record("开始运行PRTS辅助，执行模式：" + setting.执行);
        sleep(600);

        ITimg.重置计时器(true);
        if (setting.start) {
            启动应用(true);
        }
        switch (setting.执行) {
            case "常规":
            case "行动":
                关卡代理 = require("./common/关卡代理.js");
                指定关卡 = require("./common/指定关卡.js");
                if (setting.指定关卡.levelAbbreviation == "当前") {
                    Combat_report.record("关卡选择:当前");
                    关卡代理.普通();
                } else if (setting.指定关卡.levelAbbreviation == "上次") {
                    if (ITimg.language == "日服" || ITimg.language == "美服") {
                        toastLog("上次作战程序已知并不适用于日服/美服，已为您跳转行动");
                        关卡代理.普通();
                        break
                    }
                    Combat_report.record("关卡选择:上次");
                    唤醒.main();
                    if (指定关卡.上次作战()) {
                        关卡代理.普通();
                    } else {
                        tips = "上一次作战是每周剿灭委托，已为你跳过行动程序，执行基建程序";
                        console.warn(tips);
                        toast(tips);

                        if (setting.震动) device.vibrate(1000);
                        threadMain.interrupt();
                        threadMain = threads.start(基建);
                    }

                } else {
                    唤醒.main();
                    if (指定关卡.main(setting.指定关卡)) {
                        关卡代理[(setting.执行 == "剿灭" ? "剿灭" : "普通")]()

                    } else {
                        console.error("自动选择关卡失败");
                    }
                }

                break;

            case "剿灭":
                //  threadMain.interrupt();
                //  threadMain = threads.start(剿灭);
                //break;
            case "定时剿灭":
                关卡代理 = require("./common/关卡代理.js");

                if (setting.指定关卡.levelAbbreviation == "当前") {
                    Combat_report.record("关卡选择:当前剿灭");
                    关卡代理[(setting.执行 == "剿灭" ? "剿灭" : "普通")]()

                } else {
                    指定关卡 = require("./common/指定关卡.js");
                    setting = tool.writeJSON("已执行动", 0);
                    唤醒.main();
                    if (指定关卡.main(setting.指定关卡)) {
                        关卡代理[(setting.执行 == "剿灭" ? "剿灭" : "普通")]()
                    } else {
                        console.error("自动选择关卡失败");
                    }
                }
                break;
            case "基建":
            case "定时基建":
                threadMain.setName("上次作战");
                唤醒.main();
                toastLog("启动基建收菜程序");

                tool.Floaty_emit("展示文本", "状态", "状态：查找基建/导航等");
                threadMain.interrupt();
                threadMain = threads.start(基建);
                break;

            case "自定义模块":
                threadMain = threads.start(自定义)
                break;
        }

        // Combat_report.record("开始运行PRTS辅助，执行模式：" + implem);
    });
}


function 自定义() {
    let mod_data = storages.create("modular").get("modular", []);
    tool.Floaty_emit("展示文本", "状态", "状态：开始执行自定义模块");

    ITimg.重置计时器(false);
    try {
        let customize;
        for (let _modular_ of mod_data) {
            if (_modular_.script_name == setting.自定义模块) {
                customize = _modular_;
                break;
            }
        }

        if (customize) {
            require(customize.path).main_entrance({
                'cwd': customize.path.replace(files.getName(customize.path), ""),
                'getSource': customize.path,
                'ITimg': ITimg,
                'get_onstage_package': tool.currentPackage,
                'startup_app': 启动应用,
                'startup_mode': 程序,

            });
        };

    } catch (e) {
        let tips = "自定义执行模式模块发生异常，，请检查:\n" + $debug.getStackTrace(e);
        console.error(tips + "\n" + e);
        toast(tips);
        tool.Floaty_emit("展示文本", "状态", "状态：自定义模块发生异常");
        tool.Floaty_emit("暂停", "结束程序");
    };

}

function 关闭应用(getmode, getstate) {
    let mod_data = storages.create("modular").get("modular", []);
    try {

        let gbyyan = mod_data.find((item) => item.id == "关闭应用");
        if (gbyyan) {
            if (gbyyan.suspend) {
                console.warn("已暂时停止运行关闭应用模块")
                return false
            }
            tool.Floaty_emit("展示文本", "状态", "状态：执行关闭应用中");

            require(gbyyan.path).main_entrance({
                'cwd': gbyyan.path.replace(files.getName(gbyyan.path), ""),
                'getSource': gbyyan.path,
                'ITimg': ITimg,
                'get_onstage_package': tool.currentPackage,
                'startup_app': 启动应用,
                'startup_mode': 程序,
                'get_implement_mode': getmode,
                'get_implement_state': getstate,
            });
        }

        toastLog("关闭应用执行完成");
        gbyyan = null;
    } catch (e) {
        gbyyan = null;
        let tips = "自定义关闭应用模块发生异常，请检查:\n" + $debug.getStackTrace(e);
        console.error(tips + "\n" + e);
        toast(tips);
        tool.Floaty_emit("展示文本", "状态", "状态：暂停，关闭应用异常");
    }
    sleep(200);
    tool.Floaty_emit("暂停", "关闭应用后结束程序");

}

function 基建换班(fatigue_state) {
    let mod_data = storages.create("modular").get("modular", []);
    let shift = mod_data.find((item) => item.id == "基建换班");
    if (shift) {
        if (shift.suspend) {
            console.warn("已暂停运行基建换班模块")
            return false;
        }
        MyAutomator.click(height / 2, 50)
        tool.Floaty_emit("展示文本", "状态", "状态：执行基建换班中")
        try {
            ITimg.重置计时器(false);
            require(shift.path).main_entrance({
                //'start_position':value,
                'cwd': shift.path.replace(files.getName(shift.path), ""),
                'getSource': shift.path,
                'ITimg': ITimg,
                'get_onstage_package': tool.currentPackage,
                'startup_app': 启动应用,
                // 'startup_mode':程序,
                'fatigue_worker': fatigue_state,
            });
            toastLog("基建换班执行完成");

            ITimg.重置计时器(true);
            jijian = null;

        } catch (e) {
            sleep(1000)
            jijian = null;
            ITimg.重置计时器(true);
            let tips = "自定义基建换班模块发生异常，请检查:\n" + e;

            console.error(tips + "\n" + e);
            toast(tips);
            sleep(2000)
        }
    }
    if (!ITimg.matchFeatures("导航", {
            action: 0,
            timing: 1500,
            area: "左半屏",
        })) {
        ITimg.matchFeatures("导航2", {
            action: 0,
            timing: 1500,
            area: "左半屏",
        })
    }
    ITimg.matchFeatures("导航_基建", {
        action: 0,
        timing: 500,
        area: "上半屏",
    });

}



function 统计(target, attach, exterminate) {
    switch (target) {
        case "次数":
            if (Material_data) {
                tool.Floaty_emit("展示文本", "行动", (exterminate ? "剿灭：" : "行动：") + setting.已执行动 + "/" + (exterminate ? setting.剿灭 : setting.行动) + "， 理智：" + setting.已兑理智 + "/" + setting.理智);

            } else {
                tool.Floaty_emit("展示文本", "行动", (exterminate ? "剿灭：" : "行动：") + "执行" + setting.已执行动 + "次&上限" + (exterminate ? setting.剿灭 : setting.行动) + "次");
                tool.Floaty_emit("展示文本", "理智", "理智：已兑" + setting.已兑理智 + "次&上限" + setting.理智 + "次");

            }
            break
        case "行动":

            if (Material_data) {
                tool.Floaty_emit("展示文本", "行动", (exterminate ? "剿灭：" : "行动：") + setting.已执行动 + "/" + (exterminate ? setting.剿灭 : setting.行动) + "， 理智：" + setting.已兑理智 + "/" + setting.理智);
            } else {
                tool.Floaty_emit("展示文本", "行动", (exterminate ? "剿灭：" : "行动：") + "执行" + setting.已执行动 + "次&上限" + setting.行动 + "次");
            }
            break
        case "理智":
            if (Material_data) {
                tool.Floaty_emit("展示文本", "行动", (exterminate ? "剿灭：" : "行动：") + setting.已执行动 + "/" + (exterminate ? setting.剿灭 : setting.行动) + "， 理智：" + setting.已兑理智 + "/" + setting.理智);

            } else {
                tool.Floaty_emit("展示文本", "理智", "理智：已兑" + setting.已兑理智 + "次&上限" + setting.理智 + "次");

            }
            break
    }
    switch (attach) {
        case "显示材料":
            tool.Floaty_emit("展示文本", "材料")
            break;
    }
}

function 跳转_暂停(suspended, status, literals) {

    sleep(50);
    便笺(1000);
    press(height / 2, zoy(50), 100);

    if (setting.执行 == "行动" || suspended) {
        end_task(status, literals)

    } else {
        sleep(800);
        MyAutomator.click(height / 2, zoy(100));
        threadMain.interrupt();
        threadMain = threads.start(基建);
    }
    return
}

function end_task(status, literals) {
    if (!关闭应用(setting.执行, status)) {
        tool.Floaty_emit("展示文本", "状态", "状态：" + literals);
    }

    if (setting.震动) {
        device.vibrate(1000);
    };
    let auto_action = require("./modules/auto_action.js");
    if (setting.end_action.home) {
        auto_action.home();
    };
    if (setting.end_action.lock_screen) {
        auto_action.lock_screen();
    }
    tool.Floaty_emit("暂停", "结束程序");
    sleep(5000);
}

function 便笺(sleep_, tag, hour, type) {
    if (sleep_ == undefined) {
        sleep_ = 1000;
    }
    let morikujima_setting = tool.readJSON("morikujima_setting");
    // console.info(morikujima_setting)
    if (morikujima_setting == undefined) {
        return
    }
    if (type) {

        if (morikujima_setting.公招 == true) {

            for (i in morikujima_setting.gz_list) {
                if (morikujima_setting.gz_list[i].位置 == sleep_) {
                    morikujima_setting.gz_list[i].时间 = new Date();
                    morikujima_setting.gz_list[i].小时 = hour;
                    morikujima_setting.gz_list[i].tag = tag;
                    return
                }
            }
            morikujima_setting.gz_list.push({
                位置: sleep_,
                时间: new Date(),
                小时: hour,
                tag: tag,
            })
            tool.writeJSON("gz_list", morikujima_setting.gz_list, "morikujima_setting")
        }
        return
    }
    if (morikujima_setting.自动识别 == true) {
        if (!ITimg.initocr()) {
            toast("ocr不可用")
            console.error("ocr不可用")
            return false
        }
        tool.Floaty_emit("展示文本", "状态", "状态：等待识别理智中...");

        sleep(sleep_)
        taglb = ITimg.ocr("获取屏幕文字", {
            action: 6,
            area: [Math.floor(height / 1.3), 0, height - Math.floor(height / 1.3), 100],
        });
        for (i in taglb) {
            if (taglb[i].text.indexOf("/") != -1) {
                console.info("剩余理智数：" + taglb[i].text)

                tool.writeJSON("已有理智", taglb[i].text.split("/")[0], "morikujima_setting")
                tool.writeJSON("理智数", taglb[i].text, "morikujima_setting")
                tool.writeJSON("理智时间", new Date(), "morikujima_setting")
            }
        }
        tool.Floaty_emit("展示文本", "状态", "状态：理智识别完成");

    }

}


function 基建() {
    /**
     * 干员疲劳状态
     */
    tool.Floaty_emit("面板", "复位");
    toastLog("2秒后启动基建收菜程序");
    threadMain.setName("基建收菜");
    sleep(1000);
    setting = tool.readJSON("configure");
    tool.Floaty_emit("展示文本", "状态", "状态：执行基建收菜中");
    基建任务 = require("./common/基建任务.js");

    if (基建任务.main()) {

        基建任务.确认已进入基建页面();

        let agency = 基建任务.待办处理();

        基建换班(基建任务.fatigue_state);
        console.info("无人机加速" + setting.无人机加速)
        if (agency) {
            基建任务.无人机加速();

            基建任务.会客室线索处理();
        }
        基建任务.访问好友();
    }

    if (typeof 信用处理 == "undefined") {
        信用处理 = require("./common/信用点处理.js");
    }
    信用处理.main(setting);
    log("自动公招" + setting.公招);

    if (setting.公招) {
        if (typeof 公招 == "undefined") {
            公招 = require("./common/公招.js");
        }
        公招.main();
    }
    if (setting.claim_rewards && setting.claim_rewards.daily) {
        if (typeof 领取奖励 == "undefined") {
            领取奖励 = require("./common/领取奖励");
        }
        领取奖励.任务();
    }
    if (公招 && 公招.recruit_tag[0] && 公招.recruit_tag[0].星级) {
        let tag_json = '';
        for (let tag_ of recruit_tag) {
            tag_json += tag_.名称 + " 标签，" + tag_.星级 + ", "
        }
        sleep(1000);
        dialogs.build({
            title: 公招.recruit_tag[0].名称,
            titleColor: "#FF4500",
            content: "公开招募发现\n" + tag_json + "\n\n请前往确认！注意拉满九个小时\n点下方前往公招计算按钮即可通过悬浮窗浏览器直达PRTS公招计算快捷查看tag组合能出哪些干员",
            positive: "注意拉满九小时",
            positiveColor: "#FFA500",
            neutral: "前往公招计算",
            canceledOnTouchOutside: false,
        }).on("neutral", () => {
            tool.Floaty_emit("面板", "浏览器");
        }).show();
        sleep(100);
        tool.Floaty_emit("展示文本", "状态", "状态：主程序暂停中");
        sleep(200);
    }

    end_task(setting.执行, "领取任务奖励后暂停")

}


function 等待提交反馈至神经() {
    console.verbose('---等待提交反馈至神经---');
    sleep(200);
    let staging_result = ITimg.ocr("正在提交反馈至神经", {
        action: 6,
        area: "下半屏",
        part: true,
        threshold: 0.9,
        //    saveSmallImg:false,
    })
    if (staging_result && staging_result.matches && staging_result.matches.length) {
        return true;
    } else {
        staging_result = ITimg.ocr("正在提交反馈至神经", {
            action: 6,
            area: "下半屏",
            saveSmallImg: false,
        })
    }
    var to_match = ['正在提交反馈至神经', '提交反馈', '提交', '反馈', '神经']
    for (let i in to_match) {
        if (ITimg.ocr(to_match[i], {
                action: 5,
                part: true,
                refresh: false,
                log_policy: true,
                saveSmallImg: false,
                gather: staging_result,
            })) {

            return true;
        }

    }
    //false跳出while
    return false
}