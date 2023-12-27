"ui";
var color = "#4C484C";
var frameColor = "#7E787F";
var textColor = "#CCCCCC";
var img_scriptIconColor = "#057E787F";
ui.statusBarColor("#4C484C");

ui.layout(
    
        <vertical background="{{frameColor}}">
            <appbar background="#4C484C">
                <toolbar id="toolbar" title="模拟器/虚拟机使用情况"/>
                
            </appbar>
    <frame >
                
        <list id="list">
            <vertical w="*">
                <linear id="script_list" h="*" margin="10 0">
                    
                    <vertical h="*" >
                        {/* 脚本名称 */}
                        <text id="script_name"
                        textSize="16sp"
                        textColor="#FFFFFF"
                        text="{{this.name}}"
                        margin="10 3 0 0"
                        maxLines="1"
                        ellipsize="end"/>
                        
                        <linear h="*" margin="0 -1 0 1">
                            
                            <text id="platform"
                            textSize="10sp"
                            textColor="{{textColor}}"
                            text="平台：{{this.platform}}"
                            marginLeft="10"
                            maxLines="1"
                            ellipsize="end"/>
                            
                            {/* 版本号 */}
                            <text id="version"
                            textSize="10sp"
                            textColor="{{textColor}}"
                            text="安卓版本：{{this.release}}"
                            marginLeft="10"
                            maxLines="1"
                            ellipsize="end"/>
                        </linear>
                        
                        
                    </vertical>
                    
                    <vertical w="*" h="*" id="link" gravity="right">
                        {/* 下载按钮图标 */}
                        <text text="打开官网"
                        textColor="#00BFFF"
                        w="auto"
                        h="*"
                        margin="0 5 35 5"
                        gravity="center"/>
                    </vertical>
                    
                </linear>
                
                <text id="description"
                textSize="13sp"
                textColor="#dcdcdc"
                text="{{this.describe ? this.describe : '什么也没有' }}"
                margin="15 2"
                
                ellipsize="end"/>
                {/* 分割线填充 */}
                <vertical id="fill_line" w="*" h="1" bg="{{color}}">
                </vertical>
            </vertical>
        </list>
    </frame>
        <text textColor="red" textSize="15sp"  margin="15 5"
        text="明日计划因需要使用无障碍权限，无法在低于安卓7的设备环境使用。本界面仅展示已测试可用的模拟器/虚拟机，其他模拟器/虚拟机请自行测试是否可用" />
    
        </vertical>
    
);

var items = [{
        "name": "雷电4,5,9模拟器",
        "release": "7，9",
        "platform": "Windows",
        "describe": "默认平板版分辨率，需打开明日计划-设置-兼容模拟器平板版，使用与设备分辨率相反的图库即可。如将更换为手机版分辨率，请关闭兼容模拟器平板版。雷电9在OCR插件方面目前只能使用x86_32位的，其他OCR版本无法识别图片内容",
        "link": "https://www.ldmnq.com/?n=6007"
    },
    {
        "name": "夜神模拟器",
        "release": "7，9",
        "platform": "Windows",
        "describe": "默认平板版分辨率，需打开明日计划-设置-兼容模拟器平板版，使用与设备分辨率相反的图库即可。如将更换为手机版分辨率，请关闭兼容模拟器平板版",
        "link": "https://www.yeshen.com/"
    },
    {
        "name": "MuMu模拟器",
        "release": "9,12",
        "platform": "Windows",
        "describe": "MuMu模拟器初始默认平板版分辨率，需打开明日计划-设置-兼容模拟器平板版，使用与设备分辨率相反的图库即可。或在MUMU设置中心-显示-切换到手机版",
        "link": "https://mumu.163.com/"
    },
    {
        "name": "光速虚拟机",
        "release": "7，10",
        "platform": "Android/HarmonyOS",
        "describe": "方舟不闪退，51虚拟机，vmos虚拟机等均已被鹰角制裁",
        "link": "https://www.gsxnj.cn/mobile/index/"
    },
]


ui.list.setDataSource(items);

ui.list.on("item_bind", function(itemView, itemHolder) {
    itemView.link.on("click", function() {
        let item = itemHolder.item;
        app.openUrl(item.link)
        
    })
})

    let dialog = dialogs.build({
        title: "警告⚠",
        titleColor: "#F44336",
        type: "app",
        content: "你的设备环境无法使用明日计划，当前安卓版本：" + device.release + "，非兼容版本，明日计划因需要使用无障碍权限进行点击命令，无法在低于安卓7的设备环境使用，请更换为安卓7及以上的版本",
        contentColor: "#F44336",
        positive: "我已知晓",
        positiveColor: "#000000",
        canceledOnTouchOutside: false
    }).show();
      
