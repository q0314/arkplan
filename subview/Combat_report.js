importClass(android.graphics.drawable.GradientDrawable);
//"ui"
importClass(android.widget.ScrollView)
importClass(android.view.View);
importClass(android.view.ViewGroup);


let state = false;
var view = ui.inflate(
    <frame background="#a9a9a9">
        <vertical align="top" margin="5">
            <card gravity="center_vertical" cardElevation="0dp" cardBackgroundColor="#a9a9a9" margin="0 0 0 5">
                <img src="file://res/icon.png" w="50" h="30" margin="0"/>
                <text text="PRTS辅助记录汇报" gravity="center|left" textColor="#000000" marginLeft="50"/>
                <linear gravity="center||right">
                    <spinner id="工具" background="@drawable/ic_view_list_black_48dp"  backgroundTint="#000001" layout_gravity="right" spinnerMode="dropdown"
                    w="33" h="35"  popupBackground="#a9a9a9" dropDownHorizontalOffset="-140px" foreground="?attr/selectableItemBackground"/>
                    
                    <linear gravity="center||right" marginLeft="5">
                        <img id="Exit" src="@drawable/ic_clear_black_48dp" w="35" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true"/>
                    </linear>
                </linear>
            </card>
            <globalconsole id="globalconsole"  w="*" h="*" visibility="gone"
            enabled="true" textIsSelectable="true" focusable="true" longClickable="true"/>
            
            <ScrollView  id="ScrollView" h="300" bg="#bcbcbc" visibility="visible">
                <text id="text" gravity="left" color="#000000"
                enabled="true" textIsSelectable="true" focusable="true" longClickable="true" size="13sp" padding="5" margin="0 0 0 10">
            </text>
        </ScrollView>
    </vertical>
    </frame>
);


view.globalconsole.setColor("V", "#bdbdbd");
view.globalconsole.setColor("D", "#795548");
view.globalconsole.setColor("I", "#1de9b6");
view.globalconsole.setColor("W", "#673ab7");
view.globalconsole.setColor("E", "#b71c1c");

var bhk = dialogs.build({
    // type: "app",
    type: "foreground-or-overlay",
    customView: view,
    wrapInScrollView: false
}).on("show", (dialog) => {
    state = true;
}).on("dismiss", (dialog) => {
    state = false;
})
view.Exit.on("click", () => {
    bhk.dismiss();
})
bhk.getWindow().setLayout(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);

//view.ScrollView.setHorizontalFadingEdgeEnabled(false); 
view.ScrollView.setVerticalScrollBarEnabled(false);
view.ScrollView.overScrollMode = View.OVER_SCROLL_NEVER;

var Combat_report = {
    view_show: function() {
        try{
            tool.setBackgroundRoundRounded(bhk.getWindow(), {radius:0,})
            }catch(e){
                console.verbose("combat设置对话框样式出错:"+e)
            }
        if (!state) {
            bhk.show();
            view.ScrollView.overScrollMode = View.OVER_SCROLL_NEVER;

            // view.mRootScrollView.fullScroll(ScrollView.FOCUS_DOWN);
        }
        //        view.text.setText(files.read("../lib/logs/Reporting_records.txt"));
        view.text.setText(files.read("./lib/data/Reporting_records.txt"));
        setTimeout(function() {
            ui.run(function() {
                // view.ScrollView.scrollTo(0, 600);
                view.ScrollView.fullScroll(ScrollView.FOCUS_DOWN);
            })
        }, 500)
        myAdapterListener(view.工具, [
            "顶部",
            "清空",
            "保存",
            "分享"
        ]);

        function myAdapterListener(spinner, dataList) {
            function setAdapter_gj(dataList) {
                let Options_menu = null;
                let adapter = JavaAdapter(android.widget.SpinnerAdapter, {
                    getCount: function() {
                        return dataList.length;
                    },
                    getItem: function(position) {
                        return dataList[position];
                    },
                    getItemId: function(position) {
                        return position;
                    },
                    getViewTypeCount: function() {
                        return 1;
                    },
                    getItemViewType: function(pos) {
                        return 0;
                    },
                    getDropDownView: function(position, convertView, parent) {
                        ui.run(function() {
                            if (!convertView) {
                                // let boxXml = <text textColor="#ff5722" paddingTop="34" gravity="center" textSize="20sp"></text>;
                                //展开菜单
                                let boxXml = (
                                    <frame>
                                                                    <TextView id="_text" padding="10dp" gravity="center"
                                                                    textColor="#000000" textSize="15sp" />
                                                                </frame>
                                );
                                convertView = ui.inflate(boxXml);
                                //convertView.attr("bg", "#a9a9a9");
                                // convertView.getChildAt(0).setBackgroundDrawable(drawable);
                            }
                            let item = dataList[position];
                            convertView.getChildAt(0).setText(item);
                            Options_menu = true;
                        })

                        return convertView;
                    },
                    getView: function(position, convertView, parent) {
                        ui.run(function() {
                            if (!convertView) {
                                //在选中确认之后显示的控件?
                                let boxXml =
                                    <text id="name" textSize="15sp">
                                                            </text>;
                                convertView = ui.inflate(boxXml, ui.drawer, false);
                            }
                            //点击事件
                            // let item = dataList[position];
                            let r = parent.getSelectedItem();
                            //toast(item)
                            if (Options_menu) {
                                Options_menu = false;
                                switch (r) {
                                    case '清空':
                                        record("清空_q")
                                        break;
                                    case '保存':
                                        record("保存_q");
                                        break;
                                    case '顶部':
                                        ui.run(function() {
                                            view.ScrollView.scrollTo(0, 0);
                                        })
                                        break;
                                    case '分享':
                                        record("分享_q");
                                        break;
                                }
                            }
                        })
                        return convertView;

                    },
                });

                return adapter;
            }
            ui.run(function() {
                spinner.setAdapter(setAdapter_gj(dataList));
            })
        }
    },

    record: function(text, time, log) {
       
        switch (log) {
            case "log":
                log(text)
                break;
            case "info":
                console.info(text)
                break
            case "warn":
                console.warn(text);
                break;
            case "verbose":
                console.verbose(text);
                break
            case "error":
                console.error(text)
                break;
        }
        if (!setting.作战汇报) {
            return false;
        }
        let de = new Date();
        let nm = de.getMonth() + 1; //月份
        let nd = de.getDate().toString(); //日期
        let nh = de.getHours().toString(); //小时
        let ns = de.getMinutes().toString(); //分钟
        let path = files.path("./lib/data/Reporting_records.txt");
        files.create(path)
        switch (text) {
            case null:
            case undefined:
                throw Error("文本不能为空!");
                return
            case "清空_q":
                files.write(path, "");
                view.text.text(files.read(path))
                return
            case "保存_q":
                files.copy(path, files.path("/sdcard/PRTS辅助记录汇报.txt"))
                toast("文件已保存至路径" + files.path("/sdcard/PRTS辅助记录汇报.txt"));
                return
            case "分享_q":
                app.viewFile(path);
                return
        }
        if (!time) {
            if (nd.length == 1) {
                nd = "0" + nd;
            }
            if (ns.length == 1) {
                ns = "0" + ns;
            }
            text = nm + "-" + nd + "_" + nh + ":" + ns + " " + text;
        }
        let file = open(path, "a")
        file.writeline(text);
        //输出缓冲区
        file.flush();
        //关闭文件
        file.close();
        try {
            view.text.setText(files.read(path));
        } catch (err) {}
        text = undefined;
    },
}
//Combat_report.view_show()
module.exports = Combat_report;