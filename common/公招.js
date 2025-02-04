var position = 0;

function 确认招募按钮(_action) {
    if (_action === undefined) {
        _action = 5;
    }
    let identify = ITimg.matchFeatures("公招_确认", {
        action: _action,
        timing: 1000,
        area: 4,
        scale: 1,
    });
   if (!identify) {
       identify = ITimg.matchFeatures("公招_确认", {
            action: _action,
            timing: 1000,
            area: 4,
            threshold: 0.7,
            scale: 1,
            matcher: 2,
            refresh: false,
            log_policy:true,
        })
    }
    if (!identify) {
       identify = ITimg.matchFeatures("公招_确认", {
            action: _action,
            timing: 1000,
            area: 34,
            threshold: 0.7,
            scale: 0.90,
            matcher: 2,
            refresh: true,
            log_policy:false,
            picture_failed_further: true,
        })
    }
    return identify;
}

function 随机招募(_Refresh) {

    if (_Refresh) {
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
                    if (ITimg.matchFeatures("基建_离开", {
                        action: 0,
                        timing: 500,
                        nods: 500,
                        threshold: 0.85,
                        area: 4,
                    }) || ITimg.matchFeatures("基建_离开", {
                        action: 0,
                        timing: 500,
                        nods: 1000,
                        threshold: 0.85,
                        area: 4,
                        refresh: false,
                    }) || ITimg.matchFeatures("基建_离开", {
                        action: 0,
                        timing: 500,
                        area: 24,
                        threshold: 0.75,

                    })) {
                        toast("没有四星以上的词条组合，已为您刷新标签重新检测");
                        console.error("没有四星以上的词条组合，已为您刷新标签重新检测");
                        sleep(1000);
                        while (等待提交反馈至神经()) {
                            sleep(500);
                        }
                        break
                    }
                }

                return false
            } else {
                if (setting.无tag招募) {
                    tool.Floaty_emit("展示文本", "状态", "状态：无4星以上，8小时无tag招募");
                    toastLog("无4星以上tag，执行8小时无tag招募。")
                    if (公招.确认招募(true)) {
                        便笺(position, "无tag，8小时招募", 8, true);

                    }
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
    result = 公招.result_js.get_r(bon, (setting.tag识别 && setting.tag识别.保底tag))
    console.info("干员组合列表:", result)

    if (bon.findIndex(curr => curr.indexOf("资深") != -1) != -1) {
        公招.recruit_tag.push({
            "星级": (bon.findIndex(curr => curr == "高级资深干员") != -1 ? "6" : "5") + "☆",
            "名称": bon[bon.findIndex(curr => curr.indexOf("资深") != -1)]
        });

        点击返回(1, true);

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

        if (公招.确认招募()) {
            便笺(position, tag_bon, 9, true);
        }

        return true;
    }
    return false;
}

var 公招 = {
    recruit_tag: [],
    main: function (Manual) {
        Manual = Manual || false;
        let position = 0;
        tool.Floaty_emit("面板", "复位");

        try {
            threadMain.setName("公招程序");
        } catch (err) { }


        if (ITimg.language != "简中服") {
            toastLog("非常抱歉，公招识别目前仅简中服可使用");
            tool.Floaty_emit("面板", "展开");
            return false;
        }

        setting = tool.readJSON("configure");
        if (!ITimg.initocr()) {
            tool.Floaty_emit("面板", "展开");
            return false;
        }
        if (!this.result_js) {
            this.result_js = require(files.exists("./modules/getLabel.js") ? files.path("./modules/getLabel.js") : files.path("../modules/getLabel.js"));
        }
        tool.Floaty_emit("展示文本", "状态", "状态：执行公招程序中");
        if (setting.侧边 == "公招" || Manual) {
            sleep(500)
            Manual = true;
        } else {

            if (!导航定位(6, true)) {
                MyAutomator.click(height / 3 + random(-10, 10), 5 + random(5, 10));
                sleep(1000);
            }

            if (导航定位(6)) {
                tool.Floaty_emit("面板", "隐藏");
                while (true) {

                    ITimg.matchFeatures("基建_离开", {
                        action: 0,
                        area: "右半屏",
                        timing: 3000,
                    });
                    if (导航定位(6, true)) {
                        while (等待提交反馈至神经()) {
                            sleep(500);
                        }
                        break;
                    }
                }

                if (setting.自动聘用) {
                    while (true) {
                        if (ITimg.matchFeatures("公招_聘用", {
                            action: 0,
                            timing: 2000,
                            nods: 500,
                        }) || ITimg.matchFeatures("公招_聘用", {
                            action: 0,
                            timing: 2000,
                            area: 13,
                            matcher: 2,
                            refresh: false,
                        })) {
                            while (true) {
                                if (ITimg.matchFeatures("公招_skip", {
                                    action: 0,
                                    timing: 2000,
                                    area: 2,
                                    nods: 1000,
                                }) || ITimg.matchFeatures("公招_skip", {
                                    action: 0,
                                    timing: 2000,
                                    matcher: 2,
                                    refresh: false,
                                })) {
                                    let czname = ITimg.ocr("获取干员名", {
                                        action: 6,
                                        correction_path: "公招",
                                    });
                                    czname = this.result_js.get_t(czname);
                                    czname = (czname ? czname.level + "☆ " + czname.name : "无法获取干员名");
                                    Combat_report.record("自动聘用：" + czname, false, "warn")
                                }
                                MyAutomator.click(height / 2, width / 2);
                                sleep(500);

                                if (导航定位(6, true)) {
                                    sleep(500);
                                    break;
                                } else {
                                    MyAutomator.click(height / 2, width / 2);
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
                    if (公招.选择位置(i)) {
                        break
                    } else if (i == 4) {
                        toast("无法确认已进入招募干员界面");
                        console.error("无法确认已进入招募干员界面");
                        tool.Floaty_emit("展示文本", "状态", "状态：无法确认进入tag选择界面");
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
            threshold: 0.85,
        })) {
            console.error("发现截取的图片中含有手动选定关卡气泡提示\n可能会挡住重要标签，请重启程序");
            toast("发现截取的图片中含有手动选定关卡气泡提示\n可能会挡住重要标签，请重启程序");
            tool.Floaty_emit("展示文本", "状态", "状态：图片内容异常");
            tool.Floaty_emit("暂停", "结束程序");
            return false;
        } else if (ITimg.ocr("超级用户", {
            action: 5,
            part: true,
            log_policy: true,
            refresh: false,
            threshold: 0.85,
        })) {
            console.error("发现截取的图片中含有授权超级用户气泡提示\n可能会挡住重要标签，请前往相关授权应用关闭通知");
            toast("发现截取的图片中含有请求授权超级用户气泡提示\n可能会挡住重要标签，请前往相关授权应用关闭通知");
            tool.Floaty_emit("展示文本", "状态", "状态：图片内容异常");
            tool.Floaty_emit("暂停", "结束程序");
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
            result = this.result_js.get_r(bon, (setting.tag识别 && setting.tag识别.保底tag))
            console.info("干员组合列表:", result)

            Combat_report.record("公招识别的tag：\n" + bon, false, "warn");

            tool.Floaty_emit("展示文本", "状态", "状态：识别完成，等待中");
            if (ITimg.setting) {
                ITimg.setting.侧边 = "123";
            }
            tool.writeJSON("侧边", "123");
            this.tag_result_view(bon);
            while (true) {
                sleep(500);
                if (this.tag_result_d && this.tag_result_d.isShowing()) {
                    continue;
                }
                setting = tool.readJSON("configure");
                sleep(500);
                //点击悬浮窗公招图标重新检测
                if (setting.侧边 == "公招") {
                    this.main(true);
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
                        action: 5,
                        refresh: false,
                        log_policy: "简短",
                        correction_path: "公招",
                        gather: taglb,
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
                        this.main(true);
                        return true
                    }
                } else {
                    log("tag变化时弹出tag计算 / 自动检测tag:" + (setting.tag识别 && setting.tag识别.自动检测))
                }
            }
        }

        随机招募();

        for (let i = position; i <= 4; i++) {
            if (this.选择位置(i)) {
                if (!确认招募按钮()) {
                    continue;
                }
                if (!随机招募(true)) {
                    i--;
                }
            } else if (i == 4) {
                toast("无法确认已进入招募干员界面");
                console.error("无法确认已进入招募干员界面");
                tool.Floaty_emit("展示文本", "状态", "状态：无法确认进入tag选择界面");
                break
            }
        }
        return true;
        // }
    },
    选择位置: function (shu) {
        tool.Floaty_emit("展示文本", "状态", "状态：选择公招位置");
        sleep(300);
        console.info("---选择公招位" + shu + "---");
        switch (shu) {
            case 1:
                MyAutomator.click(height / 2.5 + random(-10, 10), width / 2.4 + random(-10, 10));
                sleep(800);
                position = 1;
                return 确认招募按钮();
            case 2:
                MyAutomator.click(height / 1.4 + random(-10, 10), width / 3 + random(-10, 10))
                sleep(800)
                position = 2;
                return 确认招募按钮();
            case 3:
                MyAutomator.click(height / 3 + random(-10, 10), width / 1.4 + random(-10, 10));
                sleep(800)
                position = 3
                return 确认招募按钮();
            case 4:
                MyAutomator.click(height / 1.4 + random(-10, 10), width / 1.4 + random(-10, 10));
                sleep(800)
                position = 4;
                return 确认招募按钮();
        }
        return true;
    },
    /**
     * @param {Boolean} noTag - 是否无tag，7:40分招募
     */
    确认招募: function (noTag) {
        taglb = ITimg.matchFeatures("公招_小时_减", {
            action: 5,
            area: 12,
            scale: 1,
            picture_failed_further: true,
        }) || ITimg.matchFeatures("公招_小时_减", {
            action: 5,
            area: 12,
            scale: 1,
            matcher: 2,
            threshold: 0.75,
            refresh: false,
            picture_failed_further: true,
        })

        if(!taglb){
            taglb = ITimg.matchFeatures("公招_小时_减", {
                action: 5,
                area: 12,
                scale: 0.95,
                matcher: 2,
                threshold: 0.75,
                refresh: true,
                picture_failed_further: true,
            })
        }

        if (!taglb) {
            return false;
        }
        let _xy = [taglb.x + (taglb.w / 4), taglb.y + taglb.h / 2];
        MyAutomator.click.apply(click, _xy);
        if (noTag) {
            sleep(100);
            MyAutomator.click.apply(click, _xy);
            sleep(200);
            _xy[0] = _xy[0] + (taglb.w / 2);
            MyAutomator.click.apply(click, _xy);
            sleep(100);
            MyAutomator.click.apply(click, _xy);
        }
        sleep(500);

        if (确认招募按钮(0)) {
            while (等待提交反馈至神经()) {
                sleep(500);
            }
            return true;
        }



    },
    tag_result_view: function (_bon) {
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
                    textColor="#808080"
                    layout_gravity="center"
                    w="*" />

                <ScrollView h="auto" id="scrollView" visibility="gone">

                    <vertical id="content" padding="3" h="auto">


                    </vertical>

                </ScrollView >
            </vertical>);

        this.tag_result_d = dialogs.build({
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
            setting.tag识别.tag_list = _bon;
        } else {
            setting.tag识别 = {};
            setting.tag识别.自动检测 = true;
            setting.tag识别.tag_list = _bon;
        }
        tool.writeJSON("tag识别", setting.tag识别);
        tag_result_ui.bon.setText(_bon.toString());
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
                            textColor="#808080"
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
                this.tag_result_d.setActionButton("positive", "返回");
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
        this.tag_result_d.show();
    }

}
module.exports = 公招