/**
 * WhiteS 插件 中文译名‘留白’
 */
/**
 * 用于基本使用的基础函数组
 */
let docDom = document.querySelector;

let $ws = {};
window.$ws = $ws;
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
                ${_pro.isCancel?'<div class="ws-modal-foot-item ws-modal-foot-cancel">'+_pro.cancelText+'</div>':''}
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
    dom.querySelector('.ws-modal-box').addEventListener('click', e => {
        //防止点击内部的时候页面关闭
        //阻止、事件冒泡
        e.stopPropagation();
    })
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
        _pro.onConfirm && _pro.onConfirm(emit)
    })
}
/**
 * 创建一个侧边标签栏
 * 对象
 */
$ws.sidecon = {
    dom: undefined,
    bodyWidth: 0,
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
        dom = document.createElement('div');
        dom.id = 'ws-sidecon';
        dom.className = "ws-sidecon";
        // 添加内部div
        dom.innerHTML =
            `
            <div class="ws-modal-bg"></div>
            <div class="ws-sidecon-box">
                <div class="ws-sidecon-head">
                    <div class="ws-sidecon-label-box"></div>
                    <div class="ws-sidecon-head-close"><div class="ws-sidecon-label-close"></div></div>
                </div>
                <div class="ws-sidecon-content"></div>
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
            me.hidden();
        })
        //添加到实例
        me.dom = dom;
        return dom;
    },
    //销毁侧边栏标签库
    close() {
        let me = $ws.sidecon;
        me.dom.classList.add('ws-sidecon-hidden');
        setTimeout(() => {
            //解锁当前页面，防止页面滚动
            document.body.style.overflow = null;
            //取消固定body的宽度，保证不会因为添加滚动条而产生抖动
            document.body.style.width = me.bodyWidth;
            me.dom.remove();
            me.dom = undefined;
        }, 250)
    },
    //侧边标签库出现
    show() {
        let me = $ws.sidecon;
        me.dom.style.display = "block";
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
            me.dom.classList.remove('ws-sidecon-hidden');
            me.dom.style.display = "none";
        }, 250)
    },
    //为侧边标签库添加新的页签
    add(pro = {}) {
        let me = $ws.sidecon;
        let _pro = {
            title: pro.title || '新建页签',
            content: pro.content || ''
        }
        //添加标签页
        let labelBox = me.dom.querySelector('.ws-sidecon-label-box');
        let labelDom = document.createElement('div');
        //添加标签
        labelDom.className = 'ws-sidecon-label ws-sidecon-label-select';
        labelDom.innerHTML =
        `
            <span>${_pro.title}</span><div class="ws-sidecon-label-close"></div>
        `
        labelBox.appendChild(labelDom);
        //为删除页签按钮添加事件
        labelDom.querySelector('.ws-sidecon-label-close').addEventListener('click',function(e){
            //阻止、事件冒泡
            e.stopPropagation();
            me.closeLabel(e.target.parentElement)
        })
        //为页签按钮添加事件
        labelDom.addEventListener('click',function(e){
            me.labelShow(labelDom)
        })
        //将内容数据进行保存
        labelDom._innerHTML = _pro.content;
        //将数据添加到标签库中
        let labelList =  me.dom.querySelectorAll('.ws-sidecon-label');
        //当标签栏不止一个标签栏的时候
        me.labelShow(labelDom);
    },
    //删除一个标签
    closeLabel(dom){
        let me = $ws.sidecon;
        let labelList =  me.dom.querySelectorAll('.ws-sidecon-label');
        //删除标签
        // selectDomList[index].remove();
        if(labelList.length<=1){
            //当页签只剩余一个的时候，将直接清除掉侧边展示栏
            me.close();
        }else{
            //当点击的就是选择页签的时候
            if(dom.classList.contains("ws-sidecon-label-select")){
                //当存在后一个兄弟的时候
                if(dom.nextSibling){
                    me.labelShow(dom.nextSibling);
                }else{
                    me.labelShow(dom.previousSibling);
                }
            }
            //删除的为当前展示的
            dom.remove();
        }
    },
    //展示新的页签。
    labelShow(dom){
        let me = $ws.sidecon;
        let selectDomList = me.dom.querySelectorAll('.ws-sidecon-label');
        for(let i = 0;i<selectDomList.length;i++){
            if(selectDomList[i].classList.contains("ws-sidecon-label-select")){
                selectDomList[i].classList.remove('ws-sidecon-label-select');
            }
        }
        dom.classList.add('ws-sidecon-label-select');
        //添加内容页
        let contentDom = me.dom.querySelector('.ws-sidecon-content');
        contentDom.innerHTML = dom._innerHTML;
    },
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
                _pro.success && _pro.success(res.errmsg);
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
