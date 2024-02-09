"ui";

/**
 * 书签管理
 */
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

    collection = storages.create("configure").get("web_label")
    if (collection == undefined) {
        storages.create("configure").put("web_label", [{
            title: "明日方舟官网",
            url: "https://ak.hypergryph.com/",
            icon: "https://ak.hypergryph.com/favicon.ico",
        }, {
            title: "泰拉记事社",
            url: "https://terra-historicus.hypergryph.com/",
            icon: "https://terra-historicus.hypergryph.com/favicon.ico",
        }, {
            title: "塞壬唱片",
            url: "https://monster-siren.hypergryph.com/m",
            icon: "https://monster-siren.hypergryph.com/favicon.ico",
        }, {
            title: "企鹅物流",
            url: "https://penguin-stats.cn/",
            icon: "https://penguin-stats.cn/favicon.ico",
        }, {
            title: "明日方舟工具箱",
            url: "https://arkn.lolicon.app/#/",
            icon: "https://arkn.lolicon.app/favicon.ico",
        }, {
            title: "寻访记录分析",
            url: "https://arkgacha.kwer.top/",
            icon: "https://arkgacha.kwer.top/static/icon.ico",
        }, {
            title: "PRTS",
            url: "https://m.prts.wiki/w/%E9%A6%96%E9%A1%B5",
            icon: "https://m.prts.wiki/favicon.ico",
        }, {
            title: "Kokodayo",
            url: "https://kokodayo.fun/",
            icon: "https://kokodayo.fun/favicon.ico",
        }, {
            title: "Arknights DPS",
            url: "https://viktorlab.cn/akdata/dps/",
            icon: "https://viktorlab.cn/akdata/favicon.ico",
        }, {
            title: "干员培养表",
            url: "https://ark-nights.com/",
            icon: "https://ark-nights.com/favicon.ico",
        }, {
            title: "材料获取一图流",
            url: "http://ark.yituliu.cn/",
            icon: "http://ark.yituliu.cn/favicon.ico",
        }, {
            /*
           title:"夏活攒抽规划",
           url:"https://xunfang.vercel.app/",
           icon:"https://pica.zhimg.com/80/v2-cc92c54352f3359e6ce94bfbb88c1fa6_720w.jpg?source=1940ef5c",
        },{*/
            title: "少人Wiki",
            url: "https://arkrec.com/",
            icon: "https://arkrec.com/favicon/apple-touch-icon.png",
        }, {
            title: "ArkStory",
            url: "https://arkstory.cc/story",
            icon: "https://arkstory.cc/static/images/favicon.png",
        },{
        
            title: "必应搜索",
            url: "https://cn.bing.com/search?q=",
            icon: "https://cn.bing.com/favicon.ico"
        }])
        collection = storages.create("configure").get("web_label")
    }
    view = ui.inflate(
        <frame bg="#00eff0f4" >
            <vertical id="c" >
                <grid id="label" w="*" h="*"  marginTop="10" spanCount="4" numColumns="2" gravity="center_horizontal">
                    <card cardBackgroundColor="#eff0f4" cardElevation="15" margin="3" cardCornerRadius="5"
                    w="*" h="90" layout_gravity="center_horizontal" layout_weight="1">
                    <img id="icon" circle="true" w="50" h="50" layout_gravity="center" src="{{this.icon}}" marginBottom="5" />
                    <text id="text"  w="auto" h="auto" lines="1" text="{{this.title}}" textSize="12sp" layout_gravity="center|bottom" />
                    <frame margin="2" w="25" h="25" id="remove"  layout_gravity="right|top" visibility="gone">
                        <img  src="file://res/ic_fullscreen.webp" marginBottom="5" />
                    </frame>
                </card>
            </grid>
            <horizontal id="_search" visibility="gone">
                <frame w="*">
                    <SearchView id="search" w="*" h="50" margin="0" padding="0" />
                    <card id="cancel" cardBackgroundColor="#eff0f4" cardElevation="0"  cardCornerRadius="0"
                    w="80" h="50" layout_gravity="right" foreground="?selectableItemBackground" >
                    <text id="text"  w="auto" h="auto" lines="1" text="取消" textSize="15sp" layout_gravity="center" />
                </card>
                
            </frame>
        </horizontal>
        <horizontal bg="#00ffffff" id="_tool"  gravity="center">
            
            <card id="tool_1" cardBackgroundColor="#00ffffff" cardElevation="0"  cardCornerRadius="0"
            w="auto" h="auto" layout_gravity="center" foreground="?selectableItemBackground" >
            <vertical w="50" h="50" margin="5 10 5 0">
                <img w="25" h="25" layout_gravity="center" src="file://res/ic_addbookmark.webp"  />
                <text id="text"  w="auto" h="auto" lines="1" text="添加书签" textSize="12sp" layout_gravity="center|bottom" />
            </vertical>
        </card>
        <card id="tool_2" cardBackgroundColor="#00ffffff" cardElevation="0"  cardCornerRadius="0"
        w="auto" h="auto" layout_gravity="center" foreground="?selectableItemBackground" >
        <vertical w="50" h="50" margin="5 10 5 0">
            <img w="25" h="25" layout_gravity="center" src="file://res/sousuo.webp" />
            <text id="text"  w="auto" h="auto" lines="1" text="搜索" textSize="12sp" layout_gravity="center|bottom" />
        </vertical>
        </card>
        
        <card id="tool_3" cardBackgroundColor="#00ffffff" cardElevation="0"  cardCornerRadius="0"
        w="auto" h="auto" layout_gravity="center" foreground="?selectableItemBackground" >
        <vertical w="50" h="50" margin="5 10 5 0">
            <img w="25" h="25" layout_gravity="center" src="file://res/ic_website.webp"  />
            <text id="text"  w="auto" h="auto" lines="1" text="编辑书签" textSize="12sp" layout_gravity="center|bottom" />
        </vertical>
        </card>
        
        </horizontal>
        
        </vertical>
        
        </frame>
    );


    view.cancel.on("click", function() {
        view.search.setQuery("", false);
        view._search.setVisibility(8)
        view._tool.setVisibility(0)
        view.label.setDataSource(collection)
        Refresh_label(false)

    })
    //view.search.setIconified(false);//唤起键盘
    view.search.setIconifiedByDefault(false)
    view.search.setQueryHint("搜索书签..."); //搜索的hint
    view.search.setOnQueryTextListener({
        onQueryTextChange: function(text) {
            if (text.length == 0) {
                view.label.setDataSource(collection);
                Refresh_label(false)
            } else {
                search(text);
            }
            return false
        },
        onQueryTextSubmit: function(text) {
            //false关闭键盘，true
            return true
        }

    });

    view.tool_1.on("click", function() {
        add_c()
        Refresh_label(false)
    })
    view.tool_2.on("click", function() {
        view._search.setVisibility(0)
        view._tool.setVisibility(8)
        view.search.setIconified(false)
        let list_ = view.label
        let itemView;
        for (var i = 0; i < list_.getChildCount(); i++) {
            itemView = list_.getChildAt(i)
            if (itemView.remove.getVisibility() == 0) {
                itemView.remove.setVisibility(8)
            }
        }

    })
    view.tool_3.on("click", function() {
        Refresh_label()
    })
    view.label.setDataSource(collection)
    let _event = false;
    view.label.on("item_long_click", function(e, item, i, itemView, listView) {
        _event = true
        Refresh_label()

    });

    view.label.on("item_click", function(item, i, itemView, listView) {
        if (_event) {
            _event = false
            return
        }
        if (itemView.remove.getVisibility() == 0) {
            add_c(item, i)
        } else if (callback != undefined) {
            callback(item.url)
            mBottomSheetDialog.dismiss()
        }
    });;
    view.label.on("item_bind", function(itemView, itemHolder) {
        itemView.remove.on("click", function() {
            let item = itemHolder.item;
            //  toast("被删除的人名字为: " + item.name + "，年龄为: " + item.age);

            var d_tips = dialogs.build({
                type: 'app',
                title: "确定要移除书签 “" + item.title + "” 吗",
                positive: "确定",
                negative: "取消",
                positiveColor: "#f22424",
                negativeColor: "#424242"
            }).on("positive", () => {
                collection.splice(itemHolder.position, 1);

            })
            tool.setBackgroundRoundRounded(d_tips.getWindow())
            d_tips.show()

        })
    })

    mBottomSheetDialog = new BottomSheetDialog(activity);

    mBottomSheetDialog.setContentView(view);

    mDialogBehavior = BottomSheetBehavior.from(view.getParent());
    mDialogBehavior.setPeekHeight(3000);
    mDialogBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback({
        onStateChanged: function(view, i) {
            if (i == BottomSheetBehavior.STATE_HIDDEN) {
                storages.create("configure").put("web_label", collection)
                mBottomSheetDialog.dismiss();
                mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);

            }
        }

    }));
    mBottomSheetDialog.setOnDismissListener(new DialogInterface.OnDismissListener({
        onDismiss: function(view) {
            if (mDialogBehavior.state == BottomSheetBehavior.STATE_EXPANDED) {
                storages.create("configure").put("web_label", collection)
                mBottomSheetDialog.dismiss();
                mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
            }
        }
    }));

    mDialogBehavior.setState(BottomSheetBehavior.STATE_EXPANDED)
    var lp = mBottomSheetDialog.getWindow();
    lp.dimAmount = 0.3;
try{
    //设置弹窗圆角和背景
    tool.setBackgroundRoundRounded(view.getParent(), {radius:40,})
    //mBottomSheetDialog.show();
}catch(e){
    console.verbose("设置对话框样式出错:"+e)
}
    //搜索函数
    function search(text) {
        var search_list = [];
        for (var i = 0; i < collection.length; i++) {
            var folder_list_data = collection[i]
            if ((folder_list_data.title).indexOf(text) >= 0) {
                search_list.push(folder_list_data);
            } else if ((folder_list_data.url).indexOf(text) >= 0) {
                search_list.push(folder_list_data)
            }
        }
        view.label.setDataSource(search_list)
        Refresh_label(false)
    }

    function Refresh_label(state) {
        let list_ = view.label
        let itemView;
        if (state == undefined) {
            state = (list_.getChildAt(0).remove.getVisibility() != 0)
        }
        for (var i = 0; i < list_.getChildCount(); i++) {
            itemView = list_.getChildAt(i)
            if (state) {
                itemView.remove.setVisibility(0)
            } else {
                itemView.remove.setVisibility(8)
            }
        }

    }
}

function add_c(list, i) {
    ui_add = ui.inflate(
        <vertical padding="10 0" >
            <text id="add_text" text="添加书签" gravity="center" margin="0 10" />
            <com.google.android.material.textfield.TextInputLayout
            id="edit_title"
            
            layout_width="match_parent"
            layout_height="wrap_content"
            >
            <EditText layout_width="match_parent" layout_height="wrap_content" textSize="18sp"
            singleLine="true"
            />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
        id="edit_url"
        layout_width="match_parent"
        layout_height="wrap_content"
        >
        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="18sp"
        singleLine="true"
        />
        </com.google.android.material.textfield.TextInputLayout>
        
        <com.google.android.material.textfield.TextInputLayout
        id="edit_icon"
        
        layout_width="match_parent"
        layout_height="wrap_content"
        >
        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="18sp"
        singleLine="true"
        />
        </com.google.android.material.textfield.TextInputLayout>
        
        </vertical>, null, false)
    var d_add = dialogs.build({
        type: 'app',
        customView: ui_add,
        positive: "添加",
        positiveColor: "#424242",
        negative: "取消",
        negativeColor: "#cc423232",
        wrapInScrollView: false
    }).on("positive", (dialog) => {
        let title = ui_add.edit_title.getEditText().getText().toString()
        let url = ui_add.edit_url.getEditText().getText().toString()
        let icon = ui_add.edit_icon.getEditText().getText().toString();
        if (url <= 5) {
            toastLog("地址不可为空")
            return
        }
        if (icon.length <= 5) {
            let colors = [
                "#96c24e", "#69a794", "#f8df72", "#c6e6e8", "#e9ccd3",
                "#2376b7", "#93d5dc", "#93b5cf", "#63bbd0", "#7cabb1",
                "#4f383e", "#2e317c", "#2d2e36", "#ffa60f", "#f9f4dc",
                "#f8ebe6", "#f0f5e5", "#ebb10d", "#e6d2d5", "#e3b4b8",
                "#d8e3e7", "#cfccc9", "#cf7543", "#cf4813", "#a4cab6",
                "#d2d97a", "#d1c2d3", "#c06f98", "#c3d7df", "#c0c4c3",
                "#bc84a8", "#add5a2", "#ad9e5f", "#a4aca7", "#497568",
                "#621d34", "#475164", "#619ac3", "#92b3a5", "#964d22",
            ]
            icon = colors[random(0, 39)]
        }
        if (list == undefined || i == "添加") {
            collection.push({
                icon: icon,
                title: title,
                url: url
            })
            //  collection = storages.create("configure").put("web_label")
        } else {
            list.icon = ui_add.edit_icon.getEditText().getText().toString();
            list.title = title;
            list.url = url;
            if (view != undefined && i != undefined) {
                let listView = view.label.getChildAt(i)
                listView.text.setText(list.title)
                listView.icon.attr("src", list.icon)
            }
        }
        storages.create("configure").put("web_label", collection)
    }).on("negative", (dialog) => {
        d_add.dismiss()
    })

    ui_add.edit_title.setHint("标题")
    ui_add.edit_url.setHint("地址")
    ui_add.edit_icon.setHint("图标")
    try{
    tool.setBackgroundRoundRounded(d_add.getWindow())
    }catch(e){
        console.verbose("设置对话框样式出错:"+e)
    }
    if (list != undefined) {
        d_add.setActionButton("positive", "确定");
        ui_add.add_text.setText("编辑书签")
        ui_add.edit_title.getEditText().setText(list.title.toString())
        ui_add.edit_url.getEditText().setText(list.url.toString())
        ui_add.edit_icon.getEditText().setText(list.icon.toString())
    }
    d_add.show()
}




var label_plug = {
    initialization: function() {
        initialization_()
    },
    add_label: function(list, i) {
        collection = storages.create("configure").get("web_label")
        add_c(list, i)
    },
    label_plug: function(callback_) {
        callback = callback_;
        if (collection == undefined || mBottomSheetDialog == undefined | view == undefined) {
            log("初始化标签...");
            initialization_()
        }
        collection = storages.create("configure").get("web_label")
        view.label.setDataSource(collection)
        mBottomSheetDialog.show();
    },
}
try {
    module.exports = label_plug;
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