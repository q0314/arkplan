

importClass(android.appwidget.AppWidgetManager);
importClass(android.appwidget.AppWidgetProvider);
importClass(android.content.ComponentName);
importClass(android.content.Context);
importClass(android.content.Intent);

importClass(android.widget.RemoteViews);
var SklandWidget = {
    onUpdate: function(context, appWidgetManager, appWidgetIds) {
        for (var i = 0; i < appWidgetIds.length; i++) {
            this.updateAppWidget(context, appWidgetManager, appWidgetIds[i]);
        }
    },

    onEnabled: function(context) {
        // Enter relevant functionality for when the first widget is created
    },

    onDisabled: function(context) {
        // Enter relevant functionality for when the last widget is disabled
    },

    onReceive: function(context, intent) {
        if (intent.getAction() === "MANUAL_UPDATE") {
            var appWidgetManager = android.appwidget.AppWidgetManager.getInstance(context);
            var appWidgetIds = appWidgetManager.getAppWidgetIds(new android.content.ComponentName(context.getPackageName(), SklandWidget.class.getName()));
            for (var i = 0; i < appWidgetIds.length; i++) {
                this.updateAppWidget(context, appWidgetManager, appWidgetIds[i]);
            }
        }
    },

    updateAppWidget: function(appWidgetManager, appWidgetId) {
     
        var views = new android.widget.RemoteViews(context.getPackageName(), uii);
        appWidgetManager.updateAppWidget(appWidgetId, views);
        if (this.getAutoSign(context)) {
            NetWorkTask.doAttendance(context);
        }
    },

    getAutoSign: function(context) {
        // TODO: Implement your getAutoSign logic here
        return false;
    }
};
let uii = XmlToView(
   <FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
   >

    <ImageView
        android:id="@+id/widget_bg"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:contentDescription="@null"
        />

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:gravity="center">

        <TextView
            android:id="@+id/appwidget_text"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:clickable="true"
              android:textSize="25sp"
            android:textStyle="bold" />

        <ImageView
            android:layout_width="35dp"
            android:layout_height="35dp"
            android:layout_gravity="center"
            android:src="@drawable/ic_accessibility_black_48dp" />
    </LinearLayout>


</FrameLayout>);
function XmlToView(xml) {
    runtime.ui.layoutInflater.setContext(context);
    //return xml.toXMLString().toString()
    return runtime.ui.layoutInflater.inflate(xml.toXMLString().toString(), null, true);
};
var NetWorkTask = {
    doAttendance: function(context) {
        new java.lang.Thread({
            run: function() {
                try {
                    // TODO: Implement your doAttendance logic here
                } catch (e) {
                    android.util.Log.e(TAG, "error with", e);
                }
            }
        }).start();
    }
};

var GameInfo = {
    ap: {
        max: 0,
        current: 0,
        recoverTime: 0
    }
};

function getGameInfo(tree) {
    var currentTs = tree.at("/data/currentTs").asInt();
    var ap_current = tree.at("/data/status/ap/current").asInt();
    var ap_max = tree.at("/data/status/ap/max").asInt();
    var ap_lastApAddTime = tree.at("/data/status/ap/lastApAddTime").asInt();
    var ap_recover = tree.at("/data/status/ap/completeRecoveryTime").asInt();
    GameInfo.ap.max = ap_max;
    if (ap_recover == -1) {
        GameInfo.ap.current = ap_current;
        GameInfo.ap.recoverTime = -1;
    } else if (ap_recover < currentTs) {
        GameInfo.ap.current = ap_max;
        GameInfo.ap.recoverTime = -1;
    } else {
        GameInfo.ap.current = Math.floor((currentTs - ap_lastApAddTime) / (60 * 6)) + ap_current;
        GameInfo.ap.recoverTime = ap_recover - currentTs;
    }
}
try{
module.exports = SklandWidget;
}catch(e){

}

SklandWidget.updateAppWidget()