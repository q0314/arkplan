var set_up = storages.create("rest_screen").get("rest_screen", {
    exit: false,
    volume: "下",
})
var package_path = context.getExternalFilesDir(null).getAbsolutePath() + "/";
var dex_path = package_path + "shell/control.dex";
var timeoutId = null;
events.on("exit", function() {
    set_up.set = "yes";

    if (set_up.exit) {
        screen(false);
        toastLog("监听到停止运行，退出熄屏运行状态")
    }
    storages.create("rest_screen").put("rest_screen", set_up);

})

function suspension() {
    if (set_up.volume != false) {
        try {
            threads.start(function() {

                events.observeKey();
                events.setKeyInterceptionEnabled(set_up.volume == "下" ? "volume_down" : "volume_up", true);
                events.onKeyDown(set_up.volume == "下" ? "volume_down" : "volume_up", function(event) {
                    timeoutId = setTimeout(function() {
                        exit();
                    }, 500);

                });
                //音量键弹下
                events.onKeyUp(set_up.volume == "下" ? "volume_down" : "volume_up", function(event) {
                    if (timeoutId) clearTimeout(timeoutId);
                    if (set_up.volume == "上" && event.keyCode == 24) {
                        sign_out("音量上键")
                        return
                    } else if (set_up.volume == "下" && event.keyCode == 25) {
                        sign_out("音量下键")
                        return
                    }

                });
            })
        } catch (e) {
            console.error(e)
        }
    }
    try {
        if (set_up.control_volume && set_up.control_volumesize) {
            device.setMusicVolume(Number(set_up.control_volumesize));

        }
    } catch (err) {
        console.error("修改音量失败" + err + "\n可能是没有授权修改系统设置权限")
    }

    screen(true);
}
// 设备是否锁屏
function is_locked() {
    const _km = context.getSystemService(context.KEYGUARD_SERVICE)
    return _km.inKeyguardRestrictedInputMode();
}

function screen(value) {
    // set_up.exit = value;
    if (is_locked()) {
        device.wakeUp();
        exit()
    }
    device.vibrate(30)
    let cmd = "export CLASSPATH=" + dex_path + ";app_process /system/bin screenoff.only.Control " + (value ? "off" : "on")
    if (!$shell.checkAccess("root")) {
        console.warn("未检查到应用已被授权ROOT");
    } else {
        try {
            let sh_result1 = shell(cmd, true)
            if (sh_result1.code == 0 || (sh_root_result1.code == 139 && sh_root_result1.error == "Segmentation fault")) {
                set_up.mode = "root";
                return true;
            } else {
                toastLog("root权限" + (value ? "关闭" : "打开") + "屏幕失败,\n请检查是否有并授权该权限\n错误信息:" + sh_result1)
            }
        } catch (e) {
            toastLog("root权限错误：\n" + e)
        }
    }

    if (!$shell.checkAccess("adb")) {
        toastLog("未检查到应用已被授权ROOT、ADB");
    } else {

        try {
            let sh_result = shell(cmd, {
                adb: true,
            })
            if (sh_root_result.code == 0 || (sh_root_result.code == 139 && sh_root_result.error == "Segmentation fault")) {
                set_up.mode = "adb";

                return true;
            } else {
                toastLog("adb权限" + (value ? "关闭" : "打开") + "屏幕失败,\n请检查是否有并授权该权限\n错误信息:" + sh_result)
            }

        } catch (e) {
            toastLog("adb权限错误：\n" + e)

        }
    }
}



function sign_out(value) {
    screen(set_up.exit);
    set_up.exit = set_up.exit ? false : true;
    // console.verbose(value)
    if (set_up.exit) toastLog(value + "关闭熄屏运行状态");
    // exit()
}

function mask() {

    let Tips_tuku_ui = ui.inflate(
        <vertical id="parent">
            
            <card gravity="center_vertical" cardElevation="0dp" margin="0">
                <img src="file://res/icon.png" w="50" h="30" margin="0" />
                <text text="熄屏运行" padding="5" textSize="20" gravity="center|left" textColor="#000000" marginLeft="50" />
                <horizontal w="*" h="*" gravity="right|center_vertical" clickable="true" >
                    
                    <linear marginLeft="5">
                        <img id="sett" marginRight="8" src="@drawable/ic_help_outline_black_48dp" w="30" h="30" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true" />
                    </linear>
                </horizontal>
                
                
            </card>
            
            <ScrollView>
                <vertical>
                    <View bg="#f5f5f5" w="*" h="2" />
                    
                    <vertical padding="10 0" >
                        <View bg="#f5f5f5" w="*" h="2" />
                        <text id="Tips" text="" visibility="gone" />
                        <text id="Device_resolution" text="当前熄屏运行关闭方式：" marginTop="5" />
                        
                        <text id="wxts" text="无" typeface="sans" padding="0 5" textColor="#000000" textSize="15sp" layout_gravity="center" />
                    </vertical>
                    <vertical id="set_content" visibility="gone">
                        <Switch id="volume_control" text="按下音量?键打开/关闭熄屏" checked="false"
                        padding="25 10 25 5" textSize="18sp"
                        gravity="top|center_vertical" />
                        <radiogroup margin="25 0 10 0" id="volume_total"
                        gravity="bottom" orientation="horizontal">
                        <radio id="volume_upper" text="音量上键" w="auto" />
                        
                        <radio id="volume_lower" text="音量下键" w="auto" h="auto" />
                    </radiogroup>
                    <frame gravity="right" >
                        
                        <Switch id="control_volume" text="熄屏后修改媒体音量" checked="false"
                        padding="25 10 25 5" textSize="18sp"
                        />
                        <input id="input_volume" gravity="right" lines="1" hint="回车保存"  w="90" margin="190 0 350 0" />
                    </frame>
                    
                </vertical>
                
                <horizontal w="*" padding="-3" gravity="center_vertical">
                    <button text="终止" id="exit" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" w="50" />
                    <button text="设置" id="set" textColor="#0d84ff" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" w="50" />
                    
                    <button text="立即开始(5s)" id="start" textColor="#008577" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" w="50" />
                </horizontal>
            </vertical>
        </ScrollView>
        
        </vertical>);

    var Tips_tuku = dialogs.build({
        type: "foreground-or-overlay",
        customView: Tips_tuku_ui,
        wrapInScrollView: false,
        cancelable: false,
        canceledOnTouchOutside: false

    }).on("dismiss", (dialog) => {
        storages.create("rest_screen").put("rest_screen", set_up);
    }).show();
    let _suspend = "";
    var i_tnter = 5;
    set_up.set = "yes";
    if (set_up.volume != false) {
        _suspend = "\n-----1：按下音量" + set_up.volume + "键打开/关闭\n-----2：按电源键锁屏，再按电源键解锁\n-----3.长按音量" + set_up.volume + "键停止脚本";
    } else {
        _suspend = "\n-----1：按电源键锁屏，再按电源键解锁";

    }
    Tips_tuku_ui.Tips.setText("说明：息屏运行期间，系统不会自动休眠，一切APP都会和亮屏时一样继续工作。直到您按下电源键才会真正的息屏。" +
        "\n\n小部分设备在息屏运行之后会屏蔽按键，所以音量键亮屏在这些设备(已知华为鸿蒙的某些手机、Origin OS的某些手机)上无效" +

        "\n\n部分LCD设备息屏运行之后依然有屏幕背光。跟屏蔽按键、屏蔽触控一样，这都是系统工程师决定的，我无法改变。但是您可以在息屏运行前先把屏幕亮度调到最小，以把背光降到最低。\n")
    Tips_tuku_ui.wxts.setText(_suspend)
    Tips_tuku_ui.volume_total.setVisibility(set_up.volume ? 0 : 8)
    Tips_tuku_ui.input_volume.setVisibility(set_up.control_volume ? 0 : 8)
    Tips_tuku_ui.volume_control.checked = set_up.volume ? true : false;
    Tips_tuku_ui.control_volume.checked = set_up.control_volume ? true : false;
    set_up.volume == "上" ? Tips_tuku_ui.volume_upper.checked = true : "";
    set_up.volume == "下" ? Tips_tuku_ui.volume_lower.checked = true : "";
    if (set_up.control_volumesize) Tips_tuku_ui.input_volume.setText(set_up.control_volumesize);
    //.checked = true;
    var id_tnter = setInterval(function() {
        if (set_up.set == "no") {

            Tips_tuku_ui.start.setText("立即开始");
            return;
        }
        if (i_tnter >= 0) {
            i_tnter--;
        }
        ui.run(() => {
            if (i_tnter == 0) {
                Tips_tuku_ui.start.setText("启动中..");
                clearInterval(id_tnter);
                Tips_tuku.dismiss()
                suspension()
            } else {
                Tips_tuku_ui.start.setText("立即开始(" + i_tnter + "s)")
            }

        })
    }, 1000)

    Tips_tuku_ui.start.on("click", function() {
        clearInterval(id_tnter);
        Tips_tuku.dismiss();
        setTimeout(function() {
            suspension();
        }, 500)
    })
    Tips_tuku_ui.sett.click(() => {
        Tips_tuku_ui.Tips.setVisibility(Tips_tuku_ui.Tips.getVisibility() ? 0 : 8);
    })

    Tips_tuku_ui.set.on("click", function(view) {
        if (view.getText() == "设置") {
            set_up.set = "no";
            view.setText("返回")
            Tips_tuku_ui.Device_resolution.setVisibility(8);
            Tips_tuku_ui.wxts.setVisibility(8)
            Tips_tuku_ui.set_content.setVisibility(0);
        } else {
            i_tnter = 5;
            set_up.set = "yes";
            view.setText("设置");
            Tips_tuku_ui.Device_resolution.setVisibility(0);
            Tips_tuku_ui.wxts.setVisibility(0)
            Tips_tuku_ui.set_content.setVisibility(8);

        }
    })
    Tips_tuku_ui.volume_control.on("check", (checked) => {
        Tips_tuku_ui.volume_total.setVisibility(checked ? 0 : 8)
    })
    Tips_tuku_ui.volume_upper.on("check", (checked) => {
        set_up.volume = checked ? "上" : "下";
    })
    Tips_tuku_ui.control_volume.on("check", (checked) => {
        set_up.control_volume = checked;
        Tips_tuku_ui.input_volume.setVisibility(checked ? 0 : 8)
    })

    Tips_tuku_ui.input_volume.on("key", function(keyCode, event) {
        if (event.getAction() == 0 && keyCode == 66) {
            set_up.control_volumesize = Tips_tuku_ui.input_volume.getText().toString() ? Tips_tuku_ui.input_volume.getText().toString() : false;
            toastLog("回车确认保存媒体音量")
            event.consumed = true;
        }
    });

    Tips_tuku_ui.exit.on("click", function() {
        clearInterval(id_tnter);
        set_up.exit = false;
        Tips_tuku.dismiss();
        exit()
    })
    //suspension()
}

try {
    exports.mask = mask;
} catch (err) {
    console.error(err)
    mask()
    // suspension()
}