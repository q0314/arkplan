"ui";
/*
 * @Author: q0314
 * @Date: 2024-09-08 13:24:38
 * @Last Modified by: q0314
 * @Last Modified time: 2024-09-20 15:10:01
 * @Description: 用于对模板图库文件的管理
 * @example
   //调用方法，运行脚本的同时添加数据源:
   engines.execScriptFile("./activity/template_gallery.js", {
        arguments: {
        gallery_name:"",//图库名，必填
        gallery_template_path:"",//图库模板目录，必填
        gallery_cache_path:"",//图库缓存图片目录，一般是使用模板目录的上级目录作为缓存目录
        gallery_zip:"",//图库模板图片压缩包，没有的话，首次运行自动压缩dir目录所有文件
        },
        path: files.path('./activity/')//指定脚本运行的目录，用于require时寻找模块文件。
   })
 */

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
ui.layout(
    <vertical>
        <webview id="webview" margin="0 10" />
    </vertical>
)
//let mainScriptPath = FileUtils.getRealMainScriptPath(true)
//mainScriptPath = "/storage/emulated/0/脚本/arkplan"
mainScriptPath = files.path("../").replace("测试.js", "");

if (mainScriptPath.endsWith("/")) {
    // 删除最后一个字符
    mainScriptPath = mainScriptPath.slice(0, -1);
}
log(mainScriptPath)
require(mainScriptPath + '/lib/Runtimes.js')(global)
require(mainScriptPath + '/lib/ResourceMonitor.js')(runtime, this)

let {
    filesx
} = require(mainScriptPath + '/modules/ext-files');
let indexFilePath = mainScriptPath + "/vue_configs/index.html"
const prepareWebView = require(mainScriptPath + '/lib/PrepareWebView.js')

let postMessageToWebView = () => {
    console.error('function not ready')
}
/*
//重命名文件防止缓存
let md5_list = require(mainScriptPath + "/vue_configs/config/get_md5.js")()

let _md5_ = JSON.parse(files.read(mainScriptPath + '/vue_configs/config/files_md5.json'))
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
let testImgInfo = {};
var ITimg;
var height = device.height,
    width = device.width;

if (width > height) { // || setting.模拟器) {
    height = device.width,
        width = device.height;
}

let gallery = require(mainScriptPath + "/subview/gallery.js");
let storageConfig = storages.create("gallery_config");
var execArgv = engines.myEngine().execArgv;

//storageConfig.clear();

let galleryInfo_list = storageConfig.get("gallery_info", []);

let galleryInfo = {
    value: galleryInfo_list.length,
    dir: undefined,
    zip: files.path("../lib/data/官方｛2712×1220}.zip"),
    name: "明日计划内置模板",
    cache: undefined,
};
galleryInitialization();

function galleryInitialization(switch_data) {
    if (switch_data) {
        galleryInfo = switch_data;
        gallery.path = galleryInfo.cache;
        updateGalleryInfo();
        return true;
    } else {
        //图库模板图片目录
        if (execArgv.gallery_template_path) {
            galleryInfo.dir = execArgv.gallery_template_path;
        } else {
            galleryInfo.dir = gallery.path + "template/";
        }
        //图库缓存目录
        if (execArgv.gallery_cache_path) {
            gallery.path = execArgv.gallery_cache_path;
            if (!gallery.path.endsWith("/")) {
                gallery.path += "/";
            }
        } else {
            //使用上级目录
            gallery.path = new java.io.File(galleryInfo.dir).getParent() + "/";
        }
        galleryInfo.cache = gallery.path;

    }
    if (execArgv.gallery_name) {
        galleryInfo.name = execArgv.gallery_name;
        galleryInfo.zip = execArgv.gallery_zip;
        if (!galleryInfo.zip.endsWith(".zip") || !files.exists(galleryInfo.zip)) {

            galleryInfo.zip = galleryInfo.dir + galleryInfo.name + '.zip';
        }
        if (!files.exists(galleryInfo.zip)) {
            filesx.zip(galleryInfo.dir, galleryInfo.zip, {
                onStart() {
                    console.log('开始压缩模板图片...');
                },
                /* onProgress(o) {
                     console.log((o.processed / o.total * 100).toFixed(2));
                 },*/
                onSuccess(result) {
                    console.log("完成压缩:\n" + result.zipped_path);
                    galleryInfo.zip = result.zipped_path;
                },
                onFailure(e) {
                    console.error(e);
                },
            }, {
                is_exclude_root_folder: true
            });
        }
        updateGalleryInfo()
    }

}

function updateGalleryInfo() {
    if (files.exists(galleryInfo.dir + "gallery_message.json")) {
        gallery.gallery_info = JSON.parse(files.read(galleryInfo.dir + "gallery_message.json"), (encoding = "utf-8"));
    } else if (files.exists(galleryInfo.dir + "gallery_info.json")) {
        gallery.gallery_info = JSON.parse(files.read(galleryInfo.dir + "gallery_info.json"), (encoding = "utf-8"));
    } else {
        gallery.gallery_info = {
            "name": galleryInfo.name + " " + device.width + "x" + device.height,
            "分辨率": {
                "w": device.width,
                "h": device.height
            },
            "服务器": "简中服",
            "识别方式": {
                "ocr": true,
                "找图": true
            },
            "img_info": {

            }
        }
    }
}


let isGalleryInfo = galleryInfo_list.find(item => item.name === galleryInfo.name);
if (!isGalleryInfo) {
    galleryInfo_list.push(galleryInfo);
    storageConfig.put("gallery_info", galleryInfo_list);
} else {
    galleryInfo = isGalleryInfo;
}

let bridgeHandler = {
    toast: data => {
        toast(data.message)
    },
    toastLog: data => {
        console.error(JSON.stringify(data))
        toastLog(data.message)
    },
    uiExit: data => {
        ui.finish();
    },
    searchValue: () => {
        postMessageToWebView({
            functionName: 'doSearchValue'
        })
    },
    doTestInfo: (data, callbackId) => {
        if (data.input) {
            testImgInfo = data;
        } else {
            postMessageToWebView({
                callbackId: callbackId,
                data: testImgInfo,
            })
        }
    },
    /**
     * 特征匹配测试
     */
    startTest: (data, callbackId) => {

        //console.warn(data);
        imgName = data.imgName.replace(".png", "");
        delete data.imgName;
        delete data.areaText;
        delete data.matcherText;
        if (!data.picture) {
            postMessageToWebView({
                callbackId: callbackId,
                data: {
                    isSuccess: false,
                    message: "大图为空",
                },
            })
            return
        } else {
            data.picture = images.fromBase64(data.picture);
            if (!data.picture) {
                postMessageToWebView({
                    callbackId: callbackId,
                    data: {
                        isSuccess: false,
                        message: "无法将base64解码为img",
                    },
                })
                return
            }
        }

        if (files.exists(data.small_image_catalog + imgName + ".png")) {

            let result;
            let times;
            let visualization = [];
            height = data.picture.getWidth();
            width = data.picture.getHeight();
            threads.start(function() {
                if (typeof ITimg == "undefined") {

                    ITimg = require(mainScriptPath + "/ITimg.js");
                    ITimg.setting.截图 = null;
                    new ITimg.Prepare();
                }
                times = new Date();
                result = ITimg.matchFeatures(imgName, data);
                //     console.info(result)
                for (let i = 1; i <= 4; i++) {
                    let visualizationPath = context.getExternalFilesDir(null).getAbsolutePath() + "/logs/matchFeatures/" + imgName + "_特征" + i + "_匹配结果.jpg";
                    visualization.push(files.exists(visualizationPath) ? visualizationPath : '');

                }
                if (data.saveSmallImg && result) {
                    let parts = data.small_image_catalog.split(/[\/\\]/);
                    // 去掉数组的最后第二个元素，即最后的目录名
                    parts.splice(parts.length - 2, 1);
                    parts.pop();
                    //获得上一级目录小图缓存目录
                    data.small_image_save_catalog = files.path(parts.join('/') + "/") + imgName + ".png";
                    if (files.exists(data.small_image_save_catalog)) {
                        files.move(data.small_image_save_catalog, data.small_image_catalog + imgName + ".png")
                    }
                }
            }).join();
            postMessageToWebView({
                callbackId: callbackId,
                data: {
                    isSuccess: result ? true : false,
                    message: result ? '耗时:' + (new Date() - times) + 'ms' : "未知，可能区域未包含相似小图",
                    result: result,
                    visualization: visualization,
                },
            })
        } else {
            postMessageToWebView({
                callbackId: callbackId,
                data: {
                    isSuccess: false,
                    path: data.small_image_catalog + imgName + ".png",
                    message: data.small_image_catalog + imgName + ".png 文件不存在",
                },
            })
        }


    },
    switch_gallery: (data, callbackId) => {

        let _galleryInfo = galleryInitialization(data)

        if (_galleryInfo) {
            postMessageToWebView({
                callbackId: callbackId,
                data: {
                    "message": "",
                    "isSuccess": true,
                }
            })
            postMessageToWebView({
                functionName: 'doSaveImageInfo'
            })

        } else {
            tips = "未在数据源找到：" + data
            postMessageToWebView({
                callbackId: callbackId,
                data: {
                    "message": tips,
                    "isSuccess": false,
                }
            })
            console.error(tips);
        }
    },
    galleryInfo: (data, callbackId) => {

        postMessageToWebView({
            callbackId: callbackId,
            data: {
                galleryInfo: galleryInfo,
                galleryInfo_list: galleryInfo_list
            }
        })
    },
    /**
     * 生成所有模板图详细信息返回
     */
    infoImage: (data, callbackId) => {

        let cachePngFiles = Array.from(files.listDir(gallery.path, function(name) {
            return name.endsWith(".png");
        })); //不拷贝没办法对元素操作

        //默认名称排序
        let pngFiles = files.listDir(galleryInfo.dir, function(name) {
            return name.endsWith(".png") //&& files.isFile(files.join(galleryInfo.dir, name));
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
            // let similarity = undefined;

            if (files.exists(gallery.path + pngFiles[_img])) {
                templateImg.cacheImage = pngFiles[_img];
                //对比图片相似度需分辨率一致，弃用了
                /*  let cacheImage = images.read(gallery.path + pngFiles[_img]);
                  let templateImage = images.read(galleryInfo.dir + pngFiles[_img]);
                  similarity = images.getSimilarity(templateImage, cacheImage);
                  try {
                      cacheImage.recycle();
                      templateImage.recycle();
                  } catch (e) {
                      console.error(e);
                  }
                  */
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
            templateImg.templateInfo.visualization = [];

            //ITimg.js仅提供4个特征匹配方式
            for (let i = 1; i <= 4; i++) {

                let visualizationPath = context.getExternalFilesDir(null).getAbsolutePath() + "/logs/matchFeatures/" + pngName + "_特征" + i + "_匹配结果.jpg";
                templateImg.templateInfo.visualization.push(files.exists(visualizationPath) ? visualizationPath : '');

            }

            imgList.push(templateImg);
        }
        let ocrCacheImgList = cachePngFiles.map(image => ({
            cacheImage: image
        }));

        let ImgData = {
            imgList: imgList,
            ocrCacheImgList: ocrCacheImgList,
            imgPath: {
                template: galleryInfo.dir,
                cache: gallery.path,
                zip: galleryInfo.zip,
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
        let filepath = file.path + "_" + file.name;

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
                "name": "_" + file.name,
                "message": tips,
                "issuccess": success,
            }
        })
        //为了防止vue使用原来的缓存图像，先改名，等那边更新完再改回来
        setTimeout(() => {
            files.remove(file.path + file.name);
            files.rename(filepath, file.name);
        }, 200)
    },
    deleteCacheImage: (data, callbackId) => {
        //log(data.file)
        console.info("删除文件:" + files.remove(data.path + data.file));
    },
    /**
     * 解压模板图库，还原模板
     */
    restoreTemplate: (data, callbackId) => {
        
        if (data.deleteFile) {
            console.warn("删除无关图片文件:" + galleryInfo.dir)
            let fileList = files.listDir(galleryInfo.dir, function(name) {
                return name.endsWith(".png") //&& files.isFile(files.join(galleryInfo.dir, name));
            });
            for (let _file of fileList) {
                files.remove(galleryInfo.dir + _file);
            }
        }
        //console.trace(galleryInfo.zip,data.zip)
        if(data.import&&!files.exists(data.zip)){
            postMessageToWebView({
                callbackId,callbackId,
                data:{
                    message:"压缩包不存在",
                    isSuccess:false
                }
            })
        }
        let isSuccess = gallery[(galleryInfo.name == "明日计划内置模板") ? "更换图库" : "unzip_copy"]((data.import ? data.zip :galleryInfo.zip), galleryInfo.dir);
        postMessageToWebView({
            callbackId: callbackId,
            data: {
                "message": "未知，可能不是.zip",
                "isSuccess": isSuccess,
            }
        })
        if (isSuccess) {
            postMessageToWebView({
                functionName: 'doSaveImageInfo'
            })
        }

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
        // console.warn(gallery.gallery_info)
        //log(galleryInfo.dir + (files.exists(galleryInfo.dir+"gallery_message.json") ?  "gallery_message.json" : "gallery_info.json"))
        files.write(
            galleryInfo.dir + (files.exists(galleryInfo.dir + "gallery_message.json") ? "gallery_message.json" : "gallery_info.json"),
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
    enable_log: true,
    bridgeHandler: bridgeHandler,
    onPageFinished: () => {
        // ui.webview.loadUrl('javascript:window.vConsole && window.vConsole.destroy()')

    }

})

ui.emitter.on('pause', () => {
    //通知webview执行保存图库配置函数
    postMessageToWebView({
        functionName: 'saveGalleryConfigs'
    })
})
let timeout = null
ui.emitter.on('back_pressed', (e) => {
  if (ui.webview.canGoBack()) {
    ui.webview.goBack()
    e.consumed = true
    return
  }
  // toastLog('触发了返回')
  if (timeout == null || timeout < new Date().getTime()) {
    e.consumed = true
    toastLog('再按一次退出')
    // 一秒内再按一次
    timeout = new Date().getTime() + 1000;
  } else {
   // toastLog('再见~')
  }
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