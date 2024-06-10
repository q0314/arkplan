let MyAutomator = {
    dirctionReverse: undefined,
    RA: undefined,
    shell: undefined,
    setTapType(tapType) {

        MyAutomator.tapType = {
            '无障碍': 0,
            'RootAutomator': 1,
            'Shell': 2,
            'Root': 3
        }[tapType]; // 0 无障碍， 1 RootAutomator， 2 Shell， 3 普通Root

        console.log('修改automator：' + tapType + '>' + MyAutomator.tapType);
        const self = MyAutomator;
        if (MyAutomator.tapType == 0) {
            ///TOO
        } else if (MyAutomator.tapType == 1) {
            const thd = threads.start(function() {
                // @ts-expect-error d.ts文件问题
                if (!self.RA) self.RA = new RootAutomator();
            });
            // 5秒无响应直接杀死
            setTimeout(() => {
                if (thd.isAlive()) {
                    thd.interrupt();
                    toastLog('RootAutomator初始化失败，可能是环境不支持');
                }
            }, 5000)
        } else if (MyAutomator.tapType == 2) {
            // @ts-expect-error d.ts文件问题
            MyAutomator.shell = new Shell($shell.checkAccess("root"))
            if (!MyAutomator.shell) MyAutomator.shell = new Shell(true);
        } else if (MyAutomator.tapType == 3) {
            // none
        }
    },
    click(x, y) {
        return MyAutomator.press(x, y, random(129, 159));

    },
    press(x, y, delay) {

        if (MyAutomator.dirctionReverse) {

            const dm = context.getResources().getDisplayMetrics();
            const wm = context.getSystemService(context.WINDOW_SERVICE);
            wm.getDefaultDisplay().getRealMetrics(dm);
            const tmpx = dm.heightPixels - y;
            y = x;
            x = tmpx;
        }
        if (MyAutomator.tapType == 0) {
            return press(x, y, delay);

        } else if (MyAutomator.tapType == 1) {
            return MyAutomator.RA.press(x, y, delay);
        } else if (MyAutomator.tapType == 2) {
            return (MyAutomator.shell.execAndWaitFor('input swipe ' + x + ' ' + y + ' ' + x + ' ' + y + ' ' + delay).code == 0);
        } else if (MyAutomator.tapType == 3) {
            return Tap(x, y); // 忽略点击时长, 官方不支持
        }

    },

    swipe(x0, y0, x1, y1, delay) {
        if (MyAutomator.dirctionReverse) {
            const dm = context.getResources().getDisplayMetrics();
            const wm = context.getSystemService(context.WINDOW_SERVICE);
            wm.getDefaultDisplay().getRealMetrics(dm);
            let tmpx = dm.heightPixels - y0;
            y0 = x0;
            x0 = tmpx;
            tmpx = dm.heightPixels - y1;
            y1 = x1;
            x1 = tmpx;
        }

        if (MyAutomator.tapType == 0) {
            // MyAutomator.bezierSwiper.swipe(x0, y0, x1, y1, delay);
            return swipe(x0, y0, x1, y1, delay);
        } else if (MyAutomator.tapType == 1) {
            // MyAutomator.bezierSwiper.swipe(x0, y0, x1, y1, delay);
            return MyAutomator.RA.swipe(x0, y0, x1, y1, delay);
        } else if (MyAutomator.tapType == 2) {
            return (MyAutomator.shell.execAndWaitFor('input swipe ' + x0 + ' ' + y0 + ' ' + x1 + ' ' + y1 + ' ' + delay) == 0);
        } else if (MyAutomator.tapType == 3) {
            return Swipe(x0, y0, x1, y1, delay);
        }
    },


}
try {
    module.exports = MyAutomator;
} catch (e) {
    var height = device.height;
    var width = device.width;
    var zox = (value) => {
            return Math.floor((height / 2712) * value);
        },
        zoy = (value) => {
            return Math.floor((width / 1220) * value);
        };
    let gesturexy = [
        [height / 2, width / 2, zox(300), width / 2,800],
        [height / 2, width / 2, height - zox(500), width / 2, 800]
    ];
   // gesturexy = gesturexy[1]
  //  swipe.apply(swipe,gesturexy)
    //[0], gesturexy[1], gesturexy[2], gesturexy[3], gesturexy[4]);
// 分辨率
// 分辨率
let h = 2712;
let w = 1220;

// 已知按钮坐标
let button1X = 163;
let button8X = 2540;

// 计算按钮间隔
let interval = (button8X - button1X) / (8 - 1); // 计算按钮间隔

// 获取线上的按钮坐标
function getButtonCoordinates(yPosition) {
    let buttons = [];

    // 循环添加按钮坐标
    for (let i = 1; i <= 8; i++) {
        let buttonX = Math.floor(button1X + (i - 1) * interval); // 使用间隔计算按钮 X 坐标
        let buttonY = yPosition;
        buttons.push([buttonX, buttonY]);
    }

    return buttons;
}

// 使用例子
let yPosition = 1140; // 线上的y轴坐标
let buttonCoords = getButtonCoordinates(yPosition);
log(buttonCoords);
log(parseInt(h/1.068))
sleep(500)
let v = "拟战场域|作战补给|后勤保养|军备突破|成员特训|螺母大作战|战技演习|辅助加装";
let newArray = v.split("|");
console.log(newArray)

MyAutomator.tapType =0
MyAutomator.click.apply(MyAutomator,buttonCoords[0])
for(let i of buttonCoords){
   // click(i[0],i[1]);
   // sleep(800);
}
    
}