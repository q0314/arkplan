"ui";
importClass(android.graphics.Color);
importClass(android.graphics.drawable.GradientDrawable);

let toupdate;

var server = storages.create("server").get("server");

let key = new $crypto.Key("qiao031420030313");

server = $crypto.decrypt(server, key, "AES", {
    "input": "base64",
    "output": "string"
});
if (!jlink_mian) {
    threads.start(function () {

        http.get(server + "about_link.json", {}, (res, err) => {
            if (err) {
                toast("似乎无法连接服务器，错误类型:" + err)
                console.error("似乎无法连接服务器，错误类型:" + err)
                engines.stopAll();
            }
            if (res['statusCode'] != 200) {
                throw new Error('请求云端配置信息出错' + res['statusMessage']);

            } else {
                jlink_mian = JSON.parse(res.body.string());
            }
        })
    })
}
//Drawable工具
let mUtil = require('../lib/prototype/drawable.js');
try {
    var theme = require("../theme.js")
} catch (err) {

}
toupdate = require('../lib/to_update.js');
ui.statusBarColor(theme.bar);
ui.layout(
    <frame id="frame" bg="#ffffff">
        <vertical fitsSystemWindows="true">
            <appbar>
                <toolbar id="toolbar" title="关于应用" bg="{{theme.bar}}" />
            </appbar>
            <frame>
                <card layout_gravity="center|top" marginBottom="5" w="*" marginLeft="0" marginRight="0" h="auto" cardCornerRadius="0dp" bg="#00000000" foreground="?android:attr/selectableItemBackgroundBorderless">
                    <ScrollView>
                        <vertical >
                            <card w="*" id="ai" margin="10" h="*" cardCornerRadius="10dp"
                                cardElevation="5dp" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">

                                <vertical paddingBottom="15" bg="#f8ebe6">
                                    <img src="file://./res/icon.png" margin="0 25 0 10" borderWidth="0dp" w="90" h="90"
                                        layout_gravity="center_horizontal" circle="true" />
                                    <text id="name" textColor="#000000" textStyle="bold" textSize="18sp"
                                        text="明日计划" gravity="center" />
                                    <text id="apply_version" text="" margin="0" gravity="center" >
                                    </text>
                                    <text id="engine_version" text="引擎版本: Auto.js {{(app.autojs.versionCode > 8082200 ? 'Pro 9.3.11 (64/32位)':'Pro 8.8.13 (32位)')}}" margin="0" gravity="center" >
                                    </text>

                                </vertical>

                            </card>
                            <card w="*" id="indx2" margin="10 3 10 3" h="160" cardCornerRadius="10"
                                cardElevation="5dp" gravity="center_vertical"  >
                                <vertical>
                                    <text text='联系作者' margin="10 5 10 0" h="35dp" id="text_bg"
                                        gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                                    </text>
                                    <card w="*" id="indx2" h="*"  >
                                        <list id="menu">
                                            <horizontal foreground="?android:attr/selectableItemBackgroundBorderless" w="*" >
                                                <text textSize="15" text="{{this.title}}" textColor="#080808" margin="25 10 0 10" gravity="center_vertical" layout_weight="1" />
                                            </horizontal>
                                        </list>
                                    </card>
                                </vertical>
                            </card>

                            <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                                cardElevation="5dp" gravity="center_vertical"  >
                                <vertical>
                                    <text text='应用相关' margin="10 5 10 0" h="35dp" id="text_bg"
                                        gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                                    </text>

                                    <card w="*" id="indx2" h="40" >
                                        <horizontal id="mingdan" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                            <text textSize="15" text="捐赠名单" textColor="#080808" margin="25 0 0 0" gravity="center_vertical" />
                                            <text layout_weight="1" />
                                        </horizontal>
                                    </card>

                                    <card w="*" id="indx2" h="40" >
                                        <horizontal id="juanzeng" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                            <text textSize="15" text="捐赠打赏" textColor="#080808" margin="25 0 0 0" gravity="center_vertical" />
                                            <text layout_weight="1" />
                                        </horizontal>
                                    </card>

                                    <card w="*" id="indx2" h="40"  >
                                        <horizontal id="rizhi" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                            <text textSize="15" text="更新日志" textColor="#080808" margin="25 0 0 0" gravity="center_vertical" />
                                            <text layout_weight="1" />
                                        </horizontal>
                                    </card>

                                    <card w="*" id="indx2" h="40">
                                        <horizontal id="banben" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                            <text id="vetext" textSize="15" text="检查更新" textColor="#080808" margin="25 0 0 0" gravity="center_vertical" />
                                            <text layout_weight="1" />
                                        </horizontal>
                                    </card>

                                    <card w="*" id="indx2" h="40">
                                        <horizontal id="pasle" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                            <text id="paslet" textSize="15" text="版本分支" textColor="#080808" margin="25 0 0 0" gravity="center_vertical" />
                                            <text layout_weight="1" />
                                        </horizontal>
                                    </card>

                                    <card w="*" id="indx2" h="40" >
                                        <horizontal id="developer" gravity="center_vertical" foreground="?android:attr/selectableItemBackgroundBorderless">
                                            <text textSize="15" text="应用图标作者:Rosalindlo" textColor="#080808" margin="25 0 0 0" gravity="center_vertical" />
                                            <text layout_weight="1" />
                                        </horizontal>
                                    </card>



                                </vertical>
                            </card>
                            <card w="*" id="indx2" margin="10 3 10 3" h="auto" cardCornerRadius="10"
                                cardElevation="5dp" gravity="center_vertical"  >
                                <vertical>
                                    <text text='应用帮助' margin="10 5 10 0" h="35dp" id="text_bg"
                                        gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                                    </text>
                                    <card w="*" id="indx2" h="240" >
                                        <list id="Help_list">
                                            <horizontal foreground="?android:attr/selectableItemBackgroundBorderless" w="*" h="40">
                                                <text textSize="15" text="{{this.title}}" textColor="#080808" margin="25 10 0 10" gravity="center_vertical" layout_weight="1" />
                                            </horizontal>
                                        </list>
                                    </card>
                                </vertical>
                            </card>

                            <vertical padding="0 15">
                            </vertical>
                        </vertical>

                    </ScrollView>
                </card>
            </frame>
        </vertical>
    </frame>
)
activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);

ui.toolbar.setNavigationOnClickListener({
    onClick: function () {
        ui.finish();
    },
});

//创建指定大小的Drawable
let mDrawable = mUtil.create("返回", 25);

//标题颜色
ui.toolbar.setTitleTextColor(colors.parseColor("#000000"));
mDrawable.setTint(colors.parseColor('#000000'));

//更改返回键图标
activity.getSupportActionBar().setHomeAsUpIndicator(mDrawable);

ui.ai.on("click", () => toast("你喜欢我吗"));
let edition = jiance()

ui.apply_version.setText("应用版本：" + edition.replace("main.js", "") + app.versionName);
var age = storages.create("Doolu_download");

ui.menu.setDataSource([{
    title: "QQ：梦月時謌",
    icon: "@drawable/ic_assessment_black_48dp"
},
{
    title: "社区：梦月時歌",
    icon: "@drawable/ic_settings_black_48dp"
},
{
    title: "哔哩哔哩：梦月時歌",
    icon: "@drawable/ic_settings_black_48dp"
}

]);

ui.menu.on("item_click", item => {
    switch (item.title) {
        case "QQ：梦月時謌":
            try {
                app.startActivity({
                    action: "android.intent.action.VIEW",
                    data: "mqqapi://card/show_pslcard?card_group&uin=" + "3465344901",
                    packageName: "com.tencent.mobileqq",
                });
            } catch (err) {
                toastLog("请先安装QQ或升级QQ\nQQ号：3465344901")
            }
            break;
        case "社区：梦月時歌":
            toast("建议使用浏览器打开");
            new_ui(jlink_mian.community)
            //age.put("url", jlink_mian.community);
            // engines.execScript("browser_ui", java.lang.String.format("'ui';  var theme = storages.create('configure').get('theme_colors');require('./lib/Builtinbrowser.js');"));
            break;
        case "哔哩哔哩：梦月时歌":
            new_ui("https://b23.tv/6wna6i");
            // app.openUrl("https://b23.tv/6wna6i");
            break;
    }
})

ui.Help_list.setDataSource([{
    title: "问题帮助",
    icon: "@drawable/ic_settings_black_48dp"
},
{
    title: "官方频道",
    icon: "@drawable/ic_assessment_black_48dp"
}, {
    title: "加入群聊",
    icon: "",
},
{
    title: "使用说明",
    icon: "@drawable/ic_settings_black_48dp"
}, {
    title: "视频教程",
    icon: "@drawable/ic_settings_black_48dp"
}, {
    title: "关于应用",
    icon: "",
}

]);

ui.Help_list.on("item_click", item => {
    switch (item.title) {
        case "官方频道":
            qq跳转频道(jlink_mian.频道url);
            break;
        case "加入群聊":
            try {
                $app.startActivity({
                    data: "mqqapi://card/show_pslcard?card_type=group&uin=" + jlink_mian.群号,
                })
            } catch (err) {
                toastLog("请先安装QQ或升级QQ\n群号：" + jlink_mian.群号)
            }
            break
        case "问题帮助":
            new_ui(jlink_mian.疑惑解答)
            // age.put("url", jlink_mian.疑惑解答);
            //  engines.execScript("browser_ui", java.lang.String.format("'ui';  var theme = storages.create('configure').get('theme_colors');require('./lib/Builtinbrowser.js');"));
            break;
        case "使用说明":
            new_ui(jlink_mian.使用说明)
            /*
            age.put("url", jlink_mian.使用说明);
            engines.execScript("browser_ui", java.lang.String.format("'ui';  var theme = storages.create('configure').get('theme_colors');require('./lib/Builtinbrowser.js');"));
          */
            break;
        case "视频教程":
            new_ui(jlink_mian.视频教程);
            break;
        case "关于应用":
            new_ui(jlink_mian.关于应用)
            break
    }
})


ui.pasle.click(() => {
    let pasle_ui = ui.inflate(
        <vertical id="parent">
            <frame>
                <ScrollView>
                    <vertical>
                        <horizontal margin="0" bg="#00000000">
                            <img src="file://res/icon.png" w="50" h="30" margin="0 5" />
                            <text text="版本分支管理" layout_gravity="left|center_vertical" textColor="#000000" />
                            <horizontal w="*" h="*" gravity="right" clickable="true" >
                                <img id="exit" src="@drawable/ic_clear_black_48dp" layout_gravity="center" w="35" height="35" padding="5" marginRight="5" foreground="?selectableItemBackground" />
                            </horizontal>
                        </horizontal>
                        <linear gravity="center" margin="0 -2">
                            <View bg="#f5f5f5" w="*" h="2" />
                        </linear>


                        <vertical id="grant" marginBottom="5">
                            <card w="*" id="w_edition" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" foreground="?selectableItemBackground">
                                <vertical margin="10 5" >
                                    <horizontal>
                                        <text text="web版" textSize="18sp" textColor="#000000" />
                                        <horizontal w="*" h="*" gravity="right|center_vertical">
                                            <text id="w_tips" text="当前版本分支" textColor="#00ff00" padding="6 4" textSize="12" marginRight="10" visibility="gone" />
                                        </horizontal>
                                    </horizontal>
                                    <text text="仅提供webview服务" autoLink="web" textSize="13sp" />
                                </vertical>
                            </card>

                            <card w="*" id="c_edition" visibility="gone" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" foreground="?selectableItemBackground" >
                                <vertical margin="10 5" >
                                    <horizontal>
                                        <text text="纯净版" textSize="18sp" textColor="#000000" />
                                        <horizontal w="*" h="*" gravity="right|center_vertical">
                                            <text id="c_tips" text="当前版本分支" textColor="#00ff00" padding="6 4" textSize="12" marginRight="10" visibility="gone" />
                                        </horizontal>
                                    </horizontal>
                                    <text text="移除webview及其他花里胡哨的功能、内容，减少运存开支，适用于性能较低的设备" autoLink="web" textSize="13sp" />
                                </vertical>
                            </card>

                            <card w="*" id="f_edition" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" foreground="?selectableItemBackground">
                                <vertical margin="10 5" >
                                    <horizontal>
                                        <text text="完全版" textSize="18sp" textColor="#000000" />
                                        <horizontal w="*" h="*" gravity="right|center_vertical">
                                            <text id="f_tips" text="当前版本分支" textColor="#00ff00" padding="6 4" textSize="12" marginRight="10" visibility="gone" />
                                        </horizontal>
                                    </horizontal>
                                    <text id="adb_txt" text="享受所有功能" autoLink="web" textSize="13sp" />
                                </vertical>
                            </card>


                        </vertical>
                    </vertical>
                </ScrollView>
            </frame>
        </vertical>);

    var pasle_b = dialogs.build({
        type: "app",
        customView: pasle_ui,
        wrapInScrollView: false
    })
    switch (edition) {
        case "w_main.js":
            setBackgroundRoundedRectangle(pasle_ui.w_tips)
            pasle_ui.w_tips.setVisibility(0);
            break;
        case "f_main.js":
            setBackgroundRoundedRectangle(pasle_ui.f_tips)
            pasle_ui.f_tips.setVisibility(0);
            break;
        case "c_main.js":
            setBackgroundRoundedRectangle(pasle_ui.c_tips)
            pasle_ui.c_tips.setVisibility(0);
            break;
    }
    pasle_b.show()
    pasle_ui.exit.click(() => {
        pasle_b.dismiss()
    })


    function qiehuan(dangqian, banben) {
        if (dangqian == banben) {
            toastLog("已是" + dangqian + "版")
            return
        }
        files.rename("./main.js", dangqian);
        files.rename("./" + banben, "main.js");

        let execution = engines.all();
        for (let i = 0; i < execution.length; i++) {
            if (execution[i].getSource().toString().match(/([^/]+)$/)[1] == "main.js") {
                execution[i].forceStop()
            }
            if (execution[i].getSource().toString().match(/([^/]+)$/)[1] == "Floaty.js") {
                execution[i].forceStop()
            }
        }
        engines.execScriptFile("./main.js");
        console.info("切换" + banben + "版成功")
        exit();

    }

    pasle_ui.f_edition.click(() => {
        qiehuan(jiance(), "f_main.js")
    })
    pasle_ui.c_edition.click(() => {
        qiehuan(jiance(), "c_main.js")
    })

    pasle_ui.w_edition.click(() => {
        qiehuan(jiance(), "w_main.js")
    })

})

function setBackgroundRoundedRectangle(view, w, bg) {
    w = w || 5
    bg = bg || Color.GREEN
    gradientDrawable = new GradientDrawable();
    gradientDrawable.setShape(GradientDrawable.RECTANGLE);
    gradientDrawable.setStroke(5, bg);
    gradientDrawable.setCornerRadius(10);
    gradientDrawable.setSize(50, 50);
    view.setBackground(gradientDrawable);

}

function jiance(banben) {
    switch (true) {
        case files.exists("./f_main.js") && files.exists("./c_main.js"):
            return "w_main.js"
        case files.exists("./c_main.js") && files.exists("./w_main.js"):

            return "f_main.js";
        case files.exists("./w_main.js") && files.exists("./f_main.js"):
            return "c_main.js";
        case true:
            return "null";
    }
}
//更新日志
ui.rizhi.on("click", () => threads.start(Historicalupdate));

//捐赠名单
ui.mingdan.on("click", () => {
    //age.put("url", jlink_mian.捐赠名单);
    new_ui(jlink_mian.捐赠名单)
    //engines.execScript("browser_ui", java.lang.String.format("'ui';  var theme = storages.create('configure').get('theme_colors');require('./lib/Builtinbrowser.js');"));
});
ui.juanzeng.on("click", () => {
    var donationkey = require('../lib/java/crypto.dex')
    donationkey.donation("iVBORw0KGgoAAAANSUhEUgAA")
});

//检查更新
ui.banben.on("click", () => {
    threads.start(function () {
        toupdate.showProgress();
        toupdate.updata(true, server + "Versionlog.json", undefined)
    });
});

ui.developer.on("click", () => {
    new_ui("https://space.bilibili.com/352372683");
});
/*
ui.Module_developer.on("click", () => {
    try {
        app.startActivity({
            action: "android.intent.action.VIEW",
            data: "mqqapi://card/show_pslcard?card_group&uin=" + "421184543",
            packageName: "com.tencent.mobileqq",
        });
    } catch (err) {
        toastLog("请先安装QQ或升级QQ\nQQ号：421184543")
    }
})*/

function Historicalupdate() {
    var dialog;
    try {
        dialog = dialogs.build({
            type: "app",
            content: "正在拉取云端数据",
            positive: "关闭",
            canceledOnTouchOutside: false
        })
            .show();
        let resn = http.get(jlink_mian.更新日志);
        if (resn.statusCode == 200) {
            dialog.setContent("版本历史更新日志\n\n" + resn.body.string());
            dialog.setCancelable(true);
            return
        } else {
            dialog.setContent("超时，请检查你的网络!")
            return
        };
    } catch (eu) {

        dialog.setContent("拉取更新日志失败，请稍候再试\n" + eu);
        return
    }
};

function qq跳转频道(频道分享链接) {
    try {

        app.startActivity({
            packageName: "com.tencent.mobileqq",
            data:
                "mqqapi://forward/url?src_type=web&style=default&plg_auth=1&version=1&url_prefix=" + $base64.encode(频道分享链接),
        });

    } catch (err) {
        toastLog("请先安装QQ或升级QQ")
    }
}

function new_ui(url) {
    if (edition == "c_main.js") {
        toastLog("纯净版不可用")
        return
    }
    let web_set = storages.create("configure").get("web_set") //.toString()
    web_set.new_url = url
    storages.create("configure").put("web_set", web_set)
    //  console.error(web_set)
    ui.finish()
    // exit();
}