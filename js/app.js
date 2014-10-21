"use strict";

var App = angular.module("todo", ["ui.sortable", "LocalStorageModule"]);

App.controller("TodoCtrl", function ($scope, localStorageService, $timeout) {

	$scope.init = function () {

		if (!localStorageService.get("todoList")) {
			$scope.model = [
				{
					name: "Quan trọng", list: [
						{ taskName: "quan trọng", isDone: false },
						{ taskName: "quan trọng", isDone: true }
					]
				},
				{
					name: "Việc vặt", list: [
						{ taskName: "việc vặt ...", isDone: false },
						{ taskName: "việc vặt ...", isDone: false }
					]
				}
			];
		}else{
			$scope.model = localStorageService.get("todoList");
		}
		$scope.show = "All";
		$scope.currentShow = 0;
	};

	$scope.showLog = function () {

	}

	$scope.addTodo = function  (done) {

		/////////////////
		// USE FACTORY //
		/////////////////
		var taskFactory = new TaskFactory();
		var task = taskFactory.createTask({
			taskType: done,
			taskName: $scope.newTodo,
		})

		///////////////////
		// USE SINGLETON //
		///////////////////
		var instance1 = SingletonMessage.getInstance();
		var instance2 = SingletonMessage.getInstance();
		// check instance1 and instance2 it must same
	    console.log("Same instance? " + (instance1 === instance2));
	    var message = {mess:'Thêm việc thành công',type: true,show: true}  
	    instance2.setMessage(message);
	    // set time out
	    $scope.Log = instance2.getMessage();
		$timeout(function() {
	      $scope.Log = {mess:'',type: false,show: false}
	    }, 3000);

		/*Should prepend to array*/
		$scope.model[$scope.currentShow].list.splice(0, 0, task);
		/*Reset the Field*/
		$scope.newTodo = "";
	};

	$scope.deleteTodo = function  (index) {
		var instance = SingletonMessage.getInstance();
		var message = {mess:'Xóa việc thành công',type: false,show: true}  
		instance.setMessage(message);

		// set time out
		$scope.Log = instance.getMessage();
		$timeout(function() {
			$scope.Log = {mess:'', type:false, show:false}
		}, 3000);

		$scope.model[$scope.currentShow].list.splice(index, 1);
	};

	$scope.todoSortable = {
		containment: "parent",//Dont let the user drag outside the parent
		cursor: "move",//Change the cursor icon on drag
		tolerance: "pointer"//Read http://api.jqueryui.com/sortable/#option-tolerance
	};

	$scope.changeTodo = function  (i) {
		$scope.currentShow = i;
	};

	/* Filter Function for All | Incomplete | Complete */
	$scope.showFn = function  (todo) {
		if ($scope.show === "All") {
			return true;
		}else if(todo.isDone && $scope.show === "Complete"){
			return true;
		}else if(!todo.isDone && $scope.show === "Incomplete"){
			return true;
		}else{
			return false;
		}
	};

	$scope.$watch("model",function  (newVal,oldVal) {
		if (newVal !== null && angular.isDefined(newVal) && newVal!==oldVal) {
			localStorageService.add("todoList",angular.toJson(newVal));
		}
	},true);


});

///////////////////////
// FACTORY DEMO CODE //
///////////////////////
// A constructor for defining new task
function DoneTask( options ) {
 
  // some defaults
  this.taskName = options.taskName || 'công việc đã hoàn thành';
  this.isDone = options.isDone     || true;
 
}
 
// A constructor for defining new undonetask
function UnDoneTask( options){
 
  this.taskName = options.taskName || 'công việc chưa hoàn thành';
  this.isDone   = options.isDone || false;
}
 

// Define a skeleton task factory
function TaskFactory() {}
 
// Define the prototypes and utilities for this factory
 
// Our default vehicleClass is done
TaskFactory.prototype.taskClass = UnDoneTask;
 
// Our Factory method for creating new Vehicle instances
TaskFactory.prototype.createTask = function ( options ) {
 
  switch(options.taskType){
    case "done":
      this.taskClass = DoneTask;
      break;
    case "undone":
      this.taskClass = UnDoneTask;
      break;
  }
 
  return new this.taskClass( options );
 
};

/////////////////////////
// SINGLETON DEMO CODE //
/////////////////////////
var SingletonMessage = (function () {
    var instance;
 
    function init(){
        
        // private Variable
        var privateObject = new Object();

        // private method
        function privateMethod() {
        	//console.log("i am private");
        }

        return {
        	setMessage: function(message) {
        		this.privateObject = message;
        	},
        	// public 
        	getMessage: function() {
        		return this.privateObject;
        	}  
        };
    };
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();