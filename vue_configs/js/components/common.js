/*
 * @Author: TonyJiangWJ
 * @Date: 2020-11-29 13:16:53
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-12-23 23:01:10
 * @Description: 组件代码，传统方式，方便在手机上进行修改
 */

let mixin_methods = {
  data: function () {
    return {
      container: '.root-container',
      device: {
        width: 1080,
        height: 2340
      },
      is_pro: false
    }
  },
  methods: {
    stopTouchmove: function (e) {
      // e.stopPropagation()
    },
    isNotEmpty: function (v) {
      return !(typeof v === 'undefined' || v === null || v === '')
    },
    getContainer: function () {
      return document.querySelector(this.container)
    },
    trimToEmpty: function (v) {
      if (!this.isNotEmpty(v)) {
        return ''
      } else {
        return ('' + v).trim()
      }
    }
  },
  filters: {
    styleTextColor: function (v) {
      if (/^#[\dabcdef]{6}$/i.test(v)) {
        return { color: v }
      } else {
        return null
      }
    }
  }
}

let mixin_common = {
  mixins: [mixin_methods],
  data: function () {
    return {
    }
  },
  methods: {
    loadConfigs: function () {
      $app.invoke('loadConfigs', {}, config => {
        Object.keys(this.configs).forEach(key => {
          //   console.log('load config key:[' + key + '] value: [' + config[key] + ']')
          this.$set(this.configs, key, config[key])
          // vant.Toast(key)

        })
        this.device.width = config.device_width
        this.device.height = config.device_height
        this.is_pro = config.is_pro
      })
    },
    doSaveConfigs: function (deleteFields,value) {
      console.log('执行保存配置');

      let newConfigs = {}
      //   console.log(Array.isArray(this.images))
      if (value && Array.isArray(value)) {
        newConfigs = value;
      } else {
        // Object.assign(newConfigs, this.configs)
        Object.assign(newConfigs, value)

        let errorFields = Object.keys(this.validationError);
        if (errorFields && errorFields.length > 0) {
          errorFields.forEach(key => {
            if (this.isNotEmpty(this.validationError[key])) {
              newConfigs[key] = ''
            }
          })
        }
        if (deleteFields && deleteFields.length > 0) {
          deleteFields.forEach(key => {
            newConfigs[key] = ''
          })
        }
      }
      $app.invoke('saveConfigs', newConfigs)
    }
  },
  computed: {
    validationError: function () {
      let errors = {}
      if (this.isNotEmpty(this.validations)) {
        Object.keys(this.validations).forEach(key => {
          let { [key]: value } = this.configs
          let { [key]: validation } = this.validations
          if (this.isNotEmpty(value) && !validation.validate(value)) {
            errors[key] = validation.message(value)
          } else {
            errors[key] = ''
          }
        })
      }
      return errors
    },
  },
  mounted() {
    // this.loadConfigs()
  }
}