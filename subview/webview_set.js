"ui";
//let mUtil = require('./prototype/drawable.js');
var theme;
try{
theme = require("../theme.js")
}catch(e){};

ui.statusBarColor(theme.bar);
require('../modules/widget-switch-se7en');
let tool = require("../modules/tool.js");
ui.layout(
    <frame id="frame" bg="#ffffff">
        <vertical fitsSystemWindows="true" bg="#eff0f4">
            <appbar>
                <toolbar id="toolbar" title="webview设置" bg="{{theme.bar}}">
               <card id="guanyu" h="*" marginRight="10" layout_gravity="right"  cardBackgroundColor="#00000000" cardCornerRadius="20dp"
                cardElevation="0dp"  foreground="?attr/selectableItemBackground" clickable="true">
                <img id="Module_warehouse"
                src="ic_account_circle_black_48dp"
                tint="#ffffff"
                margin="5" gravity="center"  
                w="80px" h="80px" />
            </card>
               </toolbar>
            </appbar>
            <frame>
                <card layout_gravity="center|top" marginBottom="5" w="*" marginLeft="0" marginRight="0" h="auto" cardCornerRadius="0dp" foreground="?attr/selectableItemBackgroundBorderless">
                    <ScrollView>
                        <vertical bg="#eff0f4">
                            <text text='常规' margin="10 5 10 0" h="35dp" id="text_bg"
                            gravity="center|left" textSize='13sp' textColor='{{theme.bar}}'>
                        </text>
                        
                        <card w="*" id="indx" h="*" gravity="center_vertical" bg="#eff0f4" >
                            <vertical>
                                <widget-switch-se7en id="homepage" text="设为主页" checked="false" padding="15 5 15 0" textSize="18sp"
                                margin="10 0" thumbSize='24' radius='24'/>
                                <text margin="25 0 20 5" textSize="12sp" text="启动应用时默认以webview为主界面，而不是PRTS辅助" gravity="bottom"/>
                            </vertical>
                        </card>
                        <card w="*" h="auto" cardCornerRadius="3dp"
                        cardElevation="0dp" id="home" bg="#eff0f4" foreground="?selectableItemBackground">
                        <vertical bg="#00000000">
                            <text text="主页地址" textSize="18sp" textColor="#000000" padding="25 5 15 0"/>
                            <text id ="home_url" margin="25 0 55 5" text="" gravity="bottom" textSize="12sp" />
                        </vertical>
                        
                        <text w="auto" h="auto" text="编辑" margin="30 0" layout_gravity="center|right" tint="#0d84ff" />
                    </card>
                        <card w="*" id="indx" h="*" gravity="center_vertical" bg="#eff0f4" >
                            <vertical>
                                <widget-switch-se7en id="h5rizhi" text="h5日志" checked="false" padding="15 5 15 0" textSize="18sp"
                                margin="10 0" thumbSize='24' radius='24'/>
                                <text margin="25 0 20 5" textSize="12sp" text="在日志界面中显示网页日志信息" gravity="bottom"/>
                            </vertical>
                        </card>
                </vertical>
            </ScrollView>
        </card>
    </frame>
    </vertical>
    </frame>
)
activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);

ui.toolbar.setNavigationOnClickListener({
    onClick: function() {
        ui.finish();
    },
});
/*
//创建指定大小的Drawable
let mDrawable = mUtil.create("返回", 25);

//标题颜色
ui.toolbar.setTitleTextColor(colors.parseColor("#000000"));
mDrawable.setTint(colors.parseColor('#000000'));

//更改返回键图标
activity.getSupportActionBar().setHomeAsUpIndicator(mDrawable);
*/
var web_set = storages.create("configure").get("web_set");
try{
if(!files.exists(files.path("./w_main.js"))){
    ui.indx.setVisibility(8)
}else{
    ui.guanyu.setVisibility(8)
}
}catch(e){}

ui.guanyu.click(()=>{
    let variable = "'ui';var theme = " + JSON.stringify(theme) + ";"; //require('./theme.js');";
    engines.execScript("about_ui", variable + "require('./activity/about.js');");
})
ui.home_url.setText(web_set.web_url);
ui.homepage.on("click", () => {
    if (ui.homepage.checked) {
        web_set.homepage = 2;
    } else {
        web_set.homepage = 1;
    }

    storages.create("configure").put("web_set", web_set);
    web_set = storages.create("configure").get("web_set")
})
ui.h5rizhi.on("click",(view)=>{
    web_set.h5rizhi = view.checked;
        storages.create("configure").put("web_set", web_set);
    web_set = storages.create("configure").get("web_set")
})
ui.home.on("click",()=>{
       ui_web_url = ui.inflate(
        <vertical padding="0 0" >
            <text id="add_text" text="设置为" gravity="center" margin="0 10" />
            
        <vertical id="input" margin="15 0 15 10">
        <com.google.android.material.textfield.TextInputLayout
        id="edit_url"
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
                <button id="ok" text="确认" style="Widget.AppCompat.Button.Borderless" w="auto" />
            </horizontal>
        </horizontal>
        </vertical>, null, false)

    d_add = dialogs.build({
        type: 'app',
        customView: ui_web_url,
        wrapInScrollView: false,
    })
    /*
    try{
    tool.setBackgroundRoundRounded(d_add.getWindow());
    }catch(e){}
    */
      //设置弹窗圆角和背景
      try{
        tool.setBackgroundRoundRounded(d_add.getWindow(), {radius:30,})
        //mBottomSheetDialog.show();
        }catch(e){
            console.verbose("设置对话框样式出错:"+e)
        }
    ui_web_url.edit_url.setHint("url，html")
    ui_web_url.edit_url.getEditText().setText(ui.home_url.getText())
    d_add.show()
    ui_web_url.ok.on("click", function() {
        let url = ui_web_url.edit_url.getEditText().getText().toString()
        if(url.startsWith("file://") == false&&url.indexOf(".html") > 0){
            url = "file://"+url;
        }
        web_set.web_url = url;
        storages.create("configure").put("web_set",web_set);
        ui.home_url.setText(url);
        d_add.dismiss();
    })
    ui_web_url.no.on("click",function(){
        d_add.dismiss()
    })
    
})
update_ui()

function update_ui() {
    ui.run(() => {
        if(web_set.homepage == 2){
            ui.homepage.checked = true;
        }
        if(web_set.h5rizhi) ui.h5rizhi.checked = true;
    })
}

