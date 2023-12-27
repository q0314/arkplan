function getStorageData() {
    return "file://./icons/icon.png"
}


var script = {
    Administration: function(jk) {
        function stopscript(scriptId) {
            let execution = engines.all();
            for (var i = 0; i < execution.length; i++) {
                if (scriptId == execution[i].getId()) {
                    execution[i].forceStop();
                    return true;
                }
            }
        }

        function query() {
            items = []
            let execution = engines.all();
            for (let i = 0; i < execution.length; i++) {
                if (execution[i].toString() != engines.myEngine().toString()) {
                    let js = execution[i].getSource().toString().match(/([^/]+)$/)[1];
                    if (js != "main.js"&& js != "rational_notice.js") {

                        items.push({
                            icon: "@drawable/ic_panorama_fish_eye_black_48dp",
                            name: execution[i].getSource().toString().match(/([^/]+)$/)[1],
                            Id: execution[i].getId(),
                            tag: ""
                        });
                    }

                } else {
                    items.push({
                        icon: "@drawable/ic_panorama_fish_eye_black_48dp",
                        name: execution[i].getSource().toString().match(/([^/]+)$/)[1],
                        Id: execution[i].getId(),
                        tag: "[当前脚本]"
                    });
                }
            }
            return items;
        }
        var DHK = ui.inflate(
            <frame background="#ffffff" padding="5">
                        <scroll bg="#ffffff">
                            <vertical bg="#ffffff">
                                <linear orientation="horizontal" gravity="left||center">
                                    <img src="file://res/icon.png" w="85" h="35" marginLeft="-15"/>
                                    <linear orientation="horizontal" w="match_parent" gravity="right||center">
                                        <text text="管理运行脚本" textStyle="bold" textSize="20" textColor="#000000" marginRight="5"/>
                                    </linear>
                                </linear>
                                <View bg="#f5f5f5" w="*" h="1" margin="5"/>
                                <list id="alljslist">
                                    <card w="*" h="50" cardCornerRadius="10dp" cardElevation="0dp" gravity="center_vertical" margin="5" cardBackgroundColor="#f5f5f5">
                                        <linear orientation="horizontal" gravity="center|left">
                                            <img id="checkthisjs" src="{{icon}}" w="30" h="30" tint="#000000" marginLeft="5"/>
                                            <text id="TAG" textSize="16sp" gravity="left||center" textColor="#FF9800" text="{{tag}}"/>
                                            <text id="ID" textSize="16sp" gravity="left||center" textColor="#4CAF50" text="[{{Id}}]"/>
                                            <text id="name" textSize="16sp" gravity="left||center" textColor="#000000" text="{{name}}"/>
                                        </linear>
                                        <linear gravity="center||right" marginRight="20">
                                            <img id="deleteItem" src="@drawable/ic_clear_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true"/>
                                        </linear>
                                    </card>
                                </list>
                                <text text="已经到底啦" textSize="10" textColor="#000000" margin="5 5 5 100" alpha="0.5" gravity="bottom||center"/>
                            </vertical>
                        </scroll>
                        <card w="*" h="50" cardCornerRadius="10dp" cardElevation="0dp" layout_gravity="bottom" margin="5" cardBackgroundColor="#f5f5f5">
                            <linear orientation="horizontal" gravity="center|left">
                                <img id="checkAll" src="@drawable/ic_panorama_fish_eye_black_48dp" w="30" h="30" tint="#000000" marginLeft="5"/>
                                <text id="checkAllText" textSize="16sp" gravity="left||center" textColor="#000000" text="全选"/>
                            </linear>
                            <linear gravity="center||right" marginRight="20">
                                <card id="finaldel" h="0" cardCornerRadius="5dp" gravity="center_vertical" cardBackgroundColor="#000000" foreground="?attr/selectableItemBackground" clickable="true">
                                    <text text="强行停止" textColor="#000000" textSize="16sp" gravity="center" margin="10 0"/>
                                </card>
                            </linear>
                        </card>
                    </frame>, null, false);
        var ControlDHK = dialogs.build({
            type: "app-or-overlay",
            customView: DHK,
            wrapInScrollView: false,
            autoDismiss: false
        }).on("dismiss", (dialog) => {
            //  exit();
        })
        ControlDHK.show();
        DHK.finaldel.click(() => {
            let view = ui.inflate(
                <vertical padding="25 0" bg="#ffffff">
                                    <linear orientation="horizontal" align="left" margin="0" paddingTop="0">
                                        <img src="@drawable/ic_warning_black_48dp" h="20" marginTop="3" tint="#F44336" layout_gravity="center"/>
                                        <text id="deleteTitle" textSize="15" textStyle="bold" margin="0 5 10 0" textColor="#F44336"/>
                                    </linear>
                                    <text id="deleteTips" textStyle="bold" textSize="10" margin="10 5 10 5" textColor="#D32F2F"/>
                                    <linear orientation="horizontal" align="left" margin="0" paddingTop="0">
                                        <card layout_weight="50" h="40" cardCornerRadius="5dp" cardElevation="0dp" gravity="center_vertical" margin="5"cardBackgroundColor="#F44336">
                                            <text id="Determine" text="确认停止" textStyle="bold" textColor="#FFFFFF" gravity="center" textSize="12sp" foreground="?attr/selectableItemBackground" clickable="true"/>
                                        </card>
                                        <card layout_weight="50" h="40" cardCornerRadius="5dp" cardElevation="0dp" gravity="center_vertical" margin="5"cardBackgroundColor="#4CAF50">
                                            <text id="cancel" text="取消停止" textStyle="bold" textColor="#FFFFFF" gravity="center" textSize="12sp" foreground="?attr/selectableItemBackground" clickable="true"/>
                                        </card>
                                    </linear>
                                </vertical>, null, false);
            ui.post(() => {
                view.deleteTitle.setText("您确定要强行停止以下" + context_ListDeletejs.length + "个脚本吗？");
            }, 1);
            var waitdel = [];
            for (let i = 0; i < context_ListDeletejs.length; i++) {
                waitdel.push("[" + context_ListDeletejs[i].Id + "]" + context_ListDeletejs[i].name);
            }

            view.deleteTips.setText("本次将强行停止的脚本：\n“" + waitdel + "”\n\n* 强行停止脚本可能会造成数据丢失等意外情况，请确认无误后再进行操作");
            view.cancel.click(() => {
                DHK.dismiss();
            });
            view.Determine.click(() => {
                let deleteWrong = [];
                for (let i = 0; i < context_ListDeletejs.length; i++) {
                    if (stopscript(context_ListDeletejs[i].Id) != true) {
                        deleteWrong.push("[" + context_ListDeletejs[i].Id + "]" + context_ListDeletejs[i].name);
                    }
                }

                if (deleteWrong.length == 0) {
                    DHK.dismiss();
                    ControlDHK.dismiss();
                    let views = ui.inflate(
                        <vertical padding="25 0" bg="#ffffff">
                                                    <img src="@drawable/ic_check_circle_black_48dp" size="20" margin="5" gravity="center"tint="#000000"/>
                                                    <text id="deleteDone" textStyle="bold" textSize="15" margin="10" textColor="#000000" gravity="center"/>
                                                    <text id="deleteDonetips" textSize="10" margin="5" textColor="#000000" gravity="center"/>
                                                </vertical>
                    );
                    views.deleteDone.setText("已强行停止" + context_ListDeletejs.length + "个脚本");
                    deleteAlready = [];
                    for (let i = 0; i < context_ListDeletejs.length; i++) {
                        deleteAlready.push("[" + context_ListDeletejs[i].Id + "]" + context_ListDeletejs[i].name);
                    }

                    views.deleteDonetips.setText("已被强行停止的脚本：\n“" + deleteAlready + "”");
                    dialogs.build({
                        type: "app-or-overlay",
                        customView: views,
                        wrapInScrollView: false,
                        autoDismiss: true
                    }).show();
                } else {
                    DHK.dismiss();
                    let views = ui.inflate(
                        <vertical padding="25 0" bg="#ffffff">
                                                    <img src="@drawable/ic_cancel_black_48dp" size="20" margin="5" gravity="center" tint="#000000"/>
                                                    <text id="deleteDone" textStyle="bold" textSize="15" margin="10" textColor="#000000" gravity="center"/>
                                                    <text id="deleteDonetips" textSize="10" margin="5" textColor="#000000" gravity="center"/>
                                                </vertical>
                    );
                    views.deleteDone.setText("共有" + deleteWrong.length + "个脚本强行停止失败！");
                    views.deleteDonetips.setText("以下为本次强行停止失败的脚本：\n“" + deleteWrong + "”");
                    dialogs.build({
                        type: "app-or-overlay",
                        customView: views,
                        wrapInScrollView: false,
                        autoDismiss: true
                    }).show();
                }
                context_ListDeletejs = [];
                items = query()
                try {
                    DHK.alljslist.setDataSource(items);

                    DHK.finaldel.attr("h", 0);
                    DHK.checkAllText.setText("全选");
                    DHK.checkAll.setSource("@drawable/ic_panorama_fish_eye_black_48dp");
                } catch (err) {}
            });
            let DHK = dialogs.build({
                type: "app-or-overlay",
                customView: view,
                wrapInScrollView: false,
                autoDismiss: false
            }).show();
        });
        items = [];
        items = query()

        DHK.alljslist.setDataSource(items);
        context_ListDeletejs = [];
        DHK.alljslist.on("item_click", function(item, i, itemView, alljslistView) {
            function WhetherAlready(D) {
                for (let i = 0; i < context_ListDeletejs.length; i++) {
                    if (D == context_ListDeletejs[i].Id) {
                        return i;
                    }
                }
            }
            if (WhetherAlready(item.Id) != undefined) {
                context_ListDeletejs.remove(context_ListDeletejs[WhetherAlready(item.Id)]);
                itemView.checkthisjs.setSource("@drawable/ic_panorama_fish_eye_black_48dp");
            } else {
                context_ListDeletejs.push({
                    Id: item.Id,
                    name: item.name
                });
                itemView.checkthisjs.setSource("@drawable/ic_check_circle_black_48dp");
            }
            if (context_ListDeletejs.length > 0) {
                DHK.finaldel.attr("h", 35);
                DHK.finaldel.attr("cardBackgroundColor", "#F44336");
                DHK.checkAllText.setText("全选（已勾选" + context_ListDeletejs.length + "个）");
            } else {
                DHK.finaldel.attr("h", 0);
                DHK.checkAllText.setText("全选");
                DHK.checkAll.setSource("@drawable/ic_panorama_fish_eye_black_48dp");
            }
            if (context_ListDeletejs.length > 0 && context_ListDeletejs.length == items.length) {
                DHK.checkAll.setSource("@drawable/ic_check_circle_black_48dp");
                DHK.finaldel.attr("h", 35);
                DHK.finaldel.attr("cardBackgroundColor", "#F44336");
            } else if (context_ListDeletejs.length > 0) {
                DHK.checkAll.setSource("@drawable/ic_panorama_fish_eye_black_48dp");
            }
        });

        DHK.alljslist.on("item_bind", function(itemView, itemHolder) {
            itemView.deleteItem.on("click", function() {
                let item = itemHolder.item;
                let view = ui.inflate(
                    <vertical padding="25 0" bg="#ffffff">
                                                <linear orientation="horizontal" align="left">
                                                    <img src="@drawable/ic_warning_black_48dp" h="20" marginTop="3" tint="#F44336" layout_gravity="center"/>
                                                    <text id="deleteTitle" textSize="15" textStyle="bold" margin="0 5 0 0" textColor="#F44336"/>
                                                </linear>
                                                <text id="deleteTips" textStyle="bold" textSize="10" margin="10 5 10 5" textColor="#D32F2F"/>
                                                <linear orientation="horizontal" align="left" margin="0" paddingTop="0">
                                                    <card layout_weight="50" h="40" cardCornerRadius="5dp" cardElevation="0dp" gravity="center_vertical" margin="5"cardBackgroundColor="#F44336">
                                                        <text id="Determine" text="强行停止" textStyle="bold" textColor="#FFFFFF" gravity="center" textSize="12sp" foreground="?attr/selectableItemBackground" clickable="true"/>
                                                    </card>
                                                    <card layout_weight="50" h="40" cardCornerRadius="5dp" cardElevation="0dp" gravity="center_vertical" margin="5"cardBackgroundColor="#4CAF50">
                                                        <text id="cancel" text="取消停止" textStyle="bold" textColor="#FFFFFF" gravity="center" textSize="12sp" foreground="?attr/selectableItemBackground" clickable="true"/>
                                                    </card>
                                                </linear>
                                            </vertical>, null, false);
                view.deleteTitle.setText("您确定要强行停止“[" + item.Id + "]" + item.name + "”脚本吗？");

                view.Determine.click(() => {
                    if (stopscript(item.Id) == true) {
                        DHK.dismiss();
                        if (items.length == 0 || item.tag == "[当前脚本]") {
                            ControlDHK.dismiss()
                        }

                        items.splice(itemHolder.position, 1);

                        let views = ui.inflate(
                            <vertical padding="25 0" bg="#ffffff">
                                                                <img src="@drawable/ic_check_circle_black_48dp" size="20" margin="5" gravity="center"tint="#000000"/>
                                                                <text id="deleteDone" textStyle="bold" textSize="15" margin="10" textColor="#000000" gravity="center"/>
                                                            </vertical>
                        );
                        views.deleteDone.setText("已成功停止“" + item.name + "(" + item.Id + ")”脚本");
                        dialogs.build({
                            type: "app-or-overlay",
                            customView: views,
                            wrapInScrollView: false,
                            autoDismiss: true
                        }).show();
                    } else {
                        DHK.dismiss();
                        let views = ui.inflate(
                            <vertical padding="25 0" bg="#ffffff">
                                                                <img src="@drawable/ic_cancel_black_48dp" size="20" margin="5" gravity="center" tint="#000000"/>
                                                                <text id="deleteDone" textStyle="bold" textSize="15" margin="10" textColor="#000000" gravity="center"/>
                                                            </vertical>
                        );
                        views.deleteDone.setText("停止“" + item.name + "(" + item.Id + ")”脚本失败！");
                        dialogs.build({
                            type: "app-or-overlay",
                            customView: views,
                            wrapInScrollView: false,
                            autoDismiss: true
                        }).show();
                    }
                });
                view.cancel.click(() => {
                    DHK.dismiss();
                });
                let DHK = dialogs.build({
                    type: "app-or-overlay",
                    customView: view,
                    wrapInScrollView: false,
                    autoDismiss: false
                }).show();
            });
        })
        context_CheckAlldelete = false;
        DHK.checkAll.on("click", function(item, i, itemView, alljslistView) {
            if (context_CheckAlldelete == true) {
                context_CheckAlldelete = false;
                DHK.checkAll.setSource("@drawable/ic_panorama_fish_eye_black_48dp");
                items = query()
                ui.post(() => {
                    DHK.alljslist.setDataSource(items);
                }, 1)
                context_ListDeletejs = [];
            } else {
                context_CheckAlldelete = true;
                ui.post(() => {
                    DHK.checkAll.setSource("@drawable/ic_check_circle_black_48dp");
                    items = [];
                    let execution = engines.all();
                    for (let i = 0; i < execution.length; i++) {
                        if (execution[i].toString() != engines.myEngine().toString()) {
                            if (execution[i].getSource().toString().match(/([^/]+)$/)[1] != "main.js") {
                                items.push({
                                    icon: "@drawable/ic_check_circle_black_48dp",
                                    name: execution[i].getSource().toString().match(/([^/]+)$/)[1],
                                    Id: execution[i].getId(),
                                    tag: ""
                                });
                            }
                        } else {
                            items.push({
                                icon: "@drawable/ic_check_circle_black_48dp",
                                name: execution[i].getSource().toString().match(/([^/]+)$/)[1],
                                Id: execution[i].getId(),
                                tag: "[当前脚本]"
                            });
                        }
                    }
                    DHK.alljslist.setDataSource(items);
                }, 1)
                context_ListDeletejs = [];
                for (let i = 0; i < items.length; i++) {
                    context_ListDeletejs.push({
                        Id: items[i].Id,
                        name: items[i].name
                    });
                }
            }
            if (context_ListDeletejs.length > 0) {
                DHK.checkAllText.setText("全选（已勾选" + context_ListDeletejs.length + "个）");
                DHK.finaldel.attr("h", 35);
                DHK.finaldel.attr("cardBackgroundColor", "#F44336");
            } else {
                DHK.checkAllText.setText("全选");
                DHK.finaldel.attr("h", 0);
            }
        });


        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
    }
}
//script.Administration()
module.exports = script;