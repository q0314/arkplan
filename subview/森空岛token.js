/**
 * 1.3版本,支持验参
 * 支持数美dId请求头
 */
importClass(java.util.zip.GZIPInputStream);
importClass(java.io.InputStreamReader);
importClass(java.io.BufferedReader);

importClass(java.net.URL);
importClass(java.lang.System);
importClass(android.provider.Settings.Global);
importClass(android.widget.LinearLayout.LayoutParams);
importClass(java.nio.charset.StandardCharsets);
importClass(java.security.MessageDigest);
importClass(javax.crypto.Mac);
importClass(javax.crypto.spec.SecretKeySpec);
importClass(android.content.DialogInterface);
importClass(android.graphics.drawable.GradientDrawable);
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);
importClass(android.view.View.MeasureSpec);
/*(function() {
    let request = http.request;
    // 覆盖http关键函数request，其他http返回最终会调用这个函数
    http.request = function() {
        try {
            // 捕捉所有异常
            return request.apply(http, arguments);
        } catch (e) {
            // 出现异常返回null
            console.error(e);

            return null;
        }
    }
})();
*/
var securitySm = require("../lib/SecuritySm.js");
// 设置字符编码
const UTF8 = StandardCharsets.UTF_8;
let token_storage = storages.create("configure");
//清空token数据
//token_storage.clear();
let roles_list = token_storage.get('arknights_binding', []);
let app_code = '4ca99fa6b56cc2ba';
/**全局token */
let token_global = "",
    ui_add,
    ui_add_height = 0;
/**签名加密key */
let sign_key = "";

let header = {
    'cred': '',
    'User-Agent': 'Skland/1.0.1 (com.hypergryph.skland; build:100100014; Android 31; ) Okhttp/4.11.0',
    'Accept-Encoding': 'gzip',
    'Connection': 'close'
};
let header_login = {
    'User-Agent': 'Skland/1.0.1 (com.hypergryph.skland; build:100001014; Android 31; ) Okhttp/4.11.0',
    'Accept-Encoding': 'gzip',
    'Connection': 'close',
    'dId': securitySm()
}

let HEADER_FOR_SIGN = {
    'platform': '3',
    'timestamp': '',
    'dId': '',
    'vName': '1.0.0'
};

//真实的脚本文件路径

let source; //.replace(files.getName(engines.myEngine().getSource().toString()), "");
try {
    //使用模块id获取真实的文件路径,
    source = module.id;
} catch (e) {
    source = engines.myEngine().getSource().toString();
}
// 签到url
let sign_url = "https://zonai.skland.com/api/v1/game/attendance";
// 绑定的角色url
let binding_url = "https://zonai.skland.com/api/v1/game/player/binding";
//角色信息url
let game_info_url = "https://zonai.skland.com/api/v1/game/player/info";
// 验证码url
let login_code_url = "https://as.hypergryph.com/general/v1/send_phone_code";
// 验证码登录
let token_phone_code_url = "https://as.hypergryph.com/user/auth/v2/token_by_phone_code";
// 密码登录
let token_password_url = "https://as.hypergryph.com/user/auth/v1/token_by_phone_password";
// 使用token获得认证代码
let grant_code_url = "https://as.hypergryph.com/user/oauth2/v2/grant";
// 使用认证代码获得cred
let cred_code_url = "https://zonai.skland.com/web/v1/user/auth/generate_cred_by_code";
//登出
let logout_url = "https://as.hypergryph.com/user/info/v1/logout";

var checkResults = {
    "code":false,
    "msg":false,
};
/**
 * 使用token获得认证代码,再使用认证代码获取cred和签名sign_key即token返回
 * @param {string} token 
 * @returns {cred: string, userld: string, token:string}
 */
function get_cred_by_token(token) {
    console.log("认证");
    let tips = "认证代码请求失败";
    let _getCt = http.postJson(grant_code_url, {
        appCode: app_code,
        token: token,
        type: 0
    }, {
        headers: header_login
    })
    if (!_getCt || _getCt['statusCode'] !== 200) {

        checkResults = {
            "code": tips,
            "msg": _getCt ? _getCt['statusMessage'] : undefined
        }
        return null;
    } else {
        _getCt = _getCt.body.json();
        if (_getCt['msg'] != 'OK') {
            checkResults = {
                "code": tips,
                "msg": _getCt['msg']
            }
            return null;
        }

        let grant_code = _getCt.data.code;
        let _getCc = http.postJson(cred_code_url, {
            kind: 1,
            code: grant_code
        }, {
            headers: header_login
        })
        if (!_getCc || _getCc.statusCode !== 200) {

            checkResults = {
                "code": 'cred,token-key请求失败',
                "msg": _getCc.statusMessage ? _getCc.statusMessage : _getCc.body.json().msg
            }
        } else {
            _getCc = _getCc.body.json()
            let cred = _getCc.data.cred;
            // let user_id = res.data.user_id;
            let token = _getCc.data.token;
            return {
                cred: cred,
                //  user_id: user_id,
                token: token
            }

        }

    }

}

function byteArrayToHexString(bytes) {
    let val = "";
    for (let i = 0; i < bytes.length; i++) {
        let tmp = bytes[i];
        if (tmp < 0) {
            tmp = 256 + tmp;
        }
        tmp = tmp.toString(16);
        if ((tmp + "").length == 1) {
            tmp = "0" + tmp;
        }
        val += tmp;
    }
    return val;
}

/**
 * 
 * @param {*} key - 二进制数据。使用 HMAC 生成信息摘要时所使用的密钥
 * @param {string} data - 字符串。要进行哈希运算的数据。
 * @param {boolean} raw_output - 设置为 true 输出二进制数据，设置为 false 输出 16 进制字符串
 * @return
 */
function hmac256(key, data, raw_output) {
    if (!raw_output) {
        raw_output = false;
    }

    data = java.lang.String(data);

    let mac = Mac.getInstance("HmacSHA256");
    let secret_key = new SecretKeySpec(key, "HmacSHA256");
    mac.init(secret_key);
    let bytes = mac.doFinal(data.getBytes(UTF8));

    if (!raw_output) {
        return byteArrayToHexString(bytes);
    } else {
        return bytes;
    }
}


function generateSignature(key, path, bodyOrQuery) {
    let t = Math.floor(Date.now() / 1000) - 2;
    let header_ca = JSON.parse(JSON.stringify(HEADER_FOR_SIGN));
    header_ca.timestamp = t.toString();

    let header_ca_str = JSON.stringify(header_ca);

    let s = path + (bodyOrQuery ? bodyOrQuery : "") + t + header_ca_str;

    //  console.info('key:\n'+key+'\n加密内容:\n'+s)
    // 将key转换为二进制数据
    keyBytes = java.lang.String(key).getBytes(UTF8);
    hex_s = hmac256(keyBytes, s)
    let md5 = $crypto.digest(hex_s, "MD5", {
        input: "string",
        output: "hex"
    }) //.digest('hex');
    //   const hex_s = $crypto.createHmac('sha256', token).update(s).digest('hex');
    // const md5 = $crypto.createHash('md5').update(hex_s).digest('hex');
    // console.log('HmacSHA256加密:\n'+hex_s+'\nmd5签名: \n' + md5);
    return [md5, header_ca];
}

function get_sign_header(url, method, body, oldHeader) {
    let h = JSON.parse(JSON.stringify(oldHeader));
    let p = new URL(url);
    let sign = generateSignature(sign_key, p.getPath(), (method == 'get' ? p.getQuery() : JSON.stringify(body)));
    h.sign = sign[0];
    h.contentType = "application/json;charset='UTF-8'";
    HEADER_FOR_SIGN = sign[1];
    for (let i in HEADER_FOR_SIGN) {
        if (!h.hasOwnProperty(i)) {
            h[i] = HEADER_FOR_SIGN[i];
        }
    }
    //console.error("请求url:\n" + url + "\nheader:\n", h)
    return h;
}
/**
 * 获取角色信息列表
 * @param {string} cred 
 * @param {string} key - 密钥
 * @return {Array} 角色列表
 */


function getBindingList(cred, key) {
    header['cred'] = cred;
    sign_key = key;
    log("获取角色列表信息");

    let _getbl = http.get(binding_url, {
        headers: get_sign_header(binding_url, 'get', null, header)
    })

    if (!_getbl || _getbl['statusCode'] !== 200) {

        checkResults = {
            "code": '用户登录可能失效了，请删除token,重新添加',
            "msg": _getbl ? _getbl['statusMessage'] : undefined
        }
        return null;
    } else {
        _getbl = _getbl.body.json();

        if (_getbl['code'] !== 0) {
            checkResults = {
                "code": '用户登录可能失效了，请删除token,重新添加',
                "msg": _getbl['message']
            }
            return null;
        }

        let v = [];
        for (let item of _getbl['data']['list']) {
            if (item.appCode && item['appCode'] !== 'arknights') continue;
            if (item.bindingList) {
                for (let binding of item.bindingList) {
                    binding.defaultUid = item.defaultUid;
                    v.push(binding);
                }
            }
        }
        return v;
    }
}

/**
 * 登出token,使其失效
 * @param {string} token 
 * @returns {Promise<*>}
 */
function logOutByToken(token) {
    toastLog("登出token中...");
    return new Promise((resolve, reject) => {
        let resp = http.postJson(logout_url, {
            "token": token
        }, {
            headers: header_login,
        }, (res, err) => {
            let statusCode = res['statusCode'] != 200;
            res = res.body.json();
            if (err || statusCode || res['msg'] != 'OK') {
                reject(err || '登出token失败：' + res['msg']);
            } else {
                boolean = true;
                resolve('登出token成功：' + res['msg']);

            }

        });
    });
}

function list_awards(game_id, uid) {
    let resp = http.get(sign_url, {
        headers: header,
        params: {
            'gameId': game_id,
            'uid': uid
        }
    }).body.json();
    console.log(resp);
}

/**
 * 使用cred,token-key获得角色列表进行签到
 * @param {*} cred_resp 
 * @returns 
 */
function do_sign(cred_resp) {
    log("使用cred,token-key获得角色列表进行签到");
    return new Promise((resolve, reject) => {
        let bindingList = getBindingList(cred_resp['cred'], cred_resp['token'])
        //console.trace(value);
        if (bindingList.msg && bindingList.code) {
            throw new Error(bindingList.code + ": " + bindingList.msg);
        }

        if (bindingList) {
            let promises = bindingList.map((character, index) => {
                const _body = {
                    'gameId': 1,
                    'uid': character['uid'],
                };

                console.log(character['nickName'] + " 签到中" + $ui.isUiThread());
                return new Promise((resolve, reject) => {
                    threads.start(() => {
                        let resp = http.request(sign_url, {
                            method: "POST",
                            body: JSON.stringify(_body),
                            headers: get_sign_header(sign_url, 'post', _body, header),
                            contentType: "application/json;charset=UTF-8",
                        })
                        //console.info(resp.body)
                        resp = resp.body.json();

                        console.log(character['nickName'] + " 签到请求结果: " + JSON.stringify(resp));
                        let status = handleSignResponse(character, resp, bindingList, index)
                        resolve(status);
                    }).join();
                });
            });

            resolve(Promise.all(promises))
        }
    });
}

function handleSignResponse(character, resp, value, index) {
    let tips;
    if (resp['code'] !== 0) {
        tips = `角色${character['nickName']}(${character['channelName']})签到失败了！原因：${resp['message']}`;
        console.warn(tips);
        snackbar(tips);
    } else {
        const awards = resp['data']['awards'];
        tips = `角色${character['nickName']}(${character['channelName']})签到成功，获得了:`;
        awards.forEach(award => {
            const res = award['resource'];
            tips += ` ${res['name']}×${award['count'] || 1}`;
        });
        console.warn(tips);
        snackbar(tips);
    }

    let status = resp['code'] === 10001 ? "重复签到" : (resp['code'] === 0 ? "签到成功" : "签到失败");
    value[index].sign_status = status;
    value[index].code = resp['code'];
    value[index].time = new Date();
    updateRolesList(character, token_global, value);
    return {
        message: status,
        index: index
    }
}

function updateRolesList(character, token, value) {
    let index = roles_list.findIndex(curr => curr.token == token);
    if (index != -1) {
        roles_list[index].bindingList = value;
    }
}

function save(token) {
    let message = "您的鹰角网络通行证TOKEN已经保存";

    toastLog("获取角色信息中...");
    get_cred_by_token(token)
        .then(value => {
            if (value.msg && value.code) {
                throw new Error(value.msg);
            }
            return getBindingList(value['cred'], value['token']);
        })
        .then(result => {
            console.trace(result);
            if (!result) {
                return false
            }
            let altered = processBindingList(result, token);
            if (!altered) {
                let firstItem = result.find(item => item.defaultUid === item['uid']);
                roles_list.push({
                    token: token,
                    bindingList: result,
                    defaultUid: result[0].defaultUid,
                    nickName: firstItem.nickName,
                    channelName: firstItem.channelName
                });
                console.log(firstItem);
                console.error(roles_list);
            }

            token_storage.put("arknights_binding", roles_list);
            snackbar(message);
            ui.post(() => {
                if (ui_add) ui_add.viewpager.setCurrentItem(1);
            }, 200);
        })
        .catch((error) => {
            if (error && error.code) {
                message = `${error.code}: ${error.msg}`;
            } else {
                message = error.message;
            }
            console.trace(error);
            console.error(message);
            snackbar(message);
            return Promise.reject();
        });
}

function processBindingList(result, token) {
    let altered = false;
    let message = "";

    result.forEach(item => {
        item.sign_status = "未签到";
        item.code = 1;
        item.time = new Date();

        let index = roles_list.findIndex(role => role.defaultUid === item['uid']);
        if (index !== -1) {
            roles_list[index].token = token;
            roles_list[index].nickName = item.nickName;
            roles_list[index].channelName = item.channelName;
            roles_list[index].defaultUid = item.defaultUid;
            altered = true;
            message = "您的鹰角网络通行证TOKEN已经修改";
        }
        if (!item.defaultUid) {
            item.defaultUid = item['uid'];
        }
    });

    return altered;
}


function input_mode(callback) {


    (function() {

        util.extend(WrapContentHeightViewPager, ui.Widget);

        function WrapContentHeightViewPager() {
            ui.Widget.call(this);
            this.heightMeasured = 0;
            this.render = function() {
                return JavaAdapter(
                    com.stardust.autojs.core.ui.widget.JsViewPager, {

                        WrapContentHeightViewPager(context, attrs) {
                            this.super$(context, attrs);
                        },
                        onMeasure(widthMeasureSpec, heightMeasureSpec) {
                            child = this.getChildAt(this.getCurrentItem()).getChildAt(0);
                            //测量子view尺寸
                            child.measure(widthMeasureSpec, View$MeasureSpec.makeMeasureSpec(0, View$MeasureSpec.UNSPECIFIED));
                            //获取子view最大高度
                            this.heightMeasured = child.getMeasuredHeight();
                            if (this.heightMeasured) {
                                ui_add_height = this.heightMeasured
                                //重设viewpager高度
                                heightMeasureSpec = View$MeasureSpec.makeMeasureSpec(this.heightMeasured, View$MeasureSpec.EXACTLY);
                            } else {
                                //获取上一次的高度
                                heightMeasureSpec = View$MeasureSpec.makeMeasureSpec(ui_add_height, View$MeasureSpec.EXACTLY);
                            }

                            this.super$onMeasure(widthMeasureSpec, heightMeasureSpec);
                        },

                        resetHeight(current) {

                            if (this.heightMeasured) {
                                layoutParams = this.getLayoutParams();
                                if (layoutParams == null) {
                                    layoutParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, this.heightMeasured);
                                } else {
                                    layoutParams.height = this.heightMeasured;
                                }

                                this.setLayoutParams(layoutParams);
                            }
                        },


                    },
                    context
                );
            };
        }
        ui.registerWidget("WrapContentHeight-ViewPager", WrapContentHeightViewPager);
        return WrapContentHeightViewPager;
    })();


    let tabs_data = {
        bg: "#F5F5F5",
        textColor: "#FFA500",
        srcColor: "#FFA500",
        srcSize: 25,
        textSize: 10,
        data: [{
                name: "删除",
                icon: "ic_cancel_black_48dp",
                function: function(view, token) {

                    roles_list.find((currentValue, index, arr) => {
                        if (currentValue.token == token) {
                            try {
                                roles_list.splice(index, 1);
                                //通知数据更新
                                ui_add.roles_list.removeView(ui_add.roles_list.getChildAt(index));
                                token_storage.put("arknights_binding", roles_list);
                            } catch (e) {
                                toastLog("删除失败,原因:" + e)
                            }
                            return;
                        }
                        return;

                    })
                },
            },
            {
                name: "签到",
                icon: "ic_play_circle_filled_black_48dp",
                function: function(view, token) {

                    sign([token], function() {
                        ui.run(() => {
                            for (let i = 0; i < ui_add.roles_list.getChildCount(); i++) {
                                ui_add.roles_list.removeView(ui_add.roles_list.getChildAt(i));
                            };
                            for (let _roles of roles_list) {
                                addroles_view(_roles);
                            };
                        });
                    });


                },
            },
            {
                name: "复制",
                icon: "ic_healing_black_48dp",
                function: function(view, token) {

                    token = {
                        "code": 0,
                        "data": {
                            "content": token
                        },
                        "msg": "接口会返回您的鹰角网络通行证账号的登录凭证，此凭证可以用于鹰角网络账号系统校验您登录的有效性。泄露登录凭证属于极度危险操作，为了您的账号安全，请勿将此凭证以任何形式告知他人！"
                    }

                    setClip(JSON.stringify(token));
                    console.info(JSON.stringify(token));
                    snackbar("已复制token,请谨慎保存,切勿泄露")
                },
            }, {
                name: "登出",
                icon: "ic_shuffle_black_48dp",
                function: function(view, token) {
                    logOutByToken(token)
                        .then((value) => {
                            snackbar(value);
                            roles_list.find((currentValue, index, arr) => {
                                if (currentValue.token == token) {
                                    try {
                                        roles_list.splice(index, 1);
                                        //删除视图
                                        ui.run(() => {
                                            ui_add.roles_list.removeView(ui_add.roles_list.getChildAt(index));
                                        });
                                        token_storage.put("arknights_binding", roles_list);
                                    } catch (e) {
                                        toastLog("更新视图失败,原因:" + e)
                                    }
                                    return;
                                }
                                return;

                            })
                        }, (error) => {
                            snackbar(error);
                        })

                },
            }
        ],
    }

    let Tabs_btn_layout = function() {
        util.extend(Tabs_btn_layout, ui.Widget);

        function Tabs_btn_layout() {
            ui.Widget.call(this);
            /*  this.defineAttr("token", (view, attr, value, defineAttr) => {
  
                  //对应点击事件
                  view.on("click", (view_) => {
                      eval(tabs_data.data[view_._text.getHint()].function(view_, value))
                  })
              });*/
            this.defineAttr("data", (view, attr, value, defineSetter) => {


                arr = tabs_data.data[value]
                view.attr("bg", tabs_data.bg);

                view._text.setHint(value);
                view._text.setText(arr.name);
                try {
                    view._text.attr("textColor", tabs_data.textColor);
                } catch (e) {
                    console.error(e)
                }
                view._src.attr("src", arr.icon)
                view._src.attr("tint", tabs_data.srcColor)
                view._src.attr("h", tabs_data.srcSize)

            });


        }
        Tabs_btn_layout.prototype.render = function() {
            return (
                //xml直接使用{{变量}}不生效, 而且list中传输item会导致初始设置ui的速度变慢,报错tabs_data读不到. 还是在后续动态设置吧
                <vertical id="_bg" w="match_parent" padding="0 3" gravity="center"   > {/* bg="{{tabs_data.bg}}" */}
                            <img id="_src" /> {/** h="{{tabs_data.srcSize}}" tint="{{tabs_data.srcColor}}" */}
                            <text w="auto" id="_text" /> {/** textSize="{{tabs_data.textSize}}" textColor="{{tabs_data.srcColor}}" */}
                        </vertical>
            )
        }
        ui.registerWidget("tabs_btn_layout", Tabs_btn_layout);
        return Tabs_btn_layout;
    }()

    let Tabs_layout = function() {
        util.extend(Tabs_layout, ui.Widget);

        function Tabs_layout() {
            ui.Widget.call(this);
            //再设置按钮点击事件
            this.defineAttr("token", (view, attr, value, defineSetter) => {
                //防止view.setDataSource时重复设置点击事件

                if (this.setclick && this.value == value) {
                    return
                } else {
                    this.setclick = true;
                    this.value = value;
                }
                for (let i = 0; i < tabs_data.data.length; i++) {
                    // view._tabs.getChildAt(i).attr("token", value);

                    view._tabs.getChildAt(i).on("click", (view_) => {

                        eval(tabs_data.data[view_._text.getHint()].function(view_, value));

                    })
                }
            })
            //先设置data,布局全面
            this.defineAttr("data", (view, attr, value, defineSetter) => {

                for (let i = 0; i < tabs_data.data.length; i++) {

                    //直接在xml中设置data,可能不生效
                    ui.inflate(
                        <tabs_btn_layout layout_weight="1" />, view._tabs, true)
                    //后续动态设置
                    view._tabs.getChildAt(i).attr("data", i);

                    //对应点击事件
                    // view._tabs.getChildAt(i).on("click" , (view_)=> {
                    //  console.trace(this.token)
                    //  log(tabs_data.data[view_.getChildAt(1).getHint()])
                    //   eval(tabs_data.data[view_.getChildAt(1).getHint()].function(view_,view.token))
                    //   })
                }

            });

        }
        Tabs_layout.prototype.render = function() {
            return (
                <card w="*" h="auto" cardElevation="10" >
                            <horizontal id="_tabs" />
                            
                            <horizontal weightSum="4" h="20" layout_gravity="center_vertical">
                                <frame layout_weight="1" >
                                    <View bg="#e8e8e8" w="1" layout_gravity="right" />
                                </frame>
                                <frame layout_weight="1" >
                                    <View bg="#e8e8e8" w="1" layout_gravity="right" />
                                </frame>
                                <frame layout_weight="1" >
                                    <View bg="#e8e8e8" w="1" layout_gravity="right" />
                                </frame>
                                
                            </horizontal>
                        </card>
            )
        }
        ui.registerWidget("tabs-layout", Tabs_layout);
        return Tabs_layout;
    }()
    ui_add = ui.inflate(
        <vertical id="parent" bg="#ffffff" >
            
            <vertical w="*" h="auto">
                <card gravity="center_vertical" cardElevation="0dp" margin="0" cardBackgroundColor="#ffffff">
                    <img src="file://res/icon.png" w="50" h="30" margin="0" layout_gravity="center|left" />
                    <text text="森空岛自动签到" gravity="center|left" textColor="#000000" marginLeft="50" />
                    
                    <linear gravity="center||right" marginLeft="5" >
                        
                        <img id="Exit" marginRight="8" src="@drawable/ic_clear_black_48dp" w="40" h="35" tint="#000000" foreground="?attr/selectableItemBackground" clickable="true" />
                        
                    </linear>
                    
                </card>
            </vertical>
            <vertical layout_height="wrap_content">
                <tabs id="tabs" TextColor="#ffffff" margin="10 0" />
                
                <WrapContentHeight-ViewPager id="viewpager" padding="15 0" w="auto"  >
                    {/** 第一屏布局*/}
                    
                    <frame id="token_add"  >
                        <vertical >
                            <spinner id="login_mode" textSize="16" entries="使用用户名密码|使用手机验证码|使用已知TOKEN" />
                            
                            
                            <text margin="10 0" id="login_mode_tips" text="" textColor="#FF0000" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />
                            <com.google.android.material.textfield.TextInputLayout
                            id="phone" margin="5 0"
                            layout_height="wrap_content">
                            <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
                            singleLine="true" inputType="phone" />
                        </com.google.android.material.textfield.TextInputLayout>
                        
                        
                        <horizontal marginTop="15">
                            
                            <com.google.android.material.textfield.TextInputLayout
                            id="password" margin="5 0"
                            
                            layout_weight="1"
                            layout_height="wrap_content">
                            <EditText layout_width="match_parent" layout_height="wrap_content" textSize="16sp"
                            />
                        </com.google.android.material.textfield.TextInputLayout>
                        <button id="code" text="发送验证码" style="Widget.AppCompat.Button.Borderless" w="auto" />
                    </horizontal>
                    {/* 等待加载的动画效果 */}
                    <linear w="auto" id="waitFor_obtain" visibility="gone" h="60" gravity="center">
                        <progressbar id="progressbar" indeterminateTint="#ff0000" h="25"
                        layout_gravity="center_vertical" margin="-15 0" visibility="gone" />
                        <text id="obtain" textColor="#000000" text="从明日计划webview获取" padding="10" w="auto" h="*" textStyle="bold" foreground="?attr/selectableItemBackground" clickable="true" />
                    </linear>
                    
                    
                </vertical>
            </frame>
            {/*第二屏组件*/}
            <frame >
                <vertical id="roles_list" bg="#FFFFFF" orientation="vertical" w="match_parent">
                    
                    
                    
                </vertical>
            </frame>
            
            <frame >
                {/*第三屏组件*/}
                <vertical id="timk_add" marginLeft="10" marginRight="10" >
                    <text id="login_timk_tips" text="" textColor="#FF0000" enabled="true" textIsSelectable="true" focusable="true" longClickable="true" />
                    <radiogroup id="ll" orientation="horizontal" h="auto">
                        <radio id="l1" text="按每天运行(定时)" checked="true" w="*" />
                        <radio id="l2" text="按星期运行" w="*" h="auto" visibility="gone" />
                    </radiogroup>
                    <timepicker id="timePickerMode" margin="0 -20" timePickerMode="spinner" layout_gravity="center" />
                    <checkbox id="autotimk" text="启动明日计划时运行本脚本执行签到(广播)" w="auto" checked="false" />
                    <list id="timed_tasks_list" bg="#00000000" >
                        <card w="*" h="40" margin="5 0 5 0" cardCornerRadius="2dp"
                        cardElevation="0dp" foreground="?selectableItemBackground">
                        <horizontal gravity="center_horizontal" >
                            <vertical padding="5 0" h="auto" w="0" layout_weight="1">
                                <text text="{{this.scriptPath}}" textSize="16" maxLines="1" />
                                <text text="下次运行: {{this.date + ' ' + this.time}}" textSize="12" maxLines="1" />
                            </vertical>
                            <img id="done" src="@drawable/ic_close_black_48dp" layout_gravity="right|center" w="30" h="*" margin="0 0 5 0" />
                        </horizontal>
                        <View bg="#dcdcdc" h="1" w="auto" layout_gravity="bottom" />
                    </card>
                </list>
            </vertical>
        </frame>
        </WrapContentHeight-ViewPager>
        
        <horizontal gravity="right" w="*" margin="5" >
            <button id="no" text="取消" style="Widget.AppCompat.Button.Borderless" w="auto" textColor="#cc423232" />
            <progressbar id="progressbar_sian" indeterminateTint="#ff0000"
            h="25" layout_gravity="center_vertical" margin="-15 0 -25 0" visibility="invisible" />
            <button id="ok" text="保存token" style="Widget.AppCompat.Button.Borderless" w="auto" textColor="#424242" />
        </horizontal>
        </vertical>
        </vertical>, null, false)
    let d_add = dialogs.build({
        type: 'foreground-or-overlay',
        customView: ui_add,
        cancelable: false,
        canceledOnTouchOutside: false,
        wrapInScrollView: false
    }).on("show", (dialog) => {

        //  ui_add.password.setPasswordVisibilityToggleEnabled(true);
    })
    /*let params = d_add.getWindow().getAttributes();
 
    params.flags |= Intent.FLAG_ACTIVITY_NEW_TASK;
    */

    d_add.show();


    //设置滑动页面的标题
    ui_add.viewpager.setTitles(["添加TOKEN", "TOKEN管理", "定时任务"]);
    //让滑动页面和标签栏联动
    ui_add.tabs.setupWithViewPager(ui_add.viewpager);
    //ui_add.tabs.selectedTabIndicatorColor = colors.parseColor("#000000"); //设置tabs指示器颜色
    ui_add.tabs.setTabTextColors(colors.parseColor("#5003a9f4"), colors.parseColor("#03a9f4")); //设置未选中，选中的字体颜色。
    // log(roles_list)
    roles_list.forEach((currentValue, index, arr) => {
        for (let j = 0; j < currentValue.bindingList.length; j++) {
            if (currentValue.bindingList[j].code || new Date(currentValue.bindingList[j].time).getDate() != new Date().getDate()) {
                roles_list[index].bindingList[j].sign_status = '今日未签到';
                roles_list[index].bindingList[j].code = 1;
            }
        }
    });

    //   ui_add.roles_list.setDataSource(roles_list)
    ui_add.viewpager.setOnPageChangeListener({

        onPageScrolled: function(position) {
            //  ui_add.viewpager.onMeasure()
        },
        onPageSelected: function(index, v) {
            ui_add.viewpager.resetHeight(index);
            switch (index) {
                case 0:
                    ui_add.ok.setText("保存token")
                    break
                case 1:


                    for (let i = 0; i < ui_add.roles_list.getChildCount(); i++) {
                        ui_add.roles_list.removeView(ui_add.roles_list.getChildAt(i));
                    };
                    for (let _roles of roles_list) {
                        addroles_view(_roles);
                    };
                    ui_add.ok.setText("全部签到");
                    break;
                case 2:
                    //   ui_add.
                    ui_add.ok.setText("创建定时");
                    break;
            }
        },
    });
    if (roles_list.length > 0) {
        ui_add.viewpager.currentItem = 1;
    }
    ui_add.obtain.on("click", function(view) {
        snackbar("暂不支持");
        return
        if (callback) {
            threads.start(function() {
                login_uislector = callback('webview_token', 'get');

                ui.run(() => {
                    d_add.show();
                    ui.post(() => {
                        ui_add.waitFor_obtain.setVisibility(8);
                        ui_add.password.getEditText().setText(login_uislector.usr_token.value);
                        snackbar("获取TOKEN成功");
                    }, 200)
                })
            }) //.join();
            ui_add.progressbar.setVisibility(0);
            d_add.dismiss();
            return
        }
        //启动明日计划主页 
        let engine = engines.all();

        for (let i = 0; i < engine.length; i++) {
            //寻找main脚本停止
            if (engine[i].toString().indexOf("main") >= 0) {
                engine[i].forceStop();

            }
        }
        engines.execScriptFile("/sdcard/脚本/明日计划64位/main.js");



        //  if (!main) {
        ; //测试环境
        // engines.execScriptFile(context.getFilesDir() + "/project/main.js");
        //   };

        try {

            currentActivity();

            threads.start(function() {
                sleep(1000);
                //设置web url 电脑模式;
                let web_set = storages.create("configure").get("web_set")


                storages.create("configure").put("web_set", web_set)

                let webkit;

                if (webkit = className("android.webkit.WebView").text("森空岛-鹰角网络官方社区").findOne()) {
                    sleep(200)

                    ui.run(() => {
                        d_add.dismiss();
                    })
                    //   break
                }
                sleep(500);

                toastLog("请在此界面进行登录")

                let login_uislector = text("登录").className("android.widget.TextView").findOne(3000);

                if (login_uislector != null) {
                    login_uislector.click();
                }
                while (true) {


                    login_uislector = (text("发布").className("android.widget.TextView").findOne(500) ||
                        desc("发布").className("android.view.tView").findOne(500));
                    console.trace(login_uislector)
                    if (login_uislector != null) {
                        web_set.new_url = "https://web-api.skland.com/account/info/hg";
                        storages.create("configure").put("web_set", web_set)
                        break
                    }
                    sleep(500)
                }
                //获取token

                login_uislector = textStartsWith('{"code":0,').className("android.widget.TextView").findOne(10000);
                log(login_uislector)
                login_uislector = JSON.parse(login_uislector.text());
                d_add.show()
                ui.run(() => {
                    ui_add.waitFor_obtain.setVisibility(8)

                    ui_add.password.getEditText().setText(login_uislector.data.content.toString());
                    snackbar("获取TOKEN成功")
                })
                //callback(token);
            })
        } catch (er) {
            toastLog("无法获取,请打开无障碍后重试");
        }


    })

    ui_add.login_mode.setOnItemSelectedListener({
        onItemSelected: function(parent, view, position, id) {
            // parent.getSelectedItem();
            switch (position) {
                case 0:
                    ui_add.phone.setHint("手机号");
                    ui_add.phone.setVisibility(0);
                    ui_add.password.setHint("密码");
                    ui_add.password.setVisibility(0);
                    //   ui_add.password.setPasswordVisibilityToggleEnabled(true);
                    ui_add.code.setVisibility(8);
                    ui_add.waitFor_obtain.setVisibility(8);
                    ui_add.login_mode_tips.setText("非常推荐，但可能因为人机验证失败）")
                    break;
                case 1:
                    ui_add.phone.setHint("手机号");
                    ui_add.phone.setVisibility(0);
                    ui_add.password.setHint("验证码");
                    ui_add.password.setVisibility(0);
                    //ui_add.password.setPasswordVisibilityToggleEnabled(false);

                    ui_add.code.setVisibility(0);
                    ui_add.waitFor_obtain.setVisibility(8);
                    ui_add.login_mode_tips.setText("非常推荐，但可能因为人机验证失败）")
                    break;
                case 2:
                    //ui_add.password.setPasswordVisibilityToggleEnabled(false);

                    ui_add.password.setHint("TOKEN");
                    ui_add.phone.setVisibility(8);
                    ui_add.code.setVisibility(8);
                    ui_add.waitFor_obtain.setVisibility(0);
                    ui_add.login_mode_tips.setText("登录森空岛电脑官网后(手机浏览器可切换为电脑模式),请访问token网址，并复制其中内容\n" +
                        "森空岛：https://www.skland.com/\n" +
                        "token： https://web-api.skland.com/account/info/hg")
                    break
            }

        }
    });
    let time, timk;

    ui_add.login_timk_tips.setText("定时需保持明日计划持续在后台运行\n由于各系统的限制，定时任务不能一定保证准时运行，可能会延迟1~5分钟" +
        "\n请尽量将明日计划加入各种白名单和允许自启动权限，后台任务上锁");
    add_timed_tasks_list();

    function add_timed_tasks_list() {
        /**
         * 因为pro8.8.13还不支持String.prototype.padStart
         * @param {*} str 
         * @param {*} length 
         * @param {*} char 
         * @returns 
         */
        function padStart(str, length, char) {
            return Array(length - str.length + 1).join(char) + str
        }
        let timk_list = [];
        if ($timers.queryIntentTasks({
                path: source
            }).length > 0) {
            ui_add.autotimk.checked = true;
        };
        let queryTimedTasks = $timers.queryTimedTasks({
            path: source
        });
        console.error(queryTimedTasks)
        for (let timk of queryTimedTasks) {
            let timk_ = {};
            hours = Math.floor(timk.millis / 3600000);

            let minutes = Math.floor((timk.millis % 3600000) / 60000);

            let currentTime = new Date();
            let targetTime = new Date();


            //console.log(time); // 输出：19:53
            targetTime.setHours(hours, minutes, 0, 0);
            if (currentTime > targetTime) {
                timk_.date = currentTime.getFullYear() + "/" + (currentTime.getMonth() + 1) + "/" + (currentTime.getDate() + 1);
            } else {
                timk_.date = currentTime.getFullYear() + "/" + (currentTime.getMonth() + 1) + "/" + currentTime.getDate();
            }
            timk_.id = timk.id;
            timk_.scriptPath = files.getName(timk.scriptPath);
            timk_.time = padStart(hours.toString(), 2, '0') + ':' + padStart(minutes.toString(), 2, '0');

            timk_list.push(timk_);
            //通知数据更新

        }


        if (app.autojs.versionCode > 8082200) {
            ui_add.timed_tasks_list.setDataSource(timk_list, false);
        } else {
            ui_add.timed_tasks_list.setDataSource(timk_list);
        }

        ui_add.timed_tasks_list.on("item_bind", function(itemView, itemHolder) {
            //绑定勾选框事件
            itemView.done.on("click", function(view) {
                let item = itemHolder.item;

                snackbar("删除定时任务，id: " + item.id + " " + $timers.removeTimedTask(item.id));
                timk_list.splice(itemHolder.position, 1);
                //通知数据更新
                ui_add.timed_tasks_list.adapter.notifyItemRemoved(itemHolder.position);

            })
        });
    }

    function addroles_view(item) {

        ui_add.roles_list.addView(ui.inflate(
            <vertical>
                </vertical>, ui_add.roles_list
        ));

        for (let AddItem of item.bindingList) {
            ui.run(() => {
                let Add_rolesView = ui.inflate(
                    <horizontal gravity="center_horizontal"  >
                                <vertical margin="10 10" h="auto" layout_weight="1">
                                    <text text="AddItem.nickName" textSize="20" textColor="#000000" maxLines="1" />
                                    <text text="AddItem.uid + ' - ' + AddItem.channelName" textSize="14" maxLines="1" />
                                </vertical>
                                
                                <img id="img" src="@drawable/ic_check_circle_black_48dp" layout_gravity="right|center" tint="#00FF00" w="30" h="*" />
                                <text textSize="14" layout_gravity="right|center" margin="5 0" />
                            </horizontal>, ui_add.roles_list.getChildAt(ui_add.roles_list.getChildCount() - 1)
                );
                Add_rolesView.getChildAt(0).getChildAt(0).setText(AddItem.nickName);
                Add_rolesView.getChildAt(0).getChildAt(1).setText(AddItem.uid + ' - ' + AddItem.channelName);
                Add_rolesView.img.attr('tint', AddItem.code ? '#FF0000' : '#00FF00');
                Add_rolesView.img.attr('src', AddItem.code ? '@drawable/ic_error_black_48dp' : '@drawable/ic_check_circle_black_48dp');
                Add_rolesView.getChildAt(2).setText(AddItem.sign_status);
                Add_rolesView.getChildAt(2).setTextColor(colors.parseColor(AddItem.code ? '#FF0000' : '#00FF00'));

                ui_add.roles_list.getChildAt(ui_add.roles_list.getChildCount() - 1).addView(Add_rolesView);
            });
        }

        ui.run(() => {
            let action_bar = ui.inflate(
                <tabs-layout data="" layout_gravity="bottom" h="wrap_content" />, ui_add.roles_list.getChildAt(ui_add.roles_list.getChildCount() - 1)
            );

            action_bar.attr("token", item.token);
            ui_add.roles_list.getChildAt(ui_add.roles_list.getChildCount() - 1).addView(action_bar);
        })
    }
    //滑动时间选择
    //  ui_add.timePickerMode.setIs24HourView(true); //设置当前时间控件为24小时制
    ui_add.timePickerMode.setOnTimeChangedListener({
        onTimeChanged: function(v, h, m) {
            //h 获取的值 为24小时格式
            time = h + ":" + m;
        }
    });
    ui_add.autotimk.on('click', function(view) {
        // 添加一个Auto.js启动时触发的广播任务（在打包中软件也可以使用）
        if (view.checked) {
            snackbar("创建广播任务: " + $timers.addIntentTask({
                path: source,
                action: "org.autojs.autojs.action.startup",
            }));
        } else {
            // 按脚本路径查找广播任务
            let tasks = $timers.queryIntentTasks({
                path: source
            });
            console.trace(tasks)
            // 删除查找到的所有广播任务
            tasks.forEach(t => {
                log("删除广播任务: " + t)
                snackbar("删除广播任务: " + t);
                log($timers.removeIntentTask(t.id));
            });

        }
    })
    ui_add.no.on("click", function() {

        d_add.dismiss();
        // exit();
    });

    ui_add.Exit.on("click", function() {
        d_add.dismiss();
        //  exit();
    })
    ui_add.code.on('click', function(view) {
        let phone = ui_add.phone.getEditText().getText().toString();
        if (phone == "") {
            ui_add.phone.setError("手机号不可为空");
            return
        } else {
            ui_add.phone.setError(null);
        }

        http.postJson(login_code_url, {
            'phone': phone,
            'type': 2
        }, {
            headers: header_login,
        }, (res, err) => {
            if (err || res['statusCode'] != 200 || res.body.json()['status'] !== 0) {
                if (res['statusCode'] != 200) {
                    err = '发送手机验证码出现错误：' + res['statusMessage'];
                } else if (res['status'] !== 0) {
                    err = '发送手机验证码错误：' + res.body.json()['msg'];
                    ui.run(() => {
                        ui_add.password.setError(res.body.json()['msg']);
                    })
                }
                console.error(err + "\n" + res);
                snackbar(err);
            } else {
                let r = res.body.json();
                console.trace(r);
                ui.run(() => {
                    ui_add.code.setEnabled(false);
                });
                snackbar("发送验证码成功:" + r['msg'])
                log("发送验证码成功:" + r['msg']);

                let i_tnter = 59;
                let id_tnter = setInterval(function() {
                    if (i_tnter > 0) {
                        i_tnter--;
                    }
                    ui.run(() => {
                        if (i_tnter == 0) {
                            ui_add.code.setEnabled(true);
                            ui_add.code.setText("发送验证码")
                            clearInterval(id_tnter);
                        } else {
                            ui_add.code.setText("发送验证码(" + i_tnter + "s)")
                        }

                    })
                }, 1000)

            }
        });

    })
    ui_add.ok.on("click", function(view) {
        switch (ui_add.viewpager.getCurrentItem()) {
            case 0:
                addtoken();
                break
            case 1:

                sign(null, function() {
                    ui.run(() => {
                        for (let i = 0; i < ui_add.roles_list.getChildCount(); i++) {
                            ui_add.roles_list.removeView(ui_add.roles_list.getChildAt(i));
                        };
                        for (let _roles of roles_list) {
                            addroles_view(_roles);
                        };
                    });
                });

                break
            case 2:
                timing();
                break
        }
    });


    function timing() {
        if (time == null) {
            snackbar("请先选择时间");
            return
        }
        timk = $timers.addDailyTask({
            path: source,
            time: time,
        });
        if (timk) {
            log("创建定时任务成功，任务:" + timk + ", 时间:" + time);
            snackbar("创建定时任务成功，id:" + timk.id + ",时间:" + time);;
            add_timed_tasks_list()
        }

        if (!$power_manager.isIgnoringBatteryOptimizations()) {
            console.log("未开启忽略电池优化");
            $power_manager.requestIgnoreBatteryOptimizations();
        }

        function ischeck(id) {
            for (let i = 0; i < id.getChildCount(); i++) {
                let rb = id.getChildAt(i);
                if (rb.isChecked()) {
                    return rb.getText()
                }
            }
        }
    }

    function addtoken() {
        let phone = ui_add.phone.getEditText().getText().toString();
        let password = ui_add.password.getEditText().getText().toString();
        switch (ui_add.login_mode.getSelectedItemPosition()) {
            case 2:
                tips_error = "TOKEN不可为空";
                break
            default:

                tips_error = "密码/验证码不可为空";

                if (phone == "") {
                    ui_add.phone.setError("手机号不可为空");
                    return
                } else {
                    ui_add.phone.setError(null);
                }

                break
        }

        if (password == "") {
            ui_add.password.setError(tips_error);

            return
        } else {
            ui_add.password.setError(null);
        }

        let _fin = (res, err) => {
            if (err || res['statusCode'] != 200 || res.body.json()['status'] !== 0) {
                if (res['statusCode'] != 200) {
                    err = '获得token失败：' + res['statusMessage'];
                } else if (res['status'] !== 0) {
                    err = '获得token失败' + res.body.json()['msg'];
                }
                console.error(err + "\n" + res);
                snackbar(err);
            } else {
                console.trace(res.body.json())
                save(res.body.json()['data']['token']);
            }
        };
        switch (ui_add.login_mode.getSelectedItemPosition()) {
            case 0:
                console.trace(phone);
                http.postJson(token_password_url, {
                    "phone": phone,
                    "password": password
                }, {
                    headers: header_login,
                }, _fin);

                break
            case 1:
                http.postJson(token_phone_code_url, {
                    "phone": phone,
                    "code": password
                }, {
                    headers: header_login,
                }, _fin);

                break
            case 2:

                if (password.indexOf("data") > -1) {
                    token = JSON.parse(password);
                    token = token.data.content;
                } else {
                    token = password;
                }

                save(token);
                break
        }

        // d_add.dismiss();
    }

}

function snackbar(text, second) {
    second = second || 1500;
    try {
        ui.run(() => {
            com.google.android.material.snackbar.Snackbar.make(ui_add.parent, text, second).show();
        })
    } catch (e) {
        //  toast(text)
    }
}



/**
 * 返回角色列表中今天未已签到的token
 * @returns {string[]}
 */
function do_init() {


    let t_ = [];
    for (let t of roles_list) {


        if (t.code || new Date(t.time).getDate() != new Date().getDate()) {
            t = t.token;
            t_.push(t)
        } else {
            //  toast(t.nickName + " 今日已签到");
            console.warn(t.nickName + " 今日已签到")

        }
    }

    if (t_.length > 0) {
        return t_;
    } else if (roles_list.length == 0) {
        //   input_mode()
        toastLog("无token可进行森空岛签到,请先添加token")
        snackbar("无token可进行森空岛签到,请先添加token")
        return [];
    } else {
        return [];
    }

}
/**
 * 遍历所有token进行签到
 * @param {string[]} tokens 
 * @param {*} callback 
 * @returns 
 */
function sign(tokens, callback) {
    let tips = "签到完成";
    let message = false;

    ui.run(() => {
        if (ui_add) {
            ui_add.progressbar_sian.setVisibility(0);
            ui_add.ok.setText("签到中..");
        }
    });

    threads.start(function() {
        /* while (token_global) {
            sleep(100);
        }
    */
        tokens = tokens || do_init();
        if (tokens.length === 0) {
            finishSignProcess(callback);
            return;
        }

        toastLog('森空岛签到: \n使用已存储token签到, 可用数量:' + tokens.length);

        function signToken(index) {
            if (index >= tokens.length) {
                finishSignProcess(callback);
                return;
            }

            token_global = tokens[index];
            let credToken = get_cred_by_token(token_global)
            //console.verbose(credToken)
            if (credToken) {

                do_sign(credToken).then((value) => {
                        //console.trace(value)
                        if (value instanceof Array) {
                            value = value[0];
                        }
                        updateUI(value.index, value.message);
                    })
                    .catch((error) => {
                        console.error(error);
                        updateUI(index, "签到失败", error.msg);
                    })
                    .finally(() => {
                        signToken(index + 1);
                    });
            }else{
                    updateUI(index, "签到失败", checkResults.msg);
                    
            }
        }

        signToken(0);
    });

}

function updateUI(index, status, errorMsg) {
    let message = errorMsg ? `角色${index + 1}：${status}，${errorMsg}` : `角色${index + 1}：${status}`;
    ui.run(() => {
        if (ui_add) {
            ui_add.progressbar_sian.setVisibility(8);
            ui_add.ok.setText(status);
            snackbar(message);
        } else {
            toastLog(status + "\n" + message);
        }
    });
}

function finishSignProcess(callback) {
    console.log("森空岛签到完成");
    token_storage.put("arknights_binding", roles_list);
    token_global = false;
    if (callback) callback();

}
/**
 * 从森空岛API获取角色数据
 * @param {string} token 
 * @returns 
 */
function game_info(token) {
    return new Promise((resolve, reject) => {
        let bindingList;
        let credToken = get_cred_by_token(token)
        if (credToken) {

            header['cred'] = credToken['cred'];
            sign_key = credToken['token'];
            bindingList = getBindingList(header['cred'], sign_key);
        }

        if (!bindingList || bindingList.msg) {
            bindingList = bindingList ? bindingList : checkResults;
            toastLog(bindingList.code);
            console.error(bindingList.msg);
            throw new Error(bindingList.msg);
        }

        let uid = roles_list.findIndex(curr => curr.token == token) !== -1 ?
            roles_list[roles_list.findIndex(curr => curr.token == token)].defaultUid :
            bindingList[0]['uid'];

        console.verbose("获取角色uid:" + uid + "数据");

        let res = http.get(game_info_url + "?uid=" + uid, {
            headers: get_sign_header(game_info_url + "?uid=" + uid, 'get', null, header)
        });

        if (res.statusCode !== 200) {
            reject({
                "code": '获得角色数据失败',
                "msg": res.statusMessage
            });
        } else {
            let content = gzipInputStream(res.body.bytes());
            if (!content) {
                reject({
                    "code": '获得角色数据失败',
                    "msg": content
                });
            }
            resolve(getGameInfo(content));
        }

    });
}

function getGameInfo(tree) {
    function isNull(str) {
        return !str && str !== 0 && typeof str !== "boolean";
    }

    function getWeightFromId(id) {
        const weights = {
            "1": 2,
            "4": 2,
            "2": 3,
            "13": 3,
            "14": 3
        };
        return weights[id] || 5;
    }

    function convertTs2Day(Sec) {
        return Sec < 0 ? -1 : (Sec + 28800) / 86400;
    }

    tree = JSON.parse(tree);
    let currentTs = tree.data.currentTs;
    let lastOnLineTs = tree.data.status.lastOnlineTs;

    let GameInfo = {
        info: {},
        //训练室
        train: {},
        ap: {},
        //公招
        recruit: {},
        hire: {},
        //剿灭
        campaign: {},
        //日常,周常
        routineDay: {},
        routineWeek: {},
        //数据增补
        tower: {},
        //贸易站
        trading: {},
        //制造站
        manufactures: {},
        //无人机
        labor: {},
        //休息进度
        dormitories: {},
        //线索
        meeting: {},
        //干员疲劳
        tired: {},
    };
    // Info
    GameInfo.info = {
        nickName: tree.data.status.name.toString().replace('\"', ''),
        level: tree.data.status.level,
        progress: tree.data.status.mainStageProgress.toString().replace('\"', '')
    };

    // AP
    //分情况
    //如果currentAp本身大于max（一般来说recoverTime  == -1）,直接取current.
    //然后正常计算自然恢复理智
    //如果currentTS > recoverTs, 取max
    //如果currentTs < recoverTS, 取计算值。

    GameInfo.ap = tree.data.status.ap;
    GameInfo.ap.currentTs = currentTs;

    // Train
    let node_train = tree.data.building.training;
    let node_char = tree.data.charInfoMap;
    GameInfo.train.isNull = isNull(node_train);
    if (!GameInfo.train.isNull) {
        let trainee = node_train.trainee;
        GameInfo.train.traineeIsNull = isNull(trainee);
        if (!GameInfo.train.traineeIsNull) {
            let traineeCode = trainee.charId;
            GameInfo.train.trainee = node_char[traineeCode].name;
            GameInfo.train.status = trainee.targetSkill;
        }
        GameInfo.train.time = node_train.remainSecs;
    }

    // Recruit
    GameInfo.recruit.isNull = isNull(tree.data.recruit);
    if (!GameInfo.recruit.isNull) {
        let unable = 0,
            complete = 0,
            finishTs = -1;
        tree.data.recruit.forEach(node => {
            switch (node.state) {
                case 0:
                    unable++;
                    break;
                case 3:
                    complete++;
                    break;
                case 2:
                    if (node.finishTs < currentTs) complete++;
                    finishTs = Math.max(node.finishTs, finishTs);
                    break;
            }
        });
        GameInfo.recruit.time = (finishTs === -1 || finishTs < currentTs) ? -1 : (finishTs - currentTs);
        GameInfo.recruit.max = 4 - unable;
        GameInfo.recruit.value = complete;
    }

    // Hire
    let node_hire = tree.data.building.hire;
    GameInfo.hire.isNull = isNull(node_hire);
    if (!GameInfo.hire.isNull) {
        GameInfo.hire.value = Math.min(node_hire.refreshCount + 1, 3);
        GameInfo.hire.time = node_hire.completeWorkTime - currentTs;
    }

    // Campaign
    let node_campaign = tree.data.campaign.reward;
    GameInfo.campaign.isNull = isNull(node_campaign);
    if (!GameInfo.campaign.isNull) {
        GameInfo.campaign.current = node_campaign.current;
        GameInfo.campaign.total = node_campaign.total;
    }

    // Tower
    let node_tower = tree.data.tower;
    GameInfo.tower.isNull = isNull(node_tower);
    if (!GameInfo.tower.isNull) {
        let node_high = node_tower.reward.higherItem;
        let node_low = node_tower.reward.lowerItem;
        GameInfo.tower.highCurrent = node_high.current;
        GameInfo.tower.highTotal = node_high.total;
        GameInfo.tower.lowCurrent = node_low.current;
        GameInfo.tower.lowTotal = node_low.total;


    }

    // Trading
    let node_trading = tree.data.building.tradings;
    GameInfo.trading.isNull = isNull(node_trading);
    if (!GameInfo.trading.isNull) {
        let [stock, stockLimit] = node_trading.reduce(([s, sl], node) => {
            let node_stock = node.stock.length;
            if (currentTs > node.completeWorkTime && node_stock < node.stockLimit) {
                node_stock++;
            }
            return [s + node_stock, sl + node.stockLimit];
        }, [0, 0]);
        if (stock >= stockLimit) {
            GameInfo.trading.status = "已饱和"
        } else {
            GameInfo.trading.status = "获取中"
        }
        GameInfo.trading.value = stock;
        GameInfo.trading.maxValue = stockLimit;
    }

    // Manufactures
    let node_product = tree.data.building.manufactures;
    GameInfo.manufactures.isNull = isNull(node_product);
    if (!GameInfo.manufactures.isNull) {
        let [value, max] = node_product.reduce(([v, m], node) => {
            let id = node.formulaId.toString().replace('\"', '');
            let weight = getWeightFromId(id);
            let node_max = Math.floor(node.capacity / weight);
            let node_value = currentTs >= node.completeWorkTime ? node_max :
                Math.floor(node.complete + (currentTs - node.lastUpdateTime) /
                    ((node.completeWorkTime - node.lastUpdateTime) / (node_max - node.complete)));
            return [v + node_value, m + node_max];
        }, [0, 0]);

        if (value >= max) {
            GameInfo.manufactures.status = "已上限"
        } else {
            GameInfo.manufactures.status = "生产中"
        }
        GameInfo.manufactures.value = value;
        GameInfo.manufactures.maxValue = max;


    }

    //Labor 无人机
    //(current - lastupdate) * (max - value) / secRemain + value, if > max =max
    //
    let node_labor = tree.data.building.labor;
    let labor_value = Math.min(
        Math.floor((currentTs - node_labor.lastUpdateTime) * (node_labor.maxValue - node_labor.value) / node_labor.remainSecs + node_labor.value),
        node_labor.maxValue
    );
    let labor_remain = Math.max(0, node_labor.remainSecs - (currentTs - node_labor.lastUpdateTime));
    GameInfo.labor = {
        value: labor_value,
        maxValue: node_labor.maxValue,
        recoverTime: labor_remain
    };

    // Routine Day and Week
    if (!isNull(tree.data.routine)) {
        let node_day = tree.data.routine.daily;
        let node_week = tree.data.routine.weekly;
        GameInfo.routineDay = {
            current: convertTs2Day(currentTs - 14400) > convertTs2Day(lastOnLineTs - 14400) ? 0 : node_day.current,
            total: node_day.total
        };
        GameInfo.routineWeek = {
            current: node_week.current,
            total: node_week.total
        };
    }

    //Dormitories
    //没研究明白 似乎ap == 8640000的就是休息完成的(240hour)
    //恢复效率：基础值level + 氛围值/2500。如满级宿舍＋5000氛围值 = 一小时恢复4点
    //60 * 60 / 14,40000 (currentTs - lastUpdateTime) * 100 *speed + currentAp >=? 8640000
    //level1: 1.6, level2:1.7, level3:1.8, level4:1.9, level5:2

    let node_dormitories = tree.data.building.dormitories;
    GameInfo.dormitories.isNull = isNull(node_dormitories);
    if (!GameInfo.dormitories.isNull) {
        let [max, value] = node_dormitories.reduce(([m, v], node) => {
            let speed = (node.level * 0.1 + 1.5 + node.comfort / 2500) * 100;
            return node.chars.reduce(([m, v], chr) => {
                m++;
                if ((chr.ap - chr.lastApAddTime) > 86400 ||
                    (currentTs - chr.lastApAddTime) * speed + chr.ap >= 8640000) {
                    v++;
                }
                return [m, v];
            }, [m, v]);
        }, [0, 0]);
        GameInfo.dormitories.maxValue = max;
        GameInfo.dormitories.value = value;
    }

    // Meeting
    let node_meeting = tree.data.building.meeting;
    GameInfo.meeting.isNull = isNull(node_meeting);
    if (!GameInfo.meeting.isNull) {
        let sharing = node_meeting.clue.sharing;
        let shareCompleteTime = node_meeting.clue.shareCompleteTime;
        GameInfo.meeting.status = !sharing ?
            (node_meeting.clue.own >= 10 ? '线索上限' : '收集中') :
            (shareCompleteTime > currentTs ? '交流中' : '交流完成');
        GameInfo.meeting.value = node_meeting.clue.board.length;
    }

    // Tired
    //干员疲劳,数据太久的话不准,要遍历基建群

    GameInfo.tired.value = tree.data.building.tiredChars.length;

    console.info(GameInfo);
    return GameInfo;
}

function gzipInputStream(content) {
    let gzipInputStream_;
    try {
        gzipInputStream_ = new java.util.zip.GZIPInputStream(new java.io.ByteArrayInputStream(content));
    } catch (e) {
        let tips = "获取数据失败,请稍候重试:" + e
        toast(tips);
        console.error(tips);
        return {
            "code": '获取数据失败',
            "msg": resp['msg']
        }
    }
    let inputReader = new java.io.InputStreamReader(gzipInputStream_);
    let bufferedReader = new java.io.BufferedReader(inputReader);
    let response = "";
    let line;
    while ((line = bufferedReader.readLine()) != null) {
        response += line;
    }
    return response;
}
//console.log('原项目源代码仓库,本项目在此基础上修改而来');
//console.log('https://gitee.com/FancyCabbage/skyland-auto-sign');
//config_logger();

let intent = engines.myEngine().execArgv.intent;

//定时任务启动的
if (intent != null) {

    console.info('=========sign==========');

    sign();
    console.info('===========ending============');

} else {
    try {
        module.exports.sign = sign;
        module.exports.input_mode = input_mode;
        module.exports.game_info = game_info;
        module.exports.get_binding_info = function() {

            if (roles_list.length == 0) {
                return "未登录";
            } else {
                return roles_list[0];

            }
        }
    } catch (e) {
        input_mode()
        /*
                //测试
                tokens = do_init();

                if (tokens.length > 0) {
                    for (let i = 0; i < tokens.length; i++) {

                        token_global = tokens[i];
                    }

                    sign([token_global]);
                    // setTimeout(() => {
                    // }, 5000);
                }
                */
    }

}