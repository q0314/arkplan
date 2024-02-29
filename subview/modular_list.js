function create_modular() {

    let uii = ui.inflate(
        <vertical id="parent">
            <frame>
                <vertical align="top" margin="3 5 3 0" >
                    <card gravity="center_vertical" cardElevation="0dp" margin="0">
                        <img src="file://res/icon.png" w="50" h="30" margin="0" />
                        <text text="模块配置列表" gravity="center|left" textColor="#000000" marginLeft="50" />

                        <linear gravity="center||right" marginLeft="5">
                            <img id="Exit" marginRight="8" src="@drawable/ic_clear_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true" />
                        </linear>

                    </card>
                    <View bg="#f5f5f5" w="*" h="1" />


                    <list id="files_0" layout_weight="1" >
                        <vertical w="*">
                            <horizontal id="script_list" h="*" w="*" padding="0 5">
                                {/* 脚本Icon */}
                                <img src="@drawable/ic_settings_ethernet_black_48dp"
                                    tint="black"
                                    w="35"
                                    h="35"
                                    margin="8 5 8 0" />

                                <vertical h="auto" w="0" layout_weight="1">
                                    {/* 脚本名称 */}
                                    <text id="script_name"
                                        textSize="17sp"
                                        textColor="#000000"
                                        text="{{this.script_name}}"
                                        marginTop="7"
                                        w="auto"
                                        singleLine="true"
                                        ellipsize="marquee" />
                                    {/* 开发者名称 */}
                                    <linear>
                                        <text id="developer"
                                            textSize="10sp"
                                            textColor="#95000000"
                                            text="开发者：{{this.developer}}"
                                            margin="0"
                                            maxLines="1"
                                            ellipsize="end" />
                                        {/* 脚本版本号 */}
                                        <text id="version"
                                            textSize="10sp"
                                            textColor="#90000000"
                                            text="版本号：{{this.version}}"
                                            marginLeft="15"
                                            maxLines="1"
                                            ellipsize="end" />
                                    </linear>

                                </vertical>

                                <horizontal gravity="center|right" >
                                    <checkbox id="done" visibility="{{this.pre_run ? 'visible':'gone'}}" checked="{{this.pre_run_check}}" />

                                    {/* 执行图标 */}
                                    <img id="execute_"
                                        src="@drawable/ic_play_arrow_black_48dp"
                                        tint="#90000000"
                                        w="33"
                                        h="33"
                                        margin="10 8" />
                                </horizontal>
                            </horizontal>
                            {/* 分割线填充 */}
                            <vertical id="fill_line" w="*" h="1" bg="#4C484C">
                            </vertical>
                        </vertical>
                    </list>
                </vertical>
            </frame>
        </vertical>, null, false);


    let sto_mod = storages.create("modular");
    let mod_data = sto_mod.get("modular", []);

    var res = dialogs.build({
        type: "foreground-or-overlay",
        customView: uii,
        wrapInScrollView: false
    }).on("dismiss", (dialog) => {
        sto_mod.put("modular", mod_data);
    }).show();
    let _modData_ = [];

    for (let _modular_ in mod_data) {
        if (mod_data[_modular_].version && mod_data[_modular_].path) {
            _modData_.push(mod_data[_modular_]);
        };
    }

    uii.files_0.setDataSource(_modData_);
    uii.Exit.on("click", () => {
        res.dismiss();
    });
    uii.files_0.on("item_bind", function (itemView, itemHolder, i) {
        ui.run(() => {

            itemView.execute_.on("click", function () {
                let item = itemHolder.item;
                let modular_route = false;
                threads.start(function () {
                    switch (item.id) {
                        case '自定义':
                            modular_route = item.path;
                            break;
                        case '关闭应用':
                            modular_route = item.path;
                            break;
                        case '基建换班':
                            modular_route = item.path;
                            break;
                        case '屏幕解锁':
                            modular_route = storage.get("password");
                            break;
                        case "熄屏运行":
                            res.dismiss();
                            let execution = engines.all();
                            for (let i = 0; i < execution.length; i++) {
                                if (execution[i].getSource().toString().indexOf("Screen operation") > -1) {
                                    console.verbose("已停止运行同名脚本")
                                    execution[i].forceStop();
                                }
                            }
                            engines.execScript("Screen operation", "if(files.exists(files.path('./modules/screen.js'))){require('./modules/screen.js').mask()}else{require('./screen.js').mask()}");
                            return
                        default:
                            toastLog('未匹配到的模块id');
                            break
                    }
                    let modular_cache = files.exists(modular_route) ? require(modular_route) : false
                    if (modular_cache) {
                        res.dismiss()

                        modular_cache.import_configuration({
                            'cwd': modular_route.replace(files.getName(modular_route), ""),
                            'getSource': modular_route,
                            'getinterface': '模块列表对话框',
                        });
                    } else {
                        toastLog('文件不存在，无法运行' + item.id + '模块:' + item.script_name + "。\n路径:" + modular_route)

                    }

                })
            })
            itemView.done.on("click", function () {
                let item = itemHolder.item;
                item.pre_run_check = itemView.done.checked;
                for (let i = 0; i < mod_data.length; i++) {
                    if (item.pre_run_check == true && mod_data[i].id == item.id) {
                        mod_data[i].pre_run_check = true;
                        toastLog("开始运行时将自动打开该模块配置界面")

                    } else {
                        mod_data[i].pre_run_check = false
                    }
                }
                ui.post(() => {
                    uii.files_0.adapter.notifyDataSetChanged();
                }, 150);
            })
        })
    })

    uii.files_0.on("item_long_click", function (e, item, i, itemView, listView) {
        ui.run(() => {
            dialogs.build({
                type: "foreground-or-overlay",
                title: "确定要删除 " + item.script_name + " 吗？",
                positive: "确定",
                negative: "取消"
            }).on("positive", () => {
                mod_data.splice(i, 1);
                sto_mod.put("modular", mod_data);
                ui.post(() => {
                    uii.files_0.adapter.notifyDataSetChanged();
                }, 50);
            }).show()
        })
        e.consumed = true;
    });
}

var modular = {}
modular.create_modular = create_modular;
try {
    module.exports = modular;
} catch (err) {
    modular.create_modular()
}