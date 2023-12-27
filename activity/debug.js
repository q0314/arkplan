"ui";
importClass(android.provider.Settings);
importClass(android.provider.Settings.System);
// 百度EasyEdge官网
// https://ai.baidu.com/easyedge/home

// 下载 百度超轻量级中文OCR模型 demo体验
// https://ai.baidu.com/easyedge/app/openSource


ui.layout(
    <vertical>
        <ScrollView>
            <vertical>
                <text gravity="center" textStyle="bold" textSize="30sp">
                    代码测试
                </text>
                <input id="代码内容" w="*" hint="">
                </input>

                <button id="执行代码">执行代码</button>
                <input id="脚本文件路径" w="*" hint="/sdcard/脚本/测试.js">
                </input>
                <horizontal>
                    <button id="input_file" layout_weight="1">选择脚本文件</button>
                    <button id="执行脚本文件" layout_weight="1">执行脚本文件</button>
                </horizontal>
                <input id="项目入口文件路径" hint="/storage/emulated/0/脚本/测试/main.js">
                </input>
                <horizontal>
                    <button id="input_file2" layout_weight="1">选择项目入口文件</button>
                    <button id="执行项目" layout_weight="2">执行项目</button>
                </horizontal>
                <horizontal>
                    <button id="日志" layout_weight="1">运行日志</button>
                    <button id="停止脚本" text="管理脚本" layout_weight="1">
                    </button>
                </horizontal>
                <horizontal>
                    <button id="指针位置" layout_weight="1">打开/关闭指针位置</button>
                </horizontal>
                <text id="text" color="#000000" textSize="15" margin="15" gravity="center" />
                <text id="ban" text="* 使用 Auto.js Pro v8.8.13 脚本引擎" color="#9e9e9e" textSize="10" gravity="center" />
            </vertical>
        </ScrollView>
    </vertical>
);
let banben = false;
if (app.autojs.versionCode > 8082200) {
    banben = true;
}
ui.代码内容.setHint('toastLog("hello");\nsleep(1000);\ntoastLog("你好");')
let route = context.getExternalFilesDir(null).getAbsolutePath();
route += "/dedug/";
if (!files.exists(route + "代码内容.js")) {
    files.ensureDir(route);
    files.create(route + "代码内容.js");
    files.create(route + "脚本文件路径.txt");
    files.create(route + "项目文件路径.txt");
    files.write(route + "代码内容.js", ui.代码内容.getHint());
    files.write(route + "脚本文件路径.txt", ui.脚本文件路径.getHint());
    files.write(route + "项目文件路径.txt", ui.项目入口文件路径.getHint());

}


try {
    ui.代码内容.setText(files.read(route + "代码内容.js"));
    ui.脚本文件路径.setText(files.read(route + "脚本文件路径.txt"));
    ui.项目入口文件路径.setText(files.read(route + "项目文件路径.txt"));
} catch (err) { }
ui.text.setText("注意！此功能仅供开发人员使用，小白用户请严格在开发者指导下使用！\n\n请不要运行来路不明的代码，以免造成隐私信息泄露等不可挽回的严重后果！")
ui.input_file.on("click", () => {
    File_selector(".js", 1);
})
ui.input_file2.on("click", () => {
    File_selector(".js");
})

function File_selector(mime_Type, fun) {
    toastLog("请选择后缀为.js类型的文件");
    threads.start(function () {
        let FileChooserDialog = require("../subview/file_chooser_dialog");
        FileChooserDialog.build({
            title: '请选择后缀为.js的文件',
            type: "app-or-overlay",
            // 初始文件夹路径
            dir: "/sdcard/",
            // 可选择的类型，file为文件，dir为文件夹
            canChoose: ["file"],
            mimeType: mime_Type,
            wrapInScrollView: true,
            // 选择文件后的回调
            fileCallback: (file) => {
                if (file == null) {
                    toastLog("未选择路径");
                    return
                }
                if (file.indexOf(".js") == -1) {
                    toast("不是后缀为.js的文件");
                    console.error("不是后缀为.js的文件");
                    return
                }
                console.info("选择的文件路径：" + file);
                if (fun == 1) {
                    ui.脚本文件路径.setText(file);
                } else {
                    ui.项目入口文件路径.setText(file);
                }
            }

        }).show()
    })
}

function internet(i) {

    try {
        app.startActivity({
            action: "android.intent.action.VIEW", //此处可为其他值
            packageName: "com.android.settings",
            className: "com.android.settings.Settings$DevelopmentSettingsDashboardActivity",
            //此处可以加入其他内容，如data、extras
        });
    } catch (err) {
        app.startActivity({
            action: "android.intent.action.VIEW", //此处可为其他值
            packageName: "com.android.settings",
            className: "com.android.settings.Settings$DevelopmentSettingsActivity"
        });
    }
}

ui.指针位置.click(function () {
    threads.start(function () {
        let state;
        try {
            state = Settings.System.getInt(context.getContentResolver(), Settings.System.POINTER_LOCATION)
        } catch (e) {
            console.error(e)
            state = shell("su -c 'settings get system pointer_location'").result;
            log(state)
        }
        if (shell("su -c 'settings put system pointer_location " + (state ? "0" : "1") + "'").code != 0) {
            if (state != 1) {
                var DHK = ui.inflate(
                    <frame background="#ffffff" padding="5">
                        <scroll bg="#ffffff">
                            <vertical bg="#ffffff" margin="10">
                                <text id="text0" textColor="#000000" />

                                <img src="file://res/Pointer_position.png" w="*" h="auto" marginBottom="-10" />

                            </vertical>
                        </scroll>
                    </frame>, null, false);
                DHK.text0.setText("请在接下来即将跳转的界面中，找到下面图片所示的选项：指针位置 打开。\n打开后如下图所示，点击屏幕时，顶部会显示x、y坐标值")
                var ControlDHK = dialogs.build({
                    type: "app-or-overlay",
                    customView: DHK,
                    //  positive:"好的",
                    wrapInScrollView: false,
                    autoDismiss: true
                }).on("dismiss", (dialog) => {
                    internet()
                }).show()
            } else {
                internet("Tips")
            }
        } else {
            toastLog("ADB已为您自动" + (state ? "关闭" : "打开") + "指针位置");
        }
    })
})

ui.执行代码.click(function () {
    var js = ui.代码内容.text().toString();
    engines.execScript("测试.js", js);

});
ui.执行脚本文件.click(function () {
    if (!files.exists(ui.脚本文件路径.text())) {
        toastLog("该路径文件不存在");
        return
    }
    if (banben) {
        $engines.startFloatingController(ui.脚本文件路径.text().trim())
    } else {
        engines.execScriptFile(ui.脚本文件路径.text().trim(), {
            path: files.path('./')
        });
    }
});

ui.执行项目.click(function () {
    let entryFilePath = ui.项目入口文件路径.text().trim();
    if (!files.exists(entryFilePath)) {
        toastLog("该路径文件不存在");
        return
    }

    engines.execScriptFile(entryFilePath, {
        path: entryFilePath.replace(/\/[\w.]+?$/, "")
    });
});
ui.日志.click(function () {
    /*  let variable = "'ui';var theme = require('./theme.js');"
  
      engines.execScript("journal_ui", variable + "require('./activity/journal.js')");
      return*/
    app.startActivity("console");
});
ui.停止脚本.click(function () {
    require('../subview/script.js').Administration()
    return
    engines.all().map((ScriptEngine) => {
        if (engines.myEngine().toString() !== ScriptEngine.toString()) {
            ScriptEngine.forceStop();
        }
    });
});

//当离开本界面时保存
ui.emitter.on("pause", () => {
    try {
        files.write(route + "代码内容.js", ui.代码内容.text());
        files.write(route + "脚本文件路径.txt", ui.脚本文件路径.text());
        files.write(route + "项目文件路径.txt", ui.项目入口文件路径.text());
    } catch (err) {
        console.error("测试代码路径保存失败" + err)
    }

})

if (banben) {
    ui.ban.setText("* 使用 Auto.js Pro v9.3.7 rhino脚本引擎")
}