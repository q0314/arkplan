<template>
  <span style="position: relative; margin-right: 0px">
    <i
      @click="inputer.focus()"
      class="van-icon van-icon-search"
      style="position: absolute; font-size: 22px; top: 2px; left: 2px;"
    ></i>
    <input
      type="text"
      v-model="highLightStr"
      @input="elementSearchInputEvent"
      @keyup="elementSearchKeyEvent"
      ref="inputer" placeholder="请输入名称或备注"
      class="element-search"
    />
  </span>
</template>

<script setup>
const { ref } = Vue;
const { showToast } = vant;
const {useRouter,useRoute}  = VueRouter;

function throttle(fn, delay){
	let valid = true;
	return function(){
		if(valid) {
			fn.apply(this, arguments);
      valid = false;
      setTimeout(()=> {
				valid = true;
			}, delay)
		}
	}
}

const props = defineProps({
  refSearchAttrName: Function,
  refHighLightAttrName: String,
});
const $router = useRouter();
const $route = useRoute();


const inputer = ref();
const highLightStr = ref("");


if (!localStorage.getItem('elementSearch')) {
  localStorage.setItem('elementSearch', JSON.stringify({}));
}

const store = JSON.parse(localStorage.getItem('elementSearch'));
const key = $route.fullPath;

if (!store[key]) {
  storeInfo('', -1);
}else if(store[key].k != ""){
    setTimeout(function(){
        showToast("显示上次搜索内容");
        highLightStr.value = store[key].k;
        if(props.refSearchAttrName(store[key])===false){
            setTimeout(function(){
                props.refSearchAttrName(store[key])
            },1000);
        }
        },500);
}

function storeInfo(k, i) {
  store[key] = { k, i };
  localStorage.setItem('elementSearch', JSON.stringify(store));
  props.refSearchAttrName(store[key])
}


let lastSearchStr = "";
let lastSearchIndex = 0;

function elementSearchInputEventOrigin(e, up) {
  storeInfo(highLightStr.value, lastSearchIndex + (up ? -1 : 1));
}

function elementSearchKeyEvent(e) {
  if (e.keyCode === 13) {
    elementSearchInputEvent(e, e.shiftKey);
  }
}

const elementSearchInputEvent = throttle(elementSearchInputEventOrigin, 200);

function doHighlightFromQuery() {
  highLightStr.value = store[key].k;
  lastSearchStr = store[key].k;
  lastSearchIndex = store[key].i - 1;
  setTimeout(elementSearchInputEvent, 100);
};

defineExpose({ doHighlightFromQuery });
</script>
<style scoped>
.element-search {
  transition: all 250ms;
  display: inline-block;
  box-sizing: border-box;
  width: 24px;
  min-width: 0;
  margin: 0;
  padding-left: 24px;
  color: var(--van-field-input-text-color);
  line-height: inherit;
  background-color: transparent;
  text-align: left;
  border: 0;
  border-radius: 6px;
  resize: none;
  -webkit-user-select: auto;
  user-select: auto;
}
.element-search:focus {
  background-color: #f4f5f7;
  width: 200px;
}
</style>
