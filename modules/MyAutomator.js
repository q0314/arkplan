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
       return MyAutomator.press(x, y, random(149,160));
       
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

module.exports = MyAutomator;