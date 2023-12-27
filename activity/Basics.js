"ui";
importClass(android.graphics.Color);
let tool = require("../modules/tool.js");
var packageName = context.getPackageName();


var theme = require("../theme.js");
const language = theme.getLanguage("basics");
ui.statusBarColor(theme.bar);

var setting;
setting = tool.readJSON("configure");

require('../modules/widget-switch-se7en');
let {
    dp2px,
    createShape
} = require('../modules/__util__.js');
let BottomWheelPicker = require('../subview/BottomWheelPicker.js').build({
    positiveTextColor: "#FFFFFF",
    positiveBgColor: theme.bar,
    positivestrokeColor: theme.bar,
})
let ocr_plugin = {
    "MlkitOCR": require('../modules/mlkitocr.js'),
    "XiaoYueOCR": require('../modules/xiaoyueocr.js')
}
var package_path = context.getExternalFilesDir(null).getAbsolutePath() + "/";

let sto_mod = storages.create("modular");
let mod_data = sto_mod.get("modular", []);

var storage = storages.create("time");
var password = storage.get("password");
let edition;
if (!files.exists("../c_main.js")) {
    edition = "c_"
} else {
    edition = "f_"
}
function zoom(x) {
    return Math.floor((device.width / 1080) * x);
};
//main()
//w="{{zoom(800)}}px" 改 w="{{zoom(830)}}"
//function main() {

ui.layout(
    <vertical id='exit'>
        <appbar>
            <toolbar id='toolbar' title='高级设置' bg='{{theme.bar}}' w="*">


            </toolbar>

        </appbar>
        <frame>
            <ScrollView>
                <vertical>
                    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                        cardElevation="5dp" gravity="center_vertical"  >
                        <vertical>
                            <text text='运行配置' margin="10 5 10 0" h="35dp" id="text_bg"
                                gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                            </text>



                            <horizontal margin="10 0" padding="15 5 1 5" gravity="center">
                                <vertical layout_weight="1" >
                                    <text text="{{language['button-pause']}}" textColor="black" textSize="18sp" />
                                    <text text="{{language['button-pause-explain']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <TextView id="button_pause" padding="5 5" textSize="15sp"
                                    margin="10 0" textColor="black" />
                            </horizontal>

                            <horizontal margin="10 0" padding="15 5 1 5" id="auto_allow_screenshots_" >
                                <vertical layout_weight="1" >
                                    <text text="{{language['auto-allow-screenshots']}}" textColor="black" textSize="18sp" />
                                    <text text="{{language['auto-allow-screenshots-explain']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="auto_allow_screenshots" checked="{{setting.autoAllowScreen}}" layout_gravity="center" 
                                padding="5 5" textSize="18sp"  margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>


                            <horizontal margin="10 0" padding="15 5 1 5" id="identify_unusual_pauses_" >
                                <vertical layout_weight="1" >
                                    <text text="识别异常超时暂停" textColor="black" textSize="18sp" />
                                    <text text="程序在6分钟内,剿灭为35分钟.无法判断识别当前前面,或在当前界面连续识别到同一内容50次则暂停程序并返回桌面，有效防止突发意外情况使程序无法识别判断界面，导致设备一直亮屏，温度过高" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="identify_unusual_pauses" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="agent" text="代理失误放弃行动" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="agenttxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>

                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="gmvp" text="自动关闭媒体音量" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="gmvptxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>
                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="woie" text="启用剿灭基建收菜" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="woietxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>
                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="proxy_card_check" text="剿灭优先使用代理卡" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />

                            </card>
                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="olrs" text="PRTS辅助记录汇报" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="olrstxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>

                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="qetj" text="企鹅物流数据统计" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="qetjtxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>
                            <card w="*" id="indxj" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="jsjt" text="汇报上传企鹅物流" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="jsjttxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>
                            <card w="*" id="indx7" h="40" foreground="?selectableItemBackground">
                                <widget-switch-se7en id="dili" text="低电量暂停辅助" checked="false" padding="15 10 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' gravity="top|center_vertical"
                                    radius='24' layout_weight="1" />
                                <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
                                    <img id="electrictxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                                <linear>
                                    <input id="electric" inputType="number" hint="" lines="1" w="*" margin="30 35 30 0" />
                                </linear>
                            </card>




                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="home" text="任务结束后返回桌面" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />

                            </card>
                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="gfcm" text="确认防沉迷框" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="gfcmtxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>
                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="vibration" text="启用震动反馈" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="vibrationtxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>
                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="games" text="自动启动方舟" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                                <frame layout_gravity="right" w="{{zoom(330)}}px" >
                                    <img id="gamestxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                            </card>

                            <horizontal margin="10 0" padding="15 5 1 5" gravity="center">
                                <vertical layout_weight="1" >
                                    <text text="{{language['OCRExtensions-type']}}" textColor="black" textSize="18sp" />
                                    <text text="{{language['OCRExtensions-explain']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <TextView id="OCRExtensions_type" padding="5 5" textSize="15sp"
                                    margin="10 0" textColor="black" />
                            </horizontal>
                            <horizontal margin="10 0" padding="15 5 1 5" id="OCRExtensions_" gravity="center">
                                <vertical layout_weight="1" >
                                    <text text="{{language['OCRExtensions']}}" textColor="black" textSize="18sp" />
                                </vertical>
                                <widget-switch-se7en id="OCRExtensions" layout_gravity="center" padding="5 5"
                                    margin="10 0" thumbSize='24' radius='24' />

                            </horizontal>


                        </vertical>
                    </card>


                    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                        cardElevation="5dp" gravity="center_vertical"  >
                        <vertical>
                            <text text='高级功能' margin="10 5 10 0" h="35dp" id="text_bg"
                                gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                            </text>
                            <card w="*" id="indx2" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="sysm" text="自启动无障碍服务" checked="false" padding="15 5 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </card>

                            <card w="*" id="indxu" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="getu" text="使用高级权限截图" checked="false"
                                    padding="25 10 25 5" textSize="18sp"
                                    thumbSize='24' radius='24' gravity="top|center_vertical" />
                                <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
                                    <img id="getutxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                                <radiogroup margin="25 0 10 0" id="gets" visibility="gone"
                                    gravity="bottom" orientation="horizontal">
                                    <radio id="Shizuku" text="Shizuku授权" w="auto" />
                                    <radio id="root" text="root授权" w="auto" h="auto" />
                                </radiogroup>
                            </card>

                            <card w="*" id="indxu" h="40" gravity="center_vertical"  >
                                <widget-switch-se7en id="xpyx" text="启用熄屏运行模块" checked="false"
                                    padding="25 10 25 5" textSize="18sp"
                                    thumbSize='24' radius='24' gravity="top|center_vertical" />
                                <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
                                    <img id="xpyxtxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>

                            </card>

                            <card w="*" id="indxc" h="40" foreground="?selectableItemBackground">
                                <widget-switch-se7en id="custom" text="导入自定义执行模块" checked="false" padding="15 10 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' gravity="top|center_vertical"
                                    radius='24' layout_weight="1" />
                                <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
                                    <img id="customtxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                                <linear>
                                    <input id="input_c" gravity="bottom" visibility="gone" hint="输入主js模块路径，回车  或→" lines="1" margin="30 35 0 0" layout_weight="1" />
                                    <button id="input_file3" text="选择文件" margin="0 35 5 0" style="Widget.AppCompat.Button.Borderless.Colored" />
                                </linear>
                            </card>
                            <card w="*" id="indx6" h="40" foreground="?selectableItemBackground">
                                <widget-switch-se7en id="gbyy" text="导入关闭应用模块" checked="false" padding="15 10 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' gravity="top|center_vertical"
                                    radius='24' layout_weight="1" />
                                <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
                                    <img id="gbyytxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                                <linear>
                                    <input id="inputgb" gravity="bottom" visibility="gone" hint="输入主js模块路径，回车  或→" lines="1" margin="30 35 0 0" layout_weight="1" />
                                    <button id="input_file" text="选择文件" margin="0 35 5 0" style="Widget.AppCompat.Button.Borderless.Colored" />
                                </linear>
                            </card>
                            <card w="*" id="indx4" h="40" foreground="?selectableItemBackground">
                                <widget-switch-se7en id="jjhb" text="导入基建换班模块" checked="false" padding="15 10 15 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' gravity="top|center_vertical"
                                    radius='24' layout_weight="1" />
                                <frame layout_gravity="right|center_horizontal" w="{{zoom(330)}}px" h="35" marginTop="5">
                                    <img id="jjhbtxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9" />
                                </frame>
                                <linear>
                                    <input id="inputd2" gravity="bottom" visibility="gone" hint="输入主js模块路径，回车  或→" lines="1" margin="30 35 0 0" layout_weight="1" />
                                    <button id="input_file2" text="选择文件" margin="0 35 5 0" style="Widget.AppCompat.Button.Borderless.Colored" />
                                </linear>
                            </card>


                        </vertical>
                    </card>



                    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                        cardElevation="5dp" gravity="center_vertical"  >
                        <vertical>
                            <text text='界面设置' margin="10 5 10 0" h="35dp" id="text_bg2"
                                gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                            </text>

                            <horizontal margin="10 0" padding="15 5 1 5" id="xlkz_" >
                                <vertical layout_weight="1" >
                                    <text text="主页设置行动理智" textColor="black" textSize="18sp" />
                                    <text text="在主页PRTS辅助配置界面显示设置行动理智次数设置输入框，重启应用后生效" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="xlkz" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>


                            <horizontal margin="10 0" padding="15 5 1 5" id="page_theme_" >
                                <vertical layout_weight="1" >
                                    <text text="自定义页面主题色" textColor="black" textSize="18sp" />
                                    <text text="关闭开关还原页面默认主题色" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="page_theme" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <linear id="inputd_tecr_list" visibility="gone" marginTop="-5" >
                                <input id="inputd_tecr" gravity="bottom" hint="输入16进制颜色码，回车  或→" marginLeft="30" layout_weight="1" />
                                <button id="inputd_tecr_b" text="颜色列表" style="Widget.AppCompat.Button.Borderless.Colored" />
                            </linear>


                            <horizontal margin="10 0" padding="15 5 1 5" id="floating_theme_" >
                                <vertical layout_weight="1" >
                                    <text text="设置悬浮窗主题色" textColor="black" textSize="18sp" />
                                    <text text="左边为悬浮窗背景色，中间为悬浮窗图标颜色，右边为悬浮窗字体颜色，手动关闭可还原初始状态,不懂具体如何输入请百度十六进制颜色码" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="floating_theme" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <horizontal id="floating_theme_list" margin="30 -5 30 0" gravity="bottom" visibility="gone">
                                <input id="bg" hint="#dcdcdc" lines="1" layout_weight="1" />
                                <input id="theme" hint="#dcdcdc" lines="1" layout_weight="1" />
                                <input id="toast" hint="#dcdcdc" lines="1" layout_weight="1" />
                            </horizontal>

                            <horizontal margin="10 0" padding="15 5 1 5" id="offset_" >
                                <vertical layout_weight="1" >
                                    <text text="悬浮窗随机偏移" textColor="black" textSize="18sp" />
                                    <text text="在一定范围内随机移动位置(尽量不挡到图标,影响PRTS辅助识别屏幕),重启悬浮窗生效,主要用于防止OLED屏烧屏,不过还是建议使用熄屏运行模块" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="offset" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <horizontal margin="10 0" padding="15 5 1 5" id="front_display_check_" >
                                <vertical layout_weight="1" >
                                    <text text="悬浮窗前台显示白名单" textColor="black" textSize="18sp" />
                                    <text text="悬浮窗操作面板仅在已配置的应用中显示,未配置的一律视为黑名单,悬浮窗操作面板不会显示在黑名单应用中,建议添加系统桌面包名方便使用" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <text id="front_display_add" text="增加" textColor="#00ff00" padding="6 4" textSize="10" layout_gravity="center" marginLeft="10" />

                                <widget-switch-se7en id="front_display_check" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <list id="front_display_list" visibility="gone" bg="#00000000"   >
                                <vertical h="auto" w="*" margin="15 0" padding="15 5" >
                                    <text text="{{this.app_name}}" textSize="16" maxLines="1" />
                                    <text text="{{this.app_package}}" textSize="14" maxLines="1" />
                                    <View bg="#dcdcdc" h="1" w="auto" layout_gravity="bottom" />
                                </vertical>


                            </list>

                            <horizontal margin="10 0" h="40">
                                <text id="valueB" w="auto" layout_gravity="center" text="设置悬浮窗大小 75" padding="15 5 1 5" textColor="black" textSize="18sp" />
                                <seekbar id="seekbar" paddingLeft="-120" w="*" h="*" max="100" progress="75" secondaryProgress="75" />
                            </horizontal>




                        </vertical>
                    </card>

                    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                        cardElevation="5dp" gravity="center_vertical"  >
                        <vertical>
                            <text text='BUG修复' margin="10 5 10 0" h="35dp" id="text_bg3"
                                gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                            </text>

                            <horizontal margin="10 0" padding="15 5 1 5" id="setScreenMetrics_" >
                                <vertical layout_weight="1" >
                                    <text text="自动放缩坐标" textColor="black" textSize="18sp" />
                                    <text text="显示代理点击成功但没有任何操作时，可以关闭试试，小米华为手机请重启系统再来尝试。原理是使用Autojs的setScreenMetrics()设置脚本坐标点击所适合的屏幕宽高。 如果脚本运行时，屏幕宽度不一致会自动放缩坐标。 这个功能可以设置屏幕上坐标点击的等比缩放效果。好像是没啥作用的，我要不要删除这个功能呢" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="setScreenMetrics" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <horizontal margin="10 0" padding="15 5 1 5" id="image_monitor_" >
                                <vertical layout_weight="1" >
                                    <text text="{{language['image-monitoring']}}" textColor="black" textSize="18sp" />
                                    <text text="{{language['image-monitoring-explain']}}" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="image_monitor" checked="{{setting.image_monitor}}" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <horizontal margin="10 0" padding="15 5 1 5" id="image_memory_manage_" >
                                <vertical layout_weight="1" >
                                    <text text="图片内存管理" textColor="black" textSize="18sp" />
                                    <text text="图片内存资源管理，尽可能防止图片未回收导致内存泄露。应用崩溃" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="image_memory_manage" checked="{{setting.image_memory_manage}}"
                                layout_gravity="center" padding="5 5" textSize="18sp" margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                            <horizontal margin="10 0" padding="15 5 1 5" id="volume_fixes_" >
                                <vertical layout_weight="1" >
                                    <text text="修复音量异常" textColor="black" textSize="18sp" />
                                    <text text="修复部分机型使用自启动方舟后音量异常" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="volume_fixes" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>



                            <horizontal margin="10 0" padding="15 5 1 5" id="compatible_simulator_tablet_" >
                                <vertical layout_weight="1" >
                                    <text text="兼容模拟器平板版" textColor="black" textSize="18sp" />
                                    <text text="兼容模拟器平板版分辨率, 需选择设备分辨率与图库分辨率相近的，例：720x1280用图库1280x720，1080x1920用图库1920x1080,使用与设备分辨率相反的图库分辨率即可。（推荐雷电、MuMu12、逍遥、夜神）模拟器. 出现悬浮窗过大的问题请关闭该功能" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="compatible_simulator_tablet" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>
                        </vertical>
                    </card>

                    {/*  <card w="*" id="indx2" margin="10 3 10 3" h="45" cardCornerRadius="10"
    cardElevation="5dp" gravity="center_vertical"  >
    <widget-switch-se7en id="syqk" text="查看使用情况" checked="false" padding="15 5 15 5" textSize="18sp"
    thumbSize='24'
    radius='24'/>
    <frame layout_gravity="right" w="{{zoom(330)}}px" >
        <img id="syqktxt" src="@drawable/ic_error_black_48dp" w="28sp" tint="#A9a9a9"/>
    </frame>
    </card>*/}

                    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                        cardElevation="5dp" gravity="center_vertical"  >
                        <vertical>
                            <text text='应用权限' margin="10 5 10 0" h="35dp" id="text_bg4"
                                gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                            </text>


                            <horizontal margin="10 0" padding="15 5 1 5" id="front_desk_service_" >
                                <vertical layout_weight="1" >
                                    <text text="前台通知服务" textColor="black" textSize="18sp" />
                                    <text text="必要权限，用于保持应用在后台运行，需要时会自动开关,无需关心" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="front_desk_service" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' checked="{{$settings.isEnabled('foreground_service')}}" />
                            </horizontal>

                            <horizontal margin="10 0" padding="15 5 1 5" id="ignore_battery_ptimization_" >
                                <vertical layout_weight="1" >
                                    <text text="忽略电池优化" textColor="black" textSize="18sp" />
                                    <text text="为保障应用可以在后台运行,点击进入电池优化界面,选择无限制,并且在多任务界面锁定本应用(后台任务上锁),有无障碍异常/系统杀应用/应用闪退的情况时，请尝试" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="ignore_battery_ptimization" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' checked="{{$power_manager.isIgnoringBatteryOptimizations()}}" />
                            </horizontal>
                            <horizontal margin="10 0" padding="15 5 1 5" id="self_starting_" >
                                <vertical layout_weight="1" >
                                    <text text="允许自启动" textColor="black" textSize="18sp" />
                                    <text text="有无障碍异常/杀应用/应用闪退的情况时，请打开尝试, 是否已开启请以系统设置显示为准,程序暂无方法校验是否已打开" textColor="#95000000" textSize="10sp" marginTop="2" />
                                </vertical>
                                <widget-switch-se7en id="self_starting" layout_gravity="center" padding="5 5" textSize="18sp"
                                    margin="10 0" thumbSize='24' radius='24' />
                            </horizontal>

                        </vertical>
                    </card>

                    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                        cardElevation="5dp" gravity="center_vertical"  >
                        <vertical>
                            <text text='开发相关' margin="10 5 10 0" h="35dp" id="text_bg4"
                                gravity="center|left" textSize='16sp' textColor='{{theme.bar}}'>
                            </text>

                            <card w="*" id="cett" h="40" foreground="?selectableItemBackground">
                                <text text="开发人员代码测试" padding="15 8 15 5" textSize="18sp"
                                    margin="10 0" textColor="#000000" />
                            </card>
                            <card w="*" id="gljb" h="40" foreground="?selectableItemBackground">
                                <text text="管理运行脚本"  padding="15 8 15 5" textSize="18sp"
                                    margin="10 0" textColor="#000000" />
                            </card>


                        </vertical>
                    </card>
                    {/*<card w="*" id="indx2" margin="10 3 10 3" h="45" cardCornerRadius="10"
    cardElevation="5dp" gravity="center_vertical"  >
    <widget-switch-se7en id="adbc" text="启用ADB点击" checked="false" padding="15 5 15 5" textSize="18sp"
    thumbSize='24'
    radius='24'/>
    <text padding="15 0 0 0" textSize="12" gravity="bottom" text="显示代理点击成功但是没有任何操作时启用" textColor="#808080"/>
    </card>*/}

                    <vertical padding="0 15">
                    </vertical>
                </vertical>
            </ScrollView>

        </frame>
    </vertical>
)

ui.proxy_card_check.click((view) => {
    tool.writeJSON("proxy_card", view.checked)
})
ui.front_display_check.click((view) => {
    ui.front_display_list.setVisibility(view.checked ? 0 : 8);
    if (view.checked) {
        if (!setting.front_display_list || setting.front_display_list.length == 0) {
            setting.front_display_list = [{
                "app_name": "明日方舟",
                "app_package": "com.hypergryph.arknights"
            }, {
                "app_name": "明日方舟(B服)",
                "app_package": "com.hypergryph.arknights.bilibili"
            }, {
                "app_name": "明日方舟(台服)",
                "app_package": "tw.txwy.and.arknights"
            }, {
                "app_name": "系统桌面(MIUI)",
                "app_package": "com.miui.home"
            }]
            tool.writeJSON("front_display_list", setting.front_display_list)
        }
    }
    tool.writeJSON("front_display", view.checked);
})

ui.front_display_list.on("item_long_click", function (e, item, i, itemView, listView) {
    dialogs.build({
        type: "app",
        title: "确定要删除 " + item.app_package + " 吗？",
        positive: "确定",
        negative: "取消"
    }).on("positive", () => {
        setting.front_display_list.splice(i, 1);
        tool.writeJSON("front_display_list", setting.front_display_list);
    }).show()

    e.consumed = true;
});

ui.front_display_add.click((view) => {
    var front_display_add_view = ui.inflate(
        <frame bg="#00eff0f4" >
            <vertical id="c" >


                <horizontal margin="25 20">

                    <text id="title" w="auto" h="auto" lines="1" text="新增应用白名单" textSize="20sp" textColor="#000000" layout_gravity="center|left" />
                    <text id="select_from_installed" w="auto" h="auto" lines="1" text="从已安装的列表中选择" textSize="10sp" padding="6 3" marginLeft="10" layout_gravity="center|left" />

                </horizontal>
                <vertical id="input" margin="35 0 35 10">
                    <com.google.android.material.textfield.TextInputLayout
                        id="app_name"
                        layout_width="match_parent"
                        layout_height="wrap_content"
                    >
                        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="18sp"
                            singleLine="true"
                        />
                    </com.google.android.material.textfield.TextInputLayout>

                    <com.google.android.material.textfield.TextInputLayout
                        id="app_package"
                        layout_width="match_parent"
                        layout_height="wrap_content"
                    >
                        <EditText layout_width="match_parent" layout_height="wrap_content" textSize="18sp"
                            singleLine="true"
                        />
                    </com.google.android.material.textfield.TextInputLayout>
                </vertical>
                <horizontal gravity="right" w="*" margin="0 0 5 5" >
                    <button id="no" text="取消" style="Widget.AppCompat.Button.Borderless" w="auto" />
                    <button id="ok" text="确认" style="Widget.AppCompat.Button.Borderless" w="auto" />
                </horizontal>
            </vertical>

        </frame>
    );
    var front_display_add_dialog = dialogs.build({
        type: "app",
        customView: front_display_add_view,
        wrapInScrollView: false
    }).show();
    tool.setBackgroundRoundRounded(front_display_add_dialog.getWindow())

    front_display_add_view.select_from_installed.setBackground(createShape(3, 0, 0, [5, "#00ff00"]))

    front_display_add_view.app_name.setHint("应用名称");
    front_display_add_view.app_package.setHint("应用包名");
    front_display_add_view.ok.click((view) => {
        let app_name = front_display_add_view.app_name.getEditText().getText().toString()
        let app_package = front_display_add_view.app_package.getEditText().getText().toString()
        if (app_name.length < 1) {
            front_display_add_view.app_name.setError("应用名称不可为空");
            return
        }
        if (app_package.length < 1) {
            front_display_add_view.app_package.setError("应用包名不可为空");
            return
        }
        setting.front_display_list.push({
            "app_name": app_name,
            "app_package": app_package
        })
        tool.writeJSON("front_display_list", setting.front_display_list)
        front_display_add_dialog.dismiss();
    });
    front_display_add_view.no.click((view) => {
        front_display_add_dialog.dismiss();
    });
    front_display_add_view.select_from_installed.click((view) => {
        toastLog("暂时还没有内容");
    });

})

ui.offset.click((view) => {
    tool.writeJSON("offset", view.checked)
})
ui.offset_.click((view) => {
    ui.offset.performClick();
})
ui.agent.on("click", (checked) => {
    tool.writeJSON("agent", ui.agent.checked);
    if (!ui.agent.checked) {
        tool.dialog_tips("代理失误放弃行动", "•你已关闭该功能，PRTS辅助将在代理指挥出现失误时继续结算获得部分奖励，以二星评价结算");
    } else {
        tool.dialog_tips("代理失误放弃行动", "•PRTS辅助将在代理指挥出现失误时放弃行动，重新开始代理，需消耗1理智");
    }
});
ui.agenttxt.on("click", () => {
    tool.dialog_tips("代理失误放弃行动", "•开启：\nPRTS辅助将在代理指挥出现失误时放弃行动，重新开始代理，需消耗1理智\n•关闭：\nPRTS辅助将在代理指挥出现失误时继续结算获得部分奖励，以二星评价结算");

})

ui.sysm.click((view) => {
    let sysmui = ui.inflate(
        <vertical id="parent">
            <frame>
                <ScrollView>
                    <vertical>
                        <horizontal margin="0" bg="#00000000">
                            <img src="file://res/icon.png" w="50" h="30" margin="0 5" />
                            <text text="安全系统设置权限管理" layout_gravity="left|center_vertical" textColor="#000000" />
                            <horizontal w="*" h="*" gravity="right" clickable="true" >
                                <img id="exit" src="@drawable/ic_clear_black_48dp" layout_gravity="center" w="35" height="35" padding="5" marginRight="5" foreground="?selectableItemBackground" />
                            </horizontal>
                        </horizontal>
                        <linear gravity="center" margin="0 -2">
                            <View bg="#f5f5f5" w="*" h="2" />
                        </linear>
                        <vertical padding="10 0" >
                            <text id="wxts" typeface="sans" textColor="#000000" textSize="13sp" />
                            <text id="wxts_s" w="*" h="*" padding="5" typeface="sans" textColor="#3282fa" textSize="13sp" enabled="true" focusable="true" longClickable="true" />
                        </vertical >


                        <vertical id="grant" marginBottom="5">
                            <card w="*" id="root" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" foreground="?selectableItemBackground" >
                                <vertical margin="10 5" >
                                    <text text="ROOT授权" textSize="22sp" textColor="#000000" />
                                    <text id="root_txt" text="使用root权限获取安全系统设置权限" textSize="13sp" />
                                </vertical>
                            </card>
                            <card w="*" id="Shizuku" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" foreground="?selectableItemBackground" >
                                <vertical margin="10 5" >
                                    <text text="Shizuku授权" textSize="22sp" textColor="#000000" />
                                    <text id="Shizuku_txt" text="使用Shizuku应用获取安全系统设置权限，详情查看官网：https://shizuku.rikka.app/zh-hans/" autoLink="web" textSize="13sp" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />
                                </vertical>
                            </card>

                            <card w="*" id="indx2" h="*" cardElevation="5" cardCornerRadius="5" margin="10 5" >
                                <vertical margin="10 5" >
                                    <horizontal>
                                        <text id="adb" text="ADB授权" textSize="22sp" textColor="#000000" />
                                        <horizontal w="*" h="*" gravity="right|center_vertical">
                                            <text id="adb_s" text="推荐" textColor="#00ff00" padding="6 4" textSize="12" marginRight="10" />
                                        </horizontal>
                                    </horizontal>
                                    <text id="adb_txt" autoLink="web" text="使用adb执行相关命令获取安全系统设置权限，ADB调试方式多种多样，详情B站/百度 ADB使用。或查看qq频道 https://pd.qq.com/s/2k84bkyzr?shareSource=5 /B站 https://b23.tv/utHN8cE 关于自启动无障碍教程视频。安卓11 / OTG均可授权" textSize="13sp" textIsSelectable="true" focusable="true" />
                                </vertical>
                            </card>
                        </vertical>
                    </vertical>
                </ScrollView>
            </frame>
        </vertical>);

    var sysm_b = dialogs.build({
        type: "app",
        customView: sysmui,
        wrapInScrollView: false
    }).on("dismiss", () => {
        tool.checkPermission("android.permission.WRITE_SECURE_SETTINGS") ? ui.sysm.checked = true : ui.sysm.checked = false;
    }).show()
    sysmui.adb_s.setBackground(createShape(3, 0, 0, [5, "#00ff00"]))
    if (!view.checked) {
        sysmui.grant.setVisibility(8);
        sysmui.wxts.setText("取消授权安全系统设置权限方式：\n1.卸载本应用，重新安装， 2.执行下方ADB相关命令")
        sysmui.wxts_s.setText("adb shell pm revoke " + packageName + " android.permission.WRITE_SECURE_SETTINGS")
    } else {

        let shellScript = 'adb shell pm grant ' + packageName + ' android.permission.WRITE_SECURE_SETTINGS'

        sysmui.wxts.setText("自启动无障碍服务需要授权明日计划安全系统设置权限，请点击/使用以下方式授权，adb授权命令(点击复制)：")
        sysmui.wxts_s.setText(shellScript)
    }
    sysmui.wxts_s.click((view) => {
        setClip(view.getText())
        toastLog("授权命令已复制到剪贴板")
    })
    sysmui.root.click(() => {
        if ($shell.checkAccess("root")) {
            if (shell("pm grant " + packageName + " android.permission.WRITE_SECURE_SETTINGS", {
                root: true,
            }).code == 0) {
                toastLog("root授权安全系统设置权限成功");

            } else {
                toastLog("请先确认是否已授权明日计划ROOT权限")
            };
            sysm_b.dismiss()
        } else {
            toastLog("请先确认设备是否拥有ROOT权限")
        }
    })
    sysmui.Shizuku.click(() => {
        if ($shell.checkAccess("adb")) {
            shell("pm grant " + context.getPackageName() + " android.permission.WRITE_SECURE_SETTINGS", {
                adb: true,
            });
            toastLog("ADB授权安全系统设置权限成功");
            sysm_b.dismiss()
        } else {
            toastLog("请先确认是否已授权明日计划ADB或Shizuku 权限")
        }
    })
    sysmui.exit.click(() => {
        sysm_b.dismiss()
    })


})
ui.dili.on("check", (checked) => {
    tool.writeJSON("设置电量", checked);
    checked ? ui.indx7.attr("h", "80") : ui.indx7.attr("h", "40");

});

ui.electric.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        let text = ui.electric.getText().toString()
        if (text.length < 1) {
            ui.electric.setError("不能为空!")
            return
        } else {
            tool.writeJSON("电量", text);
            ui.electric.setHint("设置低电量自动暂停:" + text + "%");
        }
        event.consumed = true;
    }
});

ui.electrictxt.on("click", function (view) {
    提示(ui.dili)
})

ui.cett.on("click", () => {
    engines.execScript("debug", java.lang.String.format("'ui';require('./debug.js');"));
})

ui.gljb.on("click", () => {
    require('../subview/script.js').Administration()
})
//自动截图
ui.auto_allow_screenshots.on("click", (view) => {
    tool.writeJSON("autoAllowScreen", view.checked);
});
ui.auto_allow_screenshots_.on("click", () => {
    ui.auto_allow_screenshots.performClick();
})

//自动放缩坐标
ui.setScreenMetrics.on("click", (view) => {
    tool.writeJSON("坐标", view.checked);

});
ui.setScreenMetrics_.on("click", () => {
    ui.setScreenMetrics.performClick();
});
//图片资源管理
ui.image_memory_manage.on("click", (view) => {
    tool.writeJSON("image_memory_manage", view.checked);
});
ui.image_memory_manage_.on("click", () => {
    ui.image_memory_manage.performClick();
})

//启用图片监测
ui.image_monitor.click((view) => {

    tool.writeJSON("image_monitor", view.checked)
})
ui.image_monitor_.on("click", () => {
    ui.image_monitor.performClick();
})
//剿灭基建
ui.woie.on("click", (checked) => {
    if (ui.woie.checked) {
        tool.writeJSON("woie", true);
        toast("启用剿灭基建收菜");
    } else {
        tool.writeJSON("woie", false);
        toast("禁用剿灭基建收菜");
    }
});
ui.woietxt.on("click", () => {
    提示(ui.woie);
});
//启动
ui.games.on("click", (checked) => {
    if (ui.games.checked) {
        tool.writeJSON("start", true);
    } else {
        tool.writeJSON("start", false);
    }
});
ui.gamestxt.on("click", () => {
    提示(ui.games);
});
//桌面
ui.home.on("click", (view) => {
    setting.end_action.home = view.checked
    tool.writeJSON("end_action", setting.end_action);

});

//震动
ui.vibration.on("click", (view) => {
    tool.writeJSON("震动", view.checked);

});
ui.vibrationtxt.on("click", () => {
    提示(ui.vibration);
});



//使用高级权限截图
ui.getu.on("click", (checked) => {
    ui.run(() => {
        if (ui.getu.checked) {
            ui.indxu.attr("h", "70")
            ui.gets.attr("visibility", "visible");
        } else {
            ui.indxu.attr("h", "45")
            ui.gets.attr("visibility", "gone");
            tool.writeJSON("截图", "辅助");
        }
    })
});
ui.getutxt.on("click", () => {
    提示(ui.getu)
})



ui.root.on("click", () => {
    $shell.setDefaultOptions({
        adb: false
    });

    let path_ = context.getExternalFilesDir(null).getAbsolutePath()
    files.createWithDirs(path_ + "/mrfz/screencap.png")
    let root = shell("screencap -p " + path_ + "/mrfz/screencap.png", true)

    if (root.code == 0) {
        toast("开启成功，建议关闭使用超级权限通知")
        ui.root.checked = true;
        tool.writeJSON("截图", "root")

    } else {
        toastLog("开启失败");
        ui.root.checked = false;
        tool.writeJSON("截图", "辅助");
        return

    }
})
ui.Shizuku.on("click", (checked) => {
    try {
        $shell.setDefaultOptions({
            adb: true
        });
        let path_ = context.getExternalFilesDir(null).getAbsolutePath()
        files.createWithDirs(path_ + "/mrfz/screencap.png")
        let adb = shell("screencap -p " + path_ + "/mrfz/screencap.png")

        if (adb.code == 0) {
            toast("开启成功")
            // ui.Shizuku.checked = true;
            tool.writeJSON("截图", "Shizuku")
        } else {
            toastLog("开启失败" + adb);
            ui.Shizuku.checked = false;
            tool.writeJSON("截图", "辅助");
            return
        }
    } catch (err) {
        toastLog("开启失败，请检查是否已在Shizuku中授权明日计划\n不知道什么是Shizuku？请百度，谢谢\n" + err);
        ui.Shizuku.checked = false;
        tool.writeJSON("截图", "辅助");

    }
});

//熄屏
ui.xpyx.on("click", (view) => {


    ui.run(() => {
        if (view.checked) {

            let dex_path = package_path + "shell/control.dex";
            var sh_path = package_path + "shell/starter.sh";
            if (!files.exists(dex_path) || !files.exists(sh_path)) {
                files.copy("../lib/java/control.dex", dex_path);
                files.create(sh_path)

                let sh_content = '\n' +
                    'file_name="control.dex"\n' +

                    'origin_path="`dirname $0`/$file_name"\n' +

                    'target_path="' + dex_path + '"\n' +

                    // 'if [[ -e $origin_path ]]; then\n' +
                    //  '    cp $origin_path $target_path\n' +
                    '    chmod 771 $origin_path $target_path\n' +
                    '    export CLASSPATH="$target_path"\n' +
                    '    app_process /system/bin screenoff.only.Control on\n' +
                    '\n';

                files.write(sh_path, sh_content);

            }
            let n = sh_path

            setTimeout(function () {
                files.remove(n);
            }, 3000)

            if (setting.监听键 == "音量下键") {
                toastLog("请先关闭音量下键停止PRTS辅助")
                return
            }

            if (!$shell.checkAccess("root")) {
                log("设备没有ROOT权限");
            } else {
                $shell.setDefaultOptions({
                    adb: false,
                });
                try {
                    let sh_root_result = shell("sh " + sh_path, true)
                    if (sh_root_result.code != 0) {
                        toastLog("测试root权限打开屏幕失败,\n错误信息:" + sh_root_result)
                    } else {
                        toastLog("使用root权限")
                        sh_path = true;
                    }
                } catch (e) {
                    toastLog("root权限错误：\n" + e);
                }
            }

            if (sh_path != true) {
                if (!$shell.checkAccess("adb")) {
                    toastLog("没有ROOT，ADB权限，授权给明日计划使用。");
                    view.checked = false;
                    return
                } else {
                    $shell.setDefaultOptions({
                        adb: true
                    });
                    try {
                        let sh_adb_result = shell("sh " + sh_path, {
                            adb: true,
                        })
                        if (sh_adb_result.code != 0) {
                            toastLog("测试adb权限打开屏幕失败\n错误信息:" + sh_adb_result)
                            view.checked = false;
                            return
                        } else {
                            toastLog("使用adb权限")
                        }
                    } catch (e) {
                        toastLog("adb权限错误：\n" + e)
                        view.checked = false;
                        return
                    }
                }
            }

            for (var i = 0; i < mod_data.length; i++) {
                if (mod_data[i].id == "熄屏运行") {
                    mod_data.splice(i, 1);
                }
            }
            mod_data.push({
                id: "熄屏运行",
                pre_run: false,
                pre_run_check: false,
                script_name: "熄屏运行",
                developer: "梦月時謌",
                version: "1.2.0"
            })
            sto_mod.put("modular", mod_data)
            tool.writeJSON("熄屏", true);
            提示(view)

        } else {
            for (var i = 0; i < mod_data.length; i++) {
                if (mod_data[i].id == "熄屏运行") {
                    mod_data.splice(i, 1);
                }
            }
            sto_mod.put("modular", mod_data)
            tool.writeJSON("熄屏", false);
        }
    })
});

ui.xpyxtxt.on("click", (view) => {
    提示(ui.xpyx)
})


//前台通知服务
ui.front_desk_service.on("click", (view) => {
    view.checked ? $settings.setEnabled('foreground_service', true) : $settings.setEnabled('foreground_service', false);
})
ui.front_desk_service_.on("click", (view) => {
    ui.front_desk_service.performClick()
})
//悬浮窗主题色
ui.floating_theme.on("check", (checked) => {
    ui.run(() => {
        ui.floating_theme_list.setVisibility(checked ? 0 : 8);
    })
    if (!checked) {
        tool.writeJSON("bg", "#Aeeeee");
        tool.writeJSON("theme", "#a9a9a9");
        tool.writeJSON("toast", "#FF8C00");
    }
})
ui.floating_theme_.on("click", () => {
    ui.floating_theme.performClick()
})
//悬浮窗大小
var seekbarListener = new android.widget.SeekBar.OnSeekBarChangeListener({
    onProgressChanged: function (v, progress, fromUser) {
        try {
            if (v == ui.seekbar) {
                if (progress <= 50) {
                    progress = 50;
                }
                ui.seekbar.progress = progress;
                ui.valueB.setText("设置悬浮窗大小 " + String(parseInt(progress)));
                tool.writeJSON("Floaty_size", progress / 100);

            }
        } catch (e) {
            console.error(e)
        }
    }
});
ui.seekbar.setOnSeekBarChangeListener(seekbarListener);
//页面主题色
ui.page_theme.on("check", (checked) => {
    ui.run(() => {
        ui.inputd_tecr_list.setVisibility(checked ? 0 : 8);
    })
    if (!checked) {

        let txt = "#926e6d";
        ui.statusBarColor(txt);
        ui.toolbar.attr("bg", txt);
        txt = colors.parseColor(txt);
        ui.text_bg.setTextColor(txt);
        ui.text_bg2.setTextColor(txt);
        ui.text_bg3.setTextColor(txt);
        ui.text_bg4.setTextColor(txt);
        storages.create("configure").put("theme_colors", {
            bar: "#926e6d"
        })
    }
})
ui.page_theme_.on("click", () => {
    ui.page_theme.performClick();
})

ui.ignore_battery_ptimization.on("check", (checked) => {
    $power_manager.requestIgnoreBatteryOptimizations();
})
ui.ignore_battery_ptimization_.on("click", () => {
    ui.ignore_battery_ptimization.performClick()
})
ui.self_starting.on("check", (checked) => {
    app.openAppSetting(context.getPackageName());
});
ui.self_starting_.on("check", (checked) => {
    app.openAppSetting(context.getPackageName());
});
ui.gfcm.on("check", (checked) => {
    tool.writeJSON("防沉迷", checked);
});
ui.gfcmtxt.on("click", () => {
    提示(ui.gfcm)
})

//作战汇报
ui.olrs.on("click", (view) => {

    setting.作战汇报 = view.checked;
    tool.writeJSON("作战汇报", view.checked);
    if (view.checked) {
        提示(view);
    }
});

ui.olrstxt.on("click", () => {
    提示(ui.olrs);
})

ui.qetj.on("click", (view) => {
    if (edition == "c_") {
        toastLog("纯净版不可用")
        view.checked = false;
        return
    }
    setting.企鹅统计 = view.checked;
    tool.writeJSON("企鹅统计", view.checked);
    ui.indxj.setVisibility(view.checked ? 0 : 8)
    if (view.checked) {
        提示(view)
    }

});

ui.qetjtxt.on("click", () => {
    提示(ui.qetj)
})

//汇报上传
ui.jsjt.on("click", (view) => {
    tool.writeJSON("汇报上传", view.checked);

});
ui.jsjttxt.on("click", () => {
    提示(ui.jsjt)
});
//异常超时
ui.identify_unusual_pauses.on("check", (checked) => {
    tool.writeJSON("异常超时", checked);
});
ui.identify_unusual_pauses_.on("click", () => {
    ui.identify_unusual_pauses.performClick();
});

ui.volume_fixes.on("click", (view) => {
    tool.writeJSON("音量修复", view.checked);
    if (view.checked) {
        try {
            device.setMusicVolume(device.getMusicVolume());
        } catch (err) {
            toastLog("没有修改系统设置权限！\n仅用于修复部分机型启动游戏后音量异常");
        }
    }
});
ui.volume_fixes_.on("click", () => {
    ui.volume_fixes.performClick();
});

ui.xlkz.on("check", (checked) => {
    tool.writeJSON("行动理智", checked);
});
ui.xlkz_.on("click", () => {
    ui.xlkz.performClick()
})

ui.gmvp.on("click", (view) => {
    tool.writeJSON("音量", view.checked);
    if (view.checked) {
        try {
            var gmvp = device.getMusicVolume()
            device.setMusicVolume(gmvp)
        } catch (err) {
            toastLog("没有修改系统设置权限！")
        }
    }
});
ui.gmvptxt.on("click", () => {
    提示(ui.gmvp)
})
/*
    ui.syqk.on("click", (checked) => {
        申请查看使用情况的权限3();

        function 申请查看使用情况的权限3() {
            try {
                app.startActivity({
                    packageName: "com.android.settings",
                    className: "com.android.settings.Settings$AppUsageAccessSettingsActivity",
                    data: "package:" + context.packageName.toString(),
                });
            } catch (err) {
                log("申请出错" + err)
                app.startActivity({
                    action: "android.settings.USAGE_ACCESS_SETTINGS",
                });
            }
        }

    })
    ui.syqktxt.on("click", () => {
        提示(ui.syqktxt, ui.syqk, "开启后程序能更加准确获取前台应用，减少无障碍异常的情况")
    })
    */
/*
      ui.adbc.on("click", () => {
        if (ui.adbc.checked) {
            threads.start(function() {
                try {
                    fg = shell("input tap " + 450 + " " + 100);
                } catch (era) {
                    ui.adbc.checked = false;
                  tool.writeJSON("ADB", false);
                }
            })
            setTimeout(function() {
                if (fg.code == 0) {
                    tool.writeJSON("ADB", true);
                    toast("开启成功")
                } else {
                    ui.adbc.checked = false;
                 tool.writeJSON("ADB", false);
                }
            }, 1500);
        } else {
            tool.writeJSON("ADB", false);
            toast("关闭成功")
        }
        //   })

    })
       setting.ADB ? ui.adbc.checked = true : ui.adbc.checked = false;
 */

//自定义执行
ui.custom.on("click", () => {
    if (ui.custom.checked) {
        ui.run(() => {
            ui.indxc.attr("h", "80")
            ui.input_c.attr("visibility", "visible");
            ui.input_file3.attr("visibility", "visible")
            try {
                if (setting.custom.length > 5) {
                    ui.input_c.setHint(setting.custom);
                }
            } catch (err) {

            }
        })
    } else {
        tool.writeJSON("custom", false);
        tool.writeJSON("执行", "常规")

        ui.run(() => {
            ui.indxc.attr("h", "45")
            ui.input_c.attr("visibility", "gone");
            ui.input_file3.attr("visibility", "gone")
        })
    }
})
ui.customtxt.on("click", () => {
    提示(ui.custom)
})

//暂停后关闭应用
ui.gbyy.on("click", (view) => {
    // log(setting.公告)
    tool.writeJSON("公告", view.checked);
    if (view.checked) {
        ui.run(() => {
            ui.indx6.attr("h", "80")
            ui.inputgb.attr("visibility", "visible");
            ui.input_file.attr("visibility", "visible")
            if (setting.关闭应用.length > 5) {
                ui.inputgb.setHint(setting.关闭应用);
            }
        })
    } else {
        ui.run(() => {
            ui.indx6.attr("h", "45")
            ui.inputgb.attr("visibility", "gone");
            ui.input_file.attr("visibility", "gone")
        })
    }
})
ui.gbyytxt.on("click", () => {
    提示(ui.gbyy)
})

//基建换班
ui.jjhb.on("click", (checked) => {
    tool.writeJSON("基建换班", ui.jjhb.checked);
    if (ui.jjhb.checked) {
        ui.run(() => {
            ui.indx4.attr("h", "80")
            ui.inputd2.attr("visibility", "visible");
            ui.input_file2.attr("visibility", "visible")
            if (setting.换班路径.length > 5) {
                ui.inputd2.setHint(setting.换班路径)
            };
        })
    } else {
        ui.run(() => {
            ui.indx4.attr("h", "45");
            ui.inputd2.attr("visibility", "gone");
            ui.input_file2.attr("visibility", "visible")
        })
    }

});
ui.jjhbtxt.on("click", () => {
    提示(ui.jjhb)
})
ui.input_file.on("click", () => {
    //application/x-javascript
    File_selector(".js");
})
ui.input_file2.on("click", () => {
    File_selector(".js");
})
ui.input_file3.on("click", () => {
    File_selector(".js");
})
//修复模拟器竖屏
ui.compatible_simulator_tablet.on("click", (view) => {

    /*if (shell("screencap -p " + files.path("./mrfz/截图") + ".png", true).code != 0) {
        toastLog("没有root权限");
        ui.compatible_simulator_tablet.checked = false;
        return
    }*/
    //  提示(view) // tool.writeJSON("截图", "root")

    tool.writeJSON("模拟器", view.checked);

})
ui.compatible_simulator_tablet_.on("click", () => {
    ui.compatible_simulator_tablet.performClick();
})

/*function 是否有查看使用情况的权限() {
    importClass(android.app.AppOpsManager);
    let appOps = context.getSystemService(context.APP_OPS_SERVICE);
    let mode = appOps.checkOpNoThrow(
        "android:get_" + "usage_stats",
        android.os.Process.myUid(),
        context.getPackageName()
    );
    return (granted = mode == AppOpsManager.MODE_ALLOWED);
}*/


ui.inputd_tecr.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.inputd_tecr, "theme_colors");
        event.consumed = true;
    }
});

ui.inputd_tecr_b.on("click", () => {
    engines.execScript("Color_selector_ui", java.lang.String.format("'ui';require('../activity/Colour_list.js');"));
});
ui.emitter.on("resume", function () {
    let themes = theme.bar
    theme = storages.create('themes').get('theme')
    if (themes.bar != theme.bar) {
        ui.statusBarColor(theme.bar);
        ui.toolbar.attr("bg", theme.bar);
        let bar = colors.parseColor(theme.bar);
        ui.text_bg.setTextColor(bar);
        ui.text_bg2.setTextColor(bar);
        ui.text_bg3.setTextColor(bar);
        ui.text_bg4.setTextColor(bar);
    }
})
ui.bg.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.bg, "bg");
        event.consumed = true;
    }
});

ui.theme.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.theme, "theme")
        event.consumed = true;
    }
});
ui.toast.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        颜色码(ui.toast, "toast");
        event.consumed = true;
    }
});



function 颜色码(id, ids, txt, oper) {
    if (id.text().indexOf("0x") > -1) {
        txt = colors.toString(id.text());
    } else {
        txt = id.text();
    }
    try {
        id.setTextColor(Color.parseColor(txt));
        id.setHint(txt);
        id.setText(null);
        if (ids == "theme_colors") {
            storages.create("configure").put("theme_colors", {
                bar: txt
            });
            ui.statusBarColor(txt);
            ui.toolbar.attr("bg", txt);
            txt = colors.parseColor(txt);
            ui.text_bg.setTextColor(txt);
            ui.text_bg2.setTextColor(txt);
            ui.text_bg3.setTextColor(txt);
            ui.text_bg4.setTextColor(txt);

        } else {
            tool.writeJSON(ids, txt);
        }

        return true;
    } catch (er) {
        console.error(er);
        id.setError("自定义的主题色不是\n16进制六位或八位颜色码");
    }
}

function File_selector(mime_Type, fun) {
    toastLog("请选择后缀为.js类型的文件");
    let FileChooserDialog = require("../subview/file_chooser_dialog");
    FileChooserDialog.build({
        title: '请选择后缀为.js的文件',
        type: "app-or-overlay",
        // 初始文件夹路径
        dir: "/sdcard/",
        // 可选择的类型，file为文件，dir为文件夹
        canChoose: ["file"],
        mimeType: mime_Type,
        wrapInScrollView: true,
        // 选择文件后的回调
        fileCallback: (file) => {
            if (file == null) {
                toastLog("未选择路径");
                return
            }

            console.info("选择的文件路径：" + file);
            modular_id(file)

        }

    }).show();

}

ui.input_c.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        if (ui.input_c.text().length > 5 && files.exists(ui.input_c.text())) {
            modular_id(ui.input_c.text())
        } else {
            ui.input_c.setError("输入的模块路径有误，无法查询该.js文件");
        }
        event.consumed = true;
    }
});
ui.inputgb.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        if (ui.inputgb.text().length > 5 && files.exists(ui.inputgb.text() + "关闭应用.js")) {
            modular_id(ui.inputgb.text());
        } else {
            ui.inputgb.setError("输入的模块路径有误，无法查询该.js文件");
        }
        event.consumed = true;
    }
});

ui.inputd2.on("key", function (keyCode, event) {
    if (event.getAction() == 0 && keyCode == 66) {
        if (ui.inputd2.text().length > 5 && files.exists(ui.inputd2.text() + "基建换班.js")) {
            modular_id(ui.inputd2.text())
        } else {
            ui.inputd2.setError("输入的模块路径有误，无法查询该.js文件");
        }
        event.consumed = true;
    }
});

activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function () {
        ui.finish();
    }
});


importClass(android.view.MenuItem);
//在toolbar添加按钮
ui.emitter.on('create_options_menu', menu => {
    let item = menu.add(0, 17, 0, '模块仓库');
    item.setShowAsAction(MenuItem.SHOW_AS_ACTION_IF_ROOM | MenuItem.SHOW_AS_ACTION_WITH_TEXT);
});

//监听菜单选项点击
ui.emitter.on('options_item_selected', (e, item) => {
    if (item.getTitle() == '模块仓库') {
        engines.execScriptFile('./Module_platform.js', {
            path: files.path('./')
        });
    }
})

function modular_id(file) {
    threads.start(function () {
        if (files.getExtension(file) != "js") {
            toast("不是后缀为.js的文件");
            console.error("不是后缀为.js的文件");
            return
        }
        try {
            let modular = require(file);
            var route_c = modular.import_configuration({
                'cwd': file.replace(files.getName(file), ""),
                'getSource': file,
                'getinterface': '设置',
            });

        } catch (err) {
            toast("执行.js发生错误:" + err + "。\n可能非标准插件模块，请参考相关示例修改");
            console.error("执行.js发生错误:" + err + "。\n可能非标准插件模块，请参考相关示例修改")
            return
        }
        try {
            log(route_c.id)
        } catch (err) {
            toast("无法获取模块id，非标准插件模块，请参考相关示例修改")
            console.error("无法获取模块id，非标准插件模块，请参考相关示例修改\n" + err)
            return
        }

        switch (route_c.id) {
            case '自定义':
                ui.run(() => {
                    // ui.indx3.attr("h", "80")
                    ui.input_c.attr("visibility", "visible");
                    tool.writeJSON("custom", file);
                    ui.input_c.setHint(file);
                    ui.input_c.setText(null);
                })
                break

            case '关闭应用':

                ui.run(() => {
                    ui.gbyy.checked = true;
                    ui.indx6.attr("h", "80")
                    ui.inputgb.attr("visibility", "visible");
                    ui.input_file.attr("visibility", "visible")

                    tool.writeJSON("公告", true);
                    tool.writeJSON("关闭应用", file);
                    ui.inputgb.setHint(file);
                    ui.inputgb.setText(null);
                })
                break;
            case '基建换班':
                ui.run(() => {
                    ui.jjhb.checked = true;
                    ui.indx4.attr("h", "80")
                    ui.inputd2.attr("visibility", "visible");
                    ui.input_file2.attr("visibility", "visible")

                    tool.writeJSON("基建换班", true);
                    tool.writeJSON("换班路径", file);
                    ui.inputd2.setHint(file);
                    ui.inputd2.setText(null);
                })
                break;
            default:
                toastLog("未匹配到相应模块id，非标准插件模块，请参考相关示例修改")
                return
        }
        toastLog("确认ID完成，" + route_c.id + "导入成功");
        if (route_c.modular_configuration != undefined) {
            if (route_c.modular_configuration.open) {
                for (var i = 0; i < mod_data.length; i++) {
                    if (mod_data[i].id == route_c.id) {
                        mod_data.splice(i, 1);
                    }
                }

                mod_data.push({
                    id: route_c.id,
                    pre_run: route_c.pre_run_configuration ? true : false,
                    pre_run_check: false,
                    script_name: route_c.modular_configuration.script_name,
                    developer: route_c.modular_configuration.developer,
                    version: route_c.modular_configuration.version
                })

            }
        }
        sto_mod.put("modular", mod_data)

    })
}
//当离开本界面时保存
ui.emitter.on("pause", () => {
    setting = tool.readJSON("./mrfz/setting.json");
    let txt;
    if (ui.bg.text().length >= 1) {
        if (ui.bg.text().indexOf("0x") > -1) {
            txt = colors.toString(ui.bg.text());
        } else {
            txt = ui.bg.text();
        }
        try {
            ui.bg.setTextColor(Color.parseColor(txt));
            tool.writeJSON("bg", txt);
        } catch (er) {
            console.error(er)
            toast("自定义的悬浮窗背景色非16进制六位或八位颜色码");
        }
    }

    if (ui.theme.text().length >= 1) {
        if (ui.theme.text().indexOf("0x") > -1) {
            txt = colors.toString(ui.theme.text());
        } else {
            txt = ui.theme.text();
        }
        try {
            ui.theme.setTextColor(Color.parseColor(txt));
            tool.writeJSON("theme", txt);
        } catch (er) {
            console.error(er)
            toast("自定义的悬浮窗图标色非16进制六位或八位颜色码");
        }
    }
    if (ui.toast.text().length >= 1) {
        if (ui.toast.text().indexOf("0x") > -1) {
            txt = colors.toString(ui.toast.text());
        } else {
            txt = ui.toast.text();
        }
        try {
            ui.toast.setTextColor(Color.parseColor(txt));
            tool.writeJSON("toast", txt);
        } catch (er) {
            console.error(er)
            toast("自定义的悬浮窗字体颜色非16进制六位或八位颜色码");
        }
    }

});

//音量暂停辅助
ui.button_pause.on('click', (view) => {
    BottomWheelPicker.setData(['音量上键', '音量下键', '关闭'])
        .show().then(result => {
            view.setText(result.text);
            tool.writeJSON("监听键", result.text);

        });
});
/**
 * ocr类型设置
 */
ui.OCRExtensions_type.on('click', (view) => {
    BottomWheelPicker.setData(Object.keys(ocr_plugin))
        .show().then(result => {
            view.setText(result.text);
            tool.writeJSON("defaultOcr", result.text);

            ui.OCRExtensions.checked = false;
            ui.post(() => {
                ui.OCRExtensions.checked = ocr_plugin[result.text].isInstalled();
            }, 200);

        })
});
ui.OCRExtensions.on("click", (view) => {
    if (view.checked) {
        ocr_plugin[ui.OCRExtensions_type.getText().toString()].install({
            successCallback: function () {
                tool.writeJSON("ocrExtend", true);
            },
            failCallback: function () {
                tool.writeJSON("ocrExtend", false);
            },
        });
    } else {
        toastLog('已安装插件扩展请勿取消');

    }
})
update_ui()

function update_ui() {
    ui.run(() => {
        ui.button_pause.setText(setting.监听键);
        ui.button_pause.setBackground(createShape(5, 0, 0, [2, theme.bar]));

        ui.OCRExtensions_type.setText(setting.defaultOcr);
        ui.OCRExtensions_type.setBackground(createShape(5, 0, 0, [2, theme.bar]));
        setting = tool.writeJSON("ocrExtend", ocr_plugin[setting.defaultOcr].isInstalled());
        ui.OCRExtensions.checked = setting.ocrExtend;

        setting.熄屏 ? ui.xpyx.checked = true : ui.xpyx.checked = false;
        setting.agent ? ui.agent.checked = true : ui.agent.checked = false;
        setting.防沉迷 ? ui.gfcm.checked = true : ui.gfcm.checked = false;
        setting.模拟器 ? ui.compatible_simulator_tablet.checked = true : ui.compatible_simulator_tablet.checked = false;
        setting.woie ? ui.woie.checked = true : ui.woie.checked = false;
        ui.setScreenMetrics.checked = (setting.坐标 ? true : false);
        setting.震动 ? ui.vibration.checked = true : ui.vibration.checked = false;
        ui.home.checked = (setting.end_action.home ? true : false);
        setting.start ? ui.games.checked = true : ui.games.checked = false;
        setting.音量 ? ui.gmvp.checked = true : ui.gmvp.checked = false;
        //加不加()无所谓,看起来好看一些..
        ui.volume_fixes.checked = (setting.音量修复 ? true : false);
        setting.行动理智 ? ui.xlkz.checked = true : ui.xlkz.checked = false;
        ui.identify_unusual_pauses.checked = (setting.异常超时 ? true : false);
        setting.设置电量 ? ui.dili.checked = true : ui.dili.checked = false;
        setting.作战汇报 ? ui.olrs.checked = true : ui.olrs.checked = false;
        ui.qetj.checked = setting.企鹅统计 ? true : false;
        ui.indxj.setVisibility(setting.企鹅统计 ? 0 : 8)
        ui.jsjt.checked = setting.汇报上传 ? true : false;
        ui.offset.checked = setting.offset ? true : false;
        ui.proxy_card_check.checked = setting.proxy_card ? true : false;
      
        if (setting.front_display_list) {
            ui.front_display_list.setDataSource(setting.front_display_list);
            if (setting.front_display) {
                ui.front_display_check.checked = true;
                ui.front_display_list.setVisibility(0);
            }

        }
        ui.front_display_add.setBackground(createShape(3, 0, 0, [5, "#00ff00"]))
     

        tool.checkPermission("android.permission.WRITE_SECURE_SETTINGS") ? ui.sysm.checked = true : ui.sysm.checked = false;

        ui.electric.setHint("设置低电量自动暂停:" + setting.电量 + "%")
        if (!!setting.Floaty_size) {
            ui.seekbar.progress = setting.Floaty_size * 100;
            ui.valueB.setText("设置悬浮窗大小 " + String(parseInt(setting.Floaty_size * 100)));
        }


        if (setting.custom != false && setting.custom != undefined) {
            if (setting.custom.length > 5) {
                ui.custom.checked = true;
                ui.indxc.attr("h", "80")
                ui.input_c.attr("visibility", "visible");
                ui.input_file3.attr("visibility", "visible");
                ui.input_c.setHint(setting.custom);
            }
        }
        if (setting.截图 == "root" || setting.截图 == "Shizuku") {
            ui.getu.checked = true;
            ui.indxu.attr("h", "70")
            ui.gets.attr("visibility", "visible");
            if (setting.截图 == "root") {
                ui.root.checked = true;
                ui.Shizuku.checked = false;
            } else {
                ui.root.checked = false;
                ui.Shizuku.checked = true;
            }
        } else {
            ui.getu.checked = false;
            ui.indxu.attr("h", "45")
            ui.gets.attr("visibility", "gone");
            tool.writeJSON("截图", "辅助");
        }

        ui.bg.setHint(setting.bg);
        ui.theme.setHint(setting.theme);
        ui.toast.setHint(setting.toast);

        //关闭应用
        if (setting.公告) {
            if (setting.关闭应用.length < 3) {
                ui.gbyy.checked = false
                tool.writeJSON("公告", false);
            } else {
                ui.gbyy.checked = true;
                ui.indx6.attr("h", "80");
                ui.inputgb.attr("visibility", "visible");
                ui.input_file.attr("visibility", "visible");
                ui.inputgb.setHint(setting.关闭应用)
            }
        } else if (setting.公告 == false) {
            ui.gbyy.checked = false;
        }

        if (setting.基建换班) {
            if (setting.换班路径.length < 3) {
                ui.jjhb.checked = false;
                tool.writeJSON("基建换班", false);
            } else {
                ui.jjhb.checked = true;
                ui.run(() => {
                    ui.indx4.attr("h", "80")
                    ui.inputd2.attr("visibility", "visible");
                    ui.input_file2.attr("visibility", "visible")
                })
                ui.inputd2.setHint(setting.换班路径)
            }
        } else {
            ui.jjhb.checked = false;
        }

        /* if (是否有查看使用情况的权限()) {
             ui.syqk.checked = true;
         } else {
             ui.syqk.checked = false;
         }*/

    })
}


function 提示(id, txt) {
    //初始位置，展示的位置，文本
    txt = txt || "错误，文本异常"
    switch (id) {
        //悬浮窗主题色
        case ui.page_theme:
            txt = "关闭开关还原默认页面主题色";
            break

        //关闭应用
        case ui.gbyy:
            txt = "PRTS辅助暂停前执行相关js模块以关闭指定应用";
            break

        //作战汇报
        case ui.olrs:
            txt = "将替换掉悬浮窗上的快捷基建图标\n点击新的图标会显示PRTS辅助记录内容";
            break
        //自定义执行
        case ui.custom:
            txt = "唔...嗯？"
            break

        case ui.gmvp:
            txt = "程序自启动游戏后关闭媒体音量，程序主动暂停后恢复";
            break

        //企鹅物流
        case ui.jsjt:
            txt = "行动完成后自动截取结算页面识别并上传所有掉落结果，汇报详情。\n企鹅物流数据统计：https://penguin-stats.cn/";
            break
        //数据统计
        case ui.qetj:
            txt = "*统计关卡掉落物信息！该功能会使用较多的运存，数据来源：企鹅物流数据统计，由于企鹅物流自身原因，请在使用本功能时关闭其它悬浮窗，否则识别出错。";
            break
        case ui.gfcm:
            txt = "开启后程序将检测防沉迷确认框自动退出游戏，不过目前嘛，几乎名存实亡...";
        //使用高级权限截图
        case ui.getu:
            txt = "使用相关高级权限来进行截图\n不需要请求录屏权限，可以免受其困扰\n相应的，截图速度也会低于辅助录屏权限\n电脑模拟器竖屏打开此功能可修复";
            break
        //熄屏
        case ui.xpyx:
            txt = "使用root或adb权限关闭背光，实现熄屏运行。不知道什么是root，adb？搜索一下root，adb，shizuku。\n启动熄屏模块方式：\n-----1：悬浮窗-点击执行模式文本\n-----2：主页-右下角-模块配置\n关闭熄屏状态方式:\n-----1：按下音量键关闭\n-----2：按电源键锁屏，再按电源键解锁\n-----3.长按音量键停止脚本并关闭\n说明：息屏运行期间，系统不会自动休眠，一切APP都会和亮屏时一样继续工作。直到您按下电源键才会真正的息屏。" +
                "\n\n小部分设备在息屏运行之后会屏蔽按键，所以音量键亮屏在这些设备(已知华为鸿蒙的某些手机、Origin OS的某些手机)上无效" +
                "\n\n部分LCD设备息屏运行之后依然有屏幕背光。跟屏蔽按键、屏蔽触控一样，这都是系统工程师决定的，我无法改变。但是您可以在息屏运行前先把屏幕亮度调到最小，以把背光降到最低。\n";

            break

        case ui.vibration:
            txt = "振动？震动？"
            break
        //低电量自动暂停
        case ui.dili:
            txt = "*每代理完一关，都会判断当前电量是否低于设定值，是则暂停并返回桌面处理(不受暂停后返回桌面功能影响)。"
            break

        case ui.games:
            txt = "关闭后不会自启动明日方舟，上一次作战程序中无效禁用\n如果偶尔失效，请授于应用后台弹出界面权限"
            break
        case ui.jjhb:
            txt = "需会使用Auto.js开发或有大佬分享的模块，小白不推荐使用";
            break
        case ui.woie:
            txt = "剿灭行动完成后或没有理智时不启动基建收菜后续程序，直接暂停"
            break
    }
    tool.dialog_tips(id.getText(), txt)

}