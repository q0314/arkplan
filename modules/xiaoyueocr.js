importClass(android.content.Context);
importClass(android.graphics.Bitmap);
try {
    path = module.id.replace(files.getName(module.id), '');
} catch (e) {
    path = engines.myEngine().getSource().toString().replace(files.getName(engines.myEngine().getSource().toString()), "");
}


//for(let i of runtime.getClass().getDeclaredFields()){
// log(i+"\n");
//}

let XiaoYueOcrDetector = function (path) {
    /**
    * ocr实例
    */
    this.instance = null;
    this.initResult = false;

    function buildRegion(region, img) {
        if (region == undefined) {
            region = [];
        }
        let x = region[0] === undefined ? 0 : region[0];
        let y = region[1] === undefined ? 0 : region[1];
        let width = region[2] === undefined ? img.getWidth() - x : region[2];
        let height = region[3] === undefined ? (img.getHeight() - y) : region[3];
        let r = new org.opencv.core.Rect(x, y, width, height);
        if (x < 0 || y < 0 || x + width > img.width || y + height > img.height) {
            throw new Error("out of region: region = [" + [x, y, width, height] + "], image.size = [" + [img.width, img.height] + "]");
        }
        return r;
    }

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
        log("初始化OCR模型");
        let result = this.instance.init(4, "file://" + files.path(path)); //设置模型文件路径

        if (result) {
            result = null;
            return true;
        } else {
            result = this.instance.getLastError()
            console.error(result);
            if (result.indexOf("android.permission.READ_PHONE_STATE") > -1) {
                dialogs.build({
                    contentColor: "#F44336",
                    content: "请授权获取手机信息/电话管理权限后\n才能使用该OCR扩展",
                    canceledOnTouchOutside: false,
                    positive: "确定",
                    //  negative: "取消",
                }).on("positive", () => {
                    runtime.requestPermissions(["READ_PHONE_STATE"]);
                }).show();
            }
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
        //置信度
        options.CONFIDENCE = options.CONFIDENCE || 0.3;
        this.resultList = null;
        let newBmp;

        if (this.initResult === true) {
            let start = new Date();
            //处理图片
            if (options.region) {
                try {
                    let region = buildRegion(options.region, img);
                    newBmp = Bitmap.createBitmap(img.getBitmap(), region.x, region.y, region.width, region.height);
                } catch (e) {
                    console.error("无法使用区域识别，错误：" + e);
                    newBmp = img.getBitmap();
                    options.region = false;
                }
            } else {
                newBmp = img.getBitmap()
            }
            //开始识别
            this.resultList = JSON.parse(this.instance.ocr(newBmp, options.CONFIDENCE));

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

                    r.bounds = new android.graphics.Rect();
                    let left = r.points[0].x,
                        top = r.points[0].y,
                        rigth = r.points[2].x,
                        bottom = r.points[2].y;
                    r.bounds.set(left, top, rigth, bottom);
                    if (options.region) {
                        r.bounds.offset(options.region[0], options.region[1]);
                    };

                    taglb.push({
                        text: labeltext,
                        left: r.bounds.left,
                        top: r.bounds.top,
                        right: r.bounds.right,
                        bottom: r.bounds.bottom,
                    });
                    labeltext = null;
                    //delete r.points;
                    //delete r.wordIndex;
                    //this.resultList[index] = r;
                });


            }


            if (taglb.length < 6 && options.rectify_json_path == "./lib/game_data/ocr_公招_矫正规则.json") {
                for (let i = 0; i < this.resultList.length; i++) {
                    log(this.resultList[i].label);
                }
            }
            console.verbose("识别结果数量: " + (this.resultList ? this.resultList.length : 0) + '\n耗时' + (new Date() - start) + 'ms');

            start = null;
            newBmp = null;
            this.resultList = null;
            return taglb;
            //  return this.resultList
        } else {
            return null;
        }
    }
    /**
         * 回收ocr实例,必须释放,否则下次无法init
         */
    this.destroy = function () {
        this.instance.destroy();
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

    this.instance = new com.plugin.PaddleOCR.XiaoyuePlugin(context);
    // let isLoad = this.instance.OnLoad();
    this.initResult = this.init(path);
    log("XiaoYueOcr init:" + this.initResult)
    events.on('exit', () => {
        console.log("释放XiaoYueOcr实例");
        this.instance.destroy(); //必须释放,否则下次无法init
    });
}

let XiaoYueOcr = {
    detector: XiaoYueOcrDetector,
    is64: /64$/.test(context.getApplicationInfo().nativeLibraryDir),
    typeName: 'XiaoYueOcr',
    path: context.getExternalFilesDir(null).getAbsolutePath() + '/OCR/XiaoYueOcr/',
    /**
     * 获取ocr是否安装
     */
    isInstalled() {
        const toCheckPaths = [
            this.path + 'libs/' + this.typeName + '.dex',
            this.path + 'libs/libc++_shared.so',
            this.path + 'libs/libedge-infer.so',
            this.path + 'data/conf.json',
            this.path + 'data/infer_cfg.json',
            this.path + 'data/label_list.txt',
            this.path + 'data/model',
            this.path + 'data/params',

        ];
        let flag = true;
        for (let path of toCheckPaths) {
            if (!files.exists(path)) {
                console.error('该文件不存在' + path);
                flag = false;
            }
        }
        return flag;
    },

    /**
     * 安装
     */
    install(option) {
        let url = 'https://flowus.cn/share/2a01a8fc-6013-4d8e-ae69-73a35073dc07';

        let con_ = "请在明日计划WebView界面中访问以下链接并下载xiaoyueocr扩展包,建议下载安装" + (this.is64 ? "OCR 64位架构包" : "OCR 32位架构包") + "\n" + url;
        dialogs.build({
            type: "app",
            title: "提醒",
            titleColor: "#000000",
            contentColor: "#F44336",
            content: con_,
            positive: "跳转页面",
            negative: "取消",
            cancelable: false,
            canceledOnTouchOutside: false,
            // view高度超过对话框时是否可滑动
            wrapInScrollView: false,
            // 按下按钮时是否自动结束对话框
            autoDismiss: true
        }).on("positive", () => {
            let web_set = storages.create("configure").get("web_set");
            web_set.new_url = url;
            storages.create("configure").put("web_set", web_set);
            let webdow = {};
            webdow.await = true;
            webdow.action = 'download';
            webdow.nowtime = new Date();
            //预计完成时间,10分钟
            webdow.expectedtime = new Date(webdow.nowtime.getTime() + 10 * 60000);
            webdow.callback = function (list) {
                let self_path = this.path;
                console.log('即将解压文件：' + list.filepath + list.filename + '到 ' + self_path);
                files.ensureDir(self_path + list.filename);
                $zip.unzip(list.filepath + list.filename, self_path);
                toastLog('下载解压' + list.filename + '完成');
                let con = '下载解压' + list.filename + '完成,路径为:\n' + self_path;
                importClass(android.net.Uri);
                importClass(android.os.Environment);
                importClass(android.provider.Settings);
                //判断是否需要所有文件权限
                if (device.sdkInt >= 30 && !Environment.isExternalStorageManager()) {
                    con = con + "\n\n\n此扩展在安卓11+,需授予所有文件访问权限才可使用";
                };

                dialogs.build({
                    contentColor: "#F44336",
                    content: con,
                    canceledOnTouchOutside: false,
                    positive: "确定",
                    //  negative: "取消",
                }).on("positive", () => {
                    if (device.sdkInt >= 30 && !Environment.isExternalStorageManager()) {
                        toastLog("请授予所有文件访问权限");
                        let uri = Uri.parse("package:" + context.getPackageName());
                        app.startActivity(Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, uri));
                    };
                }).show();
                files.remove(list.filepath + list.filename);
            }.toString().replace("this.path", "'" + this.path + "'");

            files.write(
                "../lib/game_data/webdow.json",
                JSON.stringify(webdow),
                (encoding = "utf-8")
            );
            exit();

        }).show();
        return false
    },
    /**
     * 准备ocr资源文件
     * @returns {object} - ocr实例和调用函数
     */
    prepare() {

        runtime.loadDex(this.path + 'libs/' + this.typeName + '.dex');
        if (!files.exists(runtime.files.join(runtime.libraryDir, 'libc++_shared.so'))) {
            files.copy(this.path + 'libs/libc++_shared.so', runtime.files.join(runtime.libraryDir, 'libc++_shared.so'));
        }
        if (!files.exists(runtime.files.join(runtime.libraryDir, 'libedge-infer.so'))) {
            files.copy(this.path + 'libs/libedge-infer.so', runtime.files.join(runtime.libraryDir, 'libedge-infer.so'));
        }

        this.detector = new XiaoYueOcrDetector(this.path + 'data/');
        return this.detector;
    },

    //ocr : this.detector.detect(bmp),


}




module.exports = XiaoYueOcr;
// new XiaoYueOcrDetector(files.path(module.id.replace(files.getName(module.id), "data")))

//直接引用方法;
let newocr = function (path) {
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

    this.manager = null;
    this.initResult = false;
    /* 1. 准备配置类，初始化Manager类。可以在onCreate或onResume中触发，请在非UI线程里调用 */
    this.inferConfig = new InferConfig(context.getAssets(), "file://" + path);
    this.manager = new InferManager(context, this.inferConfig, "");
    this.manager.ocr(img.getBitmap(), 0.3);


    this.destroy = function () {
        this.manager.destroy();
    }

    events.on('exit', () => {
        this.manager.destroy(); //必须释放,否则下次无法init
    });
}