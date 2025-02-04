let agent = 0;
let 关卡代理 = {
    普通: function() {
        sleep(1500);

        //  threadMain.setName("行动作战");
        try {

            tool.Floaty_emit("展示文本", "状态", "状态：等待手动选定关卡");
            统计("次数", "显示材料");

        } catch (e) {
            toast(e)
            console.error(e);
            threads.shutDownAll();
            exit();
        }
        setInterval(() => {
            device.keepScreenDim(240 * 1000);
            setting = tool.readJSON("configure");
            if (setting.设置电量) {
                if (!device.isCharging() && device.getBattery() < setting.电量) {
                    sleep(500);
                    toast("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                    Combat_report.record("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                    console.error("电量低于设定值" + setting.电量 + "且未充电,主程序已退出并返回桌面");

                    跳转_暂停(true, "电量低于设定值且未充电", "暂停，电量低且未充电");
                    home();
                    sleep(5000);
                }
            }

            while (true) {
                if (Material_await == "等待") {
                    tool.Floaty_emit("状态", "即将达成目标，等待统计");
                } else {
                    break;
                }
                sleep(500);
            }
            while (true) {
                setting = tool.readJSON("configure");
                // aa = files.read("./mrfz/行动.txt");
                if (setting.已执行动 >= setting.行动) {

                    toast("行动完毕，退出行动程序\n注：已执行动 >= 上限时不会执行基建收菜");
                    console.warn("行动完毕，退出行动程序，注：已执行动 >= 上限时不会执行基建收菜");
                    跳转_暂停(true, "行动刷图上限结束后", "暂停，行动已完成");
                    setting = null;
                    break;
                    //   }
                }
                if (ITimg.matchFeatures("行动_编队确认开始", {
                        action: 5,
                        timing: 1000,
                        area: 4,
                    })) {
                    console.verbose("结束自动代理环节")
                    break
                }
                if (setting.已执行动 == 0) {
                    //有开始行动界面才能判断
                    if (this.检验已选中关卡(5, true)) {


                        tool.Floaty_emit("展示文本", "状态", "状态：正在代理中");
                        if (this.检验已选中关卡(0, false)) {
                            toastLog("代理点击成功!");
                            break;
                        }



                    } else {
                        toast("请打开已勾选可代理的关卡");
                        sleep(3000);
                        if (setting.防沉迷) {
                            if (ITimg.matchFeatures("防沉迷_确认", {
                                    action: 0,
                                    timing: 1500,
                                    area: "右半屏",
                                })) {
                                tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                                tool.Floaty_emit("暂停", "结束程序");
                            }
                        }
                    }
                } else {
                    tool.Floaty_emit("展示文本", "状态", "状态：正在代理中");
                    if (this.检验已选中关卡(0, false)) {
                        toastLog("代理点击成功2!");
                        break;
                    }
                }
            } //单次循环
            sleep(1500);
            while (true) {
                if (ITimg.matchFeatures("行动_编队确认开始", {
                        action: 0,
                        timing: 2000,
                        area: 4,
                    })) {
                    setting.已执行动++;
                    setting = tool.writeJSON("已执行动", setting.已执行动);
                    tool.Floaty_emit("展示文本", "状态", "状态：正在行动中");
                    if (agent != 0) {
                        tool.Floaty_emit("展示文本", "行动", "行动：执行" + setting.已执行动 + "次&代理失误" + agent + "次")
                    } else {
                        统计("行动");

                    }

                    sleep(1000)
                    if (!ITimg.matchFeatures("行动_编队确认开始", {
                            action: 0,
                            timing: 2000,
                            area: 4,
                        })) {
                        console.verbose("结束开始行动环节")
                        break;
                    }

                    sleep(3000)
                    ITimg.matchFeatures("行动_编队确认开始", {
                        action: 0,
                        timing: 2000,
                        area: 4,
                    });
                    console.verbose("结束开始行动环节")
                    break;

                } else {
                    if (!this.理智处理()) {
                        跳转_暂停(false, "行动刷图且没有理智结束后", "暂停，木有理智");
                    }

                    sleep(500);
                    if (this.检验已选中关卡(0, false)) {
                        toastLog("代理点击成功_?");
                    }
                    sleep(200);
                    if (setting.防沉迷) {
                        if (ITimg.matchFeatures("防沉迷_确认", {
                                action: 0,
                                timing: 1500,
                                area: "右半屏",
                            })) {
                            tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                            tool.Floaty_emit("暂停", "结束程序");
                        }
                    }
                } //无红行动
                sleep(200)
            } //单次循环


            if (setting.企鹅统计 && setting.指定材料) {
                Material_data = tool.readJSON("material_await_obtain");
                try {
                    if (Material_data.name.length == 0) {
                        Material_data = undefined
                    }
                } catch (err) {
                    Material_data = undefined
                }
                if (Material_data) {
                    for (let i = 0; i < Material_data.name.length; i++) {
                        if ((Material_data.number[i] - Material_data.done[i]) == 1) {
                            Material_await = "等待";
                            break;
                        }
                        if ((Material_data.number[i] - Material_data.done[i]) < 1) {
                            Material_data = undefined;
                            break
                        }
                    }


                }
            }
            sleep(3000);
            tool.Floaty_emit("展示文本", "状态", "状态：正在行动中");
            sleep(35000);
            console.verbose("开始查询结算页面")
            while (true) {
                //结算
                setting = tool.readJSON("configure");
                sleep(100)
                temporary_xy = ITimg.matchFeatures( "代理_继续结算", {
                    action: 5,
                    timing: 500,
                    area: 4,
                    threshold: 0.85,
                })
                if (temporary_xy) {
                    toast("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                    console.warn("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                    agent++;
                    let abandonXY = [temporary_xy.x,temporary_xy.y];
                    if (setting.agent) {
                        abandonXY[0] = temporary_xy.x - (temporary_xy.h *4)
                        for (let i = 0; i < 10; i++) {
                            MyAutomator.click.apply(MyAutomator,abandonXY);
                            sleep(200);
                        }
                        break
                    } else {
                        MyAutomator.click.apply(MyAutomator,abandonXY);
                    }

                }
                if (ITimg.matchFeatures("基建_离开", {
                        action: 1,
                        timing: 500,
                        area: 4,
                    })) {
                    toastLog("网络不佳,重新提交战斗记录")
                }
                sleep(500);

                if (ITimg.matchFeatures("行动_结算", {
                        timing: 500,
                        area: 1,
                        visualization: true,
                    }) || ITimg.matchFeatures("行动_结算", {
                        timing: 500,
                        area: 13,
                        threshold: 0.75,
                        visualization: true,
                    })) {
                    while (true) {
                        tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                        if (ITimg.matchFeatures("等级_提升", {
                                action: 0,
                                timing: 1000,
                                area: "右半屏",
                                visualization: true,
                            })) {
                            tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                            toast("等级提升了");
                            console.warn("等级提升了，理智已恢复");
                        }

                        if (setting.企鹅统计) {
                            sleep(300)
                            //click(parseInt(height -height*0.05), parseInt(width -height*0.05));
                            swipe(parseFloat(height / 8), parseFloat(width / 1.25), parseFloat(height / 3), parseFloat(width / 1.25), 600)
                            sleep(500)
                            //swipe(parseFloat(height / 4), parseFloat(width / 1.25), parseFloat(height / 2), parseFloat(width / 1.25), 600)

                            sleep(1500);
                            tool.Floaty_emit("面板", "位置", "统计");
                            sleep(500)
                            let img = ITimg.captureScreen_()
                            images.save(img, context.getExternalFilesDir(null).getAbsolutePath() + "be_identified.png");
                            sleep(100)
                            img.recycle();
                            tool.Floaty_emit("面板", "材料统计");

                        } else {
                            sleep(1000);
                            log("企鹅统计：" + setting.企鹅统计)
                        }



                        temporary_xy = ITimg.matchFeatures("行动_结算", {
                            action: 5,
                            timing: 500,
                            area: 1,
                            threshold: 0.75,
                            visualization: true,
                        })
                        if (temporary_xy) {
                            MyAutomator.click(temporary_xy.x, temporary_xy.y);
                            sleep(200);
                            MyAutomator.click(temporary_xy.x, temporary_xy.y);
                            sleep(200);
                            MyAutomator.click(temporary_xy.x, temporary_xy.y);
                            sleep(1500);
                            toast("已完成" + setting.已执行动 + "次行动");
                            console.info("已完成" + setting.已执行动 + "次行动")
                            break;
                        }

                    }
                    tool.Floaty_emit("展示文本", "状态", "状态：等待加载关卡");
                    while (true) {
                        sleep(500);
                        if (ITimg.matchFeatures("行动_理智数量图标", {
                                timing: 500,
                                area: 2,
                                threshold: 0.8,
                                picture_failed_further: true,
                            })||ITimg.matchFeatures("行动_理智数量图标", {
                                timing: 500,
                                area: 2,
                                matcher:2,
                                refresh:false,
                                threshold: 0.8,
                                picture_failed_further: true,
                            })) {
                            break;
                        }
                        (ITimg.matchFeatures("行动_结算", {
                            action: 0,
                            timing: 500,
                            area: 13,
                        }) || ITimg.matchFeatures("行动_结算", {
                            timing: 500,
                            area: 13,
                            threshold: 0.75,
                        }))
                    }
                    break

                };

                sleep(200);
                if (ITimg.matchFeatures("等级_提升", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                    toast("等级提升了");
                    Combat_report.record("等级提升了，理智已恢复");
                    console.warn("等级提升了，理智已恢复");
                }
                sleep(200);
                if (setting.防沉迷) {
                    if (ITimg.matchFeatures("防沉迷_确认", {
                            action: 0,
                            timing: 1500,
                            area: "右半屏",
                        })) {
                        tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                        tool.Floaty_emit("暂停", "结束程序");
                    }
                }
            } //单

            Combat_report.record("本次运行完成了" + setting.已执行动 + "次行动");


        }, 1000); //总循环
    },
    剿灭: function() {
        sleep(50);
        console.trace("剿灭")
        toastLog("1秒后启动剿灭程序，注意是稳定代理400的剿灭");
        threadMain.setName("剿灭作战");
        sleep(1000);
        tool.Floaty_emit("展示文本", "状态", "状态：等待手动选定剿灭关卡");
        tool.Floaty_emit("展示文本", "行动", "剿灭：执行" + setting.已执行动 + "次&上限" + setting.剿灭 + "次");
        tool.Floaty_emit("展示文本", "理智", "理智：已兑" + setting.已兑理智 + "次&上限" + setting.理智 + "次");
        setInterval(() => {
            device.keepScreenDim(1800 * 1000);
            setting = tool.readJSON("configure");
            if (setting.设置电量) {
                if (!device.isCharging() && device.getBattery() < setting.电量) {
                    sleep(500);
                    toast("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                    Combat_report.record("电量低于设定值" + setting.电量 + "且未充电，主程序已退出并返回桌面");
                    console.error("电量低于设定值" + setting.电量 + "且未充电,主程序已退出并返回桌面");

                    跳转_暂停(true, "电量低于设定值且未充电", "暂停，电量低且未充电");
                    home();
                }
            }

            while (setting.proxy_card) {
                setting = tool.readJSON("configure");
                if (setting.已执行动 >= setting.剿灭) {
                    toast("剿灭完毕，退出剿灭程序");
                    console.warn("剿灭完毕，退出剿灭程序");

                    跳转_暂停(false);
                    break;

                }
                (ITimg.matchFeatures("代理_全权委托", {
                    action: 0,
                    timing: 500,
                    area: 4,
                    threshold: 0.85,
                }) || ITimg.matchFeatures("代理_全权委托", {
                    action: 0,
                    timing: 500,
                    area: 4,
                    threshold: 0.85,
                }))
                if (ITimg.matchFeatures("行动_普通", {
                        action: 1,
                        timing: 500,
                        area: 4,
                        nods: 1000,
                    })) {

                    this.xy_ = (ITimg.matchFeatures("导航", {
                        action: 5,
                        area: 1,
                    }) || ITimg.matchFeatures("导航2", {
                        action: 5,
                        area: 1,
                        refresh: false,
                    }))
                    if (ITimg.matchFeatures("代理_全权委托_确认使用", {
                            action: 0,
                            timing: 1000,
                            area: 4,
                            threshold: 0.8,
                            visualization: true,
                        })) {
                        setting.已执行动++;
                        tool.writeJSON("已执行动", setting.已执行动);
                        tool.Floaty_emit("展示文本", "状态", "状态：正在剿灭中");
                        统计("行动", undefined, true)
                        if (this.xy_) {
                            while (true) {
                                MyAutomator.click(this.xy_.x, this.xy_.y);
                                sleep(1500);
                                if (ITimg.matchFeatures("行动_普通", {
                                        area: 4,

                                    })) {
                                    break;
                                }
                            }
                        };

                    }
                } else {
                    ITimg.matchFeatures("代理_全权委托", {
                        action: 0,
                        timing: 1000,
                        area: 4,
                    });
                    if (!ITimg.matchFeatures("代理_全权委托_确认", {
                            timing: 1000,
                            area: 4,
                        }) && !ITimg.matchFeatures("代理_全权委托_确认", {
                            timing: 1000,
                            area: 4,
                            threshold: 0.7,
                        })) {
                        toastLog("似乎没有代理卡可使用...")
                        setting.proxy_card = false;
                    }
                }
                continue;
            }
            while (true) {
                //aa = files.read("./mrfz/行动.txt");
                setting = tool.readJSON("configure");
                if (setting.已执行动 >= setting.剿灭) {
                    toast("剿灭完毕，退出剿灭程序");
                    console.warn("剿灭完毕，退出剿灭程序");

                    跳转_暂停(false);
                    break;

                };

                sleep(1100);
                //有开始行动界面才能判断
                if (ITimg.matchFeatures("行动_普通", {
                        timing: 1000,
                        area: "右半屏",
                    })) {
                    if (ITimg.matchFeatures("代理_勾", {
                            timing: 1000,
                            area: "右半屏",
                        })) {
                        tool.Floaty_emit("展示文本", "状态", "状态：正在代理中");
                        if (ITimg.matchFeatures("行动_普通", {
                                action: 0,
                                timing: 1500,
                                area: "右半屏",
                            })) {
                            toastLog("代理点击成功!");
                            break;
                        };
                    };

                    if (ITimg.matchFeatures("代理_未勾", {
                            action: 0,
                            timing: 1000,
                            area: "右半屏",
                        })) { //有开始行动界面才能判断
                        toast("自动勾选代理指挥");
                    } else {
                        toast("当前关卡未解锁代理指挥，请选择已勾选可代理的关卡");
                        sleep(2000);
                    };

                } else {
                    sleep(2000);
                    toast("请选择某剿灭关卡!")
                    if (setting.防沉迷) {
                        if (ITimg.matchFeatures("防沉迷_确认", {
                                action: 0,
                                timing: 1500,
                            })) {
                            tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                            tool.Floaty_emit("暂停", "结束程序");
                        }
                    }
                };
            } //单次循环

            while (true) {
                setting = tool.readJSON("configure");
                sleep(800);
                if (ITimg.matchFeatures("行动_编队确认开始", {
                        action: 0,
                        timing: 2000,
                        area: "右半屏",
                    })) {
                    setting.已执行动++;
                    tool.writeJSON("已执行动", setting.已执行动);
                    tool.Floaty_emit("展示文本", "状态", "状态：正在剿灭中");
                    if (agent != 0) {
                        tool.Floaty_emit("展示文本", "行动", "剿灭：执行" + setting.已执行动 + "次&代理失误" + agent + "次")
                    } else {
                        统计("行动", undefined, true)
                    }
                    sleep(1000);
                    if (!ITimg.matchFeatures("行动_编队确认开始", {
                            action: 0,
                            timing: 2000,
                            area: "右半屏",
                        })) {
                        break;
                    }
                } else {
                    if (!this.理智处理()) {
                        跳转_暂停(setting.woie, "剿灭刷图且没有理智结束后", "暂停，木有理智");
                    }
                    sleep(500);
                    if (ITimg.matchFeatures("行动_普通", {
                            action: 0,
                            timing: 1000,
                            area: "右半屏",
                        })) {
                        toastLog("兑换理智后再次代理点击成功!");
                    };
                    sleep(500);
                    if (setting.防沉迷) {
                        if (ITimg.matchFeatures("防沉迷_确认", {
                                action: 0,
                                timing: 1500,
                                area: "右半屏",
                            })) {
                            tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                            tool.Floaty_emit("暂停", "结束程序");
                        };
                    }
                }; //无红行动

            }; //单次循环
            log("预定10分钟后判断结算页面")
            sleep(4 * 60000);
            if (!ITimg.matchFeatures("剿灭_简报1", {
                    timing: 1000,
                    area: "左半屏",
                })) {
                sleep(3 * 60000);
            }
            if (!ITimg.matchFeatures("剿灭_简报1", {
                    timing: 1000,
                    area: "左半屏",
                })) {
                sleep(3 * 60000)
            }
            tool.Floaty_emit("面板", "隐藏");
            while (true) { //结算
                setting = tool.readJSON("configure");
                tool.Floaty_emit("面板", "位置", "300,280");
                sleep(100)
                if (temporary_xy = ITimg.matchFeatures((setting.agent ? "代理_放弃行动" : "代理_继续结算"), {
                        action: 5,
                        timing: 500,
                    })) {
                    toast("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                    console.warn("代理失误，" + (setting.agent ? "放弃行动，重新代理" : "继续结算，二星评价"))
                    agent++;
                    if (setting.agent) {
                        for (let i = 0; i < 10; i++) {
                            MyAutomator.click(temporary_xy.x + random(-15, 15), temporary_xy.y + random(-10, 10))
                            sleep(200)
                        }
                        break
                    } else {
                        MyAutomator.click(temporary_xy.x + random(-15, 15), temporary_xy.y + random(-10, 10))
                    }

                }
                if (ITimg.matchFeatures("基建_离开", {
                        action: 1,
                        timing: 500,
                        area: "下半屏",
                    })) {
                    toastLog("网络不佳,重新提交战斗记录")
                };
                sleep(500);
                if (ITimg.matchFeatures("剿灭_简报", {
                        timing: 1000,
                        area: "左半屏",
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                    ITimg.matchFeatures("剿灭_简报", {
                        action: 0,
                        timing: 1000,
                        area: "左半屏",
                    })
                };
                if (ITimg.matchFeatures("剿灭_简报1", {
                        timing: 1000,
                        area: "左半屏",
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                    ITimg.matchFeatures("剿灭_简报1", {
                        action: 0,
                        timing: 1000,
                        area: "左半屏",
                    })
                };
                sleep(500);
                if (ITimg.matchFeatures("剿灭_报酬", {
                        action: 0,
                        timing: 3000,
                        area: "左半屏",
                    })) {
                    if (!ITimg.matchFeatures("剿灭_报酬", {
                            action: 0,
                            timing: 500,
                            area: "左半屏",
                        })) {
                        toast("已完成" + setting.已执行动 + "次剿灭行动");
                        console.info("已完成" + setting.已执行动 + "次剿灭行动");
                        break;
                    }
                } else if (ITimg.matchFeatures("行动_普通", {
                        timing: 500,
                        area: "右半屏",
                    })) {
                    break;
                }
                sleep(500);
                if (ITimg.matchFeatures("等级_提升", {
                        action: 0,
                        timing: 1000,
                        area: "右半屏",
                    })) {
                    tool.Floaty_emit("展示文本", "状态", "状态：正在结算中");
                    toast("等级提升了");
                    Combat_report.record("等级提升了，理智已恢复");
                    console.warn("等级提升了，理智已恢复");
                };
                sleep(500);
                if (setting.防沉迷) {
                    if (ITimg.matchFeatures("防沉迷_确认", {
                            action: 0,
                            timing: 1500,
                            area: "右半屏",
                        })) {
                        tool.Floaty_emit("展示文本", "状态", "状态：暂停，游戏时长已上限!");
                        tool.Floaty_emit("暂停", "结束程序");
                    };
                }
            }; //单
            tool.Floaty_emit("面板", "展开");
            sleep(1500);
            Combat_report.record("本次运行完成了" + setting.已执行动 + "次剿灭行动");
            tool.Floaty_emit("展示文本", "状态", "状态：等待加载关卡中");

        }, 1000) //总循环
    },
    检验已选中关卡: function(_action, _refresh_numer) {
console.verbose("---检验是否选中可代理关卡---");
        //有开始行动界面才能判断
        let _operation = ITimg.matchFeatures("行动_普通", {
            action: _action,
            threshold: 0.75,
            area: 4,
            picture_failed_further: true,
            //    visualization: true,
        }) || ITimg.matchFeatures("行动_磨难", {
            action: _action,
            threshold: 0.75,
            area: 4,
            refresh: false,
        }) || ITimg.matchFeatures("行动_愚人号", {
            action: _action,
            area: 4,
            refresh: false,
        }) || ITimg.matchFeatures("行动_活动", {
            action: _action,
            area: 4,
            refresh: false,

        })
        
        if (_action == 5 && _operation && !_refresh_numer) {
            return _operation;
        }
        if (!_operation) {
            return false;
        } else if (_refresh_numer === false) {
            return true;
        }
        tool.Floaty_emit("展示文本", "状态", "状态：校验关卡中");

        let staging = (ITimg.matchFeatures("禁止_演习", {
            action: 5,
            area: 4,
            refresh: false,
            picture_failed_further:true,
        }) || ITimg.matchFeatures("代理_勾_愚人号", {
            action: 5,
            area: 4,
            refresh: false,
        }) || ITimg.matchFeatures("代理_勾_活动", {
            action: 5,
            area: 4,
            refresh: false,
        }))
        if (staging) {
            if (_refresh_numer && setting.重置代理次数) {
                console.info("重置代理次数");
                /*  MyAutomator.click(staging.left - zox(70), staging.y + staging.h / 2);
                  sleep(500);
                  MyAutomator.click(staging.left - zox(70), staging.y + staging.h / 2 - zoy(80));
                  sleep(200);
                  */
                let _xy = [staging.right, staging.top - (staging.h / 2)];
                MyAutomator.click.apply(MyAutomator, _xy);
                sleep(500);
                _xy[1] = _xy[1] - staging.h;
                MyAutomator.click.apply(MyAutomator, _xy);
                sleep(200);
            }
            return true;
        } else if (ITimg.matchFeatures("代理_未勾", {
                action: 0,
                timing: 1000,
                area: "右下半屏",
            }) || ITimg.matchFeatures("代理_未勾_愚人号", {
                action: 0,
                timing: 1000,
                area: "右下半屏",
                refresh: false,
            }) || ITimg.matchFeatures("代理_未勾_活动", {
                action: 0,
                timing: 1000,
                area: "右下半屏",
                refresh: false,
            })) { //有开始行动界面才能判断
            toastLog("自动勾选代理指挥");
            if (_refresh_numer && setting.重置代理次数) {
                return this.检验已选中关卡(_action, _refresh_numer);
            }
            return true;
        } else {
            toast("当前关卡未解锁代理指挥，请选择已勾选可代理的关卡");
            return false;
        }


    },
    理智处理: function() {
        sleep(300);
        console.info("---理智界面检查---");
        if (ITimg.matchFeatures("理智_确认", {
                timing: 500,
                area: 4,
                nods: 1500,
            }) || ITimg.matchFeatures("理智_确认", {
                timing: 500,
                area: 4,
            }) || ITimg.matchFeatures("理智_确认", {
                timing: 500,
                area: 4,
                refresh: false,
            })) {
            setting = tool.readJSON("configure");
            tool.Floaty_emit("展示文本", "状态", "状态：理智检测中");
            if (setting.已兑理智 >= setting.理智) {
                if (setting.无限吃24小时过期理智药 && (ITimg.ocr(displayText["小时"], {
                        area: 24,
                        part: true,
                        threshold: 0.85,
                    }) || ITimg.ocr(displayText["分钟"], {
                        area: 24,
                        part: true,
                        refresh: false,
                        threshold: 0.85,
                    }))) {
                    if (ITimg.matchFeatures("理智_确认", {
                            action: 0,
                            area: 4,
                            timing: 1000,
                        })) {
                        setting.已兑理智++;
                        tool.writeJSON("已兑理智", setting.已兑理智);
                    }
                    Combat_report.record("本次运行累计兑换" + setting.已兑理智 + "瓶药剂");
                    toastLog("成功兑换理智" + setting.已兑理智 + "次");

                    统计("理智");
                    return true;
                } else {
                    toast("木有理智，更木有理智兑换次数");
                    console.warn("木有理智，更木有理智兑换次数");
                    console.verbose("取消理智界面，点击，x:" + height / 2 + "，y:" + (width - zoy(50)))
                    MyAutomator.click(height / 2, (width - zoy(50)));
                    return false;
                }


            } else {
                if (ITimg.matchFeatures("理智_源石", {
                        timing: 500,
                        area: 2,
                        threshold: 0.85,
                    })) {
                    //仅使用药剂恢复理智
                    if (setting.only_medicament) {
                        toast("没有药剂可供恢复理智了,仅使用药剂恢复理智" + setting.only_medicament);
                        console.warn("没有药剂可供恢复理智了,仅使用药剂恢复理智" + setting.only_medicament);
                        return false;
                    } else {
                        setting.已兑理智++;
                        tool.writeJSON("已兑理智", setting.已兑理智);

                        ITimg.matchFeatures("理智_确认", {
                            action: 0,
                            timing: 1000,
                            area: "右半屏",
                        });
                        Combat_report.record("本次运行累计兑换" + setting.已兑理智 + "个药剂/石头");
                        toastLog("成功兑换理智" + setting.已兑理智 + "次");
                        统计("理智");
                        return true;
                    }

                } else {

                    if (ITimg.matchFeatures("理智_确认", {
                            action: 0,
                            area: 4,
                            timing: 1000,
                        })) {
                        setting.已兑理智++;
                        tool.writeJSON("已兑理智", setting.已兑理智);
                    }
                    Combat_report.record("本次运行累计兑换" + setting.已兑理智 + "瓶药剂");
                    toastLog("成功兑换理智" + setting.已兑理智 + "次");

                    统计("理智");
                    return true;
                }
                //没有设置理智兑换次数
            }
        } else if (ITimg.matchFeatures("理智_源石", {
                area: 2,
                threshold: 0.85,
            })) {
            toast("木有理智药剂，更木有源石可供恢复理智");
            console.warn("木有理智药剂，更木有源石可供恢复理智");
            tool.Floaty_emit("展示文本", "状态", "状态：没有方法恢复");
            MyAutomator.click(height / 2, (width - zoy(50)));
            return false;
        }
        return true;
    }
}

module.exports = 关卡代理;