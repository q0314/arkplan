/*
 * Drawable 工具
 */

module.exports = (function () {
    
function MyDrawableUtil() {
    importClass(android.graphics.Bitmap);
    importClass(android.graphics.BitmapFactory);
    importClass(android.graphics.drawable.BitmapDrawable);
    const resources = context.getResources();
    /** dp2px 互转 */
    const scale = resources.getDisplayMetrics().density;
    let dp2px = dp => parseInt(Math.floor(dp * scale + 0.5));
    let px2dp = px => parseInt(Math.floor(px / scale + 0.5));

    this.create = function (name, size) {
        if(name == "返回") name = "@drawable/ic_arrow_back_black_48dp";
        return zoomImage(getResID(name), dp2px(size))
    }

    function getResID(name) {
        return resources.getIdentifier(name, "drawable", context.getPackageName())
    }

    function zoomImage(resId, size) {
        let oldBmp = BitmapFactory.decodeResource(resources, resId);
        let newBmp = Bitmap.createScaledBitmap(oldBmp, size, size, true);
        let drawable = new BitmapDrawable(resources, newBmp);
        oldBmp.recycle();
        return drawable;
    }
}
return new MyDrawableUtil();
})();