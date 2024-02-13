

let notice;
let tool;
if (files.exists("./modules/tool.js")) {
    notice = require("./modules/notice.js");
    tool = require("./modules/tool.js");
} else {
    notice = require("./notice.js");
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

        let ap_current;
        if (morikujima_setting.ap.completeRecoveryTime == -1) {
            ap_current = morikujima_setting.ap.current;
        } else if (morikujima_setting.ap.completeRecoveryTime < morikujima_setting.ap.currentTs) {
            ap_current = morikujima_setting.ap.max;
        } else {
            ap_current = Math.floor((morikujima_setting.ap.currentTs - morikujima_setting.ap.lastApAddTime) / (60 * 6)) + morikujima_setting.ap.current;
        }


        notice("理智：" + ap_current + "/" + morikujima_setting.ap.max, convertSec2DayHourMin(morikujima_setting.ap.completeRecoveryTime - morikujima_setting.ap.currentTs),{
            category:"实时便笺",
            description:"理智提醒"
        });

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

