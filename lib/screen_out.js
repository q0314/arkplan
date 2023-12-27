auto();
importClass(android.view.Window);
importClass(android.view.WindowManager);
var test = false;
var win;
var set_up = storages.create("rest_screen").get("rest_screen", {
    main_switch: false,
    touch: true,
    suspend: {
        volume: "下",
        click: 5,
    }
})


if (test) {
    requestScreenCapture()
    setTimeout(function() {
        threads.start(function() {

            captureScreen("/sdcard/1.png");
            images.save(captureScreen(), "/sdcard/2.png")

        })
    }, 3000)
}

function suspension() {
    win = floaty.rawWindow(
        <frame id="parent" >
            <frame id="mask" gravity="center" bg="#ff0000"/>
            {/* <frame gravity="center" bg="#44fffccc"/>*/}
        </frame>
    );

    win.setSize(-1, -1);

    let parentParent = win.parent.parent //.parent.parent;
    setInterval(function() {}, 1000);
    ui.post(function() {
        let view = parentParent;
        let params = view.getLayoutParams();

        //params.flags = WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM;

        // | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        // params.flags |= TYPE_SYSTEM_ERROR;
        // params.flags = 4136;
        //  params.flags &= ~WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
        // inflate = LayoutInflater.from(this).inflate(R.layout.view_widow_layout, null);



        params.height = device.height // getScreenHeight(mService) + getStatusBarHeight(mService);
        /*
        params.flags =WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL//拦截触摸事件
                //  | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE//不拦截触摸事件
                  | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN//将window放置在整个屏幕之内,无视其他的装饰(比如状态栏)
                  | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS//允许window扩展值屏幕之外
                  | WindowManager.LayoutParams.FLAG_FULLSCREEN//当这个window显示的时候,隐藏所有的装饰物(比如状态栏)这个flag允许window使用整个屏幕区域
                 | WindowManager.LayoutParams.FLAG_SHOW_WALLPAPER//标记在其它窗口的LayoutParams.flags中的存在情况而不断地被调整
                 //  | WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY
                  | WindowManager.LayoutParams.MATCH_PARENT
                ;
                */
        /*
        params.flags = WindowManager.LayoutParams.MATCH_PARENT
            | WindowManager.LayoutParams.MATCH_PARENT
           | WindowManager.LayoutParams.TYPE_SYSTEM_ERROR
           | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
           |WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
            | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
            ;
            */
        //                    mParams.format = PixelFormat.TRANSLUCENT;// 支持透明
        //mParams.format = PixelFormat.RGBA_8888;l
        //        mParams.flags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;// 焦点

        params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS |
            WindowManager.LayoutParams.FLAG_FULLSCREEN |
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
            0x1000;
        if (set_up.touch) {
            params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        }

        /*
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE：全屏显示时保证尺寸不变。
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN：Activity全屏显示，状态栏显示在Activity页面上面。
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION：效果同View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION：隐藏导航栏
        View.SYSTEM_UI_FLAG_FULLSCREEN：Activity全屏显示，且状态栏被隐藏覆盖掉。
        View.SYSTEM_UI_FLAG_VISIBLE：Activity非全屏显示，显示状态栏和导航栏。
        View.INVISIBLE：Activity伸展全屏显示，隐藏状态栏。
        View.SYSTEM_UI_LAYOUT_FLAGS：效果同View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY：必须配合View.SYSTEM_UI_FLAG_FULLSCREEN和View.SYSTEM_UI_FLAG_HIDE_NAVIGATION组合使用，达到的效果是拉出状态栏和导航栏后显示一会儿消失。
        */


        windowManager = context.getApplicationContext().getSystemService(context.WINDOW_SERVICE);
        ui.run(function() {
            windowManager.removeView(view);
            windowManager.addView(view, params);
        });
    });
    
    
    if (set_up.suspend.click != false) {
        let i_click = threads.atomic(0),
            timer = false;
        win.mask.click(() => {
            i_click.getAndIncrement();
            if (i_click == set_up.suspend.click) {
                sign_out("click");
                return;
            } else if (timer == false) {
                timer = true;
                setTimeout(() => {
                    i_click = threads.atomic(0);
                    timer = false;
                }, 1500)
            }
        })
    }
    if (set_up.suspend.volume != false) {
        try{
        threads.start(function() {
            events.observeKey();
            events.on("key_down", function(keyCode, events) {

                if (set_up.suspend.volume == "上" && keyCode == keys.volume_up) {
                    sign_out("音量上键")
                    return
                } else if (set_up.suspend.volume == "下" && keyCode == 25) {
                    sign_out("音量下键")
                    return
                }

            });

        });
        }catch(e){
            log(e.stack)
        }
    }
}

function sign_out(value) {
    win.mask.attr("bg", "#55555555");
    setTimeout(function() {
        win.close();
        exit();
    }, 1000)
    console.verbose(value)
    toastLog("退出熄屏运行状态\n1秒后可操作屏幕")

}
var Rest_screen = {
    mask: function() {
        
        let Tips_tuku_ui = ui.inflate(
            <vertical id="parent">
                        
                        <card gravity="center_vertical" cardElevation="0dp" margin="0">
                            <img src="file://res/icon.png" w="50" h="30" margin="0"/>
                            <text text="熄屏运行" padding="5" textSize="20" gravity="center|left" textColor="#000000" marginLeft="50"/>
                            
                            
                        </card>
                        
                        <ScrollView>
                            <vertical>
                                <vertical padding="10 0" >
                                    <View bg="#f5f5f5" w="*" h="2" />
                                    <text id="Device_resolution" text="当前熄屏运行关闭方式：" marginTop="5"/>
                                    
                                    <text id="wxts" text="无" typeface="sans" padding="0 5" textColor="#000000" textSize="15sp" layout_gravity="center" />
                                </vertical>
                                <horizontal w="*" padding="-3" gravity="center_vertical">
                                    <button text="终止" id="exit" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1"  w="50"/>
                                    <button text="设置" id="set" textColor="#0d84ff" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1"  w="50"/>
                                    
                                    <button text="立即开始(5s)" id="start" textColor="#008577" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" w="50"/>
                                </horizontal>
                            </vertical>
                        </ScrollView>
                        
                    </vertical>);

        var Tips_tuku = dialogs.build({
            type: "foreground-or-overlay",
            customView: Tips_tuku_ui,
            wrapInScrollView: false,
            cancelable: false,
            canceledOnTouchOutside: false
        }).show();
        let _suspend = "";
        if (set_up.suspend.volume != false) {
            _suspend = "按下音量" + set_up.suspend.volume + "键退出";
        }
        if (set_up.suspend.click != false) {
            if (_suspend.length > 3) {
                _suspend += "\n连续点击屏幕" + set_up.suspend.click + "下退出";
            } else {
                _suspend += "连续点击屏幕" + set_up.suspend.click + "下退出";
            }
        }
        Tips_tuku_ui.wxts.setText(_suspend)

        var i_tnter = 5;
        var id_tnter = setInterval(function() {
            if (i_tnter >= 0) {
                i_tnter--;
            }
            ui.run(() => {
                if (i_tnter == 0) {
                    Tips_tuku_ui.start.setText("启动中..");
                    clearInterval(id_tnter);
                    Tips_tuku.dismiss()
                    suspension()
                } else {
                    Tips_tuku_ui.start.setText("立即开始(" + i_tnter + "s)")
                }

            })
        }, 1000)

        Tips_tuku_ui.start.on("click", function() {
            Tips_tuku.dismiss()
            suspension();
        })
        Tips_tuku_ui.set.on("click",function(){
            toastLog("暂时还没有内容");
        })
        Tips_tuku_ui.exit.on("click", function() {
            clearInterval(id_tnter);

            Tips_tuku.dismiss();
            exit()
        })
        //suspension()
    }
}
try {
    module.exports = Rest_screen;
} catch (err) {
    Rest_screen.mask()
    // suspension()
}