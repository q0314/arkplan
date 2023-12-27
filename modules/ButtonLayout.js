/**
 * 生成带图标的按钮
 */
module.exports = (function() {
    importClass(android.graphics.Color);
    importClass("androidx.core.graphics.drawable.DrawableCompat");
    util.extend(ButtonLayout, ui.Widget);

    function ButtonLayout() {
        ui.Widget.call(this);
        this.defineAttr("leftDrawable", (view, attr, value, defineSetter) => {
            view.widget.mLeftDrawable = value;
            var lDrawable = context.getResources().getDrawable(getResourceID(value));
            lDrawable.setBounds(0, 0, view.widget.mLeftDrawableSize, view.widget.mLeftDrawableSize);
            let wrappedDrawable = DrawableCompat.wrap(lDrawable);
            //侧边栏图标色
            DrawableCompat.setTint(wrappedDrawable, Color.parseColor("#FFFFFF"));
            view.setCompoundDrawables(lDrawable, null, null, null);
        });
    }
    ButtonLayout.prototype.mLeftDrawable = null;
    //图标大小
    ButtonLayout.prototype.mLeftDrawableSize = dp2px(20);
    //侧边栏
    ButtonLayout.prototype.render = function() {
        return (
            <TextView
                        bg="?attr/selectableItemBackground"
                        gravity="left|center_vertical"
                        textColor="#FFFFFF"
                        textStyle="normal"
                        typeface="monospace"
                        padding="15 10"
                        drawablePadding="10"
                        />
        );
    };

    function getResourceID(name) {
        let resource = context.getResources();
        return resource.getIdentifier(name, "drawable", context.getPackageName());
    }
    ui.registerWidget("button-layout", ButtonLayout);
    return ButtonLayout;
})();