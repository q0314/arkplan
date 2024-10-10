importClass(java.lang.StringBuilder);
importClass(java.nio.charset.Charset);
// 导入所需的Java类
var ByteArrayOutputStream = java.io.ByteArrayOutputStream;
var GZIPOutputStream = java.util.zip.GZIPOutputStream;
var MessageDigest = java.security.MessageDigest;
var UUID = java.util.UUID;
var SimpleDateFormat = java.text.SimpleDateFormat;
var Date = java.util.Date;
var Cipher = javax.crypto.Cipher;
var SecretKeySpec = javax.crypto.spec.SecretKeySpec;
var IvParameterSpec = javax.crypto.spec.IvParameterSpec;

// 查询dId请求头
var devices_info_url = "https://fp-it.portal101.cn/deviceprofile/v4";

// 数美配置
var SM_CONFIG = {
    "organization": "UWXspnCCJN4sfYlNfqps",
    "appId": "default",
    "publicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmxMNr7n8ZeT0tE1R9j/mPixoinPkeM+k4VGIn/s0k7N5rJAfnZ0eMER+QhwFvshzo0LNmeUkpR8uIlU/GEVr8mN28sKmwd2gpygqj0ePnBmOW4v0ZVwbSYK+izkhVFk2V/doLoMbWy6b+UnA8mkjvg0iYWRByfRsK2gdl7llqCwIDAQAB",
    "protocol": "https",
    "apiHost": "fp-it.portal101.cn"
};


var b64Decoder = java.util.Base64.getDecoder();
//编码器
var b64Encoder = java.util.Base64.getEncoder();
var publicKeyBytes = b64Decoder.decode(SM_CONFIG.publicKey);
var keyFactory = java.security.KeyFactory.getInstance("RSA");
var x509EncodedKeySpec = new java.security.spec.X509EncodedKeySpec(publicKeyBytes);
var publicKey = keyFactory.generatePublic(x509EncodedKeySpec);




var DES_RULE = {
    "appId": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "uy7mzc4h",
        "obfuscated_name": "xx"
    },
    "box": {
        "is_encrypt": 0,
        "obfuscated_name": "jf"
    },
    "canvas": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "snrn887t",
        "obfuscated_name": "yk"
    },
    "clientSize": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "cpmjjgsu",
        "obfuscated_name": "zx"
    },
    "organization": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "78moqjfc",
        "obfuscated_name": "dp"
    },
    "os": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "je6vk6t4",
        "obfuscated_name": "pj"
    },
    "platform": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "pakxhcd2",
        "obfuscated_name": "gm"
    },
    "plugins": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "v51m3pzl",
        "obfuscated_name": "kq"
    },
    "pmf": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "2mdeslu3",
        "obfuscated_name": "vw"
    },
    "protocol": {
        "is_encrypt": 0,
        "obfuscated_name": "protocol"
    },
    "referer": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "y7bmrjlc",
        "obfuscated_name": "ab"
    },
    "res": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "whxqm2a7",
        "obfuscated_name": "hf"
    },
    "rtype": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "x8o2h2bl",
        "obfuscated_name": "lo"
    },
    "sdkver": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "9q3dcxp2",
        "obfuscated_name": "sc"
    },
    "status": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "2jbrxxw4",
        "obfuscated_name": "an"
    },
    "subVersion": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "eo3i2puh",
        "obfuscated_name": "ns"
    },
    "svm": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "fzj3kaeh",
        "obfuscated_name": "qr"
    },
    "time": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "q2t3odsk",
        "obfuscated_name": "nb"
    },
    "timezone": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "1uv05lj5",
        "obfuscated_name": "as"
    },
    "tn": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "x9nzj1bp",
        "obfuscated_name": "py"
    },
    "trees": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "acfs0xo4",
        "obfuscated_name": "pi"
    },
    "ua": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "k92crp1t",
        "obfuscated_name": "bj"
    },
    "url": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "y95hjkoo",
        "obfuscated_name": "cf"
    },
    "version": {
        "is_encrypt": 0,
        "obfuscated_name": "version"
    },
    "vpw": {
        "cipher": "DES",
        "is_encrypt": 1,
        "key": "r9924ab5",
        "obfuscated_name": "ca"
    }
}

var BROWSER_ENV = {
    'plugins': 'MicrosoftEdgePDFPluginPortableDocumentFormatinternal-pdf-viewer1,MicrosoftEdgePDFViewermhjfbmdgcfjbbpaeojofohoefgiehjai1',
    'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
    'canvas': '259ffe69', // 基于浏览器的canvas获得的值，不知道复用行不行
    'timezone': -480, // 时区，应该是固定值吧
    'platform': 'Win32',
    'url': 'https://www.skland.com/', // 固定值
    'referer': '',
    'res': '1920_1080_24_1.25', // 屏幕宽度_高度_色深_window.devicePixelRatio
    'clientSize': '0_0_1080_1920_1920_1080_1920_1080',
    'status': '0011', // 不知道在干啥
}


// 将浏览器环境对象的key全部排序，然后对其所有的值及其子对象的值加入数字并字符串相加。若值为数字，则乘以10000(0x2710)再将其转成字符串存入数组,最后再做md5,存入tn变量（tn变量要做加密）
//把这个对象用加密规则进行加密，然后对结果做GZIP压缩（结果是对象，应该有序列化），最后做AES加密（加密细节目前不清除），密钥为变量priId
//加密规则：新对象的key使用相对应加解密规则的obfuscated_name值，value为字符串化后进行进行DES加密，再进行btoa加密

// 加密函数
function encrypt(uid) {
    // 创建Cipher对象
    var cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
    cipher.init(Cipher.ENCRYPT_MODE, publicKey);
    // 执行加密
    var encryptedBytes = cipher.doFinal(uid);
    // Base64编码
    encryptedBytes = b64Encoder.encodeToString(encryptedBytes);
    return encryptedBytes
}

// DES加密函数
function _DES(o) {
    var result = {};
    for (var i in o) {
        if (DES_RULE.hasOwnProperty(i)) {
            var rule = DES_RULE[i];
            var res = o[i];
            if (rule.is_encrypt === 1) {
                //字符长度拓展
                function extendKey(key) {
                    let extendedKey = new StringBuilder(key);
                    while (extendedKey.length() < 24) {
                        extendedKey.append(key);
                    }
                    return extendedKey.substring(0, 24);
                }

                var keyBytes = java.lang.String(extendKey(rule.key)).getBytes("UTF-8");
                var cipher = Cipher.getInstance("DESede/ECB/NoPadding");
                var TSecretKey = new SecretKeySpec(keyBytes, "DESede");
                cipher.init(Cipher.ENCRYPT_MODE, TSecretKey);

                /* 都可以
                var keyBytes = java.lang.String((rule.key)).getBytes("UTF-8");
                var cipher = Cipher.getInstance("DES/ECB/NoPadding");
                var secretKeySpec = new SecretKeySpec(keyBytes, "DES");
                cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
                */
                var data = java.lang.String(res).getBytes("UTF-8");
                // 补足字节
                var paddedData = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, Math.ceil(data.length / 8) * 8);
                java.lang.System.arraycopy(data, 0, paddedData, 0, data.length);

                var encryptedBytes = cipher.doFinal(paddedData);
                res = b64Encoder.encodeToString(encryptedBytes);
            }
            result[rule.obfuscated_name] = res;
        } else {
            result[i] = o[i];
        }
    }
    return result;
}
// AES加密函数
function _AES(v, k) {
    var iv = "0102030405060708";
    // 确保 v 是字节数组
    if (typeof v === "string") {
        v = java.lang.String(v).getBytes("UTF-8");
        //  console.error(v)
    }
    // 创建 AES 密钥
    var secretKeySpec = new SecretKeySpec(k, "AES");
    // 创建 AES/CBC 加密器
    var cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    var ivSpec = IvParameterSpec(java.lang.String(iv).getBytes("UTF-8"));
    cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivSpec);

    // 填充明文
    var paddedV = new java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, Math.ceil(v.length / 16) * 16);
    java.lang.System.arraycopy(v, 0, paddedV, 0, v.length);

    // 加密
    var encryptedBytes = cipher.doFinal(paddedV);
    // 将加密后的字节数组转换为十六进制字符串
    return bytesToHex(encryptedBytes);
}

function GZIP(o) {
    // 将字典转换为 JSON 字符串
    var jsonStr = JSON.stringify(o);

    // 使用 ByteArrayOutputStream 来捕获压缩后的数据
    var byteArrayOutputStream = new ByteArrayOutputStream();
    var gzipOutputStream = new GZIPOutputStream(byteArrayOutputStream);

    // 写入数据并关闭流
    var bytes = java.lang.String(jsonStr).getBytes("UTF-8");
    gzipOutputStream.write(bytes);
    gzipOutputStream.close();

    // 将压缩后的字节数组转换为 Base64 编码的字符串
    var base64 = b64Encoder.encode(byteArrayOutputStream.toByteArray());
    return base64;
}

function get_tn(o) {
    // 获取字典的键并排序
    var keys = Object.keys(o).sort();

    var result = [];

    // 遍历键值对
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = o[key];

        // 如果值是数字,则乘以 10000 并转换为字符串
        if (typeof value === "number") {
            value = (value * 10000).toString();
        }
        // 如果值是字典,则递归调用 get_tn
        else if (typeof value === "object") {
            value = get_tn(value);
        }

        result.push(value);
    }

    // 将结果数组连接为字符串
    return result.join("");
}

// 获取smid的函数
function get_smid() {
    var sdf = new SimpleDateFormat("yyyyMMddHHmmss");
    var _time = sdf.format(new Date());
    var uid = java.lang.String(UUID.randomUUID()).getBytes("UTF-8");
    var v = _time + md5(uid) + "00";
    var smsk_web = md5(java.lang.String("smsk_web_" + v).getBytes("UTF-8")).substring(0, 14);
    return v + smsk_web + "0";
}

// 获取d_id的函数
function get_d_id() {

    var uid = UUID.randomUUID()
    // 将 UUID 转换为字符串并进行 UTF-8 编码
    uid = java.lang.String(uid).getBytes("UTF-8");
    var priId = md5(uid).substring(0, 16).toLowerCase();
    //console.trace("priId", priId);
    // RSA加密部分需要额外的库支持，这里简化处理
    var ep = encrypt(uid);
    var browser = Object.assign({}, BROWSER_ENV);
    var current_time = new Date().getTime();
    Object.assign(browser, {
        'vpw': UUID.randomUUID().toString(),
        'svm': current_time,
        'trees': UUID.randomUUID().toString(),
        'pmf': current_time
    });

    var des_target = Object.assign({}, browser, {
        'protocol': 102,
        'organization': SM_CONFIG.organization,
        'appId': SM_CONFIG.appId,
        'os': 'web',
        'version': '3.0.0',
        'sdkver': '3.0.0',
        'box': '',
        'rtype': 'all',
        'smid': get_smid(),
        'subVersion': '1.0.0',
        'time': 0
    });
    des_target.tn = md5(java.lang.String(get_tn(des_target)).getBytes());

    var des_result = _AES(GZIP(_DES(des_target)), java.lang.String(priId).getBytes("UTF-8"));
    var response = http.postJson(devices_info_url, {
        'appId': 'default',
        'compress': 2,
        'data': des_result,
        'encode': 5,
        'ep': ep,
        'organization': SM_CONFIG.organization,
        'os': 'web'
    });

    var resp = response.body.json();
    if (resp.code != 1100) {
        throw new Error("did计算失败，请联系作者");
    }
    return 'B' + resp.detail.deviceId;
}

// 辅助函数：MD5
function md5(input) {
    var md = MessageDigest.getInstance("MD5");
    var messageDigest = md.digest(input);
    return bytesToHex(messageDigest);
}

// 辅助函数：字节数组转十六进制字符串
function bytesToHex(bytes) {
    var hexChars = "0123456789ABCDEF".split("");
    var hex = [];
    for (var i = 0; i < bytes.length; i++) {
        var v = bytes[i] & 0xFF;
        hex[i * 2] = hexChars[v >>> 4];
        hex[i * 2 + 1] = hexChars[v & 0x0F];
    }
    return hex.join("");
}

// 使用示例
try {
    module.exports = get_d_id;
} catch (e) {
    var dId = get_d_id();
    console.log("Device ID: " + dId);
    console.error("Error: " + e.message);
}