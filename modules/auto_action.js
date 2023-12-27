

let auto_action = {
    lock_screen() {
        if (device.sdkInt < 28) {
            let message = 'Requires Android 9.0 (API 28) to run this code';
            throw new Error(message);
        }
        return this.performGlobalAction('lock_screen')
    },
    home() {
        return this.performGlobalAction('HOME')
    },
    back() {
        return this.performGlobalAction('BACK');
    },
    recents() {
        return this.performGlobalAction('RECENTES');
    },
    notifications() {
        return this.performGlobalAction('NOTIFICATIONS')
    },
    quick_settings() {
        return this.performGlobalAction('QUICK_SETTINGS')
    },
    power_dialog() {
        return this.performGlobalAction('POWER_DIALOG')
    },

    /**
     * GLOBAL_ACTION_BACK 1 返回
     * GLOBAL_ACTION_HOME 2 回到桌面
     * GLOBAL_ACTION_RECENTS 3 多任务
     * GLOBAL_ACTION_NOTIFICATIONS
     * GESTURE_SWIPE_RIGHT 4 下拉通知栏
     * GLOBAL_ACTION_QUICK_SETTINGS 5 显示快速设置(下拉通知栏到底)
     * GLOBAL_ACTION_POWER_DIALOG 6 电源菜单
     * GLOBAL_ACTION_TOGGLE_SPLIT_SCREEN 7 分屏 需要安卓7或以上。
     * GLOBAL_ACTION_LOCK_SCREEN 
     * MODE_ENABLE_WRITE_AHEAD_LOGGING 8 锁屏 需要安卓9或以上。
     * GLOBAL_ACTION_TAKE_SCREENSHOT
     * GESTURE_SWIPE_LEFT_AND_UP 9 系统截屏
     * 
     */
    /**
     * @中文
     *
     * 模拟全局按键。
     *
     * @param action 全局按键类型。
     * @returns 是否成功。
     *
     * @eng
     *
     * Simulate global key.
     *
     * @param action Global key type.
     * @returns Whether it succeeds.
     */
    performGlobalAction(action) {
        //无障碍服务实例
        let service;
        try {
            service = com.stardust.autojs.core.accessibility.AccessibilityService.Companion.getInstance();
        } catch (e) {
            service = com.mrfz.qiao.AccessibilityService.Companion.getInstance();
        }
        if (!service) {
            throw new Error("无障碍服务未开启或异常");
        }
        if (typeof (action) === 'number') {
            return service.performGlobalAction(action);
        }
        const actionUpperCase = action.toUpperCase();
        return service.performGlobalAction(android.accessibilityservice.AccessibilityService['GLOBAL_ACTION_' + actionUpperCase]);
    },
}
try {
    module.exports = auto_action;
} catch (e) {
    log(auto_action.performGlobalAction(9))
}