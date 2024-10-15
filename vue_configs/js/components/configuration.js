
//import {defineComponent } from 'https://cdn.jsdelivr.net/npm/vue@3.5.11/dist/vue.esm-browser.js';
const {defineComponent,ref } = Vue;
const {showToast } =vant;

export const pictureOperation = defineComponent({
  mixins: [mixin_common],
    
  data() {
    return {
      configs: ref({}),
      showInfoDialog: ref(false),
      showImagesResult: ref(false),
      searchQuery: '',
      images: [{
        templateImage: '',
        cacheImage: '',
        templateInfo: {
          prototypeWH: {
            "w": 1220,
            "h": 2712
          },
          remarks: "",
          visualization: []
        }
      }],
      ocrCacheImgList: [],
      imgPath: {
        template: '',
        cache: '',
        zip: '',
        info: "gallery_info.json"
      },
      currentTemplateInfo: {
        templateInfo: {
          prototypeWH: {
            "w": 1220,
            "h": 2712
          },
          remarks: "",
          visualization: []
        }
      },
      currentIndex: 0,
      activeNames: [], /*van-collapse组件默认配置*/
      
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
    saveConfigs() {
      console.log('save gallery configs')
      this.doSaveConfigs();
    },
    /**
     * 更新图片数据
     */
    saveImageInfo() {
      $app.invoke("infoImage", {}, data => {
        // console.error(JSON.stringify(data))
        //更换路由重回后，没办法改变该数据?
        this.currentTemplateInfo = data.imgList[0].templateInfo;
        this.images = data.imgList;
        this.ocrCacheImgList = data.ocrCacheImgList;
        this.imgPath = data.imgPath;

      })
    },
    searchValue() {
      if (!this.images_copy) {
        this.images_copy = this.images;
      } else {
        this.images = this.images_copy;
      }
    },
    filteredImages() {
      let query = this.searchQuery.toLowerCase();
      this.images = this.images_copy.filter((image) => {
         return image && image.templateImage && image.templateImage.toLowerCase().includes(query);
})
    },
    replaceImage(index) {
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
    handleFileChange(event) {
      // 获取选择的文件
      const file = event.target.files[0];
      const MAX_FILE_SIZE = 300 * 1024; // 300KB

      if (file.size > MAX_FILE_SIZE) {
        showToast("小图模板大小不建议超过 300KB");
        return;
      }
      if (file) {
        this.selectedFile = file;

        if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            let name = this.images[this.currentIndex].templateImage;
                this.images[this.currentIndex] = {
               ...this.images[this.currentIndex],
                templateImage: ''
               };
            // 等待 Vue 完成 DOM 更新
            // setTimeout(() => {
            $app.invoke("replaceImage", {
              img: e.target.result,
              path: this.imgPath.template,
              name: name,
            }, data => {

              showToast(data.message);
              if (data.issuccess) {

             this.images[this.currentIndex] = {
              ...this.images[this.currentIndex],
                templateImage: data.name
            };

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
          showToast("非图像类型");
        }

      }
    },


    showTemplateInfo(index) {
      this.currentIndex = index;
      this.currentTemplateInfo = this.images[index].templateInfo;
      this.showInfoDialog = true;
    },
    testInfo(index) {
      this.currentIndex = index;
      this.currentTemplateInfo = this.images[index].templateInfo;
      this.$router.push('/test'); // 使用 this.$router.push() 方法进行页面跳转
 
       $app.invoke("doTestInfo", {
           input:true,
           templateImage:this.images[this.currentIndex].templateImage,
           cacheImage:this.images[this.currentIndex].cacheImage,
           currentTemplateInfo:this.currentTemplateInfo,
           imgPath:this.imgPath,
       })

    },
    saveTemplateInfo() {
      if (this.currentIndex >= 0) {
        this.images[this.currentIndex].templateInfo = this.currentTemplateInfo;
      }

      this.showInfoDialog = false;
    },
    deleteCacheImage(index, isCache) {
      const list = isCache ? this.ocrCacheImgList : this.images;
      $app.invoke("deleteCacheImage", {
        path: this.imgPath.cache,
        file: list[index].cacheImage
      }, data => {});
     if(isCache){
     list.splice(index, 1);
    }else{
        list[index] = {
            ...list[index],
            cacheImage: ''
       };
    }
    },
    removeExtension(filename) {
      filename = filename.startsWith('_') ? filename.slice(1) : filename;

      return filename.replace('.png', '');
    },
  },

  mounted() {
    this.saveImageInfo();
    $app.registerFunction('doSaveImageInfo', this.saveImageInfo);

    $app.registerFunction('doSearchValue', this.searchValue);
    //注册saveConfigs为saveGalleryConfigs
   // $app.registerFunction('saveGalleryConfigs', this.saveConfigs);

    // 确保数据在这里是定义好的
  },

  template: `<div>
   
        <input v-model="searchQuery" placeholder="  过滤图片名称" @input="filteredImages" id="Search" class="search-input" />
    <!-- 遍历每个图像对 -->
    <div v-for="(item, index) in images" :key="index" class="image-comparison">
      <div class="image-section" >
        <!-- 模板图部分 -->
        <div class="image-viewer">
          <img :src="imgPath.template+item.templateImage" alt="Template Image" />
       <span class="picture-info-text">{{ removeExtension(item.templateImage) }}</span>
       </div>
        <div class="button-container" gutter="20">
         <div>
          <van-button class="button" type="primary" size="small" @click="replaceImage(index)">替换模板</van-button>
          <input type="file" id="fileInput" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;">
    </div>
          <van-button class="button" type="warning" size="small" @click="testInfo(index)">测试</van-button>
          <van-button class="button" type="default" size="small" @click="showTemplateInfo(index)">查看信息</van-button>
        </div>
      </div>
      <div class="image-section">
        <!-- 特征缓存图部分 -->
        <div class="image-viewer">
          <img v-if="item.cacheImage" :src="imgPath.cache+item.cacheImage" alt="Cache Image" />
          <div v-else class="no-cache-image">暂无缓存图生成</div>
         <span v-if="item.cacheImage" class="picture-info-text"> </span>
        </div>
        <div class="button-container">
          <van-button class="button" type="danger" @click="deleteCacheImage(index)" v-if="item.cacheImage">删除缓存图</van-button>
        </div>
      </div>
      </div>
      
      <tip-block>下面的图片是由OCR识别配置设置saveSmallImg属性为true并成功识别后缓存的文本图片(也可能是过时无用的特征缓存图)，如ocr配置没有picture_failed_further属性并为true时(缓存图像匹配时失败,继续使用OCR识别)，并且图片文本与名称不符合的可删除重试，也可在计划设置-OCR插件类型-矫正规则-进入界面后配合运行日志添加矫正规则</tip-block>
        <div v-for="(item, index) in ocrCacheImgList" :key="index" class="image-comparison">
            <div class="image-section">
        <!-- ocr缓存图部分 -->
        <div class="image-viewer">
          <img :src="imgPath.cache+item.cacheImage" alt="Cache Image" />
         <span class="picture-info-text">{{ removeExtension(item.cacheImage) }}</span>
        </div>
        <div class="button-container">
          <van-button class="button" type="danger" @click="deleteCacheImage(index,true)" v-if="item.cacheImage">删除</van-button>
        </div>
            </div>
      </div>
      

    <!-- 模板图信息弹窗 -->
<van-dialog
  v-model:show="showInfoDialog"
  :title="removeExtension(images[this.currentIndex].templateImage) + '模板图信息'"
  show-cancel-button
  confirmButtonText="保存"
  @confirm="saveTemplateInfo"
  style="min-height:35%;overflow-y:scroll"
>
  <div class="dialog-content">
    <div class="container">
      <tip-block> 原图宽高是指用于裁剪小图的大图分辨率</tip-block>
      <div class="input-container">
        <van-field v-model="currentTemplateInfo.prototypeWH.w" label="原图宽度" placeholder="1220" type="number" class="adaptive-field" />
        <van-field v-model="currentTemplateInfo.prototypeWH.h" label="原图高度" placeholder="2712" type="number" class="adaptive-field" />
      </div>
      <van-field v-model="currentTemplateInfo.remarks" label="模板图备注" placeholder="请输入备注" type="textarea" />
    </div>
    <van-cell
      :title="visualizationPaths.length > 0 ? '点击展开最近的特征匹配可视化结果' : '打开设置-滑动到底部-调试，再次运行到对应界面即可查看相关可视化结果'"
      is-link
      @click="showImagesResult = !showImagesResult"
    >
      <template #right-icon>
        <van-icon name="arrow-down" :class="{ rotate: showImagesResult }" />
      </template>
    </van-cell>
    <van-collapse v-if="showImagesResult" v-model="activeNames">
      <tip-block>绿色框为识别到的位置，如果不是类似方形的框框，识别结果会被过滤，详细查看运行日志，取决于rectangular_error(可容忍矩形误差)值，目前是35%</tip-block>
      <van-collapse-item v-for="(path, index) in visualizationPaths" :key="index" v-show="path !== ''" :title="'特征匹配方式matcher: ' + (index + 1) + '识别结果'">
        <img :src="path" alt="image" style="width: 100%; max-width: 300px;" />
      </van-collapse-item>
    </van-collapse>
  </div>
</van-dialog>
  </div>`
 });
//app.component('picture-operation',pictureOperation);
/*
module.exports.distinguishTest = distinguishTest;
module.exports.pictureOperation =pictureOperation;
*/