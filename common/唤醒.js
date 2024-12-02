/**
 * 负责启动游戏进入(回到)主页
 */
let 唤醒 = {
    main: function() {
        tool.Floaty_emit("展示文本", "状态", "状态：唤醒程序运行中...");

        sleep(1000);
        while (等待提交反馈至神经()) {
            sleep(1000)
        }
        while (true) {
            if (this.确认返回主页()) {
                if (this.取消公告()) {
                    return true;
                }else if(this.确认返回主页()){
                    return true
                }
            }

            启动应用(true);
            try {
                press(height / 2, width - zoy(100), 100);
            } catch (e) {

                console.error(e)
            }
            sleep(100);
            this.开始唤醒();
            sleep(500);
            if (this.取消公告()) {

                return true;
            }
        }
    },
    检查更新: function(test) {
        console.info("---检查更新---");
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
                refresh: false,
            })) {
            sleep(500);
            click(height / 2, width - zoy(60));
            click(height / 2, zoy(50));
            tool.Floaty_emit("展示文本", "状态", "状态：客户端已过时");
            tool.Floaty_emit("展示文本", "状态", "状态：从TapTap更新明日方舟");
            //查找点击Tap更新应用按钮
            /* auto.setWindowFilter(function(window) {
                 // 对于应用窗口，他的title属性就是应用的名称，因此可以通过title属性来判断一个应用
                 return window.title == "TapTap";
             });*/

            let update_app;
            while (true) {
                //   tool.Floaty_emit("展示文本", "状态", "状态：确认可在TapTap更新");

                if (!textContains(displayText["更新"]).findOne(2000)) {
                    console.verbose("等待更新按钮出现")
                    sleep(1500);
                    continue;
                }
                sleep(500);

                update_app = id("com.taptap.app.middle:id/btn_container").findOne(2000);
                if (update_app) {
                    if (!update_app.clickable() || !update_app.click()) {
                        update_app = update_app.bounds();
                        MyAutomator.click(update_app.centerX(), update_app.centerY());
                        sleep(500);
                    }
                }
                sleep(500);
                update_app = (textMatches(displayText["更新"] + '.*?(MB|G)').findOne(2000) || textStartsWith(displayText["更新"]).findOne(2000));
                if (update_app) {
                    if (!update_app.clickable() || !update_app.click()) {
                        update_app = update_app.bounds();
                        MyAutomator.click(update_app.centerX(), update_app.centerY());
                        break;
                    }

                }
            }
            console.info("更新App按钮参数：\n" + update_app);

            if (setting.update && setting.update.usingTraffic) {
                tool.Floaty_emit("展示文本", "状态", "状态：检索使用流量更新");

                sleep(1500);
                let usingTraffic = textStartsWith(displayText["立即下载"]).findOne(3500);
                if (!usingTraffic) {
                    usingTraffic = id("com.taptap.app.middle:id/dialog_btn_top").findOne(5000);
                }
                if (usingTraffic) {
                    if (!usingTraffic.clickable() || !usingTraffic.click()) {
                        usingTraffic = usingTraffic.bounds();
                        MyAutomator.click(usingTraffic.centerX(), usingTraffic.centerY())
                    }
                }
                console.info("使用流量下载按钮参数：\n" + usingTraffic);
            }
            tool.Floaty_emit("展示文本", "状态", "状态：等待下载完成");
            while (true) {
                if (desc(displayText["安装"]).findOne(2000)) {

                    break
                }
                sleep(500);
            }

            log("安装");
            tool.Floaty_emit("展示文本", "状态", "状态：进行安装");

            let install_app = desc(displayText["安装"]).findOne(3000);
            if (install_app && (!install_app.clickable() || !install_app.click())) {
                install_app = install_app.bounds();
                log(install_app)
                MyAutomator.click(install_app.centerX(), install_app.centerY());
            }

            console.info("安装应用按钮参数：\n" + install_app);
            //使用系统应用管理组件安装
            sleep(1500);
            let assembly = id("android:id/text1").className("android.widget.TextView").findOne(5000);
            if (assembly && (!assembly.clickable() || !assembly.click())) {
                assembly = assembly.bounds();
                MyAutomator.click(assembly.centerX(), assembly.centerY());
            }

            sleep(3000);
            while (true) {
                if (textMatches(displayText["确认安装合集"]).findOne(2000)) {

                    break;
                }
                sleep(500);
            }
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
                install_app = (textMatches(displayText["安装完成合集"]).classNameMatches("(android.widget.Button|android.widget.TextView|android.view.View)").findOne(500) || descMatches(displayText["安装完成合集"]).classNameMatches("android.widget.Button|android.widget.TextView|android.view.View)").findOne(500));
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
            ITimg.matchFeatures("基建_离开", {
                timing: 5000,
                action: 0,
                area: 24,
            });
            return
        }



    },
    确认返回主页: function() {
        console.info("---确认返回主页---");
        tool.Floaty_emit("展示文本", "状态", "状态：确认主界面并重连");
        if (this.确认主页(500)) {
            //防止此次需要重连
            if (this.确认主页(1000, 1)) {
                //确认进入终端后点击返回
                if (导航定位(0, true) && !点击返回(1, true)) {
                    return false;
                }
            } else {
                return false;
            }
            if (setting.调试) {
                let pngPtah = package_path + "/captureScreen/唤醒主页.png";
                files.ensureDir(pngPtah);
                images.save(ITimg.captureScreen_(), pngPtah);
                console.verbose("已进入主页,无需重复.");
            }
            return true;
        } else {
            this.topic_tips();
        }
        //确认有导航键时返回到主页
        if (导航定位(0, true)) {
            tool.Floaty_emit("面板", "隐藏");
            sleep(1000);

            if (导航定位(0)) {
                tool.Floaty_emit("面板", "展开");
                ITimg.matchFeatures("基建_离开", {
                    timing: 5000,
                    action: 0,
                    nods: 1000,
                    area: 4,
                });

            } else {
                点击返回(1, true);
            }
            if (this.确认主页(1000) && this.确认主页(1)) {

                while (等待提交反馈至神经()) {
                    sleep(500)
                }
                return true;
            }

        }


        return false;

    },
    开始唤醒: function() {
        console.info("---开始唤醒---");
        tool.Floaty_emit("展示文本", "状态", "状态：等待开始游戏");
        //开始唤醒
        //   while (true) {
        sleep(1000);
        if (!ITimg.matchFeatures("开始唤醒", {
                action: 0,
                area: 34,
            })) {
            this.检查更新();
            //防止特殊情况下，检查更新未识别到客户端已过时，下面的点击命令又执行了，跳转到商店要更新的情况
            /* if (textContains(displayText["更新"]).findOne(500)) {
                 this.检查更新();
                 // continue;
                 return false;
             }*/
            MyAutomator.click(height / 2, width - 100);
            sleep(1000);
            getpackage = tool.currentPackage();
            log("前台包名：" + getpackage);
            if (getpackage == "com.taptap") {
                this.检查更新(true);
                return false;
                //  break;
            }

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
                //    break;
            }

        } else {
            sleep(2000);
            if (!ITimg.matchFeatures("开始唤醒", {
                    timing: 8000,
                    action: 0,
                    area: "下半屏",
                })) {
                //   break
                return true;
            }
        }


    },
    取消公告: function() {
        this.frequency = 0;

        tool.Floaty_emit("展示文本", "状态", "状态：取消公告签到通知");
        console.info("---取消公告---");
        /*  let _sceneFeatures = $images.detectAndComputeFeatures(ITimg.captureScreen_(), {
              region: ITimg.regional_division(2),
          });
          */
        let _close = ITimg.matchFeatures("关闭公告", {
            action: 5,
            area: 2,
            matcher:1,
            rectangular_error: 25,
            picture_failed_further: true,
            // imageFeatures: _sceneFeatures,
        }) || ITimg.matchFeatures("关闭公告", {
            action: 5,
            area: 2,
            matcher: 2,
            threshold:0.70,
            //上一次匹配同名小图时使用缓存图常规匹配，又没有picture_failed_further重新计算特征大图，此时再进行特征匹配并refresh设置为false使用上次缓存特征大图，会导致匹配可视化结果图区域不对
            refresh: false,
            rectangular_error: 35,
            // imageFeatures: _sceneFeatures,
        });
        //  _sceneFeatures.recycle();
        if (_close) {
            while (true) {
                //长时间持有图片.需手动释放
                let rewardimg = images.copy(ITimg.captureScreen_(), true);
                if (setting.claim_rewards) {
                    if (!this.frequency || ITimg.matchFeatures("关闭公告", {
                            action: 5,
                            picture: images.copy(rewardimg),
                            area: 2,
                        })) {
                        if (typeof 领取奖励 == "undefined") {
                            领取奖励 = require(files.exists("./common/领取奖励.js") ? files.path("./common/领取奖励.js") : files.path("../common/领取奖励.js"));
                        }

                        if (!领取奖励.活动处理(rewardimg)) {
                            MyAutomator.click(_close.left + _close.w / 2, _close.bottom);
                            sleep(1000);
                        }
                    }
                }
                ITimg.matchFeatures("获得物资", {
                    timing: 1000,
                    picture: images.copy(rewardimg),
                    action: 1,
                    area: 12,
                    picture_failed_further: true,
                })
                if (!this.frequency || ITimg.matchFeatures("关闭公告", {
                        timing: 1500,
                        action: 0,
                        picture: images.copy(rewardimg),
                        area: 2,
                    })) {
                    //
                    rewardimg.recycle();
                    //双重保险
                    if (this.确认主页()) {
                        while (等待提交反馈至神经()) {
                            sleep(1000);
                        }
                        if (this.确认主页()) {
                            return true;
                        }
                    } else {
                        if (this.topic_tips()) {
                            break
                        }
                    }
                    
                } else {
                    (ITimg.ocr("立即领取", {
                        action: 0,
                        similar: 0.7,
                        picture: images.copy(rewardimg),
                    }) || ITimg.ocr("领取", {
                        action: 0,
                        similar: 0.9,
                        refresh: false,
                        log_policy: false,
                    }));
                    rewardimg.recycle();
                    //点击边缘位置来取消取消按钮不一样的公告
                    MyAutomator.click(height / 2, width - zoy(60));

                    if (this.确认主页()) {
                        if (this.frequency >= 3) {
                            return true;
                        }
                        this.frequency++;
                    }
                    sleep(500);

                }

                !rewardimg.isRecycled() && rewardimg.recycle()

            }
            return false;
        } else if (ITimg.matchFeatures("获得物资", {
                timing: 1000,
                action: 1,
                area: 12,
            })) {
            this.取消公告();
        }
        return false;

    },
    确认主页: function(_timing, _action) {
        _timing = _timing || 1000;
        if (_action != undefined) {
            _action = _action;
        }
        // console.trace(_action)
        // let _max = 2;

        if (ITimg.ocr("终端", {
                timing: _timing,
                area: 2,
                threshold: 0.7,
                action: _action,
                picture_failed_further: true,
                saveSmallImg: "主页_终端",
            }) || ITimg.ocr("当前", {
                timing: _timing,
                area: 2,
                //  threshold: 0.7,
                action: _action,
                refresh: false,
                saveSmallImg: "主页_当前",
                picture_failed_further: true,
            }) || ITimg.ocr("理智/", {
                timing: _timing,
                area: 2,
                action: _action,
                refresh: false,
                part: true,
                saveSmallImg: "主页_理智数",
                picture_failed_further: true,
            })) {

            return true
        }


        return false;
    },
    topic_tips: function() {
        if (this.abnormal_themes != 0) {
            this.abnormal_themes = 3;
        }
        if (ITimg.ocr("采购中心", {
                area: 4,
                action: 5,
                saveSmallImg: "主页_采购中心",
            }) && ITimg.ocr("公开招募", {
                action: 5,
                refresh: false,
                saveSmallImg: "主页_公开招募",
            }) || ITimg.ocr("好友", {
                area: 3,
                action: 5,
                saveSmallImg: "主页_好友",
            }) && ITimg.ocr("档案", {
                action: 5,
                refresh: false,
                saveSmallImg: "主页_档案",
            })) {
            this.abnormal_themes--;
            if (!this.abnormal_themes) {

                dialogs.build({
                    title: "警告",
                    titleColor: "#FF4500",
                    content: "明日计划所选图库似乎不支持识别当前明日方舟-界面主题。请更换回日间尝试",
                    positive: "确定",
                    canceledOnTouchOutside: false,
                }).on("positive", () => {
                    tool.Floaty_emit("暂停", "结束程序");
                }).show();

                sleep(1000 * 60 * 5);
                跳转_暂停(true, "不支持识别主题", "暂停，不支持识别主题");

            }
        } else {
            return true;
        }
    }
}

module.exports = 唤醒;