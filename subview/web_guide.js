//启用本脚本的使用安卓资源的特性
//ui.useAndroidResources();明日计划_

//设置自定义主题
//activity.theme.applyStyle(colors.parseColor("#ffff0000"), true);
var packageName = context.getPackageName();
importClass(android.graphics.drawable.GradientDrawable.Orientation);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.widget.AdapterView);
var v = device.width / 5 * 4 / 520;
if(device.width>device.height){
    v = device.height / 5 * 4 / 520;
}
var path = (files.cwd() == "/data/user/0/"+packageName+"/files/project") ? "file://./res/tishi.png" : "file://../../res/tishi.png";

//ui.layout(
var win;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
win = ui.inflate(
    <vertical margin="0 0" bg="#00000000" >
        <ScrollView>
            <vertical w="*" h="*" >
                <img  h="{{vl(250)}}" src="{{path}}" />
                <text id="_title" w="auto" text="左右滑动切换界面" margin="0 30" textColor="#ffffff" textStyle="bold" textSize="{{vl(15)}}px" layout_gravity="center_horizontal" />
                
                <button w="200" h="*" id="exit" text="我知道了" bg="#013e403f" layout_gravity="center_horizontal" textSize="18" textStyle="bold" textColor="#3087fe"  style="Widget.AppCompat.Button.Colored" />
            </vertical>
        </ScrollView>
    </vertical>)

var yindaod = dialogs.build({
    customView: win,
    type: "app",
    wrapInScrollView: false,
    autoDismiss: false,
    cancelable: false,
    canceledOnTouchOutside: false
}).show();

function vl(x) {
    return parseInt(x * v) + "px"
}

try {
    //设置对话框背景透明
    yindaod.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
} catch (err) {}
win._title.setText("左右滑动切换界面\n   使用更多功能")

/*   win.exit.setEnabled(false)
 */
win.exit.attr("visibility", "invisible");

setTimeout(function() {
    ui.run(function() {
        win.exit.attr("visibility", "visible");

    });
}, 5000);

win.exit.click(() => {
storages.create("web_set").put("yindao",true);
threads.shutDownAll();
    yindaod.dismiss();
    exit();

})
events.on('exit', function() {
    yindaod.dismiss();
})
//保持脚本运行
setInterval(() => {

}, 1000);