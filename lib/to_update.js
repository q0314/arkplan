var progressDialog = null;
var packageName = context.getPackageName();
//创建一个储存器保存数据
var age = storages.create("Doolu_download");
var data = age.get("data") || {}
/*
function isWifiProxy() {
    var IS_ICS_OR_LATER = android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH;
    if (IS_ICS_OR_LATER) {
        var proxyAddress = java.lang.System.getProperty("http.proxyHost");
        var portStr = java.lang.System.getProperty("http.proxyPort");
        var proxyPort = java.lang.Integer.parseInt((portStr != null ? portStr : "-1"));
    } else {
        var proxyAddress = android.net.Proxy.getHost(this);
        var proxyPort = android.net.Proxy.getPort(this);
    }
    return (!android.text.TextUtils.isEmpty(proxyAddress)) && (proxyPort != -1);
}

function isVpnUsed() {
    var niList = java.net.NetworkInterface.getNetworkInterfaces();
    if (niList != null) {
        var list = java.util.Collections.list(niList);
        console.verbose(list)
        for (let i = 0; i < list.size(); i++) {
            var Nane = list.get(i).getName();
            if ("tun0".equals(Nane) || "ppp0".equals(Nane)) return true;
        }
    }
    return false;
}*/

function dismissProgress() {
    if (progressDialog) {
        progressDialog.dismiss();
        progressDialog = null;
    }
}

function new_ui() {
    try {
        engines.execScriptFile("./subview/window_update.js");
    } catch (e) {
        engines.execScriptFile("../subview/window_update.js")
    }
}
var toupdate = {
    showProgress: function () {
        if (!progressDialog) {
            progressDialog = dialogs.build({
                type: "app",
                progress: {
                    max: -1
                },
                content: "正在检测更新...",
                negative: "取消更新",
                canceledOnTouchOutside: false
            })
                .on("negative", () => {
                    dismissProgress();
                })
                .show();
            return
        }
    },

    get_packageName_version: function (packageName) {
        importPackage(android.content);
        var pckMan = context.getPackageManager();
        var packageInfo = pckMan.getPackageInfo(packageName, 0);
        return packageInfo.versionName;
    },

    updata: function (is, url, callback) {
        // let up =threads.disposable();
        threads.start(function () {
            //if (!isVpnUsed()) {
            //对比版本号
            try {
                var Jason = http.get(url)
                if (Jason.statusCode == 200) {
                    Jason = JSON.parse(Jason.body.string());
                    var edition = toupdate.get_packageName_version(packageName);
                    edition = edition.replace(/[^0-9]/ig, "");
                    if (edition.length == 3) {
                        edition += "0"
                    }
                    if (Number(Jason.Version) > Number(edition)) {
                        data.id = '解析';
                        data.ver = Jason.Versionname;
                        data.butClose = Jason.force;
                        data.text = Jason.log;
                        data.myPath = files.path("/sdcard/Download/")
                        data.fileName = "明日计划_.apk";
                        data.link32 = Jason.link32;
                        data.link64 = Jason.link64;


                        if (callback == undefined) {
                            data.faliure = "非完全版无法解析直链，请在关于应用切换为完全版"
                        } else {
                            //需要解析获取下载链接
                            if (Jason.understanding) {

                                let urls = callback(Jason.link32);

                                if (urls[0]) {
                                    data.link32 = urls[1]
                                }
                                sleep(500)
                                urls = callback(Jason.link64);
                                if (urls[0]) {
                                    data.link64 = urls[1]
                                }

                                log("解析完成..")
                                files.write("./lib/urlfile.txt", "true")
                            }
                        }
                        data.id = "更新";
                        age.put("data", data);


                        //强制显示更新弹窗
                        if (is || Jason.force) {
                          
                            new_ui();
                        } else {
                            //此版本不再提示
                            let display = age.get("Prompt_new_version");
                            if (display != undefined) {
                                if (display.edition == Jason.Versionname && display.Tips == true) {

                                    toastLog("发现新版本\n请前往侧边栏-关于应用-检查更新")

                                    return

                                }
                            }
                            display = {};
                            display.edition = '0';
                            display.Tips = false;
                            age.put("Prompt_new_version", display);
                            new_ui();

                        }

                        dismissProgress();
                    } else {
                        function jiance(banben) {
                            switch (true) {
                                case files.exists("./f_main.js") && files.exists("./c_main.js"):
                                    return "w_main.js"
                                case files.exists("./c_main.js") && files.exists("./w_main.js"):

                                    return "f_main.js";
                                case files.exists("./w_main.js") && files.exists("./f_main.js"):

                                    return "c_main.js"
                            }
                        }
                        let v = jiance().replace("main.js", "");
                        toastLog("当前：" + v + toupdate.get_packageName_version(packageName) + "版本，已是最新版");

                        dismissProgress();
                    }
                } else {
                    network_reminder_tips(Jason.statusMessage);
                }
            } catch (e) {
                network_reminder_tips(e.message + '\nat ///' + e.lineNumber)
            };
            // }

        });
        //return up.blockedGet()
    },

};
toupdate.url = false;
try {
    module.exports = toupdate;
} catch (err) {
    toupdate.updata()
}