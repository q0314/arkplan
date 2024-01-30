importClass(android.content.Context);


let XiaoYueOcrDetector = function (OCR) {
    /**
    * ocr实例
    */
    //for(let i of OCR.xiaoyue.getClass().getDeclaredFields()){
    // log(i+"\n");
    //}
    this.instance = OCR.xiaoyue;
    this.initResult = false;


    function 矫正规则(rectify_json_path, content) {
        if (!rectify_json_path || !files.exists(rectify_json_path)) {
            return content;
        }
        let rectify_json = JSON.parse(
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
     * 初始化模型文件
     * @returns 
     */
    this.init = function () {
        // this.instance.cpuThreadNum = 4; //可以自定义使用CPU的线程数
        // this.instance.checkModelLoaded =false; // 可以自定义是否需要校验模型是否成功加载 默认开启 使用内置Base64图片进行校验 识别测试文本来校验模型是否加载成功

        // 内置默认 modelPath 为 models/ocr_v3_for_cpu，初始化自定义模型请写绝对路径否则无法获取到
        // 内置默认 labelPath 为 labels/ppocr_keys_v1.txt
        // let modelPath = files.path('models/ocr_v3_for_cpu'); // 指定自定义模型目录
        // let labelPath = files.path('labels/ppocr_keys_v1.txt'); // 指定自定义label路径
        // 使用自定义模型时det rec cls三个模型文件名称需要手动指定
        // this.instance.detModelFilename = 'det_opt.nb';
        // this.instance.recModelFilename ='rec_opt.nb';
        // this.instance.clsModelFilename ='cls_opt.nb';
        // this.instance.init(modelPath, labelPath);
        log("初始化OCR模型");
        let result = this.instance.init();

        if (result) {
            result = null;
            return true;
        } else {
            result = this.instance.getLastError();
            console.error(result);
            result = null;
            return false; // this.instance.getLastError(); //如果有错误可以用getLastError获取
        }
    }
    /**
        * ocr识别
        * @param {*} img 
        * @param {object} options 
        * @returns 
        */
    this.detect = function (img, options) {

        options = options || {};
        this.resultList = null;

        if (this.initResult === true) {
            let start = new Date();
            //开始识别,有点尴尬
            //插件OCR实例的detect不支持(懒得)区域识别(裁剪图片),得用插件js的
            this.resultList = OCR.detect(img, {
                region: options.region,
            });

            //回收图片
            !img.isRecycled() && img.recycle();

            //解析结果
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

            if (this.resultList && this.resultList.length > 0) {
                this.resultList.forEach((r, index, arr) => {
                    let labeltext = 矫正规则(options.rectify_json_path, r.label)
                    if (!labeltext || labeltext == "") {
                        return;
                    };


                    taglb.push({
                        text: labeltext,
                        left: r.bounds.left,
                        top: r.bounds.top,
                        right: r.bounds.right,
                        bottom: r.bounds.bottom,
                    });
                    labeltext = null;
                });


            }


            if (taglb.length < 6 && options.rectify_json_path == "./lib/game_data/ocr_公招_矫正规则.json") {
                for (let i = 0; i < this.resultList.length; i++) {
                    log(this.resultList[i].label);
                }
            }
            console.verbose("识别结果数量: " + (this.resultList ? this.resultList.length : 0) + '\n耗时' + (new Date() - start) + 'ms');

            start = null;
            this.resultList = null;
            return taglb;
            //  return this.resultList
        } else {
            return null;
        }
    }
    /**
         * 释放模型 用于释放native内存, 非必需
         */
    this.destroy = function () {
        OCR = null;
        this.instance.releaseModel();
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

    this.initResult = this.init();
    log("XiaoYueOcr init:" + this.initResult)
    events.on('exit', () => {
        console.log("释放XiaoYueOcr实例");
        //延迟释放,在识别时退出容易崩溃
        sleep(1500);
        this.destroy();
    });
}

let XiaoYueOcr = {
    detector: XiaoYueOcrDetector,
    is64: /64$/.test(context.getApplicationInfo().nativeLibraryDir),
    typeName: 'XiaoYueOcr',
    /**
     * 获取ocr是否安装
     */
    isInstalled() {
        try {
            this.XiaoYueOCR = plugins.load('cn.xiaoyue.ocr');
        } catch (e) {
            e = "未安装OCR插件，无法使用\n请打开明日计划-侧边栏-设置-OCR插件扩展:\n" + e;
            // toast(e);
            console.error(e)

            return false;
        };
        return true;
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
        con_ = "请打开链接跳转到浏览器下载安装xiaoyue ocr 文字识别插件，请注意版本架构是否符合明日计划,否则无法使用\n\n" + url +
            "\n\n当前明日计划架构：" + Build.CPU_ABI + "，\n建议下载安装" + (self.is64 ? "OCR 64位包" : "OCR 32位包") + "，\n\n安装错误的OCR版本会导致OCR无法识别卡住，应用崩溃。关于应用-明日计划32位只能使用32位OCR插件"
       

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

        return false
    },
    /**
     * 准备ocr资源文件
     * @returns {object} - ocr实例和调用函数
     */
    prepare() {

        this.detector = new XiaoYueOcrDetector(this.XiaoYueOCR);
        return this.detector;
    },

}

module.exports = XiaoYueOcr;