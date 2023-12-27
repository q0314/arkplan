importClass(android.content.DialogInterface);
importClass(android.graphics.drawable.GradientDrawable);
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);

function lzview(callback) {
    let ui_add = ui.inflate(
        <vertical padding="10 0" >
            <text id="add_text" text="矫正理智" margin="15 20" textSize="20sp" />
            <horizontal>
                <com.google.android.material.textfield.TextInputLayout
                    id="edit_lizhi" margin="10 0"
                    layout_weight="1"
                    layout_height="wrap_content">
                    <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
                        singleLine="true" inputType="number" />
                </com.google.android.material.textfield.TextInputLayout>
                <com.google.android.material.textfield.TextInputLayout
                    id="edit_lzsx"
                    layout_weight="1" margin="10 0"
                    layout_height="wrap_content">
                    <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
                        singleLine="true" inputType="number" text="135" />
                </com.google.android.material.textfield.TextInputLayout>
            </horizontal>
            <text margin="10 0" text="由于方舟并未提供可查询实时理智的API功能，所以需要手动修正理智液数量，或程序自动识别" />
        </vertical>, null, false)
    var d_add = dialogs.build({
        type: 'app',
        customView: ui_add,
        positive: "确定",
        positiveColor: "#424242",
        negative: "取消",
        negativeColor: "#cc423232",
        wrapInScrollView: false
    }).on("positive", (dialog) => {
        let lizhi = ui_add.edit_lizhi.getEditText().getText()
        let lzsx = ui_add.edit_lzsx.getEditText().getText()

        if (Number(lzsx) > 135) {
            toastLog("明日方舟目前最高理智上限是135\n超过此上限理智将无法继续回复")
            dialog.show()
            return
        }
        if (lizhi == "" || lzsx == "") {
            toastLog("当前剩余理智/理智上限不可为空")
            dialog.show()
            return
        }
        lizhi = Number(lizhi)

        if (lizhi > Number(lzsx)) {
            toastLog("剩余理智过高...不建议使用")
        }
        callback("已有理智", lizhi);
        callback("理智数", lizhi + "/" + lzsx);
    }).on("negative", (dialog) => {
        d_add.dismiss()
    }).on("show", (dialog) => {

        ui_add.edit_lizhi.setHint("输入剩余理智")
        ui_add.edit_lzsx.setHint("修改理智上限")
        ui_add.edit_lzsx.getEditText().setText(callback("上限", "get"))
        tool.setBackgroundRoundRounded(dialog.getWindow());
    }).show()

}

function ssbjview(callback) {
    let ssbjview = ui.inflate(
        <vertical padding="20 10" >
            {/**
            <horizontal padding="10 4" id="zdsb">
                <vertical layout_weight="1" >
                    <text text="(OCR)自动识别" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="每次脚本刷完关卡后，自动识别剩余理智数量" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                <Switch id="zdsbs" checked="false" layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" />
          
              <horizontal padding="10 4" id="gzbj" >
                  <vertical  layout_weight="1" >
                      <text text="公招便笺" textColor="#000000" textSize="16sp" textStyle="bold" />
                      <text text="显示公开招募聘用时间。该功能需要打开自动公开招募" textColor="#95000000" textSize="10sp" marginTop="2" />
                  </vertical>
                  <Switch id="gzbjs" checked="false"   layout_gravity="center"/>
              </horizontal> 
              <View bg="#666666" h="1" w="*"/>
             */}
            <horizontal padding="10 4" id="userinfo">

                <text text="接入森空岛" layout_gravity="left|center" textColor="#000000"
                    textSize="16sp" textStyle="bold" />
                <linear layout_width="0dp"
                    layout_weight="1">
                </linear>
                <text
                    id="text_userinfo"
                    layout_width="wrap_content"
                    layout_height="wrap_content"
                    layout_gravity="right|center"
                    layout_margin="10dp"
                    text="未登录"
                    textSize="13sp" />
            </horizontal>
            <View bg="#666666" h="1" w="*" />

            <horizontal padding="10 4" id="automatic_check">
                <vertical layout_weight="1" >
                    <text text="森空岛自动签到" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="打开明日计划或定时任务触发,详细的签到信息请查看侧边栏-运行日志" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                <Switch id="automatic_checks" checked="false" layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" />

            <horizontal padding="10 4" id="lztz" >
                <vertical layout_weight="1" >
                    <text text="实时理智通知栏常驻" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="开启理智提醒功能的通知栏常驻。间隔刷新时间：6分钟" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                <Switch id="lztzs" checked="false" layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" />
            <horizontal padding="10 4" id="dcyh" >
                <vertical layout_weight="1" >
                    <text text="关闭对该应用的电池优化" textColor="#000000" textSize="16sp" textStyle="bold" />
                    <text text="“实时便笺通知栏常驻”需要应用在后台运行，点击进入电池优化界面，选择无限制，并且在多任务界面锁定本软件。" textColor="#95000000" textSize="10sp" marginTop="2" />
                </vertical>
                <Switch id="dcyhs" checked="{{$power_manager.isIgnoringBatteryOptimizations()}}" layout_gravity="center" />
            </horizontal>
            <View bg="#666666" h="1" w="*" />

        </vertical>, null, false);
    //设置对话框

    var shezhi = dialogs.build({
        type: "app-or-overlay",
        customView: ssbjview,
        title: "实时便笺设置",
        titleColor: "#cc000000",
        wrapInScrollView: false,
        autoDismiss: false
    }).on("show", (dialog) => {

        tool.setBackgroundRoundRounded(dialog.getWindow());
    }).show()
    try {
        ssbjview.text_userinfo.setText(callback("用户名", "get"));
        ssbjview.lztzs.checked = callback("通知", "get");
        ssbjview.automatic_checks.checked = callback("自动签到", "get");
        // ssbjview.gzbjs.checked = callback("公招", "get");
    } catch (e) {
        console.error(e);
        toast(e)
    }
    ssbjview.userinfo.click((view) => {
        shezhi.dismiss();
        ssbjview.text_userinfo.setText("等待中");
        let user_results = callback("token","get");
        log(user_results)
     //   ssbjview.text_userinfo.setText(user_results)

    })


    ssbjview.lztz.click((view) => {
        ssbjview.lztzs.performClick();
    });

    ssbjview.lztzs.click((view) => {
        callback("通知", view.checked);
    });
    ssbjview.automatic_checks.click((view) => {

        if (callback("自动签到", view.checked) == false) {
            view.checked = false;
        }
    });
    ssbjview.automatic_check.click((view) => {
        ssbjview.automatic_checks.performClick();
    })
    /** 
       ssbjview.zdsbs.click((view) => {

        if (callback("自动识别", view.checked) == false) {
            view.checked = false;
        }
    });
    ssbjview.zdsb.click((view) => {
        ssbjview.zdsbs.performClick();
    })
          ssbjview.gzbj.click((view) => {
              ssbjview.gzbjs.performClick();
    
          });
    
          ssbjview.gzbjs.click((view) => {
              if (callback("公招", view.checked) == false) {
                  view.checked = false;
              };
          })
          */
    ssbjview.dcyh.click(() => ssbjview.dcyhs.performClick())
    ssbjview.dcyhs.click((view) => {
        $power_manager.requestIgnoreBatteryOptimizations()
    })
}


try {
    exports.ssbjview = ssbjview;
    exports.lzview = lzview;
} catch (e) {
    ssbjview()
}