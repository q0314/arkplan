importClass(android.content.ComponentName);
runtime.unloadDex('./lib/java/nlp-hanzi-similar-1.3.0.dex');
runtime.loadDex('./lib/java/nlp-hanzi-similar-1.3.0.dex');

var tool = require("./modules/tool.js");
var setting = tool.readJSON("configure");
let path_ = context.getExternalFilesDir(null).getAbsolutePath();
var {
    getRotation,
    getWidthHeight,
    iStatusBarHeight,
    isHorizontalScreen,
} = require('./modules/__util__.js');
//不能使用{function} = 导入方式，否则press会循环无效执行，
var MyAutomator = require("./modules/MyAutomator.js");
MyAutomator.setTapType(setting["operation_mode"])

var agent = 0,
    /**
     * 在线程中运行重要逻辑可以避免events无法监听通知
     */
    threadMain,
    temporary_xy,
    Material_data,
    Material_await,
    recruit_tag = [];
var height = device.height,
    width = device.width;

if (width > height || setting.模拟器) {
    height = device.width,
        width = device.height;
} else {
    if (setting.坐标) {
        setScreenMetrics(width, height);
    };
};
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


let Combat_report = require("./subview/Combat_report.js");
if (setting.image_memory_manage) {
    // 用于代理图片资源，请勿移除 否则需要手动添加recycle代码
    log("加载图片资源管理程序");
    require('./lib/ResourceMonitor.js')(runtime, this)
}


log("加载图片识别程序");
var ITimg = require("./ITimg.js"); //读取识图库

new ITimg.Prepare({}, {
    correction_path: "通用"
});



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

    var gmvp = device.getMusicVolume();
    sleep(500);
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
    switch (tool.currentPackage()) {
        case setting.包名:
        case 'com.hypergryph.arknights':
            return
        case 'com.hypergryph.arknights.bilibili':
            return
        case 'tw.txwy.and.arknights':
            return
        case null:
            toastLog("暂时无法获取前台应用，默认启动")
            break;
    }
    log("启动应用包名:" + setting.包名)

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

let collection = {
    main(list) {
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
        let selectResult;
        for (let id of level_choices) {
            //检验是否选择的关卡
            if (typeof id.abbreviation == "object") {
                let abbResult;
                for (let k in id.abbreviation) {
                    if (list.levelAbbreviation == k) {
                        abbResult = true;
                        break
                    };
                }
                if (!abbResult) {
                    continue;
                }
            } else {
                if (list.levelAbbreviation != id.abbreviation) {
                    continue;
                };
            }

            if (id.name && isOpen(id)) {
                console.trace(id.abbreviation);
                selectResult = this.资源本(id["name"], id.level ? id.level : id.abbreviation[Object.keys(id.abbreviation).find(key => key == list.levelAbbreviation)]);
                break
            } else if (id.id) {
                selectResult = this[id.id]((list.levelAbbreviation == displayText["龙门外环"]) ? true : false);
                if (selectResult) {
                    if (id.id == "指定剿灭") {
                        setting.执行 = "剿灭";
                    }
                }
                break
            }

        };

        if (selectResult) {
            return true;

        } else {
            tool.Floaty_emit("展示文本", "状态", "状态：自动选择关卡失败.");
            return false;
        }
    },
    /**
     * 进入终端界面并选择事务
     * @param {string} affairs - 选择终端事务
     */
    终端事务(affairs) {
        while (true) {
            tool.Floaty_emit("展示文本", "状态", "状态: 进入终端");
            if (ITimg.ocr(displayText["终端"], {
                    action: 0,
                    timing: 1000,
                    area: 2,
                }) || ITimg.ocr(displayText["当前"], {
                    action: 0,
                    timing: 1000,
                    area: 2,
                    log_policy: true,
                    refresh: false,
                }) || ITimg.ocr(affairs, {
                    area: 34,
                })) {
                tool.Floaty_emit("展示文本", "状态", "状态: 切换事务");
                //以左下角的终端做坐标点击
                this.staging = ITimg.ocr(displayText["终端"], {
                    action: 5,
                    area: 34,
                });


                if (this.staging) {
                    if (setting.调试) {
                        tool.pointerPositionDisplay(true)
                    }

                    switch (affairs) {
                        case displayText["主题曲"]:
                            MyAutomator.click(this.staging.right + zox(180), this.staging.bottom);
                            MyAutomator.click(this.staging.right + zox(180) * 1, this.staging.bottom);
                            break;
                        case "插曲":
                            MyAutomator.click(this.staging.right + zox(180) * 3, this.staging.bottom);
                            MyAutomator.click(this.staging.right + zox(180) * 4, this.staging.bottom);
                            break;
                        case displayText["资源收集"]:
                            MyAutomator.click(this.staging.right + zox(180) * 7, this.staging.bottom);
                            MyAutomator.click(this.staging.right + zox(180) * 8, this.staging.bottom);
                            //  log((this.staging.right + zox(180) * 7));
                            // log(this.staging.right + zox(180) * 8);

                            break;
                        case displayText["常态事务"]:
                            MyAutomator.click(this.staging.right + zox(180) * 9, this.staging.bottom);
                            MyAutomator.click(this.staging.right + zox(180) * 10, this.staging.bottom);
                            break;
                        case displayText["长期探索"]:
                            MyAutomator.click(this.staging.right + zox(180) * 11, this.staging.bottom);
                            MyAutomator.click(this.staging.right + zox(180) * 12, this.staging.bottom);
                            break;
                    }
                } else {
                    switch (affairs) {
                        case displayText["主题曲"]:
                            MyAutomator.click(zox(505), width - zoy(80));
                            break;
                        case displayText["资源收集"]:
                            MyAutomator.click(zox(1520), width - zoy(80));
                            break;
                        case "长期探索":
                            MyAutomator.click(zox(2200), width - zoy(80));
                            break;
                    }
                };
                if (setting.调试) {
                    tool.pointerPositionDisplay(false)
                }
                sleep(1000);
                console.info("尝试退出事务切换");
                // if(this.staging&&ITimg.results.length <= 0){

                //  }
                if (ITimg.ocr(affairs, {
                        area: 34,
                        action: 5,
                    }) || ITimg.ocr(affairs, {
                        action: 5,

                    })) {
                    break
                }
            }
        }
    },
    固源岩() {
        this.终端事务(displayText["主题曲"]);
        tool.Floaty_emit("面板", "隐藏");
        tool.Floaty_emit("展示文本", "状态", "状态: 正在进入固源岩关卡");
        let cumulative = 5;
        while (cumulative) {
            sleep(500);
            if (this.staging = (ITimg.ocr(displayText["EPISODE"], {
                    action: 5,
                    area: 13,
                    similar: 0.85,
                })) || ITimg.ocr(displayText["残阳"], {
                    action: 5,
                    area: 13,
                    log_policy: true,
                    refresh: false,
                })) {
                swipe(this.staging.left, this.staging.bottom, this.staging.right, width - zoy(100), 500);
                sleep(500);
                swipe(this.staging.left, this.staging.bottom, this.staging.right, width - zoy(100), 500);
                sleep(500);
                break;
            };
            cumulative--;
            if (!cumulative) {
                console.warn("多次无法识别EPISODE，改用固定坐标滑动");
                swipe(zox(300), zoy(350), zox(300), width - zoy(200), 500);
                sleep(500);
                swipe(zox(300), zoy(350), zox(300), width - zoy(200), 500);
                sleep(500);
            }

        };
        sleep(500);
        tool.Floaty_emit("面板", "展开");
        if (this.staging = (ITimg.ocr(displayText["黑暗时代"], {
                action: 5,
                area: 34,
                part: true,
                nods: 500,
            }) || ITimg.ocr(displayText["黑暗时代"], {
                action: 5,
                area: 34,
                part: true
            }))) {
            MyAutomator.click(this.staging.right, this.staging.top);
            sleep(1000);
        };

        (ITimg.ocr("O1", {
            action: 0,
            timing: 1000,
            area: 4,
            similar: 1,
        }) || ITimg.ocr("01", {
            action: 0,
            timing: 1000,
            area: 4,
            similar: 1,
            refresh: false,
            log_policy: "brief",
        }));

        if (ITimg.ocr("1-7", {
                action: 0,
                timing: 1000,
                area: 12,
                similar: 1,
            })) {
            return true;
        }


    },
    /**
     * 跳转到资源收集,点击资源入口,选中关卡
     * @param {string} levelEntrance - 资源关卡入口名
     * @param {string|Array} levelName - 准确关卡名
     * @returns 
     */
    资源本(levelEntrance, levelName) {
        this.终端事务(displayText["资源收集"]);
        tool.Floaty_emit("展示文本", "状态", "状态: 进入关卡");
        while (true) {
            if (ITimg.ocr(levelEntrance, {
                    timing: 300,
                    action: 0,
                    area: 34,
                    nods: 500,
                })) {
                //不可进入右上角出现关卡尚未开放
                if (ITimg.ocr(displayText["关卡"], {
                        timing: 200,
                        area: 2,
                        part: true,
                    })) {
                    console.error(levelEntrance + " 不在开放时间");
                    return false;
                };
                break

            } else {
                switch (levelEntrance) {
                    case displayText["粉碎防御"]:
                    case displayText["货物运送"]:
                        swipe(height / 2, width / 2, height - 50, width / 2, 500);

                        break;
                    case displayText["势不可挡"]:
                    case displayText["身先士卒"]:
                    case displayText["固若金汤"]:
                        swipe(height / 2, width / 2, 50, width / 2, 500);

                        break;
                }
            }
        };
        sleep(1500);
        tool.Floaty_emit("展示文本", "状态", "状态: 匹配关卡名");

        if (typeof levelName == "object") {
            if ((ITimg.ocr(levelName[0], {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    area: (levelName[0].indexOf("1") != -1) ? 13 : 24,
                }) || ITimg.ocr(levelName[1], {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    area: (levelName[1].indexOf("1") != -1) ? 13 : 24,
                    refresh: false,
                    log_policy: "brief",
                    nods: 1000,
                })) || (ITimg.ocr(levelName[0], {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    area: (levelName[0].indexOf("1") != -1) ? 13 : 24,
                }) || ITimg.ocr(levelName[1], {
                    action: 0,
                    similar: 1,
                    timing: 1000,
                    area: (levelName[1].indexOf("1") != -1) ? 13 : 24,
                    refresh: false,
                    log_policy: "brief"
                }))) {
                return true;
            }
        } else {
            if (ITimg.ocr(levelName, {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    area: (levelName.indexOf("1") != -1) ? 13 : 24,
                }) || ITimg.ocr(levelName, {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    area: (levelName.indexOf("1") != -1) ? 13 : 24,
                })) {
                return true;
            }
        }


    },
    指定剿灭(龙门外环) {
        tool.Floaty_emit("展示文本", "状态", "状态：执行定时指定剿灭中");
        sleep(500);
        (ITimg.picture("终端", {
            action: 0,
            timing: 1000,
            area: 2,
            nods: 1000,
        }) || ITimg.picture("终端", {
            action: 0,
            timing: 1000,
            area: 2,
            threshold: 0.75,
        }));
        if (!ITimg.picture("上次_剿灭", {
                action: 0,
                timing: 2000,
                nods: 1000,
                area: "右上半屏",
            }) && !ITimg.picture("上次_剿灭", {
                action: 0,
                timing: 2000,
                area: "右上半屏",
                threshold: 0.75,
            })) {

            toast("没有在终端页面找到待办_剿灭,无法执行上次-剿灭");
            console.error("没有在终端页面找到待办_剿灭,无法执行上次-剿灭");
            tool.Floaty_emit("展示文本", "状态", "状态：暂停，找不到待办_剿灭");
            tool.Floaty_emit("暂停", "结束程序");
            return false
        };
        if (龙门外环) {

            MyAutomator.click(height / 2, 25);
            sleep(1000);
            MyAutomator.click(height, width - 30);
            sleep(1000);
            if (!ITimg.picture("上次_龙门外环", {
                    action: 0,
                    timing: 2000,
                    area: "右半屏",
                })) {
                MyAutomator.click(height - zox(60), width - zoy(30));
                sleep(1000);
                if (!ITimg.picture("上次_龙门外环", {
                        action: 0,
                        timing: 2000,
                        area: "右半屏",
                    })) {
                    MyAutomator.click(height - zox(120), width - zoy(30));
                    sleep(1000);

                    if (!ITimg.picture("上次_龙门外环", {
                            action: 0,
                            timing: 2000,
                            area: "右半屏",
                        })) {
                        MyAutomator.click(height - 180, width - 30);
                        sleep(1000);
                        if (!ITimg.picture("上次_龙门外环", {
                                action: 0,
                                timing: 2000,
                                area: "右半屏",
                            })) {
                            toast("没有在剿灭页面找到上次_龙门外环,无法执行上次-剿灭");
                            console.error("没有在剿灭页面找到上次_龙门外环,无法执行上次-剿灭");
                            tool.Floaty_emit("展示文本", "状态", "状态：暂停，找不到龙门外环");
                            tool.Floaty_emit("暂停", "结束程序");
                            return false;
                        }

                    }
                }


            }
        }
        return true;
    }
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
                threadMain = threads.start(公招);
                return;
        }
        auto();
        Combat_report.record("开始运行PRTS辅助，执行模式：" + setting.执行);
        sleep(600);

        ITimg.重置计时器(true);
        if (setting.start) {
            启动应用(true);
        };
        switch (setting.执行) {
            case "常规":
            case "行动":
                if (setting.指定关卡.levelAbbreviation == "当前") {
                    Combat_report.record("关卡选择:当前");
                    threadMain.interrupt();
                    threadMain = threads.start(行动);
                } else if (setting.指定关卡.levelAbbreviation == "上次") {
                    if (ITimg.language == "日服" || ITimg.language == "美服") {
                        toastLog("上次作战程序已知并不适用于日服/美服，已为您跳转行动");
                        threadMain.interrupt();
                        threadMain = threads.start(行动);
                        break
                    };
                    Combat_report.record("关卡选择:上次");
                    唤醒.main();
                    if (上次作战()) {
                        threadMain.interrupt();
                        threadMain = threads.start(行动);
                    } else {
                        toastLog("上一次作战是每周剿灭委托，已为你跳过行动程序，执行基建程序");
                        if (setting.震动) device.vibrate(1000);
                        threadMain.interrupt();
                        threadMain = threads.start(基建);
                    }

                } else {
                    唤醒.main();
                    if (collection.main(setting.指定关卡)) {
                        if (setting.执行 == "剿灭") {
                            threadMain.interrupt();
                            threadMain = threads.start(剿灭);
                        } else {
                            threadMain.interrupt();
                            threadMain = threads.start(行动);
                        }
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
                if (setting.指定关卡.levelAbbreviation == "当前") {
                    Combat_report.record("关卡选择:当前剿灭");
                    threadMain.interrupt();
                    threadMain = threads.start(剿灭);
                } else {
                    唤醒.main();
                    if (collection.main(setting.指定关卡)) {
                        threadMain.interrupt();
                        threadMain = threads.start(剿灭);
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
        };

        // Combat_report.record("开始运行PRTS辅助，执行模式：" + implem);
    });
};

/**
 * 进入终端,并检验上一次作战类型,选中非剿灭关卡
 * @returns 
 */
function 上次作战() {
    console.info("上次作战");
    while (true) {

        tool.Floaty_emit("展示文本", "状态", "状态：判断界面中");
        ITimg.picture("终端", {
            action: 0,
            timing: 1500,
            area: 2
        });
        if (ITimg.picture("上一次作战", {
                timing: 500,
                area: "右下半屏",
                nods: 500,
            }) && (ITimg.picture("返回", {
                timing: 200,
                area: "左上半屏",
            }) || ITimg.picture("导航", {
                timing: 200,
                area: "左上半屏",
            }) || ITimg.picture("导航2", {
                timing: 200,
                area: "左上半屏",
            }))) {
            log("验证通过")
            break;
        } else {
            if (ITimg.picture("导航", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                }) || ITimg.picture("导航2", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                })) {
                ITimg.picture("导航_终端", {
                    action: 0,
                    timing: 2000,
                    area: "上半屏",
                });
                ITimg.picture("基建_离开", {
                    action: 0,
                    timing: 5000,
                    area: "右半屏",
                });
            }
        };

    }
    tool.Floaty_emit("展示文本", "状态", "状态：判断上次作战类型中");
    if (ITimg.picture("上次部署", {
            area: 4,
        })) {
        return false;
    };

    if (!ITimg.picture("上一次作战", {
            action: 0,
            timing: 2000,
            area: 4,
        }) && !ITimg.picture("上一次作战", {
            action: 0,
            timing: 2000,
            area: 4,
            threshold: 0.75,
        })) {
        let tips = "上次作战无法确认当前界面,重试";
        toast(tips);
        console.error(tips);
        return false
    } else {
        if (ITimg.picture("行动_普通", {
                area: "右半屏",
            }) || ITimg.picture("行动_磨难", {
                threshold: 0.75,
                area: "右半屏",
            }) || ITimg.picture("行动_愚人号", {
                area: "右半屏",
            }) || ITimg.picture("行动_活动", {
                area: "右半屏",
            })) {
            return true;
        } else {
            sleep(1500);
            return true;
        }
    }

}

function 检验是否已选中关卡() {
    //有开始行动界面才能判断
    if (ITimg.picture("行动_普通", {
            action: 5,
            threshold: 0.75,
            area: 4,
        }) || ITimg.picture("行动_磨难", {
            action: 5,
            threshold: 0.75,
            area: 4,
        }) || ITimg.picture("行动_愚人号", {
            action: 5,
            area: 4,
        }) || ITimg.picture("行动_活动", {
            action: 5,
            area: 4,
            threshold: 0.75,
        })) {

        if (ITimg.picture("代理_未勾", {
                action: 0,
                timing: 1000,
                area: "右下半屏",
            }) || ITimg.picture("代理_未勾_愚人号", {
                action: 0,
                timing: 1000,
                area: "右下半屏",
            }) || ITimg.picture("代理_未勾_活动", {
                action: 0,
                timing: 1000,
                area: "右下半屏",
            })) { //有开始行动界面才能判断
            toastlog("自动勾选代理指挥");
            return true;
        } else {
            toast("当前关卡未解锁代理指挥，请选择已勾选可代理的关卡");
            return false;
        };

    } else {
        return false;
    }
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
    if (!ITimg.picture("导航", {
            action: 0,
            timing: 1500,
            area: "左半屏",
        })) {
        ITimg.picture("导航2", {
            action: 0,
            timing: 1500,
            area: "左半屏",
        })
    }
    ITimg.picture("导航_基建", {
        action: 0,
        timing: 500,
        area: "上半屏",
    });

}

/**
 * 负责启动游戏进入到主页
 */
let 唤醒 = {
    main() {
        tool.Floaty_emit("展示文本", "状态", "状态：唤醒程序运行中...");

        sleep(1500);
        if (this.确认返回主页()) {
            this.取消公告();
            return true;
        };
        启动应用(true);
        try {
            press(height / 2, width - 100, 100);
        } catch (e) {

            console.error(e)
        }
        sleep(2000);
        this.开始唤醒();
        sleep(500);
        this.取消公告();

        return true;

    },
    检查更新(test) {
        if (!setting.update || !setting.update.checked) {
            console.warn("自动进行游戏更新：" + (setting.update && setting.update.checked))
            return false;
        }
        tool.Floaty_emit("展示文本", "状态", "状态：检查是否需要更新");

        if (test || ITimg.ocr(displayText["客户端"], {
                area: 12,
                action: 0,
                part: true,
            }) || ITimg.ocr(displayText["已过时"], {
                area: 12,
                action: 0,
                part: true,
            })) {
            sleep(500);
            click(height / 2, width - zoy(50));
            click(height / 2, zoy(50));
            tool.Floaty_emit("展示文本", "状态", "状态：客户端已过时");
            textContains(displayText["更新"]).waitFor();
            tool.Floaty_emit("展示文本", "状态", "状态：从TapTap更新明日方舟");
            //查找点击Tap更新应用按钮
            let update_app;
            while (true) {
                update_app = (textMatches(displayText["更新"] + '.*?(MB|G)').findOne(2000) || textStartsWith(displayText["更新"]).findOne(2000));
                if (update_app) {
                    if (!update_app.clickable() || !update_app.click()) {
                        update_app = update_app.bounds();
                        MyAutomator.click(update_app.centerX(), update_app.centerY());
                        break;
                    };
                };
            };

            console.info("更新App按钮参数：\n" + update_app)
            if (setting.update && setting.update.usingTraffic) {
                let usingTraffic = textStartsWith(displayText["立即下载"]).findOne(3000);
                if (usingTraffic) {
                    if (!usingTraffic.clickable() || !usingTraffic.click()) {
                        usingTraffic = usingTraffic.bounds();
                        MyAutomator.click(usingTraffic.centerX(), usingTraffic.centerY())
                    }
                }
                console.info("使用流量下载按钮参数：\n" + usingTraffic);
            }
            tool.Floaty_emit("展示文本", "状态", "状态：等待下载完成");

            desc(displayText["安装"]).waitFor();
            tool.Floaty_emit("展示文本", "状态", "状态：进行安装");

            let install_app = desc(displayText["安装"]).findOne();
            if (!install_app.clickable() || !install_app.click()) {
                install_app = install_app.bounds();
                log(install_app)
                MyAutomator.click(install_app.centerX(), install_app.centerY());
            };

            console.info("安装应用按钮参数：\n" + install_app);
            //使用系统应用管理组件安装
            sleep(1500);
            let assembly = id("android:id/text1").className("android.widget.TextView").findOne(5000);
            if (assembly && (!assembly.clickable() || !assembly.click())) {
                assembly = assembly.bounds();
                MyAutomator.click(assembly.centerX(), assembly.centerY());
            };

            sleep(3000);
            textMatches(displayText["确认安装合集"]).waitFor();
            tool.Floaty_emit("展示文本", "状态", "状态：逐步安装");

            let ii = 1;
            while (true) {

                install_app = textMatches(displayText["确认安装合集"]).findOne(500);

                if (install_app) {
                    if (!install_app.clickable() || !install_app.click()) {
                        install_app = install_app.bounds();
                        MyAutomator.click(install_app.centerX(), install_app.centerY());
                    };
                    console.info("安装应用第" + ii + "步按钮:\n" + install_app);
                    ii++;

                };
                install_app = (textMatches(displayText["安装完成合集"]).classNameMatches("(android.widget.Button|android.widget.TextView|android.view.View)").findOne(500) || descMatches(displayText["安装完成合集"]).classNameMatches("(android.widget.Button|android.widget.TextView|android.view.View)").findOne(500));
                if (install_app) {
                    if (!install_app.clickable() || !install_app.click()) {
                        install_app = install_app.bounds();
                        MyAutomator.click(install_app.centerX(), install_app.centerY());
                    };
                    break;
                }

            }

            console.warn("更新安装应用完成");
            启动应用(true);
            return true;

        } else if (setting.update.usingTraffic) {
            //用于确认方舟流量热更新
            ITimg.picture("基建_离开", {
                timing: 5000,
                action: 0,
                area: 24,
            });
            return
        }



    },
    确认返回主页() {
        tool.Floaty_emit("展示文本", "状态", "状态：确认主界面并重连");
        if (ITimg.picture("终端", {
                timing: 2000,
                area: "右半屏"
            }) || ITimg.picture("基建", {
                timing: 2000,
                area: 24,
            })) {
            //防止此次需要重连
            if (ITimg.picture("终端", {
                    timing: 1000,
                    area: "右半屏",
                    action: 0,
                })) {
                if (!ITimg.picture("返回", {
                        action: 4,
                        timing: 1000,
                        area: 1,
                        nods: 1000,
                    }) && !ITimg.picture("返回", {
                        action: 4,
                        timing: 3000,
                        area: 1
                    })) {
                    return false;
                }
            }
            if (setting.调试) {
                let pngPtah = path_ + "/captureScreen/唤醒主页.png";
                files.ensureDir(pngPtah);
                images.save(ITimg.captureScreen_(), pngPtah);
                console.verbose("已进入主页,无需重复.");
            }
            return true;
        };
        ITimg.picture("关闭公告", {
            timing: 2000,
            action: 0,
            area: "上半屏",
        });
        //返回到主页
        if (ITimg.picture("导航", {
                timing: 1500,
                area: "左半屏",
            }) || ITimg.picture("导航2", {
                timing: 1500,
                area: "左半屏",
            })) {
            while (ITimg.picture("返回", {
                    timing: 1000,
                    action: 0,
                    area: 1,
                })) {
                ITimg.picture("基建_离开", {
                    timing: 5000,
                    action: 0,
                    nods: 200,
                    area: "右半屏",
                });
            };
            if (setting.调试) {
                let pngPtah = path_ + "/captureScreen/唤醒主页.png";
                files.ensureDir(pngPtah);
                images.save(ITimg.captureScreen_(), pngPtah);
                console.verbose("已进入主页,无需重复..");
            }
            return true;
        };
    },
    开始唤醒() {
        tool.Floaty_emit("展示文本", "状态", "状态：等待开始游戏");
        toastLog("等待加载登录");
        //开始唤醒
        while (true) {
            sleep(1000);
            if (!ITimg.picture("开始唤醒", {
                    action: 0,
                    area: "下半屏",
                })) {
                this.检查更新();
                //防止特殊情况下，检查更新未识别到客户端已过时，下面的点击命令又执行了，跳转到商店要更新的情况
                if (textContains(displayText["更新"]).findOne(500)) {
                    this.检查更新(true);
                    continue;
                };
                MyAutomator.click(height / 2, width - 100);
                sleep(1000);
                getpackage = tool.currentPackage();
                log("前台包名：" + getpackage);
                if (getpackage == "com.hypergryph.arknights.bilibili") {
                    tool.Floaty_emit("展示文本", "状态", "状态：当前渠道为B服，等待");
                    toastLog("当前渠道为B服，请等待")
                    sleep(3000);
                    MyAutomator.click(height / 2, width - 100);
                    sleep(3000);
                    MyAutomator.click(height / 2, width - 100);
                    sleep(2000)
                    MyAutomator.click(height / 2, width - 100);
                    sleep(2000);
                    MyAutomator.click(height / 2, width - 100);
                    break;
                };

                if (this.确认返回主页()) {
                    break
                };
            } else {
                sleep(2000);
                if (!ITimg.picture("开始唤醒", {
                        timing: 8000,
                        action: 0,
                        area: "下半屏",
                    })) {
                    break
                }
            }

        }
    },
    取消公告() {
        this.frequency = 0;
        tool.Floaty_emit("展示文本", "状态", "状态：取消公告签到通知");
        console.info("取消公告");
        while (true) {

            if (ITimg.picture("关闭公告", {
                    timing: 2000,
                    action: 0,
                    area: "上半屏",
                }) || ITimg.picture("获得物资", {
                    timing: 1000,
                    action: 1,
                })) {
                if (ITimg.picture("终端", {
                        timing: 1500,
                        area: "右半屏"
                    }) || ITimg.picture("基建", {
                        timing: 1500,
                        area: 24,
                    })) {
                    if (ITimg.picture("终端", {
                            timing: 2000,
                            area: "右半屏"
                        }) || ITimg.picture("基建", {
                            timing: 1500,
                            area: 24,
                        })) {
                        break;
                    };
                };
            } else {
                //点击边缘位置来取消取消按钮不一样的公告
                MyAutomator.click(height / 2, width - zoy(100));
                if (ITimg.picture("终端", {
                        area: 2,
                        //        action:5,
                    }) || ITimg.picture("基建", {
                        area: 24,
                        action: 5,
                    })) {
                    if (this.frequency >= 3) {
                        break;
                    }
                    this.frequency++;
                };
                sleep(500);

            }

        }
    },

}

function 行动() {
    sleep(1500);

    threadMain.setName("行动作战");
    try {

        tool.Floaty_emit("展示文本", "状态", "状态：等待手动选定关卡");
        统计("次数", "显示材料");

    } catch (e) {
        toast(e)
        console.error(e);
        threads.shutDownAll();
        exit();
    }

    setInterval(function() {
        device.keepScreenDim(240 * 1000);
        setting = tool.readJSON("configure");
        if (setting.设置电量) {
            if (!device.isCharging() && device.getBattery() < setting.电量) {
                sleep(500);
                便笺(2000);
                toast("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                Combat_report.record("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                console.error("电量低于设定值" + setting.电量 + "且未充电,主程序已退出并返回桌面");

                跳转_暂停(true, "电量低于设定值且未充电", "状态：暂停，电量低且未充电");
                home();
                sleep(5000);
            };
        };

        while (true) {
            if (Material_await == "等待") {
                tool.Floaty_emit("状态", "即将达成目标，等待统计");
            } else {
                break;
            }
            sleep(500);
        }
        while (true) {
            setting = tool.readJSON("configure");
            // aa = files.read("./mrfz/行动.txt");
            if (setting.已执行动 >= setting.行动) {
                便笺(2000);

                toast("行动完毕，退出行动程序\n注：已执行动 >= 上限时不会执行基建收菜");
                console.warn("行动完毕，退出行动程序，注：已执行动 >= 上限时不会执行基建收菜");
                跳转_暂停(true, "行动刷图上限结束后", "状态：暂停，行动已完成");
                setting = null;
                break;
                //   }
            };
            if (ITimg.picture("行动_编队确认开始", {
                    action: 5,
                    timing: 1000,
                    area: "右半屏",
                })) {
                console.verbose("结束自动代理环节")
                break
            }
            if (setting.已执行动 == 0) {
                //有开始行动界面才能判断
                if (ITimg.picture("行动_普通", {
                        action: 5,
                        threshold: 0.75,
                        area: "右半屏",

                    }) || ITimg.picture("行动_磨难", {
                        action: 5,
                        threshold: 0.75,
                        area: "右半屏",
                    }) || ITimg.picture("行动_愚人号", {
                        action: 5,
                        area: "右半屏",
                    }) || ITimg.picture("行动_活动", {
                        action: 5,
                        area: "右半屏",
                        threshold: 0.75,
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：校验关卡中");
                    sleep(10);
                    let staging;
                    if (staging = (ITimg.picture("代理_勾", {
                            action: 5,
                            area: 4,
                        }) || ITimg.picture("代理_勾_愚人号", {
                            action: 5,
                            area: 4,
                        }) || ITimg.picture("代理_勾_活动", {
                            action: 5,
                            area: 4,
                        }))) {
                        if (setting.重置代理次数) {
                            console.info("重置代理次数")
                            MyAutomator.click(staging.left - zox(70), staging.y + staging.h / 2);
                            sleep(500);
                            MyAutomator.click(staging.left - zox(70), staging.y + staging.h / 2 - zoy(80));
                            sleep(200);
                            delete staging;
                        }
                        tool.Floaty_emit("展示文本", "状态", "状态：正在代理中");
                        if (ITimg.picture("行动_普通", {
                                action: 0,
                                timing: 1000,
                                area: "右半屏",
                                threshold: 0.75,
                            }) || ITimg.picture("行动_磨难", {
                                action: 0,
                                threshold: 0.75,
                                timing: 1000,
                                area: "右半屏",

                            }) || ITimg.picture("行动_愚人号", {
                                action: 0,
                                timing: 1000,
                                area: "右半屏",
                            }) || ITimg.picture("行动_活动", {
                                action: 0,
                                timing: 1500,
                                area: "右半屏",
                            })) {
                            toastLog("代理点击成功!");
                            break;
                        };
                    };

                    if (ITimg.picture("代理_未勾", {
                            action: 0,
                            timing: 1000,
                            area: "右下半屏",
                        }) || ITimg.picture("代理_未勾_愚人号", {
                            action: 0,
                            timing: 1000,
                            area: "右下半屏",
                        }) || ITimg.picture("代理_未勾_活动", {
                            action: 0,
                            timing: 1000,
                            area: "右下半屏",
                        })) { //有开始行动界面才能判断
                        toast("自动勾选代理指挥");
                    } else {
                        toast("当前关卡未解锁代理指挥，请选择已勾选可代理的关卡");
                        sleep(2000);
                    };

                } else {
                    toast("请打开已勾选可代理的关卡");
                    sleep(3000);
                    if (setting.防沉迷) {
                        if (ITimg.picture("防沉迷_确认", {
                                action: 0,
                                timing: 1500,
                                area: "右半屏",
                            })) {
                            tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                            tool.Floaty_emit("暂停", "结束程序");
                        };
                    }
                };
            } else {
                tool.Floaty_emit("展示文本", "状态", "状态：正在代理中");
                if (ITimg.picture("行动_普通", {
                        action: 0,
                        timing: 1500,
                        area: "右半屏",
                        threshold: 0.75,
                    }) || ITimg.picture("行动_磨难", {
                        action: 0,
                        threshold: 0.75,
                        timing: 1000,
                        area: "右半屏",

                    }) || ITimg.picture("行动_愚人号", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    }) || ITimg.picture("行动_活动", {
                        action: 0,
                        timing: 1500,
                        area: "右半屏",
                        threshold: 0.75,
                    })) {
                    toastLog("代理点击成功!");
                    break;
                };
            }
        }; //单次循环

        while (true) {
            setting = tool.readJSON("configure");
            if (ITimg.picture("行动_编队确认开始", {
                    action: 0,
                    timing: 2000,
                    area: "右半屏",
                })) {
                setting.已执行动++;
                tool.writeJSON("已执行动", setting.已执行动)
                tool.Floaty_emit("展示文本", "状态", "状态：正在行动中");
                if (agent != 0) {
                    tool.Floaty_emit("展示文本", "行动", "行动：执行" + setting.已执行动 + "次&代理失误" + agent + "次")
                } else {
                    统计("行动");

                }

                sleep(1000)
                if (!ITimg.picture("行动_编队确认开始", {
                        action: 0,
                        timing: 2000,
                        area: "右半屏",
                    })) {
                    console.verbose("结束开始行动环节")
                    break;
                }

                sleep(3000)
                ITimg.picture("行动_编队确认开始", {
                    action: 0,
                    timing: 2000,
                    area: "右半屏",
                });
                console.verbose("结束开始行动环节")
                break;

            } else {
                if (!理智处理()) {
                    跳转_暂停(false, "行动刷图且没有理智结束后", "状态：暂停，木有理智");
                }

                sleep(500);
                if (ITimg.picture("行动_普通", {
                        action: 0,
                        timing: 1500,
                        area: "右半屏",
                        threshold: 0.75,

                    }) || ITimg.picture("行动_磨难", {
                        action: 0,
                        threshold: 0.75,
                        timing: 1000,
                        area: "右半屏",

                    }) || ITimg.picture("行动_愚人号", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    }) || ITimg.picture("行动_活动", {
                        action: 0,
                        timing: 1500,
                        area: "右半屏",
                        threshold: 0.75,
                    })) {
                    toastLog("代理点击成功_?");
                };
                sleep(200);
                if (setting.防沉迷) {
                    if (ITimg.picture("防沉迷_确认", {
                            action: 0,
                            timing: 1500,
                            area: "右半屏",
                        })) {
                        tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                        tool.Floaty_emit("暂停", "结束程序");
                    };
                }
            }; //无红行动
            sleep(200)
        }; //单次循环


        if (setting.企鹅统计 && setting.指定材料) {
            Material_data = tool.readJSON("material_await_obtain");
            try {
                if (Material_data.name.length == 0) {
                    Material_data = undefined
                }
            } catch (err) {
                Material_data = undefined
            }
            if (Material_data) {
                for (let i = 0; i < Material_data.name.length; i++) {
                    if ((Material_data.number[i] - Material_data.done[i]) == 1) {
                        Material_await = "等待";
                        break;
                    }
                    if ((Material_data.number[i] - Material_data.done[i]) < 1) {
                        Material_data = undefined;
                        break
                    }
                }


            }
        }
        sleep(3000);
        tool.Floaty_emit("展示文本", "状态", "状态：正在行动中");
        sleep(35000);
        console.verbose("开始查询结算页面")
        while (true) {
            //结算
            setting = tool.readJSON("configure");
            sleep(100)
            if (temporary_xy = ITimg.picture((setting.agent ? "代理_放弃行动" : "代理_继续结算"), {
                    action: 5,
                    timing: 500,
                    area: "下半屏",
                })) {
                toast("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                console.warn("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                agent++;
                if (setting.agent) {
                    for (let i = 0; i < 10; i++) {
                        MyAutomator.click(temporary_xy.x + random(-15, 15), temporary_xy.y + random(-10, 10))
                        sleep(200)
                    }
                    break
                } else {
                    MyAutomator.click(temporary_xy.x + random(-15, 15), temporary_xy.y + random(-10, 10))
                }

            }
            if (ITimg.picture("基建_离开", {
                    action: 1,
                    timing: 500,
                    area: "下半屏",
                })) {
                toastLog("网络不佳,重新提交战斗记录")
            };
            sleep(500);

            if (ITimg.picture("行动_结算", {
                    timing: 500,
                    area: "左半屏",
                }) || ITimg.picture("行动_结算", {
                    timing: 500,
                    area: "左半屏",
                    threshold: 0.75,
                }) || ITimg.picture("行动_结算", {
                    timing: 500,
                    area: "左上半屏",
                    threshold: 0.75,
                })) {
                while (true) {
                    tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                    if (ITimg.picture("等级_提升", {
                            action: 0,
                            timing: 1000,
                            area: "右半屏",
                        })) {
                        tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                        toast("等级提升了");
                        console.warn("等级提升了，理智已恢复");
                    };

                    if (setting.企鹅统计) {
                        sleep(300)
                        //click(parseInt(height -height*0.05), parseInt(width -height*0.05));
                        swipe(parseFloat(height / 8), parseFloat(width / 1.25), parseFloat(height / 3), parseFloat(width / 1.25), 600)
                        sleep(500)
                        //swipe(parseFloat(height / 4), parseFloat(width / 1.25), parseFloat(height / 2), parseFloat(width / 1.25), 600)

                        sleep(1500);
                        tool.Floaty_emit("面板", "位置", "统计");
                        sleep(500)
                        let img = ITimg.captureScreen_()
                        images.save(img, context.getExternalFilesDir(null).getAbsolutePath() + "be_identified.png");
                        sleep(100)
                        img.recycle();
                        tool.Floaty_emit("面板", "材料统计");

                    } else {
                        sleep(1000);
                        log("企鹅统计：" + setting.企鹅统计)
                    }



                    temporary_xy = (ITimg.picture("行动_结算", {
                        action: 5,
                        timing: 500,
                        area: "左半屏",
                    }) || ITimg.picture("行动_结算", {
                        action: 5,
                        timing: 500,
                        area: "左半屏",
                        threshold: 0.75,
                    }) || ITimg.picture("行动_结算", {
                        action: 5,
                        timing: 500,
                        area: "左半屏",
                        threshold: 0.75,
                    }))
                    if (temporary_xy) {
                        MyAutomator.click(temporary_xy.x, temporary_xy.y);
                        sleep(1500);
                    }
                    if (!ITimg.picture("等级_提升", {
                            timing: 100,
                            action: 5,
                        }) && !ITimg.picture("行动_结算", {
                            action: 0,
                            timing: 200,
                            nods: 1000,
                            area: "左半屏",
                        }) && !ITimg.picture("行动_结算", {
                            action: 0,
                            timing: 200,
                            area: "左半屏",
                        }) && !ITimg.picture("行动_结算", {
                            timing: 100,
                            area: "左半屏",
                            threshold: 0.75,
                        })) {
                        toast("已完成" + setting.已执行动 + "次行动");
                        console.info("已完成" + setting.已执行动 + "次行动")
                        break;
                    }

                }
                tool.Floaty_emit("展示文本", "状态", "状态：等待加载关卡");
                while (true) {
                    sleep(1500);
                    if (ITimg.picture("行动_普通", {
                            timing: 500,
                            area: "右半屏",
                            threshold: 0.75,
                        }) || ITimg.picture("行动_磨难", {
                            timing: 500,
                            area: "右半屏",
                            threshold: 0.75,
                        }) || ITimg.picture("行动_愚人号", {
                            timing: 1000,
                            area: "右半屏",
                        }) || ITimg.picture("行动_活动", {
                            timing: 500,
                            area: "右半屏",
                            threshold: 0.75,
                        })) {
                        break;
                    };
                    (ITimg.picture("行动_结算", {
                        action: 0,
                        timing: 500,
                        area: "左半屏",
                    }) || ITimg.picture("行动_结算", {
                        timing: 500,
                        area: "左半屏",
                        threshold: 0.75,
                    }))
                }
                break

            };

            sleep(200);
            if (ITimg.picture("等级_提升", {
                    action: 0,
                    timing: 1000,
                    area: "右半屏",
                })) {
                tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                toast("等级提升了");
                Combat_report.record("等级提升了，理智已恢复");
                console.warn("等级提升了，理智已恢复");
            };
            sleep(200);
            if (setting.防沉迷) {
                if (ITimg.picture("防沉迷_确认", {
                        action: 0,
                        timing: 1500,
                        area: "右半屏",
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                    tool.Floaty_emit("暂停", "结束程序");
                };
            }
        }; //单

        Combat_report.record("本次运行完成了" + setting.已执行动 + "次行动");


    }, 1000); //总循环
}; //线程

function 理智处理() {
    sleep(300);
    console.info("理智界面检查");
    if (ITimg.picture("理智_确认", {
            timing: 500,
            area: 4,
            nods: 1500,
        }) || ITimg.picture("理智_确认", {
            timing: 500,
            area: 4,
        }) || ITimg.picture("理智_确认", {
            timing: 500,
            area: 4,
        })) {
        setting = tool.readJSON("configure");
        tool.Floaty_emit("展示文本", "状态", "状态：理智检测中");
        if (setting.已兑理智 >= setting.理智) {
            if (setting.无限吃24小时过期理智药 && (ITimg.ocr(displayText["小时"], {
                    area: 24,
                    part: true,
                }) || ITimg.ocr(displayText["分钟"], {
                    area: 24,
                    part: true,
                    refresh: false,
                }))) {
                if (ITimg.picture("理智_确认", {
                        action: 0,
                        area: 4,
                        timing: 1000,
                    })) {
                    setting.已兑理智++;
                    tool.writeJSON("已兑理智", setting.已兑理智);
                }
                Combat_report.record("本次运行累计兑换" + setting.已兑理智 + "瓶药剂");
                toastLog("成功兑换理智" + setting.已兑理智 + "次");

                统计("理智");
                return true;
            } else {
                toast("木有理智，更木有理智兑换次数");
                console.warn("木有理智，更木有理智兑换次数");
                MyAutomator.click(height / 2, width - zox(50));
                return false;
            }


        } else {
            if (ITimg.picture("理智_源石", {
                    timing: 500,
                    area: 2,
                })) {
                //仅使用药剂恢复理智
                if (setting.only_medicament) {
                    toast("没有药剂可供恢复理智了,仅使用药剂恢复理智" + setting.only_medicament);
                    console.warn("没有药剂可供恢复理智了,仅使用药剂恢复理智" + setting.only_medicament);
                    return false;
                } else {
                    setting.已兑理智++;
                    tool.writeJSON("已兑理智", setting.已兑理智);

                    ITimg.picture("理智_确认", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    });
                    Combat_report.record("本次运行累计兑换" + setting.已兑理智 + "个药剂/石头");
                    toastLog("成功兑换理智" + setting.已兑理智 + "次");
                    统计("理智");
                    return true;
                }

            } else {

                if (ITimg.picture("理智_确认", {
                        action: 0,
                        area: 4,
                        timing: 1000,
                    })) {
                    setting.已兑理智++;
                    tool.writeJSON("已兑理智", setting.已兑理智);
                }
                Combat_report.record("本次运行累计兑换" + setting.已兑理智 + "瓶药剂");
                toastLog("成功兑换理智" + setting.已兑理智 + "次");

                统计("理智");
                return true;
            }
            //没有设置理智兑换次数
        }
    } else if (ITimg.picture("理智_源石", {
            area: 2,
        })) {
        toast("木有理智药剂，更木有源石可供恢复理智");
        console.warn("木有理智药剂，更木有源石可供恢复理智");
        tool.Floaty_emit("展示文本", "状态", "状态：没有方法恢复");
        MyAutomator.click(height / 2, width - zox(50));
        return false;
    };
    return true;
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
        MyAutomator.click(height / 2, width / 2);
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

function 剿灭() {
    sleep(50)
    toastLog("3秒后启动剿灭程序，注意是稳定代理400的剿灭");
    threadMain.setName("剿灭作战");
    sleep(3000);
    tool.Floaty_emit("展示文本", "状态", "状态：等待手动选定剿灭关卡");
    tool.Floaty_emit("展示文本", "行动", "剿灭：执行" + setting.已执行动 + "次&上限" + setting.剿灭 + "次");
    tool.Floaty_emit("展示文本", "理智", "理智：已兑" + setting.已兑理智 + "次&上限" + setting.理智 + "次");
    setInterval(function() {
        device.keepScreenDim(1800 * 1000);
        setting = tool.readJSON("configure");
        if (setting.设置电量) {
            if (!device.isCharging() && device.getBattery() < setting.电量) {
                sleep(500);
                便笺(2000);
                toast("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                Combat_report.record("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                console.error("电量低于设定值" + setting.电量 + "且未充电,主程序已退出并返回桌面");

                跳转_暂停(true, "电量低于设定值且未充电", "状态：暂停，电量低且未充电");
                home();
            };
        };

        while (setting.proxy_card) {
            setting = tool.readJSON("configure");
            if (setting.已执行动 >= setting.剿灭) {
                便笺(2000);
                toast("剿灭完毕，退出剿灭程序");
                console.warn("剿灭完毕，退出剿灭程序");

                跳转_暂停(false);
                break;

            };
            (ITimg.picture("代理_全权委托", {
                action: 0,
                timing: 500,
                area: "右半屏"
            }) || ITimg.picture("代理_全权委托", {
                action: 0,
                timing: 500,
                area: "下半屏",
                threshold: 0.75,
            }))
            if (ITimg.picture("行动_普通", {
                    action: 5,
                    timing: 1000,
                    area: "右半屏",
                    nods: 3000,
                })) {

                this.xy_ = (ITimg.picture("导航", {
                    action: 5,
                    area: "左半屏",
                }) || ITimg.picture("导航2", {
                    action: 5,
                    area: "上半屏",
                }) || ITimg.picture("导航", {
                    action: 5,
                    area: "上半屏",
                    threshold: 0.7,
                }) || ITimg.picture("导航2", {
                    action: 5,
                    area: "左半屏",
                    threshold: 0.7,
                }))
                if (ITimg.picture("代理_全权委托_确认使用", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    })) {
                    setting.已执行动++;
                    tool.writeJSON("已执行动", setting.已执行动);
                    tool.Floaty_emit("展示文本", "状态", "状态：正在剿灭中");
                    统计("行动", undefined, true)
                    if (this.xy_) {
                        while (true) {
                            MyAutomator.click(this.xy_.x, this.xy_.y);
                            sleep(1500);
                            if (ITimg.picture("行动_普通", {
                                    area: "右半屏",

                                })) {
                                break;
                            }
                        }
                    };

                }
            } else {
                ITimg.picture("代理_全权委托", {
                    action: 0,
                    timing: 1000,
                    area: "右半屏"
                });
                if (!ITimg.picture("代理_全权委托_确认", {
                        timing: 1000,
                        area: "右半屏",
                    }) && !ITimg.picture("代理_全权委托_确认", {
                        timing: 1000,
                        area: "下半屏",
                        threshold: 0.7,
                    })) {
                    toastLog("似乎没有代理卡可使用...")
                    setting.proxy_card = false;
                }
            }
            continue;
        }
        while (true) {
            //aa = files.read("./mrfz/行动.txt");
            setting = tool.readJSON("configure");
            if (setting.已执行动 >= setting.剿灭) {
                便笺(2000);
                toast("剿灭完毕，退出剿灭程序");
                console.warn("剿灭完毕，退出剿灭程序");

                跳转_暂停(false);
                break;

            };

            sleep(1100);
            //有开始行动界面才能判断
            if (ITimg.picture("行动_普通", {
                    timing: 1000,
                    area: "右半屏",
                })) {
                if (ITimg.picture("代理_勾", {
                        timing: 1000,
                        area: "右半屏",
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：正在代理中");
                    if (ITimg.picture("行动_普通", {
                            action: 0,
                            timing: 1500,
                            area: "右半屏",
                        })) {
                        toastLog("代理点击成功!");
                        break;
                    };
                };

                if (ITimg.picture("代理_未勾", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    })) { //有开始行动界面才能判断
                    toast("自动勾选代理指挥");
                } else {
                    toast("当前关卡未解锁代理指挥，请选择已勾选可代理的关卡");
                    sleep(2000);
                };

            } else {
                sleep(2000);
                toast("请选择某剿灭关卡!")
                if (setting.防沉迷) {
                    if (ITimg.picture("防沉迷_确认", {
                            action: 0,
                            timing: 1500,
                        })) {
                        tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                        tool.Floaty_emit("暂停", "结束程序");
                    };
                }
            };
        }; //单次循环

        while (true) {
            setting = tool.readJSON("configure");
            sleep(800);
            if (ITimg.picture("行动_编队确认开始", {
                    action: 0,
                    timing: 2000,
                    area: "右半屏",
                })) {
                setting.已执行动++;
                tool.writeJSON("已执行动", setting.已执行动);
                tool.Floaty_emit("展示文本", "状态", "状态：正在剿灭中");
                if (agent != 0) {
                    tool.Floaty_emit("展示文本", "行动", "剿灭：执行" + setting.已执行动 + "次&代理失误" + agent + "次")
                } else {
                    统计("行动", undefined, true)
                }
                sleep(1000);
                if (!ITimg.picture("行动_编队确认开始", {
                        action: 0,
                        timing: 2000,
                        area: "右半屏",
                    })) {
                    break;
                }
            } else {
                if (!理智处理()) {
                    跳转_暂停(setting.woie, "剿灭刷图且没有理智结束后", "状态：暂停，木有理智");
                }
                sleep(500);
                if (ITimg.picture("行动_普通", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    })) {
                    toastLog("兑换理智后再次代理点击成功!");
                };
                sleep(500);
                if (setting.防沉迷) {
                    if (ITimg.picture("防沉迷_确认", {
                            action: 0,
                            timing: 1500,
                            area: "右半屏",
                        })) {
                        tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                        tool.Floaty_emit("暂停", "结束程序");
                    };
                }
            }; //无红行动

        }; //单次循环
        log("预定10分钟后判断结算页面")
        sleep(4 * 60000);
        if (!ITimg.picture("剿灭_简报1", {
                timing: 1000,
                area: "左半屏",
            })) {
            sleep(3 * 60000);
        }
        if (!ITimg.picture("剿灭_简报1", {
                timing: 1000,
                area: "左半屏",
            })) {
            sleep(3 * 60000)
        }
        tool.Floaty_emit("面板", "隐藏");
        while (true) { //结算
            setting = tool.readJSON("configure");
            tool.Floaty_emit("面板", "位置", "300,280");
            sleep(100)
            if (temporary_xy = ITimg.picture((setting.agent ? "代理_放弃行动" : "代理_继续结算"), {
                    action: 5,
                    timing: 500,
                })) {
                toast("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                console.warn("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                agent++;
                if (setting.agent) {
                    for (let i = 0; i < 10; i++) {
                        MyAutomator.click(temporary_xy.x + random(-15, 15), temporary_xy.y + random(-10, 10))
                        sleep(200)
                    }
                    break
                } else {
                    MyAutomator.click(temporary_xy.x + random(-15, 15), temporary_xy.y + random(-10, 10))
                }

            }
            if (ITimg.picture("基建_离开", {
                    action: 1,
                    timing: 500,
                    area: "下半屏",
                })) {
                toastLog("网络不佳,重新提交战斗记录")
            };
            sleep(500);
            if (ITimg.picture("剿灭_简报", {
                    timing: 1000,
                    area: "左半屏",
                })) {
                tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                ITimg.picture("剿灭_简报", {
                    action: 0,
                    timing: 1000,
                    area: "左半屏",
                })
            };
            if (ITimg.picture("剿灭_简报1", {
                    timing: 1000,
                    area: "左半屏",
                })) {
                tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                ITimg.picture("剿灭_简报1", {
                    action: 0,
                    timing: 1000,
                    area: "左半屏",
                })
            };
            sleep(500);
            if (ITimg.picture("剿灭_报酬", {
                    action: 0,
                    timing: 3000,
                    area: "左半屏",
                })) {
                if (!ITimg.picture("剿灭_报酬", {
                        action: 0,
                        timing: 500,
                        area: "左半屏",
                    })) {
                    toast("已完成" + setting.已执行动 + "次剿灭行动");
                    console.info("已完成" + setting.已执行动 + "次剿灭行动");
                    break;
                }
            } else if (ITimg.picture("行动_普通", {
                    timing: 500,
                    area: "右半屏",
                })) {
                break;
            }
            sleep(500);
            if (ITimg.picture("等级_提升", {
                    action: 0,
                    timing: 1000,
                    area: "右半屏",
                })) {
                tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                toast("等级提升了");
                Combat_report.record("等级提升了，理智已恢复");
                console.warn("等级提升了，理智已恢复");
            };
            sleep(500);
            if (setting.防沉迷) {
                if (ITimg.picture("防沉迷_确认", {
                        action: 0,
                        timing: 1500,
                        area: "右半屏",
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                    tool.Floaty_emit("暂停", "结束程序");
                };
            }
        }; //单
        tool.Floaty_emit("面板", "展开");
        sleep(1500);
        Combat_report.record("本次运行完成了" + setting.已执行动 + "次剿灭行动");
        tool.Floaty_emit("展示文本", "状态", "状态：等待加载关卡中");

    }, 1000); //总循环
};

function 基建() {
    /**
     * 干员疲劳状态
     */
    var fatigue_state;

    待办处理 = function() {
        if (!ITimg.picture("基建_铃铛", {
                action: 0,
                area: "右上半屏",
                timing: 2000,
            }) && !ITimg.picture("基建_铃铛", {
                action: 0,
                area: "右上半屏",
                timing: 2000,
                threshold: 0.7,
            })) {
            toastLog("无法匹配铃铛 / 待办事项按钮，等待6秒")
            sleep(6000);
            if (!ITimg.picture("基建_铃铛", {
                    action: 0,
                    area: "右上半屏",
                    timing: 1500,
                }) && !ITimg.picture("基建_铃铛", {
                    action: 0,
                    area: "右上半屏",
                    timing: 1500,
                    threshold: 0.7,
                })) {
                /* toastLog("没有匹配到基建_铃铛, 点击返回重试");
                 ITimg.picture("返回", {
                     action: 4,
                     timing: 1500,
                     area: "左上半屏",
                 });
                 */
                if (!ITimg.picture("基建_铃铛", {
                        action: 0,
                        area: "右上半屏",
                        timing: 1500,
                    }) && !ITimg.picture("基建_铃铛", {
                        action: 0,
                        area: "右上半屏",
                        timing: 1500,
                        threshold: 0.7,
                    })) {
                    toastLog("没有匹配到基建_铃铛, 没有待办");
                    基建换班(fatigue_state);
                    访问好友();
                    threadMain.interrupt();
                    threadMain = threads.start(采购);
                }
            }



        }
        let to_do = 0;
        if (ITimg.picture("基建_可收获", {
                action: 0,
                timing: 2000,
                area: "左半屏",
            })) {
            to_do++;
        }
        if (ITimg.picture("基建_订单交付", {
                action: 0,
                timing: 2000,
                area: "左半屏",
            })) {
            to_do++;
        };
        sleep(1000);
        if (ITimg.picture("基建_订单交付", {
                action: 0,
                timing: 2000,
                area: "左半屏",
            })) {
            to_do++;
        };
        if (ITimg.picture("基建_信赖", {
                action: 0,
                timing: 3000,
                area: "左半屏",
            })) {
            to_do++;
        };
        fatigue_state = ITimg.picture("基建_干员疲劳", {
            timing: 500,
            area: "左半屏",
        });

        if (fatigue_state) {
            to_do++;
            console.error("发现干员疲劳！基建换班:" + setting.基建换班);
        }
        if (!to_do) {
            //重试收菜
            return 待办处理();

        } else {
            return true;
        }
    }

    无人机加速 = function() {
        if (!setting.无人机加速) {
            sleep(500);
            return false
        }
        tool.Floaty_emit("面板", "隐藏");
        this.identify_frequency = 5;
        this.where_interface = 0;
        if (setting.加速生产) {
            console.info("查询制造站");
            //进入制造站
            while (this.identify_frequency) {

                this.where_interface = (ITimg.picture("基建_制造站", {
                    action: 0,
                    timing: 1500,
                    area: "左半屏",
                    nods: 500,
                    threshold: 0.7,
                }) || ITimg.picture("基建_制造站", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    threshold: 0.7,
                }) || ITimg.picture("基建_制造站", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.7,
                }));


                if (!this.where_interface) {
                    this.identify_frequency--;
                    if (!this.identify_frequency) {
                        let tips = "无法匹配到 基建_制造站.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是基建主界面";
                        toast(tips);
                        console.error(tips);
                        return false;
                    }

                };

                this.in_manufacturing = (ITimg.picture("制造站_制造中", {
                    action: 0,
                    timing: 1000,
                    area: "左下半屏",
                }) || ITimg.picture("制造站_制造中", {
                    action: 0,
                    timing: 1000,
                    area: "左下半屏",
                    threshold: 0.75,
                }));

                if (this.in_manufacturing) {
                    break;
                } else {
                    if (!this.identify_frequency) {
                        let tips = "无法匹配到 制造站_制造中.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是制造站界面";
                        toast(tips);
                        console.error(tips);
                        sleep(500);
                        ITimg.picture("返回", {
                            action: 4,
                            timing: 1200,
                            area: "上半屏",
                        });
                        return false;
                    };
                }

            }




            ITimg.picture("无人机_加速", {
                action: 0,
                area: "右半屏",
                timing: 2000,
            });
            ITimg.picture("无人机_最多", {
                action: 0,
                area: "右半屏",
                timing: 1000,
            });
            if (!ITimg.picture("无人机_确定", {
                    action: 0,
                    area: "右半屏",
                    timing: 3000,
                })) {
                ITimg.picture("无人机_确定", {
                    action: 0,
                    area: "右半屏",
                    timing: 3000,
                    threshold: 0.75,
                })
            }
            ITimg.picture("无人机_收取", {
                action: 0,
                area: "右半屏",
                timing: 2000,
            });
            ITimg.picture("返回", {
                action: 4,
                timing: 1500,
                area: "上半屏",
            });

            ITimg.picture("返回", {
                action: 4,
                timing: 2000,
                area: "上半屏",
            });
            //防止偶然点击返回方舟无反应的情况
            if (ITimg.picture("制造站_制造中", {
                    action: 5,
                    area: "左下半屏",
                })) {
                ITimg.picture("返回", {
                    action: 4,
                    timing: 2000,
                    area: "上半屏",
                });
            }


        } else {
            console.info("查询贸易站");
            //进入贸易站
            while (this.identify_frequency) {

                if (ITimg.picture("基建_贸易站", {
                        action: 0,
                        timing: 1500,
                        nods: 500,
                        area: "左半屏",
                    }) || ITimg.picture("基建_贸易站", {
                        action: 0,
                        timing: 1500,
                        threshold: 0.75,
                        log_policy: true,
                        area: "下半屏",
                    }) || ITimg.picture("基建_贸易站", {
                        action: 0,
                        timing: 1500,
                        threshold: 0.70,
                        area: "上半屏",
                        log_policy: true,
                    })) {
                    break
                } else {
                    if (this.identify_frequency == 1) {
                        let tips = "无法匹配到 基建_贸易站.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是基建主界面";
                        toastLog(tips);
                        console.error(tips);
                        return false;
                    }
                    this.identify_frequency--;
                }
            }
            //确认进入贸易站
            (ITimg.picture("基建_贸易站", {
                action: 0,
                timing: 1500,
                nods: 500,
                area: "左半屏",
            }) || ITimg.picture("基建_贸易站", {
                action: 0,
                timing: 1500,
                area: "左半屏",
                threshold: 0.75,
                log_policy: true,
            }));

            //开始执行贸易站无人机加速
            this.where_interface = (ITimg.picture("贸易站_获取中", {
                action: 0,
                timing: 1000,
                area: "下半屏",
            }) || ITimg.picture("贸易站_获取中", {
                action: 0,
                timing: 1000,
                area: "下半屏",
                threshold: 0.75,
            }));
            if (!this.where_interface) {
                let tips = "无法匹配到 贸易站_获取中.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是贸易站界面";
                toastLog(tips);
                console.error(tips);
                sleep(500);
                ITimg.picture("返回", {
                    action: 4,
                    timing: 1200,
                    area: "上半屏",
                });
                return false;
            }
            this.drone_assistance = 3;
            while (this.drone_assistance) {
                if (!ITimg.picture("无人机_协助", {
                        action: 0,
                        timing: 1000,
                        nods: 1000,
                        area: 34,
                    }) && !ITimg.picture("无人机_协助", {
                        action: 0,
                        timing: 1000,
                        area: 34,
                        log_policy: true,
                    }) && (this.drone_assistance == 3)) {
                    if ((ITimg.picture("贸易站_获取中", {
                            action: 0,
                            timing: 1000,
                            area: "下半屏",
                        }) || ITimg.picture("贸易站_获取中", {
                            action: 0,
                            timing: 1000,
                            area: "下半屏",
                            threshold: 0.75,
                        }))) {
                        (ITimg.picture("无人机_协助", {
                            action: 0,
                            timing: 1000,
                            nods: 1000,
                            area: 34,
                        }) || ITimg.picture("无人机_协助", {
                            action: 0,
                            timing: 1000,
                            area: 34,
                            log_policy: true,
                        }));
                    }
                }
                ITimg.picture("无人机_最多", {
                    action: 0,
                    timing: 200,
                    area: "右半屏",
                });
                if (drone_assistance == 1) {
                    ITimg.picture("无人机_减少", {
                        action: 0,
                        timing: 2000,
                    });
                }
                (ITimg.picture("无人机_确定", {
                    action: 0,
                    timing: 2000,
                    area: "右半屏",
                }) || ITimg.picture("无人机_确定", {
                    action: 0,
                    timing: 2000,
                    area: "右半屏",
                    threshold: 0.75,
                }))

                drone_assistance--;
            }
            //返回基建主页面
            ITimg.picture("返回", {
                action: 4,
                timing: 1500,
                area: "上半屏",
            });
            ITimg.picture("返回", {
                action: 4,
                timing: 2000,
                area: "上半屏",
            });

            if (ITimg.picture("贸易站_获取中", {
                    action: 5,
                    area: "下半屏",
                })) {
                ITimg.picture("返回", {
                    action: 4,
                    timing: 2000,
                    area: "上半屏",
                });
            }
            if (ITimg.picture("基建_蓝色铃铛", {
                    action: 0,
                    timing: 1500,
                    area: "右半屏",
                }) || ITimg.picture("基建_蓝色铃铛", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.75,
                })) {
                ITimg.picture("基建_订单交付", {
                    action: 0,
                    timing: 2000,
                    area: "下半屏",
                });
            }

        }
        sleep(100);

    }

    会客室线索处理 = function() {
        if (!setting.会客室线索) {
            sleep(200);
            log("会客室线索" + setting.会客室线索);
            return false;
        }
        tool.Floaty_emit("展示文本", "状态", "状态：准备线索处理中");
        ITimg.picture("基建_蓝色铃铛", {
            action: 0,
            timing: 1500,
            area: "右半屏",
        });
        ITimg.picture("基建_铃铛", {
            action: 0,
            timing: 2000,
            area: "右半屏",
        });

        if (!ITimg.picture("基建_线索", {
                action: 0,
                timing: 1500,
                area: "右半屏",
            }) && !ITimg.picture("基建_线索", {
                action: 0,
                timing: 1500,
                area: "上半屏",
                resolution: true,
                log_policy: true,
                threshold: 0.70,
            })) {
            toastLog("没有匹配到 基建_线索.png 尝试放大基建主页面重新进行匹配");
            放大基建界面();
            sleep(50);
            //划出会客室位置界面
            swipe(Math.floor(height / 1.2), Math.floor(width / 6), Math.floor(height / 2.5), Math.floor(width / 1.2), 500);
            sleep(500);
            if (!ITimg.picture("基建_线索", {
                    action: 0,
                    timing: 1500,
                    log_policy: true,
                    area: "右上半屏",
                }) && !ITimg.picture("基建_线索", {
                    action: 0,
                    timing: 1500,
                    area: "右上半屏",
                    resolution: true,
                    threshold: 0.70,
                })) {
                toastLog("没有匹配到基建_线索.png, 可能会客室没有新线索待处理");
                sleep(500)
                return false;
            }
        }

        //拥有新线索

        tool.Floaty_emit("展示文本", "状态", "状态：执行会客室线索中");
        tool.Floaty_emit("面板", "隐藏");
        //检验是否溢出线索
        if (setting.处理线索溢出 && ITimg.initocr()) {

            if (ITimg.ocr("8/10", {
                    action: 5,
                    part: true,
                    area: "左半屏",
                }) || ITimg.ocr("9/10", {
                    action: 5,
                    area: "左半屏",
                    refresh: false,
                    part: true,
                    log_policy: true,
                }) || ITimg.ocr("10/10", {
                    action: 5,
                    refresh: false,
                    area: "左半屏",
                    part: true,
                    log_policy: "简短",
                })) {
                setting.处理线索溢出 = "线索待处理"
            }
        }
        //进入线索界面
        if (!ITimg.picture("线索_会客室", {
                action: 0,
                timing: 2000,
                area: "下半屏",
            }) && !ITimg.picture("线索_会客室", {
                action: 0,
                timing: 2000,
                area: "左半屏",
                threshold: 0.75,
            })) {

            toastLog("没有匹配到 线索_会客室.png , 无法处理线索! ");
            sleep(500);
            (ITimg.picture("返回", {
                action: 4,
                timing: 1500,
                nods: 500,
                area: "左半屏",
            }) || ITimg.picture("返回", {
                action: 4,
                timing: 1500,
                area: "上半屏",
                threshold: 0.75,
            }));
            return false;
        }

        (ITimg.picture("线索_会客室", {
            action: 0,
            timing: 2000,
            area: "下半屏",
        }) || ITimg.picture("线索_会客室", {
            action: 0,
            timing: 2000,
            area: "左半屏",
        }));

        sleep(2000);
        if (ITimg.picture("线索_交流", {
                timing: 3000,
                area: "左半屏",
            }) || ITimg.picture("线索_交流", {
                action: 0,
                timing: 3000,
                area: "上半屏",
                threshold: 0.75,
            })) {
            if (!ITimg.picture("返回", {
                    action: 4,
                    timing: 1500,
                    nods: 500,
                    area: "左半屏",
                }) && !ITimg.picture("返回", {
                    action: 4,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.75,
                })) {
                toastLog("找不到返回键");
            };
        }
        //处理即将溢出线索
        if (setting.处理线索溢出 == "线索待处理") {

            if (ITimg.picture("线索_传递", {
                    action: 0,
                    timing: 3000,
                    nods: 1000,
                    area: "右半屏",
                }) || ITimg.picture("线索_传递", {
                    action: 0,
                    timing: 3000,
                    area: "右半屏",
                    threshold: 0.75,
                })) {
                sleep(1000)
                //将线索集合
                let xsmc = ["莱茵生命", "企鹅物流", "黑钢", "乌萨斯学生自治团", "格拉斯哥帮", "喀兰贸易", "罗德岛制药"]
                let xsjh = []

                taglb = ITimg.ocr("获取屏幕文字", {
                    action: 6,
                    area: "左半屏",
                    correction_path: "信用",
                })
                console.info(taglb)

                swipe(250, width - 100, 250, 200, 300);
                for (i in taglb) {
                    if (xsmc.indexOf(taglb[i].text) != -1) {
                        xsjh.push(taglb[i].text)
                    }
                }

                sleep(200)
                taglb = ITimg.ocr("获取屏幕文字", {
                    action: 6,
                    area: "左半屏",
                    correction_path: "信用",
                })
                console.info(taglb)
                for (i in taglb) {
                    if (xsmc.indexOf(taglb[i].text) != -1) {
                        xsjh.push(taglb[i].text)
                    }
                }
                log(xsjh)
                let cdcs = 0;
                //送出重复线索
                xsjh.map((val, index) => {
                    if (xsjh.indexOf(val) != xsjh.lastIndexOf(val)) {
                        if (传递线索(val)) {
                            cdcs++;
                            xsjh.splice(index, 1)
                        }

                    }
                })

                //送出不重复
                for (i in xsjh) {
                    if (cdcs < 2) {
                        if (传递线索(xsjh[i])) {
                            cdcs++;
                        }
                    }
                }
                sleep(500)
                MyAutomator.click(height - 72, 50)
                MyAutomator.click(height - 72 * 2, 50)
                MyAutomator.click(height - 72 * 3, 50)
                MyAutomator.click(height - 72 * 4, 50)

                if (ITimg.ocr("传递奖励", {
                        action: 5,
                        part: true,
                        area: "右半屏",
                        correction_path: "信用",
                    }) || ITimg.ocr("20", {
                        action: 5,
                        part: true,
                        similar: 1,
                        area: "右半屏",
                        correction_path: "信用",
                    })) {
                    sleep(500)
                    MyAutomator.click(height - 72, 50)
                    MyAutomator.click(height - 72 * 2, 50)
                    MyAutomator.click(height - 72 * 3, 50)
                    MyAutomator.click(height - 72 * 4, 50)
                }
            } else {
                let tips = "无法匹配到 线索_传递.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是会客室界面";
                toastLog(tips);
                console.error(tips);
            }



        }

        for (let i = 1; i <= 2; i++) {
            //收取线索
            temporary_xy = ITimg.picture("线索_NEW", {
                action: 5,
                nods: 1000,
                area: "右半屏",
            })
            if (!temporary_xy) {
                temporary_xy = ITimg.picture("线索_NEW", {
                    action: 5,
                    area: "上半屏",
                    threshold: 0.75,
                })
            }
            if (!temporary_xy) {

                toastLog("没有新的可领取线索");
                sleep(500);
                /** 
                * 下个就是好友访问了,直接离开基建,不用返回基建主页
                (ITimg.picture("返回", {
                    action: 0,
                    timing: 1500,
                    nods: 500,
                    area: "左半屏",
                }) || ITimg.picture("返回", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.75,
                }));
                (ITimg.picture("返回", {
                    action: 0,
                    timing: 1500,
                    nods: 500,
                    area: "左半屏",
                }) || ITimg.picture("返回", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.75,
                }));
                */
                break
                //  return true;
            };

            //点击new可领取新的
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 15, temporary_xy.bottom);
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 25, temporary_xy.bottom);
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 40, temporary_xy.bottom);
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 60, temporary_xy.bottom);

            sleep(2000);
            if (ITimg.picture("线索_全部收取", {
                    action: 0,
                    timing: 2500,
                    area: "下半屏",
                })) {
                sleep(100);
                MyAutomator.click(height / 2 + random(-10, 10), 50 + random(-5, 5));
                sleep(500);
            } else {

                ITimg.picture("线索_领取", {
                    action: 0,
                    timing: 2000,
                    area: "下半屏",
                });
                ITimg.picture("关闭公告", {
                    action: 0,
                    timing: 1500,
                    area: "右半屏",
                });

            };

        }
        sleep(1000);
        //放入线索
        for (let i = 1; i <= 7; i++) {
            if (ITimg.picture("线索" + i.toString(), {
                    action: 0,
                    timing: 1000,
                })) {
                if (!ITimg.picture("线索_相关搜集者", {
                        action: 0,
                        timing: 3000,
                        nods: 500,
                        area: "下半屏",
                    })) {
                    ITimg.picture("线索_相关搜集者", {
                        action: 0,
                        timing: 3000,
                        area: "上半屏",
                    })
                };
            };
        }

        ITimg.picture("线索_解锁", {
            action: 0,
            timing: 2000,
            area: "下半屏",
        })

        /** 
         * 下个就是好友访问了,直接离开基建,不用返回基建主页
                sleep(500);
                (ITimg.picture("返回", {
                    action: 0,
                    timing: 2000,
                    nods: 1500,
                    area: "左半屏",
                }) || ITimg.picture("返回", {
                    action: 0,
                    timing: 2000,
                    area: "左半屏",
                }));
                ///还在会客室时再点下返回
                if(ITimg.picture("线索_会客室", {
                    action: 0,
                    timing: 2000,
                    area: "下半屏",
                }) || ITimg.picture("线索_会客室", {
                    action: 0,
                    timing: 2000,
                    area: "左半屏",
                })){
                    (ITimg.picture("返回", {
                        action: 0,
                        timing: 2000,
                        nods: 1500,
                        area: "左半屏",
                    }) || ITimg.picture("返回", {
                        action: 0,
                        timing: 2000,
                        area: "左半屏",
                    }));
                }
                */
        return true;

    }

    传递线索 = function(xs) {
        swipe(250, 200, 250, width - 100, 500);
        sleep(500)

        if (!ITimg.ocr(xs, {
                action: 0,
                area: "左半屏",
                correction_path: "信用",
            })) {
            swipe(250, width - 100, 250, 200, 500);
            sleep(500)

            if (!ITimg.ocr(xs, {
                    action: 0,
                    area: "左半屏",
                    correction_path: "信用",
                })) {
                return false
            }
        }
        sleep(500)
        let img = ITimg.captureScreen_()
        let point = findColor(img, "#ff6800", {
            region: [Math.floor(height / 1.6), 0, Math.floor(height / 4.8), width],
            threads: 6
        });
        try {
            img.recycle();
        } catch (e) {};
        console.info(point)
        if (point) {
            MyAutomator.click(Math.floor((height / 2340) * 2000), point.y)
            Combat_report.record("传递线索：" + xs, undefined, "info")

            sleep(500)
            return true
        }
        return false
    }
    放大基建界面 = function() {
        //0秒后执行,持续500毫秒
        let left_gesture = [0, 500]
        let right_gesture = [0, 500]

        for (let i = 0; i < 10; i++) {
            let axis_x = height / 2 - i * 50;
            let axis_y = width / 2;
            //在最后一步向上滑动,防止手势带来的惯性
            if (i == 9) {
                axis_x = height / 2 - (i - 1) * 50;
                axis_y = width / 2 - 50;
            }
            left_gesture.push([axis_x, axis_y])
        }
        for (let i = 0; i < 10; i++) {
            let axis_x = height / 2 + i * 50;
            let axis_y = width / 2;
            if (i == 9) {
                axis_x = height / 2 + (i - 1) * 50;
                axis_y = width / 2 - 50;
            }
            right_gesture.push([axis_x, axis_y]);
        }
        let gesturesAry_ = [
            [left_gesture, right_gesture]
        ];

        for (let i = 0; i < gesturesAry_.length; i++) {
            gestures.apply(null, gesturesAry_[i]);
            sleep(400);
        };
    }
    确认已进入基建页面 = function() {
        while (true) {
            sleep(100)
            ITimg.picture("基建", {
                action: 0,
                timing: 3000,
                area: "右半屏",
            })
            sleep(100);
            if (ITimg.picture("返回", {
                    action: 5,
                    timing: 1500,
                    area: "左上半屏",
                }) || ITimg.picture("基建_铃铛", {
                    action: 5,
                    timing: 1500,
                    area: "右上半屏",
                })) {
                sleep(200)
                break;
            } else {
                if (ITimg.picture("导航", {
                        action: 0,
                        timing: 1500,
                        area: "左半屏",
                    }) || ITimg.picture("导航2", {
                        action: 0,
                        timing: 1500,
                        area: "左半屏",
                    })) {
                    if (ITimg.picture("导航_基建", {
                            action: 0,
                            timing: 3000,
                            area: "上半屏",
                        })) {
                        break;
                    }
                }
            }

        }
        return true;
    }
    访问好友 = function() {
        setting = tool.readJSON("configure");
        let Day = new Date().getMonth(); //月
        let Dat = new Date().getDate(); //日
        Day = Day + 1;
        if (Day + "." + Dat != setting.当天) {
            if (new Date().getHours() >= 4) {
                tool.writeJSON("当天", Day + "." + Dat);
                setting.好友 = 0;
                tool.writeJSON("好友", 0);
            }
        }
        if (!setting.好友访问 || setting.好友 >= 10) {
            if (setting.好友 >= 10) {
                toastLog("今日访问好友已上限");
            } else {
                log("好友访问" + setting.好友访问);
            }

            return false
        }
        if (Day + "." + Dat != setting.当天) {
            if (new Date().getHours() >= 4) {
                tool.writeJSON("当天", Day + "." + Dat);
                tool.writeJSON("好友", 0);
            }
        }
        Day = null;
        Dat = null;
        tool.Floaty_emit("展示文本", "状态", "状态：执行访问好友中");
        tool.Floaty_emit("面板", "隐藏");
        (ITimg.picture("导航", {
            action: 0,
            timing: 1000,
            area: "左半屏",
        }) || ITimg.picture("导航2", {
            action: 0,
            timing: 1000,
            area: "左半屏",
        }))

        sleep(200);
        temporary_xy = (ITimg.picture("导航_任务", {
            action: 5,
            nods: 2000,
            area: "右半屏",
        }) || ITimg.picture("导航_任务", {
            action: 5,
            area: "右半屏",
        }))
        if (!temporary_xy) {
            toast("没有找到导航_任务，无法执行好友访问");
            console.error("没有找到导航_任务，无法执行好友访问");
            return false;
        }
        log("点击 导航_任务转导航_好友, x:" + (temporary_xy.x + temporary_xy.w) + "y:" + temporary_xy.y)
        sleep(10);
        MyAutomator.click((temporary_xy.x + temporary_xy.w) + 100, temporary_xy.y);
        sleep(100)
        MyAutomator.click((temporary_xy.x + temporary_xy.w) + 50, temporary_xy.y);
        sleep(100)
        MyAutomator.click(temporary_xy.x + temporary_xy.w, temporary_xy.y);
        sleep(600);
        (ITimg.picture("基建_离开", {
            action: 0,
            timing: 6000,
            nods: 500,
            area: "右半屏",
        }) || ITimg.picture("基建_离开", {
            action: 0,
            timing: 6000,
            area: "右半屏",
        }))


        this.identify_frequency = 10;
        while (this.identify_frequency) {
            if (!ITimg.picture("好友列表", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                    nods: 1000,
                })) {
                if (this.identify_frequency == 1) {
                    let tips = "长时间无法匹配到 好友访问.png 小图，请确认图库是否匹配设备分辨率, 或当前界面是否好友界面";
                    toast(tips);
                    console.error(tips);
                    return false;
                }
                this.identify_frequency--;
            } else {
                break;
            }
        }

        sleep(200);

        if (!ITimg.picture("访问基建", {
                action: 0,
                timing: 8000,
                nods: 1500,
                grayscale: 1,
            }) && !ITimg.picture("访问基建", {
                action: 0,
                area: 34,
                timing: 8000,
                nods: 1500,
                grayscale: 1,
            }) && !ITimg.picture("访问基建", {
                action: 0,
                timing: 8000
            })) {
            toast("没有找到访问基建，无法执行好友访问");
            console.error("没有找到访问基建，无法执行好友访问");
            return false
        }
        tool.Floaty_emit("面板", "展开");
        if (!setting.好友限制) {
            setting.好友 = 0;
        }
        while (true) {
            if (setting.好友 >= 10) {
                Combat_report.record("今日累计访问" + setting.好友 + "个好友");
                toastLog("已访问十次，达到上限，退出访问");
                break;
            };


            if (ITimg.picture("访问下位", {
                    action: 0,
                    timing: 5000,
                    nods: 1500,
                    area: "下半屏",
                }) || ITimg.picture("访问下位", {
                    action: 0,
                    timing: 6000,
                    nods: 2500,
                    area: "下半屏",
                }) || ITimg.picture("访问下位", {
                    action: 0,
                    timing: 8000,
                    area: "下半屏",
                })) {
                setting.好友 = setting.好友 + 1;
                tool.writeJSON("好友", setting.好友);
                sleep(1000);
            } else {
                Combat_report.record("今日累计访问" + setting.好友 + "个好友");
                toastLog("今日访问" + setting.好友 + "个好友,没有待访问，退出");

                break;
            }

            tool.Floaty_emit("展示文本", "理智", "恢复" + setting.已兑理智 + "次理智，访问" + setting.好友 + "个好友");
        } //循环

        return true;

    }
    tool.Floaty_emit("面板", "复位");
    toastLog("2秒后启动基建收菜程序");
    threadMain.setName("基建收菜");
    sleep(1000);
    setting = tool.readJSON("configure");
    tool.Floaty_emit("展示文本", "状态", "状态：执行基建收菜中");
    if (!ITimg.picture("基建", {
            action: 0,
            timing: 3000,
            nods: 1000,
            area: "右半屏",
        }) && !ITimg.picture("基建", {
            action: 0,
            timing: 3000,
            area: 4,
        })) {
        if (ITimg.picture("导航", {
                action: 0,
                nods: 1000,
                timing: 1500,
                area: "左半屏",
            }) || ITimg.picture("导航", {
                action: 0,
                timing: 1500,
                area: "上半屏",
            }) || ITimg.picture("导航2", {
                action: 0,
                timing: 1500,
                nods: 1000,
                area: "左半屏",
            }) || ITimg.picture("导航2", {
                action: 0,
                timing: 1500,
                area: "上半屏",
            })) {

            if (!ITimg.picture("导航_基建", {
                    action: 0,
                    timing: 500,
                    nods: 1000,
                    area: "上半屏",
                }) && !ITimg.picture("导航_基建", {
                    action: 0,
                    timing: 500,
                    area: "上半屏",
                })) {
                toastLog("没有找到导航_基建，无法执行基建");
                threadMain.interrupt();
                threadMain = threads.start(采购);
            }
        } else {
            tool.Floaty_emit("展示文本", "状态", "状态：主程序暂停中");
            tool.Floaty_emit("暂停", "结束程序");
            toastLog("既没有找到主页面基建键，也没有找到导航键。\n无法进入基建");
            return false;
        }


    };

    确认已进入基建页面();



    待办处理();
    基建换班(fatigue_state)
    console.info("无人机加速" + setting.无人机加速)
    无人机加速();

    会客室线索处理();
    访问好友();

    threadMain.interrupt();
    threadMain = threads.start(采购);
}; //线程



function 采购() {
    sleep(50);
    threadMain.setName("采购程序");
    if (setting.收取信用) {
        // let da = new Date();
        tool.Floaty_emit("展示文本", "状态", "状态：执行收集信用中");
        toastLog("2秒后启动采购程序");
        sleep(1500);

        if (ITimg.picture("导航", {
                action: 0,
                timing: 1500,
                area: "左半屏",
            }) || ITimg.picture("导航2", {
                action: 0,
                timing: 1500,
                area: "左半屏",
            })) {
            if (ITimg.picture("导航_采购中心", {
                    action: 0,
                    timing: 3000,
                    nods: 1000,
                    area: "上半屏",
                }) || ITimg.picture("导航_采购中心", {
                    action: 0,
                    timing: 3000,
                    nods: 1000,
                    area: "右半屏",
                })) {
                if (ITimg.picture("信用交易所", {
                        action: 0,
                        timing: 2000,
                        area: "右半屏",
                    })) {
                    if (ITimg.picture("收取信用", {
                            action: 0,
                            timing: 3000,
                            area: "上半屏",
                        })) {
                        sleep(1000)
                        if (ITimg.picture("获得物资", {
                                action: 0,
                                timing: 2000,
                            })) {
                            toastLog("收获信用");
                            Combat_report.record("收取了信用");
                        } else {
                            sleep(2000);
                            ITimg.picture("获得物资", {
                                action: 0,
                                timing: 2000,
                            });
                            toastLog("收获信用");
                            Combat_report.record("收取了信用");
                        }
                    } else {

                        toastLog("没有待收取信用");
                    };
                    if (setting.信用处理.信用购买) {
                        购买信用物品()
                        tool.Floaty_emit("面板", "展开");
                    } else {
                        log("购买物品" + setting.信用处理.信用购买)
                    }

                    /* threadMain.interrupt();
                     threadMain = threads.start(任务);*/
                };

            };
        } else {
            toastLog("无法查找导航，收取信用失败");
        }


    } else {
        log("收取信用" + setting.收取信用);
    };
    if (setting.公招) {
        threadMain.interrupt();
        threadMain = threads.start(公招);
    } else {
        log("自动公招" + setting.公招);
        threadMain.interrupt();
        threadMain = threads.start(任务);
    }
}; //线程

function 购买信用物品() {
    sleep(1000);
    MyAutomator.click(height / 2 + random(-10, 10), 25 + random(-5, 5));
    if (ITimg.language == "简中服") {
        sleep(500);
        if (!ITimg.initocr()) {
            return false;
        };
        if (检测300信用()) {
            return false;
        }

        tool.Floaty_emit("展示文本", "状态", "状态：执行购买物品中");
        tool.Floaty_emit("面板", "隐藏");
        sleep(500);
        let goods;

        log(setting.信用处理.优先顺序 ? "优先顺序购买" : "优先优惠购买")
        if (setting.信用处理.优先顺序) {
            taglb = ITimg.ocr("集合上半屏物品名", {
                action: 6,
                area: [0, 0, height, Math.floor(width / 1.9)],
                correction_path: "信用",
            });
            let taglb_ = ITimg.ocr("集合下半屏物品名", {
                action: 6,
                area: [0, width / 2, height, width / 2],
                correction_path: "信用",
            })
            let product_collection = [];
            for (let i_ of taglb) {
                product_collection.push(i_.text);
            }
            for (let i__ of taglb_) {
                product_collection.push(i__.text);
            }
            console.warn("商品集合名:\n" + JSON.stringify(product_collection))
            for (let i = 0; i < setting.信用处理.购买列表.length; i++) {
                goods = ITimg.ocr(setting.信用处理.购买列表[i], {
                    gather: taglb,
                    action: 5,
                    part: true,
                    correction_path: "信用",
                    log_policy: true,
                });
                if (!goods) {
                    goods = ITimg.ocr(setting.信用处理.购买列表[i], {
                        gather: taglb_,
                        action: 5,
                        part: true,
                        correction_path: "信用",
                        log_policy: true,
                    })
                }

                if (!goods) {
                    log("没有匹配到" + setting.信用处理.购买列表[i])
                    continue;
                }
                //购买

                MyAutomator.click(goods.left + random(5, 10), goods.top + random(30, 40))
                sleep(800)
                let img = ITimg.captureScreen_()
                let point = findColor(img, "#ff6800", {
                    region: [Math.floor(height / 1.6), width / 1.5, 170, (width / 3.5) - 50],
                    threads: 7
                });
                try {
                    img.recycle();
                } catch (e) {};
                if (point) {
                    MyAutomator.click(point.x + 50, point.y + 20);
                    sleep(1500)
                    if (!ITimg.picture("获得物资", {
                            action: 0,
                            timing: 1000,
                        })) {
                        sleep(1000)

                        while (等待提交反馈至神经()) {};
                        if (!ITimg.picture("获得物资", {
                                action: 0,
                                timing: 1000,
                            })) {
                            MyAutomator.click(height / 2, 50);
                            sleep(500)
                            toastLog("没有足够的信用点购买 " + setting.信用处理.购买列表[i])
                            break
                        };
                    };
                    Combat_report.record("购买了信用物品： " + setting.信用处理.购买列表[i], false, "info");

                    sleep(500)
                    if (检测300信用()) {
                        break
                    }
                } else {
                    console.warn("查找购物按钮失败，" + setting.信用处理.购买列表[i] + "可能已经购买")
                }
                //防止不够买相同商品
                let ii = i;
                taglb.forEach((item, index, taglb) => {
                    if (item.text == goods.text && item.left == goods.left) {
                        taglb.splice(index, 1);
                        i--;
                    }
                })
                if (ii == i) {

                    if (taglb_) {
                        taglb_.forEach((item, index, taglb_) => {
                            if (item.text == goods.text && item.left == goods.left) {
                                taglb_.splice(index, 1);
                                i--;
                            }
                        })
                    }
                }

            }
        } else {

            let discount_list = ['-99%', '-90%', '-75%', '-50%'];
            taglb = ITimg.ocr("集合全屏物品名", {
                action: 6,
                correction_path: "信用",
            });
            let product_collection = [];
            for (let i_ of taglb) {
                product_collection.push(i_.text);
            };

            console.warn("商品优惠集合:\n" + JSON.stringify(product_collection))
            for (let i = 0; i < discount_list.length; i++) {
                if (goods = ITimg.ocr(discount_list[i], {
                        gather: taglb,
                        log_policy: true,
                        similar: 1,
                        action: 5,
                        part: true,
                        correction_path: "信用",
                    })) {
                    MyAutomator.click(goods.right, goods.bottom);
                    //判断物品名是否在购买列表
                    sleep(500)
                    let shangpinming = ITimg.ocr("购买的物品名", {
                        action: 6,
                        area: "左上半屏",
                        correction_path: "信用",
                    })
                    for (var l = 0; l < shangpinming.length; l++) {
                        if (setting.信用处理.购买列表.indexOf(shangpinming[l].text) == -1) {
                            if ((shangpinming.length - 1) == l) {
                                toastLog(shangpinming[l].text + " 不是需要购买的物品")
                                MyAutomator.click(height / 2, 50);
                                sleep(500)
                                //移除此物品
                                taglb.forEach((item, index, taglb) => {
                                    if (item.text == goods.text && item.left == goods.left) {
                                        taglb.splice(index, 1);
                                        i--;
                                    }
                                })

                            }
                        } else {
                            //购买
                            let img = ITimg.captureScreen_()
                            let point = findColor(img, "#ff6800", {
                                region: [Math.floor(height / 1.6), width / 2, 170, width / 2],
                                threads: 7
                            });
                            try {
                                img.recycle();
                            } catch (e) {};
                            if (point) {
                                MyAutomator.click(point.x + 50, point.y + 20);
                                sleep(1000)
                                if (!ITimg.picture("获得物资", {
                                        action: 0,
                                        timing: 1000,
                                    })) {
                                    sleep(1000)

                                    while (等待提交反馈至神经()) {}
                                    if (!ITimg.picture("获得物资", {
                                            action: 0,
                                            timing: 1000,
                                        })) {
                                        MyAutomator.click(height / 2, 50);
                                        sleep(500)
                                        toastLog("没有足够的信用点购买 " + setting.信用处理.购买列表[i])
                                        break
                                    };
                                };
                                Combat_report.record("购买了信用物品： " + shangpinming[l].text, false, "info");

                                //移除此物品
                                taglb.forEach((item, index, taglb) => {
                                    if (item.text == goods.text && item.left == goods.left) {
                                        taglb.splice(index, 1);
                                        i--;
                                    }
                                })

                                sleep(500)
                                if (检测300信用()) {
                                    break
                                }
                            } else {
                                console.warn("查找购物按钮失败，" + setting.信用处理.购买列表[i] + "可能已经购买")
                            }
                        }
                    }

                }
            }
        }

        //外服购买
    } else {
        sleep(1000);
        tool.Floaty_emit("展示文本", "状态", "状态：执行购买商品中");
        while (true) {
            if (ITimg.picture("信用交易所_物品", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                })) {
                let img = ITimg.captureScreen_()
                let point = findColor(img, "#ff6800", {
                    region: [Math.floor(height / 1.6), width / 2, 170, width / 2],
                    threads: 7
                });
                try {
                    img.recycle();
                } catch (e) {};

                if (point) {
                    MyAutomator.click(point.x + 50, point.y + 20);
                    sleep(1500)
                    if (!ITimg.picture("获得物资", {
                            action: 0,
                            timing: 1000,
                        })) {
                        MyAutomator.click(height / 2, 50);
                        Combat_report.record("购买了信用商品");
                        sleep(500)
                    };
                } else {
                    console.error("查找购物按钮失败")
                }
            } else {
                break;
            }
        }

    }

    function 检测300信用() {
        if (setting.信用处理.三百信用) {
            tool.Floaty_emit("展示文本", "状态", "状态：判断是否需要购买中");
            let credits = ITimg.ocr("300", {
                similar: 1,
                area: [Math.floor(height / 1.2), 0, height - Math.floor(height / 1.2), 200],
                action: 5,
                part: true,
                correction_path: "信用",
            })
            if (!credits) {
                credits = ITimg.ocr("300", {
                    area: [Math.floor(height / 1.2), 0, height - Math.floor(height / 1.2), 200],
                    similar: 1,
                    action: 6,
                    part: true,
                    correction_path: "信用",
                });

                if (!credits) {
                    tool.Floaty_emit("展示文本", "状态", "状态：无法获取可用信用点");
                    console.error("无法获取可用信用点；识别结果1：" + JSON.stringify(credits))
                    return false
                }

                for (let l = 0; l < credits.length; l++) {
                    if (!isNaN(Number(credits[l].text))) {
                        credits = Number(credits[l].text);
                        break
                    }
                }
            }
            if (!credits) {
                tool.Floaty_emit("展示文本", "状态", "状态：无法获取可用信用点");
                console.error("无法获取可用信用点；识别结果2：" + JSON.stringify(credits))
                return false
            }

            console.info("可用信用点：" + credits)
            if (credits < 300) {
                toastLog("信用点小于300点，无需购买")
                tool.Floaty_emit("展示文本", "状态", "状态：小于300点，无需购买");
                return true
            } else {
                return false
            }

        } else {
            return null
        }
    }
}

function 等待提交反馈至神经() {
    console.verbose('等待提交反馈至神经');
    sleep(200);
    ITimg.ocr("正在提交反馈至神经", {
        action: 5,
        area: "下半屏",
        part: true,
        correction_path: "通用",
    })
    var to_match = ['正在提交反馈至神经', '提交反馈', '提交', '反馈', '神经']
    for (let i in to_match) {
        if (ITimg.ocr(to_match[i], {
                action: 5,
                part: i ? true : false,
                refresh: false,
                log_policy: true,
                timing: 1000,
            })) {
            return true;
        }

    }

    return false
}



function 公招(Manual) {
    Manual = Manual || false;
    let position = 0;
    tool.Floaty_emit("面板", "复位");

    try {
        threadMain.setName("公招程序");
    } catch (err) {};


    if (ITimg.language != "简中服") {
        toastLog("非常抱歉，公招识别目前仅简中服可使用");
        tool.Floaty_emit("面板", "展开");
        threadMain.interrupt();
        threadMain = threads.start(任务);
        return;
    }

    setting = tool.readJSON("configure");
    if (!ITimg.initocr()) {
        tool.Floaty_emit("面板", "展开");
        return false;
    }
    let result_js = require("./modules/getLabel.js");

    tool.Floaty_emit("展示文本", "状态", "状态：执行公招程序中");
    if (setting.侧边 == "公招" || Manual) {
        sleep(500)
        Manual = true;
    } else {

        if (!ITimg.picture("导航", {
                timing: 500,
                area: "左半屏",
                action: 5,
            }) && !ITimg.picture("导航2", {
                timing: 500,
                area: "左半屏",
                action: 5,
            })) {
            MyAutomator.click(height / 3 + random(-10, 10), 5 + random(5, 10));
            sleep(1000);
        }

        if (ITimg.picture("导航", {
                action: 0,
                timing: 1000,
                area: "左半屏",
            }) || ITimg.picture("导航2", {
                action: 0,
                timing: 1000,
                area: "左半屏",
            })) {
            if (ITimg.picture("导航_公开招募", {
                    action: 0,
                    timing: 1000,
                    area: "右半屏",
                }) || ITimg.picture("导航_公开招募", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                    threshold: 0.75,
                })) {
                tool.Floaty_emit("面板", "隐藏");
                while (true) {

                    ITimg.picture("基建_离开", {
                        action: 0,
                        area: "右半屏",
                        timing: 3000,
                    });
                    if (ITimg.picture("导航", {
                            timing: 1000,
                            nods: 500,
                            area: "左半屏",
                        }) || ITimg.picture("导航2", {
                            timing: 1000,
                            nods: 500,
                            area: "左半屏",
                        })) {
                        break;
                    }
                }

                if (setting.自动聘用) {
                    while (true) {
                        if (ITimg.picture("公招_聘用", {
                                action: 0,
                                timing: 2000,
                                nods: 500,
                            }) || ITimg.picture("公招_聘用", {
                                action: 0,
                                timing: 2000,
                                area: "左半屏",
                            }) || ITimg.picture("公招_聘用", {
                                action: 0,
                                timing: 2000,
                                area: "右半屏",
                            })) {
                            while (true) {
                                if (ITimg.picture("公招_skip", {
                                        action: 0,
                                        timing: 2000,
                                        area: "上半屏",
                                        nods: 200,
                                    }) || ITimg.picture("公招_skip", {
                                        action: 0,
                                        timing: 2000,
                                        area: "右半屏",
                                    }) || ITimg.picture("公招_skip", {
                                        action: 0,
                                        timing: 2000,
                                        area: "右上半屏",
                                    })) {
                                    let czname = ITimg.ocr("获取干员名", {
                                        action: 6,
                                        correction_path: "公招",
                                    });
                                    czname = result_js.get_t(czname);
                                    czname = (czname ? czname.level + "☆ " + czname.name : "无法获取干员名");
                                    Combat_report.record("自动聘用：" + czname, false, "warn")
                                }

                                if (ITimg.picture("导航", {
                                        timing: 500,
                                        area: "上半屏",
                                    }) || ITimg.picture("导航2", {
                                        timing: 500,
                                        area: "上半屏",
                                    })) {
                                    break;
                                } else {
                                    MyAutomator.click(500 + random(-10, 10), 500 + random(-10, 10));
                                    sleep(300);
                                }
                            }
                        } else {
                            break;
                        }
                    }
                } else {
                    log("自动聘用" + setting.自动聘用);
                }

                for (let i = 1; i <= 5; i++) {
                    if (选择位置(i)) {
                        break
                    } else if (i == 4) {
                        toast("无法确认已进入招募干员界面");
                        console.error("无法确认已进入招募干员界面");
                        tool.Floaty_emit("展示文本", "状态", "状态：无法确认进入tag选择界面");
                    }
                }


            }
        }
    }

    ///确认进入选择位后进行tag识别
    tool.Floaty_emit("展示文本", "状态", "状态：努力识别中");
    taglb = ITimg.ocr("获取屏幕文字", {
        action: 6,
        area: [0, Math.floor(width / 2.5), height, width - Math.floor(width / 2.5)],
        correction_path: "公招",
    });
    tool.Floaty_emit("面板", "展开");

    if (ITimg.ocr("蓝色开始行动", {
            action: 5,
            part: true,
            log_policy: true,
            refresh: false,
        })) {
        console.error("发现截取的图片中含有手动选定关卡气泡提示\n可能会挡住重要标签，请重启程序");
        toast("发现截取的图片中含有手动选定关卡气泡提示\n可能会挡住重要标签，请重启程序");
        tool.Floaty_emit("展示文本", "状态", "状态：图片内容异常");
        tool.Floaty_emit("暂停", "结束程序");
        return
    } else if (ITimg.ocr("超级用户", {
            action: 5,
            part: true,
            log_policy: true,
            refresh: false,
        })) {
        console.error("发现截取的图片中含有授权超级用户气泡提示\n可能会挡住重要标签，请前往相关授权应用关闭通知");
        toast("发现截取的图片中含有请求授权超级用户气泡提示\n可能会挡住重要标签，请前往相关授权应用关闭通知");
        tool.Floaty_emit("展示文本", "状态", "状态：图片内容异常");
        tool.Floaty_emit("暂停", "结束程序");
        return
    }

    function 选择位置(shu) {
        if (shu >= 5) {
            tool.Floaty_emit("面板", "展开");

            taglb = null;
            threadMain.interrupt();
            threadMain = threads.start(任务);
            return
        }
        tool.Floaty_emit("展示文本", "状态", "状态：选择公招位置");
        sleep(300)
        switch (shu) {
            case 1:
                MyAutomator.click(height / 3 + random(-10, 10), width / 3 + random(-10, 10));
                sleep(800);
                position = 1;
                return (ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    area: "右下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                    threshold: 0.7,
                }));
            case 2:
                MyAutomator.click(height / 1.4 + random(-10, 10), width / 3 + random(-10, 10))
                sleep(800)
                position = 2;
                return (ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    area: "右下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                    threshold: 0.7,
                }));
            case 3:
                MyAutomator.click(height / 3 + random(-10, 10), width / 1.4 + random(-10, 10));
                sleep(800)
                position = 3
                return (ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    area: "右下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                    threshold: 0.7,
                }));
            case 4:
                MyAutomator.click(height / 1.4 + random(-10, 10), width / 1.4 + random(-10, 10));
                sleep(800)
                position = 4;
                return (ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    area: "右下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                }) || ITimg.picture("公招_确认", {
                    action: 5,
                    timing: 1000,
                    nods: 500,
                    area: "下半屏",
                    threshold: 0.7,
                }));
        }

    }

    function 随机招募(jiance) {

        if (jiance) {
            taglb = ITimg.ocr("获取屏幕文字", {
                action: 6,
                area: [0, Math.floor(width / 2.5), height, width - Math.floor(width / 2.5)],
                correction_path: "公招",
            });
        }
        switch (检测tag()) {
            case "next":
                return "next"
            case true:

                return true
            default:

                if (ITimg.ocr("点击刷新标签", {
                        action: 0,
                        refresh: false,
                        timing: 1000,
                    }) || ITimg.ocr("刷新标签", {
                        action: 0,
                        part: true,
                        refresh: false,
                        timing: 1000,
                    })) {
                    while (true) {
                        if (ITimg.picture("基建_离开", {
                                action: 0,
                                timing: 500,
                                nods: 500,
                                threshold: 0.85,
                                area: 4,
                            }) || ITimg.picture("基建_离开", {
                                action: 0,
                                timing: 500,
                                nods: 1000,
                                threshold: 0.85,
                                area: 24,
                            }) || ITimg.picture("基建_离开", {
                                action: 0,
                                timing: 500,
                                area: 4,
                                threshold: 0.75,
                            })) {
                            toast("没有四星以上的词条组合，已为您刷新标签重新检测");
                            console.error("没有四星以上的词条组合，已为您刷新标签重新检测");
                            sleep(1000);
                            while (等待提交反馈至神经()) {};
                            break
                        }
                    }

                    return false
                } else {
                    if (setting.无tag招募) {
                        tool.Floaty_emit("展示文本", "状态", "状态：无4星以上，8小时无tag招募");
                        toastLog("无4星以上tag，执行8小时无tag招募。")
                        taglb = ITimg.picture("公招_九小时", {
                            action: 5,
                            timing: 500,
                            area: "左半屏",
                        })
                        if (taglb) {

                            MyAutomator.click(taglb.x + taglb.w / 2 + random(-10, 10), taglb.y + taglb.h / 2 + random(-10, 10))
                            sleep(random(500, 600));
                            MyAutomator.click(taglb.x + taglb.w / 2 + random(-10, 10), taglb.y + taglb.h / 2 - random(-10, 10));
                            if (ITimg.picture("公招_确认", {
                                    action: 0,
                                    timing: 1000,
                                    area: "右下半屏",
                                }) || ITimg.picture("公招_确认", {
                                    action: 0,
                                    timing: 1500,
                                    area: "下半屏",
                                }) || ITimg.picture("公招_确认", {
                                    action: 0,
                                    timing: 1500,
                                    area: "下半屏",
                                    threshold: 0.7,
                                })) {
                                while (等待提交反馈至神经()) {};
                                便笺(position, "无tag，8小时招募", 8, true);
                                return true;
                            };

                        };
                    }
                }
                return false
        }


    }

    function 检测tag() {
        tool.Floaty_emit("展示文本", "状态", "状态：校验tag组合");
        bon = [];
        for (var i = 0; i < taglb.length; i++) {
            if (taglb[i].text.indexOf('人脉资源') == -1 && taglb[i].text.indexOf('标签') == -1 && taglb[i].text.indexOf('需求') == -1) {
                if (!taglb[i].text) {
                    continue;
                }
                bon.push(taglb[i].text);
            }
        }
        //  toast("公招识别的tag：\n" + bon)
        Combat_report.record("公招识别的tag：\n" + bon, false, "warn");
        result = result_js.get_r(bon, (setting.tag识别 && setting.tag识别.保底tag))
        console.info("干员组合列表:", result)

        if (bon.findIndex(curr => curr.indexOf("资深") != -1) != -1) {
            recruit_tag.push({
                "星级": (bon.findIndex(curr => curr == "高级资深干员") != -1 ? "6" : "5") + "☆",
                "名称": bon[bon.findIndex(curr => curr.indexOf("资深") != -1)]
            });

            (ITimg.picture("返回", {
                action: 4,
                timing: 1000,
                nods: 500,
                area: 1,
            }) || ITimg.picture("返回", {
                action: 4,
                timing: 1000,
                area: 12,
            }));

            position += 1;
            toastLog(bon[bon.findIndex(curr => curr.indexOf("资深") != -1)] + " tag, 跳过该公招位");
            sleep(1500);
            return "next";
        }
        if (result.length != 0) {
            let tag_bon = [];
            for (let i = 0; i < result[0].add_tags.length; i++) {
                bon = taglb.find(ele => ele.text == result[0].add_tags[i]);
                if (bon) {
                    MyAutomator.click(bon.left, bon.top);
                    tag_bon.push(bon.text);
                    sleep(100);
                }
            }

            if (ITimg.picture("公招_九小时", {
                    action: 0,
                    timing: 1000,
                    area: [0, 0, parseInt(height / 2.4), width],
                }) || ITimg.picture("公招_九小时", {
                    action: 0,
                    timing: 1000,
                    threshold: 0.75,
                    area: "上半屏",
                }) || ITimg.picture("公招_九小时", {
                    action: 0,
                    timing: 1000,
                    resolution: true,
                })) {
                if (ITimg.picture("公招_确认", {
                        action: 0,
                        timing: 1000,
                        area: "右下半屏",
                    }) || ITimg.picture("公招_确认", {
                        action: 0,
                        timing: 1000,
                        area: "下半屏",
                    }) || ITimg.picture("公招_确认", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                        threshold: 0.7
                    })) {
                    while (等待提交反馈至神经()) {};
                    便笺(position, tag_bon, 9, true);

                }

            } else {
                console.error("无法查找公开招募九个小时按钮,请确认图库")
            }

            return true;
        }
        return false;
    }

    let bon = [];
    //手动进行公招tag识别
    if (Manual) {
        for (var i = 0; i < taglb.length; i++) {
            if (taglb[i].text.indexOf('人脉资源') == -1 && taglb[i].text.indexOf('标签') == -1 && taglb[i].text.indexOf('需求') == -1) {
                if (!taglb[i].text) {
                    continue;
                }
                bon.push(taglb[i].text);
            }
        }
        result = result_js.get_r(bon, (setting.tag识别 && setting.tag识别.保底tag))
        console.info("干员组合列表:", result)

        Combat_report.record("公招识别的tag：\n" + bon, false, "warn");
        let tag_result_ui = ui.inflate(
            <vertical id="parent">
                <horizontal margin="0" bg="#00000000">
                    <img src="file://res/icon.png" w="50" h="30" margin="0 5" />
                    <text text="公招结果" layout_gravity="left|center_vertical" textColor="#000000" />
                    <horizontal w="*" h="*" gravity="right|center_vertical" clickable="true" >
                        
                        <text id="tips" text="tips:记得拉满9个小时" typeface="sans" textColor="#ff7f27" textSize="12sp" gravity="right" marginRight="10" />
                        <linear marginLeft="5">
                            <img id="sett" marginRight="8" src="@drawable/ic_settings_applications_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true" />
                        </linear>
                    </horizontal>
                    
                </horizontal>
                <linear gravity="center" margin="0 -2">
                    <View bg="#f5f5f5" w="*" h="2" />
                </linear>
                <vertical id="tag_sett" padding="20 10" visibility="gone" >
                    <text margin="15"
                    text="声明:tag词条是由{{ITimg.default_list.ocr.ocr_type}}识别屏幕文字获得的,不一定准确,如果你遇到识别不准的情况可联系开发者进行修正"
                    textColor="red"
                    textSize="15sp"
                    layout_gravity="center"
                    w="*" />
                    <Switch id="pop_ups" text="tag变化时弹出tag计算" padding="6 6 6 6" textSize="16sp" />
                    <View bg="#666666" h="1" w="*" />
                    <Switch id="guarantees" text="仅查看保底tag词条组合" padding="6 6 6 6" textSize="16sp" />
                    
                    <View bg="#666666" h="1" w="*" />
                </vertical>
                
                <text id="bon" text=""
                margin="10"
                textSize="16sp"
                textColor="black"
                layout_gravity="center"
                w="*" />
                <text id="tag_result"
                margin="15"
                text="随便选吧，反正没有四星及以上"
                visibility="gone"
                textSize="15sp"
                layout_gravity="center"
                w="*" />
                
                <ScrollView h="auto" id="scrollView" visibility="gone">
                    
                    <vertical id="content" padding="3" h="auto">
                        
                        
                    </vertical>
                    
                </ScrollView >
            </vertical>);

        let tag_result = dialogs.build({
            // type: "foreground-or-overlay",
            customView: tag_result_ui,
            wrapInScrollView: false,
            positive: "确定",
            positiveColor: "#03a9f4"
        }).on("positive", () => {
            if (tag_result_ui.tag_sett.getVisibility() == 0) {
                tag_result_ui.tag_result.setVisibility(0);
                tag_result_ui.bon.setVisibility(0);
                tag_result_ui.scrollView.setVisibility(0);
                tag_result_ui.tag_sett.setVisibility(8);
            }
        });
        //初始默认配置
        if (setting.tag识别) {
            tag_result_ui.pop_ups.checked = setting.tag识别.自动检测 ? true : false;
            tag_result_ui.guarantees.checked = setting.tag识别.保底tag ? true : false;
            setting.tag识别.tag_list = bon;
        } else {
            setting.tag识别 = {};
            setting.tag识别.自动检测 = true;
            setting.tag识别.tag_list = bon;
        }
        tool.writeJSON("tag识别", setting.tag识别);
        tag_result_ui.bon.setText(bon.toString());
        if (result.length == 0) {

            tag_result_ui.tips.setVisibility(8)
            tag_result_ui.tag_result.setVisibility(0)
        } else {
            tag_result_ui.scrollView.setVisibility(0)

            for (let i = 0; i < result.length; i++) {

                switch (result[i].level) {
                    case 6:
                        result[i].level = "#ff7f27";
                        break
                    case 5:
                        result[i].level = "#ffc90e";
                        break
                    case 4:
                        result[i].level = "#0097a7";
                        break

                }
                result[i].add_tags = result[i].add_tags.join("，")
                let AddText = ui.inflate(
                    <horizontal w="*" h="auto" margin="20 0 0 0">
                        
                        <text id="name"
                        margin="0 0"
                        textSize="15sp"
                        layout_gravity="center"
                        w="{{250}}px" />
                        <text id="add_tags"
                        margin="0"
                        textSize="15sp"
                        layout_gravity="center"
                        w="*" />
                    </horizontal>,
                    tag_result_ui.content
                );
                ui.run(() => {
                    AddText.name.setText(result[i].name);
                    AddText.name.setTextColor(colors.parseColor(result[i].level))
                    AddText.add_tags.setText(result[i].add_tags)
                    tag_result_ui.content.addView(AddText);
                })
            }
        }
        tag_result_ui.sett.click(() => {
            if (tag_result_ui.tag_sett.getVisibility() == 8) {
                tag_result_ui.tag_result.setVisibility(8);
                tag_result_ui.bon.setVisibility(8);
                tag_result_ui.scrollView.setVisibility(8);
                tag_result_ui.tag_sett.setVisibility(0);
                tag_result.setActionButton("positive", "返回");
            } else {
                tag_result_ui.tag_result.setVisibility(0);
                tag_result_ui.bon.setVisibility(0);
                tag_result_ui.scrollView.setVisibility(0);
                tag_result_ui.tag_sett.setVisibility(8);
            }

        })
        tag_result_ui.pop_ups.on("check", (checked) => {
            if (!setting.tag识别) {
                setting.tag识别 = {};
            }
            setting.tag识别.自动检测 = checked;
            tool.writeJSON("tag识别", setting.tag识别)
        });
        tag_result_ui.guarantees.on("check", (checked) => {
            if (!setting.tag识别) {
                setting.tag识别 = {};
            }
            setting.tag识别.保底tag = checked;
            tool.writeJSON("tag识别", setting.tag识别)
        });
        tag_result.show();
        tool.Floaty_emit("展示文本", "状态", "状态：识别完成，等待中");
        tool.writeJSON("侧边", "123");

        while (true) {
            sleep(500);
            if (tag_result && tag_result.isShowing()) {
                continue;
            }
            setting = tool.readJSON("configure");
            sleep(500);
            //点击悬浮窗公招图标重新检测
            if (setting.侧边 == "公招") {
                公招(true);
                break
            }
            //与上一次识别tag不符时自动检测
            if (setting.tag识别 && setting.tag识别.自动检测) {
                taglb = ITimg.ocr("获取屏幕文字", {
                    action: 6,
                    area: [0, Math.floor(width / 2.5), height, width - Math.floor(width / 2.5)],
                    correction_path: "公招",
                });

                if (!ITimg.ocr("职业需求", {
                        action: 6,
                        refresh: false,
                        log_policy: true,
                        correction_path: "公招",
                    })) {
                    continue;
                }
                bon = [];
                for (var i = 0; i < taglb.length; i++) {
                    if (taglb[i].text.indexOf('人脉资源') == -1 && taglb[i].text.indexOf('标签') == -1 && taglb[i].text.indexOf('需求') == -1) {
                        if (!taglb[i].text) {
                            continue;
                        }
                        bon.push(taglb[i].text);
                    }
                }

                //获取到的tag词条大于4检验tag词条是否与上一次tag重合
                if (bon.length > 4) {
                    function checkArr(arr1, arr2) {
                        var rs = 0;
                        for (var i = 0; i < arr1.length; i++) {
                            for (var j = 0; j < arr2.length; j++) {
                                if (arr1[i].indexOf(arr2[j]) != -1) {
                                    rs++;
                                }
                            }
                        }
                        return rs;
                    }

                    if (checkArr(bon, setting.tag识别.tag_list) >= 4) {
                        continue;
                    }

                    sleep(200)
                    公招(true);
                    break
                }
            } else {
                log("tag变化时弹出tag计算 / 自动检测tag:" + (setting.tag识别 && setting.tag识别.自动检测))
            }
        }
    }

    随机招募();
    /**
    if (!检测tag()) {
 
        if (ITimg.ocr("点击刷新标签", {
            action: 0,
            part: true,
            refresh: false,
            timing: 1000,
        }) || ITimg.ocr("刷新标签", {
            action: 0,
            part: true,
            refresh: false,
            timing: 1000,
        })) {
            while (true) {
                if (ITimg.picture("基建_离开", {
                    action: 0,
                    timing: 500,
                    nods: 500,
                    threshold: 0.85,
                    area: 4,
                }) || ITimg.picture("基建_离开", {
                    action: 0,
                    timing: 500,
                    nods: 1000,
                    threshold: 0.85,
                    area: 24,
                }) || ITimg.picture("基建_离开", {
                    action: 0,
                    timing: 500,
                    area: 4,
                    threshold: 0.75,
                })) {
                    toast("没有四星以上的词条组合，已为您刷新标签重新检测");
                    console.error("没有四星以上的词条组合，已为您刷新标签重新检测");
                    sleep(1000);
                    while (等待提交反馈至神经()) { };
                    break
                }
            }
            公招(false);
 
           return
        } else {
            if (setting.无tag招募) {
                toastLog("无4星以上tag，执行8小时无tag招募。")
 
                随机招募();
                tool.Floaty_emit("面板", "隐藏");
                for (let k = 1; k <= 4; k++) {
                    if (选择位置(position = position + 1)) {
                        随机招募(true);
                    }
                }
                log("当前网络似乎略有卡顿")
                sleep(2000)
                选择位置(5);
 
            } else {
                log("8小时无tag招募：" + setting.无tag招募)
                选择位置(5);
                return
            }
        }
 
 
    } else {
        */

    for (let i = position; i <= 4; i++) {
        if (选择位置(i)) {
            if (!随机招募(true)) {
                i--;
            };
        } else if (i == 4) {
            toast("无法确认已进入招募干员界面");
            console.error("无法确认已进入招募干员界面");
            tool.Floaty_emit("展示文本", "状态", "状态：无法确认进入tag选择界面");
            break
        }
    }
    选择位置(5);
    // }





}



function 任务() {
    sleep(50)
    threadMain.setName("任务领奖");
    tool.Floaty_emit("面板", "展开");
    if (setting.任务奖励) {
        tool.Floaty_emit("展示文本", "状态", "状态：领取任务奖励");
        //toastLog("2秒后启动任务领取奖励程序");
        sleep(2000);

        if (!ITimg.picture("导航", {
                action: 0,
                area: "上半屏",
                timing: 2000,
            })) {
            ITimg.picture("导航2", {
                action: 0,
                area: "上半屏",
                timing: 2000,
            });
        };
        if (ITimg.picture("导航_任务", {
                action: 0,
                area: "上半屏",
                timing: 2000,
            })) {
            ITimg.picture("基建_离开", {
                action: 0,
                area: "下半屏",
                timing: 8000,
                nods: 3000,
            });
        } else {
            toastLog("没有找到导航_任务");
            tool.Floaty_emit("展示文本", "状态", "状态：主程序暂停中");
            tool.Floaty_emit("暂停", "结束程序");
            return;
        }
        temporary_xy = false;
        for (let i = 1; i <= 2; i++) {
            //获取周常任务位置点击日常任务
            if (!temporary_xy) {
                temporary_xy = (ITimg.picture("周常任务", {
                    area: 2,
                    action: 5,
                    nods: 2000,
                }) || ITimg.picture("周常任务", {
                    area: 12,
                    action: 5,
                    nods: 1000,
                }) || ITimg.picture("周常任务", {
                    area: 12,
                    action: 5,
                }))
            }
            if (temporary_xy) {
                console.verbose("周常任务位置数据:\n" + JSON.stringify(temporary_xy));
                if (i == 1) {
                    MyAutomator.click(temporary_xy.x - 150, temporary_xy.y);
                    sleep(100);
                    MyAutomator.click(temporary_xy.x - 200, temporary_xy.y);
                    sleep(600);
                } else {
                    MyAutomator.click(temporary_xy.x + temporary_xy.w / 2, temporary_xy.y + temporary_xy.h / 2);
                }
            }

            if (ITimg.picture("收集全部", {
                    action: 0,
                    area: 2,
                    timing: 3000,
                    nods: 1000,
                }) || ITimg.picture("收集全部", {
                    action: 0,
                    area: 2,
                    timing: 3000,
                })) {
                (ITimg.picture("获得物资", {
                    action: 0,
                    area: "上半屏",
                    timing: 2000,
                    nods: 1500,
                }) && !ITimg.picture("获得物资", {
                    action: 0,
                    area: "上半屏",
                    timing: 1000,
                }));
            }
            sleep(1000)

            if (ITimg.picture("收集全部", {
                    action: 0,
                    area: "上半屏",
                    timing: 3000,
                })) {
                ITimg.picture("获得物资", {
                    action: 0,
                    area: "上半屏",
                    timing: 2000,
                });
            } else {
                toastLog("没有待领取" + (i == 1 ? '日常' : '周常') + "奖励了");
            };


        }
        if (!ITimg.picture("返回", {
                action: 4,
                area: "上半屏",
                timing: 1500,
                nods: 1000,
            })) {
            if (ITimg.picture("获得物资", {
                    action: 0,
                    area: "上半屏",
                    timing: 1000,
                })) {

                if (!ITimg.picture("返回", {
                        action: 4,
                        area: "上半屏",
                        timing: 1500,
                        nods: 1000,
                    })) {
                    toastLog("找不到返回键");
                }
            }
        }

    } else {
        if (!ITimg.picture("返回", {
                action: 4,
                area: "上半屏",
                timing: 1500,
            })) {
            toastLog("找不到返回键");
        } else {
            ITimg.picture("基建_离开", {
                action: 0,
                area: 4,
                timing: 6000,
            });
        }
        toastLog("任务奖励:" + setting.任务奖励)
    }

    if (recruit_tag[0] && recruit_tag[0].星级) {
        let tag_json = '';
        for (let tag_ of recruit_tag) {
            tag_json += tag_.名称 + " 标签，" + tag_.星级 + ", "
        }
        sleep(1000);
        dialogs.build({
            title: recruit_tag[0].名称,
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


}; //线程