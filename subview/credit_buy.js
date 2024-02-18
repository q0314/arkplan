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
            try {
                //震动7毫秒 
                device.vibrate(7);
            } catch (e) {

            }
            ary = new Array();
            for (let i in _items_) {
                if (_items_[i]) ary.push(_items_[i]);
            }
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
        _items_ = ary;
        recyclerView.setDataSource(_items_);
        recyclerView.adapter.notifyDataSetChanged(); //完成拖动后刷新适配器，这样拖动后删除就不会错乱 
    }
}));

credit_buy_interface = function (words, callback, callback_2) {
    let uii = ui.inflate(
        <vertical id="parent">
            <frame>
                <ScrollView>
                    <vertical>
                        <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#00000000">
                            <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                            <text text="购买物品管理" gravity="center|left" textColor="#000000" marginLeft="50" />

                            <linear gravity="center||right" margin="5 0" >
                                <text id="wenn" textColor="#03a9f4" text="添加物品" padding="10 10 20 10" w="auto" h="auto" foreground="?attr/selectableItemBackground" clickable="true" marginRight="10" />
                                <spinner id="tianjia" margin="-10 0" entries=" |加急许可|招聘许可|赤金|技巧概要·卷2|技巧概要·卷1|固源岩|源岩|装置|破损装置|聚酸酯|酯原料|糖|代糖|异铁|异铁碎片|酮凝集|双酮|初级作战记录|基础作战记录|龙门币|家具零件" spinnerMode="dropdown" w="0px" h="0px" dropDownHorizontalOffset="{{-350}}px" />
                            </linear>

                        </card>
                        <checkbox id="s1" text="信用点小于300时不购买物品" w="*" h="auto" />

                        <radiogroup id="ll" orientation="horizontal" h="auto" w="auto">
                            <radio id="l1" text="优先按列表顺序" checked="true" w="*" h="auto" />
                            <radio id="l2" text="优先按优惠力度" w="*" h="auto" />
                        </radiogroup>


                        <vertical gravity="center" margin="0 -2" id="prompt_line">
                            <text text="拖动排列以调整优先购买顺序，将无需购买的物品移除" textSize="15" id="tips" gravity="center_horizontal" />
                            <grid id='grid' w='*' h='*' spanCount='3'>
                                <relative bg='#90eff8f4' margin='1'>
                                    <img id='delete' w='20' h='20' margin='3 3 10 3' background='@drawable/ic_close_white_24dp' backgroundTint='#FF0000' layout_alignParentRight='true' />
                                    <vertical w='*' padding='0 10' layout_centerInParent='true'>
                                        <img w='28dp' h='28dp' layout_gravity='center'
                                            src='file://res/material/{{this}}.png' />
                                        <text paddingTop='2' text='{{this}}' gravity='center' />
                                    </vertical>
                                </relative>
                            </grid>
                            <text text="基于OCR 光学字符 文字识别, 目前仅支持简中文本" textSize="15" id="tips" gravity="center_horizontal" />

                        </vertical>

                        <horizontal w="*" padding="-3" gravity="center_vertical">
                            <button text="取消" id="exit" textColor="#F4A460" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                            <button text="确认" id="ok" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                        </horizontal>
                    </vertical>
                </ScrollView>
            </frame>
        </vertical>);

    var res = dialogs.build({
        type: "app",
        customView: uii,
        wrapInScrollView: false
    })
    tool.setBackgroundRoundRounded(res.getWindow(), { radius: 5, })
    uii.wenn.on('click', function () {
        if (_items_.length == 21) {
            snakebar("无可添加物品")
            return
        }
        uii.tianjia.performClick()
    })

    uii.tianjia.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener({
        onItemSelected: function (parent, id) {
            let text = parent.getSelectedItem();
            if (text == ' ') {
                return
            }
            if (_items_.indexOf(text) != -1) {
                snakebar(text + " 已添加")
                return
            }
            _items_.push(text);
            uii.grid.adapter.notifyItemChanged(_items_.length)

            snakebar(text + " 添加成功")

        }
    }))
    uii.l1.on("check", (checked) => {
        if (checked)
            uii.tips.setText("拖动排列以调整优先购买顺序，将无需购买的物品移除");
    })
    uii.l2.on("check", (checked) => {
        if (checked)
            uii.tips.setText("将无需购买的物品移除");
    })
    uii.exit.on("click", function () {
        res.dismiss();
    })



    uii.s1.checked = (words.三百信用 ? true : false);
    words.优先顺序 ? uii.l1.checked = true : uii.l2.checked = true;

   // console.info(words.购买列表)
    _items_ = words.购买列表 || [
        "加急许可",
        "招聘许可",
        "赤金",
        "技巧概要·卷2",
        "技巧概要·卷1",
        "固源岩",
        "源岩",
        "装置",
        "破损装置",
        "聚酸酯",
        "酯原料",
        "糖",
        "代糖",
        "异铁",
        "异铁碎片",
        "酮凝集",
        "双酮",
        "初级作战记录",
        "基础作战记录",
        "龙门币",
        "家具零件"
    ] // 商店货物优先级

    uii.grid.setDataSource(_items_);

    uii.grid.on('item_bind', (itemView, itemHolder) => {
        //删除数据 
        itemView.delete.on('click', () => {
            _items_.splice(itemHolder.position, 1);
            uii.grid.adapter.notifyItemChanged(_items_.length)

            //    RecyclerView.attachToRecyclerView(uii.grid, _items_);
        });
    });


    uii.ok.on("click", function () {
        //let str_level_choices = [];
        try {
            console.info(_items_)
            callback({ "购买列表": _items_, "信用购买": true, "优先顺序": uii.l1.checked, "三百信用": uii.s1.checked })
            res.dismiss();
        } catch (e) {
            console.error(e);
        }
    });

    helper.attachToRecyclerView(uii.grid);


    function snakebar(text) {
        com.google.android.material.snackbar.Snackbar.make(uii.wenn, text, 1000).show();
    }
    res.show();

}
try {
    module.exports = credit_buy_interface;
} catch (err) {
    credit_buy_interface()
}


