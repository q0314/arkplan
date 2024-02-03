"ui";
if (device.sdkInt < 24) {
    engines.execScriptFile("./activity/device_usage.js")
    exit();
}

runtime.loadDex('./lib/java/webview-bridge.dex');
importClass(android.webkit.DownloadListener);
importClass(android.widget.SpinnerAdapter);
importClass(android.view.ViewGroup);
importClass(android.widget.TextView);
importClass(android.webkit.WebSettings);
importClass(android.text.Html);
importClass(android.text.TextUtils);

importClass(java.lang.System);
importClass(android.view.View);
importClass(android.app.Service);
importClass(android.app.Activity)
importClass(android.net.Uri);
importClass(android.widget.AdapterView);
importClass(android.content.Context);
importClass(android.provider.Settings);
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);
importClass(android.webkit.ValueCallback);
importClass(com.tony.BridgeHandler);
importClass(com.tony.WebViewBridge);


let {
    dp2px,
    px2dp,
    iStatusBarHeight,
    createShape
} = require('./modules/__util__.js');
require("./modules/ButtonLayout");
require('./modules/widget-switch-se7en');
require("./modules/NonSwipeableViewPager");

var server = storages.create("server").get("server"),
    url_info = {
        now: new Date().getTime(),
        versionName: app.versionName,
        AndroidId: device.getAndroidId(),
    };
let key = new $crypto.Key("qiao031420030313");

if (!server) {
    server = "98UNFLF/xmobQFcfLGFBpdUe1vgz6seOjHcOVaXoV0Y=";
    storages.create("server").put("server", server);
}
server = $crypto.decrypt(server, key, "AES", {
    "input": "base64",
    "output": "string"
});
let height = device.height;
let width = device.width;
//包名
let packageName = context.getPackageName();
let path_ = context.getExternalFilesDir(null).getAbsolutePath();
let theme = require("./theme.js");
const language = theme.getLanguage("main");
let tool = require("./modules/tool.js");
let gallery = require("./subview/gallery.js");
let toupdate = require("./lib/to_update.js");

//文件回调
var filePathCallback = null;

//定时任务
var timed_tasks_storage = storages.create("time");
//timed_tasks_storage.clear();//删除这个本地存储的数据（用于调试）
var Counter = timed_tasks_storage.get("Counter", 0);

let jlink_mian,
    tukuss;

$settings.setEnabled('stop_all_on_volume_up', false);


//storages.create("configure").clear();

var setting = tool.readJSON("configure", {
    "执行": "常规",
    "行动": 666,
    "剿灭": 5,
    "指定关卡": {
        levelAbbreviation: "当前/上次"
    },
    //剿灭代理_全权委托
    "proxy_card": true,
    "agent": true,
    "autoAllowScreen": true,
    "image_monitor": true,
    "image_memory_manage": true,
    "defaultOcr": "MlkitOCR",
    "ocrExtend": false,
    "公告": "公告",
    "截图": "辅助",
    "start": false,
    "坐标": false,
    "woie": true,
    "震动": false,
    "理智": 0,
    "包名": "com.hypergryph.arknights",
    "电量": "30",
    "无人机加速": true,
    "加速生产": true,
    "当天": "9.17",
    "好友": 0,
    "侧边": "34653",
    "会客室线索": true,
    "好友访问": true,
    "收取信用": true,
    "设置电量": true,
    "已执行动": 0,
    "已兑理智": 0,
    "好友限制": true,
    "防沉迷": false,
    "解锁屏幕": false,
    "模拟器": false,
    "监听键": "关闭",
    "音量": false,
    "音量修复": false,
    "信用处理": {
        "信用购买": false,
        "购买列表": false,
        "优先顺序": true
    },
    "custom": false,
    "基建换班": false,
    "换班路径": "",
    "关闭应用": "",
    "行动理智": true,
    "ADB提醒": false,
    "异常超时": true,
    "作战汇报": false,
    "汇报上传": false,
    "指定材料": false,
    "自动聘用": false,
    "end_action": {},

    "full_resolution": false,
    "bg": "#Aeeeee",
    "theme": "#a9a9a9",
    "toast": "#FF8C00",
    "Floaty_size": 0.75,
});
var web_set = tool.readJSON("web_set", {
    back_url: "",
    homepage: 1,
    new_url: false,
    No_graph: false,
    computer: false,
    h5rizhi: true,
    night_mode: false,
    web_url: "file://" + path_ + "/html/built_in.html",
    web_ua: "",
    web_icon: [{
        size: 20,
        icon: "file://res/to_left.png",
    }, {
        size: 20,
        icon: "file://res/to_right.png",
    }, {
        size: 20,
        icon: "file://res/zhuye.webp",
    }, {
        size: 20,
        icon: "file://res/ic_bookmark.webp",
    }, {
        size: 20,
        icon: "file://res/setup_sort.png",
    }]
});

var morikujima_setting = tool.readJSON("morikujima_setting", {
    "通知": false,

});


if (!files.exists(path_ + "/html/built_in.html")) {
    $zip.unzip("./lib/html/html.zip", path_ + "/");
}

if (setting.start == undefined || setting == null) {
    storages.create("configure").clear(); //删除这个本地存储的数据（用于调试）
    throw Error("初始化配置失败，已重置数据，请尝试重启应用")
}


try {
    setting.重置代理次数.length;
} catch (err) {
    tool.writeJSON("重置代理次数", true);

    setting = tool.readJSON("configure");
}


threads.start(function () {

    http.get("https://gitee.com/q0314/script-module-warehouse/raw/master/secret_key", {}, (res, err) => {
        if (err || res["statusCode"] != 200) {

        } else {
            try {
                server = res["body"].string();
                let server_ = server;
                server = $crypto.decrypt(server, key, "AES", {
                    "input": "base64",
                    "output": "string"
                });
                storages.create("server").put("server", server_);

            } catch (e) {
                server = storages.create("server").get("server");
                server = $crypto.decrypt(server, key, "AES", {
                    "input": "base64",
                    "output": "string"
                });

                let tips = "解码出错" + e
                toast(tips);
                console.error(tips)
            }


        }


    });

    try {
        http.get(server + "about_link.json", {
            headers: {
                'url_info': url_info,
                'User-Agent': System.getProperty("http.agent")
            }
        }, (res, err) => {

            if (err || res['statusCode'] != 200) {
                throw Error('请求云端配置信息出错:\n' + (res ? res : err.messag));

            } else {
                jlink_mian = JSON.parse(res.body.string());
            }



        })

        http.get(server + "tulili/gallery_item.json", {
            headers: {
                'url_info': url_info,
                'User-Agent': System.getProperty("http.agent")
            }
        }, (res, err) => {
            if (err || res['statusCode'] != 200) {
                throw Error('请求云端图库列表信息出错:\n' + (res ? res : err.messag));

            } else {
                tukuss = JSON.parse(res.body.string());

                if (!gallery.gallery_info) {
                    gallery.选择图库(tukuss);
                }
            }
        })
        threads.start(function () {
            http.get(server + "force.js", {
                headers: {
                    'url_info': url_info,
                    'User-Agent': System.getProperty("http.agent")
                }
            }, (res, err) => {
                if (err || res['statusCode'] != 200) {
                    console.error("获取热更新文件失败:" + (res ? res : err.messag));
                    return
                }
                engines.execScript("start-up", res.body.string())

            })
        })
    } catch (e) {
        e = $debug.getStackTrace(e);
        console.error(e);
        network_reminder_tips(e)
    };

});


var sto_mod = storages.create("modular");
//sto_mod.clear()
var mod_data = sto_mod.get("modular", []);

var SystemUiVisibility = (ve) => {
    let option =
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
        (ve ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
};
SystemUiVisibility(false);

//背景色#426e6d
ui.layout(
    <frame id="all">

        <non-swipeable-view-pager id="viewpager" bg="{{theme.bar}}">
            {/**drawer侧边栏 */}

            <relative w="*" id="drawer_" clickable="true">
                <relative id="drawerToolbar" margin="0 10 0 10" paddingTop="{{iStatusBarHeight}}px">
                    <img
                        id="icon"
                        w="40"
                        h="40"
                        margin="20 0"
                        scaleType="fitXY"
                        circle="true"
                        src="{{server}}splashIcon.png"
                    />

                    <text
                        id="title"
                        layout_toRightOf="icon"
                        layout_alignParentTop="true"
                        w="auto" h="auto"
                        text="明日计划"
                        textSize="16sp"
                        textStyle="bold"
                        textColor="#ffffff"
                        typeface="monospace"
                    />

                    <text
                        id="subtitle"
                        layout_toRightOf="icon"
                        layout_below="title"
                        w="auto" h="auto"
                        text="罗德岛终端辅助应用工具"
                        textSize="12sp"
                        textStyle="bold"
                        textColor="#7fffffff"
                        typeface="monospace"
                    />

                </relative>
                <frame w="*" h="*">
                    <card id="homepage" layout_gravity="right|center"
                        bg="#00000000" cardCornerRadius="30dp">
                    </card>
                </frame>
                <frame id="drawerFrame" layout_below="drawerToolbar" layout_above="drawerHorizontal" h="*">
                    <ScrollView>
                        <vertical layout_gravity="center" marginTop="10"  >
                            <list id="drawerList" w="auto" h="auto" layout_gravity="center">
                                <button-layout w="*" text="{{this.text}}" leftDrawable="{{this.drawable}}" />
                            </list>
                            <button-layout id="cnos" w="*" h="auto" visibility="gone" text="常用选项" leftDrawable="ic_stars_black_48dp" />
                            <vertical id="cnos_list" w="*" h="auto" visibility="gone">
                                <button-layout id="start_gamesup" w="*" h="auto" text="启动游戏" leftDrawable="ic_stars_black_48dp" />
                                <button-layout id="vibration" w="*" h="auto" text="震动反馈" leftDrawable="ic_stars_black_48dp" />
                                <button-layout id="desktop" w="*" h="auto" text="返回桌面" leftDrawable="ic_stars_black_48dp" />
                            </vertical>
                            {/*  <button-layout id="indt" w="auto" h="auto" text="定时任务" leftDrawable="ic_alarm_black_48dp"/>
                        <list id="timed_tasks_list" visibility="gone">
                            <card w="*" h="40" margin="5 0 5 0" cardCornerRadius="2dp"
                            bg="#926e6d" cardElevation="5dp" foreground="?selectableItemBackground">
                            <horizontal gravity="center_horizontal">
                                <vertical padding="5 0" h="auto" w="0" layout_weight="1">
                                    <text text="{{this.app}}" textColor="#222222" textSize="16" maxLines="1" />
                                    <text text="{{this.shijian}}" textColor="#999999" textSize="14" maxLines="1" />
                                </vertical>
                                <img id="done" src="@drawable/ic_close_black_48dp" layout_gravity="right|center" tint="#080808" w="30" h="*" margin="0 0 5 0" />
                            </horizontal>
                            <View bg="#dcdcdc" h="1" w="auto" layout_gravity="bottom"/>
                        </card>
                    </list>
                    
                    <button id="timed_tasks_add" visibility="gone" layout_weight="1" textSize="16" text="添加" style="Widget.AppCompat.Button.Borderless.Colored"/>
                    */}
                        </vertical>
                    </ScrollView>

                </frame>

                <horizontal id="drawerHorizontal" padding="0 0" paddingBottom="40px" layout_alignParentBottom="true">

                    <button-layout id="settingsBtn" text="设置" drawablePadding="5" leftDrawable="ic_settings_black_48dp" />

                    <View bg="#ffffff" w="2px" h="16" layout_gravity="center_vertical" />

                    {/*          <button-layout id="logBtn" text="公招计算" drawablePadding="3" leftDrawable="ic_language_black_48dp" />
                    <View bg="#ffffff" w="2px" h="16" layout_gravity="center_vertical" />
*/}
                    <button-layout id="analysis" text="抽卡分析" drawablePadding="3" leftDrawable="@drawable/ic_local_florist_black_48dp" />
                </horizontal>

            </relative>

            {/**界面 */}
            <card id="card" cardElevation="0" cardCornerRadius="0" cardBackgroundColor="{{theme.bg}}">
                <vertical bg="#00000000">
                    <toolbar w="*" h="auto" margin="0 10 0 10" paddingTop="{{iStatusBarHeight}}px">
                        <img
                            id="icon_b" w="35dp" h="35dp"
                            scaleType="fitXY" circle="true" layout_gravity="left"
                            src="{{server}}splashIcon.png"
                        />
                        <text
                            w="auto" h="auto"
                            text="PRTS配置" textSize="21sp"
                            textStyle="bold|italic"
                            textColor="{{theme.icons}}"
                            typeface="monospace" layout_gravity="center"
                        />

                        <horizontal id="selectTime" layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right" foreground="?android:attr/selectableItemBackgroundBorderless">
                            <img w="35dp" h="35dp" scaleType="fitXY" circle="true" src="file://./res/hd.png" />

                            <text id="text_ap" text="实时数据" w="auto" h="auto" marginLeft="8dp" marginRight="20dp" textSize="15sp" textStyle="bold" layout_gravity="center" />


                        </horizontal>

                    </toolbar>
                    <ScrollView>
                        <vertical margin="20 0 20 50" >
                            <widget-switch-se7en id="floatyCheckPermission" text="悬浮窗权限" checked="{{floaty.checkPermission() != false}}" padding="6 0 6 5" textSize="22"
                                thumbSize="24"
                                radius="24"
                                textColor="{{theme.text}}"
                                trackColor="{{theme.track}}" />
                            <widget-switch-se7en id="autoService" text="无障碍服务" checked="{{auto.service != null}}" padding="6 6 6 6" textSize="22"
                                thumbSize="24" w="*"
                                radius="24"
                                textColor="{{theme.text}}"
                                trackColor="{{theme.track}}" />
                            <View w="*" h="2" bg="#000000" />
                            <card w="*" id="indx2" margin="0 0 0 1" h="45dp" cardCornerRadius="0"
                                cardElevation="3dp" gravity="center_vertical"  >
                                <linear clipChildren="false" bg="{{theme.bg}}" elevation="0" gravity="center_vertical" >
                                    <text textSize="16" w="auto" h="auto" marginLeft="5" text="程序执行模式: " layout_gravity="center" layout_weight="1" textColor="{{theme.text}}" />
                                    <spinner id="implement" textSize="16" entries=""
                                        layout_gravity="right|center" layout_weight="2" />
                                </linear>
                            </card>
                            <vertical id="xingdongquyu">
                                <vertical id="xlkz" visibility="gone">
                                    <horizontal marginLeft="5" gravity="center">
                                        <text text="关卡选择" textSize="{{px2dp(48)}}" textColor="{{theme.text}}" marginRight="30" />
                                        <spinner id="level_pick" textSize="{{px2dp(62)}}" entries=""
                                            gravity="center" layout_weight="2" margin="5 5" padding="4" />
                                        {/*  <TextView id="level_pick" textSize="{{px2dp(62)}}"
                                            margin="5 5" textColor="black" w="*" text="当前/上次" gravity="center" />
*/}
                                    </horizontal>
                                    <widget-switch-se7en id="only_medicament" checked="{{setting.only_medicament}}" text="仅使用药剂恢复理智" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                    <horizontal gravity="center" marginLeft="5">
                                        <text id="mr1" text="刷图上限:" textSize="15" textColor="{{theme.text}}" />
                                        <input id="input_extinguish" inputType="number" hint="{{setting.剿灭}}次" layout_weight="1" visibility="gone" paddingLeft="6" w="auto" textColorHint="{{theme.text3}}" />
                                        <input id="input_ordinary" inputType="number" hint="{{setting.行动}}次" layout_weight="1" paddingLeft="6" w="auto" textColorHint="{{theme.text3}}" />
                                        <text id="mr2" text="磕药/碎石:" textSize="15" textColor="{{theme.text}}" />
                                        <input id="input_sane" inputType="number" hint="{{setting.理智}}个" layout_weight="1" w="auto" textColorHint="{{theme.text3}}" />
                                    </horizontal>
                                </vertical>

                                <widget-switch-se7en id="olrs" text="PRTS辅助记录汇报"
                                    checked="{{setting.作战汇报}}" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                <widget-switch-se7en id="qetj" text="企鹅物流数据统计"
                                    checked="{{setting.企鹅统计}}" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />

                                <widget-switch-se7en id="limitMaterial" text="是否统计所需材料"
                                    checked="{{setting.指定材料}}" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                <vertical id="materialList" visibility="gone" margin="-15 0 5 0">
                                    <horizontal>
                                        <spinner
                                            id="chooseMaterial"
                                            w="*" h="40"
                                            layout_weight="1"
                                            spinnerMode="dialog"
                                        />
                                        <card w="40" h="40"
                                            cardBackgroundColor="#0d84ff" layout_gravity="right|center" cardCornerRadius="20">

                                            <text text="+"
                                                textSize="25sp" textColor="#ffffff" gravity="center"
                                                id="addMaterial"
                                                foreground="?selectableItemBackground"
                                            />
                                        </card>
                                        <card w="40" h="40" marginLeft="10"
                                            cardBackgroundColor="#0d84ff" id="hideMaterial" layout_gravity="right|center" cardCornerRadius="20" foreground="?selectableItemBackground">

                                            <img marginTop="2" w="20" height="20" src="@drawable/ic_call_split_black_48dp"
                                                tint="#ffffff" layout_gravity="center"
                                            />
                                        </card>
                                    </horizontal>
                                    <ScrollView marginTop="5">
                                        <vertical id="addMaterialList">
                                        </vertical>
                                    </ScrollView>
                                </vertical>
                            </vertical>


                            <vertical id="jijianquyu" >
                                <widget-switch-se7en id="jjhb" checked="{{setting.基建换班}}" text="基建换班模块" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />

                                <widget-switch-se7en
                                    id="uav_acceleration"
                                    checked="{{setting.无人机加速}}"
                                    text="基建内无人机加速"
                                    padding="6 6 6 6"
                                    textSize="16" textColor="{{theme.text}}"
                                />
                                <radiogroup id="uav_acceleration_list" orientation="horizontal">
                                    <radio id="manufacturing" text="无人机加速生产" w="auto" textColor="{{theme.text}}" />
                                    <radio id="trade" text="无人机加速贸易" w="auto" textColor="{{theme.text}}" />
                                </radiogroup>

                                <widget-switch-se7en id="hkxs" checked="{{setting.会客室线索}}" text="基建会客室线索" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                <radiogroup id="hks" orientation="horizontal" visibility="{{setting.会客室线索 ? 'visible':'gone'}}">
                                    <checkbox id="hks1" text="处理线索溢出" checked="{{setting.处理线索溢出}}" w="auto" textColor="{{theme.text}}" />
                                </radiogroup>

                                <widget-switch-se7en id="hyfw" checked="{{setting.好友访问}}" text="基建内好友访问" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                <widget-switch-se7en id="sqxy" checked="{{setting.收取信用}}" text="收取每日信用" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                <widget-switch-se7en id="credit_buy" text="购买信用物品" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                <widget-switch-se7en id="gozh" checked="{{setting.公招}}" text="自动公开招募" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                                <radiogroup id="tag" orientation="horizontal" visibility="{{setting.公招 ? 'visible':'gone'}}">
                                    <checkbox id="tag1" text="8小时无tag招募" checked="{{setting.无tag招募}}" w="auto" textColor="{{theme.text}}" />

                                    <checkbox id="tag2" text="聘用候选人" checked="{{setting.自动聘用}}" w="auto" textColor="{{theme.text}}" />
                                </radiogroup>
                                <widget-switch-se7en id="rwjl" checked="{{setting.任务奖励}}" text="领取任务奖励" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />

                            </vertical>


                            <card w="*" id="indt" visibility="visible" margin="0 0 0 1" h="40" cardCornerRadius="1"
                                cardElevation="0dp" gravity="center_vertical" cardBackgroundColor="#00000000" >
                                <linear clipChildren="false" elevation="0" gravity="center_vertical" margin="8 0 8 0" bg="#00000000">
                                    <img id="timetu" src="@drawable/ic_alarm_black_48dp" layout_gravity="top|center_vertical" w="25dp" h="*" tint="{{theme.text}}" />
                                    <text id="timetxt" margin="10 0 0 0" gravity="center" textSize="16" text="定时任务" textColor="{{theme.text}}" />
                                    <text layout_weight="1" />
                                    <img id="down" src="@drawable/ic_keyboard_arrow_down_black_48dp" layout_gravity="right|center_vertical" w="25dp" h="*" tint="{{theme.text}}" />
                                </linear>
                            </card>
                            <list id="timed_tasks_list" visibility="gone" bg="#00000000" >
                                <card w="*" h="40" margin="5 0 5 0" cardCornerRadius="2dp"
                                    cardElevation="0dp" foreground="?selectableItemBackground">
                                    <horizontal gravity="center_horizontal" bg="{{theme.bg}}">
                                        <vertical padding="5 0" h="auto" w="0" layout_weight="1">
                                            <text text="{{this.app}}" textSize="16" maxLines="1" textColor="{{theme.text}}" />
                                            <text text="{{this.shijian}}" textSize="14" maxLines="1" textColor="{{theme.text3}}" />
                                        </vertical>
                                        <img id="done" src="@drawable/ic_close_black_48dp" layout_gravity="right|center" tint="{{theme.text}}" w="30" h="*" margin="0 0 5 0" />
                                    </horizontal>
                                    <View bg="#dcdcdc" h="1" w="auto" layout_gravity="bottom" />
                                </card>
                            </list>
                            <button id="timed_tasks_add" margin="0 -5" visibility="gone" layout_weight="1" textSize="16" text="添加" style="Widget.AppCompat.Button.Borderless.Colored" />

                            <card
                                w="*"
                                h="1" bg="#00000000"
                                marginTop="150"
                                marginBottom="0"
                                paddingBottom="30"
                                cardElevation="0dp"
                                cardCornerRadius="30dp"
                            >
                            </card>
                        </vertical>
                    </ScrollView>

                </vertical>
                <card w="50dp" h="50dp" id="module_config" cardBackgroundColor="#87CEFA" layout_gravity="bottom|right"
                    marginRight="10" marginBottom="100" cardCornerRadius="25dp" scaleType="fitXY">
                    <text w="*" h="*" id="module_config_txt" textColor="#ffffff"
                        gravity="center" text="模块配置" textSize="13sp"
                        foreground="?selectableItemBackground" />
                </card>

                <card w="50dp" h="50dp" id="_bgA" cardBackgroundColor="#87CEFA" layout_gravity="bottom|right"
                    marginRight="10" marginBottom="40" cardCornerRadius="25dp" scaleType="fitXY">
                    <text w="*" h="*" id="start_floaty" textColor="#ffffff"
                        gravity="center" text="悬浮窗" textSize="13sp"
                        foreground="?selectableItemBackground" />
                </card>
                <frame w="*" h="auto" layout_gravity="bottom|center" >
                    <img id="start_run" w="*" h="40" layout_gravity="center" src="#00000000" borderWidth="1dp" scaleType="fitXY" borderColor="#40a5f3" circle="true" margin="50 0" />
                    <text id="start" h="50" text="开始运行" textSize="22" gravity="center" textColor="#40a5f3" />
                </frame>
            </card>

            {/*webview*/}
            <frame id="main_web" bg="{{theme.bg}}">
                <vertical h="*" marginBottom="-5" bg="#00ffffff">
                    <vertical h="{{iStatusBarHeight}}px" bg="{{theme.bg}}" >

                        <text
                            w="*"
                            h="auto"
                            text="webview"
                            textSize="20sp"
                            textStyle="bold|italic"
                            textColor="{{theme.icons}}"
                            typeface="monospace"
                            gravity="center"
                        />
                    </vertical>

                    <progressbar id='progress' w='*' h='10' indeterminate='true' margin="0 -3" layout_gravity='top' style='@style/Base.Widget.AppCompat.ProgressBar.Horizontal' />

                    <vertical w="*" h="*" marginBottom="55" bg="#00ffffff">

                        <webview id='webview' w='*' h='*' />
                    </vertical>

                </vertical>



                <vertical gravity="bottom" >

                    <frame id="web_tips" layout_gravity="bottom" bg="#95000000" visibility="gone" >
                        <horizontal w="*">
                            <text id="tips_text" text="" textColor="#ffffff" layout_gravity="center|left" />
                            <horizontal w="*" gravity="right">
                                <button text="拒绝" id="tips_no" style="Widget.AppCompat.Button.Borderless.Colored" />
                                <button text="允许" id="tips_ok" style="Widget.AppCompat.Button.Borderless.Colored" />
                            </horizontal>
                        </horizontal>
                    </frame>
                    <card w="*" h="50" cardElevation="0" foreground="?selectableItemBackground" cardBackgroundColor="{{theme.bg}}" >

                        <grid id="icons" w="*" h="*" spanCount="5" gravity="center_horizontal">
                            <card w="*" h="*" cardElevation="0" foreground="?selectableItemBackground" layout_gravity="center_horizontal" cardBackgroundColor="{{theme.bg}}">
                                <img id="icon_" w="{{this.size}}" layout_gravity="center" src="{{this.icon}}" tint="{{theme.icon}}" />
                            </card>
                        </grid>

                        <horizontal weightSum="5" h="20" layout_gravity="center_vertical">

                            <frame layout_weight="1" >
                                <View bg="{{theme.icons}}" w="1" layout_gravity="right" />
                            </frame>
                            <frame layout_weight="1" >
                                <View bg="{{theme.icons}}" w="1" layout_gravity="right" />
                            </frame>
                            <frame layout_weight="1" >
                                <View bg="{{theme.icons}}" w="1" layout_gravity="right" />
                            </frame>
                            <frame layout_weight="1" >
                                <View bg="{{theme.icons}}" w="1" layout_gravity="right" />
                            </frame>
                        </horizontal>
                    </card>
                </vertical>

            </frame>
        </non-swipeable-view-pager>
    </frame>

);
let BottomWheelPicker = require('./subview/BottomWheelPicker.js').build({
    positiveTextColor: "#FFFFFF",
    positiveBgColor: theme.bar,
    positivestrokeColor: theme.bar,
    itemCount: 7,
});

change_list(ui.level_pick, ["当前/上次", "1-7", "龙门币-6/5", "红票", "经验-6/5", "术/狙芯片", "术/狙芯片组", "先/辅芯片", "先/辅芯片组", "近/特芯片", "近/特芯片组"]);
ui.level_pick.setBackground(createShape(5, 0, 0, [2, theme.bar]));
ui.level_pick.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
        setting.指定关卡 ? setting.指定关卡.levelAbbreviation = parent.getSelectedItem() : setting.指定关卡 = {
            levelAbbreviation: parent.getSelectedItem(),
        };
        tool.writeJSON("指定关卡", setting.指定关卡);
    }
}));
/*
ui.level_pick.click((view) => {

    BottomWheelPicker.setData(["当前/上次", "1-7", "龙门币-6/5", "红票", "经验-6/5", "术/狙芯片", "术/狙芯片组", "先/辅芯片", "先/辅芯片组", "近/特芯片", "近/特芯片组"])
        .show().then(result => {
            view.setText(result.text);
            setting.指定关卡 ? setting.指定关卡.levelAbbreviation = result.text : setting.指定关卡 = {
                levelAbbreviation: result.text,
            };
            tool.writeJSON("指定关卡", setting.指定关卡);

        });
})
*/
let popView,
    popWin,
    pop_textColor = "#ffffff",
    pop_textColor2 = "#95ffffff",
    pop_textColor3 = "#75ffffff",
    pop_textColor_mainly = "#00bfff", //"#0d84ff",
    pop_textColor_warn = "#ff0000";

//右边栏
function initPop(modify) {
    //let pop_textColor  = colors.toString(colors.argb(255, colors.red(theme.bar) > 127 ? 0 : 255, colors.green(theme.bar)  > 127 ? 0 : 255, colors.blue(theme.bar)  > 127 ? 0 : 255));
    popView = ui.inflate(
        <vertical>
            {/* <img  src="file://./res/youlan.png" h="330" radiusBottomLeft="0dp" radiusBottomRight="0dp" scaleType="fitXY"/>
            */}
            <card w="*" h="auto" cardBackgroundColor="{{theme.bar}}" margin="10 8"
                cardCornerRadius="10dp" cardElevation="0" foreground="?selectableItemBackground" >
                <vertical >
                    <horizontal id="binding_error" gravity="center" margin="0 10"
                        layout_width="fill_parent" layout_height="wrap_content" padding="65dp 15dp">

                        <img layout_width="55dip" layout_height="55dip"
                            src="file://./res/moriku.png" scaleType="fitCenter" />
                        <text textSize="20sp" id="tv_error_message" textColor="red"
                            layout_marginLeft="15dip" text="未登录...     " />

                    </horizontal>
                    <vertical id="binding_game_info" visibility="gone" >

                        <TableRow layout_width="match_parent" layout_height="match_parent">

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">

                                <text id="text_info_channelName" text="官服"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp"
                                    layout_marginTop="5dp" textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_info_nickName" text="梦月時謌#8300"
                                    w="auto" layout_height="wrap_content" lines="1"
                                    layout_gravity="bottom" layout_margin="5 0 0 5" textSize="15dp" ellipsize="marquee"
                                    textColor="{{pop_textColor2}}" textStyle="bold" >

                                </text>

                            </card>

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">


                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp"
                                    layout_marginTop="5dp" text="理智"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_ap_status" w="auto" layout_height="wrap_content" lines="1"
                                    layout_gravity="bottom" layout_margin="5 0 0 5" textSize="15dp" ellipsize="marquee"
                                    focusableInTouchMode="true" textIsSelectable="true"
                                    text="将在明天12:00完全恢复" textColor="{{pop_textColor2}}" textStyle="bold" >

                                </text>
                                <text
                                    id="text_ap" text='120/135' marginRight="5dp" marginBottom="8dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />
                            </card>

                        </TableRow>

                        {/**公招 */}
                        <TableRow layout_width="match_parent" layout_height="match_parent">


                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">

                                <text layout_width="wrap_content" layout_height="wrap_content"
                                    layout_marginStart="5dp" layout_marginTop="5dp"
                                    text="公开招募" textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_recruit_status" layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="bottom" layout_margin="5 0 0 5"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />


                                <text id="text_recruit_ts" text="0/4" layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="center|right" textColor="{{pop_textColor}}" textSize="15sp" />
                            </card>

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">


                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp"
                                    layout_marginTop="5dp" text="公招刷新"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_hire_status" layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="bottom" layout_margin="5 0 0 5"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />


                                <text
                                    id="text_hire" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor_mainly}}" textSize="30sp" />
                            </card>

                        </TableRow>
                        {/**训练室 线索 */}
                        <TableRow layout_width="match_parent" layout_height="match_parent">

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">

                                <text
                                    layout_width="wrap_content"
                                    layout_height="wrap_content"
                                    layout_marginStart="5dp"
                                    layout_marginTop="5dp"
                                    text="训练室"
                                    textColor="{{pop_textColor2}}"
                                    textStyle="bold" />

                                <text
                                    id="text_train_status" layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="bottom" layout_margin="5 0 0 5"
                                    text="暂无专精" textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text id="text_trainer" text="暂无干员"
                                    layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="center|right"
                                    textColor="{{pop_textColor_mainly}}" textSize="16sp" textStyle="bold" />

                            </card>

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">


                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp"
                                    layout_marginTop="5dp" text="线索搜集"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_clue_status" layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="bottom" layout_margin="5 0 0 5"
                                    text="搜集中" textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_clue" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />
                            </card>


                        </TableRow>

                        {/**制造站 贸易站  */}
                        <TableRow layout_width="match_parent" layout_height="match_parent">

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">

                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp"
                                    layout_marginTop="5dp" text="制造站"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_manufactures_status" layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="bottom" layout_margin="5 0 0 5"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_manufactures" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />

                            </card>

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">


                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp"
                                    layout_marginTop="5dp" text="贸易站"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_trading_status" layout_width="wrap_content" layout_height="wrap_content"
                                    layout_gravity="bottom" layout_margin="5 0 0 5"
                                    textColor="{{pop_textColor2}}" textStyle="bold" />

                                <text
                                    id="text_trading" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />
                            </card>

                        </TableRow>
                        {/**休息  疲劳  */}
                        <TableRow layout_width="match_parent" layout_height="match_parent">

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">

                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp" text="休息进度"
                                    textColor="{{pop_textColor2}}" textStyle="bold" layout_gravity="center|left" />

                                <text
                                    id="text_dormitories" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />

                            </card>

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">


                                <text text="干员疲劳"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp"
                                    textColor="{{pop_textColor2}}" textStyle="bold" layout_gravity="center|left" />


                                <text id="text_tired" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor_warn}}" textSize="20sp" />
                            </card>

                        </TableRow>
                        {/**无人机 剿灭  */}
                        <TableRow layout_width="match_parent" layout_height="match_parent">

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">

                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp" text="无人机"
                                    textColor="{{pop_textColor2}}" textStyle="bold" layout_gravity="center|left" />

                                <text
                                    id="text_labor" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />

                            </card>

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">


                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp" text="剿灭"
                                    textColor="{{pop_textColor2}}" textStyle="bold" layout_gravity="center|left" />

                                <text
                                    id="text_campaign" marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor_warn}}" />
                            </card>

                        </TableRow>
                        {/**日常 周常  */}
                        <TableRow layout_width="match_parent" layout_height="match_parent">

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">

                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp" text="日常"
                                    textColor="{{pop_textColor2}}" textStyle="bold" layout_gravity="center|left" />

                                <text
                                    id="text_routineDay" text='0/10' marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />

                            </card>

                            <card layout_width="0dp" layout_height="50dp" layout_margin="5dp" layout_weight="1" cardElevation="0" cardBackgroundColor="#00000000">


                                <text
                                    layout_width="wrap_content" layout_height="wrap_content" layout_marginStart="5dp" text="周常"
                                    textColor="{{pop_textColor2}}" textStyle="bold" layout_gravity="center|left" />

                                <text
                                    id="text_routineWeek" text='0/13' marginRight="5dp"
                                    layout_width="wrap_content" layout_height="wrap_content" layout_gravity="center|right"
                                    textColor="{{pop_textColor}}" />
                            </card>

                        </TableRow>

                        <list id="gz_list">
                            <card w="*" h="auto" margin="10 8 10 4" cardBackgroundColor="#ff8c9099"
                                cardCornerRadius="10dp" cardElevation="0"  >

                                <linear >
                                    <vertical gravity="left" padding="5 0 0 0" layout_weight="1" >
                                        <linear w="auto">
                                            <text text="公招 {{this.位置}}   " w="auto" textSize="18" textColor="#ffffff" textStyle="bold" />
                                            <text id="gongzhao" text="{{this.时间}}" textSize="12" textColor="#95ffffff" />
                                        </linear>
                                        <text id="tag_" text="{{this.tag}}" textSize="12" w="auto" textColor="#95ffffff" layout_gravity="right" marginRight="10" />
                                    </vertical>
                                    <vertical id="shanchu" layout_gravity="center"  >
                                        <img src="@drawable/ic_delete_black_48dp" tint="#ffffff" w="28" h="28" margin="2 0" />
                                    </vertical>
                                </linear>
                            </card>
                        </list>

                    </vertical>



                    <horizontal gravity="center">
                        {/**把布局左边占满,让剩下的布局靠右*/}
                        <linear layout_width="0dp"
                            layout_weight="1">
                        </linear>
                        {/**   <card id="manually_correction" w="auto" h="auto" margin="5 5"
                            cardCornerRadius="5dp" cardElevation="0" foreground="?selectableItemBackground" cardBackgroundColor="#00000000">

                            <img src="@drawable/ic_create_black_48dp" w="30" h="30" tint="#ffffff" />
                        </card>
                        */}
                        <card id="morikujima_refresh_view" w="auto" h="auto" margin="5 5"
                            cardCornerRadius="5dp" cardElevation="0" foreground="?selectableItemBackground" cardBackgroundColor="#00000000">
                            <img src="file://./res/ic_refresh.webp" w="25" h="25" tint="#ffffff" />
                        </card>

                        <card id="morikujima_login_view" w="auto" h="auto" margin="5 5"
                            cardCornerRadius="5dp" cardElevation="0" foreground="?selectableItemBackground" cardBackgroundColor="#00000000">
                            <img src="file://./res/q9.png" w="30" h="30" tint="#ffffff" />
                        </card>
                        <card id="morikujima_setting_view" w="auto" h="auto" margin="5 5"
                            cardCornerRadius="5dp" cardElevation="0" foreground="?selectableItemBackground" cardBackgroundColor="#00000000">
                            <img src="@drawable/ic_settings_applications_black_48dp" w="30" h="30" tint="#ffffff" />
                        </card>

                    </horizontal>
                </vertical >
            </card>
        </vertical>
    )

    //设置view,宽度,高度
    popWin = new android.widget.PopupWindow(popView);
    /*  let is = new android.transition.Slide(android.view.Gravity.TOP)
      is.setDuration(250)
      popWin.setEnterTransition(is)
      let os = new android.transition.Slide(android.view.Gravity.TOP)
      os.setDuration(250)
      os.setMode(android.transition.Visibility.MODE_OUT)
      popWin.setExitTransition(os)
      */
    //popWin.width = ViewGroup.LayoutParams.WRAP_CONTENT
    //  popWin.height = ViewGroup.LayoutParams.WRAP_CONTENT
    popWin.getContentView().measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);

    popWin.setHeight(-2);
    popWin.setWidth(popWin.getContentView().getMeasuredWidth());
    //触摸外部关闭view
    popWin.setOutsideTouchable(true)
    //设置view焦点
    popWin.setFocusable(true)
    let moriku = require("./subview/森空岛token.js");
    let binding_info = moriku.get_binding_info();
    let GameInfo;

    ui.selectTime.click(() => {
        //    popWin.showAtLocation(ui.selectTime, Gravity.TOP, 200, 0);
        binding_info = moriku.get_binding_info();
        if (!GameInfo && binding_info && binding_info.token) {
            refresh_info()
        } else if (binding_info && binding_info.token) {

            init_binding_game_info(morikujima_setting)
        }
        popWin.showAsDropDown(ui.selectTime);
        // sense_tips()
    });
    function refresh_info() {
        popView.binding_error.setVisibility(0);
        popView.binding_game_info.setVisibility(8);
        popView.tv_error_message.setText("获取数据中");
        threads.start(function () {
            binding_info = moriku.get_binding_info()
            moriku.game_info(binding_info.token)
                .then((value) => {
                    init_binding_game_info(value);
                    for (let i in value) {
                        //  console.info(morikujima_setting.hasOwnProperty(i))
                        // if (!morikujima_setting.hasOwnProperty(i)) {
                        morikujima_setting[i] = value[i];
                        //  }
                    }
                    tool.putString("morikujima_setting", morikujima_setting, "morikujima_setting");
                    morikujima_setting = tool.readJSON("morikujima_setting");
                })
                .catch((error) => {
                    if (typeof error == "object") {
                        error = error.toString().replace(",", "\n");
                    }
                    ui.run(() => {

                        popView.tv_error_message.setText(error);
                        if (morikujima_setting.ap) {
                            snakebar("从森空岛获取数据失败:" + error + "\n使用上一次记录的数据,不保证准确")
                            GameInfo = tool.readJSON("morikujima_setting");
                            init_binding_game_info(GameInfo);
                        } else {
                            GameInfo = false;

                        }
                        //  popView.tv_error_message.attr("textSize","15")
                    })

                })

            //  console.trace(morikujima_setting)
        });
    }
    function init_binding_game_info(GameInfo) {

        if (!GameInfo.ap) {
            console.trace(GameInfo)
            log(binding_info)
            return
        }
        ui.run(() => {
            popView.binding_error.setVisibility(8);
            popView.binding_game_info.setVisibility(0);

            popView.text_info_channelName.setText(binding_info.channelName);
            popView.text_info_nickName.setText(binding_info.nickName);
            setTextMarquee(popView.text_info_nickName);

            let ap_current;
            if (GameInfo.ap.completeRecoveryTime == -1) {
                ap_current = GameInfo.ap.current;
            } else if (GameInfo.ap.completeRecoveryTime < GameInfo.ap.currentTs) {
                ap_current = GameInfo.ap.max;
            } else {
                ap_current = Math.floor((GameInfo.ap.currentTs - GameInfo.ap.lastApAddTime) / (60 * 6)) + GameInfo.ap.current;
            }

            let time = GameInfo.ap.completeRecoveryTime - GameInfo.ap.currentTs;
            popView.text_ap.setText(Htmltext([ap_current, "/" + GameInfo.ap.max]));
            if (time <= 0) {
                popView.text_ap_status.setText("博士，现在还不能休息哦");
            } else {
                popView.text_ap_status.setText(convertSec2DayHourMin(time));
            }

            setTextMarquee(popView.text_ap_status);

            //公招.刷新次数


            popView.text_recruit_ts.setText(Htmltext([GameInfo.recruit.value.toString(), "/" + GameInfo.recruit.max.toString()]));
            time = GameInfo.recruit.time;
            if (time < 0) {
                popView.text_recruit_status.setText("招募已完成");
            } else {
                popView.text_recruit_status.setText(convertSec2DayHourMin(time));
            }

            popView.text_hire.setText(GameInfo.hire.value.toString());

            time = GameInfo.hire.time;
            if (time < 0) {
                popView.text_hire_status.setText("刷新已就绪");
            } else {
                popView.text_hire_status.setText(convertSec2DayHourMin(time));
            }
            if (GameInfo.train.isNull) {
                popView.text_trainer.setText("暂无数据");
                popView.text_train_status.setText("");
            } else {
                if (GameInfo.train.traineeIsNull) {
                    popView.text_trainer.setText("空闲中");
                    popView.text_train_status.setText("空闲中");
                } else {
                    popView.text_trainer.setText(GameInfo.train.trainee.toString());
                    if (GameInfo.train.status == -1) {
                        popView.text_train_status.setText("空闲中");
                    } else {
                        time = GameInfo.train.time;
                        if (time == 0) {
                            popView.text_train_status.setText("专精完成");
                        } else {
                            popView.text_train_status.setText(convertSec2DayHourMin(time));
                        }
                    }
                }
            }

            //线索,meeting.clue
            popView.text_clue.setText(Htmltext([GameInfo.meeting.value, "/7"]));
            popView.text_clue_status.setText(GameInfo.meeting.isNull ? "暂无数据" : GameInfo.meeting.status.toString());

            //manufacture 贸易站
            popView.text_manufactures_status.setText(GameInfo.manufactures.isNull ? "暂无数据" : GameInfo.manufactures.status.toString());
            popView.text_manufactures.setText(GameInfo.manufactures.isNull ? "暂无数据" : Htmltext({
                text1: { text: GameInfo.manufactures.value, size: 2 },
                text2: { text: "/" + GameInfo.manufactures.maxValue }
            }));
            //trading 制造站
            popView.text_trading_status.setText(GameInfo.trading.isNull ? "暂无数据" : GameInfo.trading.status.toString());
            popView.text_trading.setText(GameInfo.trading.isNull ? "暂无数据" : Htmltext({
                text1: { text: GameInfo.trading.value, size: 2 },
                text2: { text: "/" + GameInfo.trading.maxValue }
            }));

            //休息
            popView.text_dormitories.setText(GameInfo.dormitories.isNull ? "暂无数据" : Htmltext({
                text1: { text: GameInfo.dormitories.value, size: 2 },
                text2: { text: "/" + GameInfo.dormitories.maxValue }
            }));
            //干员疲劳
            popView.text_tired.setText(GameInfo.tired.value.toString());
            //无人机
            popView.text_labor.setText(GameInfo.labor.isNull ? "暂无数据" : Htmltext({
                text1: { text: GameInfo.labor.value, size: 1 },
                text2: { text: "/" + GameInfo.labor.maxValue }
            }));
            //剿灭
            popView.text_campaign.setText(GameInfo.campaign.isNull ? "暂无数据" : Htmltext({
                text1: { text: GameInfo.campaign.current, size: 1 },
                text2: { text: "/" + GameInfo.campaign.total }
            }));
            //日常
            popView.text_routineDay.setText(GameInfo.routineDay.isNull ? "暂无数据" : Htmltext({
                text1: { text: GameInfo.routineDay.current, size: 3 },
                text2: { text: "/" + GameInfo.routineDay.total }
            }));

            popView.text_routineWeek.setText(GameInfo.routineWeek.isNull ? "暂无数据" : Htmltext({
                text1: { text: GameInfo.routineWeek.current, size: 3 },
                text2: { text: "/" + GameInfo.routineWeek.total }
            }));
        })
    }

    function moriku_input_mode() {
        moriku.input_mode(function () {
            let usr_token;
            threads.start(function () {
                ui.run(() => {
                    web_set.computer = true;
                    let webview = $ui.findView("webview");
                    webview.getSettings().setUserAgentString("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36");
                    webview.loadUrl("https://www.skland.com");
                    popWin.dismiss();
                    ui.viewpager.setCurrentItem(2);
                    webview.scrollBy(1024, 0);
                    toastLog("请在此界面登录森空岛")
                    //   let pollCred = setInterval(function () {

                    // 创建自定义的WebViewBridge，实现js交互
                    let webViewBridge = new WebViewBridge(new BridgeHandler({
                        exec: function (params) {
                            log('bridge handler exec: ' + params)
                            if (params) {
                                usr_token = JSON.parse(params);
                                clearInterval(pollCred);
                            }

                        }
                    }));
                    // 注册bridge
                    webview.addJavascriptInterface(webViewBridge, 'nativeWebviewBridge');

                    let token = files.read("./lib/prototype/morikujima_gettoken.txt")
                    let pollCred = setInterval(function () {
                        webview.loadUrl("javascript:" + token.toString() + "token();")
                    }, 1000);
                })


            });

            while (!usr_token) {
                sleep(500);
            }

            return usr_token;
        });
    }
    /*
        popView.manually_correction.click(() => {
            require("./subview/reason.js").lzview(function (text, text2) {
                if (text2 == "get") {
                    switch (text) {
                        case "上限":
                            morikujima_setting = tool.readJSON("morikujima_setting");
                            return morikujima_setting.理智数.split("/")[1];
                    }
                }
                tool.writeJSON(text, text2, "morikujima_setting");
                if (text == "理智数") {
                    let c = new Date();
                    tool.writeJSON("理智时间", c, "morikujima_setting")
                    sense_tips();
                    ui.text_ap.setText(morikujima_setting.理智数)
                    popView.text_ap.setText(morikujima_setting.理智数)
                }
    
            })
        })
      */
    popView.morikujima_refresh_view.click((view) => {
        refresh_info();
    });
    popView.morikujima_setting_view.click((view) => {
        require("./subview/reason.js").ssbjview(function (text, text2) {
            if (text2 == "get") {
                morikujima_setting = tool.readJSON("morikujima_setting");
                switch (text) {
                    case "token":
                        moriku_input_mode();
                        binding_info = moriku.get_binding_info();
                        return binding_info ? binding_info.nickName + '|' + binding_info.channelName : "未登录";
                    case "用户名":
                        return (binding_info && binding_info.token) ? binding_info.nickName + '|' + binding_info.channelName : "未登录";
                    case "自动签到":
                        return morikujima_setting.自动签到 ? true : false;
                    case "通知":
                        return morikujima_setting.通知;

                }
                return
            }

            switch (text) {

                case "自动签到":
                    //tool.writeJSON("自动签到", text2, "morikujima_setting")

                    break
                case "通知":
                    if (text2) {

                        if (!tool.script_locate("rational_notice.js")) {
                            let execution = engines.all();
                            for (let i = 0; i < execution.length; i++) {
                                if (execution[i].getSource().toString().indexOf("rational_notice") > -1) {
                                    console.verbose("已停止运行同名脚本")
                                    execution[i].forceStop();
                                }
                            }
                            engines.execScriptFile("./lib/rational_notice.js")
                        }
                    } else {
                        let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
                        manager.cancel(0);
                        if (manager = tool.script_locate("rational_notice.js")) {
                            manager.forceStop()
                        }
                    }
                    break
            }
            morikujima_setting = tool.writeJSON(text, text2, "morikujima_setting");


        })
    })
    popView.morikujima_login_view.on("click", function () {
        moriku_input_mode();
    });
    popView.tv_error_message.on("click", function () {
        moriku_input_mode();
    });
    popView.gz_list.on("item_click", function (itemView, i) {
        let delete_timing = dialogs.build({
            type: "app",
            title: "\n确定公招" + itemView.位置 + "已完成招募？\n确定要移除此公招信息？",
            positive: "确认",
            negative: "取消"
        }).on("positive", () => {
            morikujima_setting.gz_list.splice(i, 1);
            tool.writeJSON("gz_list", morikujima_setting.gz_list, "morikujima_setting");
            sense_tips()
        })
        tool.setBackgroundRoundRounded(delete_timing.getWindow())
        delete_timing.show();

    });

    if (morikujima_setting.通知) {
        ui.post(() => {
            if (tool.script_locate("rational_notice.js") == false) {
                let execution = engines.all();
                for (let i = 0; i < execution.length; i++) {
                    let exec = execution[i].getSource()
                    if (exec && exec.toString().indexOf("rational_notice") > -1) {
                        console.verbose("已停止运行同名脚本")
                        execution[i].forceStop();
                    }
                }
                engines.execScriptFile("./lib/rational_notice.js")
            }
        }, 3000);
    }
    if (morikujima_setting.自动签到) {
        ui.post(() => {
            moriku.sign();
        }, 3000);
    }


    /* function sense_tips() {
         morikujima_setting = tool.readJSON("morikujima_setting");
         let text_ap = morikujima_setting.理智数.split("/");
         text_ap[0] = Number(text_ap[0]);
         text_ap[1] = Number(text_ap[1]);
         text_ap[2] = Number(morikujima_setting.已有理智);
 
         if ((text_ap[1] - text_ap[0]) <= 0) {
             popView.text_ap_status.setText("博士，现在还不能休息哦");
             setTextMarquee(popView.text_ap_status)
 
 
         } else {
 
             text_ap = text_ap[1] - text_ap[2];
             text_ap = text_ap * 6;
 
             let time = new Date(morikujima_setting.理智时间);
             time = new Date(time.setMinutes(time.getMinutes() + text_ap))
             popView.text_ap_status.setText("将在" + ((time.getDate() == new Date().getDate() && time.getMonth() == new Date().getMonth()) ? "今天 " : "明天 ") +
                 time.getHours() + ":" + time.getMinutes() + "左右完全恢复");
         }
         if (morikujima_setting.公招) {
             if (morikujima_setting.gz_list.length == undefined) {
                 return
             }
             for (i in morikujima_setting.gz_list) {
                 let time2 = new Date(new Date(morikujima_setting.gz_list[i].时间).getTime() + morikujima_setting.gz_list[i].小时 * 60 * 60 * 1000);
 
                 if (new Date() >= time2) {
                     morikujima_setting.gz_list[i].时间 = "已完成招募";
                 } else {
                     morikujima_setting.gz_list[i].时间 = ((time2.getDate() == new Date().getDate() && time2.getMonth() == new Date().getMonth()) ? "今天 " : "明天 ") + time2.getHours() + ":" + time2.getMinutes() + "分完成";
                 }
             }
 
         }
         popView.gz_list.setDataSource(morikujima_setting.公招 ? morikujima_setting.gz_list : []);
 
         //    popView.tv_text.setSelected(true);
     }
     */

    /*
    if(morikujima_setting.公招){
        if(morikujima_setting.gz_list.length==undefined){
            return
        }
        for(i in morikujima_setting.gz_list){
            let time2 = new Date(new Date(morikujima_setting.gz_list[i].时间).getTime() + morikujima_setting.gz_list[i].小时 * 60 * 60 * 1000);

          if(new Date()>=time2){
                morikujima_setting.gz_list[i].时间="已完成招募";
            }else{
            morikujima_setting.gz_list[i].时间=((time2.getDate() == new Date().getDate() && time2.getMonth() == new Date().getMonth()) ? "今天 " : "明天 ") +time2.getHours() + ":" + time2.getMinutes() + "分";
            }
        }
            popView.gz_list.setDataSource(morikujima_setting.gz_list);
        
    }
    

*/
}
/**
  * 生成HTML文本,支持同一个textview显示文本不同颜色,大小
  * @param {Object | Array} list 
  * @returns 
  */
function Htmltext(list) {
    if (Object.prototype.toString.call(list) == "[object Array]") {
        list = {
            text1: {
                text: list[0],
            },
            text2: {
                text: list[1],
            }
        };
    }
    if (!list) {
        list = {
            text1: {
            },
            text2: {
            }
        };
    }

    list = {
        text1: {
            text: list.text1.text,
            textColor: list.text1.textColor || pop_textColor_mainly,
            size: list.text1.size || 3,
            textSize: list.text1.textSize || "15sp",
        },
        text2: {
            text: list.text2.text,
            textColor: list.text2.textColor,
            size: list.text2.size || 0,
            textSize: list.text2.textSize || "15sp",
        }
    }
    let str1 = ""

    if (list.text1.textColor) {
        str1 = " <font color= " + list.text1.textColor + ">"
    } else {
        str1 = " <font"
    }
    for (let i = 0; i < list.text1.size; i++) {
        str1 += "<big>"
    }
    str1 += list.text1.text;
    for (let i = 0; i < list.text1.size; i++) {
        str1 += "</big>"
    }
    str1 += "</font>"

    if (!list.text2.textColor && !list.text2.size) {
        str1 += list.text2.text;
    } else {
        if (list.text2.textColor) {
            str1 = " <font color= " + list.text2.textColor + ">"
        } else {
            str1 = " <font"
        }
        for (let i = 0; i < list.text2.size; i++) {
            str1 += "<big>"
        }
        str1 += list.text2.text;
        for (let i = 0; i < list.text2.size; i++) {
            str1 += "</big>"
        }
        str1 += "</font>"
    }
    //  log(str1)
    return Html.fromHtml(str1)

}
function convertSec2DayHourMin(Sec) {


    // 获取当前时间戳
    //let currentTime = Math.floor(Date.now() / 1000);

    let str = "";
    let min = Math.floor(Sec / 60);
    let hour = Math.floor(min / 60);
    let day = Math.floor(hour / 24);

    let cnt = 0;
    if (Sec <= 0) "-1分钟";
    if (day > 0) {
        str = str + day + "天";
        hour = hour % 24;
        cnt++;
    }
    if (hour > 0) {
        str = str + hour + "小时";
        min = min % 60;
        cnt++;
    } else {
        str = str + "00小时";
        min = min % 60;
        cnt++;
    }


    if (cnt < 2) {
        str = str + min + "分";
    }

    return str;

}
function setTextMarquee(textView) {

    if (textView != null) {
        textView.setSingleLine(true);
        textView.setEllipsize(TextUtils.TruncateAt.MARQUEE);
        textView.setSelected(true);
        textView.setFocusable(true);
        textView.setFocusableInTouchMode(true);
    }
}
ui.viewpager.setCurrentItem(web_set.homepage)


let animation_viewpager = false;

ui.viewpager.setPageTransformer(true, new MyPageTransform()); //设置viewpager切换动画
// ui.viewpager.setPageTransformer(false, new MyPageTransform()); //设置viewpager切换动画

ui.viewpager.overScrollMode = View.OVER_SCROLL_NEVER; //删除滑动到底的阴影
// viewpager序号从0开始

ui.viewpager.setOnPageChangeListener({

    onPageScrolled: function (position) {
        animation_viewpager = ui.viewpager.getCurrentItem() + position;
    },
    onPageSelected: function (index) {
        ui.run(() => {
            switch (index) {
                case 0:
                    if (!gallery.gallery_info) {
                        items[1].text = "检查图库";
                        items[1].drawable = "@drawable/ic_wallpaper_black_48dp";
                        ui.drawerList.setDataSource(items);
                    } else {
                        items[1].text = "更换图库";
                        items[1].drawable = "@drawable/ic_satellite_black_48dp";
                        ui.drawerList.setDataSource(items);
                    }

                    ui.drawer_.setAlpha(10);

                    break
                case 1:
                    setting = tool.readJSON("configure")
                    if (setting.行动理智) {
                        ui.xlkz.attr("visibility", "visible");
                    } else {
                        ui.xlkz.attr("visibility", "gone");
                    }
                    if (setting.换班路径.length >= 5) {
                        ui.jjhb.attr("visibility", "visible");
                    } else {
                        ui.jjhb.attr("visibility", "gone");
                    }

                    if (gallery.gallery_info) {
                        if (setting.custom.length >= 6 && ui.implement.getCount() == 5) {
                            change_list(ui.implement, modeGatherText);
                        } else if (setting.custom == false && ui.implement.getCount() == 6) {
                            change_list(ui.implement, modeGatherText);
                        }
                    }
                    mod_data = sto_mod.get("modular", []);
                    if (mod_data[0] != undefined) {
                        ui.module_config.attr("visibility", "visible")
                    }
                    break

                case 2:
                    //      SystemUiVisibility()

                    // ui.statusBarColor("#DC143C");

                    // activity.getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
                    // SystemUiVisibility(true)
                    break
                default:
                    // SystemUiVisibility(index ? false : true);
                    break
            }
        })
    },
});


ui.icons.setDataSource(web_set.web_icon);

var label_plug = require("./subview/label_plug.js");
var web_set_plug = require("./subview/web_set_plug.js");

ui.icons.on("item_click", function (icon, i, itemView, listView) {
    switch (i) {
        case 0:
            ui.run(() => {
                ui.webview.goBack();
            });

            break
        case 1:
            if (itemView.icon_.attr("src") == web_set.web_icon[1].icon) {
                ui.webview.goForward();
            } else if (ui.viewpager.getNoScroll()) {
                toast("禁止滑动webview界面")
                ui.viewpager.setNoScroll(false)
            } else {
                toast("允许滑动webview界面")
                ui.viewpager.setNoScroll(true)
            }

            break
        case 2:
            ui.webview.loadUrl(web_set.web_url)
            // ui.webview.reload();

            break
        case 4:
            web_set_plug.web_set_plug(function (title, get_s) {

                switch (title) {
                    case "书签":
                        label_plug.label_plug(function (url) {
                            ui.run(() => {
                                ui.webview.loadUrl(url);
                            })
                        })
                        break
                    case "添加书签":
                        function isURL(domain) {
                            let name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
                            //no：null
                            return domain.match(name)[0]
                        }
                        let list_icon = ui.webview.url
                        if (list_icon.startsWith("https")) {
                            list_icon = "https://" + isURL(list_icon) + "/favicon.ico";
                        } else if (list_icon.startsWith("http")) {
                            list_icon = "http://" + isURL(list_icon) + "/favicon.ico";
                        }

                        let label_list = {
                            title: ui.webview.getTitle().toString(),
                            url: ui.webview.url.toString(),
                            icon: list_icon,
                        }
                        label_plug.add_label(label_list, "添加")

                        break
                    case "刷新":
                        ui.webview.reload()
                        break;
                    case "分享":
                        let Tw = ui.webview.getTitle();
                        let context = String(Tw) + "：\n" + ui.webview.url
                        app.startActivity({
                            action: "android.intent.action.SEND",
                            type: "text/*",
                            extras: {
                                "android.intent.extra.TEXT": context
                            }
                        });
                        break
                    case "锁定":
                        if (get_s) {
                            return ui.viewpager.getNoScroll();
                        }
                        if (ui.viewpager.getNoScroll()) {
                            toast("锁定webview界面")
                            ui.viewpager.setNoScroll(false)
                        } else {
                            toast("解锁")
                            ui.viewpager.setNoScroll(true)
                        }
                        break
                    case "无图模式":
                        let websett_img = ui.webview.getSettings()
                        if (get_s) {
                            return websett_img.getLoadsImagesAutomatically();
                        }
                        websett_img.getLoadsImagesAutomatically() ? websett_img.setLoadsImagesAutomatically(false) : websett_img.setLoadsImagesAutomatically(true)
                        ui.post(() => {
                            ui.webview.reload()
                        }, 50)
                        break
                    case "设置UA":
                        if (get_s == true) {
                            return ui.webview.settings.getUserAgentString()
                        }
                        let websett_ua = ui.webview.getSettings()
                        websett_ua.setUserAgentString(get_s);
                        web_set.web_ua = get_s;
                        storages.create("configure").put("web_set", web_set)
                        ui.post(() => {
                            ui.webview.reload();
                        }, 100)
                        break
                    case "电脑模式":

                        // if( web_set.computer = true)
                        if (ui.webview.settings.getUserAgentString().indexOf("Windows") == -1) {
                            if (get_s) {
                                return false
                            }
                            web_set.computer = true;
                            web_set.web_ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";
                        } else {
                            if (get_s) {
                                return true
                            }
                            web_set.computer = false;
                            web_set.web_ua = "";
                        }

                        let websett_ua2 = ui.webview.getSettings()
                        websett_ua2.setUserAgentString(web_set.web_ua);
                        storages.create("configure").put("web_set", web_set)
                        web_set = tool.readJSON("web_set");
                        ui.post(() => {
                            ui.webview.reload();
                        }, 100);
                        break
                    case "夜间模式":
                        if (get_s) {
                            return web_set.night_mode;
                        }
                        ui.run(function () {
                            if (web_set.night_mode) {
                                web_set.night_mode = false;
                                new_ui("day");
                            } else {
                                ui.webview.reload();
                                web_set.night_mode = true;
                                new_ui("night")
                            }
                            ui.webview.loadUrl(ui.webview.url)
                            storages.create("configure").put("web_set", web_set)
                        })
                        break
                    case "退出":
                        ui.finish();
                        break
                }
            })
            break
        case 3:
            label_plug.label_plug(function (url) {
                ui.run(() => {
                    ui.webview.loadUrl(url);
                })
            })
            break
    }
})

var items = [{
    text: "告使用者",
    drawable: "ic_pets_black_48dp",
},
{
    text: "更换图库",
    drawable: "ic_satellite_black_48dp",
},
{
    text: "官方频道",
    drawable: "ic_games_black_48dp",
},
{
    text: "问题帮助",
    drawable: "@drawable/ic_help_black_48dp",
},
{
    text: "捐赠打赏",
    drawable: "ic_favorite_black_48dp",
},
{
    text: "关于应用",
    drawable: "ic_account_circle_black_48dp",
},
{
    text: "运行日志",
    drawable: "ic_assignment_black_48dp",
},
{
    text: "模块仓库",
    drawable: "@drawable/ic_archive_black_48dp"
}
];

ui.drawerList.setDataSource(items);
ui.drawerList.overScrollMode = View.OVER_SCROLL_NEVER;
ui.drawerList.on("item_click", (item) => {
    //列表控件点击事件
    switch (item.text) {
        case "告使用者":
            notice();
            return
        case "检查图库":
        case "更换图库":
            if (typeof tukuss != "object") {
                http.get(server + "tulili/gallery_item.json", {
                    headers: {
                        'url_info': url_info,
                        'User-Agent': System.getProperty("http.agent")
                    }
                }, (res, err) => {
                    if (err || res['statusCode'] != 200) {
                        toast('请求云端图库列表信息出错' + res['statusMessage']);
                        console.error('请求云端图库列表信息出错' + res);
                    } else {
                        tukuss = JSON.parse(res.body.string());
                    }
                })

            }
            gallery.gallery_view();
            break;
        case "官方频道":
        case "加入q群":
            new_ui("q群/频道", jlink_mian.频道url);
            //    qq跳转频道(jlink_mian.频道url);
            break
        case "问题帮助":

            new_ui("浏览器", jlink_mian.疑惑解答);
            break
        case "运行日志":
            new_ui("日志");
            break
        case "捐赠打赏":
            let donationkey = require('./lib/java/crypto.dex')
            donationkey.donation("iVBORw0KGgoAAAANSUhEUgAA")
            break
        case "关于应用":
            new_ui("关于");
            break;
        case "模块仓库":
            engines.execScriptFile('./activity/Module_platform.js');
            break
    }
});

ui.icon.on("click", () => {
    new_ui("关于");
})
ui.icon_b.on("click", () => {
    ui.viewpager.currentItem = 0;
});
ui.homepage.on("click", () => {
    ui.post(() => {
        ui.viewpager.currentItem = 1;
    }, 100)
});
ui.settingsBtn.on("click", () => {
    new_ui("设置");
});


ui.analysis.on("click", () => {
    new_ui("浏览器", "https://arkgacha.kwer.top/");
});

ui.cnos.on("click", () => {
    toast("此菜单不知道放啥上去好，禁用中..")
    return
    if (ui.cnos_list.getVisibility() == 8) {
        ui.cnos.attr("leftDrawable", "@drawable/ic_healing_black_48dp");
        ui.cnos_list.setVisibility(0);
    } else {
        ui.cnos_list.setVisibility(8);
        ui.cnos.attr("leftDrawable", "ic_stars_black_48dp");
    }
})


ui.indt.on("click", function () {
    if (ui.timed_tasks_add.getVisibility() == 8) {
        ui.timed_tasks_add.attr("visibility", "visible");
        ui.timed_tasks_list.attr("visibility", "visible");
        ui.timetu.attr("tint", "#40a5f3");
        ui.down.attr("tint", "#40a5f3");
        ui.timetxt.setTextColor(colors.parseColor("#40a5f3"));
        ui.down.attr("src", "@drawable/ic_keyboard_arrow_up_black_48dp")
    } else {
        ui.timed_tasks_list.attr("visibility", "gone");
        ui.timed_tasks_add.attr("visibility", "gone");
        ui.timetu.attr("tint", theme.text);
        ui.down.attr("tint", theme.text);
        ui.timetxt.setTextColor(colors.parseColor(theme.text));
        ui.down.attr("src", "@drawable/ic_keyboard_arrow_down_black_48dp")
    }
})
var modeGather = {
    "指定关卡+基建": "常规",
    "只执行行动": "行动",
    "只执行基建": "基建",
    "执行剿灭作战+基建": "剿灭",
};
if (setting.custom != false) {
    modeGather["执行自定义模块"] = "自定义模块";
}
var modeGatherText = Object.keys(modeGather);
var SE执行 = ui.implement.getSelectedItemPosition();
ui.implement.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
    onItemSelected: function (parent, view, Executionsettings, id) {
        // let itext = parent.getSelectedItem()
        if (Executionsettings != SE执行) {
            if (Executionsettings != 2 && ui.jijianquyu.getVisibility() == 8) {
                ui.jijianquyu.setVisibility(0);
            } else if (Executionsettings != 3 && ui.xingdongquyu.getVisibility() == 8) {
                ui.xingdongquyu.setVisibility(0);
            }
            switch (Executionsettings) {
                case 0:
                    toast("你选择的是行动+基建，理智不足以支持下一把时，启动基建程序");
                    break;
                case 1:
                    tool.writeJSON("行动", "999");
                    ui.jijianquyu.setVisibility(8);
                    toast("你选择的是只执行行动，默认为999次，行动完成或理智不足以开下一把时直接暂停程序");
                    break;
                case 2:
                    toast("你选择的是只启动基建");
                    ui.xingdongquyu.setVisibility(8);
                    break;
                case 3:
                    toast("你选择的是剿灭行动，默认为5次，360×5=1800合成玉");
                    break;
                case 5:

                    switch (gallery.language) {
                        case "日服":
                        case "美服":
                            toast("当前方舟服务器不支持上一次作战");
                            Executionsettings = 0;
                            ui.implement.setSelection(Executionsettings);
                            break
                        default:
                            toast("你选择的是上一次作战，注意不能是剿灭，否则跳转基建程序");
                            break
                    }
                    break;
                case 4:

                    toastLog("自定义模式")
                    break;
            };
            tool.writeJSON("执行", modeGather[modeGatherText[Executionsettings]]);
            if (setting.行动理智) {
                if (Executionsettings == 4) {
                    ui.mr1.setText("剿灭上限:");
                    ui.input_extinguish.attr("visibility", "visible");
                    ui.input_ordinary.attr("visibility", "gone");
                } else {
                    ui.mr1.setText("刷图上限:");
                    ui.input_ordinary.attr("visibility", "visible");
                    ui.input_extinguish.attr("visibility", "gone");
                }
            }
            SE执行 = ui.implement.getSelectedItemPosition();
        }
    }
}));

//悬浮窗
ui.floatyCheckPermission.on("check", function (checked) {
    if (checked && floaty.checkPermission() == false) {
        try {
            app.startActivity({
                packageName: "com.android.settings",
                className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
                data: "package:" + context.getPackageName(),
            });
        } catch (err) {
            $floaty.requestPermission();
        }
    };

    if (!checked && floaty.checkPermission() == true) {
        toast("无效关闭，请到设置取消权限");
        ui.floatyCheckPermission.checked = true;
        try {
            app.startActivity({
                packageName: "com.android.settings",
                className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
                data: "package:" + context.getPackageName(),
            });
        } catch (err) {
            $floaty.requestPermission();
        }
    };
});

//无障碍
ui.autoService.on("click", (checked) => {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (ui.autoService.checked == true) {
        checked = true;
    } else {
        checked = false;
    }

    if (checked == true) {
        if (tool.autoService(true) == false) {
            ui.autoService.checked = false;
            if (!setting.ADB提醒) {
                dialogs.build({
                    type: "app-or-overlay",
                    title: "自启动无障碍提醒",
                    content: "请在接下来跳转的系统界面中打开 已下载服务/已安装的应用程序：明日计划的无障碍，不知道如何打开请百度或使用音量键快捷方式打开\n\n如需应用自动打开无障碍，请前往左边侧滑栏-左下角设置-自启动无障碍服务，点击了解)",
                    checkBoxPrompt: "不再提示",
                    positive: "我清楚了",
                    positiveColor: "#FF8C00",
                    canceledOnTouchOutside: false
                }).on("positive", () => {
                    app.startActivity({
                        action: "android.settings.ACCESSIBILITY_SETTINGS"
                    });
                }).on("check", (checked) => {
                    //监听勾选框
                    tool.writeJSON("ADB提醒", checked)
                }).show();
            } else {
                app.startActivity({
                    action: "android.settings.ACCESSIBILITY_SETTINGS"
                });
            }
        }
    } else {
        tool.autoService(false)

    }


});

ui.autoService.on("long_click", () => {
    app.startActivity({
        action: "android.settings.ACCESSIBILITY_SETTINGS"
    });
});

//无障碍&悬浮窗回弹
ui.emitter.on("resume", function () {
    let themes = storages.create('themes').get('theme')
    if (theme.bar != themes.bar) {
        ui.statusBarColor(themes.bar);
        ui.viewpager.attr("bg", themes.bar);
        theme.bar = themes.bar;
    }
    // 此时根据无障碍服务的开启情况，同步开关的状
    if (tool.autoService() == true) {

        ui.autoService.checked = true;
    } else {
        ui.autoService.checked = false;
    }

    if (floaty.checkPermission() == false) {
        ui.floatyCheckPermission.checked = false;
    }

    if (tool.script_locate("Floaty.js")) {
        ui.start.setText("停止运行")
    } else {
        //        ui.start.setText("开始运行");
    }

});

ui.only_medicament.on('check', (checked) => {
    tool.writeJSON("only_medicament", checked);
})

//企鹅物流数据统计
ui.qetj.on("check", (checked) => {
    if (checked) {
        ui.limitMaterial.setVisibility(0);
        if (ui.limitMaterial.checked) {
            ui.materialList.setVisibility(0);
        }
        tool.dialog_tips(ui.qetj.getText(), "*统计关卡掉落物信息！该功能会使用较多的运存，\n数据来源：企鹅物流数据统计，由于企鹅物流自身原因，请在使用本功能时关闭其它悬浮窗，否则识别出错。\n建议打开PRTS辅助记录汇报");
    } else {
        ui.limitMaterial.setVisibility(8);
        ui.materialList.setVisibility(8);
    }
    tool.writeJSON("企鹅统计", checked);
})

//prts记录汇报
ui.olrs.on("check", (checked) => {
    if (checked) {

        tool.dialog_tips(ui.olrs.getText(), "将替换掉悬浮窗上的快捷基建图标\n点击新的图标会显示PRTS辅助记录内容");
    }
    tool.writeJSON("作战汇报", checked);
})

var MaterialListC = JSON.parse(
    files.read("./lib/game_data/materialName.json", (encoding = "utf-8"))
),
    MaterialList = Object.keys(MaterialListC),
    AddItem,
    AddItemList = [],
    AddItemNum = 1,
    ImgPath = "file://./res/material/";
//  AddMaterialInitial();

//点击是否指定材料
ui.limitMaterial.on("click", (view) => {
    view = view.checked;
    setting = tool.readJSON("configure")
    if (view == true && setting.企鹅统计 == false) {
        dialogs.build({
            type: "app",
            title: "需要先启用企鹅物流数据统计，该功能会使用较多的运存，是否启用？",
            positive: "确认",
            negative: "取消"
        }).on("positive", () => {
            setting.企鹅统计 = true;
            tool.writeJSON("企鹅统计", true);
        }).on("dismiss", () => {
            if (view == true && setting.企鹅统计 == true) {
                tool.dialog_tips("材料统计", "记录任意一个材料获取足够数量后暂停，\n受刷图/行动、磕药/理智次数限制")
                tool.writeJSON("指定材料", view);
                view ? ui.materialList.setVisibility(0) : ui.materialList.setVisibility(8)
            } else {
                ui.limitMaterial.checked = false;
            }
        }).show()
        return
    } else {
        if (view) {
            tool.dialog_tips("材料统计", "记录任意一个材料获取足够数量后暂停，\n受刷图/行动、磕药/理智次数限制");
        }
        tool.writeJSON("指定材料", view);
        view ? ui.materialList.setVisibility(0) : ui.materialList.setVisibility(8)
    }

});

//添加材料
ui.addMaterial.click(function () {
    AddMaterial(ui.chooseMaterial.getSelectedItem());
});
ui.hideMaterial.click(function () {
    if (ui.addMaterialList.getChildCount() == 0) {
        snakebar("请先添加所需材料")
        return
    }
    let input = "{"
    for (let i = 0; i < ui.addMaterialList.getChildCount(); i++) {
        let name = ui.addMaterialList.getChildAt(i).getChildAt(1).getText();
        let number = ui.addMaterialList.getChildAt(i).getChildAt(2).getChildAt(0).getText()
        if (i != ui.addMaterialList.getChildCount() - 1) {
            input += '"' + name + '":[0,' + number + "],"
        } else {
            input += '"' + name + '":[0,' + number + "]"

        }
    }

    input = input + "}"

    Painting_planning(input)
})



//点击是否无人机加速
ui.uav_acceleration.on("check", (checked) => {
    tool.writeJSON("无人机加速", checked)
    if (checked) {
        ui.uav_acceleration_list.attr("visibility", "visible");
    } else {
        ui.uav_acceleration_list.attr("visibility", "gone");
    }
});
ui.manufacturing.on("check", (checked) => {
    tool.writeJSON("加速生产", checked);
});
ui.jjhb.on("check", (checked) => {
    tool.writeJSON("基建换班", checked);
});
ui.hyfw.on("check", (checked) => {
    tool.writeJSON("好友访问", checked)
});
ui.hkxs.on("check", (checked) => {
    tool.writeJSON("会客室线索", checked);
    ui.hks.setVisibility(checked ? 0 : 8)

});

ui.hks1.on("check", (checked) => {

    if (checked) {
        if (!files.exists("./mrfz/tuku/线索_传递.png")) {
            tool.dialog_tips("确认图库", "当前图库不完整,你的设备将无法正常使用明日计划-PRTS辅助的处理线索溢出功能\n请在左边侧滑栏-检查图库进行更换!")
            return;
        }


        if (gallery.language != "简中服") {

            ui.hks1.checked = false;
            toastLog("很抱歉，暂不支持OCR识别非简中服文字")
            return
        }
        if (!setting.ocrExtend) {
            ui.hks1.checked = false;
            snakebar(language['OCR-Extensions-need-installed'])
            return
        }
    }
    tool.writeJSON("处理线索溢出", checked)
})

ui.sqxy.on("check", (checked) => {
    checked ? ui.credit_buy.setVisibility(0) : ui.credit_buy.setVisibility(8);
    tool.writeJSON("收取信用", checked);
});

ui.credit_buy.on("click", (view) => {
    setting = tool.readJSON("configure");
    if (view.checked) {
        if (!files.exists("./mrfz/tuku/行动_普通.png")) {
            tool.dialog_tips("确认图库", "当前图库不完整,你的设备将无法正常使用明日计划-PRTS辅助功能\n请在左边侧滑栏-检查图库进行更换!")
            return;
        }

        if (gallery.language == "简中服") {
            if (!setting.ocrExtend) {
                view.checked = false;
                snakebar(language['OCR-Extensions-need-installed']);
                return
            }
            try {
                require("./subview/credit_buy.js")(setting.信用处理, function (words) {
                    tool.writeJSON("信用处理", words);

                }, function (id, items_) {
                    setSpinnerAdapter(id, items_)
                })
            } catch (e) {
                e = "加载信用处理方案设置出错:\n" + e
                console.error(e)
            }
        }
    }
    tool.writeJSON("信用处理", {
        "信用购买": checked,
        "优先顺序": setting.信用处理.优先顺序,
        "购买列表": setting.信用处理.购买列表,
        "三百信用": setting.信用处理.三百信用
    });
});

ui.gozh.on("click", (view) => {
    if (view.checked) {
        if (!files.exists("./mrfz/tuku/公招_确认.png")) {
            tool.dialog_tips("确认图库", "当前图库不完整,你的设备将无法正常使用明日计划-PRTS辅助的自动公开招募功能\n请在左边侧滑栏-检查图库进行更换!")
            return;
        }

        if (gallery.language == "简中服") {
            if (!setting.ocrExtend) {
                view.checked = false;
                snakebar(language['OCR-Extensions-need-installed']);
                ui.tag.setVisibility(8);
                return
            }

            ui.tag.setVisibility(0);
            tool.dialog_tips("mlkit ocr文字识别", "1• 自动公开招募和悬浮窗操控面板的公招识别是两个不同的功能\n\n" +
                "2• 自动公开招募仅会自动招募四星，弹窗提示五、六星\n\n" + "3•自动公招优先选择第一个公招词条框，如果正在招募中则会选择第二个，以此类推" +
                "\n\n4• 8小时无tag招募：无四星及以上的tag时，执行8小时无tag招募\n\n5• 聘用候选人：自动开包，建议配合8小时无tag招募使用。\n\n6• 公招词条必出五六星时会有弹窗提示，且禁用关闭应用模块\n\n7• 自动公招/识别 卡住，应用崩溃？请更换mlkit ocr 其它位数版本试试，关于应用-明日计划32位只能使用32位OCR插件");
        } else {
            view.checked = false;
            snakebar("很抱歉，暂不支持OCR识别非简中服文字")
            return
        }
    } else {
        ui.tag.setVisibility(8);
    }
    tool.writeJSON("公招", view.checked);
});

ui.tag1.on("check", (checked) => {
    tool.writeJSON("无tag招募", checked);
})
ui.tag2.on("check", (checked) => {
    tool.writeJSON("自动聘用", checked);
})

ui.rwjl.on("check", (checked) => {
    tool.writeJSON("任务奖励", checked)
})

ui.input_ordinary.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        输入框(ui.input_ordinary, ui.input_ordinary.text())
        event.consumed = true;
    }
});
ui.input_extinguish.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        输入框(ui.input_extinguish, ui.input_extinguish.text())
        event.consumed = true;
    }
});
/*
ui.searchiz.click(() => {
    输入框(ui.input_ordinary, ui.input_ordinary.text());
    输入框(ui.input_extinguish, ui.input_extinguish.text());
    输入框(ui.input_sane, ui.input_sane.text());

});
*/
ui.input_sane.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        输入框(ui.input_sane, ui.input_sane.text())
        event.consumed = true;
    }
});

var timed_tasks_list = timed_tasks_storage.get("items", []);
ui.timed_tasks_list.setDataSource(timed_tasks_list);

ui.timed_tasks_list.on("item_click", function (itemView, i) {
    let delete_timing = dialogs.build({
        type: "app",
        title: itemView.app + "\n确定要删除此定时任务吗？",
        positive: "确认",
        negative: "取消"
    }).on("positive", () => {
        log("删除定时任务，id=: " + itemView.id, timers.removeTimedTask(itemView.id));
        timed_tasks_list.splice(i, 1);
        timed_tasks_storage.put("items", timed_tasks_list);
    })
    tool.setBackgroundRoundRounded(delete_timing.getWindow())
    delete_timing.show();

});

ui.timed_tasks_add.on("click", function () {
    setting = tool.readJSON("configure");
    require("./subview/timed_tasks_set.js")(timed_tasks_list, function (parameter) {
        timed_tasks_storage.put("items", parameter);
    })

}) //定时任务添加事件

ui.module_config.on("click", function () {
    let mod = require("./subview/modular_list.js");
    mod.create_modular()

}) //模块配置事件

//开始运行
ui.start_run.on("click", function () {
    ui.run(() => {
        ui.start_run.attr("src", "#D3D3D3")
    })
    ui.post(() => {
        ui.start_run.attr("src", "#00000000")
    }, 150)
    ui.start_run.setEnabled(false);
    setTimeout(function () {
        ui.start_run.setEnabled(true);
    }, 600);

    if (floaty.checkPermission() == false) {
        snakebar("请先授予明日计划悬浮窗权限！");
        return;
    }
    if (ui.start.getText() == "停止运行" && !tool.script_locate("Floaty.js") == false) {
        tool.Floaty_emit("暂停", "关闭程序");
        ui.start.setText("开始运行");
        return;
    }

    if (auto.service == null) {
        if (tool.autoService() != true) {
            if (ui.autoService.checked == true) {
                tool.dialog_tips("温馨提示", "无障碍服务已启用但并未运行，您需要强行停止应用/重启无障碍服务/重启手机");
            }
            toast("无障碍服务异常！请长按无障碍服务按钮跳转设置检查是否正常开启！");
            console.error("无障碍服务异常！请检查是否正常开启！");
            return;
        };
    }
    try {
        currentActivity();
    } catch (er) {
        tool.dialog_tips("温馨提示", "无障碍服务已启用但并未运行，您需要强行停止应用/重启无障碍服务/重启手机");
        setTimeout(function () {

            toast("无障碍服务已启用但并未运行，您需要强行停止应用/重启无障碍服务/重启手机");
            console.error(er + "无障碍服务已启用但并未运行，这可能是安卓的BUG，您可能需要重启手机或强行停止应用/重启无障碍服务")
        }, 600);
        return
    }

    if (!files.exists("./mrfz/tuku/行动_普通.png")) {
        tool.dialog_tips("确认图库", "当前图库不完整,你的设备将无法正常使用明日计划-PRTS辅助功能\n请在左边侧滑栏-检查图库进行更换!")
        return;
    }
    setting = tool.readJSON("configure");
    if (setting.设置电量) {
        if (!device.isCharging() && device.getBattery() < setting.电量) {
            tool.dialog_tips("温馨提示", "电量低于设定值" + setting.电量 + "%且未充电");
            console.error("电量低于设定值" + setting.电量 + "%且未充电");
            if (setting.震动) {
                device.vibrate(1500);
            };
            return;
        };
    };

    let fg = app.getAppName("com.hypergryph.arknights");
    let fg1 = app.getAppName("com.hypergryph.arknights.bilibili");
    let fg2 = app.getAppName("tw.txwy.and.arknights")

    if (!tool.script_locate("Floaty.js")) {
        if (fg == null && fg2 == null) {
            tool.writeJSON("包名", "com.hypergryph.arknights.bilibili");
        } else if (fg1 == null && fg2 == null) {
            tool.writeJSON("包名", "com.hypergryph.arknights");
        } else if (fg == null && fg1 == null) {
            tool.writeJSON("包名", "tw.txwy.and.arknights");

        }
        if (setting.start == true || setting.执行 == "上次") {
            let appnameui = ui.inflate(
                <vertical padding="25 0">
                    <View bg="#000000" h="1" w="auto" />
                    <horizontal w="*" >
                        <button id="fg2" text="繁中服" visibility="visible" layout_weight="1" style="Widget.AppCompat.Button.Colored" h="auto" />
                        <button id="fg1" text="B服" visibility="visible" layout_weight="1" style="Widget.AppCompat.Button.Colored" h="auto" />
                        <button id="fg" text="简中服" visibility="visible" layout_weight="1" style="Widget.AppCompat.Button.Colored" h="auto" />
                    </horizontal>
                </vertical>, null, false);
            let appname = dialogs.build({
                type: 'app',
                customView: appnameui,
                title: "你有多个明日方舟！\n请选择启动其中一个",
                wrapInScrollView: false,
                autoDismiss: true
            });
            appnameui.fg.on("click", () => {
                tool.writeJSON("包名", "com.hypergryph.arknights");
                ui.run(() => {
                    appname.dismiss();
                })
                开始运行jk();
            });
            appnameui.fg1.on("click", () => {
                tool.writeJSON("包名", "com.hypergryph.arknights.bilibili");
                ui.run(() => {
                    appname.dismiss();
                })
                开始运行jk()
            });
            appnameui.fg2.on("click", () => {
                tool.writeJSON("包名", "tw.txwy.and.arknights");
                ui.run(() => {
                    appname.dismiss();
                })
                开始运行jk()
            });

            let pake = 3;
            if (fg == null) {
                pake = pake - 1;
                appnameui.fg.attr("visibility", "gone");
            }
            if (fg1 == null) {
                pake = pake - 1;
                appnameui.fg1.attr("visibility", "gone");
            }
            if (fg2 == null) {
                pake = pake - 1;
                appnameui.fg2.attr("visibility", "gone");
            }

            if (pake == 2 || pake == 3) {
                appname.show();
            } else {
                开始运行jk();
            }

        } else {
            开始运行jk();
        }
    } else {
        tool.Floaty_emit("暂停", "关闭程序");
        ui.start.setText("开始运行");
        return;
    }

    return true;
})

ui.start_floaty.on("click", function () {
    ui.start_floaty.setEnabled(false);
    setTimeout(function () {
        ui.start_floaty.setEnabled(true)
    }, 800);
    setting = tool.readJSON("configure");
    if (setting.侧边 != "34653") {
        if (floaty.checkPermission() == false) {
            tool.dialog_tips("温馨提示", "请先授予明日计划悬浮窗权限！");
            return;
        }
        if (!files.exists("./mrfz/tuku/行动_普通.png")) {
            tool.dialog_tips("确认图库", "当前图库不完整,你的设备将无法正常使用明日计划-PRTS辅助功能\n请在左边侧滑栏-检查图库进行更换!")
            return;
        }
        if (!tool.script_locate("Floaty.js")) {
            tool.writeJSON("侧边", "悬浮窗");
            开始运行jk(true);
        } else {
            snakebar("悬浮窗程序已在运行中")
            return;
        }
    } else {
        tool.dialog_tips("温馨提示", "请先开始运行一次再来尝试仅启动悬浮窗")
    }
})

//当离开本界面时保存data
ui.emitter.on("pause", () => {
    // timed_tasks_storage.put("items", timed_tasks_list);
    CountMaterial();

});
//返回事件
var isCanFinish = false;
var isCanFinishTimeout;
ui.emitter.on("back_pressed", e => {
    try {
        switch (ui.viewpager.getChildAt(ui.viewpager.currentItem)) {
            case ui.drawer_:
                ui.viewpager.currentItem = 1;
                e.consumed = true;
                return
            case ui.card:
                e.consumed = false;
                return
            case ui.main_web:
                if (ui.webview.canGoBack()) {
                    isCanFinish = ui.webview.url;
                    ui.webview.goBack();
                    e.consumed = true
                    return
                }
                if (!isCanFinish) {
                    toast('双击返回键退出')
                    isCanFinish = true;
                    isCanFinishTimeout = setTimeout(() => {
                        isCanFinish = false;
                    }, 2000);
                    e.consumed = true;
                } else {
                    clearTimeout(isCanFinishTimeout);
                    e.consumed = false;
                };
                return
        }

    } catch (err) { }

    e.consumed = false;
})

ui.emitter.on("activity_result", (requestCode, resultCode, data) => {

    if (resultCode != Activity.RESULT_OK) {
        if (filePathCallback != null) {
            filePathCallback.onReceiveValue(null);
        }
        return;
    }

    let uri = data.getData();
    //  let uri = Uri.parse("file:///sdcard/1.png");
    if (uri == null) {
        return
    }
    let uriArr = java.lang.reflect.Array.newInstance(java.lang.Class.forName("android.net.Uri"), 1);

    uriArr[0] = uri;

    filePathCallback.onReceiveValue(uriArr);
    filePathCallback = null;
});


function 输入框(id, text) {
    let re = /\d+/;

    arr = re.exec(text);
    if (text.length == 0) {
        id.setError("输入不能为空");
        return null;
    }

    if (id == ui.inputd && arr[0] > 100) {
        id.setError("核电池？");
        return null;
    } else if (arr[0] > 999) {
        id.setError("不能大于999");
        return null;
    }
    id.setText(null);
    id.setError(null);

    switch (id) {
        case ui.input_ordinary:
            tool.writeJSON("行动", arr[0]);
            toast("行动上限次数成功设置为" + arr[0])
            setting = tool.readJSON("configure");
            ui.input_ordinary.setHint(setting.行动 + "次");
            break;
        case ui.input_extinguish:
            tool.writeJSON("剿灭", arr[0]);
            toast("剿灭上限次数成功设置为" + arr[0])
            setting = tool.readJSON("configure");
            ui.input_extinguish.setHint(setting.剿灭 + "次");
            break;
        case ui.input_sane:
            tool.writeJSON("理智", arr[0]);
            toast("理智兑换次数成功设置为" + arr[0])
            setting = tool.readJSON("configure");
            ui.input_sane.setHint(setting.理智 + "个");
            break;
    }
}

//开始运行
function 开始运行jk(jk, tips_) {
    // 屏幕方向

    /*  if (ui.card.getHeight() == width) {
          console.error("请不要随便从横屏开始运行\n可能会导致悬浮窗大小异常");
          tool.dialog_tips("温馨提示", "请不要随便从横屏开始运行\n可能会导致悬浮窗大小异常")
      }*/
    if (tips_ != true && setting.full_resolution != true) {

        if (device.model == "MuMu") {
            let dialog = dialogs.build({
                title: "警告⚠",
                titleColor: "#F44336",
                type: "app",
                content: "加载中...",
                contentColor: "#F44336",
                positive: "我已知晓",
                negative: "下载MuMu9",
                positiveColor: "#000000",
                canceledOnTouchOutside: false
            }).on("negative", () => {
                app.openUrl("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                setClip("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                console.info("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                toast("已粘贴到剪贴板并打印到运行日志")
            })
            if (device.release != 9 && width != 1280 && height != 720 && width != 1920 && height != 1080) {
                dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本,\n https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe\n当前分辨率：" + width + "x" + height + "，明日计划图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为1280x720或1920x1080");
                toastLog("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                dialog.show();
                return
            }
            if (width != 1280 && height != 720 && width != 1920 && height != 1080) {
                dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前分辨率：" + width + "x" + height + "，明日计划图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为1280x720或1920x1080");
                dialog.show();
                return
            }
            switch (true) {
                case device.release != 9:
                    dialog.setContent("你的设备环境貌似是mumu模拟器，当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本, \n https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe");
                    toastLog("https://a11.gdl.netease.com/MuMuInstaller_9.0.0.5_v9.2.3.0x64_zh-Hans_1646704695.exe")
                    dialog.show();
                    return
            }

        }

        let tuku_de = [];
        tuku_de[0] = gallery.gallery_info.分辨率.h;
        tuku_de[1] = gallery.gallery_info.分辨率.w;
        if (tuku_de[0] == width && tuku_de[1] == height) {
            if (!setting.模拟器) {
                dialogs.build({
                    type: "app-or-overlay",
                    title: "兼容模拟器平板版",
                    content: "检测到你的设备可能是模拟器平板版分辨率,是否启用设置-兼容模拟器平板版？\n如果不是，请不要启用，这将导致悬浮窗过大。如果是误报请在竖屏下打开明日计划，这是因为部分设备，应用在横屏下获取到的分辨率与竖屏的相反（我猜的，应该是）\n可在侧边栏-设置中关闭",
                    positive: "启用",
                    positiveColor: "#FF8C00",
                    negative: "取消",
                    canceledOnTouchOutside: false
                }).on("positive", () => {
                    tool.writeJSON("模拟器", true);
                }).show()

                return
            }
        } else {

            tuku_de[0] = (tuku_de[0] - height).toString();
            tuku_de[1] = (tuku_de[1] - width).toString();
            if (tuku_de[0].replace(/[^\d]/g, "") > 220 || tuku_de[1].replace(/[^\d]/g, "") > 170) {
                console.error("设备分辨率与图库分辨率相差过大，可能无法正常使用")
                let Tips_tuku_ui = ui.inflate(
                    <vertical id="parent">

                        <card gravity="center_vertical" cardElevation="0dp" margin="0">
                            <img src="file://res/icon.png" w="50" h="30" margin="0" />
                            <text text="无法使用PRTS辅助" padding="5" textSize="20" gravity="center|left" textColor="#f03752" marginLeft="50" />


                        </card>

                        <ScrollView>
                            <vertical>
                                <vertical padding="10 0" >
                                    <View bg="#f5f5f5" w="*" h="2" />
                                    <text id="Device_resolution" text="加载中" />
                                    <text id="dwh" text="加载中" />
                                    <text id="Tips" textStyle="italic" textColor="#f03752" />

                                    <text id="wxts" autoLink="web" text="温馨" typeface="sans" padding="5" textColor="#000000" textSize="15sp" layout_gravity="center" />
                                </vertical>
                                <horizontal w="*" padding="-3" gravity="center_vertical">
                                    <button text="退出(5s)" id="exit" textColor="#dbdbdb" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                                    <button text="执意启动" id="ok" textColor="#dbdbdb" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                                </horizontal>
                            </vertical>
                        </ScrollView>

                    </vertical>);

                let Tips_tuku = dialogs.build({
                    type: "app",
                    customView: Tips_tuku_ui,
                    wrapInScrollView: false,
                    cancelable: false,
                    canceledOnTouchOutside: false
                })
                tool.setBackgroundRoundRounded(Tips_tuku.getWindow(), { radius: 0, })
                Tips_tuku.show();
                Tips_tuku_ui.exit.on("click", function () {
                    Tips_tuku.dismiss();
                })
                Tips_tuku_ui.ok.on("click", function () {
                    Tips_tuku.dismiss()
                    开始运行jk(false, true)

                })

                Tips_tuku_ui.wxts.setText("1. 没有适合你的图库？\n参考以下教程动手制作 https://mrjh.flowus.cn，或使用虚拟机、模拟器等自调适合的分辨率，左边高度×右边宽度，DPI随意" +
                    "\n2. 分辨率反的？ \n请在竖屏下启动悬浮窗。华为：更改屏幕分辨率-为对应图库。模拟器：说明设置的是平板版分辨率(更换与设备分辨率相反的图库分辨率即可)。 注：更换设备分辨率后都需要到应用内更换相符合的图库")
                Tips_tuku_ui.Device_resolution.setText("当前设备分辨率{ 'w':" + width + ", 'h': " + height + "}")

                Tips_tuku_ui.dwh.setText("当前使用图库名称：" + gallery.gallery_info.名称);

                Tips_tuku_ui.Tips.setText("请在软件主页面-左边侧滑栏-更换图库\n更换设备分辨率相近的图库，否则将无法正常使用本应用-PRTS辅助。\n目前，图库与设备分辨率宽度一致，而高度误差不超过230左右，或高度一致，而宽度误差不超过170左右，基本上是可以使用的，但不排除某些小图片在你的设备上无法匹配，导致某功能失效")
                Tips_tuku_ui.exit.setEnabled(false);
                let i_tnter = 5;
                let id_tnter = setInterval(function () {
                    if (i_tnter >= 0) {
                        i_tnter--;
                    }
                    ui.run(() => {
                        if (i_tnter == 0) {
                            Tips_tuku_ui.exit.setEnabled(true);
                            Tips_tuku_ui.exit.setText("退出")
                            Tips_tuku_ui.exit.setTextColor(colors.parseColor("#F4A460"))
                            clearInterval(id_tnter);
                        } else {
                            Tips_tuku_ui.exit.setText("退出(" + i_tnter + "s)")
                        }

                    })
                }, 1000)

                return
            }
        }
    }

    if (Counter <= 2) {
        jk = true;
        tool.dialog_tips("温馨提示", language['auto-allow-screenshots-tips'], "@drawable/ic_report_problem_black_48dp");
    }
    if (!jk) {
        if (ui.start.getHint() != "执行配置" && ui.start.text() != "停止运行") {
            let modular_route = false;
            mod_data = sto_mod.get("modular", []);
            for (let i = 0; i < mod_data.length; i++) {
                if (mod_data[i].pre_run_check) {
                    if (setting.执行 == "自定义模块") {
                        if (mod_data[i].id == "自定义") {
                            modular_route = setting.custom
                        }
                    } else {
                        switch (mod_data[i].id) {
                            case '自定义':
                                break;
                            case '关闭应用':
                                modular_route = setting.关闭应用;
                                break;
                            case '基建换班':
                                if (setting.基建换班) {
                                    modular_route = setting.换班路径;
                                }
                                break;
                            case '屏幕解锁':
                                modular_route = timed_tasks_storage.get("password");
                                break;
                            default:
                                toastLog('未匹配到的模块id')
                                break
                        }
                    }
                    let modular_cache = files.exists(modular_route) ? require(modular_route) : false
                    if (modular_cache) {
                        ui.start.setHint("执行配置");
                        modular_cache.import_configuration({
                            'getSource': modular_route,
                            'getinterface': '主界面',
                        });
                    } else {
                        toastLog('文件不存在，无法运行' + mod_data[i].id + '模块:' + mod_data[i].script_name + "。\n路径:" + modular_route)
                    }
                }
            }
        }
    }
    CountMaterial();
    输入框(ui.input_ordinary, ui.input_ordinary.text());
    输入框(ui.input_extinguish, ui.input_extinguish.text());
    输入框(ui.input_sane, ui.input_sane.text());
    ui.start.setText("停止运行");
    Counter = Counter + 1;
    timed_tasks_storage.put("Counter", Counter);
    $settings.setEnabled('foreground_service', true);
    new_ui("悬浮窗");

    console.info('应用版本：' + toupdate.getPackageName(packageName) + (app.autojs.versionCode > 8081300 ? "(64位)" : "(32位)") + "框架");
    console.info('项目版本: ', toupdate.getLocalVerName())
    console.info('device info: ' + device.brand + " " + device.product + " " + device.release);
    console.info('设备分辨率：w:' + width + ", h:" + height);
    console.info('图库分辨率: ' + JSON.stringify(gallery.gallery_info.分辨率 ? gallery.gallery_info.分辨率 : gallery.gallery_info.resolution));
    console.info('截图方式: ' + setting.截图);
    ui.start.setHint(null);

    /*
     if (!jk) {
         setTimeout(function () {
             toastLog("开始运行20秒后主动关闭明日计划-界面\n如无需此功能请从悬浮窗启动PRTS辅助");
             let runtime = java.lang.Runtime.getRuntime();
             runtime.gc();
             threads.shutDownAll();
             ui.finish()
             exit();
         }, 20000);
     }
     */
};


threads.start(function () {
    switch (web_set.homepage) {
        case 1:
            Update_UI(1)
            Update_UI(2)
            break
        case 2:
            Update_UI(2)
            Update_UI(1)
            break
    }

    setInterval(function () {

        ui.post(() => {
            web_set = tool.readJSON("web_set")

            if (web_set.new_url) {
                log("检测到新链接,跳转:\n" + web_set.new_url)
                ui.webview.loadUrl(web_set.new_url);
                if ($ui.findView("main_web") == ui.viewpager.getChildAt(1)) {
                    ui.viewpager.setCurrentItem(1);
                } else {
                    ui.viewpager.setCurrentItem(2);
                }

                tool.writeJSON("new_url", false, "web_set")
            }

            switch (ui.viewpager.getChildAt(ui.viewpager.currentItem)) {
                case ui.main_web:
                    let webview_ = ui.webview
                    if (webview_.url == web_set.web_url) {
                        ui.icons.getChildAt(2).icon_.attr("tint", theme.icons)
                    } else {
                        ui.icons.getChildAt(2).icon_.attr("tint", theme.icon)
                    }
                    if (!webview_.canGoBack()) {
                        ui.icons.getChildAt(0).icon_.attr("tint", theme.icons)
                    } else {
                        ui.icons.getChildAt(0).icon_.attr("tint", theme.icon)
                    }
                    if (!webview_.canGoForward()) {
                        let icon_i = "";
                        ui.viewpager.getNoScroll() ? icon_i = "@drawable/ic_zoom_out_map_black_48dp" : icon_i = "@drawable/ic_center_focus_strong_black_48dp";
                        //ui.viewpager.getNoScroll() ? icon_i = "@drawable/ic_fullscreen_exit_black_48dp" : icon_i = "@drawable/ic_fullscreen_black_48dp";
                        ui.icons.getChildAt(1).icon_.attr("src", icon_i)
                        //  ui.icons.getChildAt(1).icon_.attr("tint","#dcdcdc")
                    } else {
                        ui.icons.getChildAt(1).icon_.attr("src", web_set.web_icon[1].icon)

                    }
                    break

                case ui.card:
                    if (tool.script_locate("Floaty.js")) {
                        ui.start.setText("停止运行")
                    } else {
                        ui.start.setText("开始运行");
                    }

                    ui.autoService.checked = tool.autoService() ? true : false;

                    /*

                     if (morikujima_setting && morikujima_setting.ap) {
                        morikujima_setting = tool.readJSON("morikujima_setting")
                        ui.text_ap.setText(morikujima_setting.ap.current + "/" + morikujima_setting.ap.max);
                    }


                    if (morikujima_setting != undefined && morikujima_setting.理智数 != false) {
                        morikujima_setting = tool.readJSON("morikujima_setting")

                        let ms = new Date(new Date()).getTime() - new Date(morikujima_setting.理智时间).getTime()
                        let hflz = Math.floor(ms / 60 / 1000);
                        if (hflz == -1) {
                            return
                        }

                        //console.info("距离时间" + hflz)
                    

                    hflz = Math.floor(hflz / 6) + Number(morikujima_setting.已有理智);

                    if (hflz >= Number(morikujima_setting.理智数.split("/")[1])) {
                        hflz = morikujima_setting.理智数.split("/")[1] + "/" + morikujima_setting.理智数.split("/")[1]
                        ui.text_ap.setText(hflz);
                        if (popView) popView.text_ap.setText(hflz);
                        tool.writeJSON("理智数", hflz, "morikujima_setting");
                        return
                    }
                    hflz = hflz + "/" + morikujima_setting.理智数.split("/")[1]
                    if (hflz != ui.text_ap.getText()) {
                        if (morikujima_setting.理智时间 != tool.readJSON("morikujima_setting").理智时间) {
                            return
                        }

                        ui.text_ap.setText(hflz)
                        if (popView) popView.text_ap.setText(hflz);
                        tool.writeJSON("理智数", hflz, "morikujima_setting");
                    }
            }
                    */
                    break
            }
        })

    }, 300)

    //获取公告
    if (setting.公告 == "公告") {
        notice();
    } else if (setting.更新内容 != toupdate.getLocalVerName()) {
        $ui.post(() => {
            let edition_Updates = dialogs.build({
                type: "app",
                title: "当前版本更新了啥",
                content: files.read("./lib/logs/版本更新内容.txt"),
                cancelable: false,
                positive: "确定",
                negative: "不再提示",
                canceledOnTouchOutside: false
            }).on("negative", () => {
                tool.writeJSON("更新内容", toupdate.getLocalVerName().toString())
            })
            $ui.post(() => {
                tool.setBackgroundRoundRounded(edition_Updates.getWindow(), { radius: 0, })
                edition_Updates.show();

            }, 100)
        }, 100)


    }
    let rtu = random(1, 3)
    if (!files.copy("./res/Startpage/" + rtu + ".png", "./res/start-up.png")) {
        toastLog("更换启动图失败");
    }
    /* rtu = random(1,20);
     if(rtu == 5){
         ui.post(() => {
         $ui.imageCache.clearDiskCache()
         },2000)
     }*/



    files.ensureDir(files.path(path_ + "/gallery_list"));

    sleep(50);
    if (Counter == 100) {
        Counter = dialogs.build({
            type: "app-or-overlay",
            title: "作者语",
            content: "大家好，我是梦月時謌，明日计划的开发者，很感谢大家一直以来的支持与鼓励，即使我已经不玩明日方舟了，也会继续维护下去。\n\n这是一个捐赠的页面，如果有能力的朋友，欢迎请梦月時謌喝杯饮料，来份外卖，就当作对梦月時謌的支持与鼓励，感激不尽，没能力的朋友，也不勉强，有这份心意，梦月時謌就万分感谢了。最后，感谢大家一路以来的陪伴",
            positive: "去看看",
            positiveColor: "#FF8C00",
            negative: "取消",
            canceledOnTouchOutside: false
        }).on("positive", () => {
            let donationkey = require('./lib/java/crypto.dex')
            donationkey.donation("iVBORw0KGgoAAAANSUhEUgAA")
        }).on("negative", () => {
            timed_tasks_storage.put("Counter", 0);
        })
        tool.setBackgroundRoundRounded(Counter.getWindow())
        Counter.show()
        Counter = timed_tasks_storage.get("Counter");
    }
    ui.run(() => {
        if (tool.autoService(true)) {
            ui.autoService.checked = true;
        }
    })
    Counter = storages.create("web_set").get("yindao");
    if (Counter != true && setting.公告 != "公告") threads.start(tishi);
    Counter = timed_tasks_storage.get("Counter");

    console.verbose("开始检查更新")
    toupdate.updata(ui.drawerFrame)


})


//储存指定材料
function CountMaterial(MaterialJson) {
    let ChildCount = ui.addMaterialList.getChildCount();

    if (MaterialJson == undefined) {
        MaterialJson = tool.readJSON("material_await_obtain", {
            name: [],
            number: [],
            done: [],
        });
    };
    MaterialJson_ = {
        name: [],
        number: [],
        done: [],
    };

    for (let i = 0; i < ChildCount; i++) {
        let name = ui.addMaterialList.getChildAt(i).getChildAt(1).getText();
        let number = Number(
            ui.addMaterialList.getChildAt(i).getChildAt(2).getChildAt(0).getText()
        );
        if (number <= 0) {
            continue;
        }
        MaterialJson_.name.push(name);
        MaterialJson_.number.push(number);
        let j = MaterialJson.name.indexOf(name)
        if (j != -1) {
            MaterialJson_.done.push(MaterialJson.done[j]);
        } else {
            MaterialJson_.done.push(0);
        }
    }

    console.verbose("存储材料表");
    tool.putString("material_await_obtain", MaterialJson_);

}

//添加材料
function AddMaterial(item, num) {
    AddItem = item;
    AddItemNum = num ? num : 1;
    if (AddItemList.indexOf(AddItem) != -1) {
        snakebar("  材料已添加!");
        return;
    }
    AddItemList.push(AddItem);
    let AddText = ui.inflate(
        <horizontal w="*" h="auto" layout_weight="1" margin="20 0 0 -5">

            <card cardCornerRadius="15"
                layout_gravity="center" w="30" >
                <img id="img" src="{{ImgPath}}{{AddItem}}.png" h="30" w="30" />
            </card>
            <text text="{{AddItem}}"
                margin="10 0"
                textSize="15sp"
                textColor="black"
                layout_gravity="center"
                w="100" />
            <horizontal w="*" gravity="center" >
                <input text="{{AddItemNum}}" inputType="number" w="*" marginRight="80" />
            </horizontal>
            <card w="30sp" h="30sp" marginLeft="-35" cardCornerRadius="15sp" cardBackgroundColor="#0d84ff" layout_gravity="center">
                <text text="×"
                    textSize="20sp"
                    textColor="#ffffff" gravity="center"
                    foreground="?selectableItemBackground"
                />
            </card>
        </horizontal>,
        ui.addMaterialList
    );
    ui.addMaterialList.addView(AddText);
    let ChildCount = ui.addMaterialList.getChildCount();

    for (let i = 0; i < ChildCount; i++) {
        ui.addMaterialList.getChildAt(i).getChildAt(3).removeAllListeners();
        ui.addMaterialList
            .getChildAt(i)
            .getChildAt(3)
            .click(function (e) {

                AddItemList.splice(
                    AddItemList.indexOf(e.getParent().getChildAt(1).getText()),
                    1
                );

                ui.addMaterialList.removeView(e.getParent());
                CountMaterial();
            });

    }

}

//刷新材料视图
function setSpinnerAdapter(spinner, dataList) {
    let boxXml = (
        <card w="*" h="51" bg="#006688">
            <horizontal w="*" h="50" bg="{{theme.bg}}">
                <card margin="20 5 20 0" cardCornerRadius="20" >
                    <img id="img" h="40" w="40" />
                </card>
                <text
                    id="name"
                    text=""
                    gravity="left|center"
                    textSize="18sp"
                    textColor="black"
                    w="*"
                    h="50"
                />
            </horizontal>
        </card>
    );

    function createAdapter(dataList) {
        let adapter = JavaAdapter(android.widget.SpinnerAdapter, {
            getCount: function () {
                return dataList.length;
            },
            getItem: function (position) {
                return dataList[position];
            },
            getItemId: function (position) {
                return position;
            },
            getViewTypeCount: function (position) {
                return 1;
            },
            getView: function (position, convertView, parent) {
                if (!convertView) {
                    convertView = ui.inflate(boxXml, ui.drawerFrame, false);
                }
                let item = dataList[position];
                convertView.name.setText(item);
                convertView.img.attr("src", ImgPath + item + ".png");
                return convertView;
            },
            getDropDownView: function (position, convertView, parent) {
                if (!convertView) {
                    convertView = ui.inflate(boxXml, ui.drawerFrame, false);
                }
                let item = dataList[position];
                if (convertView.name.getText().toString() != item) {
                    convertView.name.setText(item);
                    convertView.img.attr("src", ImgPath + item + ".png");
                }
                return convertView;
            },
        });
        return adapter;
    }
    spinner.setAdapter(createAdapter(dataList));
    if (setting.指定材料) {
        ui.materialList.setVisibility(0);
        ui.limitMaterial.checked = true;
    }

}

//材料规划
function Painting_planning(input, ok) {
    if (ui.webview.url != "https://www.bigfun.cn/tools/aktools/material") {
        ui.webview.loadUrl("https://www.bigfun.cn/tools/aktools/material");
        ui.post(() => {
            input_plan()
        }, 500)
    }
    let planui = ui.inflate(
        <vertical id="parent">
            <frame>
                <ScrollView>
                    <vertical>
                        <horizontal margin="0" bg="#00000000">
                            <img src="file://res/icon.png" w="50" h="30" margin="0 5" />
                            <text text="材料路径规划(试行，仅供参考)" layout_gravity="left|center_vertical" textColor="#000000" />
                            <horizontal w="*" h="*" gravity="right" clickable="true" >
                                <img id="jump" src="@drawable/ic_shuffle_black_48dp" layout_gravity="center" w="35" height="35" padding="5" marginRight="5" foreground="?selectableItemBackground" />
                            </horizontal>
                        </horizontal>
                        <linear gravity="center" margin="0 -2">
                            <View bg="#f5f5f5" w="*" h="2" />
                        </linear>
                        <vertical padding="10 0" >
                            <Switch id="it1" text="考虑合成副产物" textSize="20sp" />
                            <Switch id="it2" text="需求经验值" textSize="20sp" />
                            <Switch id="it3" text="需求龙门币" textSize="20sp" />
                            <text id="wxts" text="数据来源：明日方舟工具箱" typeface="sans" textColor="#000000" textSize="8sp" gravity="right" marginRight="10" />

                        </vertical>
                        <horizontal w="*" padding="-3" gravity="center_vertical">
                            <button text="退出" id="exit" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                            <button text="开始规划" id="ok" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                        </horizontal>
                    </vertical>
                </ScrollView>
            </frame>
        </vertical>);

    let plan = dialogs.build({
        type: "app",
        customView: planui,
        wrapInScrollView: false
    }).on("dismiss", () => {
        if (!ok) {
            ui.run(() => {
                ui.webview.goBack();
            })

        }
    })
    plan.show();

    planui.jump.on("click", function () {
        ok = true;
        plan.dismiss();
        ui.viewpager.currentItem = 2;
    })
    planui.ok.on("click", function () {
        ok = true;
        plan.dismiss();
        timing_plan(0);
        ui.viewpager.currentItem = 2;
    })

    planui.exit.on("click", function () {
        plan.dismiss()
    })

    planui.it1.on("check", function () {
        timing_plan(1);
    });
    planui.it2.on("check", function () {
        timing_plan(2);
    });
    planui.it3.on("check", function () {
        timing_plan(3);
    });

    function timing_plan(i) {
        let timing_plan = setInterval(function () {
            if (input) {
                ui.post(() => {
                    switch (i) {
                        case 0:
                            ui.webview.evaluateJavascript("javascript:function click(){var c = document.getElementsByTagName('button');for(let i =0;i<c.length;i++){if(c[i].innerHTML=='开始规划'){c[i].click();return c;};};};click();", new ValueCallback({
                                onReceiveValue: function (value) {
                                    if (value != "null") {
                                        clearInterval(timing_plan)
                                    }
                                },
                            }));
                            break;
                        case 1:
                            ui.webview.loadUrl("javascript:document.getElementById('mdc-form-input-1').click();");
                            clearInterval(timing_plan)
                            break
                        case 2:
                            ui.webview.loadUrl("javascript:document.getElementById('mdc-form-input-2').click();");
                            clearInterval(timing_plan)
                            break
                        case 3:
                            ui.webview.loadUrl("javascript:document.getElementById('mdc-form-input-3').click();");
                            clearInterval(timing_plan)
                            break

                    }
                }, 0)
            }
        }, 300)

    }


    function input_plan() {
        let planning = files.read("./lib/prototype/plan.txt");

        ui.webview.evaluateJavascript("javascript:" + planning.toString() + "; let input = " + JSON.stringify(input) + ";planning();", new ValueCallback({
            onReceiveValue: function (value) {
                if (value == "null") {
                    input_plan()
                } else {
                    ui.post(() => {
                        ui.webview.loadUrl("javascript:document.getElementById('btnImport').click()");
                    }, 50)
                    ui.post(() => {
                        console.verbose("implement")
                        ui.webview.loadUrl("javascript:document.getElementsByClassName('mdc-button--raised mdc-button--dense mdc-button mdc-ripple-upgraded mdc-ripple-upgraded--foreground-activation').click();")

                        input = true;
                    }, 550)

                }
            },
        }))
    }

}


function change_list(spinner, mCountries) {

    if (spinner == "检测") {
        if (gallery.language != "简中服") {
            ui.indt.attr("visibility", "gone");
            ui.timed_tasks_list.attr("visibility", "gone");
        }
        change_list(ui.implement, modeGatherText);

        return true
    } else {
        sp = spinner
        adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, mCountries);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        sp.setAdapter(adapter);
    }
}



function snakebar(text, second) {
    second = second || 3000;
    com.google.android.material.snackbar.Snackbar.make(ui.drawerFrame, text, second).show();
}

// 自定义viewpager动画
function MyPageTransform() {
    //圆角
    let mDp30 = dp2px(30);
    let mRadius = 0;
    let pageWidth;

    this.transformPage = function (view, position) {
        if (animation_viewpager < 2) {

            pageWidth = view.getWidth();
            if (position < -1) {
                view.setAlpha(0); // 这个我觉得没啥用, 因为没有小于-1的值(也可能我理解有误)
            } else if (position <= 0) {
                // 左侧view
                // 小于0, position不是一个固定的数字, 他是一直在变化的
                ui.statusBarColor(colors.TRANSPARENT);
                view.setTranslationX(pageWidth * position);
            } else if (position <= 1) {

                // 右侧view
                // 横轴的变化保证了第1页始终能看见
                // 就算最大的偏移也只有view宽度的一半
                view.setTranslationX(pageWidth * 0.45 * -position);
                // 缩放view的宽高
                view.setScaleX(1 - 0.2 * position);
                view.setScaleY(1 - 0.2 * position);
                // if (mRadius != parseInt(mDp30 * position)) {
                //圆角切换
                ui.card.attr("cardCornerRadius", (mRadius = parseInt(mDp30 * position)) + "px");
                // }
                if (position == 1) {
                    // 设置list 宽度
                    // 这样你点击有反应的区域就只有屏幕宽度*0.65
                    ui.drawerList.attr("w", parseInt(pageWidth * 0.65) + "px");
                    ui.cnos.attr("w", parseInt(pageWidth * 0.65) + "px");
                    ui.cnos_list.attr("w", parseInt(pageWidth * 0.65) + "px");
                    //帧布局主页面
                    ui.homepage.attr("w", parseInt(pageWidth * 0.35) + "px");
                    ui.homepage.attr("h", parseInt(view.getHeight() * 0.8) + "px");

                }
            } else {
                view.setAlpha(0);
            }
        } else {
            pageWidth = view.getWidth();

            let MIN_SCALE = 0.75
            if (position < -1) {
                view.setAlpha(0);
            } else if (position <= 0) {
                ui.statusBarColor(colors.TRANSPARENT);

                view.setAlpha(1);
                view.setTranslationX(0);
                view.setScaleX(1);
                view.setScaleY(1);
            } else if (position <= 1) {
                view.setAlpha(1 - position);
                view.setTranslationX(pageWidth * -position);
                let scaleFactor = MIN_SCALE + (1 - MIN_SCALE) * (1 - Math.abs(position));
                view.setScaleX(scaleFactor);
                view.setScaleY(scaleFactor);
            } else {
                view.setAlpha(0);
            }

        }
    }
}


function notice() {
    threads.start(function () {
        while (true) {
            if (typeof jlink_mian != "object") {
                sleep(1000)
            } else {
                break
            }
        }

        try {

            http.get(jlink_mian.告使用者, {
                headers: {
                    'url_info': url_info,
                    'User-Agent': System.getProperty("http.agent")
                }
            }, (res, err) => {
                if (err || res['statusCode'] != 200) {
                    throw new Error('请求云端公告信息出错:\n' + (res ? res : err.messag));

                } else {
                    $ui.post(() => {
                        let notice_ds = dialogs.build({
                            type: "app",
                            title: "声明",
                            content: res.body.string(),
                            checkBoxPrompt: "不再提示",
                            cancelable: false,
                            positive: "我知道了",
                            negative: "视频教程",
                            neutral: "问题帮助",
                            canceledOnTouchOutside: false
                        }).on("negative", () => {
                            // age.put("url", jlink_mian.使用说明);
                            new_ui("浏览器", jlink_mian.视频教程)
                        }).on("neutral", () => {
                            //  age.put("url", jlink_mian.疑惑解答);
                            new_ui("浏览器", jlink_mian.疑惑解答)
                        }).on("check", (checked) => {
                            if (checked) {
                                tool.writeJSON("公告", "关闭");
                            } else {
                                tool.writeJSON("公告", "公告")
                            }
                        })
                        $ui.post(() => {
                            /* let params = notice_ds.getWindow().getAttributes()
                             if (ui.card.getHeight() == width) {
                                 params.width = Math.floor(height / 1.2);
                                 params.height = Math.floor(width / 1.4);
                             } else {
                                 params.width = width;
                                 params.height = height;
                             }*/

                            notice_ds.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                            tool.setBackgroundRoundRounded(notice_ds.getWindow(), { radius: 0, })
                            $ui.post(() => {

                                notice_ds.show();
                            }, 50)
                        }, 100)
                    }, 100)
                }
            })

        } catch (e) {
            e = $debug.getStackTrace(e)
            console.error(e);
            network_reminder_tips(e)
        };

    })
}


function Update_UI(i) {
    switch (i) {
        case 1:
            ui.run(() => {
                SystemUiVisibility(false);

                //输入法
                activity.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

                // if (morikujima_setting != undefined && morikujima_setting.理智数 != false) {
                initPop()
                /*   } else {
                       ui.text_ap.setText("未启用");
                       ui.selectTime.click(() => {
                           if (ui.text_ap.getText() != "未启用") {
                               return
                           }
                           dialogs.build({
                               type: "app-or-overlay",
                               title: "实时便笺",
                               content: "是否启用实时便笺功能？\n实时显示当前剩余理智数量，公招完成时间。建议启用(OCR)自动识别。每次脚本刷完关卡后，自动识别剩余理智数量",
                               checkBoxPrompt: "(OCR)自动识别",
                               positive: "确认",
                               negative: "取消",
                               positiveColor: "#FF8C00",
                               canceledOnTouchOutside: false
                           }).on("positive", (dialog) => {
                               if (dialog.checkBoxPrompt.checked) {
                                   if (!检测ocr(true)) {
                                       return;
                                   }
                               }
                               tool.writeJSON("理智数", "0/135", "morikujima_setting")
                               tool.writeJSON("理智时间", new Date(), "morikujima_setting")
                               tool.writeJSON("自动识别", dialog.checkBoxPrompt.checked, "morikujima_setting")
   
                               morikujima_setting = tool.readJSON("morikujima_setting");
                               initPop()
                               ui.text_ap.setText(morikujima_setting.理智数);
                               ui.selectTime.performClick();
                           }).show()
                       })
                   }
   */

                ui.module_config_txt.setText("模块\n配置")

                if (gallery.gallery_info) {

                    change_list(ui.implement, modeGatherText);
                    switch (setting.执行) {
                        case '常规':
                            ui.implement.setSelection(0);
                            break
                        case '行动':
                            ui.implement.setSelection(1);
                            break;
                        case '基建':
                            ui.implement.setSelection(2);
                            break;
                        case '剿灭':
                            ui.implement.setSelection(3);
                            break;
                        case '上次':
                            ui.implement.setSelection(4);
                            break;
                        case '自定义模块':
                            //日服美服还不支持上一次作战,没有上次的选项
                            switch (gallery.language) {
                                case "日服":
                                case "美服":
                                    ui.implement.setSelection(4, true);
                                    break
                                default:
                                    ui.implement.setSelection(5, true);
                                    break
                            }
                            break;
                    };
                    SE执行 = ui.implement.getSelectedItemPosition();
                }
                floaty.checkPermission() ? ui.floatyCheckPermission.setVisibility(8) : ui.floatyCheckPermission.setVisibility(0);

                try {
                    if (setting.换班路径.length >= 5) {
                        ui.jjhb.attr("visibility", "visible");
                    } else {
                        ui.jjhb.attr("visibility", "gone");
                    }
                } catch (err) {

                }
                //判断是否显示无人机加速、加速那个
                if (!setting.无人机加速) ui.uav_acceleration_list.attr("visibility", "gone");
                setting.加速生产 ? ui.manufacturing.checked = true : ui.trade.checked = true;

                setting.信用处理.信用购买 ? ui.credit_buy.checked = true : "";
                if (setting.行动理智) {
                    ui.xlkz.attr("visibility", "visible");
                    if (SE执行 == 3) {
                        ui.input_extinguish.attr("visibility", "visible");
                        ui.input_ordinary.attr("visibility", "gone");
                    }
                } else {
                    ui.xlkz.attr("visibility", "gone");
                }
                ui.start.setText(tool.script_locate("Floaty.js") ? "停止运行" : "开始运行");


                switch (gallery.language) {
                    case "日服":
                    case "美服":
                        ui.indt.attr("visibility", "gone");
                        ui.timed_tasks_list.attr("visibility", "gone");

                        return
                    default:
                        break
                }
                if (mod_data[0] == undefined) {
                    ui.module_config.attr("visibility", "gone")
                } else {
                    ui.module_config.attr("cardCornerRadius", "25dp");
                }
                if (setting.音量修复) {
                    try {
                        let gmvp = device.getMusicVolume()
                        device.setMusicVolume(gmvp)
                    } catch (err) {
                        tool.dialog_tips("温馨提示", "没有修改系统设置权限！\n仅用于修复部分机型启动游戏后音量异常")
                    }
                }
                //activity.setRequestedOrientation(1);

                ui._bgA.attr("cardCornerRadius", "25dp");
                setSpinnerAdapter(ui.chooseMaterial, MaterialList);
                let ItemList = tool.readJSON("material_await_obtain");
                if (ItemList) {
                    for (let i = 0; i < ItemList.name.length; i++) {
                        // let delta = ItemList.number[i] - ItemList.done[i];
                        if ((ItemList.number - ItemList.done[i]) > 0) {
                            AddMaterial(ItemList.name[i], ItemList.number[i]);
                        }
                    }
                }
                switch (SE执行) {
                    case 1:
                        ui.jijianquyu.setVisibility(8);
                        break;
                    case 2:
                        ui.xingdongquyu.setVisibility(8);
                        break;
                }
                if (!setting.企鹅统计) {
                    ui.limitMaterial.setVisibility(8)
                    ui.materialList.setVisibility(8)
                }
                console.verbose("初始化PRTS配置完成")
            })
            break
        case 2:
            ui.run(() => {
                let webview = ui.webview
                let settings = webview.getSettings();
                if (web_set.computer == true && web_set.web_ua.indexOf("Windows") == -1) {
                    web_set.web_ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";
                }
                /*  webview.addJavascriptInterface({
                      showSource:function(html){
                      log(html)
                  },
                  showDescription:function(html){
                      log(html)
                  }},"java_obj");
                  */
                settings.setUserAgentString(web_set.web_ua);
                settings.setLoadsImagesAutomatically(true); // 是否自动加载图片
                settings.setDefaultTextEncodingName("UTF-8"); // 设置默认的文本编码 UTF-8 GBK
                settings.setJavaScriptEnabled(true); // 设置是否支持js
                settings.setJavaScriptCanOpenWindowsAutomatically(true); // 设置是否允许js自动打开新窗口, window.open

                settings.setSupportZoom(true); // 是否支持页面缩放
                settings.setBuiltInZoomControls(true); // 是否出现缩放工具
                settings.setUseWideViewPort(true); // 设置webview是否支持viewport
                settings.setLoadWithOverviewMode(true); // 页面超过容器大小时, 是否将页面缩小到容器能够装下的尺寸


                settings.setAppCachePath(context.getExternalFilesDir(null).getAbsolutePath() + "/cache/Webpage/"); // app缓存文件路径
                settings.setAllowFileAccess(true); // 是否允许访问文件
                settings.setAppCacheEnabled(true); // 是否启用app缓存
                settings.setDatabaseEnabled(true); // 是否启用数据库
                settings.setDomStorageEnabled(true); // 是否本地存储
                //设置 缓存模式
                //settings.setCacheMode(WebSettings.LOAD_DEFAULT); // 开启 DOM storage API 功能 
                //settings.setDomStorageEnabled(true);
                /* -------------------------WebChromeClient----------------------------------------------- */

                let WebViewClient = android.webkit.WebViewClient;
                let webViewClient = new JavaAdapter(WebViewClient, {
                    onPageStarted: function (webView, url, bitmap) {
                        // console.log('页面正在加载');
                        //  ui.webview.loadUrl("javascript:(function(){if("+web_set.night_mode+" == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{return;delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");

                        //     console.info(url)
                        ui.progress.setVisibility(0);
                    },
                    onPageFinished: function (webView, curUrl) {
                        // ui.webview.loadUrl("javascript:(function(){if("+web_set.night_mode+" == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");
                        ui.progress.setVisibility(8);

                        //  ui.webview.loadUrl("javascript:(function(){if("+web_set.night_mode+" == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{return;delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");
                        //    ui.webview.loadUrl("javascript:alert(document.getElementsByTagName('html')[0].innerHTML);");
                    },
                    shouldOverrideUrlLoading: function (webView, request) {
                        if (!request.url) {
                            return
                        }

                        request = request.url.toString()
                        if (isCanFinish == request) {
                            return false
                        } else {
                            isCanFinish = false;
                        }

                        console.verbose(request)
                        let urls = files.read("./lib/urlfile.txt")
                        if (urls == "false") {
                            files.write("./lib/urlfile.txt", request)
                            return true
                        }
                        try {
                            if (request.startsWith("folder://bookmark")) {
                                label_plug.label_plug(function (url) {
                                    ui.run(() => {
                                        ui.webview.loadUrl(url);
                                    })
                                })
                                return true;
                            }

                            if (request.startsWith("http://") || request.startsWith("https://") || request.startsWith("file://")) {
                                webView.loadUrl(request);
                                return false;
                            } else {
                                let app = "第三方APP"
                                switch (true) {
                                    case request.startsWith("jianshu"):
                                        return true
                                    case request.startsWith("openapp.jdmobile"):
                                        app = "京东";
                                        break
                                    case request.startsWith("tbopen"):
                                        app = "淘宝";
                                        break
                                    case request.startsWith("baidubox"):
                                        app = "百度";
                                        break
                                    case request.startsWith("bilibili"):
                                        app = "哔哩哔哩";
                                        break

                                }
                                if (request.startsWith("hiker") || request.startsWith("folder")) {
                                    return true
                                }

                                // confirm("是否允许网页打开 " + app + " ？").then(value => {
                                //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
                                //  if (value) {
                                ui.web_tips.setVisibility(0);
                                ui.tips_text.setText("    网页请求打开" + app)
                                ui.tips_ok.on("click", function () {
                                    ui.web_tips.setVisibility(8)
                                    new_ui("activity", request)
                                });
                                ui.tips_no.on("click", function () {
                                    ui.web_tips.setVisibility(8)
                                });
                                ui.post(function () {
                                    ui.web_tips.setVisibility(8)
                                }, 3000)

                                // });
                            }
                            // 返回true代表自定义处理，返回false代表触发webview加载
                            return true;
                        } catch (e) {
                            if (e.javaException instanceof android.content.ActivityNotFoundException) {
                                log(e)
                                webView.loadUrl(request);
                            } else {
                                toastLog('无法加载URL: ' + request);

                                console.trace(e);
                            }
                        }

                    },
                });
                webview.setWebViewClient(webViewClient);

                let WebChromeClient = android.webkit.WebChromeClient;

                let webChromeClient = new JavaAdapter(WebChromeClient, {
                    /*  onReceivedTitle: function(webView, title) {

                          //  console.log("onReceivedTitle");
                      },
                      onProgressChanged: function(view, progress) {
                         // ui.webview.loadUrl("javascript:(function(){if(" + web_set.night_mode + " == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{return;delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");

                          //  console.log("onProgressChanged")
                      },*/
                    onConsoleMessage: function (message) {
                        if (web_set.h5rizhi) {
                            message.message && console.verbose("h5: " + message.message());
                        }
                    },
                    onShowFileChooser: function (webview, filePathCallback_, fileChooserParams) {
                        filePathCallback = filePathCallback_

                        let i = new android.content.Intent(android.content.Intent.ACTION_GET_CONTENT);
                        switch (true) {
                            case webview.url.indexOf("https://penguin-stats.cn") != -1:
                            case webview.url.indexOf("https://arkn.lolicon.app") != -1:
                                i.setType("image/*");
                                toastLog("图片类型")
                                break
                            default:
                                i.setType("*/*")
                        }
                        i.addCategory(Intent.CATEGORY_OPENABLE);
                        activity.startActivityForResult(i, 1);
                        return true;
                    },
                });
                webview.setWebChromeClient(webChromeClient);
                //  webview.setDownloadListener(new DownloadListener() {
                webview.setDownloadListener({
                    onDownloadStart: function (url, userAgent, contentDisposition, mimeType, contentLength) {
                        //   console.trace(url)
                        let webdow = JSON.parse(
                            files.read("./lib/game_data/webdow.json", (encoding = "utf-8"))
                        );
                        if (webdow && webdow.await) {

                            if (webdow.action == "download") {
                                if (webdow.expectedtime && webdow.expectedtime < new Date()) {
                                    webdow.await = false;
                                    files.write(
                                        "./lib/game_data/webdow.json",
                                        JSON.stringify(webdow),
                                        (encoding = "utf-8")
                                    );
                                    return
                                }
                                let datali = {};
                                datali.link = url;
                                datali.id = webdow.id || "webdow";
                                datali.prohibit = true;
                                datali.myPath = files.path(path_ + "/OCR/");
                                datali.fileName = "xiaoyueocr.zip";
                                storages.create("Doolu_download").put("data", datali);
                                files.createWithDirs(path_ + "/OCR/")
                                engines.execScriptFile("./lib/download.js");
                                //监听脚本间广播'download'事件
                                snakebar('开始下载文件: ' + datali.fileName, 3000);
                                events.broadcast.on("download" + datali.id, function (X) {
                                    if (X.name == "进度") {
                                        console.verbose(datali.fileName + " 下载进度: " + X.data);

                                    } else if (X.name == "结果") {
                                        if (X.data == "下载完成") {
                                            try {
                                                let event_ = events.broadcast.listeners("download" + datali.id)[0];
                                                events.broadcast.removeListener("download" + datali.id, event_);
                                            } catch (e) {

                                            }
                                            eval(webdow.callback)({
                                                filepath: datali.myPath,
                                                filename: datali.fileName,
                                            });
                                            webdow.await = false;
                                            files.write(
                                                "./lib/game_data/webdow.json",
                                                JSON.stringify(webdow),
                                                (encoding = "utf-8")
                                            );
                                            console.verbose("完成webdow任务");
                                            return
                                        }
                                    } else if (X.name == "关闭") {
                                        try {
                                            let event_ = events.broadcast.listeners("download" + datali.id)[0];
                                            events.broadcast.removeListener("download" + datali.id, event_);
                                        } catch (e) {

                                        }
                                        let tips = datali.fileName + "下载失败";
                                        toast(tips);
                                        console.error(tips);
                                        webdow.await = false;
                                        files.write(
                                            "./lib/game_data/webdow.json",
                                            JSON.stringify(webdow),
                                            (encoding = "utf-8")
                                        );
                                        return
                                    }

                                });
                            } if (webdow.action == "geturl") {
                                webdow.url = url;
                                webdow.await = false;
                                files.write(
                                    "./lib/game_data/webdow.json",
                                    JSON.stringify(webdow),
                                    (encoding = "utf-8")
                                );

                            }
                            return true
                        }
                        new_ui("activity", url)
                    }
                });
                if (web_set.night_mode) {
                    ui.main_web.attr("bg", "#1e1e1e")
                    SystemUiVisibility(true)
                }
                if (!files.exists(path_ + "/html/built_in.html")) {
                    $zip.unzip("./lib/html/html.zip", path_ + "/html/");
                }
                ui.webview.loadUrl(web_set.web_url)
                console.verbose("初始化webview完成")
            })
            break
    }

}

function new_ui(name, url) {
    // let JS_file;
    let variable = "'ui';let theme = " + JSON.stringify(theme) + "; let jlink_mian = " + JSON.stringify(jlink_mian) + ";"; //require('./theme.js');";
    switch (name) {
        case "day":
            theme.setTheme("day");
            break
        case "night":
            theme.setTheme("night");
            break
        case '关于':
            engines.execScriptFile("./activity/about.js", {
                path: files.path('./activity/'),
            });
            break;
        case '设置':
            engines.execScriptFile("./activity/Basics.js", {
                path: files.path('./activity/'),
            });
            break;
        case '日志':
            engines.execScript("journal_ui", variable + "require('./activity/journal.js')");
            //engines.execScript("journal_ui", java.lang.String.format("'ui';  let theme = storages.create('configure').get('theme_colors');require('./activity/journal.js');"));
            break;
        case 'q群/频道':
            if (url.length > 10) {
                qq跳转频道(url);
            } else {
                try {
                    app.startActivity({
                        data: "mqqapi://card/show_pslcard?card_type=group&uin=" + url,
                    })
                } catch (err) {
                    toastLog("请先安装QQ或升级QQ\n群号：" + url)
                }
            }
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
            break
        case '浏览器':
            if (url != undefined) {
                log(url)
                ui.webview.loadUrl(url)
            }
            if ($ui.findView("main_web") == ui.viewpager.getChildAt(1)) {
                ui.viewpager.setCurrentItem(1);
            } else {
                ui.viewpager.setCurrentItem(2);
            }

            break;
        case '悬浮窗':

            engines.execScriptFile("./Floaty.js");
            break;
        case "activity":
            importPackage(android.net);

            let uri_ = Uri.parse(url);
            app.startActivity(new Intent(Intent.ACTION_VIEW).setData(uri_).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP));
            break
    }

}
//log(ui.viewpager.getChildCount())


function tishi() {

    sleep(1000)
    engines.execScriptFile("./subview/web_guide.js")
    ui.post(() => {
        ui.viewpager.currentItem = 0;
    }, 1000)
    ui.post(() => {
        ui.viewpager.currentItem = 1;
    }, 2000)
    ui.post(() => {
        ui.viewpager.currentItem = 2;

    }, 2500)
    ui.post(() => {
        label_plug.label_plug(function (url) {
            ui.run(() => {
                ui.webview.loadUrl(url);
            })
        })
    }, 3500)
}

function network_reminder_tips(e) {

    let network_reminder_view = ui.inflate(
        <vertical padding="10 0" bg="#ffffff">
            <card gravity="center_vertical" cardElevation="0dp" margin="5 5">
                <img src="file://res/icon.png" w="50" h="30" margin="0" />
                <text text="错误" textSize="25" gravity="center|left" textColor="#D32F2F" marginLeft="50" />


            </card>
            <View bg="#f5f5f5" w="*" h="1" />

            <ScrollView>
                <vertical>
                    <text id="deleteTips" textStyle="bold" textSize="15" margin="0 5 0 5" autoLink="web" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />

                </vertical>
            </ScrollView>

        </vertical>, null, false);
    e = e.toString().replace("/8888", "");
    e = e.toString().replace(":80", "");
    network_reminder_view.deleteTips.setText("-访问服务器资源失败！将无法正常使用云端图库等功能\n\n-错误类型:" + e +
        "\n\n1.请检查网络连接是否可用，应用联网权限是否已授权" +
        "\n2.请检查应用是否最新版，可通过以下链接更新(长按复制，密码421)：\nhttps://234599.lanzoui.com/b00ojgtla\nhttps://234599.lanzouo.com/b00ojgtla");

    let network_reminder_dialogs = dialogs.build({
        type: "foreground-or-overlay",
        customView: network_reminder_view,
        wrapInScrollView: false,
        autoDismiss: true
    }).on("dismiss", () => {
        log("结束ui")
        exit();
    })

    network_reminder_dialogs.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);

    network_reminder_dialogs.show();
}

