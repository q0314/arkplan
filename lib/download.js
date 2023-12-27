importClass(java.net.URLDecoder);
importPackage(java.nio.file);

/**
 * 作者: 家
 * QQ:  203118908
 * 功能: 显示下载文件百分比
 */

main()

function main() {
    importClass(java.io.File);
    importClass("java.io.FileOutputStream")
    importClass("java.io.IOException")
    importClass("java.io.InputStream")
    importClass("java.net.MalformedURLException")
    importClass("java.net.URL")
    importClass("java.net.URLConnection")
    importClass("java.util.ArrayList")


    var age = storages.create("Doolu_download");
    var data = age.get("data");

    log("开始请求下载链接")
    try {
        files.ensureDir(files.path(data.myPath))
        url = new URL(data.link); //data.link

        //url = new URL("https://a.y8j5.top/s/WO3gaI8")
        conn = url.openConnection();
        //设置请求头//POST
        conn.setRequestMethod("GET");
        // 设置通用的请求属性
        conn.setRequestProperty("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        conn.setRequestProperty("connection", "keep-alive");
        /*    conn.setRequestProperty("Sec-Fetch-Mode","navigate")
            conn.setRequestProperty("Sec-Fetch-Dest","document")*/
        //自添加
        conn.setRequestProperty("Accept-Language", "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7");
        var user = random(1, 3)
        switch (user) {
            case 1:
                conn.setRequestProperty('User-Agent', 'Mozilla/5.0 (Linux; Android 4.2.1; M040 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36')
                break;
            case 2:
                conn.setRequestProperty('User-Agent', 'Mozilla/5.0 (Linux; U; Android 11; zh-cn; MI 9 Build/RKQ1.200826.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.116 Mobile Safari/537.36 XiaoMi/MiuiBrowser/15.6.12');
                break

        }

        //conn.setRequestProperty("Accept-Encoding","gzip, deflate, br")
        // conn.setRequestProperty("Content-Type", "application/octet-stream");
        // conn.addRequestProperty("token","11111"); //设置header信息

        // 发送POST请求必须设置如下两行
        // conn.setDoOutput(true);
        // conn.setDoInput(true);
        //获取返回码
        if (conn.getResponseCode() == 200) {
            inStream = conn.getInputStream();
        } else {
            inStream = conn.getErrorStream();
        }
        //大小
        connLength = conn.getContentLength(); //int
        if (connLength == "-1") {
            connLength = conn.getContentLengthLong(); //Int16Array
            //  console.info(connLength)
            if (connLength == "-1") {
                connLength = random(1000000, 1100000);
            }
        }

        //文件名
        fileName = conn.getHeaderField("Content-Disposition");
        if (data.prohibit != true && fileName != null) {
            try {
                fileName = fileName.substring(fileName.indexOf("filename="))
                if (fileName.indexOf(";") != -1) {
                    fileName = fileName.split(";");
                    try {
                        if (fileName[0].length < fileName[1].length) {
                            fileName = fileName[1];
                        } else {
                            fileName = fileName[0];
                        }
                    } catch (e) {
                        fileName = fileName[0];
                    }
                }
                fileName = fileName.replace("*", "")
                fileName = fileName.replace(/("|'| |UTF-8|=|filename|;)/gm, "")
                fileName = URLDecoder.decode(fileName, "UTF-8");
                log("文件名：" + fileName + "  大小：" + Math.round((connLength / 1024 / 1024), 2) + "MB");
                data.fileName = fileName
                age.put("data", data)
            } catch (e) {
                console.error("100" + e)
            }
        } else if (fileName != null && fileName.indexOf("明日计划") != -1) {

            try {
                fileName = data.link.split("明日计划")[1];
                if (fileName != undefined) {
                    fileName = "明日计划" + fileName
                    log("文件名：" + fileName + "  大小：" + Math.round((connLength / 1024 / 1024), 2) + "MB");
                    data.fileName = fileName
                    age.put("data", data)
                }
            } catch (e) {
                console.error(e)
            }
        } else if (data.prohibit != true) {
            try {
                fileName = fileName.substring(fileName.indexOf("=")).split("=")[1]
                fileName = URLDecoder.decode(fileName, "UTF-8");
                data.fileName = fileName
                age.put("data", data)
            } catch (e) {
                console.error("at\n 122 " + e)
            }

        }
    } catch (e) {
        report("关闭", "下载失败")
        toast("下载失败，访问链接异常，请加入频道下载最新文件")
        console.error("下载失败，访问链接异常，请加入频道下载最新文件" + e);
        exit();
    }

    try {
        fs = new FileOutputStream(data.myPath + data.fileName);
    } catch (e) {
        report("关闭", "下载失败")
        toast("创建文件失败，请确认已授权应用 读写手机存储/文件读写权限: " + e)
        console.error("创建文件失败，请确认已授权应用 读写手机存储/文件读写权限: " + e);
        sleep(1500);
        app.openAppSetting(context.getPackageName())
        exit();
    }
    log("文件路径", data.myPath + data.fileName)
    if (fs == null) {
        report("关闭", "下载失败")
        toast("下载连接失败，请加入频道下载最新文件")
        console.error("下载链接失败，请加入频道下载最新文件" + e);
        exit();

    }

    startTime = java.lang.System.currentTimeMillis();
    buffer = util.java.array('byte', 1024);
    // byte[]
    // buffer = new byte[1204]; //byte[]

    prevTime = java.lang.System.currentTimeMillis();
    bytePrev = 0; //前一次记录的文件大小
    byteSum = 0; //总共读取的文件大小
    var byteRead; //每次读取的byte数



    report("文件大小", connLength);
    threads.start(
        function () {
            while (true) {
                var 当前写入的文件大小 = byteSum
                var 百分比 = parseInt(当前写入的文件大小 / connLength * 100)
                //var 要显示的内容 = util.format('下载了%s%', 百分比)
                //log(要显示的内容)
                // log("进度" + 百分比)
                if (百分比) {
                    try {
                        report("进度", 百分比)
                    } catch (e) { }
                }
                if (当前写入的文件大小 >= connLength) {
                    break;
                }
                sleep(100)
            }
        }
    )
    try {
        while ((byteRead = inStream.read(buffer)) != -1) {

            byteSum += byteRead;
            //当前时间
            currentTime = java.lang.System.currentTimeMillis();
            fs.write(buffer, 0, byteRead); //读取

        }
    } catch (e) {
        report("关闭", "下载失败")
        toast("下载失败，连接中断，请加入频道下载最新文件\n" + e)
        console.error("下载失败，连接中断，请加入频道下载最新文件\n" + e);
        exit();
    }
    report("结果", "下载完成")

    function report(X, Y) {
        Y = Y || false;
        if (X == "结果" && Y == "下载完成") {
            log("下载完成:" + data.fileName)
            setTimeout(function () {
                exit();
            }, 1500)
        }
        events.broadcast.emit("download" + data.id, {
            name: X,
            data: Y
        });
    }
}