/*
 * @Author: TonyJiangWJ
 * @Date: 2020-08-04 17:30:20
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-10-29 13:22:30
 * @Description: 
 */

/**
 * 免费版的runtime.loadDex loadJar有问题，加载前需要将mDexClassLoaders清空
 */
const _resolver = () => {
  console.verbose('run resolver')
  try {
    let packageName = context.getPackageName()
    console.verbose('packageName: ' + packageName)
    if (packageName === 'org.autojs.autojs') {
      importClass(java.lang.Class)
      let target = org.mozilla.javascript.ContextFactory.getGlobal().getApplicationClassLoader()
      let clz = target.getClass()
      console.verbose("clz:" + clz.toString())
      let field = clz.getDeclaredField("mDexClassLoaders")
      field.setAccessible(true)
      let fieldValue = field.get(target)
      let fieldClass = fieldValue.getClass()

      if (fieldClass + '' === 'class java.util.ArrayList') {
        fieldValue.clear()
        console.warn('能不能不要再用全是BUG的免费版了呀！推荐使用我的修改版 下载连接：https://github.com/TonyJiangWJ/Auto.js/releases/download/v4.1.1/AutoJS.Modify.latest.apk');
        console.verbose("success");
      } else {
        console.verbose("fieldValue is not list")
      }
    }
  } catch (e) {
    let errorInfo = e + ''
    console.error('发生异常' + errorInfo)
    toastLog('请强制关闭AutoJS并重新启动')
    exit()
  }
}
//_resolver()

module.exports = _resolver