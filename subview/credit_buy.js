let RecyclerView = require('../modules/RecyclerView.js');
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
        if (items.length == 21) {
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
            if (items.indexOf(text) != -1) {
                snakebar(text + " 已添加")
                return
            }
            items.push(text)
            uii.grid.adapter.notifyItemChanged(items.length)

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

    uii.ok.on("click", function () {
        console.error(uii.s1.checked)
        console.error(uii.l1.checked)
        console.info(items)
        callback({ "购买列表": items, "信用购买": true, "优先顺序": uii.l1.checked ? true : false, "三百信用": uii.s1.checked })
        res.dismiss()
    })

    uii.s1.checked = (words.三百信用 ? true : false);
    words.优先顺序 ? uii.l1.checked = true : uii.l2.checked = true;

    console.info(words.购买列表)
    items = words.购买列表 || [
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

    uii.grid.setDataSource(items);

    uii.grid.on('item_bind', (itemView, itemHolder) => {
        //删除数据 
        itemView.delete.on('click', () => {
            items.splice(itemHolder.position, 1);
        });
    });

    RecyclerView(uii.grid, items);

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


