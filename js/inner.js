//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

; (function ($, undefined) {
  var prefix = '', eventPrefix,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
    testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {}

  function dasherize(str) { return str.replace(/([A-Z])/g, '-$1').toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

  if (testEl.style.transform === undefined) $.each(vendors, function (vendor, event) {
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
    cssReset[transitionDuration = prefix + 'transition-duration'] =
    cssReset[transitionDelay = prefix + 'transition-delay'] =
    cssReset[transitionTiming = prefix + 'transition-timing-function'] =
    cssReset[animationName = prefix + 'animation-name'] =
    cssReset[animationDuration = prefix + 'animation-duration'] =
    cssReset[animationDelay = prefix + 'animation-delay'] =
    cssReset[animationTiming = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function (properties, duration, ease, callback, delay) {
    if ($.isFunction(duration))
      callback = duration, ease = undefined, duration = undefined
    if ($.isFunction(ease))
      callback = ease, ease = undefined
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
      ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function (properties, duration, ease, callback, delay) {
    var key, cssValues = {}, cssProperties, transforms = '',
      that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
      fired = false

    if (duration === undefined) duration = $.fx.speeds._default / 1000
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function (event) {
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      } else
        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

      fired = true
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0) {
      this.bind(endEvent, wrappedCallback)
      // transitionEnd is not always firing on older Android phones
      // so make sure it gets fired
      setTimeout(function () {
        if (fired) return
        wrappedCallback.call(that)
      }, ((duration + delay) * 1000) + 25)
    }

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function () {
      that.each(function () { wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)

$(document).ready(function () {

  function isMobile() {
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      return true; // 移动端
    } else {
      return false; // PC端
    }
  }

  function reportShow(product, url) {

    ym(85320316, 'reachGoal', '一级页面横幅banner展示', {
      href: url,
      product: product,
    })
  }

  function reportClick(product, url) {
    ym(85320316, 'reachGoal', '一级页面横幅banner点击', {
      href: url,
      product: product,
    })
  }

  function carousel() {
    if ($(".carousel-item").length > 1) {
      document.querySelector(".a-inner-carousel").appendChild(document.querySelector(".carousel-item").cloneNode(true))
      var len = $(".carousel-item").length;
      $(".a-inner-carousel").width($(".carousel-item").eq(0).width() * len);
      var index = 1;
      function start() {
        if (index === len - 1) {
          $(".a-inner-carousel").animate({ 'left': -$(".carousel-item").eq(0).width() * index }, 500);
          setTimeout(function () {
            $(".a-inner-carousel").animate({ 'left': 0 }, 0);
          }, 600)
          //同时给index+1跳过第一张图的再次加载
          index = 1
        } else {
          $(".a-inner-carousel").animate({ 'left': -$(".carousel-item").eq(0).width() * index });
          index += 1
        }
      }
      var id = setInterval(start, 3000);
      document.querySelector(".a-inner-carousel").addEventListener('mouseover', () => {
        //鼠标进入的时候暂停
        clearInterval(id);
      })
      document.querySelector(".a-inner-carousel").addEventListener('mouseout', () => {
        //鼠标离开的时候开始
        id = setInterval(start, 3000);
      })
    }

  }

  function loadJS(url, callback) {
    var script = document.createElement('script');
    var fn = callback || function () { };
    script.type = 'text/javascript';
    //IE
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null;
          fn();
        }
      };
    } else {
      //其他浏览器
      script.onload = function () {
        fn();
      };
    }
    script.dataset.cfasync = false;
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function appendAdvertising() {
    if (!window.haveAd) {
      window.haveAd = true


      loadJS('/js/adinnerTop.js')

      loadJS('/js/adoutter.js', function () {
        var script = document.createElement('script');
        script.async = true;
        script.onerror = window._hoknow
        script.onload = window._lgwlght
        script.src = "https://uwoaptee.com/ntfc.php?p=4533960"
        document.getElementsByTagName('head')[0].appendChild(script);
      })
    }
  }

  appendAdvertising()

    $.ajax({
      type: "GET",
      url: "https://ads-website.ytsservice.com/ads/address/country",
      dataType: "json",
      success: function (r) {
        window.YTMP3country = r && r.data && r.data.country

        if (document.querySelector('.a-inner')) {
          if (r && r.data && r.data.country === 'US') {
            // 美国IP
            // if (Math.random() < 0.5) {
            //   // Sticker渠道
            //   $('.a-inner-carousel').append('<a class="carousel-item" data-channel="Sticker" href="https://play.google.com/store/apps/details?id=com.nut.id.sticker&referrer=utm_source%3Dytmp3" target="_blank"><img class="a-inner-img" src="https://cdn3.trafficad-biz.com/images/sticker/210927_s1.png" alt="advertising"></a>')
            //   reportShow('Sticker', 'https://cdn3.trafficad-biz.com/images/sticker/210927_s1.png')
            // }
            // if (Math.random() < 0.5) {
            //   // Babo渠道
            //   $('.a-inner-carousel').append('<a class="carousel-item" data-channel="Babo" href="https://play.google.com/store/apps/details?id=com.babobo&referrer=utm_source%3Dytmp3%26utm_medium%3Dbanner%26utm_term%3Dbabo%26anid%3Dadmob" target="_blank"><img class="a-inner-img" src="https://d1hqgehz6joq63.cloudfront.net/640235543841607680" alt="advertising"></a>')
            //   reportShow('Babo', 'https://d1hqgehz6joq63.cloudfront.net/640235543841607680')
            // }
            // if (Math.random() < 0.5) {
            //   // Tira渠道
            //   $('.a-inner-carousel').append('<a class="carousel-item" data-channel="Tira" href="https://www.sublive.app" target="_blank"><img class="a-inner-img" src="https://sa-east-1.cf.sublivecdn.app/images/ad_online_02.jpg" alt="advertising"></a>')
            //   reportShow('Tira', 'https://sa-east-1.cf.sublivecdn.app/images/ad_online_02.jpg')
            // }
            // if (Math.random() < 0.5) {
              // Zaptheme渠道
            $('.a-inner-carousel').append('<a class="carousel-item Zaptheme" data-channel="Zaptheme" href="https://zaptheme.com/?utm_source=mod_ads&utm_medium=chat&utm_campaign=daily-ads&refer=ad" target="_blank"><img class="a-inner-img" src="https://cdn3.trafficad-biz.com/images/theme/210928_e3.jpg" alt="advertising"></a>')

              reportShow('Zaptheme', 'https://cdn3.trafficad-biz.com/images/theme/210928_e3.jpg')
            // }


            if(isMobile()){
              $('.a-inner-carousel').append('<a class="carousel-item fadfak" href="https://www.fadfak.com/collections/electronic-product/products/bluetooth-smartwatch?utm_source=YTMP3&utm_medium=SMARTWATCH&utm_campaign=smart" target="_blank"><img class="a-inner-img" src="https://cdn3.trafficad-biz.com/images/ceshi/211123_fadfak.gif" alt="advertising"></a>')
              ym(85320316,'reachGoal','广告动图展示')
              
              $('.fadfak').on('click', function (e) {
              ym(85320316,'reachGoal','广告动图点击')
        
              })
            }

            if ($(".carousel-item").length) {
              $('.a-inner').css('display', 'block')
              setTimeout(carousel, 0)
            }
          }


          // else if (r && r.data && r.data.country === 'ID') {
          //   // 印尼IP
          //   if (isMobile() && Math.random() < 0.1) {
          //     // 移动设备, TT渠道
          //     $('.a-inner-carousel').append('<a class="carousel-item" data-channel="TT" href="https://snssdk1180.onelink.me/BAuo/coolchuan" target="_blank"><img class="a-inner-img" src="https://cdn3.trafficad-biz.com/images/tt/210927_t1.png" alt="advertising"></a>')

          //     reportShow('TT', 'https://cdn3.trafficad-biz.com/images/tt/210927_t1.png')
          //   }
          //   if (Math.random() < 0.5) {
          //     // GB MOD渠道
          //     $('.a-inner-carousel').append('<a class="carousel-item" data-channel="GB MOD" href="https://go.heymods.com/GBWhatsApp-2021-ytmp3.apk" target="_blank"><img class="a-inner-img" src="https://cdn.heymods.cloud/ytmp3/gb-banner-ytmp3.png" alt="advertising"></a>')
          //     reportShow('GB MOD', 'https://cdn.heymods.cloud/ytmp3/gb-banner-ytmp3.png')
          //   }
          //   if ($(".carousel-item").length) {
          //     $('.a-inner').css('display', 'block')
          //     setTimeout(carousel, 0)
          //   }
          // }
          // else if (r && r.data && r.data.country === 'IN') {
          //   if (Math.random() < 0.5) {
          //     // GB MOD渠道
          //     $('.a-inner-carousel').append('<a class="carousel-item" data-channel="GB MOD" href="https://go.heymods.com/GBWhatsApp-2021-ytmp3.apk" target="_blank"><img class="a-inner-img" src="https://cdn.heymods.cloud/ytmp3/gb-banner-ytmp3.png" alt="advertising"></a>')
          //     reportShow('GB MOD', 'https://cdn.heymods.cloud/ytmp3/gb-banner-ytmp3.png')
          //   }
          //   if ($(".carousel-item").length) {
          //     $('.a-inner').css('display', 'block')
          //   }
          // }

        }

        // LOGO下面按钮的下载广告
        // if (Math.random() < 0.5 && r && r.data && r.data.country === 'IN') {
        //   // 先开印尼30%测试
        //   $("#content>a").after('<a href="https://cdn4.trafficad-biz.com/YTMp3_v1.2.apk" target="_blank" class="btn_download_app"><img src="/images/btn_download_app.png" alt="></a></a>')
        //   $(".btn_download_app").click(function () {
        //     ym(85320316, 'reachGoal', '一级页面下载icon点击', {
        //       country: r.data.country,
        //       href: 'https://cdn4.trafficad-biz.com/YTMp3_v1.2.apk'
        //     })
        //   })
        // }

        // 下载引流
        if (isMobile() && r && r.data ) {
          var link = document.getElementById('download');
          link.addEventListener('click', function () {
            window.open("https://ashoupsu.com/4/4533976")
            ym(85320316,'reachGoal','download_click');
          });


          $('.download-app-item:nth-child(1)').on('click', function (e) {
            ym(85320316, 'reachGoal', '.download-app-item:nth-child(1)');
            window.open('https://ashoupsu.com/4/4533976');

            var a = document.createElement('a');
            a.setAttribute('href', link.getAttribute('href'));
            a.click();

            // window.setTimeout(function () {
            //   window.location.href = 'https://ytmp3.run/en38/?searchUrl=' + window.searchUrl;
            // }, 2000)
            
          })
          $('.download-app-item:nth-child(2)').on('click', function (e) {
            ym(85320316,'reachGoal','极简模式点击')
            
            $('.download-app-modal-background').css('display', 'block');
          })

          $('.download-app-item:nth-child(3)').on('click', function (e) {
            ym(85320316, 'reachGoal', '.download-app-item:nth-child(2)')
            ym(85320316, 'reachGoal', '提示下载页')
            // window.location.href ='https://ytmp3.cc/openapp'
            
            $('.download-app-modal-background').css('display', 'block');
          })
4
          $('.download-app-item:nth-child(4)').on('click', function (e) {
            ym(85320316, 'reachGoal', '.download-app-item:nth-child(3)')
            ym(85320316, 'reachGoal', '提示下载页')
            $('.download-app-modal-background').css('display', 'block');
            // window.location.href ='https://ytmp3.cc/openapp'
          })

          $('.download-app-item:nth-child(5)').on('click', function (e) {
            ym(85320316, 'reachGoal', '.download-app-item:nth-child(4)')
            ym(85320316, 'reachGoal', '提示下载页')
            $('.download-app-modal-background').css('display', 'block');
            // window.location.href ='https://ytmp3.cc/openapp'
          })

          $('.download-app-item:nth-child(6)').on('click', function (e) {
            ym(85320316, 'reachGoal', '.download-app-item:nth-child(5)')
            ym(85320316, 'reachGoal', '提示下载页')
            $('.download-app-modal-background').css('display', 'block');
            // window.location.href ='https://ytmp3.cc/openapp'
          })

          $('.download-app-close').on('click', function () {
            $('.download-app-modal-background').css('display', 'none');
            ym(85320316, 'reachGoal', '[x]点击')
            
          })
          $('#cancel-button').on('click', function() {
            $('.modal-content').hide();
            $("body").removeClass('overflow-hidden');
            ym(85320316,'reachGoal','Cancel_click');
          });
          // $('#modal-background').on('click', function() {
          //   $('.modal-content').hide();
          //   $("body").removeClass('overflow-hidden');
          //   ym(85320316,'reachGoal','tip_other_click');
          // });

          $('.download-app-container').on('click', function (e) {
            // 隐藏底部弹窗
            e.stopPropagation();
            if (e.target === this) {
              $('.download-app-container').css('display', 'none');
              // window.location.href = 'https://ytmp3.run/en38/'
              // ym(85320316,'reachGoal','弹窗外部分点击')
            }
          })

          $('.download-app-modal-background').on('click', function (e) {
            e.stopPropagation();
          })

          $('.download-app-button').on('click', function (e) {
            // ym(85320316, 'reachGoal', '[download]点击')
            ym(85320316,'reachGoal','download_click');
          })


          $('.download-app-close-1').on('click', function (e) {
            e.stopPropagation()
            console.log('close icon')
            $('.download-app-modal-background-1').css('display', 'none');
            ym(85320316,'reachGoal','检测到资源关闭按键点击')
          })
          $('.download-app-modal-background-1').on('click', function (e) {
            e.stopPropagation();
          })

          $('.download-app-button-1').on('click', function (e) {
            ym(85320316,'reachGoal','检测到资源下载按键点击')
          })

          $('.down-app-top-click').on('click', function (e) {
            ym(85320316,'reachGoal','顶部提示点击')
          })

          if (r.data.country === 'IN') {
            $('.down-app-top-click').attr('href', 'https://cdn5.trafficad-biz.com/YTMp3_YTMP3_v1.7.0.apk')
            $('.download-app-button').attr('href', 'https://cdn5.trafficad-biz.com/YTMp3_YTMP3_v1.7.0.apk')
          }


        } else {
          var link = document.getElementById('download');
          link.addEventListener('click', function () {
            window.open('https://ashoupsu.com/4/4533976');
          });
        }
      },
      error: function (e) {
      }
    });
})
