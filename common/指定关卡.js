/**
 * 负责自动进入选中到指定的关卡
 */
let collection = {
    main: function(list) {
        let level_choices = JSON.parse(
            files.read(files.exists("./lib/game_data/level_choices.json") ? "./lib/game_data/level_choices.json" : "../lib/game_data/level_choices.json", (encoding = "utf-8"))
        );

        function isOpen(level, special) {
            let now = new Date();
            let day = now.getDay();
            let gnow = new Date().setHours(4, 0, 0, 0);
            // 判断当前时间是否在凌晨4点之前
            if (now < gnow) {
                // 如果是，日期减1
                if (day <= 0) {
                    day = 6;
                } else {
                    day = day - 1;
                }
            }
            //特别开放
            if (special) return true;
            if (level.day) {
                //  return level.day.includes(day);
                return (level.day.indexOf(day) != -1);
            } else {
                return true;
            }

        }
        let selectResult;
        for (let id of level_choices) {
            //检验是否选择的关卡
            if (typeof id.abbreviation == "object") {
                let abbResult;
                for (let k in id.abbreviation) {
                    if (list.levelAbbreviation == k) {
                        abbResult = true;
                        break
                    };
                }
                if (!abbResult) {
                    continue;
                }
            } else {
                if (list.levelAbbreviation != id.abbreviation) {
                    continue;
                };
            }

            if (id.name && isOpen(id)) {
                //console.trace(id.abbreviation);
                selectResult = this.资源本(id["name"], id.level ? id.level : id.abbreviation[Object.keys(id.abbreviation).find(key => key == list.levelAbbreviation)]);
                break
            } else if (id.id) {
                selectResult = this[id.id]((list.levelAbbreviation == displayText["龙门外环"]) ? true : false);
                if (selectResult) {
                    if (id.id == "指定剿灭") {
                        setting.执行 = "剿灭";
                        ITimg.setting.执行 = "剿灭"
                    }
                }
                break
            }

        };

        if (selectResult) {
            return true;

        } else {
            tool.Floaty_emit("展示文本", "状态", "状态：自动选择关卡失败.");
            return false;
        }
    },
    /**
     * 进入终端界面并选择事务
     * @param {string} affairs - 选择终端事务
     */
    终端事务: function(affairs) {
        let _terminal = 2;
        while (true) {
            tool.Floaty_emit("展示文本", "状态", "状态: 进入终端");
            if (_terminal && ITimg.ocr(displayText["终端"], {
                    action: 0,
                    timing: 1000,
                    area: 2,
                    threshold: 0.7,
                }) || ITimg.ocr(displayText["当前"], {
                    action: 0,
                    timing: 1000,
                    area: 2,
                    log_policy: true,
                    refresh: false,
                })) {
                _terminal--;
            }

            if (_terminal == 2||!导航定位(4,true)) {
                continue;
            }

            tool.Floaty_emit("展示文本", "状态", "状态: 切换事务");
            // 分辨率

            // 已知按钮坐标
            let button1X = Math.floor(height / 16.4);
            let button8X = parseInt(height / 1.068);

            // 计算按钮间隔
            let interval = (button8X - button1X) / (8 - 1); // 计算按钮间隔

            // 获取线上的按钮坐标
            function getButtonCoordinates(yPosition) {
                let buttons = [];

                // 循环添加按钮坐标
                for (let i = 1; i <= 8; i++) {
                    let buttonX = button1X + (i - 1) * interval; // 使用间隔计算按钮 X 坐标
                    let buttonY = yPosition;
                    buttons.push([buttonX, buttonY]);
                }

                return buttons;
            }


            let buttonCoords = getButtonCoordinates(width - zoy(80));

            if (setting.调试) {
                tool.pointerPositionDisplay(true)
            }

            switch (affairs) {
                case displayText["主题曲"]:
                    MyAutomator.click.apply(MyAutomator, buttonCoords[1]);
                    break;
                case displayText["插曲"]:
                    MyAutomator.click.apply(MyAutomator, buttonCoords[2]);
                    break;
                case displayText["别传"]:
                    MyAutomator.click.apply(MyAutomator, buttonCoords[3]);
                    break
                case displayText["资源收集"]:
                    MyAutomator.click.apply(MyAutomator, buttonCoords[4]);
                    break;
                case displayText["常态事务"]:
                    MyAutomator.click.apply(MyAutomator, buttonCoords[5]);
                    break;
                case displayText["长期探索"]:
                    MyAutomator.click.apply(MyAutomator, buttonCoords[6])
                    break;
                case displayText["周期挑战"]:
                    MyAutomator.click.apply(MyAutomator, buttonCoords[7]);
                    break;
            }
            if (setting.调试) {
                tool.pointerPositionDisplay(false)
            }
            sleep(1000);
            console.info("尝试退出事务切换");
            // if(this.staging&&ITimg.results.length <= 0){

            //  }
            if (ITimg.ocr(affairs, {
                    area: 34,
                    action: 5,
                    saveSmallImg: "终端事务_" + affairs,
                }) || ITimg.ocr(affairs, {
                    action: 5,
                    area: 34,
                    threshold: 0.7,
                    saveSmallImg: "终端事务_" + affairs,
                })) {
                break

            }
        }
    },
    固源岩: function() {
        this.终端事务(displayText["主题曲"]);
        tool.Floaty_emit("面板", "隐藏");
        tool.Floaty_emit("展示文本", "状态", "状态: 正在进入固源岩关卡");
        let cumulative = 5;
        while (cumulative) {
            sleep(500);
            if (this.staging = (ITimg.ocr(displayText["EPISODE"], {
                    action: 5,
                    area: 13,
                    similar: 0.85,
                })) || ITimg.ocr(displayText["残阳"], {
                    action: 5,
                    area: 13,
                    log_policy: true,
                    refresh: false,
                })) {
                swipe(this.staging.left, this.staging.bottom, this.staging.right, width - zoy(100), 500);
                sleep(500);
                swipe(this.staging.left, this.staging.bottom, this.staging.right, width - zoy(100), 500);
                sleep(500);
                break;
            };
            cumulative--;
            if (!cumulative) {
                console.warn("多次无法识别EPISODE，改用固定坐标滑动");
                swipe(zox(300), zoy(350), zox(300), width - zoy(200), 500);
                sleep(500);
                swipe(zox(300), zoy(350), zox(300), width - zoy(200), 500);
                sleep(500);
            }

        };
        sleep(500);
        tool.Floaty_emit("面板", "展开");
        if (this.staging = (ITimg.ocr(displayText["黑暗时代"], {
                action: 5,
                area: 34,
                part: true,
                nods: 500,
            }) || ITimg.ocr(displayText["黑暗时代"], {
                action: 5,
                area: 34,
                part: true
            }))) {
            MyAutomator.click(this.staging.right, this.staging.top);
            sleep(1000);
        };
        cumulative = 5;
        while (cumulative) {

            this.staging = (ITimg.ocr("集合文本", {
                action: 6,
            }));
            if (this.staging && this.staging.length) {
                (ITimg.ocr("O1", {
                    action: 0,
                    timing: 1000,
                    area: 4,
                    similar: 1,
                    gather: this.staging,
                }) || ITimg.ocr("01", {
                    action: 0,
                    timing: 1000,
                    area: 4,
                    similar: 1,
                    refresh: false,
                    log_policy: "brief",
                    gather: this.staging,
                }));
                let gesturexy = [
                    [height / 2, width / 2, height - zox(100), width / 2, 800],
                    [height / 2, width / 2, zox(100), width / 2, 800]
                ];

                if (ITimg.ocr("1-3", {
                        action: 5,
                        similar: 1,
                        area: 24,
                        gather: this.staging,
                    }) || ITimg.ocr("1-2", {
                        action: 5,
                        similar: 1,
                        area: 13,
                        gather: this.staging,
                    })) {

                    gesturexy[0][2] = height - zox(100);
                    MyAutomator.swipe.apply(MyAutomator, gesturexy[0]);

                } else if (ITimg.ocr("1-3", {
                        action: 5,
                        similar: 1,
                        area: 13,
                        gather: this.staging,
                    })) {

                    gesturexy[0][2] = height - zox(300);
                    MyAutomator.swipe.apply(MyAutomator, gesturexy[0]);

                } else if (ITimg.ocr("1-12", {
                        action: 5,
                        similar: 1,
                        gather: this.staging,
                    })) {

                    MyAutomator.swipe.apply(MyAutomator, gesturexy[1]);

                }

                sleep(500);

                if (ITimg.ocr("1-7", {
                        action: 0,
                        timing: 1000,
                        similar: 1,
                        threshold: 0.85,
                        picture_failed_further: true,
                    })) {
                    break;
                    // return true;
                } else {
                    cumulative--;
                    if (!cumulative) {
                        console.error("多次无法选中1-7关卡");
                        break
                    }
                }
            }
        }
        return (cumulative ? true : false)

    },
    /**
     * 跳转到资源收集,点击资源入口,选中关卡
     * @param {string} levelEntrance - 资源关卡入口名
     * @param {string|Array} levelName - 准确关卡名
     * @returns 
     */
    资源本: function(levelEntrance, levelName) {
        this.终端事务(displayText["资源收集"]);
        tool.Floaty_emit("展示文本", "状态", "状态: 进入关卡");
        while (true) {
            if (ITimg.ocr(levelEntrance, {
                    timing: 300,
                    action: 0,
                    area: 34,
                    nods: 500,
                })) {
                //不可进入右上角出现关卡尚未开放
                if (ITimg.ocr(displayText["关卡"], {
                        timing: 200,
                        area: 2,
                        part: true,
                    })) {
                    console.error(levelEntrance + " 不在开放时间");
                    return false;
                };
                break

            } else {
                switch (levelEntrance) {
                    case displayText["粉碎防御"]:
                    case displayText["货物运送"]:
                        swipe(height / 2, width / 2, height - 50, width / 2, 500);

                        break;
                    case displayText["势不可挡"]:
                    case displayText["身先士卒"]:
                    case displayText["固若金汤"]:
                        swipe(height / 2, width / 2, 50, width / 2, 500);

                        break;
                }
            }
        }
        sleep(1500);
        tool.Floaty_emit("展示文本", "状态", "状态: 匹配关卡名");

        if (typeof levelName == "object") {
            if ((ITimg.ocr(levelName[0], {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    threshold: 0.95,
                    picture_failed_further: true,
                    area: (levelName[0].indexOf("1") != -1) ? 13 : 24,
                }) || ITimg.ocr(levelName[1], {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    area: (levelName[1].indexOf("1") != -1) ? 13 : 24,
                    refresh: false,
                    log_policy: "brief",
                    nods: 1000,
                    threshold: 0.95,
                    picture_failed_further: true,
                })) || (ITimg.ocr(levelName[0], {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    threshold: 0.95,
                    picture_failed_further: true,
                    area: (levelName[0].indexOf("1") != -1) ? 13 : 24,
                }) || ITimg.ocr(levelName[1], {
                    action: 0,
                    similar: 1,
                    timing: 1000,
                    area: (levelName[1].indexOf("1") != -1) ? 13 : 24,
                    refresh: false,
                    log_policy: "brief",
                    threshold: 0.95,
                    picture_failed_further: true,
                }))) {
                return true;
            }
        } else {
            if (ITimg.ocr(levelName, {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    threshold: 0.95,
                    picture_failed_further: true,
                    area: (levelName.indexOf("1") != -1) ? 13 : 24,
                }) || ITimg.ocr(levelName, {
                    action: 0,
                    timing: 1000,
                    similar: 1,
                    threshold: 0.95,
                    picture_failed_further: true,
                    area: (levelName.indexOf("1") != -1) ? 13 : 24,
                })) {
                return true;
            }
        }


    },

    /**
     * 进入终端,并检验上一次作战类型,选中非剿灭关卡
     * @returns 
     */ 
    上次作战: function() {
        console.info("---上次作战---");
        while (true) {

            tool.Floaty_emit("展示文本", "状态", "状态：判断界面中");
            ITimg.matchFeatures("终端", {
                action: 0,
                timing: 1500,
                area: 2
            });
            if(!导航定位(4,true)){
                continue;
            }
            if (ITimg.matchFeatures("上一次作战", {
                    timing: 500,
                    area: "右下半屏",
                    nods: 500,
                }) && (ITimg.matchFeatures("返回", {
                    timing: 200,
                    area: "左上半屏",
                }) || ITimg.matchFeatures("导航", {
                    timing: 200,
                    area: "左上半屏",
                }) || ITimg.matchFeatures("导航2", {
                    timing: 200,
                    area: "左上半屏",
                }))) {
                log("验证通过")
                break;
            } else if(导航定位("终端")){
                
                    ITimg.matchFeatures("基建_离开", {
                        action: 0,
                        timing: 5000,
                        area: "右半屏",
                    });
                
            }

        }
        tool.Floaty_emit("展示文本", "状态", "状态：判断上次作战类型中");
        if (ITimg.matchFeatures("上次部署", {
                area: 4,
            })) {
            return false;
        }

        if (!ITimg.matchFeatures("上一次作战", {
                action: 0,
                timing: 2000,
                area: 4,
            }) && !ITimg.matchFeatures("上一次作战", {
                action: 0,
                timing: 2000,
                area: 4,
                threshold: 0.75,
            })) {
            let tips = "上次作战无法确认当前界面,重试";
            toast(tips);
            console.error(tips);
            return false;
        } else {
            if (ITimg.matchFeatures("行动_普通", {
                    area: 4,
                    threshold: 0.85,
                }) || ITimg.matchFeatures("行动_磨难", {
                    threshold: 0.85,
                    area: 4,
                }) || ITimg.matchFeatures("行动_愚人号", {
                    area: 4,
                    threshold: 0.85,
                }) || ITimg.matchFeatures("行动_活动", {
                    area: 4,
                    threshold: 0.85,
                })) {
                return true;
            } else {
                sleep(1500);
                return true;
            }
        }

    },

    指定剿灭: function(龙门外环) {
        tool.Floaty_emit("展示文本", "状态", "状态：执行定时指定剿灭中");
        sleep(500);
        this.终端事务(displayText["终端"]);
        if (!ITimg.matchFeatures("上次_剿灭", {
                action: 0,
                timing: 2000,
                nods: 1000,
                area: 2,
            }) && !ITimg.matchFeatures("上次_剿灭", {
                action: 0,
                timing: 2000,
                area: 2,
                threshold: 0.75,
            })) {

            toast("没有在终端页面找到待办_剿灭,无法执行上次-剿灭");
            console.error("没有在终端页面找到待办_剿灭,无法执行上次-剿灭");
            tool.Floaty_emit("展示文本", "状态", "状态：暂停，找不到待办_剿灭");
            tool.Floaty_emit("暂停", "结束程序");
            return false
        }
        if (龙门外环) {

            MyAutomator.click(height / 2, 25);
            sleep(1000);
            MyAutomator.click(height, width - 30);
            sleep(1000);
            if (!ITimg.matchFeatures("上次_龙门外环", {
                    action: 0,
                    timing: 2000,
                    area: 2,
                })) {
                MyAutomator.click(height - zox(60), width - zoy(30));
                sleep(1000);
                if (!ITimg.matchFeatures("上次_龙门外环", {
                        action: 0,
                        timing: 2000,
                        area: 2,
                    })) {
                    MyAutomator.click(height - zox(120), width - zoy(30));
                    sleep(1000);

                    if (!ITimg.matchFeatures("上次_龙门外环", {
                            action: 0,
                            timing: 2000,
                            area: 2,
                        })) {
                        MyAutomator.click(height - 180, width - 30);
                        sleep(1000);
                        if (!ITimg.matchFeatures("上次_龙门外环", {
                                action: 0,
                                timing: 2000,
                                area: 2,
                            })) {
                            toast("没有在剿灭页面找到上次_龙门外环,无法执行上次-剿灭");
                            console.error("没有在剿灭页面找到上次_龙门外环,无法执行上次-剿灭");
                            tool.Floaty_emit("展示文本", "状态", "状态：暂停，找不到龙门外环");
                            tool.Floaty_emit("暂停", "结束程序");
                            return false;
                        }

                    }
                }


            }
        }
        return true;
    }
}

module.exports = collection;