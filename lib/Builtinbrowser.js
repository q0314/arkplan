"ui";

//module.exports = (main.toString()).replace(/function main\(\) \{/g, "{");
//module.exports = (main.toString())
var age = storages.create("Doolu_download");
var url = age.get("url");
importClass(android.graphics.drawable.GradientDrawable);
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);

importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);

importClass(android.webkit.WebSettings);
importClass(android.widget.AdapterView);
activity.getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
importClass(android.content.Context);
importClass(android.provider.Settings);

var theme = storages.create('configure').get('theme_colors');

var tabs_view = []
var tabs_data = {
    bg: "#ffffff",
    selectColor: {
        on: "#03A9F5",
        off: "#999999"
    },
    srcSize: 29,
    zoom: 1.5,
    tabs_h: true,
    data: [
        ["@drawable/ic_chevron_left_black_48dp"],
        ["@drawable/ic_chevron_right_black_48dp"],
        ["@drawable/ic_refresh_black_48dp"],
        ["@drawable/ic_view_list_black_48dp"],
        ["@drawable/ic_turned_in_not_black_48dp"],
    ],
}
var Tabs_btn_layout = function() {
    util.extend(Tabs_btn_layout, ui.Widget);

    function Tabs_btn_layout() {
        ui.Widget.call(this);
        this.defineAttr("data", (view, attr, value, defineSetter) => {
            arr = tabs_data.data[value]
            view._src.attr("src", arr[0])
            tabs_view[tabs_view.length] = view
            if (value == 0) {
                view._src.attr("tint", tabs_data.selectColor.on)
                //   view._text.setTextColor(colors.parseColor(tabs_data.selectColor.on))
            }
        });
    }
    Tabs_btn_layout.prototype.render = function() {
        return (
            <vertical id="_bg" w="*" bg="{{tabs_data.bg}}" padding="0 10" gravity="center" >
                        <img w="{{tabs_data.srcSize}}" id="_src" tint="{{tabs_data.selectColor.off}}" />
                    </vertical>
        )
    }
    ui.registerWidget("tabs_btn-layout", Tabs_btn_layout);
    return Tabs_btn_layout;
}()

var Tabs_layout = function() {

    util.extend(Tabs_layout, ui.Widget);

    function Tabs_layout() {
        ui.Widget.call(this);
        this.defineAttr("data", (view, attr, value, defineSetter) => {
            for (var i = 0; i < tabs_data.data.length; i++) {
                time = i
                ui.inflate(
                    <tabs_btn-layout data="{{time}}" layout_weight="1" />, view._tabs, true)
            }
            tabs_data.tabs_h ? _color = tabs_data.selectColor.on : _color = "#00000000";
            view.tabs.selectedTabIndicatorColor = colors.parseColor(_color);
        });
    }
    Tabs_layout.prototype.render = function() {
        return (
            <card w="*" h="auto" cardElevation="10" foreground="?selectableItemBackground">
                        <horizontal id="_tabs" />
                        <tabs id="tabs" />
                        <horizontal weightSum="5" h="20" layout_gravity="center_vertical">
                            <frame layout_weight="1" >
                                <View bg="#e8e8e8" w="1" layout_gravity="right" />
                            </frame>
                            <frame layout_weight="1" >
                                <View bg="#e8e8e8" w="1" layout_gravity="right" />
                            </frame>
                            <frame layout_weight="1" >
                                <View bg="#e8e8e8" w="1" layout_gravity="right" />
                            </frame>
                            <frame layout_weight="1" >
                                <View bg="#e8e8e8" w="1" layout_gravity="right" />
                            </frame>
                        </horizontal>
                    </card>
        )
    }
    ui.registerWidget("tabs-layout", Tabs_layout);
    return Tabs_layout;
}()
var vb = (
    <frame>
        <vertical h="*">
            {/*  <appbar>
            <toolbar id='toolbar' bg='{{theme.bg_colors}}' gravity='center' title='加载中...'>
                <card id="WaitForRun" w="40" h="40" cardCornerRadius="25dp" cardElevation="0dp" margin="0 0 10 0"
                layout_gravity="right" cardBackgroundColor="{{theme.bg_colors}}" foreground="?attr/selectableItemBackground" clickable="true">
                <vertical gravity="center">
                    
                    <spinner id="选项" margin="30" background="@drawable/ic_view_headline_black_48dp"
                    backgroundTint="#ffffff" spinnerMode="dropdown" w="75px" h="75px"  popupBackground="#dcdcdc" />
                </vertical>
            </card>
            
            <card id="WaitFor" w="40" h="40" cardCornerRadius="25dp" cardElevation="0dp" margin="0 5 0 5"
            layout_gravity="right" cardBackgroundColor="{{theme.bg_colors}}" foreground="?attr/selectableItemBackground" clickable="true">
            <vertical gravity="center">
                <spinner id="工具" background="@drawable/ic_view_list_black_48dp"entries="待添加...|PRTS|明日方舟工具箱|企鹅物流数据统计   |明日方舟官网"
                backgroundTint="#ffffff" spinnerMode="dropdown" w="75px" h="75px"  popupBackground="#dcdcdc" />
            </vertical>
        </card>
    </toolbar>
    </appbar>*/}
    <progressbar id='progress' w='*' h='auto' indeterminate='true' layout_gravity='top' style='@style/Base.Widget.AppCompat.ProgressBar.Horizontal'/>
    <vertical id="Main" w="*" h="*">
        
        <webview id='webview' w='*' h='*'/>
    </vertical >
    
    </vertical>
    
    <vertical gravity="bottom">
            
            <grid id="icons"  w="*" h="*"  spanCount="5" numColumns="2" gravity="center_horizontal">
                <card  w="*" h="*" cardElevation="0" foreground="?selectableItemBackground" layout_gravity="center_horizontal">
                    <img w="30" layout_gravity="center" src="{{this}}" tint="{{tabs_data.selectColor.off}}" />
                </card>
            </grid>
            
            <horizontal weightSum="5" h="20" layout_gravity="center_vertical">
                
                <frame layout_weight="1" >
                    <View bg="#e8e8e8" w="1" layout_gravity="right" />
                </frame>
                <frame layout_weight="1" >
                    <View bg="#e8e8e8" w="1" layout_gravity="right" />
                </frame>
                <frame layout_weight="1" >
                    <View bg="#e8e8e8" w="1" layout_gravity="right" />
                </frame>
                <frame layout_weight="1" >
                    <View bg="#e8e8e8" w="1" layout_gravity="right" />
                </frame>
            </horizontal>
    </vertical>
    </frame>
)

ui.layout(vb)

ui.icons.on("item_long_click", function(e, item, i, itemView, listView) {
     toastLog(e + "\n" + item + "\n" + i)

});

ui.icons.setDataSource(tabs_data.data);
ui.icons.on("item_click", function(icon, i) {
    toastLog(icon)
    switch (i) {
        case 0:
            ui.run(() => {
                ui.webview.goBack();
            });

            break
        case 1:
            ui.webview.goForward();
            break
        case 2:
            ui.run(() => {
                ui.webview.reload();
            });
            break
        case 3:
            break
        case 4:


            let view = ui.inflate(
                <frame bg="#00ff0000">
            <grid id="icons_"  w="*" h="*"  spanCount="5" numColumns="2" gravity="center_horizontal">
                <card  w="*" h="*" cardElevation="0" foreground="?selectableItemBackground" layout_gravity="center_horizontal">
                    <img w="30" layout_gravity="center" src="{{this}}" tint="{{tabs_data.selectColor.off}}" />
                </card>
            </grid>
                        </frame>
            );
            let mBottomSheetDialog = new BottomSheetDialog(activity);

            mBottomSheetDialog.setContentView(view);
            


    let mDialogBehavior = BottomSheetBehavior.from(view.getParent());
    mDialogBehavior.setPeekHeight(400);
    mDialogBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback({
        onStateChanged: function(view, i) {
            if (i == BottomSheetBehavior.STATE_HIDDEN) {
                mBottomSheetDialog.dismiss();
                mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
            }
        }

    }));
    var lp = mBottomSheetDialog.getWindow();
    lp.dimAmount = 0.3;
    log(lp)

    //设置弹窗圆角和背景
  //  tool.setBackgroundRoundRounded(view)
    mBottomSheetDialog.show();


    //显示Dialog

    //ui.c_frame.setAlpha(1);

    break


}
})



ui.statusBarColor(theme.bg_colors);

//ui.tabs.setupWithViewPager(ui.view);

var webview = ui.webview
var settings = webview.getSettings();

settings.setUserAgentString(随机UA());

settings.setLoadsImagesAutomatically(true); // 是否自动加载图片
settings.setDefaultTextEncodingName("UTF-8"); // 设置默认的文本编码 UTF-8 GBK
settings.setJavaScriptEnabled(true); // 设置是否支持js
settings.setJavaScriptCanOpenWindowsAutomatically(true); // 设置是否允许js自动打开新窗口, window.open
settings.setSupportZoom(true); // 是否支持页面缩放
settings.setBuiltInZoomControls(true); // 是否出现缩放工具
settings.setUseWideViewPort(true); // 容器超过页面大小时, 是否将页面放大到塞满容器宽度的尺寸
settings.setLoadWithOverviewMode(true); // 页面超过容器大小时, 是否将页面缩小到容器能够装下的尺寸

settings.setAppCacheEnabled(true); // 是否启用app缓存
settings.setAppCachePath(context.getExternalFilesDir(null).getAbsolutePath() + "/cache/Webpage/"); // app缓存文件路径
settings.setAllowFileAccess(true); // 是否允许访问文件
settings.setDatabaseEnabled(true); // 是否启用数据库
settings.setDomStorageEnabled(true); // 是否本地存储

/* -------------------------WebChromeClient----------------------------------------------- */
let WebChromeClient = android.webkit.WebChromeClient;
var webChromeClient = new JavaAdapter(WebChromeClient, {
    onShowFileChooser: function(webview, filePathCallback_, fileChooserParams) {
        filePathCallback = filePathCallback_
        var i = new android.content.Intent(android.content.Intent.ACTION_GET_CONTENT);
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
        activity.startActivityForResult(Intent.createChooser(i, "Image Chooser"), 1);
        return true;
    },
});
webview.setWebChromeClient(webChromeClient);

function 随机UA(ua_w) {
    var uaArr = [
        "(Linux; U; Android 11; zh-cn; MI 9 Build/RKQ1.200826.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.116 Mobile Safari/537.36 XiaoMi/MiuiBrowser/16.3.12 swan-mibrowser",
        "(Linux; Android 11; MI 9 Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36",
        "(Linux; Android 10; HarmonyOS; LRA-AL00; HMSCore 6.5.0.312) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.105 HuaweiBrowser/12.1.0.301 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 11; M2104K10AC Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.131 Mobile Safari/537.36",
        "(Linux; Android 11; M2002J9E Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Mobile Safari/537.36",
        "(Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/93.0.4577.62 Mobile Safari/537.36",

        "(Linux; Android 12; V1986A Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.70 Mobile Safari/537.36",
        "(Linux; U; Android 12; zh-cn; M2011K2C Build/SKQ1.211006.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.116 Mobile Safari/537.36 XiaoMi/MiuiBrowser/16.3.12 swan-mibrowser",
        "Mozilla/5.0 (Linux; Android 12; LE2110 Build/RKQ1.211103.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.73 Mobile Safari/537.36",
        "(Linux; U; Android 12; zh-CN; KB2000 Build/RKQ1.211119.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 Quark/5.6.6.211 Mobile Safari/537.36",
        "(Linux; Android 12; V2136A Build/SP1A.210812.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36",
        "(Linux; U; Android 12; zh-cn; M2007J17C Build/SKQ1.211006.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.116 Mobile Safari/537.36 XiaoMi/MiuiBrowser/16.0.22 swan-mibrowser",
        "(Linux; Android 12; M2102J2SC Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.74 Mobile Safari/537.36",
        //  "JUC (Linux; U; 2.3.7; zh-cn; MB200; 320*480) UCWEB7.9.3.103/139/999"
    ]
    if (ua_w) {
        uaArr = [
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
            "(Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 SE 2.X MetaSr 1.0",
            "(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53",
        ]
    }
    // var uaArr=require('./uaArr.js')
    var uasLen = uaArr.length
    var n = 随机数(uasLen)
    var ua = uaArr[n]
    return ua

    function 随机数(max) {
        var r = parseInt(max * Math.random())
        return r
    }
}

ui.webview.loadUrl(url)

/*
setInterval(() => {
    var P = ui.webview.getProgress();
    var T = ui.webview.getTitle();
    if (P == 100) {
        ui.run(() => {
            ui.progress.setVisibility(8);
            
        });
    } else {
        ui.run(() => {
            ui.progress.setVisibility(0);
        });
    };

}, 200);
*/
ui.webview.on("touch_down", () => {
    ui.webview.requestFocus();
});

ui.post(() => {
    myAdapterListener(ui.工具, [
        "待添加..",
        "PRTS",
        "明日方舟工具箱",
        "企鹅物流数据统计",
        "明日方舟官网",
        "寻访记录分析"
    ])

    myAdapterListener(ui.选项, [
        "刷新",
        "前进",
        "后退",
        "分享",
        " 浏览器打开 "
    ]);
}, 200)

function myAdapterListener(spinner, dataList) {
    function setAdapter_gj(dataList) {
        let Options_menu = null;
        let adapter = JavaAdapter(android.widget.SpinnerAdapter, {
            getCount: function() {
                return dataList.length;
            },
            getItem: function(position) {
                return dataList[position];
            },
            getItemId: function(position) {
                return position;
            },
            getViewTypeCount: function() {
                return 1;
            },
            getItemViewType: function(pos) {
                return 0;
            },
            getDropDownView: function(position, convertView, parent) {
                ui.run(function() {
                    if (!convertView) {
                        // let boxXml = <text textColor="#ff5722" paddingTop="34" gravity="center" textSize="20sp"></text>;
                        //展开菜单
                        let boxXml = (
                            <frame>
                                                    <TextView id="_text" padding="12dp" gravity="center"
                                                    textColor="#000000" textSize="16sp" />
                                                </frame>
                        );
                        convertView = ui.inflate(boxXml);
                        convertView.attr("bg", "#00ff0000");
                        // convertView.getChildAt(0).setBackgroundDrawable(drawable);
                    }
                    let item = dataList[position];
                    convertView.getChildAt(0).setText(item);
                    Options_menu = true;
                })

                return convertView;
            },
            getView: function(position, convertView, parent) {
                ui.run(function() {
                    if (!convertView) {
                        //在选中确认之后显示的控件?
                        let boxXml =
                            <text id="name" textColor="#00000000"
                                            gravity="center" textSize="2sp">
                                            </text>;
                        convertView = ui.inflate(boxXml);
                    }
                    //点击事件
                    // let item = dataList[position];
                    let r = parent.getSelectedItem();
                    //toast(item)
                    if (Options_menu) {
                        Options_menu = false;
                        switch (r) {
                            case '刷新':
                                ui.run(() => {
                                    ui.webview.reload();
                                });
                                toast(r);
                                break;
                            case '前进':
                                ui.run(() => {
                                    ui.webview.goBack();
                                });
                                toast(r)
                                break;
                            case '后退':
                                ui.run(() => {
                                    ui.webview.goForward();
                                });
                                toast(r);
                                break;
                            case '分享':
                                var Tw = ui.webview.getTitle();
                                var context = String(Tw) + "，链接:" + ui.webview.url
                                app.startActivity({
                                    action: "android.intent.action.SEND",
                                    type: "text/*",
                                    extras: {
                                        "android.intent.extra.TEXT": context
                                    }
                                });
                                break
                            case ' 浏览器打开 ':
                                toast(r)
                                log(ui.webview.url)
                                app.openUrl(ui.webview.url)
                                break;
                            case 'PRTS':
                                url = "https://prts.wiki/w/首页";
                                ui.webview.loadUrl(url);
                                toast(r)
                                break;
                            case '明日方舟工具箱':
                                url = "https://arkn.lolicon.app";
                                ui.webview.loadUrl(url);
                                toast(r)
                                break;
                            case '企鹅物流数据统计':
                                url = "https://penguin-stats.cn";
                                ui.webview.loadUrl(url);
                                toast(r)
                                break;
                            case '明日方舟官网':
                                url = "https://ak.hypergryph.com/";
                                ui.webview.loadUrl(url);
                                toast(r);
                                break;
                            case '寻访记录分析':
                                url = "https://arkgacha.kwer.top/";
                                ui.webview.loadUrl(url);
                                toast(r);
                                break;
                        };

                    }
                })
                return convertView;

            },
        });

        return adapter;
    }
    ui.run(function() {
        //        spinner.setAdapter(setAdapter_gj(dataList));
    })
}

/*
activity.setSupportActionBar(ui.toolbar)
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function() {
        ui.finish();
    }
});
*/
var isCanFinish = false;
var isCanFinishTimeout;
/*
ui.emitter.on('back_pressed', e => {
    
    if (ui.webview.canGoBack()) {
        toast("上一页")
        ui.webview.goBack();
        e.consumed = false
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
});
*/
importClass(android.app.Activity)
ui.emitter.on("activity_result", (requestCode, resultCode, data) => {
    if (resultCode != Activity.RESULT_OK) {
        if (filePathCallback != null) {
            filePathCallback.onReceiveValue(null);
        }
        return;
    }

    var uri = data.getData();
    let uriArr = java.lang.reflect.Array.newInstance(java.lang.Class.forName("android.net.Uri"), 1);
    uriArr[0] = uri;
    filePathCallback.onReceiveValue(uriArr);
    filePathCallback = null;
});