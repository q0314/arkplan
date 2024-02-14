importClass(android.graphics.drawable.GradientDrawable);

function removeByVal(arrylist, val, 操作) {
    switch (操作) {
        case "删除":
            for (var i = 0; i < arrylist.length; i++) {
                if (arrylist[i] == val) {
                    arrylist.splice(i, 1);
                    break;
                }
            }
            break;
        case "删除2":
            for (var i = 0; i < arrylist.length; i++) {
                if (arrylist[i].名称.search(val) != -1) {
                    arrylist.splice(i, 1);
                } else {
                    return arrylist
                }
            }
            break;
        case "修改":
            for (var i = 0; i < arrylist.length; i++) {
                if (arrylist[i].state == val) {
                    arrylist[i].state = "使用";
                    arrylist[i].color = "#ffffff";
                    return true;
                }
            }
            break;
    }
}

function ischeck(id) {
    for (let i = 0; i < id.getChildCount(); i++) {
        let rb = id.getChildAt(i);
        if (rb.isChecked()) {
            return rb.getText()
        }
    }
}


/*
var storage = storages.create("time");
var timed_tasks_list = storage.get("items", []);*/
timed_tasks_set = function (timed_tasks_list, level_choices, callback) {

    let uii = ui.inflate(
        <vertical id="parent">
            <frame>
                <ScrollView>
                    <vertical>
                        <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#00000000">
                            <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                            <text text="定时任务" gravity="center|left" textColor="#000000" marginLeft="50" />

                            <linear gravity="center||right" marginLeft="5" >
                                <text id="wenn" textColor="#03a9f4" text="了解更多" padding="10" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                            </linear>

                        </card>

                        <linear gravity="center" margin="0 -2">
                            <text text=" 渠道服" id="prompt_line" textSize="8" marginLeft="5" />
                            <View bg="#f5f5f5" w="*" h="2" />
                        </linear>
                        <text id="wxts" text="温馨" typeface="sans" padding="5" visibility="gone" textColor="#000000" textSize="15sp" layout_gravity="center" />

                        <card id="car" w="*" h="auto" margin="5 0 5 0" cardCornerRadius="2dp"
                            cardElevation="1dp" foreground="?selectableItemBackground" cardBackgroundColor="#eff0f4">

                            <radiogroup mariginTop="0" w="*">

                                <radiogroup id="fu" orientation="horizontal">
                                    <radio id="fu1" text="简中服" checked="true" />
                                    <radio id="fu2" text="B服" />
                                    <radio id="fu3" text="繁中服" />
                                </radiogroup>
                                <linear gravity="center" margin="0 -2">
                                    <text text=" 执行选项" textSize="8" />
                                    <View bg="#f5f5f5" w="*" h="2" />
                                </linear>

                                <horizontal marginLeft="5" gravity="center" w="*">
                                    <text text="执行模式" textSize="{{px2dp(48)}}" textColor="#212121" marginRight="50" />
                                    <spinner id="implement" textSize="{{px2dp(62)}}" entries=""
                                        gravity="center" layout_weight="1" margin="5 5" padding="4" />

                                </horizontal>
                                <horizontal marginLeft="5" gravity="center" w="*">
                                    <text text="关卡选择" textSize="{{px2dp(48)}}" textColor="#212121" marginRight="50" />
                                    <spinner id="level_pick" textSize="{{px2dp(62)}}" entries=""
                                        gravity="center" layout_weight="1" margin="5 5" padding="4" />

                                </horizontal>


                                <vertical id="mr">
                                    <linear gravity="center" margin="0 -2">
                                        <text text=" 执行配置" textSize="8" />
                                        <View bg="#f5f5f5" w="*" h="2" />
                                    </linear>
                                    <horizontal gravity="center" marginLeft="5" w="*">
                                        <text id="mr1" text="刷图上限:" textSize="15" textColor="#212121" />
                                        <input id="wordname3" inputType="number" hint="{{setting.剿灭}}次" layout_weight="1" visibility="gone" paddingLeft="6" w="auto" />
                                        <input id="wordname" inputType="number" hint="{{setting.行动}}次" layout_weight="1" paddingLeft="6" w="auto" />
                                        <text id="mr2" text="磕药/碎石:" textSize="15" textColor="#212121" />
                                        <input id="wordname2" inputType="number" hint="{{setting.理智}}个" layout_weight="1" w="auto" />
                                    </horizontal>
                                    <Switch id="ysrh" checked="{{setting.only_medicament}}" text="仅使用药剂恢复理智" padding="6 6 6 6" textSize="16sp" />
                                </vertical>
                                <linear gravity="center" margin="0 -2">
                                    <text text=" 运行时间" textSize="8" />
                                    <View bg="#f5f5f5" w="*" h="2" />
                                </linear>
                                <radiogroup id="ll" orientation="horizontal" h="auto">
                                    <radio id="l1" text="按每天运行" checked="true" w="*" />
                                    <radio id="l3" text="仅运行一次" w="*" />
                                    <radio id="l2" text="按星期运行" w="*" h="auto" />
                                </radiogroup>


                                <datepicker id="datepicker" margin="0 -20 0 -40" datePickerMode="spinner" layout_gravity="center" visibility="gone" />

                                <timepicker id="timePickerMode" margin="0 -20" timePickerMode="spinner" layout_gravity="center" />
                                <vertical id="li2" padding="0 0 0 0" w="*" layout_gravity="center" visibility="gone">
                                    <horizontal weightSum='4' margin="10 0 0 0" gravity="center">
                                        <checkbox id='z1' text="周一" h='*' w='0dp' layout_weight='1'>
                                        </checkbox>
                                        <checkbox id='z2' text="周二" h='*' w='0dp' layout_weight='1'>
                                        </checkbox>
                                        <checkbox id='z3' text="周三" h='*' w='0dp' layout_weight='1'>
                                        </checkbox>
                                    </horizontal>
                                    <horizontal margin="0 0 0 0" weightSum='4' gravity="center_horizontal">
                                        <checkbox id='z4' text="周四" h='*' w='0dp' layout_weight='1'>
                                        </checkbox>
                                        <checkbox id='z5' text="周五" h='*' w='0dp' layout_weight='1'>
                                        </checkbox>
                                        <checkbox id='z6' text="周六" h='*' w='0dp' layout_weight='1'>
                                        </checkbox>
                                        <checkbox id='z0' text="周日" h='*' w='0dp' layout_weight='1'>
                                        </checkbox>
                                    </horizontal>

                                </vertical>
                                <linear gravity="center" margin="0 -2">
                                    <text text=" 高级功能" textSize="8" />
                                    <View bg="#f5f5f5" w="*" h="2" />
                                </linear>
                                <vertical w="*">
                                    <widget-switch-se7en id="noticeWaken" text="发送通知唤醒屏幕" checked="false" padding="0 5 10 5" textSize="18sp"
                                        margin="10 0" thumbSize='24' gravity="center_vertical" w="*"
                                        radius='24' />
                                    <widget-switch-se7en id="xpyx" text="此次任务熄屏运行" checked="false" padding="0 5 10 5" textSize="18sp"
                                        margin="10 0" thumbSize='24' gravity="center_vertical" w="*"
                                        radius='24' />
                                    <widget-switch-se7en id="jyyx" text="此次任务静音运行" checked="false" padding="0 5 10 5" textSize="18sp"
                                        margin="10 0" thumbSize='24' gravity="center_vertical" w="*"
                                        radius='24' />
                                </vertical>

                                <linear gravity="center" margin="0 -2">
                                    <text text=" 密码解锁管理" id="prompt_line" textSize="8" />
                                    <View bg="#f5f5f5" w="*" h="2" />
                                </linear>
                                <horizontal w="*">
                                    <widget-switch-se7en id="zdjs" text="自动解锁屏幕" checked="false" padding="0 5 10 5" textSize="18sp"
                                        margin="10 0" thumbSize='24' gravity="center_vertical" w="*"
                                        radius='24' />

                                </horizontal>
                            </radiogroup>

                        </card>

                        <horizontal w="*" padding="-3" gravity="center_vertical">
                            <button text="退出" id="exit" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                            <button text="确认" id="ok" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                        </horizontal>
                    </vertical>
                </ScrollView>
            </frame>
        </vertical>);

    var res = dialogs.build({
        type: "app",
        customView: uii,
        wrapInScrollView: false
    })
    tool.setBackgroundRoundRounded(res.getWindow(), { radius: 0, })
    res.show();
    uii.wxts.setText(" 1. 需保持后台运行\n由于各系统的限制，定时任务不能一定保证准时运行，可能会延迟1~5分钟。请尽量将明日计划加入各种白名单和允许自启动权限，后台任务上锁，让明日计划持续在后台运行。" +
        "\n\n 2. 自动解锁手机\n如需明日计划自动解锁屏幕，请打开自动解锁屏幕,并设置锁屏密码，九宫格(1-9)请自行转换。内置解锁目前支持的手机品牌不多，仅小米，vivo。如果不支持你的手机，请录制解锁动作，如果你会编写js模块也可以直接在输入框输入文件路径确认" +
        "\n\n 3. 定时任务不运行？\n请检查相关权限，你也可以通过设置-开发人员代码测试-DIY属于自己的循环定时任务")


    adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, level_choices);
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    uii.level_pick.setAdapter(adapter);
    uii.level_pick.setBackground(createShape(5, 0, 0, [2, setting.bg]));
    uii.level_pick.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
        onItemSelected: function (parent, view, position, id) {
            //  setting.指定关卡.levelAbbreviation = parent.getSelectedItem();
            switch (parent.getSelectedItem()) {
                case "龙门外环":
                case "当前剿灭":
                    uii.mr.attr("visibility", "visible")
                    uii.wordname.attr("visibility", "gone")
                    uii.wordname3.attr("visibility", "visible");
                    break;
                default:
                    uii.mr.attr("visibility", "visible")
                    uii.wordname.attr("visibility", "visible")
                    uii.wordname3.attr("visibility", "gone");
                    break;
            }
        }
    }));
    adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, modeGatherText);
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    uii.implement.setAdapter(adapter);
    uii.implement.setBackground(createShape(5, 0, 0, [2, setting.bg]));

    uii.wenn.on('click', function () {
        if (uii.wxts.getHint() == "true") {
            uii.wxts.setVisibility(8)
            uii.wxts.setHint("false");
            uii.car.setVisibility(0)
            uii.prompt_line.setText(" 渠道服")
            uii.wenn.setTextColor(colors.parseColor("#03a9f4"))
        } else {
            uii.wxts.setVisibility(0)
            uii.wxts.setHint("true");
            uii.car.setVisibility(8);
            uii.prompt_line.setText(" 使用帮助")
            uii.wenn.setTextColor(colors.parseColor("#f4a406"))
        }
    })

    var storage = storages.create("time");
    var password = storage.get("password");

    uii.zdjs.on("click", function (view) {
        password = storage.get("password");

        if (view.checked) {
            let entry_ui = ui.inflate(
                <vertical id="parent">
                    <frame>
                        <ScrollView>
                            <vertical>
                                <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#00000000">
                                    <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                                    <text text="密码解锁管理" gravity="center|left" textColor="#000000" marginLeft="50" />

                                    <linear gravity="center||right" marginLeft="5" >
                                        <text id="entry_unlocking" textColor="#f4a406" text="录制解锁动作" padding="10" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                                    </linear>

                                </card>
                                <input id="password" text="" hint="输入：图形.数字.混合密码 或 录制解锁动作" singleLine="2" />

                                <horizontal w="*" padding="-3" gravity="right|center_vertical" margin="5 0" >
                                    <button text="确认" id="ok" style="Widget.AppCompat.Button.Borderless.Colored" />
                                </horizontal>
                            </vertical>
                        </ScrollView>
                    </frame>
                </vertical>);

            var entry = dialogs.build({
                type: "app",
                customView: entry_ui,
                wrapInScrollView: false
            }).show()
            if (password != null && password != undefined) {
                if (files.exists(password)) {
                    entry_ui.password.setHint(password)
                } else {
                    let text = "";
                    for (let i in password) {
                        text += "*"
                    }
                    entry_ui.password.setHint(text)
                }
            }
            entry_ui.entry_unlocking.on("click", () => {
                engines.execScriptFile("./activity/entry_unlocking.js");
                entry.dismiss();
            })
            entry_ui.ok.on("click", () => {
                if (entry_ui.password.getText().toString().length >= 4) {
                    toastLog("已储存")
                    storage.put("password", entry_ui.password.getText().toString())
                    tool.writeJSON("解锁屏幕", true);
                    entry.dismiss();
                }
            })

        }
        tool.writeJSON("解锁屏幕", view.checked);

    });
    if (setting.解锁屏幕) {
        uii.zdjs.checked = true;
        if (password == null || password == undefined) {
            tool.writeJSON("解锁屏幕", false);
            uii.zdjs.checked = false
        } else {
            if (password.length < 4) {
                storage.put("password", null);
            }
        }
    }
    if (setting.音量) {
        uii.jyyx.setVisibility(8)
    }
    uii.noticeWaken.checked = storage.get("noticeWaken") ? true : false;
    uii.noticeWaken.on("check", (checked) => {
        storage.put("noticeWaken", checked);
    });
    uii.xpyx.click((view) => {
        if (!view.checked) {
            return
        }
        if (!setting.熄屏) {
            view.checked = false;
            snakebar("请先前往侧边栏-设置-启用熄屏运行模块", 3000)
            return
        }
    })
    var time, timk;
    var arr = []

    //滑动时间选择
    uii.timePickerMode.setIs24HourView(true); //设置当前时间控件为24小时制
    uii.timePickerMode.setOnTimeChangedListener({
        onTimeChanged: function (v, h, m) {
            //h 获取的值 为24小时格式
            time = h + ":" + m;
        }
    });
    let chineseDigits = ["一", "二", "三", "四", "五", "六", "日"];

    const checkboxes = [uii.z1, uii.z2, uii.z3, uii.z4, uii.z5, uii.z6, uii.z0];

    checkboxes.forEach((checkbox, index) => {
        checkbox.on("check", (checked) => {
            const chineseDigit = chineseDigits[index];
            if (checked) {
                arr.splice(index, 0, chineseDigit);
            } else {
                removeByVal(arr, chineseDigit, "删除");
            }
        });
    });

    uii.exit.on("click", function () {
        res.dismiss();
    });
    var data = new Date()
    var y = data.getFullYear()
    var m = data.getMonth()
    var d = data.getDate()

    let now_date = y + "-" + (m + 1) + "-" + d;
    uii.datepicker.init(y, m, d, function (v, y, m, d) {
        //月值计算是从0开始的 要手动加1
        now_date = y + "-" + (m + 1) + "-" + d;
    });

    uii.ok.on("click", function () {
        if (time == null) {
            snakebar("请先选择时间");
            return
        }

        var jsPath = "./timers.js";
        var frequency = false;
        var reason = false;
        let re = /\d+/,
            text;
        text = re.exec(uii.wordname.getText());
        if (uii.wordname.getText().toString().length != 0) {
            frequency = ["行动", text[0]]
        } else {
            text = re.exec(uii.wordname3.getText());
            if (uii.wordname3.getText().toString().length != 0) {
                frequency = ["剿灭", text[0]]
            }
        }

        text = re.exec(uii.wordname2.getText());
        if (uii.wordname2.getText().toString().length != 0) {
            reason = text[0];
        }

        switch (ischeck(uii.ll)) {
            case "仅运行一次":
                timk = $timers.addDisposableTask({
                    path: jsPath,
                    date: now_date + "T" + time,
                })
                break;
            case "按每天运行":
                timk = $timers.addDailyTask({
                    path: jsPath,
                    time: time,
                });
                break;
            case "按星期运行":
                if (arr == false) {
                    snakebar("请选择星期")
                    return
                };
                timk = $timers.addWeeklyTask({
                    path: jsPath,
                    // 时间戳为Mon Jun 21 2021 13:14:00 GMT+0800 (中国标准时间)，事实上只有13:14:00的参数起作用
                    time: time,
                    daysOfWeek: arr,
                    delay: 0,
                    loopTimes: 1,
                    interval: 0
                });
                break;
        }
        if (uii.implement.getSelectedItemPosition() == 4) {
            jsPath = "自定义模块";
        } else {
            jsPath = uii.level_pick.getSelectedItem().toString();
        }
        jsPath = ischeck(uii.fu) + "-" + jsPath;

        let shijian = " 刷图" + (frequency ? frequency[1] : setting.行动) + "/理智" + (reason ? reason : setting.理智) + (uii.xpyx.checked ? " 熄屏运行" : "");
        if (arr == false) {
            toastLog("成功创建定时任务，id=" + timk.id + "时间" + time);
            if (uii.datepicker.getVisibility() == 0) {
                shijian = "单次" + now_date + " " + time + shijian;
            } else {
                shijian = "每日" + time + shijian;
            }

        } else {
            shijian = "每周" + arr + "," + time + shijian;
            toastLog("成功创建定时任务，id=" + timk.id + "日期：" + arr + ",时间" + time)
        }

        timed_tasks_list.push({
            id: timk.id,
            app: jsPath,
            frequency: frequency,
            reason: reason,
            type:  modeGather[modeGatherText[uii.implement.getSelectedItemPosition()]],
            specified: uii.level_pick.getSelectedItem().toString(),
            volume: uii.jyyx.checked,
            screen: uii.xpyx.checked,
            The_server: ischeck(uii.fu),
            shijian: shijian,
        });

        jsPath = null;
        if (!$power_manager.isIgnoringBatteryOptimizations()) {
            console.log("未开启忽略电池优化");
            $power_manager.requestIgnoreBatteryOptimizations();
        }
        res.dismiss();
        callback && callback(timed_tasks_list);
        return true;
    })

    uii.l1.on("check", (checked) => {
        if (checked) {
            uii.li2.setVisibility(8);
            uii.datepicker.setVisibility(8)
        }
    })

    uii.l2.on("check", (checked) => {
        if (checked) {
            uii.li2.setVisibility(0);
            uii.datepicker.setVisibility(8)
        }
    })

    uii.l3.on("check", (checked) => {
        if (checked) {
            uii.li2.setVisibility(8);
            uii.datepicker.setVisibility(0)
        }
    })


}
try {
    module.exports = timed_tasks_set;
} catch (err) {
    timed_tasks_set()
}