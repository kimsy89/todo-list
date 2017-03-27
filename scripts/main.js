'use strict';

// var sampleObj = {
//   id: 'Number'
//   title: 'String',
//   isChecked: 'Boolean'
// };

var taskController = {
  index: 0,

  format: {
    id: '',
    title: '',
    isChecked: false
  },

  create: function(title) {
    newIndex = this.index++;
    var newTask = $.extend(format, {
      id: newIndex
      title: title
    });
  }
}

var dataController = {
  list: [],

  add: function(taskObj) {
    if (typeof taskObj !== 'object') {
      alert('ERROR.WRONG_OBJECT');
      return false;
    }

    if (typeof taskObj.id !== 'undefined') {
      alert('ERROR.EMPTY_ID');
      return false;
    }

    var prevList = this.list.slice(0);
    prevList.push(taskObj);

    if (prevList.length + 1 === this.list.length) {
      this.list.push(taskObj);
      delete prevList;
      elemController.add(taskObj);
    } else {
      alert('ERROR.FAIL_TO_ADD_OBJECT');
      return false;
    }
  },

  remove: function() {

  }, 

  find: function() {

  }
};

var elemController = {
  add: function() {
    
  },

  remove: function() {

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
