<template>
  <div>
    <div>
      <van-nav-bar title="模板图库管理" left-arrow @click-left="onClickLeft" class="fixed-bar">
        <template #right>
          <van-icon name="search" class="icon" @click.stop="onSearchClick" />
          <van-icon name="setting" class="icon" @click.stop="onSettingClick" />
        </template>
      </van-nav-bar>
    </div>

    <div class="seize-seat-upper-corner"></div>

    <van-row class="minimum-container">
      <router-view></router-view> <!-- 显示当前路由的组件 -->

      <picture-operation />
    </van-row>

    <van-dialog v-model:show="showSetupDialog" v-cloak title="设置" :show-confirm-button="false"
      :close-on-click-overlay="true">
      <div class="dialog-content">
        <div class="input-container">
          <p style="text-align: center;">选中的模板图库:</p>
          <select v-model="value1" @change="switchGallery(value1)" class="custom-select">
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
const { ref, onMounted } = Vue;
const { showToast } = vant;
const resourcePath = ref('unknown');
const showSetupDialog = ref(false);
const clientHeight = ref(200);
const deleteFile = ref(false);
const value1 = ref(0);
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

const switchGallery = (value) => {
  const selectedItem = galleryName.value.find(item => item.value === value);
  selectTemplatePath.value = selectedItem ? selectedItem.dir : '';
  selectCachePath.value = selectedItem ? selectedItem.cache : '';
  $app.invoke('switch_gallery', selectedItem, (data) => {
    if (data.isSuccess) {
      showToast("切换模板图库成功");
    } else {
      showToast("切换模板图库失败");
      console.error(data.message);
    }
  });
};

const onClickLeft = () => {
  $app.invoke('uiExit', {});
};

const onSearchClick = () => {
  console.log('Search icon clicked');
  let searchElement = document.getElementById('Search');
  if (searchElement && searchElement.classList.contains('display')) {
    searchElement.classList.remove('display');
    searchElement.classList.add('hidden');
  } else {
    showToast("搜索");
    searchElement.classList.remove('hidden');
    searchElement.classList.add('display');
  }
  $app.invoke('searchValue', {});
};

const onSettingClick = (e) => {
  console.log('Setting icon clicked', showSetupDialog.value);
  e.stopPropagation();
  showSetupDialog.value = !showSetupDialog.value;
};

const restoreTemplate = (value) => {

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

const getDialogContainer = () => {
  return document.querySelector('html');
};

onMounted(() => {
  $app.invoke('galleryInfo', {}, data => {
    galleryName.value = data.galleryInfo_list;
    //console.log(data.galleryInfo);
    value1.value = data.galleryInfo.value;
    selectTemplatePath.value = data.galleryInfo.dir;
    selectCachePath.value = data.galleryInfo.cache;
  });
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
</style>