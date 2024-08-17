function 任务() {
    sleep(50)
    tool.Floaty_emit("面板", "展开");
    //  if (setting.claim_rewards && setting.claim_rewards.daily) {
    tool.Floaty_emit("展示文本", "状态", "状态：领取任务奖励");
    //toastLog("2秒后启动任务领取奖励程序");
    sleep(1000);

    ITimg.matchFeatures("导航", {
        action: 0,
        timing: 1000,
        area: 1,
    }) || ITimg.matchFeatures("导航2", {
        action: 0,
        timing: 1000,
        area: 1,
        refresh: false,
    })
    if (ITimg.matchFeatures("导航_任务", {
            action: 0,
            area: "上半屏",
            timing: 2000,
        })) {
        ITimg.matchFeatures("基建_离开", {
            action: 0,
            area: "下半屏",
            timing: 8000,
            nods: 3000,
        });
    } else {
        toastLog("没有找到导航_任务");
        tool.Floaty_emit("展示文本", "状态", "状态：主程序暂停中");
        tool.Floaty_emit("暂停", "结束程序");
        return;
    }
    temporary_xy = false;
    for (let i = 1; i <= 2; i++) {
        //获取周常任务位置点击日常任务
        if (!temporary_xy) {
            temporary_xy = (ITimg.matchFeatures("周常任务", {
                area: 2,
                action: 5,
                nods: 2000,
            }) || ITimg.matchFeatures("周常任务", {
                area: 12,
                action: 5,
                nods: 1000,
            }) || ITimg.matchFeatures("周常任务", {
                area: 12,
                action: 5,
                refresh:false,
                matcher:2,
            }))
        }
        if (temporary_xy) {
            console.verbose("周常任务位置数据:\n" + JSON.stringify(temporary_xy));
            if (i == 1) {
                MyAutomator.click(temporary_xy.x - zox(150), temporary_xy.y);
                sleep(100);
                MyAutomator.click(temporary_xy.x - zoy(200), temporary_xy.y);
                sleep(600);
            } else {
                MyAutomator.click(temporary_xy.x + temporary_xy.w / 2, temporary_xy.y + temporary_xy.h / 2);
            }
        }

        if (ITimg.matchFeatures("收集全部", {
                action: 0,
                area: 2,
                timing: 3000,
                nods: 1000,
            }) || ITimg.matchFeatures("收集全部", {
                action: 0,
                area: 2,
                timing: 3000,
            })) {
            (ITimg.matchFeatures("获得物资", {
                action: 0,
                area: "上半屏",
                timing: 2000,
                nods: 1500,
            }) && !ITimg.matchFeatures("获得物资", {
                action: 0,
                area: "上半屏",
                timing: 1000,
            }));
        }
        sleep(1000)

        if (ITimg.matchFeatures("收集全部", {
                action: 0,
                area: "上半屏",
                timing: 3000,
            })) {
            ITimg.matchFeatures("获得物资", {
                action: 0,
                area: "上半屏",
                timing: 2000,
            });
        } else {
            toastLog("没有待领取" + (i == 1 ? '日常' : '周常') + "奖励了");
        };


    }
    if (!ITimg.matchFeatures("返回", {
            action: 4,
            area: 1,
            timing: 1500,
            nods: 1000,
            scale: 1,
        })) {
        if (ITimg.matchFeatures("获得物资", {
                action: 0,
                area: "上半屏",
                timing: 1000,
            })) {

            if (!ITimg.matchFeatures("返回", {
                    action: 4,
                    area: 1,
                    timing: 1500,
                    nods: 1000,
                    scale: 1,
                })) {
                toastLog("找不到返回键");
            }
        }
    }

    /*  } else {
        if (!ITimg.matchFeatures("返回", {
                action: 4,
                area: 1,
                timing: 1500,
            })) {
            toastLog("找不到返回键");
        } else {
            ITimg.matchFeatures("基建_离开", {
                action: 0,
                area: 4,
                timing: 6000,
            });
        }
        toastLog("任务奖励:" + setting.claim_rewards.daily)
    }

*/

}

function 活动处理(rewardimg) {
    let date_reward;

    if (setting.claim_rewards.celebration_sign) {

        //庆典日期签到活动
        if (ITimg.ocr("本活动中应急理智", {
                area: 4,
                picture: images.copy(rewardimg),
                similar: 0.80,
                log_policy: true,
            }) || ITimg.ocr("DAY", {
                area: 2,
                similar: 0.80,
                threshold: 0.85,
                picture: images.copy(rewardimg),
                log_policy: true,
            }) || ITimg.ocr("LOGIN", {
                area: 2,
                similar: 0.80,
                refresh: true,
                threshold: 0.85,
            })) {
            tool.Floaty_emit("展示文本", "状态", "状态：活动签到处理中");
            //轮廓
            date_reward = ITimg.contour({
                action: 5,
                picture: images.copy(rewardimg),
                area: [height / 3, width / 4, height - height / 3, width - width / 4],
                threshold: 155,
                type: "BINARY",
                canvas: "日期签到",
                filter_w: zox(200),
                filter_h: zoy(400),
            });
            if (date_reward) {
                //重新排序，left最小的在前面
                date_reward.sort((obj1, obj2) => obj1.left - obj2.left)
                for (let i of date_reward) {
                    //根据轮廓顶点数量，进一步减少非符合轮廓
                    if (i.vertices > 8) {
                        continue;
                    }

                    click(i.x + i.w / 2, i.y + i.h / 4);
                    sleep(50);
                }
                sleep(1000);
                while (!ITimg.matchFeatures("关闭公告", {
                        timing: 2000,
                        action: 0,
                        picture: images.copy(rewardimg),
                        area: 2,
                    })) {
                    ITimg.matchFeatures("获得物资", {
                        timing: 1000,
                        action: 1,
                        area: 12,
                    });

                }
                return true;
            }
        }
    }
    if (setting.claim_rewards.make_wish) {

        let picture_name = "许愿卡片";
        let picture_result = files.exists(package_path + "/gallery_list/" + picture_name + ".png")
        if (!picture_result) {
            picture_result = ITimg.matchFeatures(picture_name, {
                action: 5,
                area: 4,
                threshold: 0.75,
                scale: 0.5,
                picture: images.copy(rewardimg),
                saveSmallImg: picture_name,
                visualization: true,
            })
        }
        if (!picture_result) {
            tips = "无法识别确认 " + picture_name + " 小图，不进行许愿";
            toast(tips);
            console.error(tips);
        } else {
            let _max = 3;
            while (_max) {
                picture_result = ITimg.picture(picture_name, {
                    action: 6,
                    picture: images.copy(rewardimg),
                    threshold: 0.7,
                    matchTemplate_max: 12,
                })
                if (picture_result.points && picture_result.points.length) {
                    tool.Floaty_emit("展示文本", "状态", "状态：许愿签处理中");

                    let xy = picture_result.points[random(0, (picture_result.points.length / 2)) - 1]
                    if (!xy) {
                        break;
                    }
                    click(xy.x, xy.y);
                    sleep(500);
                    xy = picture_result.points[random((picture_result.points.length / 2), (picture_result.points.length)) - 1]
                    if (!xy) {
                        break;
                    }
                    click(xy.x, xy.y);
                    sleep(500);
                    while (true) {
                        ITimg.matchFeatures("许愿_确定抽取", {
                            action: 0,
                            area: 4,
                            timing: 1000,
                        })
                        if (ITimg.matchFeatures("获得物资", {
                                timing: 1500,
                                action: 1,
                                area: 12,
                            })) {
                            break
                        }
                    }
                    (ITimg.matchFeatures("关闭公告", {
                        timing: 1500,
                        action: 0,
                        area: 2,
                        nods: 1000,
                    }) || ITimg.matchFeatures("关闭公告", {
                        timing: 1500,
                        action: 0,
                        area: 2,
                    }))
                    break
                } else {
                    _max--;
                }
            }
            return _max;

        }
    }
    if (setting.claim_rewards.mining_operations && !date_reward) {
        //矿区作业
        if (ITimg.ocr("限时开放许可", {
                area: 24,
                picture: images.copy(rewardimg),
                similar: 0.80,
            }) || ITimg.ocr("矿脉概率", {
                refresh: false,
                similar: 0.80,
                log_policy: "简短",
            }) || ITimg.ocr("源石矿脉", {
                refresh: false,
                similar: 0.80,
                log_policy: "简短",
            }) || ITimg.ocr("PROVISIONAL MINING PERMIT", {
                refresh: false,
                similar: 0.80,
                log_policy: "简短",
            })) {
            return ITimg.ocr("开始作业", {
                action: 1,
                timing: 2000,
                refresh: false,
                similar: 0.80,
            });
        }
    }

}

let claimRewards = {};
claimRewards.任务 = 任务;
claimRewards.活动处理 = 活动处理;
module.exports = claimRewards;