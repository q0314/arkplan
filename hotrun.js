"ui";
//设置状态栏为透明
activity.getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
if (device.sdkInt >= 23) {
    activity.getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
}
ui.layout(
    <frame>
        <vertical w="*" h="*" layout_gravity="center">
            <vertical h="*" gravity="center" >
                <img src="file://./res/icon.png" w="120" h="120" scaleType="fitXY" />
                <horizontal gravity="center" margin="25">
                    <text id="loadingtext">加载中，请稍后</text>
                </horizontal>
            </vertical>
        </vertical>
    </frame>
);

let cnt = 0;
setInterval(function () {
    cnt = (cnt + 1) % 5;
    ui.loadingtext.text('加载中，请稍后' + (new Array(cnt + 1)).join('.'));
}, 400);
let _proj_def_n = 'arkplan';
let path = context.getExternalFilesDir(null).getAbsolutePath() + '/';
threads.start(function () {

    let packageName = context.packageName;
    if (false && packageName.match(/^org.autojs.autojs(pro)?$/)) {
        sleep(2000);
        // 在aj里面运行，表示为开发环境，运行路径为../dist/auto.js
        engines.execScriptFile(files.cwd() + '/../dist/auto.js', {
            path: files.cwd() + '/../'
        });
        setTimeout(function () {
            ui.finish();
        }, 1000);
    } else {

        if (!files.exists(path + _proj_def_n + '/')) {
            let { filesx } = require('./modules/ext-files');

            files.rename('./', _proj_def_n);
  
            filesx.copy(files.path('../' + _proj_def_n + '/'), path);
        };
        engines.execScriptFile(path + _proj_def_n + '/main.js', {
            path: path + _proj_def_n + '/'
        });
        setTimeout(function () {
            ui.finish();
        }, 1000);
    }
});

