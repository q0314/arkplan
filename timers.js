importClass(android.widget.AdapterView);
importClass(android.content.Context);
importClass(android.provider.Settings);

var intent = engines.myEngine().execArgv.intent;

sleep(100);
log(intent);
if (intent == null) {
    toastLog("请使用定时任务运行此脚本");
    exit();
};
device.wakeUp();
device.wakeUpIfNeeded();

let extras = intent.extras;
let id_str;
if (extras) {
    let iter = extras.keySet().iterator();
    while (iter.hasNext()) {
        let key = iter.next();
        if (key == "task_id") {
            id_str = extras.get(key);
            break;
        }

    }
}

toast("定时任务执行中");
console.warn("定时任务执行中");

if (id_str == undefined) {
    toast("定时任务id为空，取消执行")
    console.error("定时任务id为空，取消执行")
    exit();
}

判断();
function 判断() {
    var Floaty;
    var Timing_data;
    let tool = require("./modules/tool.js");
    var setting = tool.readJSON("configure");
    var storage_d = storages.create("time");
    var timers = storage_d.get("items");
    sleep(100);


    if (floaty.checkPermission() == false) {
        console.error("定时任务启动失败，请先授予明日计划悬浮窗权限！");
        return;
    }

    if (tool.autoService(true) == false) {
        toast("定时任务启动失败，无障碍服务异常！请检查是否正常开启！");
        console.error("定时任务启动失败，无障碍服务异常！请检查是否正常开启！");
        return;
    };

    if (!files.exists("./mrfz/tuku/导航.png")) {
        toast("定时任务启动失败，图库缺失,请在主页左上角重新选择!")
        console.error("定时任务启动失败，图库缺失,请在主页左上角重新选择!")
        return;
    }
    if (setting.设置电量) {
        if (!device.isCharging() && device.getBattery() < setting.电量) {
            toast("定时任务启动失败，电量低于设定值" + setting.电量 + "%且未充电");
            console.error("定时任务启动失败，电量低于设定值" + setting.电量 + "%且未充电");
            if (setting.震动) {
                device.vibrate(2000);
            };
            return;
        };
    };


    log("尝试唤醒设备");
     device.wakeUpIfNeeded()
    if (!device.isScreenOn()) {
        if (storage_d.get("noticeWaken")) {
            require("./modules/notice.js")("唤醒屏幕", {
                id: "定时任务",
                priority: 2,
                ongoing:false,
                category: "定时任务",
                description: "发送通知优先级最高的通知信息使系统唤醒屏幕",
                text: "当device.wakeUp()命令无法点亮屏幕时，发送通知优先级最高的通知信息使系统唤醒屏幕"
            });
        } else {
            device.wakeUp();
        }
    };
    if (setting.解锁屏幕) {

        log('======解锁屏幕======')

        let password = storage_d.get("password")
        let ExternalUnlockDevice = files.exists(password) ? require(password) : null

        if (ExternalUnlockDevice) {
            log('使用自定义解锁模块');
            try {
                ExternalUnlockDevice.implement();

            } catch (err) {
                toastLog("自定义解锁模式发生异常：" + err)
                console.error("自定义解锁模式发生异常：" + err)
                exit();
            }
        } else {

            let {
                config,
            } = require('./lib/config.js')(runtime, this)
            let singletonRequire = require('./lib/SingletonRequirer.js')(runtime, this)
            let unlocker = require('./lib/Unlock.js')
            let runningQueueDispatcher = singletonRequire('RunningQueueDispatcher')
            let {
                logInfo,
                errorInfo,
            } = singletonRequire('LogUtils')
            let commonFunctions = singletonRequire('CommonFunction')

            // 避免定时任务打断前台运行中的任务
            commonFunctions.checkAnyReadyAndSleep()
            commonFunctions.delayIfBatteryLow()
            // ------ WARING END ------

            logInfo('使用内置解锁模块')
            try {
                unlocker.exec()
            } catch (e) {
                if (/无障碍/.test(e + '')) {
                    commonFunctions.disableAccessibilityAndRestart()
                }
                if (!config.forceStop) {
                    errorInfo('解锁发生异常, 三分钟后重新开始' + e)
                    commonFunctions.printExceptionStack(e)
                    commonFunctions.setUpAutoStart(3)
                    runningQueueDispatcher.removeRunningTask()
                    exit()
                }
            }
            logInfo('解锁成功')
        }

    } else {
        toast("未开启自动解锁屏幕，仅点亮屏幕尝试下")
        console.warn("未开启自动解锁屏幕，仅点亮屏幕尝试下")
        device.wakeUp();
    }

    console.info("定时任务ID：" + id_str)
    timers = storage_d.get("items");
    for (let i = 0; i < timers.length; i++) {
        console.info("任务配置ID：" + timers[i].id)
        if (timers[i].id == id_str) {
            Timing_data = timers[i];
            id_str = i;
            break
        }
    }
    sleep(200)
    if (Timing_data == undefined) {
        throw new Error("解析数据失败, 未定义：" + Timing_data)
    }
    /*  try {
          switch (Timing_data.type) {
              case '自定义模式':
                  Timing_data.type = "自定义模块";
                  break;
              case '上次':
                  Timing_data.type = "上次";
                  setting.指定关卡.levelAbbreviation == "上次";
                  break;
              case '基建收菜':
                  Timing_data.type = "定时基建";
                  break;
              case '龙门外环':
                  Timing_data.type = "定时剿灭";
                  break;
              default:
                  toastLog("未匹配到的数据:" + JSON.stringify(Timing_data))
                  exit()
                  break;
          }
      } catch (err) {
          console.error(JSON.stringify(Timing_data))
          throw new Error(" 解析数据失败, " + err.message)
      }  */
    switch (Timing_data.The_server) {
        case '简中服':
            Timing_data.The_server = "com.hypergryph.arknights"
            break;
        case '繁中服':
            Timing_data.The_server = "tw.txwy.and.arknights"
            break
        case 'B服':
            Timing_data.The_server = "com.hypergryph.arknights.bilibili"
            break;
        default:
            toastLog(" 未匹配到的数据:" + JSON.stringify(Timing_data))
            exit()
            break;
    }

    sleep(500);
    app.launchPackage(context.getPackageName())
    sleep(1500);
    $settings.setEnabled('foreground_service', true);
    sleep(500)
    if (Floaty = tool.script_locate("Floaty.js")) {
        toastLog("关闭上一个悬浮窗，启动新程序")
        Floaty.emit("暂停", "关闭程序");
    };
    tool.writeJSON("执行", Timing_data.type);

    setting.指定关卡.levelAbbreviation = Timing_data.specified;
    tool.writeJSON("指定关卡", setting.指定关卡);
    if (Timing_data.frequency) {
        tool.writeJSON(Timing_data.frequency[0], Timing_data.frequency[1]);
    }
    if (Timing_data.reason != false) {
        tool.writeJSON("理智", Timing_data.reason);
    }
    tool.writeJSON("音量", Timing_data.volume);
    sleep(500);
    tool.writeJSON("包名", Timing_data.The_server);


    let js = "./Floaty.js"
    if (files.exists("f_main.js")) {
        js = "./c_Floaty.js"
    }
    engines.execScriptFile(js)

    setTimeout(function () {
        if (Timing_data.screen) {
            console.info("将在熄屏状态下运行此定时任务")
            let execution = engines.all();
            for (let i = 0; i < execution.length; i++) {
                if (execution[i].getSource().toString().indexOf("Screen operation") > -1) {
                    console.verbose("已停止运行同名脚本")
                    execution[i].forceStop();
                }
            }
            engines.execScript("Screen operation", "if(files.exists(files.path('./module/screen.js'))){require('./module/screen.js').mask()}else{require('./screen.js').mask()}");
        };
    }, 5000)
    setTimeout(function () {
        if (Timing_data.shijian.indexOf("单次") != -1) {
            console.verbose("删除单次定时任务")
            timers.splice(id_str, 1);
            storage_d.put("items", timers);
        }
        threads.shutDownAll();
        exit();
    }, 30000);

};
/*
threads.start(function(){
engines.execScript("new Timers", "var Config=engines.myEngine().execArgv;var id_str = Config.id;eval(Config.load)();", {
    arguments: {
        load: 判断.toString(),
        id: id_str,
    },
});
});
*/