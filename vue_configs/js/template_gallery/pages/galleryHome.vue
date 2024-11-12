/*
 * @Author: q0314
 * @Date: 2024-10-09 12:24:38
 * @Last Modified by: q0314
 * @Last Modified time: 2024-10-22 18:30:45
 * @Description: 使用sfc单文件组件方便在手机上查看修改
 */

<template>
  <div>
      
    <div>
      <van-nav-bar title="模板图库管理" left-arrow @click-left="onClickLeft" class="fixed-bar">
        <template #right>
         <!-- <van-icon name="search" class="icon" @click.stop="onSearchClick" ></van-icon>-->
         <element-search ref="eleSearch" :refSearchAttrName="searchTemplate" 
            refHighLightAttrName="scheme-list-to-highlit" />
        
          <van-icon name="setting" class="icon" @click.stop="onSettingClick" ></van-icon>
        </template>
      </van-nav-bar>
    </div>

    <div class="seize-seat-upper-corner"></div>

    <van-row class="minimum-container">

  <div>
    <div v-for="(item,index) in images" :key="index" class="image-comparison">
      <div class="image-section">
        <div class="image-viewer">
          <img :src="imgPath.template + item.templateImage" alt="Template Image" />
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
  :title="removeExtension(images[currentIndex].templateImage) + '模板图信息'"
  show-cancel-button
  confirmButtonText="保存"
  @confirm="saveTemplateInfo"
  style="min-height:35%;overflow-y:scroll"
>
  <div class="dialog-content">
    <div class="container">
      <tip-block> 原图宽高是指用于裁剪小图的大图分辨率</tip-block>
      <div class="input-container">
        <van-field v-model="currentTemplateInfo.prototypeWH.w" label="原图宽度" placeholder="1220" type="number" class="adaptive-field" ></van-field>
        <van-field v-model="currentTemplateInfo.prototypeWH.h" label="原图高度" placeholder="2712" type="number" class="adaptive-field" ></van-field>
      </div>
      <van-field v-model="currentTemplateInfo.remarks" label="模板图备注" placeholder="请输入备注" type="textarea" ></van-field>
    </div>
    <van-cell
      :title="visualizationPaths.length > 0 ? '点击展开最近的特征匹配可视化结果' : '打开设置-滑动到底部-调试，再次运行到对应界面即可查看相关可视化结果'"
      is-link
      @click="showImagesResult = !showImagesResult"
    >
      <template #right-icon>
        <van-icon name="arrow-down" :class="{ rotate: showImagesResult }" ></van-icon>
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

    
  </div>
  
    </van-row>

<van-floating-bubble v-model:offset="offset" axis="xy" magnetic="x" icon="photo" @click="cropTool" >
        </van-floating-bubble>
    <van-dialog v-model:show="showSetupDialog" v-cloak title="设置" :show-confirm-button="false"
      :close-on-click-overlay="true">
      <div class="dialog-content">
        <div class="input-container">
          <p style="text-align: center;">选中的模板图库:</p>
          <select v-model="selectedGallery" @change="switchGallery(selectedGallery)" class="custom-select">
            <option v-for="option in galleryName" :key="option.value" :value="option.value">
              {{ option.name }}
            </option>
          </select>
        </div>
        <tip-block>模板图片文件目录：{{ selectTemplatePath }}</tip-block>
        <tip-block>缓存图片文件目录：{{ selectCachePath }}</tip-block>

        <van-divider :style="{ margin: '0' }"></van-divider>
        <div style="border-bottom: 1px solid gray; width: 90%; margin: 5px 0px 8px 0px;"></div>
        <van-field v-model="galleryZip" placeholder="输入模板图压缩包路径后点击导入"></van-field>

        <van-checkbox v-model="deleteFile" shape="square">删除无关图片</van-checkbox>
        <div class="input-container">
          <van-button type="primary" @click="restoreTemplate(true)"
            :style="{ height: '35px', margin: '0px' }">导入模板图库</van-button>
          <van-button type="warning" @click="restoreTemplate(false)"
            :style="{ height: '35px', margin: '0px' }">还原默认模板图库</van-button>
        </div>
      </div>
    </van-dialog>
    
  </div>
  
</template>

<script setup>
const { ref, onMounted ,computed  } = Vue;
const { showToast } = vant;
const {useRouter}  = VueRouter;
import ElementSearch from "../ElementSearch.vue";

const router = useRouter();
const resourcePath = ref('unknown');
const showSetupDialog = ref(false);
const clientHeight = ref(200);
const deleteFile = ref(false);
const selectedGallery = ref(0);
const galleryZip = ref("")
const galleryName = ref([
  {
    name: "明日计划内置模板",
    value: 0,
    dir: "/1storage/emulated/0/Android/data/org.autojs.autojspro/files/gallery_list/template/",
    zip: "/storage/emulated/0/脚本/arkplan/lib/data/官方｛2712×1220}.zip",
    cache: "/storage/emulated/0/Android/data/org.autojs.autojspro/files/gallery_list/",
  }
]);
const selectCachePath = ref('');
const selectTemplatePath = ref('');

const images_copy = ref([]);

const images = ref([
  {
    templateImage: '',
    cacheImage: '',
    templateInfo: {
      prototypeWH: { w: 1220, h: 2712 },
      remarks: '',
      visualization: [],
    },
  },
]);

const showInfoDialog = ref(false);
const showImagesResult = ref(false);
const ocrCacheImgList = ref([]);
const imgPath = ref({
  template: '',
  cache: '',
  zip: '',
  info: 'gallery_info.json',
});
const currentTemplateInfo = ref({
  templateInfo: {
    prototypeWH: { w: 1220, h: 2712 },
    remarks: '',
    visualization: [],
  },
});
const currentIndex = ref(0);
const activeNames = ref([]);
const fileInput = ref();
const offset = ref({
 x:document.body.clientWidth*300/375,y:750
})
const visualizationPaths = computed(() => {
  const visualization = currentTemplateInfo.value?.visualization;
  return Array.isArray(visualization) ? visualization : images.value[0].templateInfo.visualization;
});

function cropTool(){
    $app.invoke('cropTool',{});
}
function saveConfigs() {
  console.log('save gallery configs');
  mixin_common.methods.doSaveConfigs(false,images.value); 
}

function updateImageInfo() {
  $app.invoke('infoImage', {}, (data) => {
    
    imgPath.value = data.imgPath;
    images.value = data.imgList;
    ocrCacheImgList.value = data.ocrCacheImgList;
    currentTemplateInfo.value = data.imgList[0].templateInfo;
    
  });
}

function onClickLeft () {
    //离开时清空搜索数据
    localStorage.setItem('elementSearch', JSON.stringify({}));
    saveConfigs();
    $app.invoke('uiExit', {});
};


function onSettingClick(e) {
  console.log('Setting icon clicked', showSetupDialog.value);
  e.stopPropagation();
  showSetupDialog.value = !showSetupDialog.value;
};


function searchTemplate(value){
    if(selectTemplatePath.value == ""){
        return false
    }
    if (value&&images_copy.value.length == 0) {
        images_copy.value = images.value;
    } else if(!value&&value.k==""){
        images.value = images_copy.value;
        images_copy.value = [];
        return true;
    }
   //   let query = searchQuery.value.toLowerCase();
    let kLower = value.k.toLowerCase();
    let temporary = images_copy.value.filter((image) => {
        return (
        (image?.templateImage && image.templateImage.toLowerCase().includes(kLower)) ||
        (image?.templateInfo && image.templateInfo.remarks && image.templateInfo.remarks.toLowerCase().includes(kLower))
        );
    });

  if(!temporary.length){
      showToast("未搜索到该图片");
  }else{
    //  console.info(temporary)
      images.value = temporary;
  }
  return true;
}
function replaceImage(index) {
    currentIndex.value = index;
    
    if (fileInput && typeof fileInput.value.click === 'function') {
        fileInput.click();
    } else {
        console.error('fileInput 不是一个有效的 HTMLInputElement 或没有 click 方法');
        document.getElementById('fileInput').click();
    }
}

function handleFileChange(event) {
  const file = event.target.files[0];
  const MAX_FILE_SIZE = 300 * 1024; // 300KB

  if (file.size > MAX_FILE_SIZE) {
     showToast("小图模板大小不建议超过 300KB");
      return;
  }

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let name = images.value[currentIndex.value].templateImage;
      images.value[currentIndex.value] = { ...images.value[currentIndex.value], templateImage: '' };

      $app.invoke('replaceImage', {
        img: e.target.result,
        path: imgPath.value.template,
        name:name,
      }, (data) => {
        showToast(data.message);
        if (data.issuccess) {
          images.value[currentIndex.value] = { ...images.value[currentIndex.value], templateImage: data.name };
        }
      });
    };

    reader.readAsDataURL(file); // 读取为 Base64 编码的字符串
  } else {
      showToast("非图像类型");
  }
}

function showTemplateInfo(index) {
  currentIndex.value = index;
  currentTemplateInfo.value = images.value[index].templateInfo;
  showInfoDialog.value = true;
}

function testInfo(index) {
  currentIndex.value = index;
  currentTemplateInfo.value = images.value[index].templateInfo;
  let pictureName = images.value[currentIndex.value].templateImage;
  pictureName = pictureName.startsWith('_') ? pictureName.slice(1) : pictureName;
  router.push('/test'); 
  
  $app.invoke('doTestInfo', {
    input: true,
    templateImage: pictureName,
    cacheImage: images.value[currentIndex.value].cacheImage,
    currentTemplateInfo: currentTemplateInfo.value,
    imgPath: imgPath.value,
  });
}

function saveTemplateInfo() {
  if (currentIndex.value >= 0) {
    images.value[currentIndex.value].templateInfo = currentTemplateInfo.value;
  }

  showInfoDialog.value = false;
}

function deleteCacheImage(index, isCache) {
  const list = isCache ? ocrCacheImgList.value : images.value;
  $app.invoke('deleteCacheImage', {
    path: imgPath.value.cache,
    file: list[index].cacheImage,
  }, () => {});
  if (isCache) {
    list.splice(index, 1);
  } else {
    list[index] = { ...list[index], cacheImage: '' };
  }
}

function removeExtension(filename) {
      filename = filename.startsWith('_') ? filename.slice(1) : filename;
      return filename.replace('.png', '');
}
function switchGallery (value) {
  const selectedItem = galleryName.value.find(item => item.value === value);
  selectTemplatePath.value = selectedItem ? selectedItem.dir : '';
  selectCachePath.value = selectedItem ? selectedItem.cache : '';
  showSetupDialog.value = !showSetupDialog.value;
  $app.invoke('switch_gallery', selectedItem, (data) => {
    if (data.isSuccess) {
      showToast("切换模板图库成功");
    } else {
      showToast("切换模板图库失败");
      console.error(data.message);
    }
  });
};

function restoreTemplate(value) {

  $app.invoke("restoreTemplate", {
    import: value,
    zip: galleryZip.value,
    deleteFile: deleteFile.value,
  }, data => {
    if (data.isSuccess) {
      showSetupDialog.value = false;
      if (value) {
        showToast((deleteFile.value ? "清空所有图片文件并\n" : "") + "导入模板包解压成功");
      } else {
        showToast((deleteFile.value ? "清空无关文件并\n" : "") + "还原所有模板图成功");
      }

    } else {
      showToast((value ? "导入" : "还原") + "模板图失败\n" + data.message);
      console.error(data.message);
    }
  });
};

function getDialogContainer() {
  return document.querySelector('html');
};

onMounted(() => {

  $app.invoke('galleryInfo', {}, data => {
    galleryName.value = data.galleryInfo_list;
    selectedGallery.value = data.galleryInfo.value;
    selectTemplatePath.value = data.galleryInfo.dir;
    selectCachePath.value = data.galleryInfo.cache;
  });
  updateImageInfo();
 
  $app.registerFunction('doUpdateImageInfo', updateImageInfo);

    //注册saveConfigs为saveGalleryConfigs
  $app.registerFunction('saveGalleryConfigs', saveConfigs);

  //showToast && showToast('vue加载完成...');
  setTimeout(() => {
    clientHeight.value = document.querySelector('html').clientHeight;
    console.log('client---height:' + clientHeight.value);
  }, 200);
});
</script>

<style scoped>

.input-container {
  justify-content: center;
  align-items: center;
  /* 垂直居中 */
  display: flex;
  gap: 10px;
  margin-top: 5px;
}
.search-input {
    width: 90%;
    padding: 5px 0px; 
    margin-left: 20px;
    margin-right: 20px;
    box-sizing: border-box;
}
.display {
    display: block;
}
/* 隐藏 */
.hidden {
    display: none;
}
.image-comparison {
  margin-bottom: 5px;
  margin-top :5px;
  border-bottom: 2px solid #ccc;
}
.image-section {
  display: flex;
  justify-content: space-between; /* 将左右两部分对齐到两端 */
  align-items: center; /* 垂直居中对齐内容 */

}
.button-container {
    display: flex;
  justify-content: space-between; /* 可选，根据需要调整按钮间距 */
}
.button {
    height: 35px;
    margin: 2px 15px 2px 0px;
}
.image-viewer {
  display: flex;
  flex: 1;
  text-align: center;
  align-items: center;
  height: 100%; 
  width: 100%;
}
.image-viewer img {
  max-width: 30%;
  height: 40px;
  margin: 2px 15px; 
}
.picture-info-text {
    display: flex;
  align-items: center;
}
.no-cache-image {
  font-size: 16px;  
  color: #999;  
  padding: 10px;  
  text-align: center;
  height: 80%;
  width: 100%;
}

.image-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.container {
    display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.custom-select {
  height: 25px;
  border: 1px solid #00FF00; /* 设置绿色边框 */
  outline: none; /* 去除聚焦时的轮廓 */
  padding: 0px 5px; /* 可根据需要调整内边距 */
  background: transparent; /* 背景透明 */
  appearance: none; /* 去掉浏览器默认样式 */
  justify-content: center;
}
.dialog-content {
      overflow-x: hidden;
    display: flex;
    flex-direction: column;
    padding: 10px 0px;
    align-items: center; /* 内容居中对齐 */
   max-height: 100%; /* 使用父容器的高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
}
</style>