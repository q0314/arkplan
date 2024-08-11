"ui";
try {
    ui.statusBarColor(theme.bar);
} catch (err) {
    var theme = require("../theme.js");

}
    var package_path = context.getExternalFilesDir(null).getAbsolutePath();

importClass(android.content.Context);
importClass(android.widget.AdapterView);
importClass(android.view.MenuItem);
importClass(android.graphics.BitmapFactory);
importClass(android.graphics.Bitmap);
importClass(android.graphics.drawable.BitmapDrawable);
const resources = context.getResources();
const scale = resources.getDisplayMetrics().density;
let log_level = "Verbose|Dedug|Info|Warn|Error|Assert"
ui.layout(
    <vertical>
        <appbar >
            <toolbar id="toolbar" bg="{{theme.bar}}" title="日志">
                <spinner id="log_level" textSize="15" entries="{{log_level}}" layout_gravity="right" />
            </toolbar>
        </appbar>
        
        <frame>
            <globalconsole id="globalconsole" margin="15 0 10 15" w="*" h="*"
            enabled="true" textIsSelectable="true" focusable="true" longClickable="true"/>
        </frame>
        
    </vertical>
);

ui.statusBarColor(theme.bar);
ui.globalconsole.setColor("V", "#bdbdbd");
ui.globalconsole.setColor("D", "#795548");
ui.globalconsole.setColor("I", "#1de9b6");
ui.globalconsole.setColor("W", "#673ab7");
ui.globalconsole.setColor("E", "#b71c1c");



ui.log_level.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
    onItemSelected: function(parent, view, position, id) {
        let _log_level = parent.getSelectedItem();
        ui.globalconsole.setLogLevel(_log_level[0]);

    }
}))
//在toolbar添加按钮

//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    let item = menu.add(0, 24, 0, '清空日志');
    //指定按钮显示的位置
    item.setShowAsAction(MenuItem.SHOW_AS_ACTION_IF_ROOM | MenuItem.SHOW_AS_ACTION_WITH_TEXT);
    //获取指定大小的内置资源Drawable
    let mDrawable = getResDrawable("ic_delete_black_48dp", 24);
    //图片着色
    mDrawable.setTint(colors.parseColor("#FFFFFF"));
    //设置item图标
    item.setIcon(mDrawable);

    item = menu.add("其他应用打开");
    item.setShowAsAction(MenuItem.SHOW_AS_ACTION_IF_ROOM | MenuItem.SHOW_AS_ACTION_WITH_TEXT);
    mDrawable = getResDrawable("ic_share_black_48dp", 24);
    mDrawable.setTint(colors.parseColor("#FFFFFF"));
    item.setIcon(mDrawable);

    menu.add("保存至下载目录");
    menu.add("导入日志(开发人员使用)")
});
var packageName = context.getPackageName();
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "清空日志":
            console.clear();
            ui.globalconsole.clear();
            break;
        case "其他应用打开":
            if (files.exists(package_path + "/logs/arkplan_log.txt")) {
                app.viewFile(package_path + "/logs/arkplan_log.txt");
                return
            }
            app.viewFile("/data/data/" + packageName + "/files/logs/log.txt");
            break;
        case "保存至下载目录":
            let path = files.path("/sdcard/Download/明日计划运行日志.txt");
            // log("文件是否存在："+files.exists(package_path+"/arkplan_log.txt"));
            if (files.exists(package_path + "/logs/arkplan_log.txt")) {
                log("文件是否存在：" + files.exists(package_path + "/logs/arkplan_log.txt"));
                if (files.copy(package_path + "/logs/arkplan_log.txt", path)) {
                    toastLog("成功保存至" + path);
                } else {
                    toastLog("保存" + path + "失败")

                }

                return
            };

            log("文件是否存在：" + files.exists("/data/data/" + packageName + "/files/logs/log.txt"));
            if (files.copy("/data/data/" + packageName + "/files/logs/log.txt", path)) {
                toastLog("成功保存至" + path);
            } else {
                toastLog("保存" + path + "失败")

            }

            break;
        case "导入日志(开发人员使用)":
            File_selector(".txt")
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function() {
        ui.finish();
    }
});

function getResDrawable(resName, size) {

    let oldBmp = BitmapFactory.decodeResource(resources, getResDrawableID(resName));

    let newBmp = Bitmap.createScaledBitmap(oldBmp, dp2px(size), dp2px(size), true);
    let drawable = new BitmapDrawable(resources, newBmp);
    oldBmp.recycle();
    return drawable;
}
/**

 * 获取内质资源 DrawableID

 * @param {*} name
 */
function getResDrawableID(name) {
    return resources.getIdentifier(name, "drawable", context.getPackageName());
}
/**
 * Dp转Px
 * @param {*} dp
 * @returns
 */
function dp2px(dp) {
    return parseInt(Math.floor(dp * scale + 0.5));
}

function File_selector(mime_Type, fun) {

    toastLog("请选择后缀为.txt类型的文件");

    threads.start(function() {
        let FileChooserDialog = require("../subview/file_chooser_dialog");
        FileChooserDialog.build({
            title: '请选择后缀为.txt的文件',
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
                if (file.indexOf(".txt") == -1) {
                    toast("不是后缀为.txt的文件");
                    console.error("不是后缀为.txt的文件");
                    return
                }
                console.clear();
                ui.globalconsole.clear();
                log("清空旧日志")
                console.info("选择的文件路径：" + file);
                if (files.exists(package_path + "/logs/arkplan_log.txt")) {
                    if (files.copy(file, package_path + "/logs/arkplan_log.txt")) {
                        return
                    };
                }
                if (!files.copy(file, "/data/data/" + packageName + "/files/logs/log.txt")) {
                    //   if(!files.copy(file,"/storage/emulated/0/Android/data/org.autojs.autojspro/files/logs/log.txt")){
                    toast("导入日志" + file + "失败")
                    console.error("导入日志" + file + "失败" + random(0, 9999))
                }
            }

        }).show()
    })
}