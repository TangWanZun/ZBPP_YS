/**
 * WhiteS 插件 中文译名‘留白’
 */

((window) => {
    let $ws = {};
    window.$ws = $ws;
    /**
     * 功能区
     */
    $ws.uuid = function(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
    /**
     * 创建一个toast
     */
    $ws.toast = function(content, pro = {}) {
        let _pro = {
            // 类型
            toastType: typeof pro == 'string' ? pro : pro.type,
            interval: pro.interval || 2000,
            callback: pro.callback,
        }
        let dom = document.createElement('div');
        dom.className = 'ws-toast';
        dom.innerHTML =
            `
        <div class="ws-toast-content">
            <div class="ws-toast-span">${content}<div>
        </div>
    `;
        switch (_pro.toastType) {
            case 'error':
                dom.classList.add('ws-toast-error');
                break;
        }
        document.body.appendChild(dom);
        setTimeout(() => {
            dom.classList.add('ws-toast-none');
            setTimeout(() => {
                dom.remove();
                _pro.callback && _pro.callback();
            }, 300)
        }, _pro.interval + 300) //这里加时间是为了除去进入的动画时间
    }
    /**
     * loading
     */
    $ws.loading = function(bool = true) {
        let node = document.getElementById('ws-loading-box-thdlx1');
        if (bool) {
            //判断如果存在一个loading则不创建
            if (node) {
                return
            };
            //创建loading
            var dom = document.createElement('div');
            dom.className = 'ws-loading-box';
            dom.id = 'ws-loading-box-thdlx1';
            dom.innerHTML =
                `
        <div class="ws-loading">
          <div class="ws-loading-dot"></div>
          <div class="ws-loading-dot"></div>
          <div class="ws-loading-dot"></div>
          <div class="ws-loading-dot"></div>
          <div class="ws-loading-dot"></div>
        </div>
        `;
            document.body.appendChild(dom);
        } else {
            //判断如果不存在则直接退出
            if (!node) {
                return
            };
            node.remove();
        }
    }
    /**
     * 创建一个modal
     */
    $ws.modal = function(pro = {}) {
        //获取缓存信息
        let bodyWidth = document.body.style.width;
        //复写默认
        let _pro = {
            confirmText: pro.confirmText || '确认',
            cancelText: pro.cancelText || '取消',
            headText: pro.headText || '',
            content: pro.content || '',
            //是否需要展示取消按钮
            isCancel: typeof pro.isCancel == 'boolean' ? pro.isCancel : true,
            //是否需要点击esc关闭页面事件
            isEsc: typeof pro.isEsc == 'boolean' ? pro.isEsc : true,
            onConfirm: pro.onConfirm,
        }
        //创建一个包裹的div
        let dom = document.createElement('div');
        dom.className = "ws-modal";
        // 添加内部div
        dom.innerHTML =
            `
                <div class="ws-modal-box">
                    <div class="wx-modal-head">${_pro.headText}</div>
                    <div class="wx-modal-content">${_pro.content}</div>
                    <div class="ws-modal-foot">
                        ${_pro.isCancel ? '<div class="ws-modal-foot-item ws-modal-foot-cancel">' + _pro.cancelText + '</div>' : ''}
        <div class="ws-modal-foot-item ws-modal-foot-confirm">${_pro.confirmText}</div>
    </div>
</div>
            `
        //添加到body上面
        document.body.appendChild(dom);
        //固定body的宽度，保证不会因为取消滚动条而产生抖动
        document.body.style.width = document.body.offsetWidth + 'px';
        //锁住当前页面，防止页面滚动
        document.body.style.overflow = 'hidden';
        /**
         * 添加内部的方法
         * 内部方法统一用下划线为前缀进行标识
         */
        //卸载当前modal
        function _close() {
            dom.classList.add('ws-modal-hidden');
            //解锁当前页面，防止页面滚动
            document.body.style.overflow = null;
            //取消固定body的宽度，保证不会因为添加滚动条而产生抖动
            document.body.style.width = bodyWidth;
            //取消当前点击esc退出页面事件
            window.removeEventListener('keyup', modalKeyUpEsc);
            setTimeout(() => {
                dom.remove();
            }, 220)
        }
        /**
         * 对外暴露的方法
         */
        let emit = {
            close: _close
        };
        /**
         * 添加内部事件
         */
        //阻止事件冒泡
        dom.querySelector('.ws-modal-box').addEventListener('click', e => {
            //防止点击内部的时候页面关闭
            //阻止、事件冒泡
            e.stopPropagation();
        })
        //点击esc执行关闭窗口事件
        function modalKeyUpEsc(e) {
            if (e.which == 27) {
                _close();
            }
        }
        //默认使用点击esc关闭窗口
        if (_pro.isEsc) {
            window.addEventListener('keyup', modalKeyUpEsc);
        }
        //点击模态框，页面消失
        //     dom.addEventListener('click', (e) => {
        //         _close();
        //     })
        //点击取消按钮，页面消失
        if (_pro.isCancel) {
            dom.querySelector('.ws-modal-foot-cancel').addEventListener('click', (e) => {
                _close();
            })
        }

        //点击确定按钮
        dom.querySelector('.ws-modal-foot-confirm').addEventListener('click', (e) => {
            _pro.onConfirm && _pro.onConfirm(emit);
        })
    }
    /**
     * 创建一个侧边标签栏
     * 对象
     */
    $ws.sidecon = {
        dom: undefined,
        bodyWidth: 0,
        //内容hash表
        contentHashList: {},
        //初始化
        init() {
            let me = $ws.sidecon;
            //当前侧边标签栏只会创建一个,当已经存在的时候,则取之前创建
            if (me.dom) {
                return me.dom;
            }
            //获取缓存信息
            let bodyWidth = document.body.style.width;
            me.bodyWidth = bodyWidth;
            let _pro = {

            }
            //创建一个包裹的div
            let dom = document.createElement('div');
            dom.id = 'ws-sidecon';
            dom.className = "ws-sidecon";
            // 添加内部div
            dom.innerHTML =
                `
<div class="ws-sidecon-bg"></div>
<div class="ws-sidecon-box">
    <div class="ws-sidecon-head">
        <div class="ws-sidecon-label-box"></div>
        <div class="ws-sidecon-head-close"><div class="ws-sidecon-label-close"></div></div>
    </div>
    <div class="ws-sidecon-content-box">
    </div>
</div>
            `
            //添加到body上面
            document.body.appendChild(dom);
            //固定body的宽度，保证不会因为取消滚动条而产生抖动
            document.body.style.width = document.body.offsetWidth + 'px';
            //锁住当前页面，防止页面滚动
            document.body.style.overflow = 'hidden';
            /**
             * 添加内部事件
             */
            dom.querySelector('.ws-sidecon-box').addEventListener('click', e => {
                //防止点击内部的时候页面关闭
                //阻止、事件冒泡
                e.stopPropagation();
            })
            // 点击关闭按钮，页面进入隐藏状态
            dom.querySelector('.ws-sidecon-head-close').addEventListener('click', (e) => {
                // me.hidden();
                //因为程序在隐藏中存在BUG，暂时不启用，关闭则直接销毁
                me.close();
            })
            //默认开启点击esc关闭窗口事件
            window.addEventListener('keyup', me.keyUpEsc);
            //添加到实例
            me.dom = dom;
            return dom;
        },
        //监控点击esc事件
        keyUpEsc(e) {
            let me = $ws.sidecon;
            if (e.which == 27) {
                me.close();
            }
        },
        //销毁侧边栏标签库
        close() {
            let me = $ws.sidecon;
            me.dom.classList.add('ws-sidecon-hidden');
            //清除点击esc关闭窗口事件
            window.removeEventListener('keyup', me.keyUpEsc);
            setTimeout(() => {
                //解锁当前页面，防止页面滚动
                document.body.style.overflow = null;
                //取消固定body的宽度，保证不会因为添加滚动条而产生抖动
                document.body.style.width = me.bodyWidth;
                me.dom.remove();
                //清空内容页
                me.contentHashList.lengh = 0;
                me.dom = undefined;
            }, 250)
        },
        //侧边标签库出现
        show() {
            let me = $ws.sidecon;
            if (me.dom.classList.contains('ws-sidecon-hidden')) {
                //没有被销毁的情况下
                me.dom.classList.remove('ws-sidecon-hidden');
                setTimeout(() => {
                    me.dom.querySelector('.ws-sidecon-bg').style.display = "block";
                }, 150)
            } else {
                me.dom.style.display = "block";
            }
        },
        //隐藏侧边标签库
        hidden() {
            let me = $ws.sidecon;
            me.dom.classList.add('ws-sidecon-hidden');
            setTimeout(() => {
                //解锁当前页面，防止页面滚动
                document.body.style.overflow = null;
                //取消固定body的宽度，保证不会因为添加滚动条而产生抖动
                document.body.style.width = me.bodyWidth;
                me.dom.querySelector('.ws-sidecon-bg').style.display = "none";
            }, 250)
        },
        //为侧边标签库添加新的页签
        add(pro = {}) {
            let me = $ws.sidecon;
            let _pro = {
                title: pro.title || '新建页签',
                content: pro.content || '',
                id: pro.id || $ws.uuid(10),
                callback: pro.callback
            }
            //当存在_pro.id的时候
            if (_pro.id) {
                let labelList = me.dom.querySelectorAll('.ws-sidecon-label');
                //判断是否存在重复的_id
                for (let i = 0; i < labelList.length; i++) {
                    if (labelList[i]._id == _pro.id) {
                        //表示存在重复_id
                        //则展示词标签
                        me.labelShow(labelList[i])
                        //退出创建页签
                        return _pro.id;
                    }
                }
            }
            //添加标签页
            let labelBox = me.dom.querySelector('.ws-sidecon-label-box');
            let labelDom = document.createElement('div');
            //添加标签
            labelDom.className = 'ws-sidecon-label';
            //给页签赋予唯一标识符
            labelDom._id = _pro.id;
            labelDom.innerHTML =
                `
<span>${_pro.title}</span><div class="ws-sidecon-label-close"></div>
`
            labelBox.appendChild(labelDom);
            //为删除页签按钮添加事件
            labelDom.querySelector('.ws-sidecon-label-close').addEventListener('click', function(e) {
                //阻止、事件冒泡
                e.stopPropagation();
                me.closeLabel(e.target.parentElement)
            })
            //为页签按钮添加事件
            labelDom.addEventListener('click', function(e) {
                me.labelShow(labelDom);
            })
            //创建内容模块
            let contentBox = me.dom.querySelector('.ws-sidecon-content-box');
            let contentDom = document.createElement('div');
            contentDom.className = "ws-sidecon-content";
            contentDom.innerHTML = _pro.content;
            contentDom._id = _pro.id;
            contentBox.appendChild(contentDom);
            //并且将content添加到内容hash表中
            me.contentHashList[_pro.id] = contentDom;
            //将内容数据进行保存
            // labelDom._innerHTML = _pro.content;
            //展示添加页的内容
            me.labelShow(labelDom, function(contentDom2) {
                //当添加新的页面完成之后，回调，参数是内容的dom元素
                _pro.callback && _pro.callback(contentDom2)
            });
            //生成一个uuid
            // let _uuid = $ws.uuid(10);
            return _pro.id
        },
        //删除一个标签
        closeLabel(dom) {
            let me = $ws.sidecon;
            let labelList = me.dom.querySelectorAll('.ws-sidecon-label');
            //删除标签
            // selectDomList[index].remove();
            if (labelList.length <= 1) {
                //当页签只剩余一个的时候，将直接清除掉侧边展示栏
                me.close();
            } else {
                //当点击的就是选择页签的时候
                if (dom.classList.contains("ws-sidecon-label-select")) {
                    //当存在后一个兄弟的时候
                    if (dom.nextSibling) {
                        me.labelShow(dom.nextSibling);
                    } else {
                        me.labelShow(dom.previousSibling);
                    }
                }
                //删除的为当前展示的
                dom.remove();
                delete me.contentHashList[dom._id];
            }
        },
        //展示新的页签。
        labelShow(dom, callback) {
            let me = $ws.sidecon;
            if (me.dom.classList.contains('ws-sidecon-hidden')) {
                //表示处于收起状态
                //改变成打开状态
                me.show();
            }
            // let contentDom = me.dom.querySelector('.ws-sidecon-content');
            //将其他为显示的页签变成为不显示
            let selectDomList = me.dom.querySelectorAll('.ws-sidecon-label');
            for (let i = 0; i < selectDomList.length; i++) {
                if (selectDomList[i].classList.contains("ws-sidecon-label-select")) {
                    //当前为展示页面，这个时候需要缓存页面数据
                    // selectDomList[i]._innerHTML= contentDom.innerHTML;
                    selectDomList[i].classList.remove('ws-sidecon-label-select');
                    //取消展示内容
                    me.contentHashList[selectDomList[i]._id].style.display = 'none';
                }
            }
            //展示页签
            dom.classList.add('ws-sidecon-label-select');
            //展示内容
            // debugger
            me.contentHashList[dom._id].style.display = 'block';
            //添加内容页
            // contentDom.innerHTML = dom._innerHTML;
            //当每次展示新的页签结束后，都会有回调函数，参数就是内容页
            callback && callback(me.contentHashList[dom._id])
        },
    }
    /**
     * 创建一个翻页组件
     */
    $ws.page = function(pro = {}) {
        let _pro = {
            el: pro.el || '',
            url: pro.url || '',
            data: pro.data || {},
            callback: pro.callback,
            start: pro.start || 0,
            limit: pro.limit || 25
        }
        let dom = document.createElement('div');
        dom.innerHTML =
            `
    <div class="ws-page-box">
        <div class="ws-page-box-item ws-page-limit" id="ws-page-limitPage">
            共 1 页
        </div>
        <div class="ws-page-box-item ws-page-box-click">
            首页
        </div>
        <div class="ws-page-box-item ws-page-box-click">
            上一页
        </div>
        <div class="ws-page-box-item ws-page-limit" id="ws-page-newPage">
            当前为第 1 页
        </div>
        <div class="ws-page-box-item ws-page-box-click">
            下一页
        </div>
        <div class="ws-page-box-item ws-page-box-click">
            尾页
        </div>
        <div class="ws-page-box-item ws-page-limit" id="ws-page-total">
            共 0 条数据
        </div>
    </div>
    `
        //全部数量
        let total = 0;
        //当前页数
        let page = 1;
        //添加回调方法
        //改变总页数
        function selectTotal(callTotal) {
            total = callTotal;
            let allPage = Math.ceil(callTotal / _pro.limit);
            let clickList = dom.querySelectorAll('.ws-page-box-click');
            //判断部分按钮是否可用
            //判断是否存在上一页
            if ((page - 1) <= 0) {
                //不存在操作
                //上一页与首页隐藏
                clickList[0].style.display = 'none';
                clickList[1].style.display = 'none';
            } else {
                //上一页与首页隐藏
                clickList[0].style.display = 'block';
                clickList[1].style.display = 'block';
            }
            //判断是否存在下一页
            if ((page + 1) > allPage) {
                //不存在操作
                //下一页与尾页隐藏
                clickList[2].style.display = 'none';
                clickList[3].style.display = 'none';
            } else {
                clickList[2].style.display = 'block';
                clickList[3].style.display = 'block';
            }
            dom.querySelector('#ws-page-limitPage').innerHTML = `共 ${allPage} 页`;
            dom.querySelector('#ws-page-total').innerHTML = `共 ${callTotal} 条数据`;
        }
        //改变当前页数
        function selectPage(callPage) {
            //判断是否可以改变
            if (callPage <= 0 || callPage > Math.ceil(total / _pro.limit)) {
                //说明当前页数已经超过了
                return false;
            }
            page = callPage;
            dom.querySelector('#ws-page-newPage').innerHTML = `当前为第 ${callPage} 页`;
            return true;
        }
        //首先将会先运行一次回调
        _pro.callback({
            start: _pro.start,
            limit: _pro.limit
        }, function(callTotal) {
            //获取全部数据
            selectTotal(callTotal);
            //添加内部方法
            let clickList = dom.querySelectorAll('.ws-page-box-click');
            //首页
            clickList[0].addEventListener('click', () => {
                //更新页面
                _pro.start = 0;
                selectPage(1)
                _pro.callback({
                    start: _pro.start,
                    limit: _pro.limit
                }, selectTotal)
            })
            //上一页
            clickList[1].addEventListener('click', () => {
                //更新页面
                if (selectPage(page - 1)) {
                    _pro.start -= _pro.limit;
                    _pro.callback({
                        start: _pro.start,
                        limit: _pro.limit
                    }, selectTotal)
                }
            })
            //下一页
            clickList[2].addEventListener('click', () => {
                //更新页面
                if (selectPage(page + 1)) {
                    _pro.start += _pro.limit;
                    _pro.callback({
                        start: _pro.start,
                        limit: _pro.limit
                    }, selectTotal)
                }
            })
            //尾页
            clickList[3].addEventListener('click', () => {
                //更新页面
                let page = Math.ceil(callTotal / _pro.limit);
                _pro.start = _pro.limit * (page - 1);
                selectPage(page);
                _pro.callback({
                    start: _pro.start,
                    limit: _pro.limit
                }, selectTotal)
            })
        })
        //将创建好的翻页组件添加到el当中区
        if (typeof _pro.el == 'string') {
            document.querySelector(_pro.el).appendChild(dom);
        } else {
            _pro.el.appendChild(dom);
        }
        //添加对外暴露函数
        //刷新当前页
        function reset() {
            _pro.callback({
                start: _pro.start,
                limit: _pro.limit
            }, selectTotal);
        }
        return {
            reset
        }
    }
    /**
     * 挂在一个jquery上面的
     */
    $ws.ajax = function(pro = {}) {
        let _pro = {
            url: pro.url,
            data: pro.data,
            success: pro.success,
            fail: pro.fail,
        }
        $ws.loading(true);
        $.ajax({
            type: "POST",
            url: _pro.url,
            dataType: "json",
            data: _pro.data,
            success: function(res) {
                if (res.errcode == 0) {
                    _pro.success && _pro.success(res);
                } else {
                    $ws.toast(res.errmsg, 'error');
                    _pro.fail && _pro.fail();
                }
                $ws.loading(false);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $ws.loading(false);
                $ws.toast(`${textStatus}:${errorThrown}`, 'error');
            },
        });
    }
})(window)
