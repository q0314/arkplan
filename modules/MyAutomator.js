  let gestures26 = require("./gestures_API26.js");

  //let Bezier = require("./bezier-js-2.6.1/bezier.js")
  // 传统的函数式声明方式
  function Bezier(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
      // 假设 Bezier 对象的构造函数内容，这里简单定义
      this.x1 = x1;
      this.y1 = y1;
      this.c1x = c1x;
      this.c1y = c1y;
      this.c2x = c2x;
      this.c2y = c2y;
      this.x2 = x2;
      this.y2 = y2;
  }

  // 模拟 `getLUT` 方法，假设返回一个包含点的数组
  Bezier.prototype.getLUT = function(numPoints) {
      var points = [];
      for (var i = 0; i < numPoints; i++) {
          // 假设我们用一个简单的贝塞尔曲线生成方法
          var t = i / (numPoints - 1); // t的值范围是0到1
          var x = (1 - t) * (1 - t) * (1 - t) * this.x1 +
              3 * (1 - t) * (1 - t) * t * this.c1x +
              3 * (1 - t) * t * t * this.c2x +
              t * t * t * this.x2;
          var y = (1 - t) * (1 - t) * (1 - t) * this.y1 +
              3 * (1 - t) * (1 - t) * t * this.c1y +
              3 * (1 - t) * t * t * this.c2y +
              t * t * t * this.y2;

          points.push({
              x: x,
              y: y
          });
      }
      return points;
  };

  let MyAutomator = {
      dirctionReverse: undefined,
      RA: undefined,
      shell: undefined,
      setTapType: function(tapType) {

          MyAutomator.tapType = {
              '无障碍': 0,
              'RootAutomator': 1,
              'Shell': 2,
              'Root': 3
          }[tapType]; // 0 无障碍， 1 RootAutomator， 2 Shell， 3 普通Root

          console.log('修改automator：' + tapType + '>' + MyAutomator.tapType);
          const self = MyAutomator;
          if (MyAutomator.tapType == 0) {
              ///TOO
          } else if (MyAutomator.tapType == 1) {
              const thd = threads.start(function() {
                  // @ts-expect-error d.ts文件问题
                  if (!self.RA) self.RA = new RootAutomator();
              });
              // 5秒无响应直接杀死
              setTimeout(() => {
                  if (thd.isAlive()) {
                      thd.interrupt();
                      toastLog('RootAutomator初始化失败，可能是环境不支持');
                  }
              }, 5000)
          } else if (MyAutomator.tapType == 2) {
              // @ts-expect-error d.ts文件问题
              MyAutomator.shell = new Shell($shell.checkAccess("root"))
              if (!MyAutomator.shell) MyAutomator.shell = new Shell(true);
          } else if (MyAutomator.tapType == 3) {
              // none
          }
      },
      click: function(x, y) {
          return MyAutomator.press(x, y, random(129, 159));

      },
      press: function(x, y, delay) {

          if (MyAutomator.dirctionReverse) {

              const dm = context.getResources().getDisplayMetrics();
              const wm = context.getSystemService(context.WINDOW_SERVICE);
              wm.getDefaultDisplay().getRealMetrics(dm);
              const tmpx = dm.heightPixels - y;
              y = x;
              x = tmpx;
          }
          if (MyAutomator.tapType == 0) {
              return press(x, y, delay);

          } else if (MyAutomator.tapType == 1) {
              return MyAutomator.RA.press(x, y, delay);
          } else if (MyAutomator.tapType == 2) {
              return (MyAutomator.shell.execAndWaitFor('input swipe ' + x + ' ' + y + ' ' + x + ' ' + y + ' ' + delay).code == 0);
          } else if (MyAutomator.tapType == 3) {
              return Tap(x, y); // 忽略点击时长, 官方不支持
          }

      },

      swipe: function(x0, y0, x1, y1, delay) {
          if (MyAutomator.dirctionReverse) {
              const dm = context.getResources().getDisplayMetrics();
              const wm = context.getSystemService(context.WINDOW_SERVICE);
              wm.getDefaultDisplay().getRealMetrics(dm);
              let tmpx = dm.heightPixels - y0;
              y0 = x0;
              x0 = tmpx;
              tmpx = dm.heightPixels - y1;
              y1 = x1;
              x1 = tmpx;
          }

          if (MyAutomator.tapType == 0) {
              // MyAutomator.bezierSwiper.swipe(x0, y0, x1, y1, delay);
              return swipe(x0, y0, x1, y1, delay);
          } else if (MyAutomator.tapType == 1) {
              // MyAutomator.bezierSwiper.swipe(x0, y0, x1, y1, delay);
              return MyAutomator.RA.swipe(x0, y0, x1, y1, delay);
          } else if (MyAutomator.tapType == 2) {
              return (MyAutomator.shell.execAndWaitFor('input swipe ' + x0 + ' ' + y0 + ' ' + x1 + ' ' + y1 + ' ' + delay) == 0);
          } else if (MyAutomator.tapType == 3) {
              return Swipe(x0, y0, x1, y1, delay);
          }
      },
      regionBezierSwipe: function(transedOperS, transedOperE, duration, randomSleep, type) {
          const time = random(duration[0], duration[1])
          // swipe(
          //     random(transedOperS[0], transedOperS[2]), // x1
          //     random(transedOperS[1], transedOperS[3]), // y1
          //     random(transedOperE[0], transedOperE[2]), // x2
          //     random(transedOperE[1], transedOperE[3]), // y2
          //     time // duration
          // );
          // sleep(time + random(0, randomSleep))

          const x1 = random(transedOperS[0], transedOperS[2]);
          const y1 = random(transedOperS[1], transedOperS[3]);
          const x2 = random(transedOperE[0], transedOperE[2]);
          const y2 = random(transedOperE[1], transedOperE[3]);
          if (this.tapType != 0) {
              this.swipe(x1, y1, x2, y2, time);
              sleep(time + 200 + random(0, randomSleep));
              return true;
          }
          const xMax = Math.max(x1, x2);
          const xMin = Math.min(x1, x2);
          const yMax = Math.max(y1, y2);
          const yMin = Math.min(y1, y2);
          // const screenWidth = getWidthPixels();
          let c1, c2;
          // TODO 开始和结束的附近的点需要更密集
          if (!type) {
              c1 = [
                  random(xMin, xMax),
                  random(yMin, yMax),
              ];
              c2 = [
                  random(xMin, xMax),
                  random(yMin, yMax),
              ];
          } else {
              // TODO
          }


          // 实例化 Bezier 曲线
          var curve = new Bezier(x1, y1, c1[0], c1[1], c2[0], c2[1], x2, y2);

          // 获取点并将每个点的坐标四舍五入到整数
          var pointsOrigin = [];
          var lut = curve.getLUT(200);
          for (var i = 0; i < lut.length; i++) {
              var point = lut[i];
              pointsOrigin.push([Math.floor(point.x), Math.floor(point.y)]);
          }


          /*  var curve = new Bezier(x1, y1, c1[0], c1[1], c2[0], c2[1], x2, y2)
            const pointsOrigin = curve.getLUT(200).map(p => [Math.floor(p['x']), Math.floor(p['y'])]);
          */
          let toRetain = [0, 1, 2, 3, 4, 5, 191, 192, 193, 194, 195, 196, 197, 198, 199];
          for (let i = 190, stepLen = 1; i > 5; i -= stepLen, stepLen++) {
              toRetain.push(i);
          }
          toRetain = toRetain.sort((a, b) => Math.floor(a) - Math.floor(b));
          const points = [];
          let tss = Math.floor(time/toRetain.length-4);
          tss = [Math.floor(tss /3),tss];
          for (let i = 0; i < toRetain.length; i++) {

              points.push([0, random(tss[0],tss[1]), pointsOrigin[toRetain[i]]]) //, (pointsOrigin[toRetain[i + 1]] ? pointsOrigin[toRetain[i + 1]] : pointsOrigin[toRetain[i]])]);
          }
          //最后4个坐标点延长按住时间防止惯性
          tss = [Math.floor(time / 18), Math.floor(time / 4)];

          for (let k = toRetain.length - 1; k > (toRetain.length - 5); k--) {
              points[k][1] = tss[1] -= tss[0];
          }
          gestures26([points]);
      }


  }
  try {
      module.exports = MyAutomator;
  } catch (e) {
      var height = device.height;
      var width = device.width;
      var zox = (value) => {
              return Math.floor((height / 2712) * value);
          },
          zoy = (value) => {
              return Math.floor((width / 1220) * value);
          };
      let gesturexy = [
          [height / 2, width / 2, zox(300), width / 2, 800],
          [height / 2, width / 2, height - zox(500), width / 2, 800]
      ];
      // gesturexy = gesturexy[1]
      //  swipe.apply(swipe,gesturexy)
      //[0], gesturexy[1], gesturexy[2], gesturexy[3], gesturexy[4]);
      // 分辨率
      // 分辨率
      let h = 2712;
      let w = 1220;
      MyAutomator.tapType = 0;
      let hj = [
          [2600, 1100, 2620, 1120], // 滑动起点
          [1130, 610, 1140, 620]
      ]
      console.time("99")
      MyAutomator.regionBezierSwipe(hj[0], hj[1], [1500, 1550], 200);
      console.timeEnd("99")
  }