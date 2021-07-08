$(function () {
    load();
    // 1. 按下回车 把完整数据 存储到本地存储里面 -----------------------------
    // 存储的数据格式  var todolist = [{title: "xxx", done: false}]
    $("#title").on("keydown", function (event) {
        if (event.keyCode === 13) {
            var strTitle = $(this).val().trim();
            if (strTitle.length == 0) {
                alert("请输入您要的操作");
            } else {
                //一、将 本地数组 获取，并 添加新的 数据项，再保存回 本地 覆盖原来的数据
                // 先读取本地存储原来的数据
                var local = getData();

                // 生成新对象的id：数组中 最后一个 元素的 id值+1 -------------------
                var newId = local.length > 0 ? local[local.length - 1].id + 1 : 1;
                // 把local数组进行更新数据 把最新的数据追加给local数组
                local.push({ id: newId, title: strTitle, done: false });

                // 把这个数组local 存储给本地存储
                saveDate(local);

                //二、将 刚输入的 数据 追加到 列表中
                $('#todolist').prepend(`<li data-id="${newId}"><input type="checkbox"> 
                <p>${strTitle}</p> <a href="javascript:;"></a></li>`);

                // 统计数量
                countLi()

                // 清空文本框的值
                $(this).val("");
            }
        }
    });

    // 2. toDoList 删除操作 ---------------------------------------------
    // 委托注册 删除按钮的 点击事件
    $('#todolist,#donelist').on('click', 'li a', function () {
        if (!confirm('亲，您确认要删除这条可爱又无辜的数据吗？')) return;

        //获取 按钮所在的 div
        var $li = $(this).parent();
        //2.1 删除本地对应的 数据 ----------------------
        var dataId = $li.attr('data-id');
        //a.读取本地数组
        var listData = getData();
        //b.到数组中 查找 id 相同元素的 下标
        var index = listData.findIndex(function (e) {
            return e.id == dataId; // 告诉 findIndex 当前遍历的元素 是否是要删除的元素
        });
        //c.根据下标 删除 数组中的 元素
        listData.splice(index, 1);
        //d.将删除元素后的 数组 重新保存回本地 localStorage
        saveDate(listData);

        //2.2 删除 按钮所在的 li ----------------------
        $li.remove();

        // 统计数量
        countLi()
    });

    // 3. toDoList 正在进行和已完成选项操作 --------------------------------
    // 将 复选框的 change 事件，委托给 两个列表，这样 新增的 复选框 也能 触发change事件了
    $('#todolist,#donelist').on('change', 'li input[type=checkbox]', function () {
        //获取被点击的 复选框
        var $jqChk = $(this);
        //3.1 根据复选框 状态 移动 复选框 所属的 列表 -----------------------------
        //b.获取 当前复选框的 选中状态
        var isChecked = $jqChk.prop('checked');

        //c.如果 是选中了，则将 复选框所在的 li 移到 已经完成的 列表中
        var modifyId = $jqChk.parent('li').attr('data-id'); // 获取 复选框所在 li 中保存的 id值
        if (isChecked) {
            $jqChk.parent('li').appendTo($('#donelist'));
            //3.2 修改本地数据中的 done=true，并重新保存到本地
            changeState(modifyId, true);
        }
        //d.如果 没有选中，则将 复选框所在的 li 移到 正在进行的 类表中
        else {
            $jqChk.parent('li').appendTo($('#todolist'));
            //3.2 修改本地数据中的 done=true，并重新保存到本地
            changeState(modifyId, false);
        }

        // 统计数量
        countLi()
    });

    // 3.1 根据 id 修改本地 数组中 对应元素的 属性值 done = isDone
    function changeState(dataId, isDone) {
        //a.读取本地数据
        var list = getData();
        //b.找出 数组 中 对应的 元素对象，并修改它的属性：done = isDone
        $.each(list, function (i, ele) {
            if (ele.id == dataId) {
                ele.done = isDone;
                return false; // 停止 each 内部的循环
            }
        });
        //c.将 修改后的 数组 重新保存到 localStorage 中，覆盖原来的值
        saveDate(list);
    }

    // 4.统计 两个列表 数量 -----------------------------------------------
    function countLi() {
        //1.获取 两个 列表的 li 的个数
        var todoNum = $('#todolist li').length;
        var doneNum = $('#donelist li').length;

        //2.设置给 两个 显示用的 span
        $('#todocount').text(todoNum);
        $('#donecount').text(doneNum);
    }

    // 5. 读取本地存储的数据   --------------------------------------------
    function getData() {
        var data = localStorage.getItem("todolist");
        if (data !== null) {
            // 本地存储里面的数据是字符串格式的 但是我们需要的是对象格式的
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    // 6.保存本地存储数据
    function saveDate(data) {
        //a.将 数组 转成 json字符串
        var strJson = JSON.stringify(data);
        //b.将 json字符串保存到本地，覆盖掉原来的数据
        localStorage.setItem("todolist", strJson);
    }

    // 7.渲染列表数据 -----------------------------------------------------
    function load() {
        // 读取本地存储的数据
        var data = getData();
        // 遍历数组 生成 列表项
        $.each(data, function (i, n) {
            //a.判断 当前数据的 状态，如果是 ture，则加入 已完成列表，如果是false 则加入未完成列表
            if (n.done) {
                $("#donelist").prepend(`<li data-id="${n.id}"><input type='checkbox' checked> 
                <p>${n.title}</p> <a href='javascript:;' ></a></li>`);
            } else {
                $("#todolist").prepend(`<li data-id="${n.id}"><input type='checkbox' > 
                <p>${n.title}</p> <a href='javascript:;' ></a></li>`);
            }
        })
        // 统计数量
        countLi()
    }

})