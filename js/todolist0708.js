  $(function() {
      let data = getLocalData();
      loadData(data);


      //新增
      $('#title').on('keyup', function(e) {
          if (e.keyCode === 13 && $(this).val().trim() !== '') {
              let data = getLocalData();
              data.push({
                  'title': $(this).val().trim(),
                  'done': false
              });
              $(this).val("")
              localStorage.setItem('todolist0708', JSON.stringify(data));
              loadData(data);
          }
      })

      //新增
      $('#todolist,#donelist').on('click', 'li a', function(e) {
          if (confirm('确认删除本条数据吗?')) {
              let id = $(this).parent().attr('data-id');
              deleData(id);
              loadData(getLocalData());
          }

      })

      $('#todolist,#donelist').on('click', 'input', function(e) {
          e.stopPropagation();
          let id = $(this).parent().attr('data-id');
          //dblclickEditText(this);
          editState(id, $(this).prop('checked'));
          loadData(getLocalData())
      })

      $('#todolist,#donelist').on('dblclick', 'p', function(e) {
          e.stopPropagation();
          let id = $(this).parent().attr('data-id');
          editContents(id, this);
      })

      $('.select').on('dblclick', function(e) {
          window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
          //   console.log(window.getSelection());
          //   console.log(document.selection);
          //   console.log(window.getSelection().getRangeAt(0).text());
      })
  })

  function editContents(id, _this) {
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
          localStorage.setItem("todoist0708", JSON.stringify(data));
      };
      // 按下回车也可以把文本框里面的值给span
      input.onkeyup = function(e) {
          if (e.keyCode === 13) {
              data[id].title = input.value;
              localStorage.setItem("todoist0708", JSON.stringify(data));
              // 手动调用表单失去焦点事件  不需要鼠标离开操作
              //this 表示当前事件触发对象,实时的，不能用形参
              this.blur();
          }
      }
  }

  //
  function dblclickEditText(that) {
      let str = that.innerHTML;
      //双击禁止选择文件
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
      that.innerHTML = '<input type="text" />';
      let input = that.children[0];
      input.value = str;
      input.select();

      input.blur(function() {
          that.innerHTML = input.value;
      })

      input.keyup(function(e) {
          if (e.keyCode === 13) {
              this.blur();
          }
      })
  }

  function editState(id, checked) {
      let data = getLocalData();
      data[id].done = checked;
      localStorage.setItem('todolist0708', JSON.stringify(data));
  }


  function deleData(id) {
      let data = getLocalData();
      data.splice(id, 1);
      localStorage.setItem('todolist0708', JSON.stringify(data));
  }

  function getLocalData() {
      let data = localStorage.getItem('todolist0708');
      if (data === null) return [];

      return JSON.parse(data);
  }

  function loadData(data) {
      $('#todolist').html('');
      $('#donelist').html('');
      $('#donecount').text('');
      $('#todocount').text('');

      if (data.length === 0) return;

      $.each(data, function(i, e) {
          if (e.done) {
              $('#donelist').append('<li data-id="' + i + '"><input type="checkbox" checked><p>' + e.title + '</p><a href="javascript:;"></a></li>');
          } else {
              $('#todolist').append('<li data-id="' + i + '"><input type="checkbox" ><p>' + e.title + '</p><a href="javascript:;"></a></li>');
          }
      })
      $('#todocount').text($('#todolist li').length);
      $('#donecount').text($('#donelist li').length)
  }