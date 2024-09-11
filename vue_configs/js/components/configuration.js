/*
 * @Author: TonyJiangWJ
 * @Date: 2020-11-29 13:16:53
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-12-23 22:29:32
 * @Description: 组件代码，传统方式，方便在手机上进行修改
 */

Vue.component('picture-operation', function(resolve, reject) {
    resolve({
        mixins: [mixin_common],
        data: function() {
            return {
                configs: {

                },
                images: null,
                showInfoDialog: false,
                showImages: false,
                searchQuery: '',
                imgPath: {},
                currentTemplateInfo: {},
                currentIndex: 0,
                activeNames: [],
                /*van-collapse组件默认配置*/
            };
        },

        computed: {
            visualizationPaths() {
                const visualization = this.currentTemplateInfo?.visualization;
               // console.log('visualization:', visualization);
                return Array.isArray(visualization) ? visualization : this.images[0].templateInfo.visualization;
            }

        },
        methods: {
            saveConfigs: function() {
                console.log('save gallery configs')
                this.doSaveConfigs();
            },
            saveImageInfo:function(){
                $app.invoke("infoImage", {}, data => {
                // console.log(JSON.stringify(data))
                this.currentTemplateInfo = data.imgList[0].templateInfo;
                this.images = data.imgList;
                this.imgPath = data.imgPath;
            })
            },
            searchValue: function() {
                if (!this.images_copy) {
                    this.images_copy = this.images;
                } else {
                    this.images = this.images_copy;
                    this.images_copy = null;
                }
            },
            filteredImages: function() {
                const query = this.searchQuery.toLowerCase();
                this.images = this.images_copy.filter(image =>
                    image.templateImage.toLowerCase().includes(query)
                )
            },
            replaceImage: function(index) {
                // 处理替换图片的逻辑
                console.log(`Replace image at index ${index}`);
                this.currentIndex = index;
                const fileInput = this.$refs.fileInput;

                if (fileInput && typeof fileInput.click === 'function') {
                    fileInput.click();
                } else {
                    console.error('fileInput 不是一个有效的 HTMLInputElement 或没有 click 方法');
                    document.getElementById('fileInput').click();
                }
            },
            handleFileChange: function(event) {
                // 获取选择的文件
                const file = event.target.files[0];
                const MAX_FILE_SIZE = 300 * 1024; // 300KB

                if (file.size > MAX_FILE_SIZE) {
                    vant.Toast("小图模板大小不建议超过 300KB");
                    return;
                }
                if (file) {
                    this.selectedFile = file;

                    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            let name = this.images[this.currentIndex].templateImage;
                            this.$set(this.images, this.currentIndex, {
                                ...this.images[this.currentIndex],
                                templateImage: ''
                            });
                            // 等待 Vue 完成 DOM 更新
                            // setTimeout(() => {
                            $app.invoke("replaceImage", {
                                img: e.target.result,
                                path: this.imgPath.template,
                                name: name,
                            }, data => {

                                vant.Toast(data.message);
                                if (data.issuccess) {

                                    this.$set(this.images, this.currentIndex, {
                                        ...this.images[this.currentIndex],
                                        templateImage: data.name
                                    });


                                }
                            });
                            // }, 100);
                            /*
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            document.body.appendChild(img); // 将图像添加到页面上
                            */


                        };

                        reader.readAsDataURL(file); // 读取为 Base64 编码的字符串

                    } else {
                        vant.Toast("非图像类型");
                    }

                }
            },


            showTemplateInfo: function(index) {
                this.currentIndex = index;
                this.currentTemplateInfo = this.images[index].templateInfo;
                this.showInfoDialog = true;
            },
            saveTemplateInfo: function() {
                if (this.currentIndex >= 0) {
                    this.images[this.currentIndex].templateInfo = this.currentTemplateInfo;
                }

                this.showInfoDialog = false;
            },
            deleteCacheImage: function(index) {
                $app.invoke("deleteCacheImage", {
                    path: this.imgPath.cache,
                    file: this.images[index].cacheImage
                }, data => {

                });
                this.$set(this.images, index, { ...this.images[index],
                    cacheImage: ''
                });

            },
            removeExtension: function(filename) {
               filename = filename.startsWith('_') ? filename.slice(1) : filename;
    
                return filename.replace('.png', '');
            },
            handleConfirm: function() {

            }
        },

        mounted() {
            this.saveImageInfo();
            $app.registerFunction('doSaveImageInfo', this.saveImageInfo);

            $app.registerFunction('doSearchValue', this.searchValue);

            //注册saveConfigs为saveGalleryConfigs
            $app.registerFunction('saveGalleryConfigs', this.saveConfigs);
            //console.log(this.images)

            // 确保数据在这里是定义好的
        },

        template: '<div>\
        <input v-model="searchQuery" placeholder="  过滤图片名称" @input="filteredImages" id="Search" class="search-input" />\
    <!-- 遍历每个图像对 -->\
    <div v-for="(item, index) in images" :key="index" class="image-comparison">\
      <div class="image-section" >\
        <!-- 模板图部分 -->\
        <div class="image-viewer">\
          <img :src="imgPath.template+item.templateImage" alt="Template Image" />\
       <span class="picture-info-text">{{ removeExtension(item.templateImage) }}</span>\
       </div>\
        <div class="button-container" gutter="20">\
         <div>\
          <van-button class="button" type="primary" size="small" @click="replaceImage(index)">替换模板</van-button>\
          <input type="file" id="fileInput" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;">\
    </div>\
          <van-button class="button" type="info" size="small" @click="showTemplateInfo(index)">查看信息</van-button>\
        </div>\
      </div>\
      <div class="image-section">\
        <!-- 缓存图部分 -->\
        <div class="image-viewer">\
          <img v-if="item.cacheImage" :src="imgPath.cache+item.cacheImage" alt="Cache Image" />\
          <div v-else class="no-cache-image">暂无缓存图生成</div>\
         <span v-if="item.cacheImage" class="picture-info-text"> </span>\
        </div>\
        <div class="button-container">\
          <van-button class="button" type="danger" @click="deleteCacheImage(index,item.cacheImage)" v-if="item.cacheImage">删除缓存图</van-button>\
        </div>\
      </div>\
      </div>\
    <!-- 模板图信息弹窗 -->\
<van-dialog v-model="showInfoDialog" :title="removeExtension(images[this.currentIndex].templateImage) +` 模板图信息`" show-cancel-button confirmButtonText="保存" @confirm="saveTemplateInfo" lock-scroll="false" style="min-height:35%;overflow-y:scroll" >\
    <div class="dialog-content">\
     <div class="container">\
     <tip-block> 原图宽高是指用于裁剪小图的大图分辨率</tip-block>\
    <div class="input-container">\
      <van-field v-model="currentTemplateInfo.prototypeWH.w" label="原图宽度" placeholder="1220" type="number" class="adaptive-field" />\
      <van-field v-model="currentTemplateInfo.prototypeWH.h" label="原图高度" placeholder="2712" type="number" class="adaptive-field"/>\
    </div>\
    <van-field v-model="currentTemplateInfo.remarks" label="模板图备注" placeholder="请输入备注" type="textarea" />\
  </div>\
      <van-cell :title="visualizationPaths.length > 0 ? `点击展开最近的特征匹配可视化结果` : `打开设置-滑动到底部-调试，再次运行到对应界面即可查看相关可视化结果`" is-link @click="showImages = !showImages" >\
        <template #right-icon>\
          <van-icon name="arrow-down" :class="{rotate: showImages}" />\
        </template>\
      </van-cell>\
      <van-collapse v-if="showImages" v-model="activeNames">\
        <tip-block>绿色框为识别到的位置，如果不是类似方形的框框，识别结果会被过滤，详细查看运行日志，取决于rectangular_error(可容忍矩形误差)值，目前是35% </tip-block>\
        <van-collapse-item v-for="(path, index) in visualizationPaths" :key="index"  :title="`特征匹配方式matcher: ` + (index + 1)+` 识别结果`">\
          <img :src="path" alt="image" style="width: 100%; max-width: 300px;" />\
        </van-collapse-item>\
      </van-collapse>\
      </div>\
  </van-dialog>\
  </div>'
    })
})