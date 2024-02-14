"ui";
var color = "#4C484C";
var frameColor = "#7E787F";
var textColor = "#CCCCCC";
var img_scriptIconColor = "#057E787F";
ui.statusBarColor("#4C484C");
ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar background="#4C484C">
                <toolbar id="toolbar" title="脚本模块平台" />

                <tabs id="tabs" />
            </appbar>
            {/* 启动时网络不好等待加载的动画效果 */}
            <vertical id="waitForDownload_0" bg="{{frameColor}}" gravity="center" w="*" h="50">
                <linear w="auto">
                    <img id="img_waitForDownload"
                        src="@drawable/ic_rotate_right_black_48dp"
                        w="20" h="20" />
                    <linear gravity="center" h="*">
                        <text id="str_waitForDownload"
                            text="正在拉取数据..."
                            textSize="11sp"
                            textColor="{{textColor}}" />
                    </linear>
                </linear>
            </vertical>
            <vertical id="noData_0" bg="{{frameColor}}" gravity="center" w="*" h="50" >
                <linear w="auto">
                    <text id="str_noData"
                        text="暂无数据,请刷新..."
                        textSize="13sp" visibility="gone"
                        textColor="{{textColor}}" />
                </linear>
            </vertical>
            <frame background="{{frameColor}}">
                <viewpager id="viewpager" background="{{frameColor}}" marginBottom="80">
                    <frame> {/** 第一屏布局*/}
                        <vertical>
                            {/* <android.support.v4.widget.SwipeRefreshLayout> */}

                            <list id="files_0" layout_weight="1" >
                                <vertical w="*">
                                    <horizontal layout_height="wrap_content" margin="10 5"
                                    >
                                        {/* 脚本Icon */}
                                        {/*
                                        <img src="@drawable/ic_cloud_done_black_48dp"
                                        tint="white"
                                        bg ="{{img_scriptIconColor}}"
                                        w="35"
                                        h="35"
                                        margin="10 5 10 2" />
                                        */}
                                        {/* 脚本名称 */}
                                        <text id="script_name" textSize="16sp" textColor="#FFFFFF" text="{{this.script_name}}"
                                            maxLines="1" ellipsize="end" layout_gravity="center|left" />
                                        {/**把布局左边占满,让剩下的布局靠右*/}
                                        <linear layout_width="0dp"
                                            layout_weight="1">
                                        </linear>

                                        {/* 下载按钮图标 */}
                                        <img id="download" src="@drawable/ic_move_to_inbox_black_48dp" tint="#CCCCCC" bg="{{img_scriptIconColor}}"
                                            w="30" h="30" layout_gravity="center|right" />

                                    </horizontal >

                                    {/* 开发者名称 */}
                                    <horizontal layout_width="wrap_content" layout_height="wrap_content" margin="10 -5 5 0">
                                        <text id="developer"
                                            textSize="10sp" textColor="{{textColor}}"
                                            text="开发者：{{this.developer ? this.developer : '佚名'}}"
                                            maxLines="1" ellipsize="end" />
                                        {/* 脚本版本号 */}
                                        <text id="version" textSize="10sp"
                                            textColor="{{textColor}}" text="版本号：{{this.version}}"
                                            marginLeft="15" maxLines="1" ellipsize="end" />
                                        {/* 更新时间 */}
                                        <text id="update_time" textSize="10sp" textColor="{{textColor}}"
                                            text="更新时间：{{this.update_time ? this.update_time : '未知'}}"
                                            marginLeft="10" maxLines="1" ellipsize="end" />
                                    </horizontal>

                                    {/* 开发者的话 */}
                                    <text id="description" textSize="13sp" textColor="#dcdcdc"
                                        text="开发者的话：{{this.description ? this.description : '这个人什么也不想说' }}"
                                        margin="10 2" ellipsize="end" />
                                    {/* 分割线填充 */}
                                    <View id="fill_line" w="*" h="1" bg="{{color}}">
                                    </View>

                                </vertical>
                            </list>
                            {/* </android.support.v4.widget.SwipeRefreshLayout> */}
                        </vertical>
                    </frame>

                    <frame> {/** 第二屏布局*/}
                        <vertical>
                            <list id="files_1" layout_weight="1" >
                                <vertical w="*">
                                    <horizontal layout_height="wrap_content" margin="10 5"
                                    >
                                        {/* 脚本Icon */}
                                        {/*
                                        <img src="@drawable/ic_cloud_done_black_48dp"
                                        tint="white"
                                        bg ="{{img_scriptIconColor}}"
                                        w="35"
                                        h="35"
                                        margin="10 5 10 2" />
                                        */}
                                        {/* 脚本名称 */}
                                        <text id="script_name" textSize="16sp" textColor="#FFFFFF" text="{{this.script_name}}"
                                            maxLines="1" ellipsize="end" layout_gravity="center|left" />
                                        {/**把布局左边占满,让剩下的布局靠右*/}
                                        <linear layout_width="0dp"
                                            layout_weight="1">
                                        </linear>

                                        {/* 下载按钮图标 */}
                                        <img id="download" src="@drawable/ic_move_to_inbox_black_48dp" tint="#CCCCCC" bg="{{img_scriptIconColor}}"
                                            w="30" h="30" layout_gravity="center|right" />

                                    </horizontal >

                                    {/* 开发者名称 */}
                                    <horizontal layout_width="wrap_content" layout_height="wrap_content" margin="10 -5 5 0">
                                        <text id="developer"
                                            textSize="10sp" textColor="{{textColor}}"
                                            text="开发者：{{this.developer ? this.developer : '佚名'}}"
                                            maxLines="1" ellipsize="end" />
                                        {/* 脚本版本号 */}
                                        <text id="version" textSize="10sp"
                                            textColor="{{textColor}}" text="版本号：{{this.version}}"
                                            marginLeft="15" maxLines="1" ellipsize="end" />
                                        {/* 更新时间 */}
                                        <text id="update_time" textSize="10sp" textColor="{{textColor}}"
                                            text="更新时间：{{this.update_time ? this.update_time : '未知'}}"
                                            marginLeft="10" maxLines="1" ellipsize="end" />
                                    </horizontal>

                                    {/* 开发者的话 */}
                                    <text id="description" textSize="13sp" textColor="#dcdcdc"
                                        text="开发者的话：{{this.description ? this.description : '这个人什么也不想说' }}"
                                        margin="10 2" ellipsize="end" />
                                    {/* 分割线填充 */}
                                    <View id="fill_line" w="*" h="1" bg="{{color}}">
                                    </View>

                                </vertical>
                            </list>

                        </vertical>
                    </frame>

                    <frame> {/** 第三屏布局*/}
                        <list id="files_2" layout_weight="1" >
                            <vertical w="*">
                                <horizontal layout_height="wrap_content" margin="10 5"
                                >
                                    {/* 脚本Icon */}
                                    {/*
                                        <img src="@drawable/ic_cloud_done_black_48dp"
                                        tint="white"
                                        bg ="{{img_scriptIconColor}}"
                                        w="35"
                                        h="35"
                                        margin="10 5 10 2" />
                                        */}
                                    {/* 脚本名称 */}
                                    <text id="script_name" textSize="16sp" textColor="#FFFFFF" text="{{this.script_name}}"
                                        maxLines="1" ellipsize="end" layout_gravity="center|left" />
                                    {/**把布局左边占满,让剩下的布局靠右*/}
                                    <linear layout_width="0dp"
                                        layout_weight="1">
                                    </linear>

                                    {/* 下载按钮图标 */}
                                    <img id="download" src="@drawable/ic_move_to_inbox_black_48dp" tint="#CCCCCC" bg="{{img_scriptIconColor}}"
                                        w="30" h="30" layout_gravity="center|right" />

                                </horizontal >

                                {/* 开发者名称 */}
                                <horizontal layout_width="wrap_content" layout_height="wrap_content" margin="10 -5 5 0">
                                    <text id="developer"
                                        textSize="10sp" textColor="{{textColor}}"
                                        text="开发者：{{this.developer ? this.developer : '佚名'}}"
                                        maxLines="1" ellipsize="end" />
                                    {/* 脚本版本号 */}
                                    <text id="version" textSize="10sp"
                                        textColor="{{textColor}}" text="版本号：{{this.version}}"
                                        marginLeft="15" maxLines="1" ellipsize="end" />
                                    {/* 更新时间 */}
                                    <text id="update_time" textSize="10sp" textColor="{{textColor}}"
                                        text="更新时间：{{this.update_time ? this.update_time : '未知'}}"
                                        marginLeft="10" maxLines="1" ellipsize="end" />
                                </horizontal>

                                {/* 开发者的话 */}
                                <text id="description" textSize="13sp" textColor="#dcdcdc"
                                    text="开发者的话：{{this.description ? this.description : '这个人什么也不想说' }}"
                                    margin="10 2" ellipsize="end" />
                                {/* 分割线填充 */}
                                <View id="fill_line" w="*" h="1" bg="{{color}}">
                                </View>

                            </vertical>
                        </list>

                    </frame>



                </viewpager>
                <card w="50dp" h="50dp" id="_bgT" cardBackgroundColor="#4C484C" layout_gravity="bottom|right"
                    marginRight="20" marginBottom="20" cardCornerRadius="25dp" scaleType="fitXY">
                    <text w="*" h="*" id="Import" textColor="#ffffff"
                        gravity="center" text="导入模块" textSize="13sp"
                        foreground="?selectableItemBackground" />
                </card>
                <text id="h_text" margin="20 20 70 10" autoLink="web" h="auto" enabled="true" textIsSelectable="true" focusable="true" longClickable="true"
                    layout_gravity="bottom" />

            </frame>
        </vertical>

    </drawer>
);

//设置滑动页面的标题
ui.viewpager.setTitles(["执行模式模块", "关闭应用模块", "基建换班模块", "解锁屏幕模块"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);

activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function () {
        ui.finish();
    }
});

//仓库主页地址
let Warehouse_url = "https://gitee.com/q0314/script-module-warehouse/raw/master";

ui.h_text.setText("模块仓库所有模块均属于开源项目，详情查看gitee：" + Warehouse_url.replace("raw", "tree"))


var dwadlink = storages.create("Doolu_download");
let set_up = dwadlink.get("data", {
    delete_zip: true,
    download_catalogue: files.path("/sdcard/脚本/模块下载目录/")
})
var path,
    tool;
try {
    tool = require("./modules/tool.js");
} catch (err) {

    tool = require("../modules/tool.js")
}

if (!!!set_up.download_catalogue) {
    set_up.download_catalogue = files.path("/sdcard/脚本/模块下载目录/")
    dwadlink.put("data", set_up);
}
path = set_up.download_catalogue

var delete_zip = true,
    import_js = true;
if (set_up.delete_zip != undefined) {
    delete_zip = set_up.delete_zip
}
if (set_up.import_js != undefined) {
    import_js = set_up.import_js
}
let progressDialog = false;

//创造右上角菜单
ui.emitter.on("create_options_menu", menu => {
    menu.add("刷新")
    //menu.add("关于");
    menu.add("设置");
    menu.add("如何上传我的模块?")
});
ui.Import.setText("导入\n模块")
ui.Import.click(() => {
    File_selector(".js")

})

ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "刷新":
            ui.waitForDownload_0.setVisibility(0);
            threads.start(waitForDownload_Thread)
            刷新()
            break;
        case "如何使用模块？":
            toast("明日计划-左上角头像-设置-导入自定义执行模块-选择文件")
            break
        case "如何上传我的模块?":
            var DHK = ui.inflate(
                <vertical background="#ffffff" padding="5">
                    <ScrollView>
                        <vertical h="*">
                            <text id="text0" textColor="#000000" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />
                            <text id="text1" margin="10 0" autoLink="web" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />
                            <img h="250" src="{{Warehouse_url}}/%E6%8F%90%E4%BA%A4%E8%AF%B4%E6%98%8E.png" />
                            <text id="text2" margin="10 0" autoLink="web" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />
                        </vertical>
                    </ScrollView>
                </vertical>, null, false);
            DHK.text1.setText("脚本模块平台仓库主页链接：" + Warehouse_url.replace("raw", "tree"))
            DHK.text2.setText('.json信息示例:\n{' +
                '\n"script_name": "脚本名称",' +
                '\n"developer": "开发者名称",' +
                '\n"version":"版本号",' +
                '\n"update_time":"更新时间",' +
                '\n"description": "脚本描述",' +
                '\n"download_link":"下载链接。不知道怎么获取？打开已经上传的文件。复制链接，把' + Warehouse_url.replace("raw", "blob") + '删除掉，留斜杠（包括斜杠/）后面的即可"' +
                '\n}')
            var ControlDHK = dialogs.build({
                type: "app-or-overlay",
                customView: DHK,
                positive: "好的",
                neutral: "复制json模板",
                wrapInScrollView: false,
                autoDismiss: true
            }).on("neutral", () => {
                setClip(',{' +
                    '\n"script_name": "",' +
                    '\n"developer": "",' +
                    '\n"version":"",' +
                    '\n"update_time":"",' +
                    '\n"description": "",' +
                    '\n"download_link":""' +
                    '\n}')
                toast("已复制")
            }).show()
            break
        case "设置":
            let otherSettingView = ui.inflate(
                <vertical padding="20 10">

                    <horizontal>
                        <text text="解压zip成功后删除zip  " textColor="#999999" />
                        <checkbox id="delete_zip" checked="{{delete_zip}}" />
                    </horizontal>
                    <View bg="#666666" h="1" w="*" />
                    <horizontal>
                        <text text="下载单js文件成功后自动导入  " textColor="#999999" />
                        <checkbox id="import_js" checked="{{import_js}}" />
                    </horizontal>
                    <View bg="#666666" h="1" w="*" />
                    <horizontal>
                        <text text="更改下载目录:" textColor="#999999" />
                        <input id="download_catalogue" w="*" hint="{{path}}" />
                    </horizontal>
                    <View bg="#666666" h="1" w="*" />
                </vertical>, null, false);
            //设置对话框
            dialogs.build({
                type: "app-or-overlay",
                customView: otherSettingView,
                title: "设置",
                titleColor: "#DDDDDD",
                wrapInScrollView: false,
                autoDismiss: false
            }).show()
            otherSettingView.getParent().getParent().attr("bg", "#424242");
            otherSettingView.import_js.on("check", (checked) => {
                set_up.import_js = checked
                dwadlink.put("data", set_up);
                import_js = checked;
            });
            otherSettingView.delete_zip.on("check", (checked) => {
                set_up.delete_zip = checked
                dwadlink.put("data", set_up);
                delete_zip = checked;
            });
            otherSettingView.download_catalogue.on("key", function (keyCode, event) {
                if (event.getAction() == 0 && keyCode == 66) {
                    let text = otherSettingView.download_catalogue.text()
                    if (text.charAt(text.length - 1) != "/") {
                        text = text + "/";
                    }
                    set_up.download_catalogue = files.path(text)
                    dwadlink.put("data", set_up);
                    path = text
                    otherSettingView.download_catalogue.setHint(text)
                    otherSettingView.download_catalogue.setText(null)
                    event.consumed = true;
                }
            });
            break
    }
})


//获取数据时的等待效果
var waitForDownload_Thread = threads.start(function () {
    for (; ;) {
        for (r = 0, t = 0; ;)
            if (r += .23, t += r, ui.run(() => {
                ui.img_waitForDownload.setRotation(t)
            }),
                ui.img_waitForDownload.getRotation() >= 180) break;
        for (; ;)
            if (r -= .23, t += r, ui.run(() => {
                ui.img_waitForDownload.setRotation(t)
            }), ui.img_waitForDownload.getRotation() >= 360) break;
    }
});
刷新()

function 刷新() {
    threads.start(function () {
        if (!Pull_content(ui.files_0, Warehouse_url + "/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%89%A7%E8%A1%8C%E6%A8%A1%E5%9D%97/Custom_executio_list.json")) {
            ui.run(() => {
                ui.noData_0.setVisibility(0)
            })
        } else {
            waitForDownload_Thread.interrupt();
        }
        Pull_content(ui.files_1, Warehouse_url + "/%E5%85%B3%E9%97%AD%E5%BA%94%E7%94%A8%E6%A8%A1%E5%9D%97/close_app_list.json")

    })

    threads.start(function () {
        Pull_content(ui.files_2, Warehouse_url + "/%E5%9F%BA%E5%BB%BA%E6%8D%A2%E7%8F%AD%E6%A8%A1%E5%9D%97/Infrastructure_list.json")
    })
}

function download(url, name) {
    let datali = {}
    datali.download_catalogue = path;
    if (url.indexOf("/script_file/") != -1 && url.indexOf(Warehouse_url) == -1) {
        console.verbose("自动补全");
        url = Warehouse_url + url;

    }
    url = url.replace("/blob/", "/raw/");
    console.verbose(url);

    datali.id = "模块";
    datali.link = url;
    datali.myPath = path;
    name = name + (datali.link.endsWith(".js") ? ".js" : ".zip")
    datali.fileName = name;
    dwadlink.put("data", datali);


    try {
        engines.execScriptFile("./lib/download.js");
    } catch (e) {
        engines.execScriptFile("../lib/download.js")
    }

    //监听脚本间广播'download'事件

    events.broadcast.on("download" + datali.id, function (X) {
        if (X.name == "进度") {
            if (progressDialog) {
                ui.run(() => {
                    progressDialog.setProgress(X.data);
                })
            }
        } else if (X.name == "结果") {
            if (X.data == "下载完成") {
                try {
                    let listeners = events.broadcast.listeners("download" + datali.id);
                    events.broadcast.removeListener("download" + datali.id, listeners[0]);
                    delete listeners;
                } catch (e) {
                    console.error(e);
                }
                if (progressDialog) {
                    progressDialog.setContent("正在解压中...");
                }
                files.ensureDir(path + name);

                console.info(path + name)
                if (!name.endsWith(".js")) {
                    switch (copy(path + name, path + name.replace(files.getName(path + name), ""))) {

                        case "js":
                            files.removeDir(path + name);
                            files.copy(path + name, path + name.replace(files.getName(path + name), ""));
                            files.remove(path + name);
                            if (import_js) {
                                modular_id(path + name.replace(files.getName(path + name)));
                            }
                            break
                        case true:
                            if (delete_zip) {
                                files.remove(path + name);
                                if (progressDialog) {
                                    progressDialog.setContent("删除源文件中...");
                                };
                            }
                            break
                    }
                }
                $ui.post(() => {
                    if (progressDialog) {
                        progressDialog.dismiss();
                        progressDialog = false;
                        snakebar("已下载至" + path + name.replace(files.getName(path + name), ""));
                    }
                    if (import_js) {
                        modular_id(path + name);
                    }
                    //  name = null;

                }, 10);


                return
            }
        } else if (X.name == "关闭") {
            try {
                let listeners = events.broadcast.listeners("download" + datali.id);
                events.broadcast.removeListener("download" + datali.id, listeners[0]);
                delete listeners;
            } catch (e) {
                console.error(e);
            }
            if (progressDialog) {
                progressDialog.dismiss();
                progressDialog = false;
            }

            snakebar("这都下载不了？加入官方频道下载");



            return
        }

    });
}

function copy(p1, p2) {
    p1 = files.path(p1);
    p2 = files.path(p2)
    try {
        $zip.unzip(p1, p2);
    } catch (ezip) {
        if (!files.exists(p1)) {
            toastLog("解压缩异常，该路径文件不存在，\n错误报告:" + ezip)
        } else {
            return "js";
        }

        return false;
    }
    return true;
}

function Pull_content(id, url) {
    try {
        let jlink = http.get(url);

        if (jlink.statusCode == 200) {
            jlink = JSON.parse(jlink.body.string())
            ui.run(function () {
                switch (id) {
                    case ui.files_0:
                        //  Script_information[0] = jlink;
                        ui.waitForDownload_0.setVisibility(8)
                        ui.noData_0.setVisibility(8)
                        break;
                    case ui.files_1:
                        // Script_information[1] = jlink;
                        break
                    case ui.files_2:
                        // Script_information[2] = jlink;
                        break;
                    case ui.files_3:
                        // Script_information[3] = jlink;
                        break
                    default:
                        // code
                        toastLog("未匹配到的ui")
                        break
                }

                id.setDataSource(jlink)
            })
            return true;
        } else {
            toast("云端配置请求失败!，请检查网络：\n" + jlink.statusMessage);
            console.error("云端配置请求失败!，请检查网络：\n" + jlink.statusMessage);
            return false
        }
    } catch (err) {
        toast("似乎无法连接服务器，错误类型:" + err)
        console.error("似乎无法连接服务器，错误类型:" + err)
        return false
    };
}

function inspect(list) {
    let jssf;
    if (files.exists(path + list.script_name + ".js")) {
        snakebar("指定下载目录存在相同文件名")
        jssf = true
    }

    if (files.exists(path + list.script_name + ".zip")) {
        snakebar("指定下载目录存在相同文件名")
        jssf = true
    }
    if (jssf) {
        confirm("指定下载目录存在相同文件名，继续下载将会被覆盖，确定吗？").then(value => {
            if (value) {
                if (!progressDialog) {
                    download(list.download_link, list.script_name)
                    progressDialog = dialogs.build({
                        type: "app",
                        progress: {
                            max: 50,
                            //  showMinMax: true
                        },
                        content: "正在下载中...",
                        //    customView: dowui,
                        cancelable: false,
                        canceledOnTouchOutside: false
                    }).show()
                } else {
                    snakebar("你的操作太快啦");
                }
            }
        });
        return
    }
    if (!progressDialog) {
        download(list.download_link, list.script_name)
        progressDialog = dialogs.build({
            type: "app",
            progress: {
                max: 50,
                //  showMinMax: true
            },
            content: "正在下载中...",
            //    customView: dowui,
            cancelable: false,
            canceledOnTouchOutside: false
        }).show()
    } else {
        snakebar("你的操作太快啦");
    }
}

function File_selector(mime_Type, fun) {
    let FileChooserDialog;
    try {
        FileChooserDialog = require("./subview/file_chooser_dialog");
    } catch (err) {
        FileChooserDialog = require("../subview/file_chooser_dialog");
    }
    let FileChooserDialog_ = FileChooserDialog.build({
        title: '请选择后缀为.js的文件',
        type: "app-or-overlay",
        // 初始文件夹路径
        dir: "/sdcard/脚本/",
        // 可选择的类型，file为文件，dir为文件夹
        canChoose: ["file"],
        mimeType: mime_Type,
        neutral: "输入路径导入",
        wrapInScrollView: true,
        // 选择文件后的回调
        fileCallback: (file) => {
            if (file == null) {
                toastLog("未选择路径");
                return
            }

            console.info("选择的文件路径：" + file);
            modular_id(file)

        },
        neutralback: (file) => {
            FileChooserDialog_.dismiss()
            dialogs.build({
                title: "请输入主文件路径",
                type: "app",
                inputPrefill: "",
            }).on("input", (input) => {
                modular_id(input)
            }).show();
        },
    }).show();

}


var sto_mod = storages.create("modular")
var mod_data = sto_mod.get("modular", []);

function modular_id(file) {
    threads.start(function () {
        if (files.getExtension(file) != "js") {
            toast("不是后缀为.js的文件");
            console.error("不是后缀为.js的文件");
            return
        }
        try {
            let modular = require(file);
            var route_c = modular.import_configuration({
                'cwd': file.replace(files.getName(file), ""),
                'getSource': file,
                'getinterface': '模块仓库',
            });

        } catch (err) {
            toast("执行.js发生错误:" + err + "。\n可能非标准插件模块，请参考相关示例修改");
            console.error("执行.js发生错误:" + err + "。\n可能非标准插件模块，请参考相关示例修改")
            return
        }
        try {
            log(route_c.id)
        } catch (err) {
            toast("无法获取模块id，非标准插件模块，请参考相关示例修改")
            console.error("无法获取模块id，非标准插件模块，请参考相关示例修改\n" + err)
            return
        }

        switch (route_c.id) {
            case '自定义':
                tool.writeJSON("custom", file);

                break
            case '屏幕解锁':

                let storage = storages.create("time");
                storage.put("password", file);
                break
            case '关闭应用':
                tool.writeJSON("公告", true);
                tool.writeJSON("关闭应用", file);
                break;
            case '基建换班':
                tool.writeJSON("基建换班", true);
                tool.writeJSON("换班路径", file);
                break;
            default:
                snakebar("未匹配到相应模块id，非标准插件模块，请参考其他相关示例模块修改")
                return
        }
        snakebar("确认ID完成，" + route_c.id + "模块导入成功!");
        if (route_c.modular_configuration != undefined) {
            if (route_c.modular_configuration.open) {
                for (var i = 0; i < mod_data.length; i++) {
                    if (mod_data[i].id == route_c.id) {
                        mod_data.splice(i, 1);
                    }
                }

                mod_data.push({
                    id: route_c.id,
                    pre_run: route_c.pre_run_configuration ? true : false,
                    pre_run_check: false,
                    script_name: route_c.modular_configuration.script_name,
                    developer: route_c.modular_configuration.developer,
                    version: route_c.modular_configuration.version
                })

            }
        }
        sto_mod.put("modular", mod_data)

    })
}
ui.files_0.on("item_bind", function (itemView, itemHolder) {
    //绑定点击事件
    itemView.download.on("click", function () {
        inspect(itemHolder.item)
    })
})
ui.files_1.on("item_bind", function (itemView, itemHolder) {
    //绑定点击事件
    itemView.download.on("click", function () {
        inspect(itemHolder.item)
    })
})
ui.files_2.on("item_bind", function (itemView, itemHolder) {
    //绑定点击事件
    itemView.download.on("click", function () {
        inspect(itemHolder.item)
    })
})


function snakebar(text) {
    com.google.android.material.snackbar.Snackbar.make(ui.toolbar, text, 2000).show();
}