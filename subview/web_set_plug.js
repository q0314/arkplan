//"ui";
var callback,
    collection,
    view,
    mBottomSheetDialog,
    mDialogBehavior;

function initialization_() {
    importClass(android.content.DialogInterface);
    importClass(android.graphics.drawable.GradientDrawable);
    importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
    importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);

    collection = [{

        title: "书签",
        url: "",
        icon: "file://res/ic_bookmark.webp/",
    }, {/*
        title: "夜间模式",
        url: "",
        icon: "file://res/ic_night.png",
    }, {*/
       title:"电脑模式",
       icon: "file://res/ic_pc.webp"
    },{
        title: "设置UA",
        url: "",
        icon: "file://res/ic_setua.webp",
    }, {
        title: "无图模式",
        url: "",
        icon: "file://res/ic_nopic.webp",
    }, {
        title: "刷新",
        url: "",
        icon: "file://res/ic_refresh.webp"
    }, {
        title: "分享",
        url: "",
        icon: "file://res/ic_share.webp"
    }, {

        title: "锁定",
        url: "",
        icon: "@drawable/ic_center_focus_strong_black_48dp",
    }, {
        title: "添加书签",
        url: "",
        icon: "file://res/ic_addbookmark.webp",
    }, {
        title: "退出",
        url: "",
        icon: "file://res/ic_signout.webp",
    }, {
        title: "设置",
        url: "",
        icon: "file://res/ic_setup.webp"
    }]

    view = ui.inflate(
        <frame bg="#00eff0f4" >
            <vertical id="c" >
                <grid id="label" w="*" h="*"  marginTop="10" spanCount="5" numColumns="2" gravity="center_horizontal">
                    <card cardBackgroundColor="#eff0f4" cardElevation="0" margin="5 10"
                    w="*" h="60" layout_gravity="center_horizontal" layout_weight="1">
                    <img id="icon"  w="25" h="25" layout_gravity="center" src="{{this.icon}}" marginBottom="5" tint="#6e6e70" />
                    <text id="text"  w="auto" h="auto" lines="1" text="{{this.title}}" textSize="12sp" textColor="#6e6e70" layout_gravity="center|bottom" />
                </card>
            </grid>
            <horizontal bg="#00ffffff" id="_tool"  gravity="center">
                
                <card id="close" cardBackgroundColor="#eff0f4" cardElevation="0"  cardCornerRadius="0"
                w="*" h="50" layout_gravity="center" foreground="?selectableItemBackground" >
                <img w="20" h="20" src="file://res/ic_to_bottom.webp" layout_gravity="center"/>
                
            </card>
            
        </horizontal>
        
        </vertical>
        
        </frame>
    );

    view.label.setDataSource(collection)
    //view.search.setIconified(false);//唤起键盘

    view.close.on("click", function() {
        mBottomSheetDialog.dismiss()
        // add_c()
        //Refresh_label(false)
    })

    var ua_plug = require("./ua_plug.js");

    view.label.on("item_click", function(item, i, itemView, listView) {
        switch (item.title) {
            case "设置":
                 let variable = "'ui';var theme = require('./theme.js');"
                 engines.execScript("webview_set_ui", variable + "require('./subview/webview_set.js');");
   
                break
            case "设置UA":
                ua_plug.ua_plug(function(ua, set_s) {
                    if (set_s) {
                        callback(item.title, ua)
                        mBottomSheetDialog.dismiss()
                    } else {
                        return callback(item.title, true)
                    }
                })
                break
            default:
                mBottomSheetDialog.dismiss()
                callback(item.title);
                break
        }
    });

    mBottomSheetDialog = new BottomSheetDialog(activity);

    mBottomSheetDialog.setContentView(view);

    mDialogBehavior = BottomSheetBehavior.from(view.getParent());
    //mDialogBehavior.setPeekHeight();
    mDialogBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback({
        onStateChanged: function(view, i) {
            if (i == BottomSheetBehavior.STATE_HIDDEN) {
                // storages.create("configure").put("web_label", collection)
                mBottomSheetDialog.dismiss();
                mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);

            }
        }

    }));
    mBottomSheetDialog.setOnDismissListener(new DialogInterface.OnDismissListener({
        onDismiss: function(view) {
            if (mDialogBehavior.state == BottomSheetBehavior.STATE_EXPANDED) {
                // storages.create("configure").put("web_label", collection)
                mBottomSheetDialog.dismiss();
                mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
            }
        }
    }));

    mDialogBehavior.setState(BottomSheetBehavior.STATE_EXPANDED)
    var lp = mBottomSheetDialog.getWindow();
    lp.dimAmount = 0.3;

    //设置弹窗圆角和背景
    try{
    tool.setBackgroundRoundRounded(view.getParent(), {radius:40,})
    //mBottomSheetDialog.show();
    }catch(e){
        console.verbose("设置对话框样式出错:"+e)
    }
    
}
var web_set_plug = {
    initialization: function() {
        initialization_()
    },
    web_set_plug: function(callback_) {
        callback = callback_;
        if (collection == undefined || view == undefined || mBottomSheetDialog == undefined) {
            console.verbose("初始化web_set_plug...");
            initialization_()
        }
        mBottomSheetDialog.show();

        let listView; // = view.label.getChildAt(3);
        ui.post(() => {

            for (let i = 0; i < view.label.getChildCount(); i++) {
                listView = view.label.getChildAt(i);
                switch (listView.text.getText()) {
                    case "无图模式":
                        if (callback("无图模式", true)) {
                            listView.text.setTextColor(colors.parseColor("#6e6e70"))
                            listView.icon.attr("tint", "#6e6e70")
                        } else {
                            listView.text.setTextColor(colors.parseColor("#0d84ff"))
                            listView.icon.attr("tint", "#0d84ff")
                        }
                        break;
                    case "电脑模式":
                        if (!callback("电脑模式", true)) {
                            listView.text.setTextColor(colors.parseColor("#6e6e70"))
                            listView.icon.attr("tint", "#6e6e70")
                        } else {
                            listView.text.setTextColor(colors.parseColor("#0d84ff"))
                            listView.icon.attr("tint", "#0d84ff")
                        }
                    break
                    case "夜间模式":
                        if (!callback("夜间模式", true)) {
                            listView.text.setTextColor(colors.parseColor("#6e6e70"))
                            listView.icon.attr("tint", "#6e6e70")
                        } else {
                            listView.text.setTextColor(colors.parseColor("#0d84ff"))
                            listView.icon.attr("tint", "#0d84ff")
                        }
                    break
                    case "锁定":
                        if(!files.exists("./w_main.js")){
                            listView.text.setText("悬浮窗");
                            listView.icon.attr("src","@drawable/ic_language_black_48dp")
                            listView.icon.attr("w","30")
                            listView.icon.attr("h","30")
                        }
                        if (callback("锁定", true)) {
                            listView.text.setTextColor(colors.parseColor("#6e6e70"))
                            listView.icon.attr("tint", "#6e6e70")
                        } else {
                            listView.text.setTextColor(colors.parseColor("#0d84ff"))
                            listView.icon.attr("tint", "#0d84ff")
                        }
                        break

                }
            }
        })

    },
}
try {
    module.exports = web_set_plug;
} catch (e) {
    initialization_()

    mBottomSheetDialog.show()

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