importClass(android.graphics.drawable.GradientDrawable);
importClass(android.view.ViewGroup);
importClass(java.util.regex.Pattern);
let tukuui,
    tukuds,
    图库校验列表,
    progressDialog;
let re = /\d+/;
/**
 * width,path_ tool等变量函数从主脚本获取
 */
let gallery = {
    gallery_info: null,
    language: false,
    name: null,
    init() {
        if (files.exists("./mrfz/tuku/gallery_info.json")) {
            this.gallery_info = JSON.parse(files.read("./mrfz/tuku/gallery_info.json"), (encoding = "utf-8"));
            this.language = this.gallery_info.服务器;
            this.name = (this.gallery_info.名称 ? this.gallery_info.名称 : this.gallery_info.name)
        }
        if (tukuui) {
            if (this.gallery_info) {
                let name = "当前使用图库名称：" + this.name;
                tukuui.dwh.setText(name);
            } else if (files.exists("./mrfz/tuku/分辨率.txt")) {
                this.name = files.read("./mrfz/tuku/分辨率.txt");
                tukuui.dwh.setText("当前使用图库：" + this.name);
            } else {
                tukuui.dwh.setText("当前使用图库：空");

            }
        }
    },
    gallery_view(callback, direction) {
        if (!tukuss) {
            let err = "无法拉取云端图库,请确认已是最新版本,是否可链接服务器";
            toast(err)
            console.error(err)
            //  return
        }

        tukuui = ui.inflate(
            <vertical >
                <vertical w="*" h="*">
                    <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#eff0f4">
                        <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                        <text text="图库文件管理" gravity="center|left" textColor="#000000" marginLeft="50" />

                        <linear gravity="center||right" marginLeft="5" >
                            <text id="wenn" textColor="#03a9f4" text="了解更多" padding="10" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" />
                            <img id="Exit" marginRight="8" src="@drawable/ic_clear_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true" />

                        </linear>

                    </card>
                </vertical>

                <ScrollView  >
                    <vertical w="*" h="*" >

                        <View bg="#f5f5f5" w="*" h="2" />
                        <text id="wxts" autoLink="web" text="温馨" typeface="sans" margin="15 10" visibility="gone" textColor="#000000" textSize="15sp" layout_gravity="center" />

                        <vertical id="parent_" visibility="gone">

                            <text text="显示X说明该功能所需的图片不全，点击展开详细图片内容。可查看缺少那些小图片。tips:小图片显示 √ 并不代表此小图片在你的设备上可用，因为分辨率不同可能导致小图片在截图上匹配失败" typeface="sans" textColor="#ff7f27" textSize="12sp" margin="20 0" />

                            <ScrollView h="{{1000}}px" id="scrollView" >

                                <vertical id="content" padding="5" h="auto">

                                </vertical>
                            </ScrollView >

                        </vertical>

                        <vertical id="car" >
                            <text id="Device_resolution" text="加载中" padding="20 0" />
                            <text id="dwh" text="加载中" padding="20 0" />
                            <text id="Tips" bg="#FF69B4" margin="16 0" textStyle="bold" textColor="#ffffff" text="请更换与设备分辨率较为接近的图库" w="auto" />
                            <Switch
                                id="full_resolution" padding="16 5"
                                text="全分辨率兼容模式(任意图库)_beta"
                                textSize="18sp" />

                            <list id="tukulb" visibility="visible" padding="20 0">
                                <card w="*" h="30" cardCornerRadius="3dp"
                                    cardElevation="0dp" id="tucolos" cardBackgroundColor="{{this.color}}" foreground="?selectableItemBackground">
                                    <text id="tui" text="{{this.name}}" textColor="#222222" textSize="13" margin="5" gravity="center|left" />
                                    <text id="tutext" text="{{this.state}}" margin="10 0 10 0" textColor="#000000" textSize="15" gravity="center|right" />
                                    <text text="{{this.name}}" visibility="gone" textSize="15" />
                                </card>
                            </list>
                        </vertical>
                        <linear>
                            <button id="tuku_jy" h="auto" margin="0 -5 0 0" textSize="15" layout_weight="1" text="检查图库" style="Widget.AppCompat.Button.Borderless.Colored" />
                            <button id="tuku_choice" h="auto" margin="0 -5 0 0" textSize="15" layout_weight="1" text="导入图库" style="Widget.AppCompat.Button.Borderless.Colored" />
                        </linear>
                    </vertical>
                </ScrollView>
            </vertical>, null, true);

        tukuds = dialogs.build({
            type: 'app',
            customView: tukuui,
            wrapInScrollView: false
        })

        tukuui.full_resolution.checked = (setting.full_resolution ? true : false);
        tukuui.full_resolution.setTextColor(colors.parseColor(theme.text));
        tool.setBackgroundRoundRounded(tukuds.getWindow(), { radius: 0, })

        tukuds.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        tukuds.show();


        //tukuds.getWindow.setAttributes(params);
        tukuui.full_resolution.on("click", (view) => {
            if (view.checked) {
                if (!this.gallery_info) {
                    Dialog_prompt("请确认", "请先使用一个图库才能启用该功能");
                    return
                }

                if (re.exec(height - this.gallery_info.分辨率.h)[0] < 230 && re.exec(width - this.gallery_info.分辨率.w)[0] < 170) {
                    Dialog_prompt("警告", "你的设备分辨率与图库分辨率相近，我并不建议你打开此功能，否则可能会适得其反")
                }
            }
            tool.writeJSON("full_resolution", view.checked);
        })
        tukuui.wxts.setText("1. 图库是什么? \n图库非常重要，由一堆小图片组成，这些在明日计划里是被拿来在大图(屏幕截图)上匹配小图片以便确认按钮位置，所以图库与设备的兼容性决定了某些功能是否能用。\n目前，图库与设备分辨率宽度一致，而高度误差不超过230左右，或高度一致，而宽度误差不超过170左右，基本上是可以使用的，但不排除某些小图片在你的设备上无法匹配，导致某功能失效。" +
            "\n2. 没有适合你的图库？\n参考以下教程动手制作 https://mrjh.flowus.cn。 同时欢迎把图库上传到云端，分享给其他人使用(关于应用-联系作者)。 或使用虚拟机、模拟器等自调适合的分辨率，左边高度×右边宽度，DPI随意" +
            "\n 3. 模拟器如何使用？\n雷电、夜神、逍遥等，分辨率需调为手机版分辨率，分辨率反的说明你设置的是平板版，选择相反分辨率的图库即可，内存请设置4G+，否则明日计划在后台时容易被杀")
        tukuui.Exit.on("click", function () {
            if (tukuui.parent_.getVisibility() == 0) {
                tukuui.parent_.setVisibility(8)
                tukuui.car.setVisibility(0);
                return
            }
            tukuds.dismiss()
        })
        tukuui.wenn.on('click', function () {
            if (tukuui.wxts.getHint() == "true") {
                tukuui.wxts.setVisibility(8)
                tukuui.wxts.setHint("false");
                if (tukuui.parent_.getVisibility() == 8) {

                    tukuui.car.setVisibility(0)
                }
                tukuui.wenn.setTextColor(colors.parseColor("#03a9f4"))
            } else {
                tukuui.wxts.setVisibility(0)
                tukuui.wxts.setHint("true");
                tukuui.car.setVisibility(8);

                tukuui.wenn.setTextColor(colors.parseColor("#f4a406"))
            }
        })

        tukuui.tuku_jy.on('click', (view) => {
            if (!this.gallery_info) {
                Dialog_prompt("请确认", "请先使用部署一个图库才能进行检验");
                return
            }
            progressDialog = dialogs.build({
                type: "app",
                progress: {
                    max: -1,
                    //  showMinMax: true
                },
                content: "正在获取校验列表中...",
                //    customView: dowui,
                positive: "取消",
                cancelable: false,
                canceledOnTouchOutside: false
            }).on("dismiss", () => {
                progressDialog = false;
            }).on("positive", () => {
                图库校验列表 = null;
                progressDialog.dismiss();
            }).show()
            for (let i = tukuui.content.getChildCount() - 1; i >= 0; i--) {
                tukuui.content.removeViewAt(i)
            }
            //server由主脚本提供
            let url = server;


            if (!图库校验列表) {
                threads.start(function () {
                    图库校验列表 = http.get(url + "tulili/图库列表.json");
                    if (图库校验列表['statusCode'] != 200) {
                        toastLog('请求图库校验文件信息出错:' + 图库校验列表['statusMessage']);
                        图库校验列表 = false;
                        !progressDialog && progressDialog.dismiss();
                    } else {

                        图库校验列表 = JSON.parse(图库校验列表.body.string());
                        校验文件(图库校验列表)
                    }
                })
            } else {
                校验文件(图库校验列表)
            }

            function 校验文件(图库校验列表) {
                function jiance(tukuwj) {
                    var nofiles = []
                    for (var i = 0; i < tukuwj.length; i++) {
                        if (!files.exists(files.path("./mrfz/tuku/") + tukuwj[i])) {
                            nofiles.push(tukuwj[i])
                        }
                    }
                    return nofiles;
                }
                ui.run(() => {

                    if (progressDialog) {

                        progressDialog.setContent("正在校验图库文件中...")
                    }

                    tukuui.parent_.setVisibility(0)
                    tukuui.car.setVisibility(8);
                    for (let i = 0; i < 图库校验列表.length; i++) {
                        let on_file = jiance(图库校验列表[i].图片);
                        let AddText = ui.inflate(
                            <vertical w="*" h="auto" margin="20 0 0 0">
                                <linear id="功能">
                                    <text id="name"
                                        margin="0 0"
                                        textSize="15sp"
                                        textColor="#1E90FF"
                                        layout_gravity="center"
                                        w="auto" />

                                    <img id="files_ok" visibility="visible" src="@drawable/ic_check_black_48dp" tint="green" w="25" h="25" margin="5 0" />
                                    <img id="files_on" visibility="gone" src="@drawable/ic_clear_black_48dp" tint="red" w="25" h="25" margin="5 0" />

                                </linear>
                                <list id="on_file" h="*" w="auto" visibility="gone">
                                    <linear margin="15 0" h="{{65}}px" w="auto">
                                        <text text="{{this.图片}}" textSize="15" />
                                        <img id="file_ok" visibility="{{this.状态 ? 'visible' : 'gone' }}" src="@drawable/ic_check_black_48dp" tint="green" w="auto" h="auto" margin="5 0" />
                                        <img id="file_on" visibility="{{this.状态 ? 'gone' : 'visible' }}" src="@drawable/ic_clear_black_48dp" tint="red" w="auto" h="auto" margin="5 0" />

                                    </linear>
                                </list>
                            </vertical>,
                            tukuui.content
                        );
                        ui.run(() => {
                            AddText.name.setText("◆功能：" + 图库校验列表[i].功能);
                            let on_file_s = []
                            for (let j = 0; j < 图库校验列表[i].图片.length; j++) {
                                let 状态 = true;

                                //图片在列表存在
                                if (on_file.indexOf(图库校验列表[i].图片[j]) > -1) {
                                    状态 = false;
                                    if (AddText.files_on.getVisibility() == 8) {
                                        AddText.files_on.setVisibility(0);
                                        AddText.files_ok.setVisibility(8);
                                    }

                                }
                                on_file_s.push({
                                    图片: 图库校验列表[i].图片[j],
                                    状态: 状态,
                                })

                            }
                            AddText.on_file.setDataSource(on_file_s)
                            tukuui.content.addView(AddText);
                            var ChildCount = tukuui.content.getChildCount();

                            for (let i = 0; i < ChildCount; i++) {
                                let ui_ = tukuui.content.getChildAt(i);
                                ui_.getChildAt(0).removeAllListeners();
                                ui_.getChildAt(0).click(function (e) {
                                    if (e.getChildAt(0).getText().toString().indexOf("◆") > -1) {
                                        ui_.getChildAt(1).setVisibility(0)
                                        let text = e.getChildAt(0).getText().toString().replace("◆", "◇");
                                        e.getChildAt(0).setText(text)
                                    } else {
                                        ui_.getChildAt(1).setVisibility(8)
                                        let text = e.getChildAt(0).getText().toString().replace("◇", "◆");
                                        e.getChildAt(0).setText(text)

                                    }
                                });

                            }

                        })

                    }
                    if (progressDialog) {
                        progressDialog.dismiss()
                    }
                })
            }



        })
        tukuui.Device_resolution.setText("当前设备分辨率{ 'w':" + width + ", 'h': " + height + "}")
        tukuui.Device_resolution.setVisibility(8);
        tukuui.dwh.setVisibility(8);
        tukuui.Tips.setText(" 正在努力获取云端图库文件列表，请稍候重试... ");
        this.init()

        try {
            for (let a_tuku in tukuss) {
                tukuss[a_tuku].file_name = tool.formatFileName(tukuss[a_tuku].name);

                let zipfile_name = path_ + "/gallery_list/" + tukuss[a_tuku].file_name;
                if (files.exists(zipfile_name + ".zip")) {
                    tukuss[a_tuku].state = "使用";
                    tukuss[a_tuku].color = "#ffffff";
                    if (files.exists(zipfile_name + "/tuku/gallery_info.json")) {
                        tukuss[a_tuku].state = "查看图库文件信息";
                        tukuss[a_tuku].color = "#ffffff";
                    }

                } else {
                    tukuss[a_tuku].state = "下载";
                    tukuss[a_tuku].color = "#ffffff";
                }

            }
            tukuui.Device_resolution.setVisibility(0);
            tukuui.dwh.setVisibility(0);
            tukuui.Tips.setText(" 请更换与设备分辨率较为接近的图库\n 例：设备分辨率2160x1080可用2340x1080图库 ");

            tukuui.tukulb.setDataSource(tukuss);
        } catch (e) {
            console.error(e)
            //tukuds.dismiss()
            //return
        }

        tukuui.tuku_choice.on("click", () => {
            toast("导入的图库内图片名称需符合官方的，尽量不少一张图片！！！\n待用文件夹的除外")
            startChooseFile(".zip");

        })

        tukuui.tukulb.on("item_bind", (itemView, itemHolder) => {
            itemView.tucolos.on("click", () => {
                //更改其它图库使用中标识
                removeByVal(tukuss, "使用中", "修改");
                let item = itemHolder.item;

                switch (item.state) {
                    case "查看图库文件信息":

                        let gallery_info_json = JSON.parse(
                            files.read(
                                files.exists(path_ + "/gallery_list/" + item.file_name + "/tuku/gallery_info.json")
                                    ? path_ + "/gallery_list/" + item.file_name + "/tuku/gallery_info.json"
                                    : path_ + "/gallery_list/" + item.file_name + "/gallery_info.json",
                                (encoding = "utf-8"))
                        );
                        let gallery_info_text = '';
                        for (let _message in gallery_info_json) {
                            let name = _message;
                            switch (name) {
                                case "versionCode":
                                    name = "版本代码";
                                    break
                                case "author":
                                    name = "作者";
                                    break;
                                case "update_time":
                                    name = "更新时间";
                                    break
                                case "update_content":
                                    name = "更新内容";
                                    break;
                            }
                            gallery_info_text += name + " :   " + JSON.stringify(gallery_info_json[_message]) + "\n";
                        };
                        let gallery_info_view = ui.inflate(
                            <vertical background="#ffffff" padding="5">
                                <vertical h="*">
                                    <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#00000000">
                                        <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                                        <text text="图库文件信息" gravity="center|left" textColor="#000000" marginLeft="50" />

                                        <linear gravity="center||right" marginLeft="5">
                                            <img id="Exit" marginRight="8" src="@drawable/ic_clear_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true" />
                                        </linear>
                                    </card>
                                    <View bg="#f5f5f5" w="*" h="1" />

                                    <text id="gallery_info" textSize='15sp' textColor="#000000" margin="20 10 10 0" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />

                                </vertical>
                                <View bg="#f5f5f5" w="*" h="1" />
                                <horizontal w="*" padding="-3" gravity="center_vertical">
                                    <button text="删除" id="delete" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                                    <button text="使用" id="use" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                                </horizontal>
                            </vertical>, null, false);

                        let gallery_info_dialog = dialogs.build({
                            type: "foreground-or-overlay",
                            customView: gallery_info_view,
                            wrapInScrollView: false
                        }).show();

                        gallery_info_view.gallery_info.setText(gallery_info_text);
                        gallery_info_view.use.click(() => {
                            gallery_info_dialog.dismiss();
                            if (this.更换图库(item.file_name)) {
                                item.state = "使用中";
                            } else {
                                item.state = "更换失败";
                            }
                            item.color = "#00bfff";
                            $ui.post(() => {
                                //通知数据更新
                                // tukuui.tukulb.adapter.notifyItemRemoved(itemHolder.position);
                                tukuui.tukulb.setDataSource(tukuss);
                            }, 30);

                        });
                        gallery_info_view.delete.click(() => {
                            gallery_info_dialog.dismiss();
                            files.remove(path_ + "/gallery_list/" + item.file_name + ".zip");
                            files.removeDir(path_ + "/gallery_list/" + item.file_name + "/");

                            item.state = "下载";
                            itemView.tutext.setText("下载");
                        });
                        gallery_info_view.Exit.click(() => {
                            gallery_info_dialog.dismiss();
                        });
                        break
                    case "使用":
                    case "更换失败":
                        if (this.更换图库(item.file_name)) {
                            item.state = "使用";
                            if (files.exists("./mrfz/tuku/gallery_info.json")) {
                                item.state = "查看图库文件信息";
                            }

                        } else {
                            item.state = "更换失败";
                        }
                        item.color = "#00bfff";
                        $ui.post(() => {
                            //通知数据更新
                            // tukuui.tukulb.adapter.notifyItemRemoved(itemHolder.position);
                            tukuui.tukulb.setDataSource(tukuss);
                        }, 30);
                        break
                    case "下载":
                        //  current = tukuss[j].链接;
                        if (!progressDialog) {
                            this.下载图库(item.link, item.file_name, item);
                            progressDialog = dialogs.build({
                                type: "app",
                                progress: {
                                    max: 100,
                                    //  showMinMax: true
                                },
                                content: "正在下载中...",
                                //    customView: dowui,
                                cancelable: false,
                                canceledOnTouchOutside: false
                            }).show()
                        } else {
                            toast("你的操作太快啦");
                        }
                        break
                }
                return true;
            });
        })

        tukuui.tukulb.on("item_long_click", function (e, item, i, itemView, listView) {
            if (itemView.tutext.text() == "下载失败" || itemView.tutext.text() == "使用" || itemView.tutext.text() == "更换失败") {
                dialogs.build({
                    type: "app",
                    title: "确定要删除" + item.name + "分辨率图库吗？",
                    positive: "确定",
                    negative: "取消"
                }).on("positive", () => {
                    files.remove(path_ + "/gallery_list/" + item.file_name + ".zip");
                    files.removeDir(path_ + "/gallery_list/" + item.file_name + "/");
                    item.state = "下载";
                    itemView.tutext.setText("下载");
                }).show()
            }
            e.consumed = true;
        });

    },
    选择图库(tukuss) {
        try {
            for (var i in tukuss) {
                tukuss[i].file_name = tool.formatFileName(tukuss[i].name);

                if (re.exec(height - tukuss[i].h)[0] < 230 && re.exec(width - tukuss[i].w)[0] < 170) {

                    if (files.exists(path_ + "/gallery_list/" + tukuss[i].file_name + ".zip")) {
                        if (!this.更换图库(path_ + "/gallery_list/" + tukuss[i].file_name + ".zip")) {
                            Dialog_prompt("请确认", "首次运行复制图库失败！可能不支持你手机的分辨率！请打开左边侧滑栏-更换图库手动更换相近分辨率，或使用虚拟机/模拟器更改为手机版分辨率即可")
                            return false
                        } else {
                            Dialog_prompt("请知晓", "当前设备可以使用明日计划-PRTS辅助部分功能\n\n因为程序已为您设备分辨率w:" + width + ", h:" + height + "智能选择" + this.name + "图库\n如有更合适的图库请点击左边侧滑栏-更换图库\n另外,游戏内的异形屏UI适配尽量设置为0。")
                            return true
                        }
                    } else {

                        this.下载图库(tukuss[i].link, tukuss[i].file_name, undefined);
                        return
                    }
                } else if ((Number(i) + 1) == tukuss.length) {
                    let dialog = dialogs.build({
                        title: "警告⚠",
                        titleColor: "#F44336",
                        type: "app",
                        content: "你的设备无法正常使用明日计划-PRTS辅助功能\n\n因为程序自动优选图库失败！当前可能没有适合你手机分辨率的图库！\n\n请打开左边侧滑栏检查图库-了解更多-获取教程制作适合设备的图库，或使用虚拟机/模拟器改与图库相合适的手机版分辨率",
                        contentColor: "#F44336",
                        positive: "我已知晓",
                        positiveColor: "#000000",
                        canceledOnTouchOutside: false
                    });
                    if (device.product.indexOf("cancro") != -1) {
                        if (device.release != 9 && width != 1280 && height != 720 && width != 1920 && height != 1080) {
                            dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本。\n当前分辨率 w:" + width + ", h:" + height + "，明日计划图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为宽1280x高720或宽1920x高1080");
                            dialog.show();
                            return
                        }
                        if (width != 1280 && height != 720 && width != 1920 && height != 1080) {
                            dialog.setContent("你的设备环境貌似是mumu模拟器，\n当前分辨率w:" + width + ", h:" + height + "，明日计划图库貌似还没有适合的，请在mumu设置中心-界面设置，更换为w1280,h720或w1920,h1080");
                            dialog.show();
                            return
                        }
                        switch (true) {
                            case device.release != 9:
                                dialog.setContent("你的设备环境貌似是mumu模拟器，当前安卓版本：" + device.release + "，非兼容版本，请更换为安卓9的版本");
                                dialog.show();
                                return
                        }

                    } else if (width > height) {
                        dialog.setContent("检测到你的设备分辨率貌似是平板版分辨率，而且图库校验列表没有可兼容的，\n请点击左边侧滑栏-更换图库，将模拟器更换与图库分辨率相反的分辨率，再打开设置——兼容模拟器平板版即可\n当前分辨率w:" + width + ", h:" + height);
                        dialog.show();
                        return

                    }

                    dialog.show();
                }

            }
        } catch (e) {
            console.error("自动选择图库失败报错:\n" + $debug.getStackTrace(e));
        }
    },
    下载图库(link, name, item) {
        if (!link || !name) {
            console.error("缺失参数:直链,名称");
            return false;
        };
        let datali = {}
        //link = "https://qiao0314.coding.net/p/ceshixiazai/d/q0314/git/raw/master/tulili/"+link;
        datali.link = link;
        datali.id = "图库";
        datali.prohibit = true;
        datali.myPath = files.path(path_ + "/gallery_list/");
        datali.fileName = name + ".zip";
        storages.create("Doolu_download").put("data", datali);
        files.createWithDirs(path_ + "/gallery_list/")
        engines.execScriptFile("./lib/download.js");
        //监听脚本间广播'download'事件
        if (item != undefined) {
            item.color = "#00bfff";
        }
        events.broadcast.on("download" + datali.id, function (X) {
            if (X.name == "进度") {
                if (progressDialog) {
                    ui.run(() => {
                        progressDialog.setProgress(X.data);
                    })
                }
            } else if (X.name == "结果") {
                if (X.data == "下载完成") {
                    try {
                        let event_ = events.broadcast.listeners("download" + datali.id)[0];
                        events.broadcast.removeListener("download" + datali.id, event_);
                    } catch (e) {

                    }

                    if (item != undefined) {
                        setTimeout(function () {

                            if (gallery.更换图库(name)) {
                                item.state = "查看图库文件信息";

                            } else {
                                item.state = "更换失败"
                            }
                        }, 200);
                        $ui.post(() => {
                            if (progressDialog) {
                                progressDialog.dismiss()
                                progressDialog = false
                            }
                            name = null;
                            if (tukuui) {
                                tukuui.tukulb.setDataSource(tukuss);
                            }
                        }, 350);

                    } else {
                        if (progressDialog) {
                            progressDialog.dismiss();
                            progressDialog = false;
                        };

                        if (!gallery.更换图库(name)) {
                            Dialog_prompt("请确认", "首次运行复制图库失败！可能不支持你手机的分辨率！请打开左边侧滑栏-更换图库手动更换相近分辨率，或使用虚拟机/模拟器更改为手机版分辨率即可");
                        } else {
                            Dialog_prompt("请知晓", "当前设备可以使用明日计划-PRTS辅助部分功能\n\n因为程序已为您设备分辨率w:" + width + ", h:" + height + "智能选择" + gallery.name + "图库\n如有更合适的图库请点击左边侧滑栏-更换图库\n另外,游戏内的异形屏UI适配尽量设置为0。")
                        };

                        name = null;
                    }

                    return
                }
            } else if (X.name == "关闭") {
                try {
                    let event_ = events.broadcast.listeners("download" + datali.id)[0];
                    events.broadcast.removeListener("download" + datali.id, event_);
                } catch (e) {

                }
                if (progressDialog) {
                    progressDialog.dismiss();
                    progressDialog = false;
                }
                if (item != undefined) {
                    item.color = "#ffffff";
                    toastLog("这都下载不了？进群下全图库包");
                    item.state = "下载失败";
                    $ui.post(() => {
                        if (tukuui) {
                            tukuui.tukulb.setDataSource(tukuss);
                        }
                        $app.startActivity({
                            data: "mqqapi://card/show_pslcard?card_type=group&uin=" + jlink_mian.群号,
                        })

                    }, 800)
                }

                return
            }

        });
    },
    更换图库(filePath) {
        files.removeDir("./mrfz/tuku");
        if (!filePath.endsWith(".zip")) {
            filePath = path_ + "/gallery_list/" + filePath + ".zip";
        }
        if (this.unzip_copy(filePath, "./mrfz/")) {
            this.init()

            return true;
        } else {
            if (tukuui) {
                tukuui.dwh.text("当前使用图库：空，复制新图库失败！\n请尝试长按图库删除掉重新下载");
            }
            return false
        }

    },
    unzip_copy(p1, p2) {
        log("图库文件路径:" + p1);
        p1 = files.path(p1);
        p2 = files.path(p2);
        try {
            // $zip.unzip(p1, p2);
            let zipfile = $zip.open(p1);
            if (!zipfile.isValidZipFile()) {
                toast("非有效,可识别的压缩包:" + p1)
                console.error("非有效,可识别的压缩包:" + p1)
                return false;
            }


            let tuku = zipfile.getFileHeader("tuku/");

            if (!tuku) {
                p2 = p2 + "/tuku";
                p1 = p1.replace('.zip', '/tuku/');
            } else {
                p1 = p1.replace('.zip', '/');
            }

            if (zipfile.getFileHeader(tuku ? "tuku/gallery_info.json" : "gallery_info.json")) {
                console.verbose("解压图库相关信息文件到源目录:" + p1);
                zipfile.extractFile(tuku ? "tuku/gallery_info.json" : "gallery_info.json", p1);
            } else {
                let tips = "该图库未支持明日计划v4.4.6及以上版本";
                toast(tips);
                console.error(tips);
            }


            console.verbose("解压图库内所有文件到:" + p2);
            zipfile.extractAll(p2)

            return true;
        } catch (ezip) {
            if (!files.exists(p1)) {
                toastLog("解压缩异常，该路径文件不存在，\n错误报告:" + ezip)
            } else {
                toastLog("解压缩异常" + ezip)
            }
            return false;
        }

    }

}
gallery.init();


function removeByVal(arrylist, val, 操作) {
    for (var i = 0; i < arrylist.length; i++) {
        if (arrylist[i].state == val) {
            arrylist[i].state = "使用";
            arrylist[i].color = "#ffffff";
            return true;
        }
    }

}


function Dialog_prompt(title_, content_) {
    dialogs.build({
        title: title_,
        type: "app",
        content: content_,
        contentColor: "#F44336",
        positive: "好的",
        canceledOnTouchOutside: false
    }).show();

}





function startChooseFile(mime_Type) {
    let FileChooserDialog = require("./file_chooser_dialog");
    FileChooserDialog.build({
        title: '请选择后缀为.zip的压缩文件',
        type: 'app-or-overlay',
        // 初始文件夹路径
        dir: "/sdcard/",
        // 可选择的类型，file为文件，dir为文件夹
        canChoose: ["file"],
        mimeType: mime_Type,
        wrapInScrollView: true,
        // 选择文件后的回调
        fileCallback: (file) => {
            console.info("选择的文件路径" + file);
            if (file == null) {
                toastLog("未选择路径");
                return
            }
            if (file.indexOf(".zip") == -1) {
                toast("不是zip压缩文件");
                console.error("不是zip压缩文件");
                return
            };
            try {
                if (gallery.更换图库(file)) {
                    toast("导入图库成功");
                } else {
                    toastLog("失败，缺少必要的gallery_info.json文件\n如确认文件存在，请检查zip编码\n尽量使用手机上的文件管理器进行压缩");
                }

            } catch (er) {
                toast("失败，未知异常，请参考现有的分辨率图库zip文件:\n" + er);
                console.error("失败，未知异常，请参考现有的分辨率图库zip文件:\n" + er)
            }
        }
    }).show();

}


try {
    module.exports = gallery;
} catch (err) {
    gallery.gallery_view();
}