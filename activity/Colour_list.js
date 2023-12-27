"ui";

ui.layout(
    <frame>
        <vertical>
            <appbar>
                <toolbar id='toolbar' title='中国颜色' bg='#926e6d'/>
            </appbar>
            <card cardCornerRadius="10"cardElevation="0">
                <horizontal w="*"h="auto"marginRight="0">
                    <SearchView id="search" w="*" h="50" margin="5 0" padding="10 0"/>
                </horizontal>
            </card>
            <list id="list" w="*" marginBottom="20" >
                <card w="*" h="50" margin="5 1" cardCornerRadius="10dp"
                cardElevation="3dp" foreground="?selectableItemBackground">
                <horizontal gravity="center_vertical">
                    <img src="{{hex}}" w="40" h="40" margin="15 0" layout_gravity="right|center"circle="true"/>
                    
                    <vertical h="auto" w="0" layout_weight="1">
                        <text id="age" textSize="16sp" text="{{name}}" layout_gravity="center"/>
                    </vertical>
                    <button id="按钮2" text="复制" margin="-10 0" style="Widget.AppCompat.Button.Borderless.Colored"/>
                    <button id="按钮" text="确认选择" style="Widget.AppCompat.Button.Borderless.Colored" />
                </horizontal>
                
            </card>
            {/*  <View bg="#00BFFF" h="1" w="auto"/>*/}
            
        </list>
    </vertical>
    </frame>
);

ui.statusBarColor('#926e6d');
activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function() {
        ui.finish();
    },
});

//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("使用说明");
    menu.add("关于中国颜色");
});
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "关于中国颜色":
            app.openUrl("http://www.mydaily2020.com/colors/index.html")
            break;
        case "使用说明":
            alert("使用说明", "点击颜色卡片可在上边标题栏预览\n点击颜色卡片中的复制可复制颜色码\n点击颜色卡片中的确认选择可配置到其他页面");
            break
    }
    e.consumed = true;
});


var items;
try {
    items = JSON.parse(files.read("../colors.json"));
} catch (err) {
    items = JSON.parse(files.read("../lib/prototype/colors.json"));
}
ui.list.setDataSource(items);

ui.list.on("item_click", function(item, i, itemView, listView) {
    ui.statusBarColor(item.hex);
    ui.toolbar.attr("bg", item.hex);
    toast("名称：" + item.name + "，颜色码: " + item.hex);
});

ui.list.on("item_bind", function(itemView, itemHolder) {
    itemView.按钮2.on("click", function() {
        let item = itemHolder.item;
        toast("名称：" + item.name + "，颜色码: " + item.hex);
        setClip(item.hex);
    });
    itemView.按钮.on("click", function() {
        let item = itemHolder.item;
        toast("更换成功！\n名称：" + item.name + "，颜色码: " + item.hex);
        var theme = storages.create('themes').get('theme');
        theme.bar = item.hex
        storages.create('themes').put('theme',theme);
        exit();
    });
})
//输入法
activity.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
//文件搜索
//ui.search.setIconified(false);
ui.search.setIconifiedByDefault(false)
ui.search.setQueryHint("搜索颜色码/名称..."); //搜索的hint

ui.search.setOnQueryTextListener({
    onQueryTextChange: function(text) {
        if (text.length == 0) {
            ui.list.setDataSource(items);
        } else {
            search(text);
        }
        return false
    },
    onQueryTextSubmit: function(text) {
        //false关闭键盘，true则否
        return false
    }
});

//搜索函数
function search(text) {
    var search_list = [];
    for (var i = 0; i < items.length; i++) {
        var folder_list_data = items[i]
        if ((folder_list_data.name).indexOf(text) >= 0) {
            search_list.push(folder_list_data)
        }
        if ((folder_list_data.hex).indexOf(text) >= 0) {
            search_list.push(folder_list_data)
        }
    }
    ui.list.setDataSource(search_list);
}