/*
 * @Author: TonyJiangWJ
 * @Date: 2019-11-05 09:12:00
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-12-24 21:37:27
 * @Description: 
 */
let {
    config: _config,
    storageName: _storageName
} = require('./config.js')(runtime, this)
//let singletonRequire = require('./SingletonRequirer.js')(runtime, this)

let {
    logInfo,
    errorInfo,
    warnInfo,
    debugInfo
} = require('./prototype/LogUtils.js')
let FileUtils = require('./prototype/FileUtils.js')
let _commonFunctions = require('./prototype/CommonFunction.js')
let _runningQueueDispatcher = require('./prototype/RunningQueueDispatcher.js')
var storage = storages.create("time");
//从storage获取todo列表
var password = storage.get("password")
/*let ExternalUnlockDevice = files.exists(password) ? require(password) : null

if (ExternalUnlockDevice) {
  logInfo('使用自定义解锁模块')
} else {
  logInfo('使用内置解锁模块')
}
*/

let XIAOMI_MIX2S = function(obj) {
    this.__proto__ = obj
    // 图形密码解锁
    this.unlock_pattern = function(password) {
        if (typeof password !== 'string') throw new Error('密码应为字符串！')
        //id左上偏差，后两位一样
        let lockBounds = id('com.android.systemui:id/lockPatternView').findOne(_config.timeout_findOne)
        if (lockBounds == null) {
            lockBounds = id('com.android.systemui:id/vivo_lock_pattern_view').findOne(_config.timeout_findOne)
        }
        if (lockBounds != null) {
            lockBounds = lockBounds.bounds();
        }
        let boxWidth = (lockBounds.right - lockBounds.left) / 3
        let boxHeight = (lockBounds.bottom - lockBounds.top) / 3
        let positions = password.split('').map(p => {
            let checkVal = parseInt(p) - 1
            return {
                r: parseInt(checkVal / 3),
                c: parseInt(checkVal % 3)
            }
        }).map(p => {
            return [parseInt(lockBounds.left + (0.5 + p.c) * boxWidth), parseInt(lockBounds.top + (0.5 + p.r) * boxHeight)]
        })
        gesture(220 * positions.length, positions)
        return this.check_unlock()
    }

    // 字母数字密码解锁（）
    this.unlock_password = function(password) {
        if (typeof password !== 'string') throw new Error('密码应为字符串！')
        // 直接在控件中输入密码
        setText(0, password)
        // 执行确认操作
        log("混合密码解锁")
        sleep(50)
        let key_ok_id = 'com.android.systemui:id/btn_letter_ok'
        if ((button = id(key_ok_id).findOne(_config.timeout_findOne)) !== null) {
            button.click();
            return this.check_unlock()
        }
        sleep(50);
        key_ok_id = 'com.android.systemui:id/vivo_cancel'
        if ((button = id(key_ok_id).findOne(_config.timeout_findOne)) !== null) {
            button.click();
            return this.check_unlock()
        }
        try{
        $shell.setDefaultOptions({
            adb: false
        });
        if (shell("input keyevent 66", true).code != 0) {
            sleep(50)
            $shell.setDefaultOptions({
                adb: true
            });
            try {
                shell("input keyevent 66")
            } catch (err) {
                console.error("Shizuku异常" + err)
            }
        }
    }catch(err){
            console.error("尝试回车失败\n"+err)
        }
        return this.check_unlock()
    }

    // PIN解锁
    this.unlock_pin = function(password) {
        var key_id;
        if (typeof password !== 'string') throw new Error('密码应为字符串！')
        // 数字密码解锁
        let button = null
        log("PIN解锁")
        for (let i = 0; i < password.length; i++) {
            key_id = 'com.android.systemui:id/key' + password[i]
            if ((button = id(key_id).findOne(_config.timeout_findOne)) !== null) {
                button.click()
            } else {
                sleep(50);
                //vivo数字密码，vivo_digit_text
                key_id = 'com.android.systemui:id/VivoPinkey' + password[i]
                if ((button = id(key_id).findOne(_config.timeout_findOne)) !== null) {
                    button.click()
                }
            }
            sleep(50)
        }
        sleep(50);
        let key_ok_id = 'com.android.systemui:id/btn_letter_ok'
        if ((button = id(key_ok_id).findOne(_config.timeout_findOne)) !== null) {
            button.click()
            return this.check_unlock()
        } else {
            //原生确认
            key_ok_id = 'com.android.systemui:id/key_enter'
            if ((button = id(key_id).findOne(_config.timeout_findOne)) !== null) {
                    button.click();
                    log("key_enter控件点击失败，尝试坐标"+button.bounds());
                    click(button.centerX(), button.centerY())
                return this.check_unlock()
            }
        }
        try{
        $shell.setDefaultOptions({
            adb: false
        });
        if (shell("input keyevent 66", true).code != 0) {
            sleep(50)
            $shell.setDefaultOptions({
                adb: true
            });
            try {
                shell("input keyevent 66")
            } catch (err) {
                console.error("Shizuku异常" + err)
            }
        }
        }catch(err){
            console.error("尝试回车失败\n"+err)
        }
        return this.check_unlock()
    }

    // 判断解锁方式并解锁
    this.unlock = function(password) {
        if (typeof password === 'undefined' || password === null || password.length === 0) {
            errorInfo('密码为空：' + JSON.stringify(password))
            throw new Error('密码为空！')
        }
        try{
        id("com.android.systemui:id/vivo_face_white_cover_btn").textContains("关闭").findOne(1000).click()
               // 打开滑动层
        sleep(500)
        }catch(err){
            log("报错。vivo的关闭")
            log(err)
        }
        
        if (id('com.android.systemui:id/lockPatternView').exists()) {
            return this.unlock_pattern(password)
            //图形密码解锁
        } else if (id('com.android.systemui:id/passwordEntry').exists()) {
            return this.unlock_password(password)
        } else if (idMatches('com.android.systemui:id/(fixedP|p)inEntry').exists()) {
            //数字
            return this.unlock_pin(password)
        } else {
            let vivo = id('com.android.systemui:id/vivo_message_title').findOne(1000);
            if (vivo != null) {
                console.verbose("vivo设备")
                device.wakeUpIfNeeded();
                toastLog(vivo.text())
                if (vivo.text() == "绘制图案"||vivo.text()=="使用面部或绘制图案") {
                    sleep(1000)
                    return this.unlock_pattern(password)
                    //图形密码解锁
                } else if (id('com.android.systemui:id/VivoPinkey1').exists()){
                    if(vivo.text() == "输入密码"||vivo.text() == "使用面部或输入密码"){
                    //数字密码解锁
                    return this.unlock_pin(password)
                    }else{
                        log("无法确认是数字密码解锁")
                    }
            }else if(vivo.text() == "输入密码"||vivo.text() == "使用面部或输入密码"){
                    return this.unlock_password(password)
                }
            }
            logInfo('识别锁定方式失败，型号：' + device.brand + ' ' + device.product + ' ' + device.release)
            return this.check_unlock()
        }
    }
}


//const MyDevice = ExternalUnlockDevice || XIAOMI_MIX2S
const MyDevice = XIAOMI_MIX2S

function Unlocker() {
    const _km = context.getSystemService(context.KEYGUARD_SERVICE)

    this.relock = false
    this.reTry = 0

    // 设备是否锁屏
    this.is_locked = function() {
        return _km.inKeyguardRestrictedInputMode()
    }

    // 设备是否加密
    this.is_passwd = function() {
        return _km.isKeyguardSecure()
    }

    // 解锁失败
    this.failed = function() {
        this.reTry++
            if (this.reTry > 3) {
                logInfo('解锁失败达到三次，停止运行')
                _config.resetBrightness && _config.resetBrightness()
                _runningQueueDispatcher.removeRunningTask()
                this.saveNeedRelock(true)
                engines.myEngine().forceStop()
            } else {
                let sleepMs = 5000 * this.reTry
                logInfo('解锁失败，' + sleepMs + 'ms之后重试')
                sleep(sleepMs)
                this.run_unlock()
            }
    }

    // 检测是否解锁成功
    this.check_unlock = function() {
        sleep(3000)
        if (textContains('重新').exists() || textContains('重试').exists() || textContains('错误').exists()) {
            logInfo('密码错误')
            return false
        }
        return !this.is_locked()
    }

    // 唤醒设备
    this.wakeup = function() {
        if (this.relock && _config.auto_set_brightness && !_config.resetBrightness) {
            log("唤醒设备")
            _config.last_brightness_mode = device.getBrightnessMode()
            _config.last_brightness = device.getBrightness()
            logInfo(['设置显示亮度为最低，关闭自动亮度 原始模式: {} 亮度: {}', _config.last_brightness_mode, _config.last_brightness])
            _config.resetBrightness = () => {
                debugInfo(['重置自动亮度 原始模式: {} 亮度: {}', _config.last_brightness_mode, _config.last_brightness])
                if (!isNaN(_config.last_brightness_mode)) {
                    device.setBrightnessMode(_config.last_brightness_mode)
                    debugInfo('自动亮度模式调整完毕')
                }
                if (!isNaN(_config.last_brightness)) {
                    device.setBrightness(_config.last_brightness)
                    debugInfo('亮度值调整完毕')
                }
            }
            // 设置最低亮度 同时关闭自动亮度
            device.setBrightnessMode(0)
            device.setBrightness(0)
        }
        let limit = 3
        while (!device.isScreenOn() && limit-- > 0) {
            device.wakeUp();

            sleep(200);
            if (!device.isScreenOn()) {
                shell("input keyevent 224")
                sleep(500);
            }
            if (!device.isScreenOn()) {
                try {
                    $shell.setDefaultOptions({
                        adb: true
                    });
                    shell("input keyevent 224")
                } catch (err) {
                    toast("使用Shizuku唤醒屏幕失败，请检查是否已授权" + err)
                    console.error("使用Shizuku唤醒屏幕失败，请检查是否已授权" + err)
                    device.wakeUpIfNeeded()
                }
            }
            sleep(_config.timeout_unlock)
        }
        if (!device.isScreenOn()) {
            console.warn('isScreenOn判定失效，无法确认是否已亮屏。直接尝试后续解锁操作')
        }
    }

    // 划开图层
    this.swipe_layer = function() {
        let x = parseInt(_config.device_width * 0.2)
        gesture(320, [x, parseInt(_config.device_height * 0.8)], [x, parseInt(_config.device_height * 0.3)])
        sleep(_config.timeout_unlock)
    }

    // 执行解锁操作
    this.run_unlock = function() {
        this.relock = this.relock || this.getRelockInfo()
        // 如果已经解锁则返回
        if (!this.is_locked()) {
            logInfo('已解锁')
            /* if (this.relock === true) {
               logInfo('前置校验需要重新锁定屏幕')
             } else {
               logInfo('不需要重新锁定屏幕')
               this.relock = false
             }*/
            return true
        }
        // 校验设备姿态 是否在裤兜内
        if (_config.check_device_posture) {
            let sensorInfo = _commonFunctions.getDistanceAndGravity(1000)
            if (sensorInfo.z < (_config.posture_threshold_z || 6) &&
                (!_config.check_distance || sensorInfo.distance < 4)) {
                _commonFunctions.setUpAutoStart(5)
                warnInfo('当前设备可能在裤兜内，5分钟后尝试')
                _runningQueueDispatcher.removeRunningTask()
                engines.myEngine().forceStop()
            }
        }

        this.relock = true
        _config.notNeedRelock = false
        // 首先点亮屏幕
        this.wakeup()

        // 打开滑动层
        this.swipe_layer()
        // 如果有锁屏密码则输入密码
        if (this.is_passwd() && !this.unlock(password)) {
            // 如果解锁失败
            this.failed()
        } else {
            this.saveNeedRelock()
            if (_config.dismiss_dialog_if_locked) {
                // 锁屏状态下启动不再弹框倒计时
                _commonFunctions.getAndUpdateDismissReason('screen_locked')
            }
        }
    }

    this.saveNeedRelock = function(notRelock) {
        this.relock = this.relock || this.getRelockInfo()
        if (notRelock || _config.notNeedRelock) {
            this.relock = false
        }
        let storage = storages.create(_storageName)
        //  debugInfo('保存是否需要重新锁屏：' + this.relock)
        storage.put('needRelock', JSON.stringify({
            needRelock: this.relock,
            timeout: new Date().getTime() + 30000
        }))
    }

    this.getRelockInfo = function() {
        let storage = storages.create(_storageName)
        let needRelock = storage.get('needRelock')
        if (needRelock) {
            needRelock = JSON.parse(needRelock)
            if (needRelock && new Date().getTime() <= needRelock.timeout) {
                return needRelock.needRelock
            }
        }
        return false
    }
}

const _unlocker = new MyDevice(new Unlocker())
module.exports = {
    exec: function() {
        _unlocker.reTry = 0
        _unlocker.run_unlock()
        /* if (!_unlocker.relock) {
           // 未锁定屏幕情况下，判断是否在白名单中
           _commonFunctions.delayStartIfInSkipPackage()
         }*/
    },
    needRelock: function() {
        logInfo('是否需要重新锁定屏幕：' + _unlocker.relock)
        return _unlocker.relock
    },
    saveNeedRelock: function(notRelock) {
        _unlocker.saveNeedRelock(notRelock)
    },
    unlocker: _unlocker
}