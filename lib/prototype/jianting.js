
importClass(android.content.BroadcastReceiver);
importClass(android.content.Intent);
importClass(android.content.IntentFilter);


let intent = new Intent();
let filter = new IntentFilter();
filter.addAction(Intent.ACTION_BATTERY_CHANGED);
filter.addAction("myBroadCast");
filter.addAction("android.intent.action.激活路飞");

let receiver = new JavaAdapter(android.content.BroadcastReceiver, {
  onReceive: function (context, intent) {
    log(intent);
    switch (intent.action) {
      case Intent.ACTION_BATTERY_CHANGED:
        log("ACTION_BATTERY_CHANGED");
        let level = intent.getIntExtra("level", 0);
        toastLog("当前电量:" + level + "%");
        break;
      case "myBroadCast":
        toastLog("打开方式文本");
        let value = intent.getStringExtra("data");
        log("接收到数据 uri: " + value);

        let stream = activity.getContentResolver().openInputStream(Uri.parse(value));
        let isr = new java.io.InputStreamReader(stream, "UTF-8");
        let sb = new java.lang.StringBuffer();
        let br = new java.io.BufferedReader(isr);
        let str;
        while ((str = br.readLine()) != null) {
          sb.append(str);
        }
        stream.close();
        isr.close();
        br.close();
        log(sb);
        toastLog(sb.toString());
        engines.all().map((ScriptEngine) => {
          if (engines.myEngine().toString() !== ScriptEngine.toString()) {
            ScriptEngine.forceStop();
          }
        });
        break;
    }
  },
});
/*
context.registerReceiver(receiver, filter);
events.on("exit", unregisterReceiver);

// ====================自定义函数=====================================================
function unregisterReceiver() {
  receiver && context.unregisterReceiver(receiver);
  toastLog("关闭广播");
}
*/