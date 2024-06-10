"ui";
var json_path = "../lib/game_data/ocr_公招_矫正规则.json";
var execArgv = engines.myEngine().execArgv;

if (execArgv.json_path) {
    json_path = execArgv.json_path;
}
if (!Object.entries) {
    /** @return {IterableIterator<[number,any]>} */
    Object.prototype.entries = function(obj) {
        // Check if obj is an object
        if (typeof obj !== 'object' || obj === null) {
            throw new TypeError('Object.entries called on non-object');
        }

        // Define an empty array to store key-value pairs
        let result = [];

        // Iterate over the keys of the object
        for (let key in obj) {
            // Check if the key is a direct property of the object (not inherited)
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Push key-value pair to the result array
                result.push([key, obj[key]]);
            }
        }

        // Return the array of key-value pairs
        return result;
    }
}

importClass(android.content.Context);

ui.layout(
    <vertical>
        <appbar>
            <toolbar id="toolbar" title="ocr字符矫正配置" />
        </appbar>
        <ScrollView>
            
            <vertical >
                
                <text id="tips" margin="10 0" />
                <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
                cardElevation="5dp" gravity="center_vertical"  >
                <vertical>
                    <text text='错误部分字符替换' margin="10 5 10 0" h="35dp" id="text_bg"
                    gravity="center|left" textSize='16sp' textColor="#000000" >
                </text>
                <View bg="#eeeeee" h="1" w="*" />
                <text id="tips1" margin="10 0" />
                <horizontal>
                    <button text="添加矫正规则" id="add1" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                    <button text="查看运行日志" id="journal1" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
                    
                </horizontal>
                <vertical id="replace_some_characters" margin="5 0" >
                    
                    
                </vertical>
            </vertical>
        </card>
        <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
        cardElevation="5dp" gravity="center_vertical"  >
        <vertical>
            <text text='错误完整字符替换' margin="10 5 10 0" h="35dp" id="text_bg"
            gravity="center|left" textSize='16sp' textColor="#000000" >
        </text>
        <View bg="#eeeeee" h="1" w="*" />
        <text id="tips2" margin="10 0" />
        <horizontal>
            <button text="添加矫正规则" id="add2" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
            <button text="查看运行日志" id="journal2" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
            
        </horizontal>
        <vertical id="replace_full_character" margin="5 0" >
            
            
        </vertical>
    </vertical>
    </card>
    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
    cardElevation="5dp" gravity="center_vertical"  >
    <vertical>
        <text text='过滤包含部分字符(文字)' margin="10 5 10 0" h="35dp" id="text_bg"
        gravity="center|left" textSize='16sp' textColor="#000000" >
    </text>
    <View bg="#eeeeee" h="1" w="*" />
    <text id="tips3" margin="10 0" />
    <horizontal>
        <button text="添加过滤规则" id="add3" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
        <button text="查看运行日志" id="journal3" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
        
    </horizontal>
    <vertical id="filter_partial_characters" margin="5 0" >
        
        
    </vertical>
    </vertical>
    </card>
    
    <card w="*" id="indx2" margin="10 3 10 3" h="*" cardCornerRadius="10"
    cardElevation="5dp" gravity="center_vertical"  >
    <vertical>
        <text text='过滤完整字符(文字)' margin="10 5 10 0" h="35dp" id="text_bg"
        gravity="center|left" textSize='16sp' textColor="#000000" >
    </text>
    <View bg="#eeeeee" h="1" w="*" />
    <text id="tips4" margin="10 0" />
    <horizontal>
        <button text="添加过滤规则" id="add4" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
        <button text="查看运行日志" id="journal4" style="Widget.AppCompat.Button.Borderless.Colored" layout_weight="1" />
        
    </horizontal>
    <vertical id="filter_full_characters" margin="5 0" >
        
        
    </vertical>
    </vertical>
    </card>
    
    <vertical marginBottom='50'>
    </vertical>
    
    </vertical>
    
    </ScrollView>
    
    </vertical>
);



var height = device.height,
    width = device.width;
var fix;

if (typeof execArgv.json_path == "object") {
    json_path = Object.entries(execArgv.json_path)[0];
    ui["toolbar"].setTitle("OCR识别" + json_path[0]);
    json_path = json_path[1];
    if (files.exists(json_path)) {
        fix = JSON.parse(files.read(json_path));
        for (let id of Object.keys(fix)) {
            if (fix[id] && ui[id]) {
                update(fix[id], ui[id]);
            };
        }
    }
    //创建选项菜单(右上角)
    ui.emitter.on("create_options_menu", menu => {
        for (let i in execArgv.json_path) {
            menu.add(i);
        };
    });
    //监听选项菜单点击
    ui.emitter.on("options_item_selected", (e, item) => {
        for (let i in execArgv.json_path) {
            if (i == item.getTitle()) {
                ui["toolbar"].setTitle("OCR识别" + i);
                json_path = execArgv.json_path[i];
                if (files.exists(json_path)) {
                    fix = JSON.parse(files.read(json_path));
                    for (let id of Object.keys(fix)) {
                        if (fix[id] && ui[id]) {
                            update(fix[id], ui[id]);
                        };
                    };
                } else {
                    let tips = "该路径文件不存在,请检查:" + files.path(json_path);
                    console.error(tips);
                }
                break
            }
        };
        e.consumed = true;
    });
} else {
    if (files.exists(json_path)) {
        fix = JSON.parse(files.read(json_path));
        for (let id of Object.keys(fix)) {
            if (fix[id] && ui[id]) {
                update(fix[id], ui[id]);
            };
        }
    }
}
ui.tips.setText("");
ui.tips1.setText("注释: (ocr识别到的文字)错误字符: 快婕编队 → (实际上我们看到的屏幕内容)正确字符: 快捷编队 ，由于这是部分的字符替换，所以只建议针对双字(单字容易替换其它正确的内容。多字，其它字也识别错误，就无法替换了，错误例子：快婕編队→快捷编队，如果ocr识别到的是快婕编队，就无法替换其中的错别字'婕')，正确例子：快婕→快捷，加 編队→编队")

ui.tips3.setText("注释: (ocr识别到的文字)在一组字符中如果包含该文字,将不会显示在运行日志的OCR识别结果信息中。慎重考虑，这将会影响开发人员的判断。");
ui.tips4.setText("注释: (ocr识别到的文字)一组字符如果完全等于该文字,将不会显示在运行日志的OCR识别结果信息中。慎重考虑，这将会影响开发人员的判断。");

for (let i = 1; i <= 4; i++) {
    ui["add" + i].click((view) => {
        let parent = view.getParent();
        let index = parent.getParent().indexOfChild(parent);
        AddMaterial({
            'AddText_error': '',
            'AddText_correct':( view.getText().toString().indexOf("过滤") != -1 ? false :''),
            "regular": false,
            'position': false,
        }, parent.getParent().getChildAt(index + 1))

    })
    ui["journal" + i].click(() => {
        app.startActivity("console");
    });
}




function update(coord, view) {

    for (let i = view.getChildCount() - 1; i >= 0; i--) {
        view.removeView(view.getChildAt(i));
    };
    if (Object.prototype.toString.call(coord) == "[object Object]") {

        for (let character in coord) {
            let type = Object.prototype.toString.call(coord[character]) == "[object Object]";
            AddMaterial({
                'AddText_error': character,
                'AddText_correct': type ? coord[character].correct : false,
                "regular": type ? coord[character].regular : coord[character],
                'position': true,
            }, view);

        }
    } else {
        for (let character of coord) {
            AddMaterial({
                'AddText_error': character[0],
                'AddText_correct': false,
                "regular": character[1],
                'position': true,
            }, view)

        }
    }
}

function AddMaterial(item, view) {
    AddText_error = item.AddText_error || '';
    AddText_correct = item.AddText_correct;
    regular = item.regular || false;
    log(AddText_correct)
    let AddText = ui.inflate(
        '\<horizontal layout_weight="1">\
            <text text=' + ((AddText_correct === false) ? '"文字:"' : '"错误:"') + '/>\
            <input id="error" layout_weight="3" lines="1" text="{{AddText_error}}" />' +
        ((AddText_correct === false) ? '' : '<text text="正确:" />\
            <input id="correct" layout_weight="3" lines="1" text="{{AddText_correct}}" />') +
        '<checkbox id="regular" text="正则匹配" checked="{{regular}}" w="auto" />\
        </horizontal>',
        view
    );

    ui.run(() => {
        if (item.position == true) {
            view.addView(AddText);
        } else {
            view.addView(AddText, (item.position || 0));
        }
    })

}



activity.setSupportActionBar(ui.toolbar);
activity.getSupportActionBar().setDisplayHomeAsUpEnabled(true);
ui.toolbar.setNavigationOnClickListener({
    onClick: function() {
        if (stockpile()) {
            return;
        };
        ui.finish();
    }
});



//当离开本界面时保存data
ui.emitter.on("back_pressed", (e) => {
    if (stockpile()) {
        e.consumed = true;
        return;
    };
});

function stockpile(value) {
    for (let id of Object.keys(fix)) {
        // log(id);

        for (let i = 0; i < (ui[id] ? ui[id].getChildCount() : 0); i++) {
            let error = ui[id].getChildAt(i).getChildAt(1).getText().toString();
            let correct = ui[id].getChildAt(i).getChildAt(3);
            if (correct) {
                correct = correct.getText().toString();
            };
            let regular = ui[id].getChildAt(i).getChildAt(correct ? 4 : 2).checked;

            if (error != '') {
                if (correct) {
                    fix[id][error] = {
                        "correct": correct,
                        "regular": regular
                    };
                } else {
                    fix[id][error] = regular;
                }
            } else {
                console.error(error + " " + "错误文字 不能为空");
            }
        }
    }

    log(JSON.stringify(fix));
    files.write(
        json_path,
        JSON.stringify(fix),
        (encoding = "utf-8")
    );

    toastLog("保存ocr矫正内容成功")
    return false;
}