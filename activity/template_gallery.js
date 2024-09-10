"ui";

importClass(android.view.View)
importClass(android.view.WindowManager)
// ---修改状态栏颜色 start--
// clear FLAG_TRANSLUCENT_STATUS flag:
activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
// add FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS flag to the window
activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
activity.getWindow().setStatusBarColor(android.R.color.white)
activity.getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR)
// ---修改状态栏颜色 end--
//let AesUtil = require('./lib/AesUtil.js')

//let commonFunctions = singletonRequire('CommonFunction')
//config.hasRootPermission = files.exists("/sbin/su") || files.exists("/system/xbin/su") || files.exists("/system/bin/su")
/*
if (config.device_width < 10 || config.device_height < 10) {
  toastLog('设备分辨率信息不正确，可能无法正常运行脚本, 请先运行一遍main.js以便自动获取分辨率')
  exit()
}
let local_config_path = files.cwd() + '/local_config.cfg'
let runtime_store_path = files.cwd() + '/runtime_store.cfg'
let aesKey = device.getAndroidId()
*/
require('../lib/Runtimes.js')(global)
ui.layout(
    <vertical>
        <webview id="webview" margin="0 10" />
    </vertical>
)
//let mainScriptPath = FileUtils.getRealMainScriptPath(true)
//mainScriptPath = "/storage/emulated/0/脚本/arkplan"
mainScriptPath = files.path("../").replace("测试.js", "")
let indexFilePath = mainScriptPath + "vue_test/index.html"
const prepareWebView = require(mainScriptPath + 'lib/PrepareWebView.js')

let postMessageToWebView = () => {
    console.error('function not ready')
}
/*
//重命名文件防止缓存
let md5_list = require(mainScriptPath + "/vue_test/config/get_md5.js")()

let _md5_ = JSON.parse(files.read(mainScriptPath + '/vue_test/config/files_md5.json'))
for (let md5 in md5_list) {
    log(md5, md5_list[md5].md5 == _md5_[md5].md5)
    if (md5_list[md5].md5 != _md5_[md5].md5) {
        console.error(md5_list[md5].md5, _md5_[md5].md5)

        _md5_ = indexFilePath;
        indexFilePath = indexFilePath.replace("index.html", "index" + md5_list[md5].md5 + ".html");
        files.rename(_md5_, "index" + md5_list[md5].md5 + ".html");

        break
    }
}
*/
let gallery = require(mainScriptPath+"subview/gallery.js");
let storageConfig = storages.create("chick_config_version");



let bridgeHandler = {
    toast: data => {
        toast(data.message)
    },
    toastLog: data => {
        toastLog(data.message)
    },
    uiExit:data=>{
        ui.finish();
    },
    infoImage: (data, callbackId) => {
        //log(ImgData)
        let dir = gallery.path + "template/";

        let cachePngFiles = Array.from(files.listDir(gallery.path, function(name) {
            return name.endsWith(".png");
        })); //不拷贝没办法对元素操作

        //默认名称排序
        let pngFiles = files.listDir(dir, function(name) {
            return name.endsWith(".png") //&& files.isFile(files.join(dir, name));
        });
        pngFiles = Array.from(pngFiles)
        let imgList = [];

        gallery.isImgInfo = gallery.gallery_info && gallery.gallery_info.img_info;
        if (!gallery.isImgInfo) {
            gallery.gallery_info.img_info = {}
        }
        for (let _img in pngFiles) {

            let templateImg = {
                templateImage: pngFiles[_img],
                cacheImage: '',
                templateInfo: {
                    prototypeWH: gallery.gallery_info.分辨率,
                    remarks: "",
                    visualization: []
                }
            }

            if (files.exists(gallery.path + pngFiles[_img])) {
                templateImg.cacheImage = pngFiles[_img];
                let i_c = cachePngFiles.indexOf(pngFiles[_img]);
                cachePngFiles.splice(i_c, 1);
            }
            let pngName = pngFiles[_img].replace(".png", "");
            templateImg.templateInfo = gallery.gallery_info.img_info[pngName] || {
                "prototypeWH": {
                    "w": 1220,
                    "h": 2712
                },
                "remarks": "",
                "visualization": []
            };
            if (!templateImg.templateInfo.visualization) {
                templateImg.templateInfo.visualization = [];
            }
            for (let i = 1; i < 4; i++) {
                let visualizationPath = context.getExternalFilesDir(null).getAbsolutePath() + "/logs/matchFeatures/" + pngName + "_特征" + i + "_匹配结果.jpg";
                if (files.exists(visualizationPath)) {
                    templateImg.templateInfo.visualization.push(visualizationPath);
                }
            }

            imgList.push(templateImg);
        }
        let ImgData = {
            imgList: imgList,
            imgPath: {
                template: dir,
                cache: gallery.path,
                info: gallery.path + "gallery_info.json"
            },
        }

        postMessageToWebView({
            callbackId: callbackId,
            data: ImgData,
        })

    },
    replaceImage: (file, callbackId) => {
        let success;
        let filepath = file.path+ "_"+file.name ;
                
        try {
            let img = images.fromBase64(file.img);
            if (!img) {
                tips = "失败\n无法解码base64";
                console.error(tips);
            } else {
                
                success = images.save(img, filepath, "png", 100);
                tips = file.name + "\n保存到指定路径:" + success;
                console.log(tips, filepath)
            }
            img.recycle();
        } catch (e) {
            tips = "失败\n可能是解码base64报错";
            console.error(tips, e);
        }
        postMessageToWebView({
            callbackId: callbackId,
            data: {
                "name":"_"+file.name,
                "message": tips,
                "issuccess": success,
            }
        })
        //为了防止vue使用原来的缓存图像，先改名，等那边更新完再改回来
        setTimeout(() => {
            files.remove(file.path+file.name);
            files.rename(filepath,file.name);
        },200)
    },
    deleteCacheImage: (data, callbackId) => {
        //log(data.file)
        console.info("删除文件:" + files.remove(data.path + data.file));
    },
    /*
    loadConfigs: (data, callbackId) => {
        postMessageToWebView({
            callbackId: callbackId,
            data: config
        })
    },*/
    saveConfigs: data => {

        if (!Array.isArray(data)) {
            let newVal = undefined;
            Object.keys(data).forEach(key => {
                newVal = data[key]
                if (typeof newVal !== 'undefined') {
                    storageConfig.put(key, newVal)
                   // config[key] = newVal
                }
            })
        }

        Object.keys(data).forEach(key => {
            delete data[key].templateInfo.visualization;
            const imageKey = data[key].templateImage.replace(".png", "");
            gallery.gallery_info.img_info[imageKey] = data[key].templateInfo;

        })
        //    console.warn(gallery.gallery_info)
        files.write(
            gallery.path + "template/gallery_info.json",
            JSON.stringify(gallery.gallery_info),
            (encoding = "utf-8")
        )

        //sendConfigChangedBroadcast(data)
    },
    // 测试回调
    callback: (data, callbackId) => {
        log('callback param:' + JSON.stringify(data))
        postMessageToWebView({
            callbackId: callbackId,
            data: {
                message: 'hello,' + callbackId
            }
        })
    }
}


postMessageToWebView = prepareWebView(ui.webview, {
    mainScriptPath: mainScriptPath,
    indexFilePath: "file://" + indexFilePath,
    bridgeHandler: bridgeHandler,
    onPageFinished: () => {
        ui.webview.loadUrl('javascript:window.vConsole && window.vConsole.destroy()')
    
    }

})

ui.emitter.on('pause', () => {
    //通知webview执行保存图库配置函数
    postMessageToWebView({
        functionName: 'saveGalleryConfigs'
    })
})

events.on("exit", function() {
    files.rename(indexFilePath, "index.html");
})

function sendConfigChangedBroadcast(newConfig) {
    newConfig = newConfig //|| config
    console.verbose(engines.myEngine().id + ' 发送广播 通知配置变更')
    events.broadcast.emit('chick_config_versionconfig_changed', {
        config: newConfig,
        id: engines.myEngine().id
    })
}