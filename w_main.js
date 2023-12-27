"ui";
requiresApi(24);

importClass(android.webkit.DownloadListener);
importClass(android.widget.SpinnerAdapter);
importClass(android.view.ViewGroup);
importClass(android.widget.TextView);
importClass(android.webkit.WebSettings);

importClass(android.view.View);
importClass(android.app.Activity)
importClass(android.net.Uri);
importClass(android.widget.AdapterView);
importClass(android.content.Context);
importClass(android.provider.Settings);
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);
importClass(android.webkit.ValueCallback);

var noScroll = true;


const resources = context.getResources();
// 四舍五入 转化到px, 最小 1 像素
const statusBarHeight = resources.getDimensionPixelSize(
    resources.getIdentifier("status_bar_height", "dimen", "android")
);
// 密度比例
var dp2px = (dp) => {
    return Math.floor(dp * resources.getDisplayMetrics().density + 0.5);
};
var theme = require("./theme.js");
let toupdate = require("./lib/to_update.js");
let tool = require("./lib/tool.js");


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


$settings.setEnabled('stop_all_on_volume_up', false);
//storages.create("configure").clear();//删除这个本地存储的数据（用于调试）
var path_ = context.getExternalFilesDir(null).getAbsolutePath();

var setting = tool.readJSON("configure");
var web_set = tool.readJSON("web_set");
if (web_set == undefined || web_set.web_icon[4].icon != "file://res/setup_sort.png") {

    web_set = {
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
    }
    storages.create("configure").put("web_set", web_set)
}
if (!files.exists(path_ + "/html/built_in.html")) {
    $zip.unzip("./lib/html/html.zip", path_ + "/");
}


var SystemUiVisibility = (ve) => {
    var option =
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
        (ve ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
};
SystemUiVisibility(false);

//背景色#426e6d
ui.layout(
    <frame id="all" >

    {/*webview*/}
    <frame id="main_web" bg="{{theme.bg}}">
        <vertical h="*" marginBottom="-5" bg="#00ffffff">
            <vertical h="{{statusBarHeight}}px" bg="{{theme.bg}}" >
                
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
            
            <progressbar id='progress' w='*' h='10' indeterminate='true' margin="0 -3" layout_gravity='top' style='@style/Base.Widget.AppCompat.ProgressBar.Horizontal'/>
            
            <vertical  w="*" h="*" marginBottom="55" bg="#00ffffff">
                
                <webview id='webview' w='*' h='*'/>
            </vertical>
            
        </vertical>
        
        
        
        <vertical gravity="bottom" >
            
            <frame id="web_tips" layout_gravity="bottom" bg="#95000000" visibility="gone" >
                <horizontal w="*">
                    <text id="tips_text" text=""  textColor="#ffffff" layout_gravity="center|left" />
                    <horizontal w="*" gravity="right">
                        <button text="拒绝" id="tips_no" style="Widget.AppCompat.Button.Borderless.Colored"/>
                        <button text="允许" id="tips_ok" style="Widget.AppCompat.Button.Borderless.Colored" />
                    </horizontal>
                </horizontal>
            </frame>
            <card w="*" h="50" cardElevation="0" foreground="?selectableItemBackground" cardBackgroundColor="{{theme.bg}}" >
                
                <grid id="icons"  w="*" h="*"  spanCount="5" gravity="center_horizontal">
                    <card  w="*" h="*" cardElevation="0" foreground="?selectableItemBackground" layout_gravity="center_horizontal" cardBackgroundColor="{{theme.bg}}">
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
    </frame>

);

//输入法
activity.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

let animation_viewpager = false;
ui.icons.setDataSource(web_set.web_icon);

var label_plug = require("./subview/label_plug.js");
var web_set_plug = require("./subview/web_set_plug.js");
ui.icons.on("item_click", function(icon, i, itemView, listView) {
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
            ui.webview.loadUrl(web_set.web_url)
            // ui.webview.reload();

            break
        case 4:
            web_set_plug.web_set_plug(function(title, get_s) {

                switch (title) {
                    case "书签":
                        label_plug.label_plug(function(url) {
                            ui.run(() => {
                                ui.webview.loadUrl(url);
                            })
                        })
                        break
                    case "添加书签":
                        function isURL(domain) {
                            var name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
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
                        var Tw = ui.webview.getTitle();
                        var context = String(Tw) + "：\n" + ui.webview.url
                        app.startActivity({
                            action: "android.intent.action.SEND",
                            type: "text/*",
                            extras: {
                                "android.intent.extra.TEXT": context
                            }
                        });
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
                        ui.run(function() {
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
                    case "悬浮窗":
                        new_ui("悬浮窗")
                        break
                    case "锁定":
                        if(get_s){
                            return true
                        }
                        new_ui("悬浮窗")
                        //toastLog("w版不可用，请先切换到其它版本");
                        break
                    case "退出":
                        ui.finish();
                        break
                }
            })
            break
        case 3:
            label_plug.label_plug(function(url) {
                ui.run(() => {
                    ui.webview.loadUrl(url);
                })
            })
            break
    }
})


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

    } catch (err) {}

    e.consumed = false;
})

ui.emitter.on("activity_result", (requestCode, resultCode, data) => {

    if (resultCode != Activity.RESULT_OK) {
        if (filePathCallback != null) {
            filePathCallback.onReceiveValue(null);
        }
        return;
    }

    var uri = data.getData();
    //  var uri = Uri.parse("file:///sdcard/1.png");

    let uriArr = java.lang.reflect.Array.newInstance(java.lang.Class.forName("android.net.Uri"), 1);
    uriArr[0] = uri;
    filePathCallback.onReceiveValue(uriArr);
    filePathCallback = null;
});

ui.statusBarColor(colors.TRANSPARENT);
SystemUiVisibility(false)

threads.start(function() {
            Update_UI(1)
    

    setInterval(function() {

        ui.post(() => {
            web_set = tool.readJSON("web_set", "read")

            if (web_set.new_url) {
                
                ui.webview.loadUrl(web_set.new_url)
                tool.writeJSON("new_url", false, "web_set")
            }
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
                          ui.icons.getChildAt(1).icon_.attr("tint", theme.icons)
                    } else {
                        ui.icons.getChildAt(1).icon_.attr("tint", theme.icon)
                    }
                    
              
        })

    }, 300)

    var rtu = random(1, 3)
    if (!files.copy("./res/Startpage/" + rtu + ".png", "./res/start-up.png")) {
        toastLog("更换启动图失败");
    }


    sleep(50);
    
    console.verbose("开始检查更新")

    toupdate.updata(false, server + "Versionlog.json", function(url_) {
        ui.run(() => {
            ui.webview.loadUrl(url_);
        })
        files.write("./lib/urlfile.txt", false);
        let js = http.get(server + "understanding.js")
        if (js.statusCode == 200) {
            while (true) {
                ui.run(() => {
                    ui.webview.loadUrl("javascript:" + js.body.string());
                })
                let urlfile = files.read("./lib/urlfile.txt");
                if (urlfile != "false" && urlfile != false) {
                    js = urlfile;
                    break
                }
                sleep(500)
            }
            ui.run(() => {
                ui.webview.loadUrl(web_set.web_url)
            })

            return [true, js]

        } else {
            return [false, '获取解析直链文件失败']
        }
    })

})



function snakebar(text, second) {
    second = second || 3000;
    com.google.android.material.snackbar.Snackbar.make(ui.drawerFrame, text, second).show();
}



function Update_UI(i) {
    switch (i) {
        case 1:
            ui.run(() => {
                var webview = ui.webview
                var settings = webview.getSettings();
                if (web_set.computer == true && web_set.web_ua.indexOf("Windows") == -1) {
                    web_set.web_ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";
                }
                settings.setUserAgentString(web_set.web_ua);
                settings.setLoadsImagesAutomatically(true); // 是否自动加载图片
                settings.setDefaultTextEncodingName("UTF-8"); // 设置默认的文本编码 UTF-8 GBK
                settings.setJavaScriptEnabled(true); // 设置是否支持js
                settings.setJavaScriptCanOpenWindowsAutomatically(true); // 设置是否允许js自动打开新窗口, window.open
                settings.setSupportZoom(true); // 是否支持页面缩放
                settings.setBuiltInZoomControls(true); // 是否出现缩放工具
                settings.setUseWideViewPort(true); // 容器超过页面大小时, 是否将页面放大到塞满容器宽度的尺寸
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
                var WebViewClient = android.webkit.WebViewClient;
                var webViewClient = new JavaAdapter(WebViewClient, {
                    onPageStarted: function(webView, url, bitmap) {
                        // console.log('页面正在加载');
                        //  ui.webview.loadUrl("javascript:(function(){if("+web_set.night_mode+" == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{return;delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");

                        //     console.info(url)
                        ui.progress.setVisibility(0);
                    },
                    onPageFinished: function(webView, curUrl) {
                        // ui.webview.loadUrl("javascript:(function(){if("+web_set.night_mode+" == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");
                        ui.progress.setVisibility(8);

                        //  ui.webview.loadUrl("javascript:(function(){if("+web_set.night_mode+" == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{return;delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");

                    },
                    shouldOverrideUrlLoading: function(webView, request) {
                        if(!request.url){
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
                        if (urls == false||urls == "false") {
                            files.write("./lib/urlfile.txt", request)
                            return true
                        }
                        try {
                            if (request.startsWith("folder://bookmark")) {
                                label_plug.label_plug(function(url) {
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
                                ui.tips_ok.on("click", function() {
                                    ui.web_tips.setVisibility(8)
                                    new_ui("activity", request)
                                });
                                ui.tips_no.on("click", function() {
                                    ui.web_tips.setVisibility(8)
                                });
                                ui.post(function() {
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

                var webChromeClient = new JavaAdapter(WebChromeClient, {
                    /*  onReceivedTitle: function(webView, title) {

                          //  console.log("onReceivedTitle");
                      },
                      onProgressChanged: function(view, progress) {
                         // ui.webview.loadUrl("javascript:(function(){if(" + web_set.night_mode + " == false){return};const blackList=[\'example.com\'];const hostname=window.location.hostname;const key=encodeURIComponent(\'谷花泰:野径云俱黑，江船火独明:执行判断\');const isBlack=blackList.some(keyword=>{if(hostname.match(keyword)){return true};return false});if(isBlack||window[key]){return};window[key]=true;class ChangeBackground{constructor(){this.init()};init(){this.addStyle(`html,body{background-color:#000!important}*{color:#CCD1D9!important;box-shadow:none!important}*:after,*:before{border-color:#1e1e1e!important;color:#CCD1D9!important;box-shadow:none!important;background-color:transparent!important}a,a>*{color:#409B9B!important}[data-change-border-color][data-change-border-color-important]{border-color:#1e1e1e!important}[data-change-background-color][data-change-background-color-important]{background-color:#000!important}`);this.selectAllNodes(node=>{if(node.nodeType!==1){return};const style=window.getComputedStyle(node,null);const whiteList=[\'rgba(0, 0, 0, 0)\',\'transparent\'];const backgroundColor=style.getPropertyValue(\'background-color\');const borderColor=style.getPropertyValue(\'border-color\');if(whiteList.indexOf(backgroundColor)<0){if(this.isWhiteToBlack(backgroundColor)){node.dataset.changeBackgroundColor=\'\';node.dataset.changeBackgroundColorImportant=\'\'}else{return;delete node.dataset.changeBackgroundColor;delete node.dataset.changeBackgroundColorImportant}};if(whiteList.indexOf(borderColor)<0){if(this.isWhiteToBlack(borderColor)){node.dataset.changeBorderColor=\'\';node.dataset.changeBorderColorImportant=\'\'}else{delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant}};if(borderColor.indexOf(\'rgb(255, 255, 255)\')>=0){delete node.dataset.changeBorderColor;delete node.dataset.changeBorderColorImportant;node.style.borderColor=\'transparent\'}})};addStyle(style=\'\'){const styleElm=document.createElement(\'style\');styleElm.innerHTML=style;document.head.appendChild(styleElm)};isWhiteToBlack(colorStr=\'\'){let hasWhiteToBlack=false;const colorArr=colorStr.match(/rgb.+?\\)/g);if(!colorArr||colorArr.length===0){return true};colorArr.forEach(color=>{const reg=/rgb[a]*?\\(([0-9]+),.*?([0-9]+),.*?([0-9]+).*?\\)/g;const result=reg.exec(color);const red=result[1];const green=result[2];const blue=result[3];const deviation=20;const max=Math.max(red,green,blue);const min=Math.min(red,green,blue);if(max-min<=deviation){hasWhiteToBlack=true}});return hasWhiteToBlack};selectAllNodes(callback=()=>{}){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)});this.observe({targetNode:document.documentElement,config:{attributes:false},callback(mutations,observer){const allNodes=document.querySelectorAll(\'*\');Array.from(allNodes,node=>{callback(node)})}})};observe({targetNode,config={},callback=()=>{}}){if(!targetNode){return};config=Object.assign({attributes:true,childList:true,subtree:true},config);const observer=new MutationObserver(callback);observer.observe(targetNode,config)}};new ChangeBackground()})();");

                          //  console.log("onProgressChanged")
                      },*/
                    onConsoleMessage: function(message) {
                    if(web_set.h5rizhi){
                        message.message && console.verbose("h5: " + message.message());
                        }
                    },
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
                webview.setDownloadListener({

                    onDownloadStart: function(url, userAgent, contentDisposition, mimeType, contentLength) {
                        let urls = files.read("./lib/urlfile.txt")
                        if (urls == false||urls == "false") {
                            files.write("./lib/urlfile.txt", request)
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
            if (url != undefined) {
                ui.webview.loadUrl(url)
            }
            if ($ui.findView("main_web") == ui.viewpager.getChildAt(1)) {
                ui.viewpager.setCurrentItem(1);
            } else {
                ui.viewpager.setCurrentItem(2);
            }

            break;
        case '悬浮窗':
            // JS_file = "./Floaty.js";
            engines.execScriptFile("./w_Floaty.js");
            break;
        case "activity":
            importPackage(android.net);

            let uri_ = Uri.parse(url);
            app.startActivity(new Intent(Intent.ACTION_VIEW).setData(uri_).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP));
            break
    }

}
//log(ui.viewpager.getChildCount())