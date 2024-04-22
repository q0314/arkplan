var gz = [];
var gzgy = eval(files.read("./lib/game_data/RecruitData.json"));
var gzget = {
    //聘用的干员
    get_t: function(arr) {
        log("获取聘用干员名");
        let name_;
        for (let i = 0; i < gzgy.length; i++) {
            // console.info(arr.find(ele => ele.text.indexOf(gzgy[i].name) != -1))
            name_ = arr.find(ele => ele.text.indexOf(gzgy[i].name) != -1) ? gzgy[i] : undefined;
            if (!name_) {
                continue;
            } else {
                if (name_.name == '阿') {
                    if (arr.find(ele => ele.text.indexOf('SHAW') != -1)) {
                        gzgy[i].name = "阿消";
                        i--;
                        continue;
                    }
                } else if (name_.name == '星熊') {
                    name_ = false;
                    continue;
                }
                break;
            }

        }
        if (!name_) {
            log("屏幕内容:\n" + JSON.stringify(arr) + "\n识别到的干员名:" + name_)
        }
        return name_;
    },
    get_r: function(tags, filter) {
        log("检验tag词条,返回可招募的干员组合");
        gz = [];
        gzgy = eval(files.read("./lib/game_data/RecruitData.json"));
        for (let i = 0; i < gzgy.length; i++) {
            gzgy[i].tags.push(gzgy[i].type + "干员");
            gzgy[i].add = 0;
            gzgy[i].right_tag = [];
            for (let j = 0; j < tags.length; j++) {
                if (gzgy[i].tags.indexOf(tags[j]) != -1) {
                    gzgy[i].add += 1;
                    gzgy[i].right_tag.push(tags[j]);
                }
            }
            if (gzgy[i].add != 0) {
                gz.push(gzgy[i]);
            }
        }
        var above_four = [];
        for (let a = 0; a < tags.length; a++) {
            above_four = this.check_e_tag([tags[a]], above_four, filter);
        }
        for (let a = 0; a < tags.length - 1; a++) {
            for (b = a + 1; b < tags.length; b++) {
                above_four = this.check_e_tag([tags[a], tags[b]], above_four, filter);
                //    console.warn(above_four)

            }
        }

        for (let a = 0; a < tags.length - 2; a++) {
            for (b = a + 1; b < tags.length - 1; b++) {
                for (let c = b + 1; c < tags.length; c++) {
                    above_four = this.check_e_tag([tags[a], tags[b], tags[c]], above_four, filter);

                }
            }
        }

        var delete_m = [];
        for (let i = 0; i < above_four.length; i++) {
            let is_e = true;
            for (let e = 0; e < delete_m.length; e++) {
                if (
                    delete_m[e].name == above_four[i].name &&
                    delete_m[e].add_tags.length < above_four[i].add_tags.length
                ) {
                    delete_m[e] = above_four[i];
                } else if (delete_m[e].name == above_four[i].name) {
                    is_e = false;
                    break;
                }
            }
            if (is_e) {
                delete_m.push(above_four[i]);
            }
        }
        for (let i = 0; i < delete_m.length; i++) {
            let st, st2;
            for (let j = delete_m.length - 2; j >= i; j--) {
                st = delete_m[j + 1];
                st2 = delete_m[j];
                if (
                    st2.level < st.level ||
                    (st2.level == st.level && st2.add_tags.length < st.add_tags.length)
                ) {
                    delete_m[j] = st;
                    delete_m[j + 1] = st2;
                }
            }
        }
        return delete_m;
    },
    check_e_tag: function(tags_check, above_four, filter) {
        //校验tag,过滤出包含该tag的干员
        let tmp_arr = [];
        let is_add = true,
            min_level = 100;
        for (let d = 0; d < gz.length; d++) {
            let e_tag = 0;
            for (let i = 0; i < tags_check.length; i++) {
                e_tag += gz[d].tags.indexOf(tags_check[i]) == -1 ? -1 : 0;
            }
            if (e_tag < 0) {
                continue;
            }
            if (gz[d].level == 6 && tags_check.indexOf("高级资深干员") != -1) {
                tmp_arr.push(gz[d]);
                tmp_arr[tmp_arr.length - 1].add_tags = tags_check;
            } else if (gz[d].level == 5 || gz[d].level == 4) {
                min_level = min_level < gz[d].level ? min_level : gz[d].level;
                tmp_arr.push(gz[d]);
                tmp_arr[tmp_arr.length - 1].add_tags = tags_check;
            } else if (gz[d].level <= 3 && gz[d].level != 1) {
                is_add = false;
                break;
            }
        }
        //过滤不一定出的5星tag
        if (min_level == 4 && filter) {
            for (let i = tmp_arr.length - 1; i >= 0; i--) {
                if (tmp_arr[i].level == 5) {
                    tmp_arr.splice(i, 1);
                }
            }
        }

        if (is_add) {
            above_four.push.apply(above_four, tmp_arr);
        }
        return above_four;
    }
}

module.exports = gzget;