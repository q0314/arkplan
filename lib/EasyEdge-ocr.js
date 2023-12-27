/*明日计划32位3.2.2以上版本可用EasyEdge
 *在基建换班或关闭应用中的调用方法
 let taglb;//定义个变量用于接收返回的数据
 let ocr = require("./lib/ocr.js");
 ocr.初始化Manager类();
 taglb = ocr.识别("公开招募", "辅助");
 log(taglb);
 *明日计划64位4.1.9以上版本可用
 let MLKitOCR = $plugins.load('org.autojs.autojspro.plugin.mlkit.ocr');
let ocr = new MLKitOCR();

 let img = images.read("/storage/emulated/0/MIUI/12.png")
    let result = ocr.detect(img);
    log(result)
 *识别的图片可以用自带的截图功能可以传入自定义的图片路径。ocr.识别(路径,"自定义图片");
 *用完记得ocr.销毁()
 */
var manager;
let banben = false;

if (app.autojs.versionCode > 8082200) {
    banben = true;
}
events.on('exit', function() {
    try {
        sleep(2500)
        if (banben) {
            manager.release();
        } else {
            manager.destroy();
        }
        console.verbose("监听到退出事件，销毁类");
    } catch (err) {}
});

var ocr_modular = {
    初始化Manager类: function() {
        importClass(android.os.Build);
        log("cpu架构：" + Build.CPU_ABI)
        if (banben) {
            let MLKitOCR = $plugins.load('org.autojs.autojspro.plugin.mlkit.ocr');
            manager = new MLKitOCR();
        } else {
            importClass(android.content.Context);
            importClass(android.graphics.Bitmap);
            importClass(android.graphics.BitmapFactory);
            importClass(android.graphics.Point);
            importClass(android.widget.TextView);

            importClass(com.baidu.ai.edge.core.infer.InferConfig);
            importClass(com.baidu.ai.edge.core.infer.InferManager);
            importClass(com.baidu.ai.edge.core.ocr.OcrResultModel);

            importClass(java.io.InputStream);
            importClass(java.util.List);

            sleep(10)
            console.verbose("加载配置类")
            /* 1. 准备配置类，初始化Manager类。可以在onCreate或onResume中触发，请在非UI线程里调用 */
            let config = new InferConfig(context.getAssets(), "infer-ocr/config.json");
            sleep(20)

            try {
                console.verbose("初始化Manager类：\n" + context);
                manager = new InferManager(context, config, "BC57-01EC-32B2-BF02");
            } catch (err) {
                console.verbose("deviceId is empty");
                try {
                    manager.destroy();
                } catch (err) {
                    manager = null;
                }
                console.verbose("销毁类，重新尝试")
                manager = new InferManager(context, config, "BC57-01EC-32B2-BF02");

            }
            console.verbose(config)
        }
        return
    },
    识别: function(imgPath, getSreen) {

        console.info(imgPath + getSreen)
        if (getSreen != "自定义图片") {
            imgPath = files.path("./mrfz/" + imgPath + ".png");
            switch (getSreen) {
                case 'root':
                    shell("screencap -p " + imgPath, true)
                    shell("chmod 777 " + imgPath, true);
                    break;
                case 'Shizuku':
                    $shell.setDefaultOptions({
                        adb: true
                    });
                    shell("screencap -p " + imgPath);
                    shell("chmod 777 " + imgPath);
                    break;
                case '辅助':
                    try {
                        images.save(captureScreen(), imgPath);
                    } catch (er) {
                        console.error("图片似乎已回收，重新尝试。错误信息：" + er)
                        sleep(1000);
                        try {
                            captureScreen(imgPath);
                        } catch (err) {
                            toast("截取屏幕失败，请重试，错误信息：\n" + err);
                            console.error("截取屏幕失败，请重试，错误信息：\n" + err);
                            return null
                        }
                    }
                    break;
            }
            sleep(10);
        }
        let start = new Date()
        let image;
        let results = null;

        if (banben) {
            image = images.read(imgPath);
            results = manager.detect(image);
            !image.isRecycled() && image.recycle();
        } else {
            let NUM_OF_API_CALLS = 1;
            let CONFIDENCE = 0.2;

            /* 2.2 推理图片及解析结果 */

            for (let j = 0; j < NUM_OF_API_CALLS; j++) {
                // 在模型销毁前可以不断调用。但是不支持多线程
                try {
                    let image_s = images.read(imgPath);
                    image = image_s.getBitmap();
                    results = manager.ocr(image, CONFIDENCE);
                    !image_s.isRecycled() && image_s.recycle();
                } catch (err) {
                    throw Error("请确认已初始化Manager类!\n" + err);
                };
            }
        }
        var taglb = [];
        // 解析结果
        if (results != null) {
            var quantity = banben ? results.length : results.size()
            log("识别结果数量: " + quantity);
            if (quantity > 0) {
                console.verbose("过滤识别结果中")
                for (let i = 0; i < quantity; i++) {
                    var re = banben ? results[i] : results.get(i);
                    var retext = banben ? re.text : re.getLabel();
                    switch (true) {
                        case retext.indexOf("0") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("1") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("2") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("3") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("4") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("6") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("7") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("8") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("9") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("得的千员") >= 0:
                            retext = false;
                            break;
                    case retext.indexOf("得的干员") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("新手") >= 0:
                            retext = "新手";
                            break;
                        case retext.indexOf("说明") >= 0:
                            retext = false;
                            break;
                        case retext.indexOf("时限") >= 0:
                            retext = false;
                            break;
                            case retext.indexOf("DEPAR") >= 0:
                            retext = false;
                            break;
                    }
                    if (retext != false) {
                        switch (retext) {
                            case "泊疗":
                                retext = "治疗";
                                break;
                            case "靳手":
                                retext = "新手";
                                break;
                            case "支缓":
                            case "支摄":
                                retext = "支援";
                                break
                            case "背男":
                                retext = "削弱";
                                break;
                            case "削写":
                                retext = "削弱";
                                break
                            case "削写写":
                                retext = "削弱";
                                break
                            case "削弱写":
                                retext = "削弱";
                                break;
                            case "高级资深于员":
                            case "高級资深于员":
                            case "高級资深干员":
                            case "高级资深千员":
                                retext = "高级资深干员";
                                break;
                            case "资深于员":
                            case "资深千员":
                            case "·资深千员":
                            case "·资深干员":
                                retext = "资深干员";
                                break;
                            case "近卫千员":
                            case "近卫于员":
                                retext = "近卫干员";
                                break;

                            case "医疗千员":
                                retext = "医疗干员";
                                break;
                            case "狙击千员":
                            case "祖击千员":
                            case "祖击干员":
                                retext = "狙击干员";
                                break;
                            case "重装千员":
                                retext = "重装干员";
                                break;
                            case "术师千员":
                                retext = "术师干员";
                                break;
                            case "特种千员":
                                retext = "特种干员";
                                break;
                            case "先锋千员":
                            case "先鋒千员":
                            case "先鋒干员":
                                retext = "先锋干员";
                                break;
                            case "辅助千员":
                            case "铺助干员":
                                retext = "辅助干员";
                                break;
                            case "快速遠复活":
                                retext ="快速复活";
                                break;
                        }
                    }
                    if (retext != false) {
                        switch (retext) {
                            case "联络中":
                            case "招募频算":
                            case "招募预算":
                            case "招算预算":
                                break;
                            case "(最多3项)":
                                break;
                            case "(最多3项":
                                break;
                            case "职业需求":
                                break;
                            case "招募时限":
                                break;
                            case ":":
                            case "、":
                                break;
                            case "DCa":
                            case "DCo":
                            case "DCO":
                                break;
                            case "HE":
                            case "E":
                            case "E達":
                                break;
                            case "每":
                                break;
                            case "低":
                                break;
                            case "主":
                                break;
                            case "这":
                            case "推":
                                break;
                            case "通":
                                break;
                            case "米":
                                break;
                            case "C":
                                break;
                            case "可获得的干员":
                            case "可获得的千员":
                            case "·可获得的干员":
                                break;
                            case "招募说明":
                            case "招募说明k":
                                break;
                            case "招募说明>":
                                break;
                            case "招募说明》":
                                break;
                            default:
                                if (retext.indexOf("联络次数") == -1) {
                                    taglb.push({
                                        text: retext,
                                        x: banben ? re.bounds.left : re.getPoints().get(0).x,
                                        y: banben ? re.bounds.top : re.getPoints().get(0).y,
                                    });
                                }
                        }
                    }
                }
            }

        };
        log('耗时' + (new Date() - start) + 'ms');
        !image.isRecycled() && image.recycle();
        results = null;
        return taglb
    },
    销毁: function() {
        try {
            if (banben) {
                manager.release()
            } else {
                manager.destroy();
            }
        } catch (err) {
            throw Error("请确认已初始化Manager类！\n" + err)
        }
    }
};
module.exports = ocr_modular;