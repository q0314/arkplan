
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

let { project } = require('../modules/mod-project');


let toupdate = {
    showProgress() {
        this.progressDialog = dialogs.build({
            type: "app",
            progress: {
                max: -1
            },
            content: "正在检测更新...",
            negative: "取消更新",
            canceledOnTouchOutside: false
        })
            .on("negative", (d) => {
                d.dismiss();
            });
        this.progressDialog.isShowing() || this.progressDialog.show();


    },

    getPackageName: function (packageName) {
        return project.getPackageName(packageName);
    },
    getLocalVerName() {
        return project.getLocalVerName()
    },

    updata: function (uix) {
        let { appx } = require('../modules/ext-app');
        let { dialogsx } = require('../modules/ext-dialogs');
        let _updateDialog = this.progressDialog;

        project.getNewestReleaseCared({
            min_version_name: 'v2.0.1',
            ignore_list: undefined
        }, function (newest) {
            if (newest) {
                if (!appx.version.isNewer(newest, project.getLocalVerName())) {
                    toast("已是服务器上最新版本");
                } else {
                    if (_updateDialog && _updateDialog.isShowing()) {
                        _updateDialog.dismiss();
                        dialogsx.builds([
                            '版本详情', newest.brief_info_str,
                            ['忽略此版本', 'warn'], 'B',
                            ['立即更新', 'attraction'], 1,
                        ]).on('neutral', (d) => {
                            dialogsx.setActionButton(d, 'neutral', "未支持");
                            return
                            d.dismiss();
                            dialogsx.builds([
                                '版本忽略提示', 'update_ignore_confirm',
                                0, 'Q', ['确定忽略', 'caution'], 1,
                            ]).on('negative', (ds) => {
                                d.show();
                                ds.dismiss();
                            }).on('positive', (ds) => {
                                ds.dismiss();
                                let _k = 'update_ignore_list';
                                let _new = {};
                                let _data = $$cfg.ses[_k].concat([newest.version_name]);
                                _new[_k] = $$cfg.ses[_k] = _data;
                                $$view.updateViewByTag('update_ignore_list');
                                $$sto.af_cfg.put('config', _new);
                                $$toast('已忽略当前版本', 'long');
                            }).show();
                        }).on('negative', (d) => {
                            d.dismiss();
                        }).on('positive', (d) => {
                            project.deploy(newest, {
                                onStart: () => d.dismiss(),
                                onSuccess: () => log("更新完成", newest.version_name),
                            }, {
                                //   ignore_list: $$ses.ignore_list,
                            });
                        }).show();
                    } else {
                        com.google.android.material.snackbar.Snackbar
                            .make(uix, '检测到新版本: ' + newest.version_name, 0)
                            .setAction('查看更新', {
                                onClick() {
                                    dialogsx.builds([
                                        '版本详情', newest.brief_info_str,
                                        ['忽略此版本', 'warn'], 'B',
                                        ['立即更新', 'attraction'], 1,
                                    ]).on('neutral', (d) => {
                                        dialogsx.setActionButton(d, 'neutral', "未支持");
                                        return
                                        d.dismiss();
                                        dialogsx.builds([
                                            '版本忽略提示', 'update_ignore_confirm',
                                            0, 'Q', ['确定忽略', 'caution'], 1,
                                        ]).on('negative', (ds) => {
                                            d.show();
                                            ds.dismiss();
                                        }).on('positive', (ds) => {
                                            ds.dismiss();
                                            let _k = 'update_ignore_list';
                                            let _new = {};
                                            let _data = $$cfg.ses[_k].concat([newest.version_name]);
                                            _new[_k] = $$cfg.ses[_k] = _data;
                                            $$view.updateViewByTag('update_ignore_list');
                                            $$sto.af_cfg.put('config', _new);
                                            $$toast('已忽略当前版本', 'long');
                                        }).show();
                                    }).on('negative', (d) => {
                                        d.dismiss();
                                    }).on('positive', (d) => {
                                        project.deploy(newest, {
                                            onStart: () => d.dismiss(),
                                            onSuccess: () => log("更新完成", newest.version_name),
                                        }, {
                                            //   ignore_list: $$ses.ignore_list,
                                        });
                                    }).show();
                                },
                            })
                            .setDuration(4.2e3)
                            .show();
                    }
                }
            } else {
                toast("无法访问更新资源");
            }
        });

    },

};

try {
    module.exports = toupdate;
} catch (err) {
    toupdate.updata()
}