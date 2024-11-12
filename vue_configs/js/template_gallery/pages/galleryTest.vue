/*test
 * @Author: q0314
 * @Date: 2024-10-12 08:24:38
 * @Last Modified by: q0314
 * @Last Modified time: 2024-10-16 16:49:01
 * @Description: 使用sfc单文件组件方便在手机上查看修改
 */
<template>
  <div class="image-test-container">
    <van-nav-bar title="图片测试" left-arrow @click-left="$router.back()" class="fixed-bar"></van-nav-bar>
<div class="seize-seat-upper-corner"></div>
    <div class="content-wrapper">
      <div class="image-selection-area">
        <!-- 左侧区域，包含图像1 -->
        <div class="screenshot-area">
          <van-image :src="screenshotImg" id="screenshotView" fit="contain" @click="choicescreenshot"
            class="screenshot-image">
            <template #loading>
              <van-icon name="plus" size="48"></van-icon>
              <p>点击选择屏幕截图</p>
            </template>
          </van-image>
          <input type="file" id="screenshot" ref="screenshotInput" @change="handleFileUpload" accept="image/*"
            class="hidden-input" />
        </div>

        <!-- 右侧区域 -->
        <div class="small-images-area">
          <!-- 特征小图 -->
          <div class="small-image-wrapper">
            <van-checkbox v-model="isFeaturesImg" shape="square">特征小图</van-checkbox>
            <van-image :src="featuresImgSrc" id="featuresImgView" fit="contain" class="small-image">
              <template #loading>
                <div class="image-placeholder">
                  <p>特征小图</p>
                </div>
              </template>
            </van-image>
          </div>
          <!-- 缓存小图 -->
          <div class="small-image-wrapper">
            <van-checkbox v-model="isCacheImg" shape="square">缓存小图</van-checkbox>
            <van-image :src="cacheImgSrc" id="cacheImgView" fit="contain" class="small-image">
              <template #loading>
                <div class="image-placeholder">
                  <p>缓存小图</p>
                </div>
              </template>
            </van-image>
          </div>
        </div>
      </div>

      <van-field v-model="featuresImgRoute.path" label="小图路径" class="custom-field" placeholder="自定义小图路径(可选)"
        input-align="right">
        <template #right-icon>
          <van-switch v-model="featuresImgRoute.is" size="20px"></van-switch>
        </template>
      </van-field>
      <van-cell center title="大图识别区域:area">
        <template #right-icon>
          <van-popover v-model:show="showPopoverArea" theme="dark" :actions="area_actions" @select="onSelectArea"
            placement="bottom-end" overlay>
            <template #reference>
              <div>
                {{ areaSelectDisplay }}
                <van-icon name="arrow-down"></van-icon>
              </div>
            </template>
          </van-popover>
        </template>
      </van-cell>
      <tip-block>减少匹配区域，提高计算效率、匹配准确度</tip-block>

      <van-cell center title="特征匹配方式:matcher" class="custom-cell">
        <template #right-icon>
          <van-popover v-model:show="showPopoverMatcher" theme="dark" :actions="matcherActions"
            @select="onSelectMatcher" placement="bottom-end" overlay>
            <template #reference>
              <div>
                {{ areaSelect.matcherText }}
                <van-icon name="arrow-down"></van-icon>
              </div>
            </template>
          </van-popover>
        </template>
      </van-cell>
      <tip-block>模板特征匹配(SIFT)提供了全分辨率找图功能，可以识别检测图像中明显的特征并根据特征来查找类似图片</tip-block>

      <van-cell center title="图片相似度:threshold">
        <van-stepper v-model="areaSelect.threshold" :min="0.60" :max="1.00" :step="0.05" theme="round" :decimal-length="2"
          button-size="25px" @change="onStepperChange('threshold', $event)"></van-stepper>
      </van-cell>
      <tip-block>特征点相似度，过低容易在其它大图误匹配到该小图，降低相似度至0.70以下时的同时请降低矩形误差值</tip-block>

      <van-cell center title="大图缩放比例:scale">
        <van-stepper v-model="areaSelect.scale" :min="0.40" :max="1.00" :step="0.05" theme="round" :decimal-length="2"
          button-size="25px" @change="onStepperChange('scale', $event)"></van-stepper>
      </van-cell>
      <tip-block>计算特征时大图的缩放比例，缩放比例越小，计算特征越快，但可能因为放缩过度导致特征计算错误，影响矩形、准确度</tip-block>

      <van-cell title="矩形误差值:rectangular_error">
        <van-stepper v-model="areaSelect.rectangular_error" :min="10" :max="50" :step="5" theme="round" integer
          button-size="25px" @change="onStepperChange('rectangular_error', $event)"></van-stepper>
      </van-cell>
      <tip-block>可容忍矩形与匹配到的形状误差值，匹配到不规则形状时可能是非目标区域。最高建议35%</tip-block>

      <van-cell center title="灰度化:grayscale">
        <van-switch v-model="areaSelect.grayscale" size="20px"></van-switch>
      </van-cell>
      <tip-block>是否灰度化大图后再计算特征，减少色彩的影响</tip-block>
      
      <van-cell center title="成功后裁剪缓存小图:saveSmallImg">
        <van-switch v-model="areaSelect.saveSmallImg" size="20px"></van-switch>
      </van-cell>
      <tip-block>匹配成功后，从大图裁剪匹配区域的小图为缓存图，正常运行时会使用缓存图进行普通匹配而不是模板特征匹配，加快匹配速度，普通匹配失败时根据picture_failed_further是否重新进行模板特征匹配</tip-block>
      
      <van-cell center title="使用上次缓存的特征大图:refresh">
        <van-switch v-model="areaSelect.refresh" size="20px" disabled></van-switch>
      </van-cell>
      <tip-block>如果有上次特征图...，两个不同区域小图匹配，最好第二张小图开头就设置picture_failed_further:true重新匹配计算特征，否则会导致匹配可视化结果图区域不对</tip-block>

        <van-floating-bubble v-model:offset="offset" axis="xy" magnetic="x" icon="play" @click="startTest" >
        </van-floating-bubble>
    
      <van-cell :title="visualizationResultTitle" is-link @click="toggleVisualizationResult">
        <template #right-icon>
          <van-icon :name="showImagesResult ? 'arrow-up' : 'arrow-down'"></van-icon>
        </template>
      </van-cell>
      <van-collapse v-if="showImagesResult" v-model="activeNames">
        <tip-block>绿色框为识别到的位置，如果不是类似方形的框框(矩形)，识别结果根据可容忍矩形误差值(rectangular_error)大小进行过滤，详细查看运行日志</tip-block>
        <van-collapse-item v-for="(path, index) in currentTemplateInfo.visualization" :key="index" v-show="path !== ''"
          :title="`特征匹配方式matcher: ${index + 1}识别结果`">
          <img :src="path" alt="image" class="result-image" />
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>

</template>
<script setup>
const { ref, watch, onMounted, computed } = Vue;
const { showToast, showSuccessToast, showLoadingToast, closeToast } = vant;
const galleryPath = ref(
  {
    template: "/storage/emulated/0/Android/data/org.autojs.autojspro/files/gallery_list/template/",
    cache: "/storage/emulated/0/Android/data/org.autojs.autojspro/files/gallery_list/",
  });
const featuresImgRoute = ref({
  path: "",
  is: false,
});
const offset = ref({
 x:document.body.clientWidth*300/375,y:document.body.clientHeight*0.87
})
const area_actions = ref([{ text: "全屏", area: 0 },
{ text: "左上角", area: 1 },
{ text: "左下角", area: 3 },
{ text: "左半屏", area: 13 },
{ text: "右上角", area: 2 },
{ text: "右下角", area: 4 },
{ text: "右半屏", area: 24 },
{ text: "上半屏", area: 12 },
{ text: "下半屏", area: 34 },
{ text: "中间区域", area: 5 },

]);
const matcherActions = [{ text: "BRUTEFORCE_L1", matcher: 1 }, {
  text: "BRUTEFORCE_SL2", matcher: 2,
}, { text: "BRUTEFORCE", matcher: 3 }, {
  text: "FLANNBASED", matcher: 4
}]
let currentTemplateInfo = ref({
  visualization: []
})
let screenshotImg = ref(null);
let featuresImg = ref(null);
let cacheImg = ref(null);
let isFeaturesImg = ref(true);
let isCacheImg = ref(false);
let showPopoverArea = ref(false);
let showPopoverMatcher = ref(false);
let areaSelect = ref({
  area: 0,
  areaText: "全屏",
  threshold: 0.85,
  rectangular_error: 35,
  matcher: 1,
  matcherText: "BRUTEFORCE_L1",
  grayscale: true,
  visualization: true,
  refresh:true,
  action: 5,
  scale: 1,
  saveSmallImg: false,
  picture: null,
  small_image_catalog: "",
});
let showImagesResult = ref(false);
let activeNames = ref([]);
const areaSelectDisplay = computed(() => {
  return `${areaSelect.value.areaText}/${areaSelect.value.area}`;
});

const featuresImgSrc = computed(() => {
  return `${galleryPath.value.template}${featuresImg.value}`;
});

const cacheImgSrc = computed(() => {
  return `${galleryPath.value.cache}${cacheImg.value}`;
});

const visualizationResultTitle = computed(() => {
  return currentTemplateInfo.value.visualization.length > 0
    ? '点击展开最近的特征匹配可视化结果'
    : '打开设置-滑动到底部-调试，再次运行到对应界面即可查看相关可视化结果';
});

const toggleVisualizationResult = () => {
  showImagesResult.value = !showImagesResult.value;
};

const choicescreenshot = () => {

  const screenshot = null;
  try {
    screenshot = this.$refs.screenshotInput;
  } catch (e) {
    console.error(e);
  }
  if (screenshot && typeof screenshot.click === 'function') {
    screenshot.click();
  } else {
    console.error('screenshot 不是一个有效的 HTMLInputElement 或没有 click 方法');
    document.getElementById('screenshot').click();
  }
}
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('只能上传图片');
    return;
  }

  if (file.size / 1024 / 1024 > 15) {
    showToast('文件大小不能超过 15MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    screenshotImg.value = e.target.result;
    areaSelect.value.picture = screenshotImg.value;
  };
  reader.readAsDataURL(file);
};

const onSelectArea = (action) => {
  areaSelect.value.areaText = action.text;
  areaSelect.value.area = action.area;
}
const onSelectMatcher = (action) => {
  areaSelect.value.matcherText = action.text;
  areaSelect.value.matcher = action.matcher;
  console.error(areaSelect)
}
const onStepperChange = (stepperId, value) => {
  // 处理步进器值变化的逻辑
  console.log(`步进器 ${stepperId} 的值变化为:`, value);
  areaSelect.value[stepperId] = value;

}
function splitPath(filePath) {
  const lastSlashIndex = filePath.lastIndexOf('/'); // 找到最后一个斜杠的位置

  // 如果找到了斜杠，进行分割
  if (lastSlashIndex !== -1) {
    const directory = filePath.substring(0, lastSlashIndex) + '/'; // 目录
    const fileName = filePath.substring(lastSlashIndex + 1); // 文件名
    return { directory, fileName };
  }

  // 如果没有找到斜杠，则返回原路径作为文件名，目录为空
  return { directory: '', fileName: filePath };
}
const startTest = () => {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '特征匹配中...',
  });
  areaSelect.value.imgName = isFeaturesImg ? featuresImg.value : cacheImg.value;
  if (featuresImgRoute.value.is) {
    let pathResult = splitPath(featuresImgRoute.value.path);
    areaSelect.value.imgName = pathResult.fileName;
    areaSelect.value.small_image_catalog = pathResult.directory;
  } else {
    areaSelect.value.small_image_catalog = galleryPath.value[isFeaturesImg.value ? 'template' : 'cache'];
  }
  $app.invoke("startTest", areaSelect.value, data => {
    // console.info(JSON.stringify(data))
    closeToast();
    if (!data.isSuccess) {
      showToast({
        message: "匹配失败,原因：\n" + data.message,
        wordBreak: 'break-word',
      });
      console.error("匹配失败,原因：\n" + data.message)
    } else {
      showSuccessToast("匹配成功\n" + data.message);
      if (data.visualization && data.visualization.length) {
        currentTemplateInfo.value.visualization = data.visualization;
      }
    }
  })
}
watch(isFeaturesImg, (newValue) => {
  if (newValue && isCacheImg.value == true) {
    isCacheImg.value = false;
  }
})
watch(isCacheImg, (newValue) => {
  if (newValue) {
    isFeaturesImg.value = false;
  }
})

watch(
  () => areaSelect.value.saveSmallImg,
  (newValue) => {
    if (newValue && isFeaturesImg.value && cacheImg.value) {
      showToast("暂不支持在已有缓存图的情况下，使用模板图重新匹配裁剪缓存");
      areaSelect.value.saveSmallImg = false;
    }
  })

onMounted(() => {
  $app.invoke('doTestInfo', {}, data => {
    galleryPath.value = data.imgPath;
    featuresImg.value = data.templateImage;
    cacheImg.value = data.cacheImage;
    currentTemplateInfo.value = data.currentTemplateInfo;
    if (!currentTemplateInfo && !currentTemplateInfo.visualization) {
      currentTemplateInfo.value = {
        visualization: []
      }
    }
  })
})
</script>

<style scoped>
::v-deep .van-cell__title {
  min-width: 70%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .van-cell__value {
  min-width: 30%;
  text-align: left;
  /* Ensure the content is left-aligned */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* 确保内容靠右对齐 */
}

::v-deep .custom-cell .van-cell__title {
  min-width: 50%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .custom-cell .van-cell__value {
  max-width: 50%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

::v-deep .custom-field .van-field__label {
  min-width: 10%;
  /* 设置最小宽度 */
  display: flex;
  /* 使用 Flexbox */
  align-items: center;
  /* 垂直居中对齐 */
}
.flex_ {
  display: flex;
}

.content-wrapper {
  padding: 10px;
}

.image-selection-area {
  display: flex;
}

.screenshot-area {
  flex: 3;
  height: 120px;
  display: flex;
  flex-direction: column;
}

.screenshot-image {
  flex: 1;
  height: 120px;
}

.hidden-input {
  display: none;
}

.small-images-area {
  flex: 1;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
}

.small-image-wrapper {
  flex: 1;
}

.small-image {
  width: 100%;
  height: 40px;
}

.image-placeholder {
  text-align: center;
}


.action-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.result-image {
  width: 100%;
}
</style>
