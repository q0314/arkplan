let path = context.getPackageResourcePath()

log(path)
var myPid = android.os.Process.myPid();
var am = context.getSystemService(java.lang.Class.forName("android.app.ActivityManager"));
let arr = util.java.array("int", 1);
var list = am.getRunningAppProcesses();
for (var i = 0; i < list.size(); i++) {
  var info = list.get(i);
  arr[0] = info.pid;
  let memoryInfoArray = am.getProcessMemoryInfo(arr);
  let totalPrivateDirty = (memoryInfoArray[0].getTotalPrivateDirty() / 1024).toFixed(2) + "mb的内存";
  log("pid: " + info.pid + " totalPrivateDirty: " + totalPrivateDirty + " processName: " + info.processName);
}
log("myPid: " + myPid);