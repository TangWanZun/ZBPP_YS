(($ws, $,window) => {
    //全局保存常亮
    const CMP_STATUS = {
        WAIT: {
            code: 'Wait',
            name: '待审核'
        },
        SUCCESS: {
            code: 'Success',
            name: '审核通过'
        },
        DISABLE: {
            code: 'Disable',
            name: '停用'
        }
    }
    //创建一个翻页
    let cmpListPage = $ws.page({
        el: "#page",
        callback(e, selectPage) {
            //获取公司数据
            getList(e, selectPage);
        }
    })
    //获取公司数据
    function getList(e, selectPage) {
        //首先清空数据
        let titleTr = $('#cmpTable').find('tr')[0];
        $('#cmpTable').html(titleTr);
        $ws.ajax({
            url: '../User/GetRegisterList',
            data: {
                start: e.start,
                limit: e.limit
            },
            success(res) {
                //公司数据数据
                let dataList = res.data;
                let tableDom = $('#cmpTable');
                for (let x = 0; x < dataList.length; x++) {
                    let item = dataList[x];
                    //获取状态
                    let statusName = '';
                    switch (item.DocStatus) {
                        case CMP_STATUS.SUCCESS.code: statusName = CMP_STATUS.SUCCESS.name; break;
                        case CMP_STATUS.DISABLE.code: statusName = CMP_STATUS.DISABLE.name; break;
                        default: statusName = CMP_STATUS.WAIT.name; break;
                    }
                    let eleHTML = `
                        <tr class="table-tr">
                            <td>${item.UserName || '-'}</td>
                            <td>${item.Introduction || '-'}</td>
                            <td>${item.Phone || '-'}</td>
                            <td>${item.Address || '-'}</td>
                            <td>${item.UserCode || '-'}</td>
                            <td>${statusName}</td>
                            <td>
                                <span class="table-btn">信息修改</span>
                                <span class="table-btn" _id="${item.Id}">登录日志</span>
                                <br/>
                                <span class="table-btn">密码重置</span>
                                <span class="table-btn" _id="${item.Id}">接口日志</span>
                            </td>
                        </tr>
                        `
                    let dom = $(eleHTML);
                    let btnList = dom.find('.table-btn');
                    //添加信息修改
                    btnList[0].addEventListener('click', function () {
                        infoModify(btnList[0], {
                            id: item.Id,
                            userCode: item.UserCode,
                            userName: item.UserName,
                            introduction: item.Introduction,
                            phone: item.Phone,
                            address: item.Address,
                            docStatus: item.DocStatus
                        });
                    })
                    //添加登录日志
                    btnList[1].addEventListener('click', function () {
                        showLoginInfo(btnList[1], item.UserCode, item.UserName);
                    })
                    //添加密码重置
                    btnList[2].addEventListener('click', function () {
                        passwordReset(btnList[2], item.UserCode, item.UserName);
                    })
                    //添加接口日志
                    btnList[3].addEventListener('click', function () {
                        showInterfaceInfo(btnList[3], item.AppKey, item.UserName);
                    })
                    tableDom.append(dom)
                }
                selectPage(res.total);
            }
        })
    }
    //退出登录
    $('#adminSignOut').on('click', function () {
        $ws.modal({
            headText: '提示',
            confirmText: '确定',
            content: '确定要退出登录吗？',
            onConfirm(e) {
                $ws.ajax({
                    url: "../User/LoginOut",
                    success: function () {
                        window.location.href = "../user/index";
                    }
                });
            }
        });
    })
    //管理员密码修改
    $('#adminInfoModify').on('click', function () {
        $ws.modal({
            headText: '管理员密码修改',
            confirmText: '确定修改',
            content: `
        <div class="login-row">
            <div class="ws-input-text">
                <div class="ws-input-left input-img-st">
                </div>
                <input type="password" placeholder="请输入当前密码" id="p-pwd1" />
                <label class="ws-input-box"></label>
            </div>
        </div>
        <div class="login-row">
            <div class="ws-input-text">
                <div class="ws-input-left input-img-st">
                </div>
                <input type="password" placeholder="请输入密码"  id="p-pwd2"/>
                <label class="ws-input-box"></label>
            </div>
        </div>
        <div class="login-row">
            <div class="ws-input-text">
                <div class="ws-input-left input-img-st"></div>
                <input type="password" placeholder="请再次确认密码" id="p-pwd3"/>
                <label class="ws-input-box"></label>
            </div>
        </div>
        `,
            onConfirm(e) {
                //判断数据是否存在问题
                let pwd1 = $('#p-pwd1').val().trim();
                let pwd2 = $('#p-pwd2').val().trim();
                let pwd3 = $('#p-pwd3').val().trim();
                if (pwd1.length == 0) {
                    $ws.toast('请输入当前密码', 'error');
                    return
                }
                if (pwd2.length == 0) {
                    $ws.toast('请输入新密码', 'error');
                    return
                }
                if (pwd3.length == 0) {
                    $ws.toast('请再次确认密码', 'error');
                    return
                }
                if (pwd2 !== pwd3) {
                    $ws.toast('新密码与确认密码输入不一致', 'error');
                    return;
                }
                $ws.ajax({
                    url: "../User/ModifyPsw",
                    data: {
                        OldPsw: pwd1,
                        Psw: pwd2,
                        Psw2: pwd3
                    },
                    success() {
                        e.close();
                        $ws.toast('密码修改成功，请重新登陆', {
                            callback: function () {
                                window.location.href = "../user/index";
                            }
                        });
                    }
                });
            }
        });
    })
    //信息修改
    function infoModify(dom, data = {}) {
        $ws.modal({
            headText: '信息修改',
            confirmText: '确定修改',
            content: `
            <div class="login-row">
                <div class="ws-input-text">
                    <div class="ws-input-left input-img-yh">
                    </div>
                    <input value="${data.userCode || '-'}" placeholder="请输入用户名(用于登录,4到13位字母或数字组合)*" id="info-userCode" />
                    <label class="ws-input-box"></label>
                </div>
            </div>
            <div class="login-row">
                <div class="ws-input-text">
                    <div class="ws-input-left input-img-gs">
                    </div>
                    <input value="${data.userName || '-'}" placeholder="请输入公司名称*" id="info-userName" />
                    <label class="ws-input-box"></label>
                </div>
            </div>
            <div class="login-row">
                <div class="ws-input-text">
                    <div class="ws-input-left input-img-js">
                    </div>
                    <input value="${data.introduction || '-'}"  placeholder="请输入介绍" id="info-introduce" />
                    <label class="ws-input-box"></label>
                </div>
            </div>
            <div class="login-row">
                <div class="ws-input-text">
                    <div class="ws-input-left input-img-lxdh">
                    </div>
                    <input value="${data.phone || '-'}" placeholder="请输入联系电话*" type="tel" id="info-phone"/>
                    <label class="ws-input-box"></label>
                </div>
            </div>
            <div class="login-row">
                <div class="ws-input-text">
                    <div class="ws-input-left input-img-dz">
                    </div>
                    <input value="${data.address || '-'}" placeholder="请输入所在地址" id="info-address" />
                    <label class="ws-input-box"></label>
                </div>
            </div>
            <div class="login-row">
                <div class="ws-input-select">
                    <div class="ws-input-left input-img-sh">
                    </div>
                    <select id="info-docStatus">
                      <option value ="Wait" selected>${CMP_STATUS.WAIT.name}</option>
                      <option value ="Success" ${data.docStatus == CMP_STATUS.SUCCESS.code ? 'selected' : ''}>${CMP_STATUS.SUCCESS.name}</option>
                      <option value="Disable" ${data.docStatus == CMP_STATUS.DISABLE.code ? 'selected' : ''}>${CMP_STATUS.DISABLE.name}</option>
                    </select>
                    <label class="ws-input-box"></label>
                </div>
            </div>
            `,
            onConfirm(e) {
                //判断数据是否存在问题
                let userCode = $('#info-userCode').val().trim();
                let userName = $('#info-userName').val().trim();
                let introduce = $('#info-introduce').val().trim();
                let phone = $('#info-phone').val().trim();
                let address = $('#info-address').val().trim();
                let docStatus = $('#info-docStatus').val();
                if (userCode.length == 0) {
                    $ws.toast('用户名为必填项，不能为空', 'error');
                    return
                }
                if (!/^[a-zA-Z0-9]{4,13}$/.test(userCode)) {
                    $ws.toast('用户名必须为4到13位且字母或数字的组合', 'error');
                    return;
                }
                if (userName.length == 0) {
                    $ws.toast('公司名称为必填项，不能为空', 'error');
                    return
                }
                if (phone.length == 0) {
                    $ws.toast('联系电话为必填项，不能为空', 'error');
                    return
                }
                $ws.ajax({
                    url: "../User/ModifyRegister",
                    data: {
                        id: data.id,
                        userCode: userCode,
                        userName: userName,
                        introduction: introduce,
                        phone: phone,
                        address: address,
                        docStatus: docStatus,
                        state: window.$state
                    },
                    success() {
                        e.close();
                        //刷新当前页
                        cmpListPage.reset();
                        $ws.toast('信息修改成功');
                    }
                });
            }
        });
    }
    //打开登录日志
    function showLoginInfo(dom, userCode, userName) {
        //初始化侧边标签栏
        $ws.sidecon.init();
        $ws.sidecon.add({
            title: userName + "-登录日志",
            id: $(dom).attr('_id') + 'jk',
            content: `
            <div id="app-table"  class="app-table-sidecon">
                <div class="table">
                    <table border="0" id="table-dl">
                        <tr class="table-tr">
                            <th>调用时间</th>
                            <th>访问IP</th>
                            <th>错误码</th>
                            <th>错误信息</th>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="page-box  page-box-sidecon">
            </div>
        `,
            callback(contentDom) {
                //创建一个翻页
                $ws.page({
                    el: contentDom.querySelector('.page-box'),
                    callback(e, selectPage) {
                        //获取公司数据
                        $ws.ajax({
                            url: '../User/GetLoginLogList',
                            data: {
                                start: e.start,
                                limit: e.limit,
                                usercode: userCode
                            },
                            success(res) {
                                //数据清空
                                let boxDom = $('#table-dl');
                                boxDom.html(boxDom.find('tr')[0]);
                                let content = '';
                                let dataList = res.data;
                                for (let x = 0; x < dataList.length; x++) {
                                    let item = dataList[x];
                                    content += `
                                    <tr class="table-tr">
                                        <td>${item.CreateDate}</td>
                                        <td>${item.IpAddress}</td>
                                        <td>${item.errcode}</td>
                                        <td>${item.errmsg || '-'}</td>
                                    </tr>`
                                }
                                $(contentDom).find('#table-dl').append(content);
                                selectPage(res.total);
                            }
                        })
                    }
                })
            }
        });
    }
    //打开接口日志
    function showInterfaceInfo(dom, appKey, userName) {
        //初始化侧边标签栏
        $ws.sidecon.init();
        //添加接口次数
        $ws.sidecon.add({
            title: userName + "-接口次数",
            id: $(dom).attr('_id') + 'dlcs',
            content: `
            <div id="app-table" style="padding:20px;">
                <div class="table">
                    <table border="0" id="table-jk-js">
                        <tr class="table-tr">
                            <th>类型</th>
                            <th>描述</th>
                            <th>次数</th>
                        </tr>
                    </table>
                </div>
            </div>
        `,
            callback(contentDom) {
                //获取接口调用次数
                $ws.ajax({
                    url: '../User/GetApiLogCountList',
                    data: {
                        appKey: appKey
                    },
                    success(res) {
                        //数据清空
                        let boxDom = $('#table-jk-js');
                        boxDom.html(boxDom.find('tr')[0]);
                        //更新数据
                        let dataList = res.data;
                        let content = '';
                        for (let x = 0; x < dataList.length; x++) {
                            let item = dataList[x];
                            content += `
                                <tr class="table-tr">
                                    <td>${item.ApiCallType || '-'}</td>
                                    <td>${item.ApiCallTypeDesc || '-'}</td>
                                    <td>${item.Count || '0'}</td>
                                </tr>
                            `
                        }
                        $(contentDom).find('#table-jk-js').append(content);
                    }
                })
            }
        });
        $ws.sidecon.add({
            title: userName + "-接口日志",
            id: $(dom).attr('_id') + 'dl',
            content: `
            <div id="app-table" class="app-table-sidecon">
                <div class="table">
                    <table border="0" id="table-jk">
                        <tr class="table-tr">
                            <th>调用时间</th>
                            <th>url</th>
                            <th>类型</th>
                            <th>描述</th>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="page-box page-box-sidecon">
            </div>
        `,
            callback(contentDom) {
                //创建一个翻页
                $ws.page({
                    el: contentDom.querySelector('.page-box'),
                    callback(e, selectPage) {
                        //获取公司数据
                        $ws.ajax({
                            url: '../User/GetApiLogContentList',
                            data: {
                                start: e.start,
                                limit: e.limit,
                                appKey: appKey
                            },
                            success(res) {
                                //数据清空
                                let boxDom = $('#table-jk');
                                boxDom.html(boxDom.find('tr')[0]);
                                //更新数据
                                let dataList = res.data;
                                let tableDom = $(contentDom).find('#table-jk')
                                for (let x = 0; x < dataList.length; x++) {
                                    let item = dataList[x];
                                    let content = `
                                        <tr class="table-tr table-tr-btn" data-show="0">
                                            <td>${item.CreateDate || '-'}</td>
                                            <td>${item.Url || '-'}</td>
                                            <td>${item.ApiCallType || '-'}</td>
                                            <td id="666">${item.ApiCallTypeDesc || '-'}</td>
                                        </tr>
                                        <tr class="table-tr" style="display:none">
                                            <td  colspan="6">
                                                <div class="table-sidecon-content">
                                                    <div class="table-sidecon-content-left">
                                                        <div class="table-sidecon-content-title">请求参数</div>
                                                            <div>${JSON.stringify(item.PostRequestData) || '-'}</div>
                                                    </div>
                                                    <div class="table-sidecon-content-right">
                                                        <div class="table-sidecon-content-title">返回参数</div>
                                                            <div>${JSON.stringify(item.ResponseData) || '-'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    `
                                    let itemDom = $(content);
                                    $(itemDom[0]).on('click', (e) => {
                                        selectTableTr(e.currentTarget);
                                    })
                                    tableDom.append(itemDom)
                                }
                                selectPage(res.total) 
                            }
                        })
                    }
                })
            }
        });
    }
    //控制出现的表格隐藏内容
    function selectTableTr(dom) {
        let meDom = $(dom);
        console.log(meDom.attr('data-show'));
        if (meDom.attr('data-show')=='0') {
            //表示为开启状态
            meDom.attr('data-show',1);
            meDom.next().css('display', '');
        } else {
            //表示为关闭状态
            meDom.attr('data-show',0);
            meDom.next().css('display', 'none');
        }
    }
    //点击密码重置
    function passwordReset(dom, userCode, userName) {
        $ws.modal({
            headText: '密码重置',
            confirmText: '确定修改',
            content: `
        <div class="login-row">
            公司名称：${userName}
        </div>
        <div class="login-row">
           登录用户名：${userCode}
        </div>
        <div class="login-row">
            <div class="ws-input-text">
                <div class="ws-input-left input-img-st"></div>
                <input type="password" placeholder="请输入密码" id="p-pwd"/>
                <label class="ws-input-box"></label>
            </div>
        </div>
        `,
            onConfirm(e) {
                //判断数据是否存在问题
                let pwd = $('#p-pwd').val();
                if (pwd.length == 0) {
                    $ws.toast('请输入密码不能为空', 'error');
                    return
                }
                $ws.ajax({
                    url: "../User/ModifyRegPsw",
                    data: {
                        usercode:userCode,
                        psw:pwd
                    },
                    success() {
                        e.close();
                        $ws.toast('密码修改成功', {
                            callback: function () {
                                window.location.href = "../user/index";
                            }
                        });
                    }
                });
            }
        });
    }
})(window.$ws, window.$,window)
