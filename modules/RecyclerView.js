/*
 * @Author: 大柒
 * @QQ: 531310591@qq.com
 * @Date: 2021-04-15 18:29:53
 * @Version: Auto.Js Pro
 * @Description: 参考文章:https://www.jb51.net/article/141459.htm
 * @LastEditors: 大柒
 * @LastEditTime: 2021-04-15 19:37:53
 */

//导入依赖包;
importClass("androidx.recyclerview.widget.RecyclerView");
importClass("androidx.recyclerview.widget.ItemTouchHelper");
importClass("androidx.recyclerview.widget.GridLayoutManager");
/**
* 数组元素交换位置
* @param {array} arr 数组
* @param {number} index1 添加项目的位置
* @param {number} index2 删除项目的位置
* index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
*/
function swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}
/**
    * RecyclerView手势器：
    * 参考文章: https://www.jb51.net/article/141459.htm
    */
let items = [];
let helper = new ItemTouchHelper(new ItemTouchHelper.Callback({
    getMovementFlags: function (recyclerView, viewHolder) {
        //指定支持的拖放方向为上下左右
        let dragFrlg = ItemTouchHelper.UP | ItemTouchHelper.DOWN | ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT;
        return this.makeMovementFlags(dragFrlg, 0);
    },

    onMove: function (recyclerView, viewHolder, target) {
        //得到当拖拽的viewHolder的Position 
        let fromPosition = viewHolder.getAdapterPosition();
        let toPosition = target.getAdapterPosition();
        if (fromPosition < toPosition) {
            for (let i = fromPosition; i < toPosition; i++) {
                //数组指定元素交换位置
                swapArray(ary, i, i + 1);
            }
        } else {
            for (let i = fromPosition; i > toPosition; i--) {
                swapArray(ary, i, i - 1);
            }
        }
        //通知适配器移动Item的位置
        recyclerView.adapter.notifyItemMoved(fromPosition, toPosition);
        return true;
    },

    isLongPressDragEnabled: function () {
        return true;
    },

    /** 
     * 长按选中Item的时候开始调用 
     * 长按高亮 
     * @param viewHolder 
     * @param actionState 
     */
    onSelectedChanged: function (viewHolder, actionState) {
        this.super$onSelectedChanged(viewHolder, actionState);
        if (actionState != ItemTouchHelper.ACTION_STATE_IDLE) {
            //改变选中Item的背景色
            viewHolder.itemView.attr("backgroundTint", "#7AFF0000");
            try{
            //震动7毫秒 
            device.vibrate(7);
        }catch(e){
            
        }
            ary = new Array();
            for (let i in items) ary.push(items[i]);
        }
    },

    /** 
     * 手指松开的时候还原高亮 
     * @param recyclerView 
     * @param viewHolder 
     */
    clearView: function (recyclerView, viewHolder) {
        this.super$clearView(recyclerView, viewHolder);
        viewHolder.itemView.attr("backgroundTint", "#FFFFFF");
        items = ary;
        recyclerView.setDataSource(items);
        recyclerView.adapter.notifyDataSetChanged(); //完成拖动后刷新适配器，这样拖动后删除就不会错乱 
    }
}));


module.exports = function (view, item) {
    items = item;
    //设置手势器附着到对应的RecyclerView对象。
    ui.run(() => {
        helper.attachToRecyclerView(view);
    });
}