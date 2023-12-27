
importClass(android.view.Gravity);
importClass(android.graphics.PorterDuff);
importClass(android.content.res.ColorStateList);
importClass(android.graphics.drawable.LayerDrawable);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.text.Spanned);
importClass(android.text.SpannableString);
importClass(android.text.style.RelativeSizeSpan);
importClass(android.text.style.ForegroundColorSpan);
importClass(android.text.style.AbsoluteSizeSpan);

module.exports = (function () {
    util.extend(SwitchWidget, ui.Widget);
    const resources = context.getResources();
    const scale = resources.getDisplayMetrics().density;


    function SwitchWidget() {
        ui.Widget.call(this);
        //trackColor 开关轨道选中颜色
        this.defineAttr("trackColor", (view, attr, value, defineSetter) => {
            view.widget.track_color = value;
        });
        this.defineAttr("thumbSize", (view, attr, value, defineSetter) => {
            view.setThumbSize(eval(value));
        });
        this.defineAttr("thumbWidth", (view, attr, value, defineSetter) => {
            view.setThumbWidth(eval(value));
        });
        this.defineAttr("thumbHeight", (view, attr, value, defineSetter) => {
            view.setThumbHeight(eval(value));
        });
        this.defineAttr("thumbPadding", (view, attr, value, defineSetter) => {
            view.setThumbPadding(eval(value));
        });
        this.defineAttr("radius", (view, attr, value, defineSetter) => {
            view.setRadius(eval(value));
        });
        this.track_color = '#0d84ff';
        
    }
      
    SwitchWidget.prototype.track_color = '#0d84ff'

    SwitchWidget.prototype.render = function () {
       if(SwitchWidget != null){
        return <Switch />
       }
    }

    SwitchWidget.prototype.onViewCreated = function (view) {
        let mWidth, mHeight, mRadius, mPadding;
        let mTrackgd, mTrackld, mThumbgd, mThumbld;
        let mTextOn, mTextOff, mTextOnColor, mTextOffColor;
        let mTextOnSpan, mTextOffSpan;
        /** Drawable Config */
        mWidth = dp2px(20);
        mHeight = dp2px(20);
        mRadius = dp2px(15);
        mPadding = dp2px(1);
        /** Track Drawable */
        mTrackgd = new GradientDrawable();
        mTrackld = new LayerDrawable([mTrackgd]);
        /** Thumb Drawable */
        mThumbgd = new GradientDrawable();
        mThumbld = new LayerDrawable([mThumbgd]);
        /** update Drawable */
        mTrackld.setPadding(mPadding, 0, 0, 0);
        mThumbld.setLayerGravity(0, Gravity.CENTER_VERTICAL);
        updateSize();
        updateRadius();
        view.setTrackDrawable(mTrackld);
        view.setThumbDrawable(mThumbld);
        /** view event */
        view.createColorStateList = function (normal, checked) {
            return createColorStateList(normal, checked);
        }
        view.setThumbWidth = function (dp) {
            mWidth = dp2px(dp);
            updateSize();
        }
        view.setThumbHeight = function (dp) {
            mHeight = dp2px(dp);
            if (mTextOnSpan) {
                let mSizeSpan = new AbsoluteSizeSpan(parseInt(mHeight / 3), false);
                mTextOnSpan.setSpan(mSizeSpan, 0, mTextOn.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
                mTextOffSpan.setSpan(mSizeSpan, 0, mTextOff.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
            }
            updateSize();
        }
        view.setThumbSize = function (dp) {
            mWidth = dp2px(dp);
            mHeight = dp2px(dp);
            if (mTextOnSpan) {
                let mSizeSpan = new AbsoluteSizeSpan(parseInt(mHeight / 3), false);
                mTextOnSpan.setSpan(mSizeSpan, 0, mTextOn.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
                mTextOffSpan.setSpan(mSizeSpan, 0, mTextOff.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
            }
            updateSize();
        }
        view.setRadius = function (dp) {
            mRadius = dp2px(dp);
            updateRadius();
        }
        view.setThumbPadding = function (dp) {
            mPadding = dp2px(dp);
            mTrackld.setPadding(mPadding, 0, 0, 0);
            updateSize();
            updateRadius();
        }
        view.restructure = function (action) {
            action(view, {
                gd: mTrackgd,
                ld: mTrackld,
                tint: view.getTrackTintList()
            }, {
                gd: mThumbgd,
                ld: mThumbld,
                tint: view.getThumbTintList()
            }, dp2px);
        }
        view.setThumbTexts = function (on, off) {
            log(on, off)
            mTextOn = on || 'on';
            mTextOff = off || 'off';
            view.setShowText(true);
            mTextOnSpan = createTextSpan(mTextOn);
            mTextOffSpan = createTextSpan(mTextOff);
            if (mTextOnColor && mTextOffColor) {
                mTextOnSpan.setSpan(mTextOnColor, 0, mTextOn.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
                mTextOffSpan.setSpan(mTextOffColor, 0, mTextOff.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
            }
            view.setTextOn(mTextOnSpan);
            view.setTextOff(mTextOffSpan);
            
        }
        view.setThumbTextColors = function (onColor, offColor) {
            mTextOnColor = new ForegroundColorSpan(colors.parseColor(onColor || '#FAFAFA'));
            mTextOffColor = new ForegroundColorSpan(colors.parseColor(offColor || '#FAFAFA'));
            if (!mTextOffSpan || !mTextOffSpan) return
            mTextOnSpan.setSpan(mTextOnColor, 0, mTextOn.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
            mTextOffSpan.setSpan(mTextOffColor, 0, mTextOff.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
        }
        view.setTrackTintMode(PorterDuff.Mode.SRC);

        function updateSize() {
            mTrackld.setLayerWidth(0, (mWidth * 2) - mPadding * 2);
            mTrackld.setLayerHeight(0, mHeight);
            mThumbld.setLayerWidth(0, mWidth - mPadding * 2);
            mThumbld.setLayerHeight(0, mHeight - mPadding * 2);
            invalidate();
        }

        function updateRadius() {
            mTrackgd.setCornerRadius(mRadius);
            mThumbgd.setCornerRadius(mRadius - mPadding);
            invalidate();
        }

        function invalidate() {
            mTrackld.setDrawable(0, mTrackgd);
            mThumbld.setDrawable(0, mThumbgd);
            view.setTrackDrawable(mTrackld);
            view.setThumbDrawable(mThumbld);
            /** Switch Thumb Track TintList */
            view.setThumbTintList(createColorStateList('#FFFFFF', '#FFFFFF'));
            view.setTrackTintList(createColorStateList('#7A999999', view.widget.track_color));
            view.invalidate();
        }

        function createTextSpan(str) {
            let mSpan = new SpannableString(str);
            let mSizeSpan = new AbsoluteSizeSpan(parseInt(mHeight / 3), false);
            let mColorSpan = new ForegroundColorSpan(colors.parseColor('#FAFAFA'));
            mSpan.setSpan(mSizeSpan, 0, str.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
            mSpan.setSpan(mColorSpan, 0, str.length, Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
            return mSpan;
        }
    }

    SwitchWidget.prototype.onFinishInflation = function (view) {
        /** Switch Thumb Track TintList */
        view.setThumbTintList(createColorStateList('#FFFFFF', '#FFFFFF'));
        view.setTrackTintList(createColorStateList('#7A999999', view.widget.track_color));
    };

    function dp2px(dp) {
        return Math.floor(dp * scale + 0.5);
    }

    function createColorStateList(normal, checked) {
        let __attrs__ = new Array(2);
        __attrs__[0] = [-android.R.attr.state_checked];
        __attrs__[1] = [android.R.attr.state_checked];
        let __colors__ = new Array(2);
        __colors__[0] = colors.parseColor(normal);
        __colors__[1] = colors.parseColor(checked);
     if(new ColorStateList(__attrs__, __colors__) != null){
        return new ColorStateList(__attrs__, __colors__);
    }
    }

    ui.registerWidget("widget-switch-se7en", SwitchWidget);
    return SwitchWidget;
})();