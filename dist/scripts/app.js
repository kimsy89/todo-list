'use strict';

// var sampleObj = {
//   id: 'Number'
//   title: 'String',
//   isChecked: 'Boolean'
// };

var taskController = {
  create: function(title) {
    var newId = Math.floor((1 + Math.random()) * 0x10000).toString(16);
    return $.extend({
      title: '',
      isChecked: false
    }, {
      id: `task${newId}`,
      title: title
    });
  }
};

var taskListController = {
  list: [],

  add: function(taskObj) {
    this.list.push(taskObj);
    this.refresh();
  },

  remove: function(taskIndex) {
    this.list.splice(taskIndex, 1);
    this.refresh();
  },

  change: function(taskIndex, isChecked) {
    this.list[taskIndex].isChecked = isChecked;
    this.refresh();
  },

  refresh: function() {
    if (! Array.isArray(this.list)) {
      alert('ERROR.WRONG_ARRAY');
      return false;
    }

    window.localStorage.setItem('todo', JSON.stringify(this.list));
  },

  findIndex: function(taskId) {
    return this.list.findIndex(function(item, index) {
      console.log('item id: ', item.id)
      console.log('task id: ', taskId)
      return item.id === taskId;
    });
  }
}

var dataController = {
  add: function(taskObj) {
    console.log('[ADD] taskObj: ', taskObj);
    if (typeof taskObj !== 'object' || typeof taskObj.id === 'undefined') {
      alert('ERROR.WRONG_OBJECT');
      return false;
    }

    var clonedList = taskListController.list.slice(0);
    clonedList.push(taskObj);

    if (clonedList.length === taskListController.list.length + 1) {
      taskListController.add(taskObj);
      clonedList = null;
      elemController.add(taskObj);
    } else {
      alert('ERROR.FAIL_TO_ADD_OBJECT');
      return false;
    }
  },

  remove: function(taskId) {
    var taskIndex = taskListController.findIndex(taskId);
    if (taskIndex < 0) {
      alert('ERROR.NOT_FOUND_REMOVE_OBJECT');
      return false;
    }

    var clonedList = taskListController.list.slice(0);
    clonedList.splice(taskIndex, 1);

    if (clonedList.length === taskListController.list.length - 1) {
      taskListController.remove(taskIndex);
      clonedList = null;
      elemController.remove(taskId);
    } else {
      alert('ERROR.FAIL_TO_REMOVE_OBJECT');
      return false;
    }
  },

  change: function(taskId, isChecked) {
    var taskIndex = taskListController.findIndex(taskId);
    if (taskIndex < 0) {
      alert('ERROR.NOT_FOUND_MODIFY_OBJECT');
      return false;
    }

    taskListController.change(taskIndex, isChecked)
    //clonedList = null;
    elemController.change(taskId, isChecked);

    // var clonedList = taskListController.list.slice(0);
    // debugger;
    // clonedList[taskIndex].isChecked = isChecked;

    // console.log('clonedList[taskIndex].isChecked: ', clonedList[taskIndex].isChecked);
    // debugger;
    // console.log('taskListController.list[taskIndex].isChecked: ', taskListController.list[taskIndex].isChecked)
    // if (clonedList[taskIndex].isChecked !== taskListController.list[taskIndex].isChecked) {
    //   taskListController.change(taskIndex, isChecked)
    //   clonedList = null;
    //   elemController.change(taskId, isChecked);
    // } else {
    //   alert('ERROR.FAIL_TO_CHANGE_OBJECT');
    //   return false;
    // }
  }
};

var elemController = {
  add: function(taskObj) {
    var $btnInNewTask = $(`<button type="button" class="delete">delete task</button>`)
      , $checkboxInNewTask = $(`<input type="checkbox" name="" class="checkbox"/>`)
      , $newTask = $(`<li class="task">${taskObj.title}</li>`);

    $checkboxInNewTask.prop('checked', taskObj.isChecked);
    $newTask.attr('id', taskObj.id)
    $newTask.append($btnInNewTask);
    $newTask.prepend($checkboxInNewTask);

    $('#task-list').append($newTask);
  },

  remove: function(taskId) {
    var $removeTask = $(`#${taskId}`);
    if ($removeTask.length <= 0) {
      alert('ERROR.NOT_FOUND_REMOVE_ELEMENT');
      return false;
    }

    $removeTask.remove();
  },

  change: function(taskId, isChecked) {
    var $changeTask = $(`#${taskId}`);
    if ($changeTask.length <= 0) {
      alert('ERROR_NOT_FOUND_CHANGE_ELEMENT');
      return false;
    }
    $changeTask[(isChecked) ? 'fadeOut' : 'fadeIn']();
  }
};

$('#add').on('click', function(event) {
  event.preventDefault();
  var title = $('#title-input').val();

  if (title.length === 0) {
    alert('ERROR.EMPTY_TITLE');
    return false;
  }

  var task = taskController.create(title)
  dataController.add(task);
  
});

$('#task-list').on('click', '.delete', function(event) {
  event.preventDefault();
  var $task = $(this).parents('li');

  if ($task.length <= 0 || typeof $task.attr('id') === 'undefined') {
    alert('ERROR.FAIL_TO_DELETE');
    return false;
  }

  dataController.remove($task.attr('id'));
});

$('#task-list').on('change', '.checkbox', function(event) {
  event.preventDefault();
  var $this = $(this)
    , $task = $this.parents('li');

  dataController.change($task.attr('id'), $this.prop('checked'));
});

$('#show-all').on('click', function(event) {
  event.preventDefault();
  $('.task').each(function(index, item) {
    $(item).fadeIn();
  });
});

$('#show-ing').on('click', function(event) {
  event.preventDefault();
  $('.task').each(function(index, item) {
    var $task = $(item)
      , isChecked = $task.find('.checkbox').prop('checked');
    $task[(isChecked) ? 'fadeOut' : 'fadeIn']();
  });
});

$('#show-done').on('click', function(event) {
  event.preventDefault();
  $('.task').each(function(index, item) {
    var $task = $(item)
      , isChecked = $task.find('.checkbox').prop('checked');
    $task[(isChecked) ? 'fadeIn' : 'fadeOut']();
  });
});

var localStorageList = window.localStorage.getItem('todo');
if (typeof localStorageList !== 'undefined' && localStorageList !== null) {
  var parsed = JSON.parse(localStorageList);

  for (var i = 0, j = parsed.length; i < j; i++) {
    dataController.add(parsed[i]);
  }

  $('#show-ing').click();
} 

// 'use strict'

// class User {
//   constructor(name) {
//     this._name = name;
//   }

//   say() {
//     return 'My name is ' + this._name;
//   }
// }

// module.exports = { User };