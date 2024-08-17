let 基建任务 = {
    fatigue_state: false,
    main: function() {
        if (ITimg.matchFeatures("基建", {
                action: 0,
                timing: 3000,
                nods: 1000,
                threshold: 0.65,
                area: 34,
                saveSmallImg: "主页_基建",
            }) || ITimg.matchFeatures("基建", {
                action: 0,
                timing: 3000,
                area: 4,
                threshold: 0.65,
                refresh: false,
                saveSmallImg: "主页_基建",
                picture_failed_further: true,
            })) {
            return true;
        }
        if (ITimg.matchFeatures("导航", {
                action: 0,
                nods: 1000,
                timing: 1500,
                scale: 1,
                area: 1,
            }) || ITimg.matchFeatures("导航", {
                action: 0,
                timing: 1500,
                area: 1,
                refresh: false,
                picture_failed_further: true,
            }) || ITimg.matchFeatures("导航2", {
                action: 0,
                timing: 1500,
                nods: 1000,
                area: 1,
                scale: 1,
                refresh: false,
            }) || ITimg.matchFeatures("导航2", {
                action: 0,
                timing: 1500,
                area: 1,
                refresh: false,
                picture_failed_further: true,
            })) {

            if (!ITimg.matchFeatures("导航_基建", {
                    action: 0,
                    timing: 500,
                    nods: 1000,
                    area: 12,
                    scale: 1,
                }) && !ITimg.matchFeatures("导航_基建", {
                    action: 0,
                    timing: 500,
                    area: 12,
                    matcher: 2,
                    refresh: false,
                    picture_failed_further: true,
                })) {
                toastLog("没有找到导航_基建，无法执行基建任务");
                return false;
            } else {
                return true;
            }
        } else {
            toastLog("既没有找到主页面基建键，也没有找到导航键。\n无法进入基建");

            //tool.Floaty_emit("展示文本", "状态", "状态：主程序暂停中");
            // tool.Floaty_emit("暂停", "结束程序");
            return false;
        }




    },
    待办处理: function() {
        if (!ITimg.matchFeatures("基建_铃铛", {
                action: 0,
                area: 2,
                timing: 2000,
            }) && !ITimg.matchFeatures("基建_铃铛", {
                action: 0,
                area: 2,
                timing: 2000,
                threshold: 0.75,
            })) {
            toastLog("无法匹配铃铛 / 待办事项按钮，等待6秒")
            sleep(6000);
            if (!ITimg.matchFeatures("基建_铃铛", {
                    action: 0,
                    area: "右上半屏",
                    timing: 1500,
                }) && !ITimg.matchFeatures("基建_铃铛", {
                    action: 0,
                    area: "右上半屏",
                    timing: 1500,
                    threshold: 0.7,
                })) {
                /* toastLog("没有匹配到基建_铃铛, 点击返回重试");
                 ITimg.matchFeatures("返回", {
                     action: 4,
                     timing: 1500,
                     area: "左上半屏",
                 });
                 */
                if (!ITimg.matchFeatures("基建_铃铛", {
                        action: 0,
                        area: "右上半屏",
                        timing: 1500,
                    }) && !ITimg.matchFeatures("基建_铃铛", {
                        action: 0,
                        area: "右上半屏",
                        timing: 1500,
                        threshold: 0.75,
                    })) {
                    toastLog("没有匹配到基建_铃铛, 没有待办");
                    return false
                }
            }



        }
        let to_do = 0;
        if (ITimg.matchFeatures("基建_可收获", {
                action: 0,
                timing: 2000,
                area: 34,
            })) {
            to_do++;
        }
        if (ITimg.matchFeatures("基建_订单交付", {
                action: 0,
                timing: 2000,
                area: 3,
            })) {
            to_do++;
        }
        sleep(1000);
        if (ITimg.matchFeatures("基建_订单交付", {
                action: 0,
                timing: 2000,
                area: 3,
            })) {
            to_do++;
        }
        if (ITimg.matchFeatures("基建_信赖", {
                action: 0,
                timing: 3000,
                area: 3,
            })) {
            to_do++;
        }
        this.fatigue_state = ITimg.matchFeatures("基建_干员疲劳", {
            timing: 500,
            area: 3,
            threshold: 0.8,
        });

        if (this.fatigue_state) {
            to_do++;
            console.error("发现干员疲劳！基建换班:" + setting.基建换班);
        }
        if (!to_do) {
            //重试收菜
            return this.待办处理();

        } else {
            return true;
        }
    },

    无人机加速: function() {
        if (!setting.无人机加速) {
            sleep(500);
            return false
        }
        tool.Floaty_emit("面板", "隐藏");
        this.identify_frequency = 5;
        this.where_interface = 0;
        if (setting.加速生产) {
            console.info("查询制造站");
            //进入制造站
            while (this.identify_frequency) {

                this.where_interface = (ITimg.matchFeatures("基建_制造站", {
                    action: 0,
                    timing: 1500,
                    area: "左半屏",
                    nods: 500,
                    threshold: 0.7,
                }) || ITimg.matchFeatures("基建_制造站", {
                    action: 0,
                    timing: 1500,
                    area: "下半屏",
                    threshold: 0.7,
                }) || ITimg.matchFeatures("基建_制造站", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.7,
                }));


                if (!this.where_interface) {
                    this.identify_frequency--;
                    if (!this.identify_frequency) {
                        let tips = "无法匹配到 基建_制造站.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是基建主界面";
                        toast(tips);
                        console.error(tips);
                        return false;
                    }

                }

                this.in_manufacturing = (ITimg.matchFeatures("制造站_制造中", {
                    action: 0,
                    timing: 1000,
                    area: "左下半屏",
                }) || ITimg.matchFeatures("制造站_制造中", {
                    action: 0,
                    timing: 1000,
                    area: "左下半屏",
                    threshold: 0.75,
                }));

                if (this.in_manufacturing) {
                    break;
                } else {
                    if (!this.identify_frequency) {
                        let tips = "无法匹配到 制造站_制造中.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是制造站界面";
                        toast(tips);
                        console.error(tips);
                        sleep(500);
                        ITimg.matchFeatures("返回", {
                            action: 4,
                            timing: 1200,
                            area: "上半屏",
                        });
                        return false;
                    };
                }

            }




            ITimg.matchFeatures("无人机_加速", {
                action: 0,
                area: 4,
                timing: 2000,
            });
            ITimg.matchFeatures("无人机_最多", {
                action: 0,
                area: 24,
                timing: 1000,
            });
            if (!ITimg.matchFeatures("无人机_确定", {
                    action: 0,
                    area: 24,
                    timing: 3000,
                    refresh:false,
                })) {
                ITimg.matchFeatures("无人机_确定", {
                    action: 0,
                    area: 4,
                    matcher:2,
                    timing: 3000,
                    threshold: 0.75,
                })
            }
            ITimg.matchFeatures("无人机_收取", {
                action: 0,
                area: 4,
                timing: 2000,
            });
            ITimg.matchFeatures("返回", {
                action: 4,
                timing: 1500,
                area: 1,
            });

            ITimg.matchFeatures("返回", {
                action: 4,
                timing: 2000,
                area: 1,
                refresh:false,
            });
            //防止偶然点击返回方舟无反应的情况
            if (ITimg.matchFeatures("制造站_制造中", {
                    action: 5,
                    area: "左下半屏",
                })) {
                ITimg.matchFeatures("返回", {
                    action: 4,
                    timing: 2000,
                    area: 1,
                });
            }


        } else {
            console.info("查询贸易站");
            //进入贸易站
            while (this.identify_frequency) {

                if (ITimg.matchFeatures("基建_贸易站", {
                        action: 0,
                        timing: 1500,
                        nods: 500,
                        area: "左半屏",
                    }) || ITimg.matchFeatures("基建_贸易站", {
                        action: 0,
                        timing: 1500,
                        threshold: 0.75,
                        log_policy: true,
                        area: "下半屏",
                    }) || ITimg.matchFeatures("基建_贸易站", {
                        action: 0,
                        timing: 1500,
                        threshold: 0.70,
                        area: "上半屏",
                        log_policy: true,
                    })) {
                    break
                } else {
                    if (this.identify_frequency == 1) {
                        let tips = "无法匹配到 基建_贸易站.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是基建主界面";
                        toastLog(tips);
                        console.error(tips);
                        return false;
                    }
                    this.identify_frequency--;
                }
            }
            //确认进入贸易站
            (ITimg.matchFeatures("基建_贸易站", {
                action: 0,
                timing: 1500,
                nods: 500,
                area: "左半屏",
            }) || ITimg.matchFeatures("基建_贸易站", {
                action: 0,
                timing: 1500,
                area: "左半屏",
                threshold: 0.75,
                log_policy: true,
            }));

            //开始执行贸易站无人机加速
            this.where_interface = (ITimg.matchFeatures("贸易站_获取中", {
                action: 0,
                timing: 1000,
                area: "下半屏",
            }) || ITimg.matchFeatures("贸易站_获取中", {
                action: 0,
                timing: 1000,
                area: "下半屏",
                threshold: 0.75,
            }));
            if (!this.where_interface) {
                let tips = "无法匹配到 贸易站_获取中.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是贸易站界面";
                toastLog(tips);
                console.error(tips);
                sleep(500);
                ITimg.matchFeatures("返回", {
                    action: 4,
                    timing: 1200,
                    area: "上半屏",
                });
                return false;
            }
            this.drone_assistance = 3;
            while (this.drone_assistance) {
                if (!ITimg.matchFeatures("无人机_协助", {
                        action: 0,
                        timing: 1000,
                        nods: 1000,
                        area: 3,
                    }) && !ITimg.matchFeatures("无人机_协助", {
                        action: 0,
                        timing: 1000,
                        area: 4,
                        log_policy: true,
                    }) && (this.drone_assistance == 3)) {
                    if ((ITimg.matchFeatures("贸易站_获取中", {
                            action: 0,
                            timing: 1000,
                            area: "下半屏",
                        }) || ITimg.matchFeatures("贸易站_获取中", {
                            action: 0,
                            timing: 1000,
                            area: "下半屏",
                            threshold: 0.75,
                        }))) {
                        (ITimg.matchFeatures("无人机_协助", {
                            action: 0,
                            timing: 1000,
                            nods: 1000,
                            area: 3,
                        }) || ITimg.matchFeatures("无人机_协助", {
                            action: 0,
                            timing: 1000,
                            area: 4,
                            log_policy: true,
                        }));
                    }
                }
                ITimg.matchFeatures("无人机_最多", {
                    action: 0,
                    timing: 200,
                    area: 24,
                });
                if (drone_assistance == 1) {
                    ITimg.matchFeatures("无人机_减少", {
                        action: 0,
                        timing: 2000,
                    });
                }
                (ITimg.matchFeatures("无人机_确定", {
                    action: 0,
                    timing: 2000,
                    area: 4,
                }) || ITimg.matchFeatures("无人机_确定", {
                    action: 0,
                    timing: 2000,
                    area: 4,
                    threshold: 0.75,
                }))

                drone_assistance--;
            }
            //返回基建主页面
            ITimg.matchFeatures("返回", {
                action: 4,
                timing: 1500,
                area: 1,
            });
            ITimg.matchFeatures("返回", {
                action: 4,
                timing: 2000,
                area: 1,
                refresh:false,
            });

            if (ITimg.matchFeatures("贸易站_获取中", {
                    action: 5,
                    area: "下半屏",
                })) {
                ITimg.matchFeatures("返回", {
                    action: 4,
                    timing: 2000,
                    area: 1,
                });
            }
            if (ITimg.matchFeatures("基建_蓝色铃铛", {
                    action: 0,
                    timing: 1500,
                    area: 2,
                }) || ITimg.matchFeatures("基建_蓝色铃铛", {
                    action: 0,
                    timing: 1500,
                    area: 2,
                    threshold: 0.75,
                })) {
                ITimg.matchFeatures("基建_订单交付", {
                    action: 0,
                    timing: 2000,
                    area: "下半屏",
                });
            }

        }
        sleep(100);

    },

    会客室线索处理: function() {
        if (!setting.会客室线索) {
            sleep(200);
            log("会客室线索" + setting.会客室线索);
            return false;
        }
        tool.Floaty_emit("展示文本", "状态", "状态：准备线索处理中");
        ITimg.matchFeatures("基建_蓝色铃铛", {
            action: 0,
            timing: 1500,
            area: 2,
        });
        ITimg.matchFeatures("基建_铃铛", {
            action: 0,
            timing: 2000,
            area: 2,
        });

        let temporary_xy = ITimg.matchFeatures("基建_线索", {
            action: 5,
            timing: 1500,
            area: 2,
        }) || ITimg.matchFeatures("基建_会客室", {
            action: 5,
            timing: 1500,
            area: 2,
            threshold: 0.9,
        }) || ITimg.matchFeatures("基建_线索", {
            action: 5,
            timing: 1500,
            area: 2,
            resolution: true,
            log_policy: true,
            threshold: 0.70,
        })
        if (temporary_xy) {
            temporary_xy = [temporary_xy.left + temporary_xy.w / 2, temporary_xy.bottom]
            MyAutomator.click.apply(MyAutomator, temporary_xy);
            sleep(200);
            MyAutomator.click.apply(MyAutomator, temporary_xy);
            sleep(200);
            MyAutomator.click.apply(MyAutomator, temporary_xy);

        } else {
            toastLog("没有匹配到 基建_线索.png 尝试放大基建主页面重新进行匹配");
            this.放大基建界面();
            sleep(50);
            //划出会客室位置界面
            swipe(Math.floor(height / 1.2), Math.floor(width / 6), Math.floor(height / 2.5), Math.floor(width / 1.2), 500);
            sleep(500);
            if (!ITimg.matchFeatures("基建_线索", {
                    action: 0,
                    timing: 1500,
                    log_policy: true,
                    area: "右上半屏",
                }) && !ITimg.matchFeatures("基建_会客室", {
                    action: 0,
                    timing: 1500,
                    area: 2,
                    threshold: 0.9,
                }) && !ITimg.matchFeatures("基建_线索", {
                    action: 0,
                    timing: 1500,
                    area: "右上半屏",
                    resolution: true,
                    threshold: 0.70,
                })) {
                toastLog("没有匹配到基建_线索.png, 可能会客室没有新线索待处理");
                sleep(500)
                return false;
            }
        }

        //拥有新线索

        tool.Floaty_emit("展示文本", "状态", "状态：执行会客室线索中");
        tool.Floaty_emit("面板", "隐藏");
        //检验是否溢出线索
        if (setting.处理线索溢出 && ITimg.initocr()) {

            if (ITimg.ocr("8/10", {
                    action: 5,
                    part: true,
                    area: 3,
                    threshold: 0.95,
                    saveSmallImg: "会客室_线索8-10",
                }) || ITimg.ocr("9/10", {
                    action: 5,
                    refresh: false,
                    part: true,
                    log_policy: true,
                    area: 3,
                    threshold: 0.95,
                    saveSmallImg: "会客室_线索9-10",
                }) || ITimg.ocr("10/10", {
                    action: 5,
                    refresh: false,
                    similar: 0.95,
                    log_policy: "简短",
                    area: 3,
                    threshold: 0.95,
                    saveSmallImg: "会客室_线索10-10",
                })) {
                setting.处理线索溢出 = "线索待处理"
            }
        }
        //进入线索界面
        if (!ITimg.matchFeatures("线索_会客室", {
                action: 0,
                timing: 2000,
                area: 3,
            }) && !ITimg.matchFeatures("线索_会客室", {
                action: 0,
                timing: 2000,
                area: 3,
                threshold: 0.75,
                matcher: 2,
                refresh: false,
            })) {

            toastLog("没有匹配到 线索_会客室.png , 无法处理线索! ");
            sleep(500);
            (ITimg.matchFeatures("返回", {
                action: 4,
                timing: 1500,
                nods: 500,
                area: 1,
            }) || ITimg.matchFeatures("返回", {
                action: 4,
                timing: 1500,
                area: 1,
                threshold: 0.75,
            }));
            return false;
        }

        ITimg.matchFeatures("线索_会客室", {
            action: 0,
            timing: 2000,
            area: 3,
        }) || ITimg.matchFeatures("线索_会客室", {
            action: 0,
            timing: 2000,
            area: 3,
            threshold: 0.75,
            matcher: 2,
            refresh: false,
        })
        sleep(2000);
        if (ITimg.matchFeatures("线索_交流", {
                timing: 3000,
                area: 1,
            }) || ITimg.matchFeatures("线索_交流", {
                action: 0,
                timing: 3000,
                area: 1,
                matcher: 2,
                threshold: 0.75,
                refresh: false,
            })) {
            if (!ITimg.matchFeatures("返回", {
                    action: 4,
                    timing: 1500,
                    nods: 500,
                    area: 1,
                }) && !ITimg.matchFeatures("返回", {
                    action: 4,
                    timing: 1500,
                    area: 1,
                    threshold: 0.75,
                    refresh: false,
                })) {
                toastLog("找不到返回键");
            }
        }
        //处理即将溢出线索
        if (setting.处理线索溢出 == "线索待处理") {

            if (ITimg.matchFeatures("线索_传递", {
                    action: 0,
                    timing: 3000,
                    nods: 1000,
                    area: "右半屏",
                }) || ITimg.matchFeatures("线索_传递", {
                    action: 0,
                    timing: 3000,
                    area: "右半屏",
                    threshold: 0.75,
                    refresh: false,
                })) {
                sleep(1000)
                //将线索集合
                let xsmc = ["莱茵生命", "企鹅物流", "黑钢", "乌萨斯学生自治团", "格拉斯哥帮", "喀兰贸易", "罗德岛制药"]
                let xsjh = []

                taglb = ITimg.ocr("获取屏幕文字", {
                    action: 6,
                    area: "左半屏",
                    correction_path: "信用",
                })
                console.info(taglb)

                swipe(250, width - 100, 250, 200, 300);
                for (i in taglb) {
                    if (xsmc.indexOf(taglb[i].text) != -1) {
                        xsjh.push(taglb[i].text)
                    }
                }

                sleep(200)
                taglb = ITimg.ocr("获取屏幕文字", {
                    action: 6,
                    area: "左半屏",
                    correction_path: "信用",
                })
                console.info(taglb)
                for (i in taglb) {
                    if (xsmc.indexOf(taglb[i].text) != -1) {
                        xsjh.push(taglb[i].text)
                    }
                }
                log(xsjh)
                let cdcs = 0;
                //送出重复线索
                xsjh.map((val, index) => {
                    if (xsjh.indexOf(val) != xsjh.lastIndexOf(val)) {
                        if (this.传递线索(val)) {
                            cdcs++;
                            xsjh.splice(index, 1)
                        }

                    }
                })

                //送出不重复
                for (i in xsjh) {
                    if (cdcs < 2) {
                        if (this.传递线索(xsjh[i])) {
                            cdcs++;
                        }
                    }
                }
                sleep(500)
                MyAutomator.click(height - 72, 50)
                MyAutomator.click(height - 72 * 2, 50)
                MyAutomator.click(height - 72 * 3, 50)
                MyAutomator.click(height - 72 * 4, 50)

                if (ITimg.ocr("传递奖励", {
                        action: 5,
                        part: true,
                        area: 24,
                        correction_path: "信用",
                    }) || ITimg.ocr("20", {
                        action: 5,
                        part: true,
                        similar: 1,
                        area: 24,
                        saveSmallImg: "传递奖励_20",
                        correction_path: "信用",
                    })) {
                    sleep(500)
                    MyAutomator.click(height - 72, 50)
                    MyAutomator.click(height - 72 * 2, 50)
                    MyAutomator.click(height - 72 * 3, 50)
                    MyAutomator.click(height - 72 * 4, 50)
                }
            } else {
                let tips = "无法匹配到 线索_传递.png 小图，请确认图库是否匹配设备分辨率,或当前界面是否是会客室界面";
                toastLog(tips);
                console.error(tips);
            }



        }

        for (let i = 1; i <= 2; i++) {
            //同样的设置，读取的本地图片能匹配到小小图，截屏函数的不行...

            //收取线索
            temporary_xy = ITimg.matchFeatures("线索_NEW", {
                action: 5,
                nods: 500,
                scale: 1,
                area: [height - height / 4, 0, height / 4, width / 4],
                matcher: 1,
            })
            if (!temporary_xy) {
                temporary_xy = ITimg.matchFeatures("线索_NEW", {
                    action: 5,
                    scale: 1,
                    matcher: 1,
                    area: [height - height / 4, width / 4, height / 4, width / 4],

                })
            }
            if (!temporary_xy) {

                toastLog("没有新的可领取线索");
                sleep(500);
                /** 
                * 下个就是好友访问了,直接离开基建,不用返回基建主页
                (ITimg.matchFeatures("返回", {
                    action: 0,
                    timing: 1500,
                    nods: 500,
                    area: "左半屏",
                }) || ITimg.matchFeatures("返回", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.75,
                }));
                (ITimg.matchFeatures("返回", {
                    action: 0,
                    timing: 1500,
                    nods: 500,
                    area: "左半屏",
                }) || ITimg.matchFeatures("返回", {
                    action: 0,
                    timing: 1500,
                    area: "上半屏",
                    threshold: 0.75,
                }));
                */
                break
                //  return true;
            }

            //点击new可领取新的
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 15, temporary_xy.bottom);
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 25, temporary_xy.bottom);
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 40, temporary_xy.bottom);
            MyAutomator.click((temporary_xy.x + temporary_xy.w / 2) - 60, temporary_xy.bottom);

            sleep(1000);
            if (ITimg.matchFeatures("线索_全部收取", {
                    action: 0,
                    timing: 2000,
                    area: 4,
                })) {
                sleep(100);
                MyAutomator.click(height / 2 + random(-10, 10), 50 + random(-5, 5));
                sleep(500);
            } else {

                ITimg.matchFeatures("线索_领取", {
                    action: 0,
                    timing: 2000,
                    area: 4,
                    refresh: false,
                });
                ITimg.matchFeatures("关闭公告", {
                    action: 0,
                    timing: 1500,
                    area: 2,
                });

            }

        }

        sleep(400);
        click(height / 2, width - width / 4);
        sleep(800);
        //放入线索
        let _sceneImg = ITimg.captureScreen_();

        let _sceneFeatures = $images.detectAndComputeFeatures(_sceneImg);

        !_sceneImg.isRecycled() && _sceneImg.recycle()
        for (let i = 1; i <= 7; i++) {
            if (ITimg.matchFeatures("线索" + i.toString(), {
                    action: 0,
                    timing: 1000,
                    scale: 1,
                    matcher: 2,
                    imageFeatures: _sceneFeatures,
                }) || ITimg.matchFeatures("线索" + i.toString(), {
                    action: 0,
                    timing: 1000,
                    scale: 1,
                    matcher: 1,
                    imageFeatures: _sceneFeatures,
                })) {
                (ITimg.matchFeatures("线索_相关搜集者", {
                    action: 0,
                    timing: 3000,
                    nods: 500,
                    area: 4,
                }) || ITimg.matchFeatures("线索_相关搜集者", {
                    action: 0,
                    timing: 3000,
                    area: 2,
                }))

            }
        }
        _sceneFeatures.recycle();

        ITimg.matchFeatures("线索_解锁", {
            action: 0,
            timing: 2000,
            area: "下半屏",
        })

        /** 
         * 下个就是好友访问了,直接离开基建,不用返回基建主页
                sleep(500);
                (ITimg.matchFeatures("返回", {
                    action: 0,
                    timing: 2000,
                    nods: 1500,
                    area: "左半屏",
                }) || ITimg.matchFeatures("返回", {
                    action: 0,
                    timing: 2000,
                    area: "左半屏",
                }));
                ///还在会客室时再点下返回
                if(ITimg.matchFeatures("线索_会客室", {
                    action: 0,
                    timing: 2000,
                    area: "下半屏",
                }) || ITimg.matchFeatures("线索_会客室", {
                    action: 0,
                    timing: 2000,
                    area: "左半屏",
                })){
                    (ITimg.matchFeatures("返回", {
                        action: 0,
                        timing: 2000,
                        nods: 1500,
                        area: "左半屏",
                    }) || ITimg.matchFeatures("返回", {
                        action: 0,
                        timing: 2000,
                        area: "左半屏",
                    }));
                }
                */
        return true;

    },

    传递线索: function(xs) {
        swipe(250, 200, 250, width - 100, 500);
        sleep(500)

        if (!ITimg.ocr(xs, {
                action: 0,
                area: "左半屏",
                correction_path: "信用",
            })) {
            swipe(250, width - 100, 250, 200, 500);
            sleep(500)

            if (!ITimg.ocr(xs, {
                    action: 0,
                    area: "左半屏",
                    correction_path: "信用",
                })) {
                return false
            }
        }
        sleep(500)
        let img = ITimg.captureScreen_()
        let point = findColor(img, "#ff6800", {
            region: [Math.floor(height / 1.6), 0, Math.floor(height / 4.8), width],
            threads: 6
        });
        try {
            img.recycle();
        } catch (e) {};
        console.info(point)
        if (point) {
            MyAutomator.click(Math.floor((height / 2340) * 2000), point.y)
            Combat_report.record("传递线索：" + xs, undefined, "info")

            sleep(500)
            return true
        }
        return false
    },
    放大基建界面: function() {
        //0秒后执行,持续500毫秒
        let left_gesture = [0, 500]
        let right_gesture = [0, 500]

        for (let i = 0; i < 10; i++) {
            let axis_x = height / 2 - i * 50;
            let axis_y = width / 2;
            //在最后一步向上滑动,防止手势带来的惯性
            if (i == 9) {
                axis_x = height / 2 - (i - 1) * 50;
                axis_y = width / 2 - 50;
            }
            left_gesture.push([axis_x, axis_y])
        }
        for (let i = 0; i < 10; i++) {
            let axis_x = height / 2 + i * 50;
            let axis_y = width / 2;
            if (i == 9) {
                axis_x = height / 2 + (i - 1) * 50;
                axis_y = width / 2 - 50;
            }
            right_gesture.push([axis_x, axis_y]);
        }
        let gesturesAry_ = [
            [left_gesture, right_gesture]
        ];

        for (let i = 0; i < gesturesAry_.length; i++) {
            gestures.apply(null, gesturesAry_[i]);
            sleep(400);
        };
    },
    确认已进入基建页面: function() {
        while (true) {
            sleep(100)
            ITimg.matchFeatures("基建", {
                action: 0,
                timing: 3000,
                area: 4,
            })
            sleep(100);
            if (ITimg.matchFeatures("返回", {
                    action: 5,
                    timing: 1500,
                    area: "左上半屏",
                }) || ITimg.matchFeatures("基建_铃铛", {
                    action: 5,
                    timing: 1500,
                    area: "右上半屏",
                })) {
                sleep(200)
                break;
            } else {
                if (ITimg.matchFeatures("导航", {
                        action: 0,
                        timing: 1500,
                        area: 1,
                    }) || ITimg.matchFeatures("导航2", {
                        action: 0,
                        timing: 1500,
                        area: 1,
                        refresh: false,
                    })) {
                    if (ITimg.matchFeatures("导航_基建", {
                            action: 0,
                            timing: 3000,
                            area: "上半屏",
                        })) {
                        break;
                    }
                }
            }

        }
        return true;
    },
    访问好友: function() {
        setting = tool.readJSON("configure");
        let Day = new Date().getMonth(); //月
        let Dat = new Date().getDate(); //日
        Day = Day + 1;
        if (Day + "." + Dat != setting.当天) {
            if (new Date().getHours() >= 4) {
                tool.writeJSON("当天", Day + "." + Dat);
                setting.好友 = 0;
                tool.writeJSON("好友", 0);
            }
        }
        if (!setting.好友访问 || setting.好友 >= 10) {
            if (setting.好友 >= 10) {
                toastLog("今日访问好友已上限");
            } else {
                log("好友访问" + setting.好友访问);
            }

            return false
        }
        if (Day + "." + Dat != setting.当天) {
            if (new Date().getHours() >= 4) {
                tool.writeJSON("当天", Day + "." + Dat);
                tool.writeJSON("好友", 0);
            }
        }
        Day = null;
        Dat = null;
        tool.Floaty_emit("展示文本", "状态", "状态：执行访问好友中");
        tool.Floaty_emit("面板", "隐藏");
        (ITimg.matchFeatures("导航", {
            action: 0,
            timing: 1000,
            area: 1,
        }) || ITimg.matchFeatures("导航2", {
            action: 0,
            timing: 1000,
            area: 1,
            refresh: false,
        }))
        sleep(200);
        temporary_xy = (ITimg.matchFeatures("导航_任务", {
            action: 5,
            nods: 2000,
            area: 2,
        }) || ITimg.matchFeatures("导航_任务", {
            action: 5,
            area: 2,
            refresh: false,
            matcher: 2,
        }))
        if (!temporary_xy) {
            toast("没有找到导航_任务，无法执行好友访问");
            console.error("没有找到导航_任务，无法执行好友访问");
            return false;
        }
        log("点击 导航_任务转导航_好友, x:" + (temporary_xy.x + temporary_xy.w) + "y:" + temporary_xy.y)
        sleep(10);
        MyAutomator.click((temporary_xy.x + temporary_xy.w) + 100, temporary_xy.y);
        sleep(100)
        MyAutomator.click((temporary_xy.x + temporary_xy.w) + 50, temporary_xy.y);
        sleep(100)
        MyAutomator.click(temporary_xy.x + temporary_xy.w, temporary_xy.y);
        sleep(600);
        (ITimg.matchFeatures("基建_离开", {
            action: 0,
            timing: 6000,
            nods: 500,
            area: 4,
        }) || ITimg.matchFeatures("基建_离开", {
            action: 0,
            timing: 6000,
            area: 4,
        }))


        this.identify_frequency = 10;
        while (this.identify_frequency) {
            if (!ITimg.matchFeatures("好友列表", {
                    action: 0,
                    timing: 1000,
                    area: "上半屏",
                    nods: 1000,
                })) {
                if (this.identify_frequency == 1) {
                    let tips = "长时间无法匹配到 好友访问.png 小图，请确认图库是否匹配设备分辨率, 或当前界面是否好友界面";
                    toast(tips);
                    console.error(tips);
                    return false;
                }
                this.identify_frequency--;
            } else {
                break;
            }
        }

        sleep(200);

        if (!ITimg.matchFeatures("访问基建", {
                action: 0,
                timing: 8000,
                matcher: 2,
                nods: 200,
                area: 4,
            }) && !ITimg.matchFeatures("访问基建", {
                action: 0,
                area: 4,
                timing: 8000,
                scale: 1,
                refresh: false,
            })) {
            function obtain_access_infrastructure() {
                let button_list = ITimg.contour({
                    canvas: "访问基建",
                    action: 5,
                    area: 4,
                    isdilate: true,
                    threshold: 240,
                    size: 15,
                    type: "BINARY",
                    filter_w: zox(30),
                    filter_h: zoy(30),
                });
                if (button_list && button_list.length) {
                    let access_infrastructure;
                    // console.info(button_list)
                    for (let asie of button_list) {
                        if (!access_infrastructure || access_infrastructure.y < asie.y) {
                            access_infrastructure = asie;
                        }

                    }
                    if (access_infrastructure) {
                        log(access_infrastructure)
                        return [access_infrastructure.x, access_infrastructure.y];
                    }
                    return false;
                }
                return false;
            }
            let asie_ = obtain_access_infrastructure();

            if (asie_) {
                MyAutomator.click.apply(MyAutomator, asie_);
                sleep(8000);
            } else {
                toast("没有找到访问基建，无法执行好友访问");
                console.error("没有找到访问基建，无法执行好友访问");
                return false;
            }
        }
        tool.Floaty_emit("面板", "展开");
        if (!setting.好友限制) {
            setting.好友 = 0;
        }
        while (true) {
            if (setting.好友 >= 10) {
                Combat_report.record("今日累计访问" + setting.好友 + "个好友");
                toastLog("已访问十次，达到上限，退出访问");
                break;
            }


            let visit = ITimg.matchFeatures("访问下位", {
                action: 5,
                nods: 1000,
                area: 4,
            })
            if (visit) {
                if (!ITimg.matchFeatures("好友_重复访问", {
                        action: 5,
                        area: 2,
                        threshold: 0.85,
                        scale: 1,
                    })) {
                    visit = [visit.x + (visit.w / 2), visit.y + (visit.h / 2)];
                    MyAutomator.click.apply(MyAutomator, visit);
                    sleep(2000);
                    setting.好友 = setting.好友 + 1;
                    tool.writeJSON("好友", setting.好友);
                } else {
                    toastLog("今日访问" + setting.好友 + "个好友,没有待访问，退出");

                    break
                }
                sleep(1000);
            }

            tool.Floaty_emit("展示文本", "理智", "恢复" + setting.已兑理智 + "次理智，访问" + setting.好友 + "个好友");
        } //循环
        Combat_report.record("今日累计访问" + setting.好友 + "个好友");

        return true;

    },
}

module.exports = 基建任务;