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


let tool;
if (files.exists("./modules/tool.js")) {

    tool = require("./modules/tool.js");
} else {
    tool = require("./tool.js");
}
let morikujima_setting = tool.readJSON("morikujima_setting")
if (morikujima_setting && morikujima_setting.ap) {
    /* function testing() {
         morikujima_setting = tool.readJSON("morikujima_setting")
         if (!morikujima_setting.通知) {
             exit()
         }
         icon = getIcon();
         var ms = new Date(new Date()).getTime() - new Date(morikujima_setting.理智时间).getTime()
         let hflz = Math.floor(ms / 60 / 1000);
         if (hflz == -1) {
             return
         }
 
 
         hflz = Math.floor(hflz / 6) + Number(morikujima_setting.已有理智);
         if (hflz >= Number(morikujima_setting.理智数.split("/")[1])) {
             hflz = Number(morikujima_setting.理智数.split("/")[1])
         }
 
         let sylz = Number(morikujima_setting.理智数.split("/")[1]) - hflz;
         if (sylz == 0) {
             notice("理智：" + hflz + " / " + morikujima_setting.理智数.split("/")[1] + sense_tips(hflz))
             return
         }
         if (sylz <= 3) {
             notice("理智：" + hflz + " / " + morikujima_setting.理智数.split("/")[1] + "\n ——即将溢出，" + sense_tips(hflz))
             return
         }
         notice("理智：" + hflz + " / " + morikujima_setting.理智数.split("/")[1] + "\n ——" + sense_tips(hflz))
 
 
      
 
     }
     */

    function testing() {

        morikujima_setting = tool.readJSON("morikujima_setting")
        if (!morikujima_setting.通知) {
            exit()
        }
        icon = getIcon();
        let ap_current;
        if (morikujima_setting.ap.completeRecoveryTime == -1) {
            ap_current = morikujima_setting.ap.current;
        } else if (morikujima_setting.ap.completeRecoveryTime < morikujima_setting.ap.currentTs) {
            ap_current = morikujima_setting.ap.max;
        } else {
            ap_current = Math.floor((morikujima_setting.ap.currentTs - morikujima_setting.ap.lastApAddTime) / (60 * 6)) + morikujima_setting.ap.current;
        }


        notice("理智：" + ap_current + "/" + morikujima_setting.ap.max, convertSec2DayHourMin(morikujima_setting.ap.completeRecoveryTime - morikujima_setting.ap.currentTs));

        function convertSec2DayHourMin(Sec) {

            if (Sec <= 0) return "——已溢出，博士，现在还不能休息哦"

            let str = "";
            let min = Math.floor(Sec / 60);
            let hour = Math.floor(min / 60);
            let day = Math.floor(hour / 24);

            let cnt = 0;

            if (day > 0) {
                str = str + day + "天";
                hour = hour % 24;
                cnt++;
            }
            if (hour > 0) {
                str = str + hour + "小时";
                min = min % 60;
                cnt++;
            } else {
                str = str + "00小时";
                min = min % 60;
                cnt++;
            }


            if (cnt < 2) {
                str = str + min + "分";
            }
            return "——将在" + str + "后完全恢复"

        }
    }

    testing()
    setInterval(testing, 1000 * 60 * 6);
}

/* -------------------------------------------------------------------------- */
function notice(title, text) {

    if (!notification) {
        /**
         * id ,通知类别名称,通知优先级
         * PRIORITY_DEFAULT = 0  的默认通知优先级为 。setPriority
         * PRIORITY_HIGH = 1 对于更重要的通知或警报，通知优先级更高。setPriority
         * PRIORITY_LOW = -1 对于不太重要的项目，通知优先级较低。setPriority
         * PRIORITY_MAX = 2 的最高通知优先级为 ，适用于需要用户及时注意或输入的应用程序的最重要项目。setPriority
         * PRIORITY_MIN = -2 的最低通知优先级为 ;除非在特殊情况下，例如详细的通知日志，否则可能不会向用户显示这些项目。setPriority
         */
        let channel = new NotificationChannel("id", "实时便笺", NotificationManager.IMPORTANCE_DEFAULT);
        channel.setShowBadge(false); // 显示徽章, 桌面app图标右上角有小红点
        channel.setDescription("理智提醒")
        manager.createNotificationChannel(channel);
        notification = new Notification.Builder(context, "id")
            //标题
            .setContentTitle(title)
            //右下角描述
            .setSubText("实时便笺")
            //内容
            .setContentText(text)
            //图标
            .setSmallIcon(icon.small)
            //时间
            .setShowWhen(true)
            //常驻
            .setOngoing(true)
            // .setLargeIcon(icon.large)
            //优先级,也可在new NotificationChannel时设置
            .setPriority(Notification.PRIORITY_DEFAULT)
            .setTicker("实时便笺")
            // 是否自动消失
            .setAutoCancel(true)
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
    } else {
        notification = new Notification.Builder(context, "id")
            //标题
            .setContentTitle(title)
            //右下角描述
            .setSubText("实时便笺")
            //内容
            .setContentText(text)
            //图标
            .setSmallIcon(icon.small)
            //时间
            .setShowWhen(true)
            //常驻
            .setOngoing(true)
            // .setLargeIcon(icon.large)
            .setTicker("实时便笺")
            .setAutoCancel(true)
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