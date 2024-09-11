/**
 * 获取指定文件夹内的文件/文件夹内的文件md5
 * 生成指向的文件夹/config/files_md5.json文件
 */
importClass(java.io.FileInputStream);
importClass(java.io.File);
importClass(java.math.BigInteger);
importClass(java.security.MessageDigest);
//指向一个相对路径
let path = "./vue_configs/";

let agg = {}


function statistical_file(dir) {
    var list = files.listDir(dir);
    var len = list.length;

    for (let i = 0; i < len; i++) {
        var child = files.join(dir, list[i]);
        console.info(child)
          if(child.indexOf("config/") != -1){
                
            continue;
        }
          
        if (files.isFile(child)) {
            let route = files.path(child)
            child = child.replace(path,"")
            agg[child] = {
                "md5": getFileMD5(route),
                "size": new FileInputStream(route).available()
            }
        } else if (files.isDir(child)) {
            statistical_file(child)
        }
    }
}



/**
 * 获取单个文件的MD5值！

 * @param file
 * @return
 */

function getFileMD5(file) {
    try {
        return $crypto.digest(file, "MD5", {
            input: "file",
            output: "hex"
        })
    } catch (e) {
        //$crypto在aj4.ajx不可用，还有java方法

    }

    file = new File(file);
    if (!file.isFile()) {
        return null;
    }
    let buffer = util.java.array('byte', 1024); //byte[]
    //  let buffer= new byte[1024];
    let len;
    try {
        digest = MessageDigest.getInstance("MD5");
        let in_ = new FileInputStream(file);
        while ((len = in_.read(buffer, 0, 1024)) != -1) {
            digest.update(buffer, 0, len);
        }
        in_.close();
    } catch (e) {
        e.printStackTrace();
        return null;
    }
    let bigInt = new BigInteger(1, digest.digest());
    return bigInt.toString(16);
}
try{
    module.exports = function(){
        statistical_file(path)
        return agg;
    }
}catch(e){
files.ensureDir(path+"config/files_md5.json")
statistical_file(path)
files.write(
    path+"config/files_md5.json",
    JSON.stringify(agg),
    (encoding = "utf-8")
)
toastLog("生成"+path+"config/files_md5.json完成")
}