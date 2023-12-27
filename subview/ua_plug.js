//"ui";
importClass(android.content.DialogInterface);
importClass(android.graphics.drawable.GradientDrawable);
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);

var callback,
    ua_list,
    d_add;

function initialization_() {

    ua_list = storages.create("configure").get("ua_list")
    if (ua_list == undefined) {
        let ua = callback(false);
        storages.create("configure").put("ua_list", [{
            name: "默认",
            value: ua,
        }, {
            name: "Chrome (PC)",
            value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        }, {
            name: "IE 11 (PC)",
            value: "Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko",
        }, {
            name: "iPhone",
            value: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",

        }, {
            name: "MIUI Browser",
            value: "Mozilla/5.0 (Linux; U; Android 11; zh-cn; MI 9 Build/RKQ1.200826.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.116 Mobile Safari/537.36 XiaoMi/MiuiBrowser/16.3.12 swan-mibrowser",
        }])
        ua_list = storages.create("configure").get("ua_list")
    }

    ui_ua = ui.inflate(
        <vertical padding="0 0" >
            <text id="add_text" text="UA管理" gravity="center" margin="0 10" />
            <grid id="ua_set" visibility="visible" >
                <card w="*" h="auto" cardCornerRadius="3dp"
                cardElevation="0dp" id="tucolos" bg="#eff0f4" foreground="?selectableItemBackground">
                <horizontal margin="10 10" w="*" bg="#00000000">
                    <text id="tutext" text=" {{this.name}}" textColor="#000000" textSize="15" />
                </horizontal>
                
                <img id="tick" w="25" h="25" src="@drawable/ic_done_black_48dp" layout_gravity="right|center" tint="#0d84ff" marginRight="30" visibility="gone"/>
            </card>
            
        </grid>
        <vertical id="input" visibility="gone" margin="15 0 15 10">
            <com.google.android.material.textfield.TextInputLayout
            id="edit_name"
            
            layout_width="match_parent"
            layout_height="wrap_content"
            >
            <EditText layout_width="match_parent" layout_height="wrap_content" textSize="18sp"
            singleLine="true"
            windowSoftInputMode="stateHidden"
            />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
        id="edit_value"
        layout_width="match_parent"
        layout_height="wrap_content"
        >
        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="18sp"
        singleLine="true"
        />
        </com.google.android.material.textfield.TextInputLayout>
        
        </vertical>
        <horizontal gravity="left" margin="0 10 0 5">
            <button id="delete" text="删除" style="Widget.AppCompat.Button.Borderless" w="auto" visibility="gone"/>
            
            <horizontal gravity="right" w="*" >
                <button id="no" text="取消" style="Widget.AppCompat.Button.Borderless" w="auto" />
                <button id="ok" text="添加" style="Widget.AppCompat.Button.Borderless" w="auto" />
            </horizontal>
        </horizontal>
        </vertical>, null, false)

    d_add = dialogs.build({
        type: 'app',
        customView: ui_ua,
        //  positive: "添加",
        // positiveColor: "#424242",
        //  negative: "取消",
        // negativeColor: "#cc423232",
        wrapInScrollView: false,
    }).on("dismiss", (dialog) => {
        storages.create("configure").put("ua_list", ua_list)
        ua_list = storages.create("configure").get("ua_list")
                
        ui_ua.add_text.setText("UA管理")
        ui_ua.delete.setVisibility(8)
        ui_ua.ok.setText("添加");
        for (let i = 0; i < ui_ua.ua_set.getChildCount(); i++) {
            let itemView = ui_ua.ua_set.getChildAt(i);
            if (itemView.tick.attr("visibility") != "gone") {
                itemView.tick.attr("visibility", "gone")
                itemView.setBackgroundColor(colors.parseColor("#eff0f4"))
            }
        }
    })
    tool.setBackgroundRoundRounded(d_add.getWindow())

    ui_ua.ua_set.setDataSource(ua_list)
    ui_ua.edit_name.setHint("名称")
    ui_ua.edit_value.setHint("UA")

    let _event = false;
    ui_ua.ok.on("click", function() {
        switch (ui_ua.add_text.getText()) {
            case "UA管理":
                ui_ua.add_text.setText("添加UA");
                ui_ua.ok.setText("确认")
                ui_ua.input.attr("visibility", "visible");
                ui_ua.ua_set.attr("visibility", "gone");

                break
            case "添加UA":
            case "编辑UA":
                let name = ui_ua.edit_name.getEditText().getText().toString()
                let value = ui_ua.edit_value.getEditText().getText().toString()
                if (name.length < 1) {
                    ui_ua.edit_name.setError("名称不可为空");
                    if (value.length < 10) {
                        ui_ua.edit_value.setError("UA不可为空");
                    }
                    return
                }
                if (ui_ua.add_text.getText() == "添加UA") {
                    ua_list.push({
                        name: name,
                        value: value
                    })
                } else {
                    ua_list[_event].name = name;
                    ua_list[_event].value = value;
                }
                storages.create("configure").put("ua_list", ua_list)
                ua_list = storages.create("configure").get("ua_list")
                ui_ua.input.attr("visibility", "gone");
                ui_ua.ua_set.attr("visibility", "visible");
                ui_ua.add_text.setText("UA管理");
                ui_ua.delete.setVisibility(8)
                ui_ua.ok.setText("添加");
                let itemView = ui_ua.ua_set.getChildAt(_event);
                if (itemView != null) {
                    itemView.tick.attr("visibility", "gone")
                    itemView.setBackgroundColor(colors.parseColor("#eff0f4"))
                }
                ui_ua.ua_set.setDataSource(ua_list)
                break
            case "选中UA":
                try {
                    ui_ua.edit_name.getEditText().setText(ua_list[_event].name.toString())
                    ui_ua.edit_value.getEditText().setText(ua_list[_event].value.toString())
                } catch (e) {
                    log(_event)
                    console.error(e)
                }
                ui_ua.add_text.setText("编辑UA");
                ui_ua.ok.setText("确认")
                ui_ua.input.attr("visibility", "visible");
                ui_ua.ua_set.attr("visibility", "gone");
                break
        }
    })
    ui_ua.no.on("click", function() {
        switch (ui_ua.add_text.getText()) {
            case "UA管理":
                d_add.dismiss();
                return
            case "编辑UA":
                ui_ua.edit_name.getEditText().setText("")
                ui_ua.edit_value.getEditText().setText("")
                ui_ua.add_text.setText("选中UA");
                ui_ua.ok.setText("编辑")
                ui_ua.input.attr("visibility", "gone");
                ui_ua.ua_set.attr("visibility", "visible");
                break
            case "添加UA":
                ui_ua.add_text.setText("UA管理");
                ui_ua.ok.setText("添加")
                ui_ua.input.attr("visibility", "gone");
                ui_ua.ua_set.attr("visibility", "visible");
                break
            case "选中UA":
                ui_ua.add_text.setText("UA管理")
                ui_ua.delete.setVisibility(8)
                ui_ua.ok.setText("添加");
                let itemView = ui_ua.ua_set.getChildAt(_event);
                itemView.tick.attr("visibility", "gone")
                itemView.setBackgroundColor(colors.parseColor("#eff0f4"))
                break
        }

    })
    ui_ua.delete.on("click", function() {
        var d_tips = dialogs.build({
            type: 'app',
            title: "确定要移除书签 “" + ua_list[_event].name + "” 吗",
            positive: "确定",
            negative: "取消",
            positiveColor: "#f22424",
            negativeColor: "#424242"
        }).on("positive", () => {
            ui.run(() => {
                ua_list.splice(_event, 1);

                ui_ua.add_text.setText("UA管理")
                ui_ua.delete.setVisibility(8)
                ui_ua.ok.setText("添加");
                ui_ua.input.attr("visibility", "gone");
                ui_ua.ua_set.attr("visibility", "visible");
                _event = false
            })


        })   //设置弹窗圆角和背景
        try{
        tool.setBackgroundRoundRounded(d_tips.getWindow(), {radius:40,})
        //mBottomSheetDialog.show();
        }catch(e){
            console.verbose("设置对话框样式出错:"+e)
        }
        d_tips.show()

    })
    ui_ua.ua_set.on("item_long_click", function(e, item, i, itemView, listView) {
        _event = true;
        if (i == 0) {
            return
        }
        itemView.tick.attr("visibility", "visible")
        itemView.setBackgroundColor(colors.parseColor("#87CEFA"))
        ui_ua.delete.attr("visibility", "visible");
        ui_ua.add_text.setText("选中UA");
        ui_ua.ok.setText("编辑");
        let itemView_ = ui_ua.ua_set;
        for (var i_ = 0; i_ < itemView_.getChildCount(); i_++) {
            itemView_c = itemView_.getChildAt(i_)
            if (i_ != i && itemView_c.tick.attr("visibility") != "gone") {
                itemView_c.tick.attr("visibility", "gone")
                itemView_c.setBackgroundColor(colors.parseColor("#eff0f4"))
            }
        }
    })
    ui_ua.ua_set.on("item_click", function(item, i, itemView, listView) {
        console.verbose("ua_click"+_event)
        if (_event) {
            _event = false;
            return
        }
      
        if (callback != undefined) {
            callback(item.value, true);
            d_add.dismiss()
        }
    });

}


var ua_plug = {
    initialization: function() {
        initialization_()
    },
    ua_plug: function(callback_) {
        callback = callback_;
        if (ua_list == undefined || ui_ua == undefined) {
            log("初始化ua_plua...");
            initialization_()
        }
        ua_list = storages.create("configure").get("ua_list")
        ui_ua.ua_set.setDataSource(ua_list)

        d_add.show();
        $ui.post(() => {
            let ua = callback(false);
            for (let i = 0; i < ua_list.length; i++) {
                let view = ui_ua.ua_set.getChildAt(i)
                if (view != null) {
                    if (ua == ua_list[i].value) {
                        view.tutext.setTextColor(colors.parseColor("#0d84ff"));
                    } else {
                        view.tutext.setTextColor(colors.parseColor("#000000"));
                    }
                }
            }
        }, 300)
    },
}

try {
    module.exports = ua_plug;
} catch (e) {
    initialization_()
    d_add.show()

}

/*
ui.layout(
    <vertical>
        <button id='btn' text='BottomSheetDialog' />
    </vertical>
);

ui.btn.on('click', function() {
    mBottomSheetDialog.show()
});
*/