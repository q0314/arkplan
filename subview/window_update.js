//"ui";
//设置状态栏颜色
//ui.statusBarColor("#1E90FF");

/*
 * @Author: 大柒
 * @QQ: 531310591@qq.com
 * @Date: 2021-12-09 15:48:45
 * @Version: Auto.Js Pro
 * @Description: 
 * @LastEditors: 大柒
 * @LastEditTime: 2019-05-20 16:55:45
 */

//启用本脚本的使用安卓资源的特性
//ui.useAndroidResources();明日计划_

//设置自定义主题
//activity.theme.applyStyle(colors.parseColor("#ffff0000"), true);

importClass(android.graphics.drawable.GradientDrawable.Orientation);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.widget.AdapterView);

var w = 520;
var h = 670;
var v = (device.width > device.height) ? device.height : device.width;
v = v / 5 * 4 / w;
var path_img = "file://./res/download_bg-1.png";
if (!files.exists('./res/download_bg-1.png')) {
    path_img = "file://../res/download_bg-1.png";
}
var age = storages.create("Doolu_download");
var data = age.get("data");

var dui = {};
function vl(x) {
    return parseInt(x * v) + "px"
}

window_view = function (callback_click_update,callback_down_file) {

    data = age.get("data");
 
    var downLoadLayout = function () {
        util.extend(downLoadLayout, ui.Widget);

        function downLoadLayout() {
            ui.Widget.call(this);
            this.defineAttr("close", (view, attr, value, defineSetter) => {
                //  let a = data;
                view._ver.setText(data.ver);
                view._content.setText(data.text);
                view._title.setText(data.title ? data.title : "发现新版本");
                if (data.butClose == "false" || data.butClose == false) {
                    view._close.attr("visibility", "visible");
                    view.exit.attr("visibility", "visible");
                }
              
                if(!data.link32||!data.link64){
                    view.banben.setVisibility(8);
                };
                dui = view;
            });
        }
        downLoadLayout.prototype.render = function () {
            return (
                <frame w="{{vl(w)}}" h="{{vl(h)}}" >
                    <img w="{{vl(w)}}" h="{{vl(h)}}" src="{{path_img}}" layout_gravity="center" />
                    <vertical w="*" h="*" marginTop="{{vl(50)}}" >

                        <vertical marginLeft="{{vl(25)}}" marginRight="{{vl(25)}}">
                            <horizontal>
                                <text id="_title" w="*" text="" textColor="#ffffff" textStyle="bold" textSize="{{vl(38)}}" />
                                <img id="exit" src="@drawable/ic_close_black_48dp" w="25" marginLeft="-30" marginTop="5" visibility="gone" />

                            </horizontal>
                            <text id="_ver" marginTop="-5" text="V1.0.1-0" textColor="#FF4500" textStyle="bold" textSize="{{vl(35)}}" alpha="0.9" />
                            <scroll marginTop="{{vl(40)}}" h="{{vl(400)}}" >
                                <text id="_content" textColor="#000000" textStyle="bold" paddingBottom="{{vl(35)}}" />
                            </scroll>

                        </vertical>
                    </vertical>

                    <vertical w="*" h="auto" layout_gravity="bottom" >
                        <horizontal h="auto" >
                            <checkbox id="cb1" w="auto" text="此版本不再提示" textColor="#696969" layout_gravity="center|left" marginLeft="10" />
                            <vertical w="*" gravity="right" >
                            <spinner id="banben" entries="64位|32位" h="{{vl(75)}}" w="auto" marginRight="10" />
                            </vertical>
                        </horizontal>
                        <progressbar id="_progress" marginBottom="-10" marginTop="-8" w="*" visibility="gone" style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal" />
                        <vertical w="*" h="1" bg="#e3e3e3" />
                        <horizontal id="_but" h="*" w="*" >
                            <horizontal id="_close" w="*" layout_weight="1" visibility="gone">
                                <button w="*" h="*" marginRight="-1" id="_butClose" text="暂不更新" textSize="18" textStyle="bold" textColor="#999999" style="Widget.AppCompat.Button.Borderless" />
                                <vertical w="1" h="*" marginLeft="-1" bg="#e3e3e3" />
                            </horizontal>
                            <button w="*" h="*" id="_download" text="立即更新" textSize="18" textStyle="bold" textColor="#3087fe" layout_weight="1" style="Widget.AppCompat.Button.Borderless" />
                            <button w="*" h="auto" id="_text" text="下载中 0%" textSize="18" textStyle="bold" textColor="#3087fe" style="Widget.AppCompat.Button.Borderless" visibility="gone" />
                        </horizontal>
                    </vertical>
                </frame>
            )
        }
        ui.registerWidget("download-layout", downLoadLayout);
        return downLoadLayout;
    }()


    //ui.layout(
    var win;
    // win= floaty.rawWindow(
    win = ui.inflate(
        <vertical margin="0 0" bg="#00000000" >
            <ScrollView>
                <frame w="*" h="*" >
                    <download-layout w="{{vl(w)}}" h="{{vl(h)}}" close="" bg="#00000000" layout_gravity="center" />
                </frame>
            </ScrollView>
        </vertical>)
    //ui下移除
    //win.setSize(-1, -1);

    var download_box = dialogs.build({
        customView: win,
        type: "app",
        wrapInScrollView: false,
        autoDismiss: false,
        cancelable: false,
        canceledOnTouchOutside: false
    }).show();

   
    try {

        //设置对话框背景透明
        download_box.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
    } catch (err) { }

    dui._butClose.click(() => {
        threads.shutDownAll();
        download_box.dismiss();
        exit();

    })
    dui.exit.click(() => {
        threads.shutDownAll();
        download_box.dismiss();

        exit();
    })
    dui.cb1.on("check", (checked) => {
        let to_configure = {};
        to_configure.Tips = checked;
        to_configure.edition = data.ver;
        age.put("Prompt_new_version", to_configure);

    });
    let Prompt_new_version = age.get("Prompt_new_version")
    if (Prompt_new_version && Prompt_new_version.Tips == true&& Prompt_new_version.edition == data.ver) {
            dui.cb1.checked = true;
        
    }
    if (app.autojs.versionCode <= 8082200) {
        dui.banben.setSelection(1)
    }


    dui._download.click(() => {
        if(callback_click_update){
            callback_click_update(dui,download_box);
        return;
        }
        data = age.get("data");
        if (data.id == "解析") {
            toastLog("准备下载链接中，请稍候...")
            return
        }
        data = age.get("data");
        if(dui.banben.getVisibility() == 0){
        if (dui.banben.getSelectedItemPosition() == 0) {
            data.link = data.link64;
        } else {
            data.link = data.link32;
        }
    };
        age.put("data", data)
        ui.run(() => {
            dui._butClose.attr("visibility", "gone")
            dui._download.attr("visibility", "gone")
            dui._text.attr("visibility", "visible")
            dui._progress.attr("visibility", "visible")
            dui._text.setText("下载中 0%")
        })

        try {
            engines.execScriptFile("./lib/download.js");
        } catch (e) {
            engines.execScriptFile("../lib/download.js")
        }

        //监听脚本间广播'download'事件
        events.broadcast.on("download" + data.id, function (X) {
            switch (X.name) {
                case "进度":
                    ui.run(() => {
                        dui._progress.setProgress(0 + X.data);
                        X.data == 100 ? dui._text.setText("安装") : dui._text.setText("下载中 " + X.data + "%");
                    })
                    break;
                case "结果":
                    if (X.data == "下载完成") {
                        data = age.get("data");
                        toast("下载完成:\n" + data.myPath + data.fileName);
                        if(callback_down_file){
                            dui._text.setText("正在处理文件中");
                            callback_down_file(data.myPath + data.fileName);
                            download_box.dismiss()
                            exit();
                    
                       //     return;
                        }
                            dui._text.setText("安装");
                        
                    }
                    break;
                case "关闭":
                    dui._text.setText("下载失败");
                    if (data.butClose == "false") {
                        ui.run(() => {
                            dui._butClose.setText("下载失败");
                            dui._butClose.attr("visibility", "visible")
                            dui._download.attr("visibility", "gone")
                            dui._text.attr("visibility", "gone")
                            dui._progress.attr("visibility", "gone");
                            dui._close.attr("visibility", "visible");
                            toastLog(data.faliure)
                        });
                    }
                    break;
            }
        });
    })

    dui._text.click(() => {
        if (dui._text.text() == "下载失败") {
            toast("下载失败，链接异常，请加入频道下载最新文件")
            console.error("下载失败，链接异常，请加入频道下载最新文件");
        }
        if (dui._text.text() != "安装") {
            return
        }
        data = age.get("data");
        if (data.fileName.indexOf(".zip") != -1) {
            console.info("解压" + files.path("../"))
            //   let path = context.getPackageResourcePath()
            $zip.unzip(data.myPath + data.fileName, files.path("../"))
        } else {
            app.viewFile(data.myPath + data.fileName)
        }

        try {
            data = events.broadcast.listeners("download" + data.id)[0];
            events.broadcast.removeListener("download" + data.id, data);
        } catch (e) {
            console.error(e)
        }
        download_box.dismiss()
        exit();

    })


    /*
    function report(X, Y) {
        Y = Y || false;
        events.broadcast.emit("全局", {
            name: X,
            data: Y
        });
    }*/


    //保持脚本运行
    // setInterval(() => {

    // }, 1000);
}
try {
    module.exports = window_view;
} catch (e) {
    window_view();
}