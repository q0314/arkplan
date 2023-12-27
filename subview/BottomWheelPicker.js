/**
 * 屁话先说一下
 * 作者：无名小姐 QQ:1352183717
 * 功能：实现了不用安装apk就能调用及使用本地apk安装包的类和资源
 * 原理：通过反射解析apk中的资源及dex,so并实现调用
 * 目的：对主apk的功能增强，插件不用再次安装，插件远程更新
 * 外话：这只是一个Rhino版本轮子，别的版本群友已提供,
 * 实际上还有很多的补充地方，比如加载一个插件中的Activity，大家自行研究啦
 * 本测试用安装包为方便上传已经精简，
 * */
importClass(android.widget.LinearLayout);
importClass(android.view.Gravity);
importClass(android.content.DialogInterface);

importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);

importClass(android.view.ContextThemeWrapper);
importClass(android.content.res.Resources);
var apk_path = "../lib/java/WheelPicker.apk";
var assetManagerCls = java.lang.Class.forName("android.content.res.AssetManager", true, context.getClass().getClassLoader());
assetManagerObj = assetManagerCls.newInstance();
addAssetPathMethod = assetManagerCls.getDeclaredMethod("addAssetPath", java.lang.String);
addAssetPathMethod.setAccessible(true);
addAssetPathMethod.invoke(assetManagerObj, files.path(apk_path));
resources = activity.getResources();
resources = new Resources(assetManagerObj, resources.getDisplayMetrics(), resources.getConfiguration());
mContext = new ContextThemeWrapper(activity, 0);
mResourcesField = mContext.getClass().getDeclaredField("mResources");
mResourcesField.setAccessible(true);
mResourcesField.set(mContext, resources);

runtime.loadDex(apk_path);
importClass(com.aigestudio.wheelpicker.WheelPicker)

let {
    dp2px,
    createShape
} = require('../modules/__util__');

let BottomWheelPicker = function () {

};
BottomWheelPicker.prototype.build = function (item) {
    if (!item) throw "无数据源传入";
    this.view = ui.inflate(
        <LinearLayout
            orientation="vertical">
            <TextView
                id="title"
                layout_width="match_parent"
                layout_height="wrap_content"
                text="请选择"
                textStyle="bold"
                layout_marginTop="25dp"
                textSize="20sp"
                textColor="#000000"
                gravity="center" visibility="gone"
            />
            <LinearLayout
                gravity="center"
                orientation="horizontal"
                layout_width="match_parent"
                layout_height="match_parent">

                <Button
                    id="tv_cancel"
                    margin="20 10 5 20"
                    layout_weight="1"
                    layout_height="44dp"
                    text="取消"
                    textSize="15sp" />

                <Button
                    id="tv_agree"
                    margin="5 10 20 20"
                    layout_weight="1"
                    layout_height="44dp"
                    text="确定"
                    textSize="15sp"
                />
            </LinearLayout>
        </LinearLayout>

    );
    this.mBottomSheetDialog = new BottomSheetDialog(activity);
    this.mBottomSheetDialog.setContentView(this.view);
    //触摸外部关闭view
    this.mBottomSheetDialog.setCanceledOnTouchOutside((item.canceledOnTouchOutside == undefined) ? true : false);
    mDialogBehavior = BottomSheetBehavior.from(this.view.getParent());
    //mDialogBehavior.setPeekHeight();
    mDialogBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback({
        onStateChanged: function (view, i) {
            switch (i) {
                case BottomSheetBehavior.STATE_HIDDEN:
                    mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
                    break
            }
        }
    }));


    this.wheelPicker = new WheelPicker(mContext);
    let flParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
    flParams.gravity = Gravity.CENTER;
    flParams.setMargins(150, 100, 150, 100);
    //this.wheelPicker.setPadding(0,50,0,50);
    this.wheelPicker.setLayoutParams(flParams)
    this.wheelPicker.setVisibleItemCount(item.itemCount || 5)
    this.wheelPicker.setItemTextSize(item.itemTextSize || dp2px(20))
    this.wheelPicker.setData(item.data || ['默认1', '默认2', '默认3']);
    this.view.addView(this.wheelPicker, 1, flParams);
    if (item.title) {
        this.view.title.setVisibility(0);
        this.view.title.setText(item.title);
    }
    if (item.positiveTextColor) this.view.tv_agree.setTextColor(colors.parseColor(item.positiveTextColor));
    if (item.negativeTextColor) this.view.tv_cancel.setTextColor(colors.parseColor(item.negativeTextColor));

    this.view.tv_cancel.setBackground(createShape(dp2px(5), 0, item.negativeBgColor, [2, (item.negativeStrokeColor || "#000000")]));
    this.view.tv_agree.setBackground(createShape(dp2px(5), 0, item.positiveBgColor, [2, (item.positiveStrokeColor || "#000000")]));
    this.view.tv_cancel.on("click", () => {
        this.mBottomSheetDialog.dismiss();
    })
    return this;
}
BottomWheelPicker.prototype.setData = function (data) {
    this.wheelPicker.setData(data);
    return this;
}
BottomWheelPicker.prototype.show = function () {

    this.mBottomSheetDialog.show();
    return new Promise((resolve, reject) => {
        ///监听关闭事件
        this.mBottomSheetDialog.setOnDismissListener(new DialogInterface.OnDismissListener({
            onDismiss: function (view) {
                reject("弹窗关闭");
            }
        }));
        this.view.tv_agree.on("click", (view) => {

            if (this.state) {
                this.ok = true;
                view.setText("等待");
                return;
            }

            resolve(this.option || {
                text: this.wheelPicker.getCurrentItemText() || this.wheelPicker.getData()[this.wheelPicker.getCurrentItemPosition()],
                index: this.wheelPicker.getCurrentItemPosition(),
            });

            this.mBottomSheetDialog.dismiss();
        })
        this.wheelPicker.setOnWheelChangeListener({
            /**
             * 滚动器状态
             * 0：静止
             * 1: 用户滑动
             * 2: 惯性滚动
             */
            onWheelScrollStateChanged: (state) => {
                this.state = state;
                if (!this.state && this.ok) {
                    resolve(this.option);
                    this.ok = false;
                    this.mBottomSheetDialog.dismiss();
                }
            },
            // 监听滚动结束事件
            onWheelSelected: (text, index) => {
                this.option = {
                    text: text,
                    index: index,

                }
            }
        })
        /**
         * 监听滚动结束事件
        this.wheelPicker.setOnItemSelectedListener({
            onItemSelected: (picker, text, item) => {
                // picker.getCurrentItemPosition()
                this.option = {
                    index: item,
                    text: text,
                }

            },
        });
*/
    })


}
module.exports = new BottomWheelPicker;