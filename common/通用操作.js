let currency = {
    点击返回: function(_number, force) {
        if (_number === undefined) {
            _number = 1;
        }
        let _confirm;
        let _max = 3;
        while (_number) {
            if (force) {
                let returnxy = [height / 20, width / 20];
                _confirm = MyAutomator.click.apply(MyAutomator, returnxy);

            }
            if (!_confirm) {
                _confirm = ITimg.matchFeatures("返回", {
                    action: 0,
                    area: 1,
                }) || ITimg.matchFeatures("返回", {
                    action: 0,
                    area: 1,
                    refresh: false,
                    picture_failed_further: true,
                });
            }

            if (_confirm) {
                sleep(1200);
                _number--;
            }else{
                _max--;
                if(!_max){
                    break;
                }
            }
        }
        return _confirm||_max;
    },
    /**
     * @param {string|number} menu - 导航到的菜单，详情查看this.menu
     * @param {Boolean} confirm_navigation - 仅需确认导航键存在
     */
    导航定位: function(menu, confirm_navigation) {
        /**
         * 导航菜单名和屏幕识别区域
         * 数字区域由ITimg.regional_division()解构
         */
        this.menu = [
            ["首页", 1],
            ["编队", 1],
            ["干员", 1],
            ["档案", 1],
            ["终端", 1],
            ["基建", [height / 3, 0, height / 3, width / 2]],
            ["公开招募", 2],
            ["干员寻访", 2],
            ["任务", 2],
            ["好友", 2],
            ["采购中心", 2]
        ]

        let _max = 3;
        while (_max) {

            this.navigation = ITimg.matchFeatures("导航", {
                action: 5,
                nods: 1000,
                scale: 1,
                area: 1,
            }) || ITimg.matchFeatures("导航", {
                action: 5,
                area: 1,
                refresh: false,
                picture_failed_further: true,
            }) || ITimg.matchFeatures("导航2", {
                action: 5,
                nods: 1000,
                area: 1,
                scale: 1,
                refresh: false,
            }) || ITimg.matchFeatures("导航2", {
                action: 5,
                area: 1,
                refresh: false,
                picture_failed_further: true,
            })
            if (this.navigation && !confirm_navigation) {
                this.navigation = [this.navigation.left + this.navigation.w / 2, this.navigation.top + this.navigation.h / 2];
                MyAutomator.click.apply(MyAutomator, this.navigation);
                sleep(800);
                let deviation;
                if (menu == "好友" || menu == 9) {
                    deviation = true;
                    menu = 8;
                }
                if (typeof menu == "number") {
                    menu = this.menu[menu];
                } else {
                    menu = this.menu.find(item => item[0] === menu);
                }
                //转到识别任务，再偏移坐标点击好友


                _confirm_go = ITimg.matchFeatures("导航_" + menu[0], {
                    action: 5,
                    nods: 500,
                    area: ITimg.regional_division(menu[1]),
                    scale: 1,
                }) || ITimg.matchFeatures("导航_" + menu[0], {
                    action: 0,
                    area: ITimg.regional_division(menu[1]),
                    matcher: 2,
                    scale: 1,
                    refresh: false,
                    picture_failed_further: true,
                })
                if (_confirm_go) {
                    if (deviation) {
                        _confirm_go = [_confirm_go.right + _confirm_go.w / 2, _confirm_go.top + _confirm_go.h / 2];
                    } else {
                        _confirm_go = [_confirm_go.left + _confirm_go.w / 2, _confirm_go.top + _confirm_go.h / 2];
                    }
                    MyAutomator.click.apply(MyAutomator, _confirm_go);

                    sleep(500);
                    break;
                } else if (!_confirm_go && this.navigation) {
                    MyAutomator.click.apply(MyAutomator, this.navigation);
                    sleep(800);

                }
                //如果是确认导航键存在
            } else if (this.navigation) {
                break
            }
            _max--;
        }
        return _max;
    },
    等待提交反馈至神经: function() {
        console.verbose('---等待提交反馈至神经---');
        sleep(200);
        let staging_result = ITimg.ocr("正在提交反馈至神经", {
            action: 6,
            area: 34,
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
    },
    启动应用: function(package_) {

        if (package_ == undefined) {
            if (ITimg.language == "日服" || ITimg.language == "美服") {
                console.error("暂不支持启动 " + ITimg.language + " 方舟应用")
                return [false, ITimg.language]
            }
        } //api
        setting = tool.readJSON("configure");


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

    },
    /**
     * 完成所有任务后执行的任务
     */
    end_task: function(status, literals) {
        setting = tool.readJSON("configure");

        if (!关闭应用(setting.执行, status)) {
            tool.Floaty_emit("展示文本", "状态", "状态：" + literals);
        }

        if (setting.震动) {
            device.vibrate(1000);
        }
        let auto_action = require("../modules/auto_action.js");
        if (setting.end_action.home) {
            auto_action.home();
        }
        if (setting.end_action.lock_screen) {
            auto_action.lock_screen();
        }
        tool.Floaty_emit("暂停", "结束程序");
        sleep(5000);
    },
    便笺: function(sleep_, tag, hour, type) {
        if (sleep_ === undefined) {
            sleep_ = 1000;
        }
        let morikujima_setting = tool.readJSON("morikujima_setting");
        // console.info(morikujima_setting)
        if (morikujima_setting === undefined) {
            return false
        }
        if (type) {

            if (morikujima_setting.公招 == true) {

                for (let i in morikujima_setting.gz_list) {
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
            return true
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
            for (let i in taglb) {
                if (taglb[i].text.indexOf("/") != -1) {
                    console.info("剩余理智数：" + taglb[i].text)

                    tool.writeJSON("已有理智", taglb[i].text.split("/")[0], "morikujima_setting")
                    tool.writeJSON("理智数", taglb[i].text, "morikujima_setting")
                    tool.writeJSON("理智时间", new Date(), "morikujima_setting")
                }
            }
            tool.Floaty_emit("展示文本", "状态", "状态：理智识别完成");

        }
        return true;
    },
}

module.exports = currency;