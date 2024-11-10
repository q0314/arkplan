/*
 * @Author: q0314
 * @Date: 2024-09-27 13:24:38
 * @Last Modified by: q0314
 * @Last Modified time: 2024-10-15 20:38:01
 * @Description: 
 */

const { createApp, defineComponent, ref, h, onMounted, watch } = Vue;
const { NavBar, Cell, SwipeCell, CellGroup, Checkbox, Collapse, CollapseItem, Icon, Image, Button, showToast, Dialog, Divider, Field, FloatingBubble,Popover, Popup, Col, Row, Switch, Stepper } = vant;
const { createRouter, createWebHashHistory } = VueRouter;
/*
import {
    pictureOperation
} from './components/configuration.js';
*/
const VanImage = Image;
const {
    loadModule
} = window['vue3-sfc-loader'];
const options = {
    moduleCache: {
        vue: Vue,
    },
    async getFile(url) {
        if (url.startsWith('http')) {
            const res = await fetch(url);
            if (!res.ok)
                throw Object.assign(new Error(res.statusText + ' ' + url), {
                    res
                });
            return {
                getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
            }
        }
        /*加载本地vue文件，
         *通过Android的shouldInterceptRequest会被再次拦截，从而实现本地加载vue sfc文件
         *直接拦截fetch 没搞明白，弄一半想起来这个函数
         */
        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            //console.info(url)
            // 设置请求类型和 URL
            xhr.open('GET', url, true);
            // xhr.setRequestHeader("Content-Type", "text/x-vue");

            // 定义请求成功的回调
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // 根据 asBinary 参数返回数据
                    const getContentData = (asBinary) => {
                        if (asBinary) {
                            return xhr.response; // 需要设置 xhr.responseType 为 'arraybuffer'
                        } else {
                            //  console.log(xhr.responseText)
                            return xhr.responseText; // 返回文本数据
                        }
                    };

                    resolve({
                        getContentData
                    });
                } else {
                    // 请求失败，抛出错误
                    reject(Object.assign(new Error(xhr.statusText + ' ' + url), {
                        res: xhr
                    }));
                }
            };

            // 定义请求失败的回调
            xhr.onerror = function () {
                reject(new Error('Network error ' + url));
            };

            // 发送请求
            xhr.send();
        });

    },
    addStyle(textContent) {

        const style = Object.assign(document.createElement('style'), {
            textContent
        });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
}
const index = loadModule("./js/template_gallery/pages/galleryHome.vue", options)
const about = loadModule("./js/template_gallery/pages/galleryTest.vue", options);

var router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/",
        name: 'index', //使用这种方法加载的vue，出错可能不会报错误信息，报错也没有明显的信息
        component: () => index,
    }, {
        path: '/test',
        name: 'test',
        component: () => about,
    },
        // 其他路由...
    ],
});

const App = defineComponent({
    data() {
        return {
            updateInfoList: ref([]),
            updateInfoShow: ref(false),
            transitionName: ref("slide-right"),
            statusBarHeight: ref(20),
        }
    },

    computed: {},
    methods: {},
    mounted() {

    },

    template: `<div style="width: 100%; height: 100%">
      <router-view v-slot="{ Component }">
        <transition :name="transitionName" appear>
          <component :is="Component" :statusBarHeight="statusBarHeight"/>
        </transition>
      </router-view>
  </div>`
});

const myApp = createApp(App);
const components = [
    router,
    NavBar,
    Cell,
    SwipeCell,
    CellGroup,
    Checkbox,
    Collapse,
    CollapseItem,
    Icon,
    VanImage,
    Button,
    Dialog,
    Divider,
    Field,FloatingBubble,
    Popover,
    Popup,
    Col,
    Row,
    Switch, Stepper,
];

components.forEach(component => myApp.use(component));

//myApp.component('picture-operation', pictureOperation);

myApp.component('TipBlock', defineComponent({
    name: 'TipBlock',
    props: {
        tipFontSize: {
            type: String,
            default: '0.7rem'
        }
    },
    setup(props, {
        slots
    }) {
        return () =>
            h(Row, null, {
                default: () => [
                    h(Col, {
                        span: 22,
                        offset: 1,
                        class: 'tip-block-wrap-text'
                    }, {
                        default: () => [
                            h('span', {
                                style: {
                                    color: 'gray',
                                    fontSize: props.tipFontSize
                                }
                            }, slots.default ? slots.default() : '')
                        ]
                    })
                ]
            });
    }
}));
myApp.mount('#app');
