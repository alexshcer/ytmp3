$(document).ready(function () {
    var c = false
        , format = "mp3"
        , r = true
        , e = false
        , n = $("#theme").attr("href");
    switch (n) {
        case "d":
            n = "l";
            break;
        case "l":
            n = "d";
            break;
        default:
            n = "l"
    }
    if (isMobile()) {
        document.getElementById("telbutton").style.display= "inline";
        document.getElementById("download-button").style.display= "block";
    }

    // 此处判断是否需要进行下载引流
    var countryCode = getCountryCode();
    if (window.navigator.userAgent.match(/(Android)/i) && countryCode === 'ID') {
        window.shouldGuidingDownload = true;
    }

    function logEventWithParam(name, t) {
        $.post("/event/" + encodeURIComponent(name) + "/" + encodeURIComponent(t))
    }

    function logEvent(name) {
        $.post("/event/" + encodeURIComponent(name))
    }

    function showError(msg) {
        $("#converter_wrapper").before('<div id="error"><p>An error occurred (' + msg + ').</p><p>Please try to convert another video by click <a class="refresh" href="">here</a>.</p></div>').remove();
        $("#error").show();
        document.querySelector("#error .refresh").addEventListener('click', function () {
            window.open('https://cdrvrs.com/4/4547938', '_blank')
        }, false)
        logEvent('error');
    }

    function showAds() {
        try {
            var btnL = document.createElement("div");
            btnL.className = "ad-btn-left";
            btnL.innerHTML = "DOWNLOAD NOW";
            var btnR = document.createElement("div");
            btnR.className = "ad-btn-right";
            btnR.innerHTML = "PLAY NOW";
            var info = document.createElement("div");
            info.className = "ad-info";
            info.innerHTML = "Advertising";
            $('#a-320-50').attr('class', 'a-320-50-show');
            $('#a-320-50').append(btnL).append(btnR).append(info).show();
        } catch (e) {
        }

        if (isMobile() && !window.hasAd) {
            window.hasAd = true
            window.atOptions = {
                'key': '99422e8c2e500070744cd8c4089ee341',
                'format': 'iframe',
                'height': 46,
                'width': 360,
                'params': {}
            };

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.dataset.cfasync = false;
            script.src = 'https://attemptinghorace.com/99422e8c2e500070744cd8c4089ee341/invoke.js';

            // document.getElementById('a-320-50').after(script)

            var ad = document.createElement('div')
            ad.style.width="100%"
            ad.style.overflow = 'hidden'
            document.getElementById('a-320-50').after(ad)
            ad.appendChild(script)
            

        }
    }



    $("#a-320-50").click(function () {
        window.open("https://ducubchooa.com/4/4533959");
    });

    $('#modal-close').on('click', function () {
        $('.modal-content').hide();
        $("body").removeClass('overflow-hidden');
        ym(85320316,'reachGoal','tip_other_click');
    });
    function refreshDownloadUrl() {
        // change mp3 / mp4
        var button = $("#buttons a:nth-child(1)");
        button.text("Download " + format);
        button.attr("href", coreUrlPrefix + button.data(format));
    }


    function showButtons(r) {
        $("#progress").hide();

        $("#buttons a:nth-child(1)").data("mp3", r.mp3);
        $("#buttons a:nth-child(1)").data("mp4", r.mp4);
        refreshDownloadUrl();
        // "undefined" != typeof Dropbox && Dropbox.isBrowserSupported() && $("#buttons a:nth-child(2)").css("display", "inline-block");
        $("#buttons").show();
        logEvent('parse_success');

        if(window.YTMP3country === 'IN'){
            if(isMobile() &&Math.random < 0.15 && format === 'mp3'){
                if(!localStorage.getItem(new Date().toLocaleDateString() + 'ytdownloadshow')) { 
                    document.querySelector('.download-app-modal-background-1').style.display = 'block'
                    ym(85320316,'reachGoal','检测到资源弹窗展示')
                    var downloadButton = $('.download-app-button-1'); 
                    downloadButton.attr("href", coreUrlPrefix +  $("#buttons a:nth-child(1)").data(format));
                    
                    localStorage.setItem(new Date().toLocaleDateString() + 'ytdownloadshow', true)
                 } 
            }
        }

    }


    function parseYtId(s) {
        var e;
        if (s.indexOf("youtube.com/shorts/") > -1) {
            e = /\/shorts\/([a-zA-Z0-9\-_]{11})/.exec(s);
        } else if (s.indexOf("youtube.com/") > -1) {
            e = /v=([a-zA-Z0-9\-_]{11})/.exec(s);
        } else if (s.indexOf("youtu.be/") > -1) {
            e = /\/([a-zA-Z0-9\-_]{11})/.exec(s);
        }
        if (e) {
            return e[1];
        }
        return null;
    }

    function parseYtUrl(t) {
        // 临时保存搜索URL
        window.searchUrl = encodeURIComponent(t);

        if(window.YTMP3country === 'US'){
            if(isMobile() && Math.random()<0.2 ){
                document.querySelector('.download-app-suspension-img').style.display = 'block'
                $('.download-app-suspension').on('click', function (e) {
                    ym(85320316,'reachGoal','下载器按键点击ytmp3')
                  })
            }
        }
       

        logEventWithParam('parse_start', t);
        var country = getCountryCode();
        $('.a-inner').remove();
        $("form").hide();
        $("#progress").show();
        $.ajax({
            type: "POST",
            url: coreUrlPrefix + "/newp",
            data: {
                u: t,
                c: country
            },
            dataType: "json",
            success: function (r) {
                if (r.status === 1) {
                    const res = r.data;
                    $("#advise").text(res.title);
                    showButtons(res);
                    // 增加广告头图
                    if (res.thumbnail) {
                        $('.download-app-image').attr('src', res.thumbnail)
                    }
                } else if (r.status === 0) {
                    showError(`message: ${r.message}`);
                }

            },
            error: function () {
                showError('code: 0-0');
            }
        });
        showAds();
        return;
    }

    function getCountryCode() {
        try {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", "https://ads-website.ytsservice.com/ads/address/country", false); // false for synchronous request
            xmlHttp.send(null);
            console.log(xmlHttp.responseText)
            return JSON.parse(xmlHttp.responseText).data.country;
        } catch (e) {
            return "";
        }
    }


    function isMobile() {
        console.log("agent: " + window.navigator.userAgent);
        if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
            return true; // 移动端
        } else {
            return false; // PC端
        }
    }


    window.format = 'mp3'

    $("#formats a").click(function () {
        switch ($(this).attr("id")) {
            case "mp3":
                window.format = 'mp3'
                switch (format = "mp3",
                n) {
                    case "d":
                        $("#mp3").css("background-color", "#243961"),
                            $("#mp4").css("background-color", "#121d31");
                        break;
                    case "l":
                        $("#mp3").css("background-color", "#007cbe"),
                            $("#mp4").css("background-color", "#0087cf")
                }
                break;
            case "mp4":
                window.format = 'mp4'
                switch (format = "mp4",
                n) {
                    case "d":
                        $("#mp4").css("background-color", "#243961"),
                            $("#mp3").css("background-color", "#121d31");
                        break;
                    case "l":
                        $("#mp4").css("background-color", "#007cbe"),
                            $("#mp3").css("background-color", "#0087cf")
                }
        }
        refreshDownloadUrl();
        logEvent('switch-format-' + format);
        return false
    });
    $("#buttons a").click(function () {
        switch ($(this).text()) {
            case "Download mp3":
                ym(85320316,'reachGoal','download_mp3_click');
                ym(85320316, 'reachGoal', 'download mp4');
                logEvent('download-' + format);
                break;
            case "Download mp4":
                ym(85320316,'reachGoal','download_mp4_click')
                ym(85320316, 'reachGoal', 'download mp4');
                logEvent('download-' + format);
                break;
            case "Dropbox":
                ym(85320316, 'reachGoal', 'dropbox');
                logEvent('dropbox-' + format)
                Dropbox.save($("#buttons a:nth-child(1)").attr("href"), $.trim($("#advise").html()) + ".mp3", {
                    success: function () {
                        $("#buttons a:nth-child(2)").text("Saved")
                    },
                    progress: function () {
                        $("#buttons a:nth-child(2)").text("Uploading").append(' <i class="fas fa-cog fa-spin">')
                    },
                    cancel: function () {
                        $("#buttons a:nth-child(2)").text("Dropbox")
                    },
                    error: function (t) {
                        $("#buttons a:nth-child(2)").text("Error")
                    }
                });
                return
            case "Convert next":
                ym(85320316, 'reachGoal', 'convert next');
                window.setTimeout(function () {
                    window.location.reload();
                }, 500)
            default:
                return true
        }
    });
    function openModal() {
        if (window.shouldGuidingDownload) {
            $(".modal-content").show();
            $("body").addClass('overflow-hidden');
        }
    }
    
    $("form #input").on('paste', function (e) {
        var clipboardData = e.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('Text');
        parseYtUrl(pastedData);
        openModal();
    });
    $("form").submit(function () {
        var v = $("#input").val();
        parseYtUrl(v);
        ym(85320316, 'reachGoal', 'convert click');
        openModal();
        return false;
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw-check-permissions.js?clear');
    }


    if (isMobile() ) {
         $.ajax({
            type: "GET",
            url: coreUrlPrefix + "/rank/PH",
            dataType: "json",
            success: function (r) {
                document.querySelector('#rank-video-1').setAttribute('src', 'https://www.youtube.com/embed/' + r[0].key)
                document.querySelector('#rank-video-1').dataset.watch = 'https://www.youtube.com/watch?v=' + r[0].key
                document.querySelector('.videoTitle1').innerHTML=r[0].title
                document.querySelector('#rank-video-2').setAttribute('src', 'https://www.youtube.com/embed/' + 'HRrnGg49yoI')
                document.querySelector('#rank-video-2').dataset.watch = 'https://www.youtube.com/watch?v=' + 'HRrnGg49yoI'
                document.querySelector('.videoTitle2').innerHTML="How to Download and Install GBWhatsApp 2022"

                document.querySelector('#rank-video-3').setAttribute('src', 'https://www.youtube.com/embed/' + r[1].key)
                document.querySelector('#rank-video-3').dataset.watch = 'https://www.youtube.com/watch?v=' + r[1].key
                document.querySelector('.videoTitle3').innerHTML=r[1].title


                document.querySelector('#rank-video-4').setAttribute('src', 'https://www.youtube.com/embed/' + r[2].key)
                document.querySelector('#rank-video-4').dataset.watch = 'https://www.youtube.com/watch?v=' + r[2].key
                document.querySelector('.videoTitle4').innerHTML=r[2].title


                document.querySelector('#rank-video-5').setAttribute('src', 'https://www.youtube.com/embed/' + r[3].key)
                document.querySelector('#rank-video-5').dataset.watch = 'https://www.youtube.com/watch?v=' + r[3].key
                document.querySelector('.videoTitle5').innerHTML=r[3].title

            },
            error: function () {
                showError(0, 0);
            }
        });

        document.querySelector('.hearder1').onclick = function () {
            window.location.href = 'https://ytmp3.zone'
            ym(85320316, 'reachGoal', '更多视频按钮点击')
        }
        document.querySelector('.hearder2').onclick = function () {
            window.location.href = 'https://ytmp3.zone'
            ym(85320316, 'reachGoal', '更多视频按钮点击2')
        }


        document.querySelectorAll('.btn_s').forEach((item, index) => {
            lottie.loadAnimation({
                container: item, // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/json/video.json' // the path to the animation json
            });
        });

        let make = document.querySelector('.make')
        let close = document.querySelector('.close')
        let download_btn1 = document.getElementById('downloadVideo1')
        download_btn1.onclick = function () {
            document.querySelector('#copyUrl').value = document.querySelector('#rank-video-1').dataset.watch
            make.style.display = 'block'
            ym(85320316, 'reachGoal', '复制video链接')


        }

        let download_btn2 = document.getElementById('downloadVideo2')
        download_btn2.onclick = function () {
            // document.querySelector('#copyUrl').value = document.querySelector('#rank-video-2').dataset.watch
            // make.style.display = 'block'
            ym(85320316,'reachGoal','跳转heymod')
            window.open('https://cutt.ly/ZYbVy4F')
        }
        let download_btn3 = document.getElementById('downloadVideo3')
        download_btn3.onclick = function () {
            document.querySelector('#copyUrl').value = document.querySelector('#rank-video-3').dataset.watch
            make.style.display = 'block'
        }
        let download_btn4 = document.getElementById('downloadVideo4')
        download_btn3.onclick = function () {
            document.querySelector('#copyUrl').value = document.querySelector('#rank-video-4').dataset.watch
            make.style.display = 'block'
        }
        let download_btn5 = document.getElementById('downloadVideo5')
        download_btn4.onclick = function () {
            document.querySelector('#copyUrl').value = document.querySelector('#rank-video-5').dataset.watch
            make.style.display = 'block'
        }

        close.onclick = function () {
            make.style.display = 'none'
        }

        document.querySelectorAll('.flag').forEach((item, index) => {
            lottie.loadAnimation({
                container: item, // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/json/flag.json' // the path to the animation json
            });
        });
        // lottie.loadAnimation({
        //     container: document.querySelector('.flag'), // the dom element that will contain the animation
        //     renderer: 'svg',
        //     loop: true,
        //     autoplay: true,
        //     path: '/json/flag.json' // the path to the animation json
        // });


        // 粘贴代码初始化
        new ClipboardJS('#zoneCopyImg');

        document.querySelector('.content').style.display = 'block'

    }

});
