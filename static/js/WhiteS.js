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
$ws.toast = function(content,toastType,timeOut=2000){
    let dom = document.createElement('div');
    dom.className = 'ws-toast';
    dom.innerHTML = 
    `
        <div class="ws-toast-content">
            <div class="ws-toast-span">${content}<div>
        </div>
    `;
    switch(toastType){
        case 'error':dom.classList.add('ws-toast-error');break;
    }
    document.body.appendChild(dom);
    setTimeout(()=>{
        dom.classList.add('ws-toast-none');
        setTimeout(()=>{
            dom.remove();
        },300)
    },timeOut+300)//这里加时间是为了除去进入的动画时间
}
/**
 * loading
 */
$ws.loading = function(bool=true){
    let node = document.getElementById('ws-loading-box-thdlx1');
    if(bool){
        //判断如果存在一个loading则不创建
        if(node){return};
        //创建loading
        var dom =  document.createElement('div');
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
    }else{
        //判断如果不存在则直接退出
        if(!node){return};
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
 * 挂在一个jquery上面的
 */
$ws.ajax = function(pro={}){
    let _pro = {
        url:pro.url,
        data:pro.data,
        success:pro.success,
        fail:pro.fail,
    }
    $ws.loading(true);
    $.ajax({
        type: "POST",
        url: _pro.url,
        dataType: "json",
        data: _pro.data,
        success: function(res) {
            if (res.errcode==0) {
                _pro.success&&_pro.success(res.errmsg);
            } else {
                $ws.toast(res.errmsg, 'error');
                _pro.fail&&_pro.fail();
            }
            $ws.loading(false);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $ws.loading(false);
            $ws.toast(`${textStatus}:${errorThrown}`, 'error');
        },
    });
}

