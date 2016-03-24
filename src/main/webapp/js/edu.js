'use strict';
/**
 * 不再提醒功能;
 * 设置cookie;
 */
(function(tips) {
    // 如果有不再提醒cookie,设置容器节点不可见,display:none;
    if (!!getCookie("forbid")) {
        util.addClass(tips, "f-dn");
    }
    Event.addHandler(tips.querySelector(".forbid"), "click", function() {
        setCookie("forbid", "forbidvalue", 100);
        util.addClass(tips, "f-dn");
    });
})(document.querySelector(".m-tips"));

/**
 * 表单登录功能;
 * 密码错误显示
 *      当服务器返回登录错误时,有可能是账号或者密码错误,
 *      因为有可能,另一个用户正好是这个错误的用户名,所以只给密码添加了错误样式
 */
(function() {
    /**
     * 关注;登录,关注按钮;
     * 表单,表单标题,表单关闭按钮;
     * @type {[type]}
     */
    var namePattern = ['^.{6,16}$'];
    var pswPattern = ['[a-zA-Z]', '[0-9]', '^.{6,16}$'];

    var follow = document.querySelector('.m-follow');
    var login = document.querySelector('.m-login');
    var followBtn = follow.querySelector('.u-followBtn');
    var close = login.querySelector('.close');
    var loginBtn = login.querySelector('.u-loginBtn');
    var userName = login.querySelectorAll('.u-txt')[0];
    var password = login.querySelectorAll('.u-txt')[1];
    var followed = follow.querySelector('.followed');
    var cancel = follow.querySelector('.cancel');
    var fansNum = follow.querySelector('.fansNum');
    _initEvent();
    // 初始化 添加事件监听
    function _initEvent() {
        Event.addHandler(followBtn, 'click', function() {
            console.log("账号是:studyOnline,密码是:study.163.com")
            checkLogin();
        });
        Event.addHandler(loginBtn, 'click', function() {
            _onLogin();
        });
        Event.addHandler(close, 'click', function() {
            _onClose();
        });
        Event.addHandler(userName, 'focus', function() {
            _focus(userName);
        });
        Event.addHandler(userName, 'blur', function() {
            _check(userName);
            delActive(userName);
        });
        Event.addHandler(password, 'focus', function() {
            _focus(password);
            _setDisabled(loginBtn, false);
        });
        Event.addHandler(password, 'blur', function() {
            delActive(password);
        });
        Event.addHandler(cancel, 'click', function() {
            _cancel();
        });
    }
    checkFollow();
    // 检查是否已经关注
    function checkFollow() {
        if (!!getCookie("followSuc")) { _followSuc(); }
    }
    // 检查是否登录成功
    function checkLogin() {
        if (!!getCookie("loginSuc")) {
            _loginSuc();
        } else { _show(); }
    }
    //显示登录窗口
    function _show() { util.delClass(login, 'f-vh'); }
    // 隐藏登录窗口
    function _hide() { util.addClass(login, 'f-vh'); }
    // 关闭登录窗口
    function _onClose() { _hide(); }
    //检查账号密码
    function _check(node) {
        var pattern = [];
        if (node == password) {
            pattern = pswPattern;
        } else if (node == userName) {
            pattern = namePattern;
        }
        var value = node.value,
            len = pattern.length;
        for (var i = 0; i < len; i++) {
            var ptn = RegExp(pattern[i]);
            if (!ptn.test(value)) {
                addErr(node);
                return false;
            };
        }
        return true;
    }
    //添加错误显示
    function addErr(node) { util.addClass(node, 'inputErr') }
    // 输入框获取焦点,移除错误显示,红边框
    function _focus(node) {
        delErr(node);
        addActive(node);
    }
    //移除错误显示
    function delErr(node) { util.delClass(node, 'inputErr') }
    // 聚焦,显示蓝边框
    function addActive(node) { util.addClass(node, "z-active"); }
    // 删除蓝边框
    function delActive(node) { util.delClass(node, "z-active"); }
    // 点击登录
    function _onLogin() {
        if (!_check(password)) {
            Event.preventDefault(event);
            return;
        }
        if (!_check(userName)) {
            Event.preventDefault(event);
            return;
        }
        _setDisabled(loginBtn, true);
        var name = hex_md5(userName.value);
        var value = hex_md5(password.value);
        get('http://study.163.com/webDev/login.htm', { userName: name, password: value }, function(a) {
            if (a == 1) {
                _loginSuc();
            } else { _loginFail(); }
        });
    }
    //禁止按钮,防止重复点击提交
    function _setDisabled(node, disabled) {
        node.disabled = !!disabled;
        if (!!disabled) {
            util.addClass(node, "z-disabled");
        } else { util.delClass(node, "z-disabled"); }
    }
    //登录成功
    function _loginSuc() {
        _hide();
        _setDisabled(loginBtn, false);
        setCookie("loginSuc", "loginSucValue", 100);
        toFollow();
    }
    //登录失败
    function _loginFail() { addErr(password); }
    // 关注API
    function toFollow() {
        get('http://study.163.com/webDev/attention.htm', "", function(a) {
            if (a == 1) {
                _followSuc();
            } else { alert("发生未知错误,关注失败!"); }
        });
    }
    //关注成功
    function _followSuc() {
        setCookie("followSuc", "followSucValue", 100);
        util.addClass(followBtn, "f-dn");
        util.delClass(followed, "f-dn");
        (fansNum.textContent++) || (fansNum.innerText++);
    }
    //取消关注
    function _cancel() {
        util.addClass(followed, "f-dn");
        util.delClass(followBtn, "f-dn");
        removeCookie("followSuc");
        (fansNum.textContent--) || (fansNum.innerText--);
    }
})();

/**
 * 轮播图功能
 */
(function() {
    var template = '<div class="m-sld" >\
        <div class="m-cursor"></div>\
</div>';
    //构造函数
    function Slider(opt) {
        //拓展原型
        util.extend(this, opt);
        //容器节点
        this.container = this.container || document.body;
        this.container.style.overflow = 'hidden';
        this.slider = this._layout.cloneNode(true);
        this.cursor = this.slider.querySelector(".m-cursor");
        this.pageNum = this.images.length;
        this.pageIndex = 0;
        this.container.appendChild(this.slider);
        //初始化
        this._initial();
    }
    // util.extend( Slider.prototype, emitter );
    util.extend(Slider.prototype, {
        //模板转换
        _layout: util.html2node(template),
        //初始化
        _initial: function() {
            //添加节点
            this._addNode(this.pageNum);
            this.slds = [].slice.call(this.slider.querySelectorAll('.sld'));
            this.cursors = [].slice.call(this.cursor.querySelectorAll('.cursor'));
            //添加节点事件
            this._addEvent();
            //自动播放
            this._autoPlay();
        },
        //添加节点
        _addNode: function(num) {
            for (var i = 0; i < num; i++) {
                var img = document.createElement('img'),
                    a = document.createElement('a'),
                    sld = document.createElement('div');
                img.src = this.images[i];
                img.alt = "banner";
                a.href = this.href[i];
                a.target = this.target;
                a.appendChild(img);
                sld.appendChild(a);
                sld.className = "sld";
                this.slider.insertBefore(sld, this.cursor);
                var pointer = document.createElement('i');
                pointer.className = "cursor";
                pointer.index = i;
                this.cursor.appendChild(pointer);
            }
        },
        //添加节点事件,鼠标移入移出,清除和添加自动播放;
        _addEvent: function() {
            var that = this;
            this.cursors.forEach(function(node) {
                Event.addHandler(node, "click", function() {
                    that.nav(node.index);
                })
            });
            Event.addHandler(this.cursor, "mouseover", function() {
                clearInterval(that.timer);
            })
            this.slds.forEach(function(node) {
                Event.addHandler(node, "mouseover", function() {
                    clearInterval(that.timer);
                })
                Event.addHandler(node, "mouseout", function() {
                    that._autoPlay();
                })
            });
        },
        //自动播放
        _autoPlay: function() {
            var that = this;
            that.timer = setInterval(function() {
                that.pageIndex++;
                that.pageIndex %= 3;
                that.nav(that.pageIndex);
            }, 5000)
        },
        //页面跳转
        nav: function(pageIndex) {
            this.pageIndex = pageIndex;
            this._calcSlide();
        },
        //slider样式更新
        _calcSlide: function() {
            this.slds.forEach(function(node) {
                util.delClass(node, 'z-crt')
            })
            util.addClass(this.slds[this.pageIndex], 'z-crt');
            this._active();
        },
        //cursor样式更新
        _active: function() {
            var pageIndex = this.pageIndex
            this.cursors.forEach(function(cursor, index) {
                util.delClass(cursor, 'z-crt')
                if (index === pageIndex) {
                    util.addClass(cursor, 'z-crt');
                }
            })
        }
    });
    var slider = new Slider({
        //视口容器
        container: document.querySelector(".g-sld"),
        // 图片链接
        images: ["./images/banner1.jpg", "./images/banner2.jpg", "./images/banner3.jpg"],
        // 超链接
        href: ["http://open.163.com/", "http://study.163.com", "http://www.icourse163.org/"],
        target: ["_blank"],
    });
    slider.nav(0)
})();


/**
 * 课程获取
 */
(function() {
    // 三个模块的容器
    var tabc = document.querySelector(".m-tab");
    var pagec = document.querySelector(".m-page");
    var coursec = document.querySelector(".m-courses");

    /**
     * Tab 组件,需要传入
     *     1模块容器container: tabc,
     *     2按钮请求数据的类型type: [ 10, 20 ],
     *     3名字name: [ "产品设计", "编程语言" ],
     *     4请求数据的url: "http://study.163.com/webDev/couresByCategory.htm",
     * 初始化时,给容器添加按钮节点,添加点击事件监听;
     * 通过监听get事件传出:
     *     1被点击的按钮btn: node,
     *     2被点击按钮的类型type: that.type[ index ],
     *     3请求数据的url: that.url,
     */
    function Tab(opt) {
        util.extend(this, opt);
        this.container = this.container || document.body;
        this.name = this.name;
        this._initial();
    }
    util.extend(Tab.prototype, emitter);
    util.extend(Tab.prototype, {
        _initial: function() {
            this._layout();
            this._Event();
        },
        _layout: function() {
            //根据名字的长度添加tab的个数
            var name = this.name;
            var len = name.length;
            for (var i = 0; i < len; i++) {
                var container = document.createElement("div");
                container.innerText = name[i];
                container.textContent = name[i];
                container.className = "tab";
                this.container.appendChild(container);
            }
            this.tabs = [].slice.call(this.container.querySelectorAll(".tab"));
        },
        _Event: function() {
            //添加点击事件监听
            var that = this;
            this.tabs.forEach(function(node, index) {
                Event.addHandler(node, "click", function() {
                    that._check(node);
                    that.emit('click', {
                        btn: node,
                        type: that.type[index],
                        url: that.url,
                    });
                })
            })
        },
        //供外部使用,可以用于 页面加载后 展示第几个tab的内容
        click: function(index) {
            this.emit('click', {
                btn: this.tabs[index],
                type: this.type[index],
                url: this.url,
            });
            this._check(this.tabs[index]);
        },
        //更新检查按钮样式;是否是crt被选中;
        _check: function(node) {
            for (var i = 0; i < this.tabs.length; i++) {
                util.delClass(this.tabs[i], "crt");
            }
            util.addClass(node, "crt");
        },
    })

    /**
     * Get组件 需要传入
     *     1请求的url: args.url,
     *     2请求的类型type: args.type,
     *     3第几页pageNO: 1,
     *     4宽屏请求的数量wide: 20,
     *     5窄屏请求的数量narrow: 15,
     * 初始化 判断浏览器客户端的宽度;请求不同的课程数量;
     * 获取数据成功,注册get事件;
     * 通过监听get事件可获得 
     *     传出请求返回的数据;和之前传入的参数;
     */
    function Get(opt) {
        util.extend(this, opt);
        this.url = this.url || "";
        this.pageNo = this.pageNo || 1;
        this.size = this.size || 12;
        this.type = this.type || 10;
        this._initial();
    }
    util.extend(Get.prototype, emitter);
    util.extend(Get.prototype, {
            _initial: function() {
                this._size();
                this.get();
            },
            _size: function() {
                /**
                 * 根据屏幕大小,调整请求数量
                 * IE8无法根据屏幕调整宽度;结果是显示的是宽屏样式;
                 * 所以也要请求20个课程;
                 */
                if (document.body.offsetWidth >= 1205 || document.body.firstChild.offsetWidth >= 1205) {
                    this.size = this.wide || 20;
                } else {
                    this.size = this.narrow || 15;
                }
            },
            //传出数据
            get: function() {
                var that = this;
                get(this.url, { pageNo: this.pageNo, psize: this.size, type: this.type }, function(responeText) {
                    that.data = JSON.parse(responeText);
                    that.emit('get', {
                        data: that.data,
                        url: that.url,
                        pageNO: that.pageNO,
                        wide: that.wide,
                        narrow: that.narrow,
                        type: that.type,
                        len: that.data.pagination.totlePageCount,
                        pageIndex:that.data.pagination.pageIndex
                    })
                });
            },
        })
        /**
         * Course 组件
         * 需要传入数据,和容器; 将数据分析后,添加到容器;
         */
    function Course(opt) {
        util.extend(this, opt);
        this.data = this.data;
        this.container = this.container;
        this._initial();
    }
    util.extend(Course.prototype, {
        _initial: function() {
            this._clear(this.container);
            this._compute(this.data);
        },
        // 清除容器所有子节点
        _clear: function(node) {
            while (node.childNodes.length > 0) {
                node.removeChild(node.firstChild);
            }
        },
        //数据包分解,解压
        _compute: function(data) {
            var list = data.list;
            for (var i = 0; i < list.length; i++) {
                this._analytical(list[i]);
            }
        },
        //单个数据解析
        _analytical: function(data) {
            var middlePhotoUrl = data.middlePhotoUrl,
                name = data.name,
                provider = data.provider,
                learnerCount = data.learnerCount,
                price = data.price,
                categoryName = data.categoryName,
                description = data.description;
            price = !price ? "免费" : '&yen;' + Number(price).toFixed(2);
            categoryName = !categoryName ? "无" : categoryName;
            // 添加节点
            this._appendChild(middlePhotoUrl, name, provider, learnerCount, price, categoryName, description);
        },
        //添加到容器
        _appendChild: function(middlePhotoUrl, name, provider, learnerCount, price, categoryName, description) {
            var template = '<img class="img" src="' + middlePhotoUrl + '">\
            <p class="name f-toe">' + name + '</p>\
            <div class="provider">' + provider + '</div>\
            <div class="learnerCount"><span>' + learnerCount + '</span></div>\
            <div><strong class="price">' + price + '</strong></div>\
            <div class="detail">\
                <div class="up f-cb">\
                    <img class="img f-fl" src="' + middlePhotoUrl + '">\
                    <div class="cnt f-fl">\
                        <p class="name">' + name + '</p>\
                        <span class="learnerCount">' + learnerCount + '人在学</span>\
                        <div class="provider">发布者：' + provider + '</div>\
                        <div class="categoryName">分类：' + categoryName + '</div>\
                    </div>\
                </div>\
                    <p class="description">' + description + '</p>\
            </div>';
            var course = document.createElement("div");
            course.className = "course f-fl";
            course.innerHTML = template;
            this.container.appendChild(course);
        },
    });

    /**
     * Pointer组件 需要传入
     *     1一行显示的个数,也就是一组,比如1-8页 maxLength: 8,
     *     2指示器的长度length: args.data.pagination.totlePageCount,
     *     3指示器的容器container: pagec,
     */
    function Pointer(opt) {
        util.extend(this, opt);
        // 指示器是分组显示,1-8,9-16,默认第一组
        this.group = 0;
        this.index = 1;
        this._initial();
    }
    util.extend(Pointer.prototype, emitter);
    util.extend(Pointer.prototype, {
            _initial: function() {
                //默认第一页;
                this.nav(1);
                this._check();
            },
            // 判断当前页数的组,如果组数改变,则删除原有指示器,重新添加新的指示器
            _groupCalcula: function(index) {
                var a = Math.floor((index - 1) / (this.maxLength));
                if (this.group != a) {
                    this.group = a;
                }
                this._appendChild(this.group);
            },
            //跳转页面,
            nav: function(index) {
                if (this.index == index) {
                    return;
                }
                
                this.emit('nav', { pageIndex: index });
            },
            // 节点创建添加
            _appendChild: function(num) {
                // 清除原有容器的
                while (this.container.childNodes.length > 0) {
                    this.container.removeChild(this.container.firstChild);
                }
                var first = num * this.maxLength + 1;
                var last = (num + 1) * this.maxLength;
                // 如果最后一组不足8个,也添加8个指示器
                if (last >= this.length) {
                    last = this.length;
                    first = this.length - this.maxLength;
                    // 整个指示器长度不足
                    first = first > 0 ? first : 1;
                }
                this._createBtn("prev");
                if (this.group != 0) {
                    this._create(1);
                    this._createBtn("...", true);
                }
                for (var i = first; i <= last; i++) {
                    this._create(i);
                    if (i == last && last != this.length) {
                        this._createBtn("...", true);
                        this._create(this.length);
                    }
                }
                this._createBtn("next");
                this.pages = [].slice.call(this.container.querySelectorAll(".pageNo"));
            },
            _create: function(index) {
                var csr = document.createElement("a");
                csr.className = "pageNo";
                csr.textContent = index;
                csr.innerText = index;
                csr.index = index;
                var that = this;
                Event.addHandler(csr, "click", function() {
                    that.nav(csr.index);
                })
                this.container.appendChild(csr);
            },
            _createBtn: function(clazz) {
                var btn = document.createElement("button");
                var that = this;
                if (clazz == "prev") {
                    btn.className = clazz;
                    Event.addHandler(btn, "click", function() {
                        if (that.index > 1) {
                            that.nav(that.index - 1)
                        }
                    })
                    this.prev = btn;
                } else if (clazz == "next") {
                    btn.className = clazz;
                    Event.addHandler(btn, "click", function() {
                        if (that.index < that.length) {
                            that.nav(that.index + 1);
                        }
                    })
                    this.next = btn;
                } else {
                    btn.className = "ellipsis";
                    btn.textContent = "...";
                    btn.innerText = "...";
                    btn.disabled = true;
                }
                this.container.appendChild(btn);
            },
            _disablePage: function(node, disabled) {
                if (disabled) {
                    util.addClass(node, "js-disabled")
                } else {
                    util.delClass(node, "js-disabled")
                }
                node.disabled = !!disabled;
            },
            _check: function() {
                // 如果是第一页,那么上一页按钮不可用
                this._groupCalcula(this.index);
                if (this.index == 1) {
                    this._disablePage(this.prev, true);
                } else {
                    this._disablePage(this.prev, false);
                }
                //如果是最后一页,那么下一页按钮不可用
                if (this.index == this.length) {
                    this._disablePage(this.next, true);
                } else {
                    this._disablePage(this.next, false);
                }
                var that = this;
                this.pages.forEach(function(node) {
                    util.delClass(node, "select");
                    if (node.textContent == that.index) {
                        util.addClass(node, "select");
                    }
                })
            },
        })
        // -------------------------------------------------
        // 新建tab,设置容器,类型,名字,地址
    var tabA = new Tab({
        container: tabc,
        type: [10, 20],
        name: ["产品设计", "编程语言"],
        url: "http://study.163.com/webDev/couresByCategory.htm",
    });
    tabA.on("click", function(args) {
        // tab被点击,则去获取相应的数据,默认第一页;
        var getData = new Get({
            url: args.url,
            type: args.type,
            pageNO: 1,
            wide: 20,
            narrow: 15,
        });

        //得到了数据,则解析数据,填充课程容器;
        getData.on("get", function(args) {
            var course = new Course({
                data: args.data,
                container: coursec,
            });
            // 同时根据数据的长度,创建指示器的长度
            var pointer = new Pointer({
                maxLength: 8,
                length: args.len,
                container: pagec,
            });
            var that = args
            pointer.on("nav", function(args) {
                // 每个指示器获取对应的页面
                var getData = new Get({
                    url: that.url,
                    pageNo: args.pageIndex,
                    wide: that.wide,
                    narrow: that.narrow,
                    type: that.type,
                });
                var thatPointer = this; 
                getData.on("get", function(args) {
                    thatPointer.index = args.pageIndex;
                    thatPointer._check();
                    // 填充课程
                    var course = new Course({
                        data: args.data,
                        container: coursec,
                    })
                })
            })
        })
    });
    // 页面载入,默认选择第一个tab
    tabA.click(0);
})();
/**
 *  视频播放;
 *  拥有以下功能;
 *     Enter键进入或退出全屏;;
 *     点击背景遮罩关闭视频;
 *     点击视频,切换播放状态;
 *     双击视频,切换全屏状态
 *     Esc退出全屏状态,再按Esc就关闭视频;
 *     播放结束后,自动退出全屏状态;
 */
(function(container) {
    // 通过添加或取消容器的display:none;来实现显示隐藏
    // 播放按钮
    var btn = container.querySelector(".video-mask");
    //视频容器
    var videoc = document.querySelector(".videoc");
    var close = videoc.querySelector(".close");
    var background = videoc.querySelector(".mask");
    //视频节点
    var myVideo = videoc.getElementsByTagName('video')[0];
    // 弹出视频
    Event.addHandler(btn, "click", function() {
        util.delClass(videoc, "f-vh");
        videoShow(myVideo);
    });
    //切换播放状态;
    Event.addHandler(myVideo, "click", function() { toggleplayPause(myVideo); });
    // 切换全屏状态
    Event.addHandler(myVideo, "dblclick", function(event) { togglefullScreen(myVideo); });
    // 关闭弹窗
    Event.addHandler(close, "click", function() {
        util.addClass(videoc, "f-vh");
        videoPause(myVideo);
    });
    // 关闭弹窗
    Event.addHandler(background, "click", function() {
        util.addClass(videoc, "f-vh");
        videoPause(myVideo);
    });
    // 播放结束后,退出全屏状态
    Event.addHandler(myVideo, "ended", function() { exitFullscreen(myVideo); });
    // Enter键进入或退出全屏;Esc关闭视频;
    Event.addHandler(document, "keydown", function(event) {
        if (event.keyCode == 13) {
            togglefullScreen(myVideo);
        }
        if (event.keyCode == 27) {
            if (!isVideoInFullsreen()) {
                util.addClass(videoc, "f-vh");
                videoPause(myVideo);
            }
        }
    });
    // 播放
    function videoShow(video) { video.play(); }
    //暂停
    function videoPause(video) { video.pause(); }
    //播放或者暂停切换      
    function toggleplayPause(video) {
        if (video.paused) video.play();
        else video.pause();
    }
    //全屏状态切换;
    function togglefullScreen(video) {
        if (isVideoInFullsreen()) {
            exitFullscreen(video);
        } else {
            requestFullScreen(video);
        }
    }
    //进入全屏 IE自带双击进入退出全屏;和暂停播放;就没写了
    function requestFullScreen(video) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.mozRequestFullScreen) {
            myVideo.mozRequestFullScreen();
        }
    }
    //退出全屏
    function exitFullscreen(video) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }
    // 判断是否是video全屏; ESC键需要用到;所有没有删除IE私有属性
    function isVideoInFullsreen() {
        if (document.mozFullScreenElement && document.mozFullScreenElement.nodeName == 'VIDEO') {
            return true;
        } else if (document.webkitFullscreenElement && document.webkitFullscreenElement.nodeName == 'VIDEO') {
            return true;
        } else if (document.msFullscreenElement && document.msFullscreenElement.nodeName == "VIDEO") {
            return true;
        }
        return false;
    }
})(document.querySelector(".m-intro"));

/**
 * 最热排行,滚动更新;
 * 滚动实现
 *     最开始是通过,removeChild,appendChild;
 *     后来觉得这样长时间的操作节点,对浏览器的性能影响较大;而且没有动画效果;
 *     就通过transitionY();来不断变化Y方向的值;
 *     兼容IE8 ;就改成 变换top值;
 * 数据填充
 *     因是通过变换top实现;所以是一次性添加了30个课程;
 *     容器设置 overflow:hidden;
 *     在前面20门课程走完后,
 *     页面显示的是后面10门课;
 *     [1-20 不可视][1-10 可视]
 *     然后将top变为0;还原初始状态;
 */
(function(container) {
    var hotc = container.querySelector(".hotc");
    initial();
    // 初始化
    function initial() {
        getData();
        
    }
    // 获取数据
    function getData() {
        var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
        get(url, "", function(responseText) {
            var data = JSON.parse(responseText);
            compute(data);
        });
    }
    // 分解数据;
    function compute(data) {
        while (hotc.childNodes.length > 0) {
            hotc.removeChild(hotc.firstChild);
        }
        for (var i = 0; i < data.length; i++) {
            deal(data, i);
        }
        // 再添加10门课程;
        for (var i = 0; i < 10; i++) {
            deal(data, i);
        }
        animation(data.length);
    }
    // 滚动动画
    function animation(len) {
        var top = 0;
        var itemHeight = 70;
        var duration = 1000;
        hotc.style.transitionDuration = duration + 'ms';
        var timer = setInterval(function() { roll(); }, 5000);

        function roll() {
            top -= itemHeight;
            hotc.style.top = top + "px";
            if (top == -len*itemHeight) {
                // 当走完一轮后;在动画结束后,将top变为0
                setTimeout(function() {
                    hotc.style.transitionDuration = '0s';
                    top = 0;
                    hotc.style.top = "0px";
                }, duration + 20);
                // 将动画时间还原;
                setTimeout(function() {
                    hotc.style.transitionDuration = duration + 'ms';
                }, duration + 50);
            }
        }
    }
    // 拆解数据
    function deal(data, index) {
        var smallPhotoUrl = data[index].smallPhotoUrl,
            name = data[index].name,
            learnerCount = data[index].learnerCount;
        appendChild(smallPhotoUrl, name, learnerCount);
    }
    // 添加课程
    function appendChild(smallPhotoUrl, name, learnerCount) {
        var template = '<img class="img f-fl" src="' + smallPhotoUrl + '" alt="">\
                        <h4 class="coursename f-toe">' + name + '</h4>\
                        <div class="learnerCount"><span >' + learnerCount + '</span></div>';
        var hotCourse = document.createElement("a");
        hotCourse.className = "hot f-cb";
        hotCourse.innerHTML = template;
        hotc.appendChild(hotCourse);
    }
})(document.querySelector(".m-hot"));
