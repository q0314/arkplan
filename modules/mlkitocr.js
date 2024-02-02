/*
// 本插件理论上支持4.1.1开始的所有版本的AutoJS
 // AutoJS Pro 9需要改为$plugins 不过pro建议直接使用官方的那个插件
 let $MlKitOCR = plugins.load('com.tony.mlkit.ocr')
 requestScreenCapture()
 let img = captureScreen()
 // 识别图片中的纯文本
 let text = $MlKitOCR.recognizeText(img)
 console.log('text:', text)
 // 可选参数 region[x, y, w, h] 识别指定区域的文本
 let textInRegion = $MlKitOCR.recognizeText(img, { region: [10, 10, 500, 1000] })
 console.log('text in region:', textInRegion)
 // 获取图片中文本携带位置信息
 let this.resultList = $MlKitOCR.detect(img)
 console.log('this.resultList:', JSON.stringify(this.resultList))
 // 可选参数region和上面的一样
 let this.resultListInRegion = $MlKitOCR.detect(img, { region: [10, 10, 500, 1000] })
 console.log('result list in region:', JSON.stringify(this.resultListInRegion))
 // 返回列表字段定义 返回的是一行的文本信息
 /*
 OcrResult {
 label: // 当前行文本信息
 bounds: // 所在区域 Rect 对象
 confidence: // 置信度 0->1
 elements: // OcrResult 行内拆分的元素
 }
 
 */
importClass(android.os.Build);
importClass(android.content.Context);


let MlKitOCRDetector = function (instance) {

    /**
     * ocr实例
     */
    this.instance = instance;
    /**
     * 是否64位架构
     */
    this.is64 = /64$/.test(context.getApplicationInfo().nativeLibraryDir);

    function 矫正规则(rectify_json_path, content) {
        if (!rectify_json_path || !files.exists(rectify_json_path)) {
            return content;
        }
        var rectify_json = JSON.parse(
            files.read(rectify_json_path, (encoding = "utf-8"))
        );
        if (rectify_json.replace_some_characters) {
            rectify_key = Object.keys(rectify_json.replace_some_characters);

            for (let t = 0; t < rectify_key.length; t++) {
                // console.verbose(rectify_key[t])
                if (rectify_json.replace_some_characters[rectify_key[t]].regular) {
                    let tool = content.match(new RegExp(rectify_key[t], "g"));
                    if (tool) {
                        //直接用tool[0]只能替换一次
                        content = content.replace(new RegExp(rectify_key[t], "g"), rectify_json.replace_some_characters[rectify_key[t]].correct)
                    }
                } else {
                    if (content.indexOf(rectify_key[t]) != -1) {
                        content = content.replace(rectify_key[t], rectify_json.replace_some_characters[rectify_key[t]].correct)
                    }
                }

            }
        }
        if (rectify_json.replace_full_character) {
            rectify_key = Object.keys(rectify_json.replace_full_character);

            for (let t = 0; t < rectify_key.length; t++) {

                if (rectify_json.replace_full_character[rectify_key[t]].regular) {
                    let tool = content.match(new RegExp(rectify_key[t], "g"));
                    if (tool) {
                        content = rectify_json.replace_full_character[rectify_key[t]].correct;
                    }
                } else {
                    if (content == rectify_key[t]) {
                        content = rectify_json.replace_full_character[rectify_key[t]].correct;
                    }
                }
            }
        }

        if (rectify_json.filter_partial_characters) {
            rectify_key = Object.keys(rectify_json.filter_partial_characters);

            for (let t = 0; t < rectify_key.length; t++) {
                //  console.verbose(rectify_key[t])

                if (rectify_json.filter_partial_characters[rectify_key[t]]) {
                    let tool = content.match(new RegExp(rectify_key[t]));
                    if (tool && (tool.input != tool[0])) {
                        return false
                    }
                } else {

                    if (content.indexOf(rectify_key[t]) != -1 && (content.length != rectify_key[t].length)) {
                        return false
                    }
                }
            }
        }

        if (rectify_json.filter_full_characters) {
            rectify_key = Object.keys(rectify_json.filter_full_characters);

            for (let t = 0; t < rectify_key.length; t++) {
                //  console.verbose(rectify_key[t])

                if (rectify_json.filter_full_characters[rectify_key[t]]) {
                    let tool = content.match(new RegExp(rectify_key[t]));
                    if (tool && (tool.input == tool[0])) {
                        return false
                    }
                } else {
                    if (content == rectify_key[t]) {
                        return false
                    }
                }
            }
        }
        return content
    }

    /**
     * ocr识别
     * @param {*} img 
     * @param {object} options 
     * @returns 
     */
    this.detect = function (img, options) {
        options = options || {};
        let start = new Date();
        //交给mlkit处理图片并开始识别
        this.resultList = this.instance.detect(img, {
            region: options.region,
        });
        //回收图片
        !img.isRecycled() && img.recycle();
        // 解析结果

        let taglb = [];
        switch (options.rectify_json_path) {
            case "公招":
                options.rectify_json_path = "./lib/game_data/ocr_公招_矫正规则.json";
                break
            case "信用":
                options.rectify_json_path = "./lib/game_data/ocr_信用_矫正规则.json";
                break
            case "通用":
                options.rectify_json_path = "./lib/game_data/ocr_通用_矫正规则.json";
                break
        }
        if (!options.rectify_json_path || !files.exists(options.rectify_json_path)) {
            console.error("请确保ocr字符修正规则文件存在: " + options.rectify_json_path);
        };

        if (this.resultList != null && this.resultList.length > 0) {
            // console.verbose("过滤识别结果中");
            for (let i = 0; i < this.resultList.length; i++) {

                let sequence;
                if (this.is64) {

                    //64位
                    sequence = JSON.parse(JSON.stringify(this.resultList[i].elements));

                    for (let e = 0; e < sequence.length; e++) {

                        let textual = (typeof sequence[e] == "string" ? JSON.parse(sequence[e]) : sequence[e]);
                        let retext = textual.label;
                        retext = 矫正规则(options.rectify_json_path, retext)

                        if (!retext || retext == "") {
                            continue;
                        }

                        taglb.push({
                            text: retext,
                            left: textual.bounds.left,
                            top: textual.bounds.top,
                            right: textual.bounds.right,
                            bottom: textual.bounds.bottom,
                        });
                    }
                } else {
                    //32位ocr插件使用区域截图时elements返回的坐标参数有误
                    let textual = this.resultList[i];
                    let retext = textual.label;
                    retext = 矫正规则(options.rectify_json_path, retext)

                    if (!retext || retext == "") {
                        continue;
                    }

                    taglb.push({
                        text: retext,
                        left: textual.bounds.left,
                        top: textual.bounds.top,
                        right: textual.bounds.right,
                        bottom: textual.bounds.bottom,
                    });

                }
            }
            if (taglb.length < 6 && options.rectify_json_path == "./lib/game_data/ocr_公招_矫正规则.json") {
                for (let i = 0; i < this.resultList.length; i++) {
                    log(this.resultList[i].label);
                }
            }

        };
        console.verbose("识别结果数量: " + (this.resultList ? this.resultList.length : 0) + '\n耗时' + (new Date() - start) + 'ms');


        this.resultList = null;
        return taglb;
        //  return this.resultList

    }

    this.destroy = function () {
        return true;
    }

    this.矫正规则测试 = function (path, retext) {
        if (!files.exists(path)) {
            toastLog("规则文件不存在,路径:" + path)
            return
        }
        retext = 矫正规则(path, retext)
        toastLog(retext)
        return retext;
    }



}

let MlKitOCR = {
    $MlKitOCR: MlKitOCRDetector,
    is64: /64$/.test(context.getApplicationInfo().nativeLibraryDir),
    typeName: 'MlKitOCR',

    /**
     * 获取ocr是否有效安装
     */
    isInstalled() {

        try {
            this.MlKitOCR = plugins.load('com.tony.mlkit.ocr');
        } catch (e) {
            e = "未安装OCR插件，无法使用\n请打开明日计划-侧边栏-设置-OCR插件扩展:\n" + e;
            // toast(e);
            console.error(e)

            return false;
        };
        log("明日计划架构：" + Build.CPU_ABI);
        log("OCR支持的架构：" + this.MlKitOCR.get_ABI);
        // if (device.product == "SM-G9750" && device.release == 9) {
        //"雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iyraG0fjzukf"
        //  return false
        // }

        //pro8只支持32位，pro9支持32位和64位
        if ((app.autojs.versionCode <= 8082200 && this.MlKitOCR.get_ABI.toString().indexOf('arm64-v8a') != -1) || (this.MlKitOCR.get_ABI.toString().indexOf(Build.CPU_ABI.toString()) == -1)) {
            //   if (device.product == "SM-G9750" && device.release == 9) {
            //      tips = "雷电9仅可使用x86-32位ocr插件\n\nhttps://234599.lanzouv.com/iNuvL0p9p8fi"
            //      } else {
            tips = "ocr不可用，请尝试以下方法:\n\n1.OCR包不支持明日计划" + (this.is64 ? "64位" : "32位") + "架构:" + Build.CPU_ABI + ",请更换其它OCR版本尝试" +
                "\n\n2.32位明日计划无法使用64位OCR包\n请重新下载安装32位ocr包\n\n全版本链接https://234599.lanzouv.com/b00q05mpe 密码:421";
            toast(tips);
            console.error(tips);
            //   }
            return false

        }

        return true
    },

    /**
     * 安装
     */
    install(option) {
        let self = this;
        if (this.isInstalled()) {
            option.successCallback();
            return true;
        }
        let con_;
        let url = 'https://flowus.cn/share/2a01a8fc-6013-4d8e-ae69-73a35073dc07';
        con_ = "请打开链接跳转到浏览器下载安装mlkit ocr 文字识别插件，请注意版本架构是否符合明日计划,否则无法使用\n\n" + url +
            "\n\n当前明日计划架构：" + Build.CPU_ABI + "，\n建议下载安装" + (self.is64 ? "OCR 64位包" : "OCR 32位包") + "，\n\n安装错误的OCR版本会导致OCR无法识别卡住，应用崩溃。关于应用-明日计划32位只能使用32位OCR插件"
        if (device.product == "SM-G9750" && device.release == 9) {
            con_ = "雷电9仅可使用x86-32位ocr插件\n\n" + url;
        }

        if (con_ != undefined) {
            dialogs.build({
                type: "app",
                title: "提醒",
                titleColor: "#000000",
                contentColor: "#F44336",
                content: con_,
                positive: "打开链接",
                negative: "取消",
                cancelable: false,
                canceledOnTouchOutside: false,
                // view高度超过对话框时是否可滑动
                wrapInScrollView: false,
                // 按下按钮时是否自动结束对话框
                autoDismiss: true
            }).on("positive", () => {
                app.openUrl(url);

            }).show();
            option.failCallback();
            return false
        }

    },

    prepare() {
        this.$MlKitOCR = new MlKitOCRDetector(this.MlKitOCR)
        return this.$MlKitOCR;
    },

    //ocr : this.detector.detect(bmp),


}


module.exports = MlKitOCR;
