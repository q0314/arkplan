/*test
 * @Author: TonyJiangWJ
 * @Date: 2020-11-29 13:24:38
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-12-02 23:38:01
 * @Description: 
 */

Vue.use(vant);
let app = new Vue({
    el: '#app',
    data() {
        return {
            resourcePath: 'unknown',
            message: '',
            activeTab: '1',
            showSetupDialog: false,
            clientHeight: 2,
            deleteFile: false,
        }
    },
    methods: {
        onClickLeft: function() {
            $app.invoke('uiExit', {})
        },
        onSearchClick: function() {
            // 处理搜索图标点击事件
            console.log('Search icon clicked');
            let searchElement = document.getElementById('Search');
            /*
            console.log(searchElement.className); // 获取 class 属性
            console.log(searchElement.classList); // 获取 class 列表
            const isHidden = searchElement.style.display === 'none';
            console.log('Element is hidden:', isHidden);

            if (!isHidden) {
                searchElement.style.display = 'none';
            } else {
                searchElement.style.display = '';
            }
            */
            if (searchElement.classList.contains('display')) {
                searchElement.classList.remove('display');
                searchElement.classList.add('hidden');
            } else {
                vant.Toast("搜索");
                searchElement.classList.remove('hidden');
                searchElement.classList.add('display');
            }
            $app.invoke('searchValue', {})
        },

        onSettingClick: function(e) {
            // 处理设置图标点击事件
            console.log('Setting icon clicked');
            e.stopPropagation()
            this.showSetupDialog = !this.showSetupDialog;
            //vant.Toast("设置");

        },
        restoreTemplate: function() {
            $app.invoke("restoreTemplate", {
                deleteFile: this.deleteFile,
            }, data => {
                if (data.isSuccess) {
                    this.showSetupDialog = false;
                    vant.Toast((this.deleteFile ? "清空无关文件并\n" : "") + "还原所有模板图成功");
                } else {
                    vant.Toast("还原模板图失败");
                    console.error(data.message);
                }
            });
        },
        invokeAutojsToast: function() {
            this.message = '点击触发toast'
            console.log('点击触发 toast')
            $app.invoke('toastLog', {
                message: 'Hello, this is from H5.'
            })
            this.message = '点击触发toast'
        },
        invokeAutojsCallback: function() {
            $app.invoke('callback', {
                message: 'invoke callback'
            }, (data) => {
                this.message = data.message
            })
        },
        clickedMenu: function(e) {
            console.log('clicked menu ' + this.clientHeight)
            e.stopPropagation()
            this.showMenuDialog = true
        },
        resetDefaultConfigs: function() {
            $app.invoke('resetConfigs')
        },
        exportConfigs: function() {
            $app.invoke('exportConfigs')
        },
        restoreConfigs: function() {
            $app.invoke('restoreConfigs')
        },
        exportRuntimeStorage: function() {
            $app.invoke('exportRuntimeStorage')
        },
        restoreRuntimeStorage: function() {
            $app.invoke('restoreRuntimeStorage')
        },
        getDialogContainer: function() {
            return document.querySelector('html')
        }
    },
    /*检测数据是否变化
    watch: {
  showSetupDialog(newVal) {
    console.log('Dialog visibility changed:', newVal);
  },
    },*/
    mounted() {
        // vant.Toast('vue加载完成...');
        let self = this
        setTimeout(function() {
            self.clientHeight = document.querySelector('html').clientHeight
            console.log('client---height:' + self.clientHeight)
        }, 200)

        // document.getElementById('app').style.minHeight = this.clientHeight + 'px'
    }
})