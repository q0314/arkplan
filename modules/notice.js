
importClass(android.content.ComponentName);
importClass(android.app.PendingIntent);
importClass(android.content.Context);
importClass(android.graphics.Bitmap);
importClass(android.graphics.drawable.Icon);
importClass(android.app.NotificationChannel);
importClass(android.app.NotificationManager);
importClass(android.app.Notification);
/* -------------------------------------------------------------------------- */
//参考文章https://developer.android.google.cn/reference/androidx/core/app/NotificationCompat
let icon;
let notification;
let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);

events.on("exit", function () {
    try {
        icon.large.recycle();
    } catch (e) { }
});

/**
 * 发送通知
 * @param {*} title 
 * @param {*} text 
 * @param {object} list 
 * @param {number} [list.category = undefined] - 通知类别名称,
 * @param {number} [list.priority = 0]  - 通知优先级, 0:默认通知优先级。1:对于更重要的通知或警报，通知优先级更高。-1 :对于不太重要的项目，通知优先级较低。2:最高通知优先级 ，适用于需要用户及时注意或输入的应用程序的最重要项目。-2:最低通知优先级 ;除非在特殊情况下，例如详细的通知日志，否则可能不会向用户显示这些项目。
 * @param {string} [list.text]  - 内容
 * @param {string} [list.subText] - 通知中上描述
 * @param {boolean} [list.ongoing = true] - 是否常驻 
 * @param {boolean} [list.autoCancel = true] - 是否自动消失
 */
function notice(title, text, list) {
    icon = getIcon();
    if (!title) {
        console.error("标题为null");
        return false;
    }
    if (typeof text == "object") {
        list = text;
    };

    list = {
        id: list.id || "id",
        category: list.category || "默认通知",
        description: list.description || list.category,
        showBadge: list.showBadge,
        text: list.text || text,
        subText: list.subText || list.category,
        ongoing: list.ongoing,
        priority: list.priority,
        autoCancel: list.autoCancel
    };

    switch (list.priority) {
        case 0:
        case undefined:
            list.priority = Notification.PRIORITY_DEFAULT;
            break;
        case 1:
            list.priority = Notification.PRIORITY_HIGH;
            break;
        case 2:
            list.priority = Notification.PRIORITY_MAX;
            break;
        case -1:
            list.priority = Notification.PRIORITY_LOW;
            break;
        case -2:
            list.priority = Notification.PRIORITY_MIN;
            break;
    }
    if (!notification) {

        let channel = new NotificationChannel(list.id, list.category, NotificationManager.IMPORTANCE_DEFAULT);
        channel.setShowBadge((list.showBadge == undefined) ? false : list.showBadge); // 显示徽章, 桌面app图标右上角有小红点
        channel.setDescription(list.description)
        manager.createNotificationChannel(channel);
    }
    notification = new Notification.Builder(context, list.id)
        //标题
        .setContentTitle(title)
        //中上描述
        .setSubText(list.subText)
        //内容
        .setContentText(list.text)
        //图标
        .setSmallIcon(icon.small)
        //时间
        .setShowWhen(true)
        //常驻
        .setOngoing((list.ongoing == undefined) ? true : list.ongoing)
        // .setLargeIcon(icon.large)
        //优先级,也可在new NotificationChannel时设置
        .setPriority(list.priority)
        .setTicker(list.category)
        // 是否自动消失
        .setAutoCancel((list.autoCancel == undefined) ? true : list.autoCancel)
        //设置意图
        .setContentIntent(
            PendingIntent.getActivity(
                context,
                0,
                new Intent().setComponent(
                    new ComponentName(context.getPackageName(), "com.stardust.autojs.inrt.SplashActivity")
                ),
                PendingIntent.FLAG_UPDATE_CURRENT
            )
        )
        .build();
    manager.notify(0, notification);

}

function getIcon() {
    let bitmap = createBitmap();
    return {
        small: Icon.createWithBitmap(bitmap),
    };
}

function createBitmap() {
    // 24dp
    let size = 36;
    let width = dp2px(size);
    let paint = new Paint();
    paint.setStyle(Paint.Style.FILL);
    paint.setAntiAlias(true);
    let bitmap = Bitmap.createBitmap(width, width, Bitmap.Config.ARGB_8888);
    let colorList = ["#dd7694", "#c3d94e", "#535164", "#779649"];
    let canvas = new Canvas(bitmap);
    paint.setColor(colors.parseColor(colorList[0]));
    canvas.drawRect(0, 0, width / 2, width / 2, paint);
    paint.setColor(colors.parseColor(colorList[1]));
    canvas.drawRect(width / 2, 0, width, width / 2, paint);
    paint.setColor(colors.parseColor(colorList[2]));
    canvas.drawRect(0, width / 2, (width / 2) * 1, width, paint);
    paint.setColor(colors.parseColor(colorList[3]));
    canvas.drawRect(width / 2, width / 2, width, width, paint);
    return bitmap;
}

function dp2px(dp) {
    const scale = context.getResources().getDisplayMetrics().density;
    return Math.floor(dp * scale + 0.5);
}
module.exports = notice;