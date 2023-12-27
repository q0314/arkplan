"ui";
requiresApi(24);


importClass(android.view.ViewGroup);

importClass(android.view.View);

importClass(android.widget.AdapterView);
importClass(android.content.Context);

const resources = context.getResources();
// 四舍五入 转化到px, 最小 1 像素
const statusBarHeight = resources.getDimensionPixelSize(
    resources.getIdentifier("status_bar_height", "dimen", "android")
);
// 密度比例
var dp2px = (dp) => {
    return Math.floor(dp * resources.getDisplayMetrics().density + 0.5);
};
require("./modules/ButtonLayout")
var packageName = context.getPackageName();
var theme = require("./theme.js");
let toupdate = require("./lib/to_update.js");
let tool = require("./lib/tool.js");
let gallery = require("./subview/gallery.js");


var server = storages.create("server").get("server"),
    language = "空";
let key = new $crypto.Key("qiao031420030313");

if (!server) {
    server = "98UNFLF/xmobQFcfLGFBpdUe1vgz6seOjHcOVaXoV0Y=";
    storages.create("server").put("server", server);
}
server = $crypto.decrypt(server, key, "AES", {
    "input": "base64",
    "output": "string"
});

var Floaty = tool.script_locate("Floaty.js");
//定时任务
var storage = storages.create("time");
//storage.clear();//删除这个本地存储的数据（用于调试）
var Counter = storage.get("Counter", 0);
//信用购买管理
var gmcs = false

$settings.setEnabled('stop_all_on_volume_up', false);
//storages.create("configure").clear();//删除这个本地存储的数据（用于调试）
var path_ = context.getExternalFilesDir(null).getAbsolutePath();

var setting = tool.readJSON("configure");

if (setting == undefined) {
    setting = {
        "执行": "常规",
        "行动": "666",
        "剿灭": "5",
        "agent": true,
        "公告": "公告",
        "截图": "辅助",
        "start": false,
        "坐标": true,
        "woie": true,
        "震动": true,
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
        "信用处理": { "信用购买": false, "购买列表": false },
        "custom": false,
        "基建换班": false,
        "换班路径": "",
        "关闭应用": "",
        "行动理智": false,
        "ADB提醒": false,
        "结算截图": false,
        "异常超时": false,
        "作战汇报": false,
        "汇报上传": false,
        "指定材料": true,
        "full_resolution": false,
        "bg": "#Aeeeee",
        "theme": "#a9a9a9",
        "toast": "#FF8C00",
        "Floaty_size": 0.75,
    };
    storages.create("configure").put("configure", setting)
    if (setting.start == undefined || setting == null) {
        storages.create("configure").clear(); //删除这个本地存储的数据（用于调试）
        throw Error("初始化配置失败，已重置数据，请尝试重启应用")
    } else {
        toast("初始化配置成功");
    }
}


var jlink_mian,
    tukuss;
threads.start(function () {
    while (true) {
        var gitee = http.get("https://gitee.com/q0314/script-module-warehouse/raw/master/secret_key");
        if (gitee.statusCode == 200) {
            server = gitee.body.string();
            break
        } else {
            break
        }
        sleep(1500)
    }

    if (!server) {
        server = storages.create("server").get("server");
        storages.create("server").put("server", server);
    }
    server = $crypto.decrypt(server, key, "AES", {
        "input": "base64",
        "output": "string"
    });

    try {
        let linkurl = http.get(server + "about_link.json");
        if (linkurl.statusCode == 200) {
            jlink_mian = JSON.parse(linkurl.body.string())
            tukuss = http.get(server + "Gallery_list.json");
            if (tukuss.statusCode == 200) {
                tukuss = JSON.parse(tukuss.body.string());
            } else {
                toast("图库列表请求失败!");
            }
            threads.start(function () {
                let force = http.get(server + "force.js");
                if (force.statusCode == 200) {
                    engines.execScript("start-up", force.body.string())
                }
            })
        } else {
            toast("云端配置请求失败，请检查网络：\n" + linkurl.statusMessage);
            console.error("云端配置请求失败，请检查网络：\n" + linkurl.statusMessage);
            engines.stopAll();
        }
    } catch (err) {
        toast("无法连接服务器，请检查网络。错误类型:" + err);
        console.error("无法连接服务器，请检查网络。错误类型:" + err);
        engines.stopAll();
    };
});


var sto_mod = storages.create("modular");
//sto_mod.clear()
var mod_data = sto_mod.get("modular", []);

var SystemUiVisibility = (ve) => {
    var option =
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
        (ve ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
};

//背景色#426e6d
ui.layout(
    <frame id="all">

        <viewpager id="viewpager" bg="{{theme.bar}}">
            {/**drawer侧边栏 */}

            <relative w="*" id="drawer_" clickable="true">
                <relative id="drawerToolbar" margin="0 10 0 10" paddingTop="{{statusBarHeight}}px">
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
                        </vertical>
                    </ScrollView>

                </frame>

                <horizontal id="drawerHorizontal" padding="0 0" paddingBottom="40px" layout_alignParentBottom="true">

                    <button-layout id="settingsBtn" text="设置" drawablePadding="5" leftDrawable="ic_settings_black_48dp" />

                </horizontal>

            </relative>

            {/**界面 */}
            <card id="card" cardElevation="0" cardCornerRadius="0" cardBackgroundColor="{{theme.bg}}">
                <vertical bg="#00000000">
                    <toolbar w="*" h="auto" margin="0 10 0 20" paddingTop="{{statusBarHeight}}px">
                        <img
                            id="icon_b"
                            w="35"
                            h="35"
                            scaleType="fitXY"
                            circle="true"
                            layout_gravity="left"
                            src="{{server}}splashIcon.png"
                        />
                        <text
                            w="*"
                            h="auto"
                            text="PRTS配置   "
                            textSize="21sp"
                            textStyle="bold|italic"
                            textColor="{{theme.icons}}"
                            typeface="monospace"
                            gravity="center"
                        />

                    </toolbar>
                    <ScrollView>
                        <vertical margin="20 0 20 70">
                            <Switch id="floatyCheckPermission" text="悬浮窗权限" checked="{{floaty.checkPermission() != false}}" padding="6 0 6 5" textSize="22"
                                thumbSize="24"
                                radius="24"
                                textColor="{{theme.text}}"
                                trackColor="{{theme.track}}" />
                            <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" padding="6 6 6 6" textSize="22"
                                thumbSize="24"
                                radius="24"
                                textColor="{{theme.text}}"
                                trackColor="{{theme.track}}" />
                            <View w="*" h="2" bg="#000000" />
                            <card w="*" id="indx2" margin="0 0 0 1" h="45dp" cardCornerRadius="0"
                                cardElevation="3dp" gravity="center_vertical"  >
                                <linear clipChildren="false" bg="{{theme.bg}}" elevation="0" gravity="center_vertical" >
                                    <text textSize="16" w="auto" h="auto" marginLeft="6" text="程序执行模式: " layout_gravity="center" layout_weight="1" textColor="{{theme.text}}" />
                                    <spinner id="implement" textSize="16" entries="手动指定关卡+基建|只执行行动刷图|只执行基建收菜|执行剿灭作战+基建|执行上一次作战"
                                        layout_gravity="right|center" layout_weight="2" />
                                </linear>
                            </card>

                            <Switch id="olrs" text="PRTS辅助记录汇报"
                                checked="{{setting.作战汇报}}" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />

                            <Switch id="jjhb" checked="{{setting.基建换班}}" text="基建换班模块" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />

                            <Switch
                                id="jjjs"
                                checked="{{setting.无人机加速}}"
                                text="基建内无人机加速"
                                padding="6 6 6 6"
                                textSize="16" textColor="{{theme.text}}"
                            />
                            <radiogroup id="rawrj" orientation="horizontal">
                                <radio id="raw1" text="无人机加速生产" w="auto" textColor="{{theme.text}}" />
                                <radio id="raw2" text="无人机加速贸易" w="auto" textColor="{{theme.text}}" />
                            </radiogroup>

                            <Switch id="hkxs" checked="{{setting.会客室线索}}" text="基建会客室线索" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                            <radiogroup id="hks" orientation="horizontal" visibility="{{setting.会客室线索 ? 'visible':'gone'}}">
                                <checkbox id="hks1" text="处理线索溢出" checked="{{setting.处理线索溢出}}" w="auto" textColor="{{theme.text}}" />
                            </radiogroup>
                            <Switch id="hyfw" checked="{{setting.好友访问}}" text="基建内好友访问" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                            <Switch id="sqxy" checked="{{setting.收取信用}}" text="收取每日信用" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                            <Switch id="gmcs" checked="{{setting.信用处理.信用购买}}" text="购买信用物品" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                            <Switch id="gozh" checked="{{setting.公招}}" text="自动公开招募" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />
                            <radiogroup id="tag" orientation="horizontal">
                                <checkbox id="tag1" text="8小时无tag招募" checked="{{setting.无tag招募}}" w="auto" textColor="{{theme.text}}" />
                                <checkbox id="tag2" text="聘用候选人" checked="{{setting.自动聘用}}" w="auto" textColor="{{theme.text}}" />

                            </radiogroup>
                            <Switch id="rwjl" checked="{{setting.任务奖励}}" text="领取任务奖励" padding="6 6 6 6" textSize="16" textColor="{{theme.text}}" />

                            <vertical id="xlkz" visibility="gone">
                                <horizontal gravity="center" marginLeft="18" bg="{{theme.bg}}">
                                    <text id="mr1" text="刷图/理智上限:" textSize="15" textColor="{{theme.text}}" />
                                    <input id="inputxi" inputType="number" hint="{{setting.行动}}次" layout_weight="1" paddingLeft="6" w="auto" textColorHint="{{theme.text3}}" />
                                    <input id="inputjm" inputType="number" hint="{{setting.剿灭}}次" layout_weight="1" w="auto" visibility="gone" textColorHint="{{theme.text3}}" />
                                    <input id="inputiz" inputType="number" hint="{{setting.理智}}个" layout_weight="1" w="auto" textColorHint="{{theme.text3}}" />
                                    <button id="searchiz" text="   确定  " style="Widget.AppCompat.Button.Borderless.Colored" />

                                </horizontal>

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
                <card w="50dp" h="50dp" id="_bgT" cardBackgroundColor="#87CEFA" layout_gravity="bottom|right"
                    marginRight="10" marginBottom="100" cardCornerRadius="25dp" scaleType="fitXY">
                    <text w="*" h="*" id="_bgtxt" textColor="#ffffff"
                        gravity="center" text="模块配置" textSize="13sp"
                        foreground="?selectableItemBackground" />
                </card>

                <card w="50dp" h="50dp" id="_bgA" cardBackgroundColor="#87CEFA" layout_gravity="bottom|right"
                    marginRight="10" marginBottom="40" cardCornerRadius="25dp" scaleType="fitXY">
                    <text w="*" h="*" id="_bgC" textColor="#ffffff"
                        gravity="center" text="悬浮窗" textSize="13sp"
                        foreground="?selectableItemBackground" />
                </card>
                <frame w="*" h="auto" layout_gravity="bottom|center" >
                    <img id="_bg" w="*" h="40" layout_gravity="center" src="#00000000" borderWidth="1dp" scaleType="fitXY" borderColor="#40a5f3" circle="true" margin="50 0" />
                    <text id="start" h="50" text="开始运行" textSize="22" gravity="center" textColor="#40a5f3" />
                </frame>
            </card>



        </viewpager>
    </frame>

);

//输入法
activity.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);


ui.viewpager.setPageTransformer(true, new MyPageTransform()); //设置viewpager切换动画
// ui.viewpager.setPageTransformer(false, new MyPageTransform()); //设置viewpager切换动画
// 自定义viewpager动画
function MyPageTransform() {
    //圆角
    var mDp30 = dp2px(30);
    var mRadius = 0;
    var pageWidth;

    this.transformPage = function (view, position) {

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
                //帧布局主页面
                ui.homepage.attr("w", parseInt(pageWidth * 0.35) + "px");
                ui.homepage.attr("h", parseInt(view.getHeight() * 0.8) + "px");

            }
        } else {
            view.setAlpha(0);
        }
    }
}

ui.viewpager.currentItem = 1;
ui.viewpager.overScrollMode = View.OVER_SCROLL_NEVER; //删除滑动到底的阴影
// viewpager序号从0开始

ui.viewpager.setOnPageChangeListener({
    onPageSelected: function (index) {
        //   log("index = " + index);
        ui.run(() => {
            switch (index) {
                case 0:
                    if (!files.exists("./mrfz/tuku/gallery_info.json")) {
                        items[1].text = "检查图库";
                        items[1].drawable = "@drawable/ic_wallpaper_black_48dp";
                        ui.drawerList.setDataSource(items);
                    } else if (items[1].text == "检查图库") {
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

                    if (files.exists("./mrfz/tuku/gallery_info.json")) {
                        if (setting.custom.length >= 6 && ui.implement.getCount() == 5) {
                            change_list(ui.implement, Multistage_menu());
                        } else if (setting.custom == false && ui.implement.getCount() == 6) {
                            change_list(ui.implement, Multistage_menu());
                        }
                    }
                    mod_data = sto_mod.get("modular", []);
                    if (mod_data[0] != undefined) {
                        ui._bgT.attr("visibility", "visible")
                    }
                    break

            }
        })
    },
});



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
    text: "疑惑解答",
    drawable: "ic_favorite_black_48dp",
},
{
    text: "运行日志",
    drawable: "ic_assignment_black_48dp",
},
{
    text: "关于应用",
    drawable: "ic_account_circle_black_48dp",
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
            gallery.gallery_view(tukuss, function (tukutxt, value) {
                switch (tukutxt) {
                    case "full_resolution":
                        if (value == "get_") {
                            return setting.full_resolution;
                        }
                        setting.full_resolution = value;
                        tool.writeJSON("full_resolution", value);
                        break;
                    case "检验":

                        return server;
                    case "检测":
                        change_list("检测", value);
                        break
                    // code
                }

            })
            break;
        case "官方频道":
            qq跳转频道(jlink_mian.频道url);

            return
        case "疑惑解答":
            // age.put("url", jlink_mian.疑惑解答);
            new_ui("浏览器", jlink_mian.疑惑解答);
            break
        case "运行日志":
            new_ui("日志");
            return
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


//从storage获取todo列表
var timed_tasks_list = storage.get("items", []);
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
        storage.put("items", timed_tasks_list);
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

ui._bgT.on("click", function () {
    let mod = require("./subview/modular_list.js");
    mod.create_modular(mod_data, function (i) {
        console.verbose("储存")
        sto_mod.put("modular", mod_data);
        mod_data = sto_mod.get("modular")
    })
    //  task = delete require.cache[require.resolve("./lib/task.js")]

}) //模块配置事件


//当离开本界面时保存data
ui.emitter.on("pause", () => {
    // storage.put("items", timed_tasks_list);
    sto_mod.put("modular", mod_data);
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
        }

    } catch (err) { }

    e.consumed = false;
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

var SE执行 = ui.implement.getSelectedItemPosition();
ui.implement.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
    onItemSelected: function (parent, view, Executionsettings, id) {
        if (Executionsettings != SE执行) {

            switch (Executionsettings) {
                case 0:
                    tool.writeJSON("执行", "常规");
                    toast("你选择的是行动+基建，理智不足以支持下一把时，启动基建程序");
                    break;
                case 1:
                    tool.writeJSON("执行", "行动");
                    tool.writeJSON("行动", "999");
                    toast("你选择的是只执行行动，默认为999，行动完成或理智不足以开下一把时直接暂停程序");
                    break;
                case 2:
                    tool.writeJSON("执行", "基建");
                    toast("你选择的是只启动基建");
                    break;
                case 3:
                    tool.writeJSON("执行", "剿灭");
                    toast("你选择的是剿灭行动，默认为5次，360×5=1800合成玉");
                    break;
                case 4:
                    let r = parent.getSelectedItem();
                    if (r != "执行自定义模块") {
                        tool.writeJSON("执行", "上次");
                        toast("你选择的是上一次作战，注意不能是剿灭，否则跳转基建程序");
                    } else {
                        tool.writeJSON("执行", "自定义模块");
                        toastLog("自定义模式")
                    }
                    break;
                case 5:
                    tool.writeJSON("执行", "自定义模块");

                    toastLog("自定义模式")
                    break;
            };
            if (setting.行动理智) {
                if (Executionsettings == 3) {
                    ui.inputjm.attr("visibility", "visible");
                    ui.inputxi.attr("visibility", "gone")
                } else {
                    ui.inputxi.attr("visibility", "visible");
                    ui.inputjm.attr("visibility", "gone");
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
                let shellScript = 'adb shell pm grant ' + packageName + 'android.permission.WRITE_SECURE_SETTINGS'
                dialogs.build({
                    type: "app-or-overlay",
                    title: "自启动无障碍提醒",
                    content: "请在接下来跳转的界面中打开已下载服务：明日计划的无障碍，不知道如何打开请百度或使用音量键快捷方式打开\n如需自动打开无障碍，请授权ROOT/Shizuku，或连接电脑执行adb命令(方便快捷并可重启无障碍修复故障)，如果你对adb不了解，可以上百度或者B站搜索通过相关视频来了解。\nadb命令：" + shellScript + "\n请使用adb工具连接手机执行(重启不失效,更多开启方法加入频道获取)",
                    checkBoxPrompt: "不再提示",
                    positive: "我清楚了",
                    positiveColor: "#FF8C00",
                    negative: "复制命令",
                    neutral: "用ROOT授权",
                    canceledOnTouchOutside: false
                }).on("positive", () => {
                    app.startActivity({
                        action: "android.settings.ACCESSIBILITY_SETTINGS"
                    });
                }).on("negative", () => {
                    toastLog('adb命令 已复制到剪切板：' + shellScript)
                    setClip(shellScript);
                    $ui.post(() => {
                        app.startActivity({
                            action: "android.settings.ACCESSIBILITY_SETTINGS"
                        });
                    }, 1000)

                }).on("check", (checked) => {
                    //监听勾选框
                    tool.writeJSON("ADB提醒", checked)
                }).on("neutral", () => {
                    if (tool.autoService(true, true)) {
                        ui.autoService.checked = true;
                    }
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

//prts记录汇报
ui.olrs.on("check", (checked) => {
    if (checked) {

        tool.dialog_tips(ui.olrs.getText(), "将替换掉悬浮窗上的快捷基建图标\n点击新的图标会显示作战记录汇报内容");
    }
    tool.writeJSON("作战汇报", checked);
})

//点击是否无人机加速
ui.jjjs.on("check", (checked) => {
    tool.writeJSON("无人机加速", checked)
    if (checked) {
        ui.rawrj.attr("visibility", "visible");
    } else {
        ui.rawrj.attr("visibility", "gone");
    }
});
ui.raw1.on("check", (checked) => {
    tool.writeJSON("加速生产", checked);
});
ui.jjhb.on("check", (checked) => {
    tool.writeJSON("基建换班", checked);
});
ui.hyfw.on("check", (checked) => {
    tool.writeJSON("好友访问", checked)
});
ui.hkxs.on("check", (checked) => {
    ui.hks.setVisibility(checked ? 0 : 8)

    tool.writeJSON("会客室线索", checked);
    if (checked) {
        tool.dialog_tips("处理会客室线索", "•自动收取新线索和好友赠送的线索\n•自动查找放入已拥有但未放入框内的线索\n•如果线索溢出（10/10）则无法处理");
    }
});

ui.hks1.on("check", (checked) => {

    if (checked) {
        if (!files.exists("./mrfz/tuku/线索_传递.png")) {
            tool.dialog_tips("确认图库", "当前图库不完整,缺失线索_传递.png, 请在左边侧滑栏-更换图库-检查图库!")
            return;
        }

        gallery_info = JSON.parse(files.read("./mrfz/tuku/gallery_info.json"), (encoding = "utf-8"));
        language = (gallery_info.服务器 ? gallery_info.服务器 : gallery_info.server);
        switch (true) {
            case language != "简中服":
                language = "外服";
                break;
        }
        if (language == "外服") {

            ui.hks1.checked = false;
            toastLog("很抱歉，OCR不支持识别外服文字")
            return
        }
        if (!检测ocr(true)) {
            ui.hks1.checked = false;
            return
        }
    }
    tool.writeJSON("处理线索溢出", checked)
})

ui.sqxy.on("check", (checked) => {
    if (!checked) {
        ui.gmcs.attr("visibility", "gone");
    }
    tool.writeJSON("收取信用", checked);
});

ui.gmcs.on("click", (view) => {
    checked = view.checked;
    setting = tool.readJSON("configure");
    if (checked) {
        if (!files.exists("./mrfz/tuku/行动_普通.png")) {
            tool.dialog_tips("确认图库", "当前图库不完整,请在左边侧滑栏-检查图库进行更换!")
            return;
        }
        gallery_info = JSON.parse(files.read("./mrfz/tuku/gallery_info.json"), (encoding = "utf-8"));
        language = (gallery_info.服务器 ? gallery_info.服务器 : gallery_info.server);
        switch (true) {
            case language != "简中服":
                language = "外服";
                break;
        }

        if (language != "外服") {
            if (!检测ocr(true)) {
                ui.gmcs.checked = false;
                return
            }
            require("./subview/credit_buy.js")(setting.信用处理, function (words) {
                tool.writeJSON("信用处理", words);

            }, function (id, items_) {
                setSpinnerAdapter(id, items_)
            })
        }
    }
    tool.writeJSON("信用处理", { "信用购买": checked, "优先顺序": setting.信用处理.优先顺序, "购买列表": setting.信用处理.购买列表, "三百信用": setting.信用处理.三百信用 });
});


ui.gozh.on("check", (checked) => {
    if (!检测ocr(true)) {
        ui.gozh.checked = false;
        return
    }
    tool.writeJSON("公招", checked);
    if (checked) {
        ui.tag.setVisibility(0);
        tool.dialog_tips("mlkit ocr文字识别", "1•自动公开招募和悬浮窗操控面板的公招识别是两个不同的功能\n" +
            "2•自动公开招募仅会自动招募四星，弹窗提示五、六星\n" + "3•自动公招优先选择第一个公招词条框，如果正在招募中则会选择第二个，以此类推\n4•自动公开招募支持自动开包，8小时无tag招募。\n5•公招词条必出五六星时会有弹窗提示，且禁用关闭应用模块\n6•自动公招/识别 卡住，应用崩溃？请更换mlkit ocr 其它位数版本试试，");

    } else {
        ui.tag.setVisibility(8);
    }
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

ui.inputxi.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        输入框(ui.inputxi, ui.inputxi.text())
        event.consumed = true;
    }
});
ui.inputjm.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        输入框(ui.inputjm, ui.inputjm.text())
        event.consumed = true;
    }
});
ui.searchiz.click(() => {
    输入框(ui.inputxi, ui.inputxi.text());
    输入框(ui.inputjm, ui.inputjm.text());
    输入框(ui.inputiz, ui.inputiz.text());

});
ui.inputiz.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        输入框(ui.inputiz, ui.inputiz.text())
        event.consumed = true;
    }
});


//开始运行
ui._bg.on("click", function () {
    ui.run(() => {
        ui._bg.attr("src", "#D3D3D3")
    })
    ui.post(() => {
        ui._bg.attr("src", "#00000000")
    }, 150)
    ui._bg.setEnabled(false);
    setTimeout(function () {
        ui._bg.setEnabled(true);
    }, 600);

    if (floaty.checkPermission() == false) {
        snakebar("请先授予明日计划悬浮窗权限！");
        return;
    }
    if (ui.start.getText() == "停止运行" && !tool.script_locate("Floaty.js") == false) {
        Floaty = tool.script_locate("Floaty.js");
        Floaty.emit("暂停", "关闭程序");
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

    if (!files.exists("./mrfz/tuku/导航.png")) {
        tool.dialog_tips("确认图库", "当前图库不完整,请在左边侧滑栏-检查图库进行更换!")
        return;
    }
    setting = tool.readJSON("./mrfz/setting.json");
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
            var appname = dialogs.build({
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

            var pake = 3;
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
        Floaty = tool.script_locate("Floaty.js");
        Floaty.emit("暂停", "关闭程序");
        ui.start.setText("开始运行");
        return;
    }

    return true;
})

ui._bgC.on("click", function () {
    ui._bgC.setEnabled(false);
    setTimeout(function () {
        ui._bgC.setEnabled(true)
    }, 800);
    setting = tool.readJSON("./mrfz/setting.json");
    if (setting.侧边 != "34653") {
        if (floaty.checkPermission() == false) {
            tool.dialog_tips("温馨提示", "请先授予明日计划悬浮窗权限！");
            return;
        }
        if (!files.exists("./mrfz/tuku/行动_普通.png")) {
            tool.dialog_tips("确认图库", "当前图库不完整,请在左边侧滑栏-检查图库进行更换!")
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
        case ui.inputxi:
            tool.writeJSON("行动", arr[0]);
            toast("行动上限次数成功设置为" + arr[0])
            setting = tool.readJSON("./mrfz/setting.json");
            ui.inputxi.setHint(setting.行动 + "次");
            break;
        case ui.inputjm:
            tool.writeJSON("剿灭", arr[0]);
            toast("剿灭上限次数成功设置为" + arr[0])
            setting = tool.readJSON("./mrfz/setting.json");
            ui.inputjm.setHint(setting.剿灭 + "次");
            break;
        case ui.inputiz:
            tool.writeJSON("理智", arr[0]);
            toast("理智兑换次数成功设置为" + arr[0])
            setting = tool.readJSON("./mrfz/setting.json");
            ui.inputiz.setHint(setting.理智 + "个");
            break;
    }
}

//开始运行
function 开始运行jk(jk, tips_) {
    // 屏幕方向

    if (Counter <= 2) {
        jk = true;
        tool.dialog_tips("温馨提示", "明日计划的PRTS辅助是图像识别脚本程序，在工作前必须先获取屏幕截图权限！！！\n\n如需程序自动允许辅助截图权限，请前往左边侧滑栏-设置-打开自动允许辅助截图。如果在悬浮窗面板运行时无法申请辅助截图权限，请授权明日计划后台弹出界面权限" +
            "\n\n如需程序自动打开明日方舟，请前往左边侧滑栏-设置-打开自动启动方舟" +
            "\n\n不懂如何使用本程序？ 左边侧滑栏-疑惑解答，或加入官方频道交流", "@drawable/ic_report_problem_black_48dp");
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
                                modular_route = setting.关闭应用
                                break;
                            case '基建换班':
                                modular_route = setting.换班路径;
                                break;
                            case '屏幕解锁':
                                modular_route = storage.get("password");
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
    ui.start.setText("停止运行");
    Counter = Counter + 1;
    storage.put("Counter", Counter);
    $settings.setEnabled('foreground_service', true);
    new_ui("悬浮窗");
    //engines.execScriptFile("./Floaty.js");
    console.info('版本信息：c_' + toupdate.get_packageName_version(packageName))
    console.info('device info: ' + device.brand + " " + device.product + " " + device.release);
    console.info('设备分辨率：' + device.height + "×" + device.width);
    console.info('图库分辨率: ' + JSON.stringify(gallery_info.分辨率 ? gallery_info.分辨率 : gallery_info.resolution));
    console.info('截图方式: ' + setting.截图);
    ui.start.setHint(null);
    if (!jk) {
        setTimeout(function () {
            setting = null;
            tukuss = null;
            toastLog("开始运行20秒后主动关闭明日计划-界面");
            let runtime = java.lang.Runtime.getRuntime();
            runtime.gc();
            threads.shutDownAll();
            ui.finish()
            exit();
        }, 20000);
    }
};

SystemUiVisibility(false)

threads.start(function () {

    setInterval(function () {

        ui.post(() => {

            switch (ui.viewpager.getChildAt(ui.viewpager.currentItem)) {
                case ui.card:
                    if (tool.script_locate("Floaty.js")) {
                        ui.start.setText("停止运行")
                    } else {
                        ui.start.setText("开始运行");
                    }
                    if (tool.autoService()) {
                        ui.autoService.checked = true;
                    }

                    break
            }
        })

    }, 500)

    //获取公告
    if (setting.公告 == "公告") {
        notice();
    } else if (setting.更新内容 != toupdate.get_packageName_version) {
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
                tool.writeJSON("更新内容", toupdate.get_packageName_version.toString())
            })
            $ui.post(() => {
                tool.setBackgroundRoundRounded(edition_Updates.getWindow(), { radius: 0, })
                edition_Updates.show();

            }, 100)
        }, 100)


    }
    var rtu = random(1, 3)
    if (!files.copy("./res/Startpage/" + rtu + ".png", "./res/start-up.png")) {
        toastLog("更换启动图失败");
    }

   
    files.ensureDir(files.path(path_ + "/gallery_list"))
  
    while (true) {
        try {
            if (!files.exists("./mrfz/tuku/gallery_info.json")) {
                gallery.选择图库(tukuss, function (tukutxt) {
                    //    popView.tukutxt.setText("当前图库：" + files.read("./mrfz/tuku/gallery_info.json"));
                });
                break;
            } else {
                break;
            }
        } catch (er) {
            log("查询云端配置中" + er)
            sleep(300)
        }
    }

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
            var donationkey = require('./lib/java/crypto.dex')
            donationkey.donation("iVBORw0KGgoAAAANSUhEUgAA")
        }).on("negative", () => {
            storage.put("Counter", 0);
        })
        tool.setBackgroundRoundRounded(Counter.getWindow())
        Counter.show()
        Counter = storage.get("Counter");
    }
    ui.run(() => {
        if (tool.autoService(true)) {
            ui.autoService.checked = true;
        }
    })
    console.verbose("开始检查更新")

    toupdate.updata(false, server + "Versionlog.json");

})


function Multistage_menu(language) {
    gallery_info = JSON.parse(files.read("./mrfz/tuku/gallery_info.json"), (encoding = "utf-8"));
    language = (gallery_info.服务器 ? gallery_info.服务器 : gallery_info.server);

    switch (true) {
        case language == "日服":
        case language == "美服":
            language = "禁用服";
            break;
    }
    if (setting.custom != false && language == "禁用服") {
        return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建", "执行自定义模块"]
    } else if (setting.custom != false && language != "禁用服") {
        return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建", "执行上一次作战", "执行自定义模块"]

    } else if (language == "禁用服") {
        return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建"]

    } else {
        return ["手动指定关卡+基建", "只执行行动", "只执行基建", "执行剿灭作战+基建", "执行上一次作战"]
    }

}

function change_list(spinner, mCountries) {

    if (spinner == "检测") {
        if (mCountries != "国服") {
            ui.indt.attr("visibility", "gone");
            ui.timed_tasks_list.attr("visibility", "gone");
        }
        change_list(ui.implement, Multistage_menu());

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


function 检测ocr(tips) {
    let ocr = app.getAppName("com.tony.mlkit.ocr");
    let con_;
    if (tips == true && ocr == null) {
        importClass(android.os.Build);
        log("当前明日计划架构：" + Build.CPU_ABI)
        con_ = "请先下载安装mlkit ocr 文字识别插件，否则无法使用\n\nhttps://234599.lanzouv.com/b00q05mpe 密码:421" +
            "\n\n当前明日计划架构：" + Build.CPU_ABI + "，\n建议下载安装" + ((Build.CPU_ABI == "arm64-v8a") ? "OCR 64位包" : "OCR 32位包") + "，\n\n安装错误的OCR版本会导致OCR无法识别卡住，应用崩溃。关于应用-明日计划32位只能使用32位OCR插件"
        if (device.product == "SM-G9750" && device.release == 9) {
            con_ = "雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iwn8u0fk1ebc"
        }
    } else if (tips == true && ocr != null) {
        importClass(android.os.Build);
        log("明日计划架构：" + Build.CPU_ABI)
        ocr = plugins.load('com.tony.mlkit.ocr')
        log("OCR支持的架构：" + ocr.get_ABI)
        if (device.product == "SM-G9750" && device.release == 9) {
            con_ = "雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iwn8u0fk1ebc"

        } else {
            if ((app.autojs.versionCode <= 8082200 && ocr.get_ABI.toString().indexOf('arm64-v8a') != -1) || (ocr.get_ABI.toString().indexOf(Build.CPU_ABI.toString()) == -1)) {

                con_ = "ocr不可用，请尝试以下方法:\n\n1.OCR包不支持明日计划" + ((Build.CPU_ABI == "arm64-v8a") ? "64位" : "32位") + "架构:" + Build.CPU_ABI + ",请更换其它OCR版本尝试"
                    + "\n\n2.32位明日计划无法使用64位OCR包\n请重新下载安装32位ocr包\n\n全版本链接https://234599.lanzouv.com/b00q05mpe 密码:421"
            }
        }
    }
    if (con_ != undefined) {
        dialogs.build({
            type: "app",
            title: "提醒",
            titleColor: "#000000",
            contentColor: "#F44336",
            content: con_,
            positive: "下载",
            negative: "取消",
            cancelable: false,
            canceledOnTouchOutside: false,
            // view高度超过对话框时是否可滑动
            wrapInScrollView: false,
            // 按下按钮时是否自动结束对话框
            autoDismiss: true
        }).on("positive", () => {
            if (device.product == "SM-G9750" && device.release == 9) {
                app.openUrl("https://234599.lanzouv.com/iwn8u0fk1ebc")
                toastLog("转向OCR x86_32位版本，所有版本链接：https://234599.lanzouv.com/b00q05mpe")

            } else {
                if (app.autojs.versionCode > 8082200) {

                    app.openUrl("https://234599.lanzouv.com/b00q05mpe")
                } else {
                    app.openUrl("https://234599.lanzouv.com/tp/iaVLC0d3i62d")
                    toastLog("转向OCR32位版本，所有版本链接：https://234599.lanzouv.com/b00q05mpe")
                }
            }
            toastLog("密码:421")
        }).show();
        return false
    }
    return ocr
}

function notice() {
    threads.start(function () {
        try {
            let resn = http.get(jlink_mian.告使用者);
            if (resn.statusCode == 200) {
                resn.body.string()

                $ui.post(() => {
                    var notice_ds = dialogs.build({
                        type: "app",
                        title: "声明",
                        content: resn.body.string(),
                        checkBoxPrompt: "不再提示",
                        cancelable: false,
                        positive: "我知道了",
                        negative: "使用说明",
                        neutral: "疑惑解答",
                        canceledOnTouchOutside: false
                    })
                        .on("negative", () => {
                            new_ui("浏览器", jlink_mian.使用说明)
                        })
                        .on("neutral", () => {
                            new_ui("浏览器", jlink_mian.疑惑解答)
                        })
                        .on("check", (checked) => {
                            if (checked) {
                                tool.writeJSON("公告", "关闭");
                            } else {
                                tool.writeJSON("公告", "公告")
                            }
                        })
                    $ui.post(() => {
                        /* var params = notice_ds.getWindow().getAttributes()
                         if (ui.card.getHeight() == device.width) {
                             params.width = Math.floor(device.height / 1.2);
                             params.height = Math.floor(device.width / 1.4);
                         } else {
                             params.width = device.width;
                             params.height = device.height;
                         }*/
                        notice_ds.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                        tool.setBackgroundRoundRounded(notice_ds.getWindow(), { radius: 0, })
                        $ui.post(() => {

                            notice_ds.show();
                        }, 50)
                    }, 100)
                }, 100)
            }
        } catch (err) {
            toast("无法连接服务器，请检查网络。错误类型:" + err);
            console.error("无法连接服务器，请检查网络。错误类型:" + err);
            engines.stopAll();
        };
    })
}


Update_UI(1)

function Update_UI(i) {

    ui._bgtxt.setText("模块\n配置")

    if (files.exists("./mrfz/tuku/gallery_info.json")) {
        gallery_info = JSON.parse(files.read("./mrfz/tuku/gallery_info.json"), (encoding = "utf-8"));
        language = (gallery_info.服务器 ? gallery_info.服务器 : gallery_info.server);

        change_list(ui.implement, Multistage_menu());
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
                if (language != "禁用服" && language != "空") {
                    ui.implement.setSelection(5, true);
                } else if (language != "空") {
                    ui.implement.setSelection(4, true);

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
    if (!setting.无人机加速) ui.rawrj.attr("visibility", "gone");
    if (setting.加速生产) {
        ui.raw1.checked = true;
    } else {
        ui.raw2.checked = true;
    }
    ui.xlkz.attr("visibility", "visible");
    if (SE执行 == 3) {
        ui.inputjm.attr("visibility", "visible");
        ui.inputxi.attr("visibility", "gone");
    }

    try {
        if (tool.script_locate("Floaty.js")) {
            ui.start.setText("停止运行")
        } else {
            ui.start.setText("开始运行");
        }
    } catch (err) { };
    switch (language) {
        case "日服":
        case "美服":
            return
        default:
            ui.indt.attr("visibility", "gone");
            ui.timed_tasks_list.attr("visibility", "gone");
            break
    }

    if (mod_data[0] == undefined) {
        ui._bgT.attr("visibility", "gone")
    } else {
        ui._bgT.attr("cardCornerRadius", "25dp");
    }
    if (setting.音量修复) {
        try {
            var gmvp = device.getMusicVolume()
            device.setMusicVolume(gmvp)
        } catch (err) {
            tool.dialog_tips("温馨提示", "没有修改系统设置权限！\n仅用于修复部分机型启动游戏后音量异常")
        }
    }
    //activity.setRequestedOrientation(1);
    //更新模拟器，虚拟机按钮颜色
    ui._bgA.attr("cardCornerRadius", "25dp");
    console.verbose("初始化PRTS配置完成")


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
function new_ui(name, url) {
    // let JS_file;
    let variable = "'ui';var theme = " + JSON.stringify(theme) + ";"; //require('./theme.js');";
    switch (name) {
        case "day":
            theme.setTheme("day");
            break
        case "night":
            theme.setTheme("night");
            break
        case '关于':
            engines.execScript("about_ui", variable + "require('./activity/about.js');");

            break;
        case '设置':
            variable = variable + ";function zoom(x) { return Math.floor((device.width / 1080) * x);};";
            engines.execScript("Basic_settings_ui", variable + "require('./activity/Basics.js');");
            break;
        case '日志':
            engines.execScript("journal_ui", variable + "require('./activity/journal.js')");
            //engines.execScript("journal_ui", java.lang.String.format("'ui';  var theme = storages.create('configure').get('theme_colors');require('./activity/journal.js');"));
            break;
        case '浏览器':
            toastLog("纯净版不可用")
            return
            //  engines.execScript("browser_ui", variable + "require('./lib/Builtinbrowser.js')");
            break;
        case '悬浮窗':
            engines.execScriptFile("./c_Floaty.js");

            break;

    }

}


//log(ui.viewpager.getChildCount())