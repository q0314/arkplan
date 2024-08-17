let 信用处理 = {
    setting: {
        收取信用: true,
        信用处理: {
            "信用购买": false,
            "购买列表": false,
            "优先顺序": true
        },
    },
    main: function(_setting) {
        console.info("---信用交易所---")
        //  _setting_ = setting;
        if (_setting) {
            console.verbose("更新设置值");
            for (let setup in this.setting) {
                log(setup)
                if (_setting.hasOwnProperty(setup)) {
                    this.setting[setup] = _setting[setup];
                }
            }
        }
        //没有进入采购中心，不执行其他任务
        if (!this.采购()) {
            return false;
        }
        if (this.setting.信用处理.信用购买) {
            this.购买信用物品();
        } else {
            log("购买物品" + this.setting.信用处理.信用购买)
        }
        return true;


    },
    采购: function() {
        sleep(50);
        if (!this.setting.收取信用) {
            log("收取信用" + this.setting.收取信用);
            return false;
        }
        //threadMain.setName("采购程序");

        // let da = new Date();
        tool.Floaty_emit("展示文本", "状态", "状态：执行收集信用中");
        toastLog("2秒后启动采购程序");
        sleep(1500);

        let _navigation = (ITimg.matchFeatures("导航", {
            action: 0,
            timing: 1500,
            area: 1,
        }) || ITimg.matchFeatures("导航2", {
            action: 0,
            timing: 1500,
            area: 1,
        }))
        if (!_navigation || (!ITimg.matchFeatures("导航_采购中心", {
                action: 0,
                timing: 3000,
                nods: 1000,
                area: 2,
            }) && !ITimg.matchFeatures("导航_采购中心", {
                action: 0,
                timing: 3000,
                nods: 500,
                area: 24,
            }))) {
            _navigation = false;

        }
        if (!_navigation) {
            _navigation = ITimg.matchFeatures("主页_采购中心", {
                action: 0,
                timing: 2000,
                nods: 500,
                area: 4,
            })
        }

        if (!_navigation) {

            tips = "无法进入采购中心，处理信用点失败";
            toast(tips);
            console.error(tips);
            return false
        }
        while (等待提交反馈至神经()) {
            sleep(500);
        }
        sleep(1000);
        if (ITimg.matchFeatures("信用交易所", {
                action: 0,
                timing: 2000,
                area: 2,
            })) {
            if (ITimg.matchFeatures("收取信用", {
                    action: 0,
                    timing: 3000,
                    area: 2,
                    threshold:0.85,
                    nods:1000,
                })||ITimg.matchFeatures("收取信用", {
                    action: 0,
                    timing: 3000,
                    area: 2,
                    threshold:0.85,
                    matcher:2,
                    picture_failed_further:true,
                })) {
                while (等待提交反馈至神经()) {
                    sleep(500);
                }
                if (ITimg.matchFeatures("获得物资", {
                        action: 0,
                        timing: 2000,
                        nods: 1000,
                        picture_failed_further: true,
                    }) || ITimg.matchFeatures("获得物资", {
                        action: 0,
                        timing: 2000,
                        picture_failed_further: true,
                    })) {
                    toastLog("收获信用");
                    Combat_report.record("收取了信用");
                    return true;
                }
            } else {

                toastLog("没有待收取信用");
                return true;
            }


            /* threadMain.interrupt();
             threadMain = threads.start(任务);*/
        }






    },

    购买信用物品: function() {
        tool.Floaty_emit("面板", "展开");

        sleep(1000);
        MyAutomator.click(height / 2 + random(-10, 10), 25 + random(-5, 5));
        if (ITimg.language == "简中服") {
            sleep(500);
            if (!ITimg.initocr()) {
                return false;
            }
            if (this.检测300信用()) {
                return false;
            }

            tool.Floaty_emit("展示文本", "状态", "状态：执行购买物品中");
            tool.Floaty_emit("面板", "隐藏");
            sleep(500);
            let goods;

            log(this.setting.信用处理.优先顺序 ? "优先顺序购买" : "优先优惠购买")
            if (this.setting.信用处理.优先顺序) {
                taglb = ITimg.ocr("集合上半屏物品名", {
                    action: 6,
                    area: [0, 0, height, Math.floor(width / 1.9)],
                    correction_path: "信用",
                });
                let taglb_ = ITimg.ocr("集合下半屏物品名", {
                    action: 6,
                    area: [0, width / 2, height, width / 2],
                    correction_path: "信用",
                })
                let product_collection = [];
                for (let i_ of taglb) {
                    product_collection.push(i_.text);
                }
                for (let i__ of taglb_) {
                    product_collection.push(i__.text);
                }
                console.warn("商品集合名:\n" + JSON.stringify(product_collection))
                for (let i = 0; i < this.setting.信用处理.购买列表.length; i++) {
                    goods = ITimg.ocr(this.setting.信用处理.购买列表[i], {
                        gather: taglb,
                        action: 5,
                        part: true,
                        correction_path: "信用",
                        log_policy: true,
                    });
                    if (!goods) {
                        goods = ITimg.ocr(this.setting.信用处理.购买列表[i], {
                            gather: taglb_,
                            action: 5,
                            part: true,
                            correction_path: "信用",
                            log_policy: true,
                        })
                    }

                    if (!goods) {
                        log("没有匹配到" + this.setting.信用处理.购买列表[i])
                        continue;
                    }
                    //购买

                    MyAutomator.click(goods.left + random(5, 10), goods.top + random(30, 40))
                    sleep(800)
                    let img = ITimg.captureScreen_()
                    let point = findColor(img, "#ff6800", {
                        region: [Math.floor(height / 1.6), width / 1.5, 170, (width / 3.5) - 50],
                        threads: 7
                    });
                    try {
                        img.recycle();
                    } catch (e) {};
                    if (point) {
                        MyAutomator.click(point.x + 50, point.y + 20);
                        sleep(1500)
                        if (!ITimg.matchFeatures("获得物资", {
                                action: 0,
                                timing: 1000,
                            })) {
                            sleep(1000)

                            while (等待提交反馈至神经()) {};
                            if (!ITimg.matchFeatures("获得物资", {
                                    action: 0,
                                    timing: 1000,
                                })) {
                                MyAutomator.click(height / 2, 50);
                                sleep(500)
                                toastLog("没有足够的信用点购买 " + this.setting.信用处理.购买列表[i])
                                break
                            };
                        };
                        Combat_report.record("购买了信用物品： " + this.setting.信用处理.购买列表[i], false, "info");

                        sleep(500)
                        if (this.检测300信用()) {
                            break
                        }
                    } else {
                        console.warn("查找购物按钮失败，" + this.setting.信用处理.购买列表[i] + "可能已经购买")
                    }
                    //防止不够买相同商品
                    let ii = i;
                    taglb.forEach((item, index, taglb) => {
                        if (item.text == goods.text && item.left == goods.left) {
                            taglb.splice(index, 1);
                            i--;
                        }
                    })
                    if (ii == i) {

                        if (taglb_) {
                            taglb_.forEach((item, index, taglb_) => {
                                if (item.text == goods.text && item.left == goods.left) {
                                    taglb_.splice(index, 1);
                                    i--;
                                }
                            })
                        }
                    }

                }
            } else {

                let discount_list = ['-99%', '-90%', '-75%', '-50%'];
                taglb = ITimg.ocr("集合全屏物品名", {
                    action: 6,
                    correction_path: "信用",
                });
                let product_collection = [];
                for (let i_ of taglb) {
                    product_collection.push(i_.text);
                };

                console.warn("商品优惠集合:\n" + JSON.stringify(product_collection))
                for (let i = 0; i < discount_list.length; i++) {
                    if (goods = ITimg.ocr(discount_list[i], {
                            gather: taglb,
                            log_policy: true,
                            similar: 1,
                            action: 5,
                            part: true,
                            correction_path: "信用",
                        })) {
                        MyAutomator.click(goods.right, goods.bottom);
                        //判断物品名是否在购买列表
                        sleep(500)
                        let shangpinming = ITimg.ocr("购买的物品名", {
                            action: 6,
                            area: "左上半屏",
                            correction_path: "信用",
                        })
                        for (var l = 0; l < shangpinming.length; l++) {
                            if (this.setting.信用处理.购买列表.indexOf(shangpinming[l].text) == -1) {
                                if ((shangpinming.length - 1) == l) {
                                    toastLog(shangpinming[l].text + " 不是需要购买的物品")
                                    MyAutomator.click(height / 2, 50);
                                    sleep(500)
                                    //移除此物品
                                    taglb.forEach((item, index, taglb) => {
                                        if (item.text == goods.text && item.left == goods.left) {
                                            taglb.splice(index, 1);
                                            i--;
                                        }
                                    })

                                }
                            } else {
                                //购买
                                let img = ITimg.captureScreen_()
                                let point = findColor(img, "#ff6800", {
                                    region: [Math.floor(height / 1.6), width / 2, 170, width / 2],
                                    threads: 7
                                });
                                try {
                                    img.recycle();
                                } catch (e) {};
                                if (point) {
                                    MyAutomator.click(point.x + 50, point.y + 20);
                                    sleep(1000)
                                    if (!ITimg.matchFeatures("获得物资", {
                                            action: 0,
                                            timing: 1000,
                                        })) {
                                        sleep(1000)

                                        while (等待提交反馈至神经()) {}
                                        if (!ITimg.matchFeatures("获得物资", {
                                                action: 0,
                                                timing: 1000,
                                            })) {
                                            MyAutomator.click(height / 2, 50);
                                            sleep(500)
                                            toastLog("没有足够的信用点购买 " + this.setting.信用处理.购买列表[i])
                                            break
                                        };
                                    };
                                    Combat_report.record("购买了信用物品： " + shangpinming[l].text, false, "info");

                                    //移除此物品
                                    taglb.forEach((item, index, taglb) => {
                                        if (item.text == goods.text && item.left == goods.left) {
                                            taglb.splice(index, 1);
                                            i--;
                                        }
                                    })

                                    sleep(500)
                                    if (this.检测300信用()) {
                                        break
                                    }
                                } else {
                                    console.warn("查找购物按钮失败，" + this.setting.信用处理.购买列表[i] + "可能已经购买")
                                }
                            }
                        }

                    }
                }
            }

            //外服购买
        } else {
            sleep(1000);
            tool.Floaty_emit("展示文本", "状态", "状态：执行购买商品中");
            while (true) {
                if (ITimg.matchFeatures("信用交易所_物品", {
                        action: 0,
                        timing: 1500,
                        area: "上半屏",
                    })) {
                    let img = ITimg.captureScreen_()
                    let point = findColor(img, "#ff6800", {
                        region: [Math.floor(height / 1.6), width / 2, 170, width / 2],
                        threads: 7
                    });
                    try {
                        img.recycle();
                    } catch (e) {};

                    if (point) {
                        MyAutomator.click(point.x + 50, point.y + 20);
                        sleep(1500)
                        if (!ITimg.matchFeatures("获得物资", {
                                action: 0,
                                timing: 1000,
                            })) {
                            MyAutomator.click(height / 2, 50);
                            Combat_report.record("购买了信用商品");
                            sleep(500)
                        };
                    } else {
                        console.error("查找购物按钮失败")
                    }
                } else {
                    break;
                }
            }

        }

        return true;
    },
    检测300信用: function() {
        if (this.setting.信用处理.三百信用) {
            tool.Floaty_emit("展示文本", "状态", "状态：判断是否需要购买中");
            let credits = ITimg.ocr("300", {
                similar: 1,
                area: [Math.floor(height / 1.2), 0, height - Math.floor(height / 1.2), 200],
                action: 5,
                part: true,
                correction_path: "信用",
                saveSmallImg: false,
            })
            if (!credits) {
                credits = ITimg.ocr("300", {
                    area: [Math.floor(height / 1.2), 0, height - Math.floor(height / 1.2), 200],
                    similar: 1,
                    action: 6,
                    part: true,
                    correction_path: "信用",
                });

                if (!credits) {
                    tool.Floaty_emit("展示文本", "状态", "状态：无法获取可用信用点");
                    console.error("无法获取可用信用点；识别结果1：" + JSON.stringify(credits))
                    return false
                }

                for (let l = 0; l < credits.length; l++) {
                    if (!isNaN(Number(credits[l].text))) {
                        credits = Number(credits[l].text);
                        break
                    }
                }
            }
            if (!credits) {
                tool.Floaty_emit("展示文本", "状态", "状态：无法获取可用信用点");
                console.error("无法获取可用信用点；识别结果2：" + JSON.stringify(credits))
                return false
            }

            console.info("可用信用点：" + credits)
            if (credits < 300) {
                toastLog("信用点小于300点，无需购买")
                tool.Floaty_emit("展示文本", "状态", "状态：小于300点，无需购买");
                return true
            } else {
                return false
            }

        } else {
            return null
        }
    },

}
module.exports = 信用处理;