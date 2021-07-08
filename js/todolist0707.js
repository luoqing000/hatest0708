$(function() {

    //var obj1 = [{ "title": 'haha', "done": false }, { "title": '000', "done": true }]
    //localStorage.setItem("todoist0707", JSON.stringify(obj1));

    var data = getLocalData();
    loadData(data);


    $('#title').on('keyup', function(e) {
        if (e.keyCode === 13 && $(this).val().trim() != '') {
            var obj = { 'title': $(this).val(), "done": false };
            data.push(obj);
            saveAddData(data);
            loadData(data);
            $(this).val('')
        }
    })

    // 3.数据删除后加载
    $('#donelist,#todolist').on('click', 'li a', function() {
        var flag = confirm('确认删除本条数据吗?');
        if (flag) {
            var id = $(this).parent().attr('data-id');
            saveDelData(id);
            loadData(getLocalData());
        }
    })


    // 5.数据内容修改后加载
    $('#donelist,#todolist').on('dblclick', 'p', function(e) {
        e.stopPropagation();
        var id = $(this).parent().attr('data-id');
        saveEditContent(id, this)
    });

    // 4.数据修改状态后加载
    $('#donelist,#todolist').on('click', 'input', function() {
        var id = $(this).parent().attr('data-id');
        saveEditFlag(id, $(this).prop('checked'));
        loadData(getLocalData());
    })

})

function saveEditContent(id, _this) {
    console.log(id);
    var str = _this.innerHTML;
    // 双击禁止选定文字
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    // alert(11);
    _this.innerHTML = '<input type="text" />';
    var input = _this.children[0];
    input.value = str;
    input.select(); // 文本框里面的文字处于选定状态

    let data = getLocalData();

    // 当我们离开文本框就把文本框里面的值给span 
    input.onblur = function() {
        _this.innerHTML = input.value;
        data[id].title = input.value;
        localStorage.setItem("todoist0707", JSON.stringify(data));
    };
    // 按下回车也可以把文本框里面的值给span
    input.onkeyup = function(e) {
        if (e.keyCode === 13) {
            data[id].title = input.value;
            localStorage.setItem("todoist0707", JSON.stringify(data));
            // 手动调用表单失去焦点事件  不需要鼠标离开操作
            this.blur();
        }
    }
}

//4.修改状态保存
function saveEditFlag(id, done) {
    let data = getLocalData();
    data[id].done = done;
    localStorage.setItem("todoist0707", JSON.stringify(data));
}

function saveDelData(id) {
    //console.log(000);
    let data = getLocalData();
    data.splice(id, 1);
    localStorage.setItem("todoist0707", JSON.stringify(data));
}

function saveAddData(data) {
    localStorage.setItem("todoist0707", JSON.stringify(data));
}

function getLocalData() {
    return JSON.parse(localStorage.getItem('todoist0707')) === null ? [] : JSON.parse(localStorage.getItem('todoist0707'));
}

// 1.数据加载 + 计数
function loadData(data) {
    $('#donelist').html('');
    $('#todolist').html('');
    $('#donecount').text('');
    $('#todocount').text('');
    //console.log(typeof data + '===' + data.length); // object
    if (data === null) return;

    $.each(data, function(i, e) {
        if (e.done) {
            $('#donelist').append('<li data-id="' + i + '"><input type="checkbox" checked><p>' + e.title + '</p><a href="javascript:;"></a></li>');
        } else {
            //未完成
            $('#todolist').append('<li data-id="' + i + '"><input type="checkbox" ><p>' + e.title + '</p><a href="javascript:;"></a></li>');
        }
    })

    $('#donecount').text($('#donelist li').length)
    $('#todocount').text($('#todolist li').length)
}