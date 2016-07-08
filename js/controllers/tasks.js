taskerApp.controller('TasksController', function($rootScope, $scope, $http){
    $scope.tasks = [];
    $scope.datepickers = [];
    $scope.filterTags = [];
    $scope.tempTag = null;
    $scope.newTaskFormIsVisible = false;
    
    //Get tags from inbox container
    $http.get('api/inbox.json').
    success(function(data, status, headers, config) {
        $scope.tasks = data;
        $scope.resetTaskObj();
        if(data.length > 0){
            $rootScope.sidebar.inbox = $scope.tasks.length;
            $scope.createDatePickers($scope.tasks.length);
            $scope.getFilterTags($scope.tasks); //
        }
    }).
    error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
    });
    
    $scope.addNewTag = function(tempTag){
        
        if(typeof $scope.tempTask == "undefined"){
            $scope.resetTaskObj();
        };
        
        if(typeof $scope.tempTask.taskTags == "undefined"){
            $scope.tempTask.taskTags = [];
        };
        
        $scope.tempTask.taskTags.push({
            id:12,
            name:tempTag
        });
        
        $scope.tempTag = null;
        
        // $scope.resetTaskObj();
    };
    
    $scope.closeTaskDetails = function(){
        for (var task_index in $scope.tasks) {
            $scope.tasks[task_index].is_in_edition = false;
            $scope.tasks[task_index].is_selected = false;
        }
    };
    
    $scope.createDatePickers = function(tasks_number){
        for (var tindex = 0; tindex < tasks_number; tindex++) {
            $scope.datepickers[tindex] = {};
            $scope.datepickers[tindex].isopen = false;
            
            if($scope.tasks[tindex].due_date != null){
                $scope.tasks[tindex].due_date = new Date($scope.tasks[tindex].due_date);
                $scope.tasks[tindex].due_date_label = $scope.dateDifferenceInDays($scope.tasks[tindex].due_date);
            }
        }
    };
    
    $scope.dateDifferenceInDays = function(tmp_date){
        var today_date = new Date();
        var time_diff = Math.abs(tmp_date.getTime() - today_date.getTime());
        var diff_in_days = Math.ceil(time_diff / (1000 * 3600 * 24)); 
        return (today_date > tmp_date) ? diff_in_days * -1 : diff_in_days;
    };
    
    $scope.dateOptions = {
        formatYear: 'yyyy-MM-dd',
        startingDay: 1
    };
    
    $scope.deleteTag = function(searched_tag){
        console.log(searched_tag);
        console.log($scope.filterTags);
        
        var tag_number = $scope.filterTags.length;
        for(var i = 0; i < tag_number; i++){
            if($scope.filterTags[i].name == searched_tag){
                //console.log($scope.filterTags[i].name);
                //console.log(searched_tag);
                //console.log(i);
                $scope.filterTags.splice(i,1);
                break;
                console.log($scope.filterTags);
            }
        }
    };
    // filterTags">
				// <!--{{filterTag.name}}-->
				// <!--{{filterTag | json}}-->
				// <button style="background-color:transparent; border:none" ng-click="filterTasksByTag(filterTag)">{{filterTag.name}}</button>
				// <button style="background-color:transparent; border:none" ng-click="deleteTag(tag.name)">X</button>
    
    $scope.getFilterTags = function(tasks){
        for (var task_index in tasks) {
            for (var tag_index in tasks[task_index].taskTags) {
                var tempTag = tasks[task_index].taskTags[tag_index];
                
                if(this.tagExists(tempTag) == false){
                    $scope.filterTags.push(tempTag);
                }
            }
        }
    };
    
    $scope.filterTasksByTag = function(filterTag){
        //$scope
    };
    
    $scope.tagExists = function(searched_tag){
        for (var index in $scope.filterTags) {
            if($scope.filterTags[index].name == searched_tag.name){
                return true;
            }
        }
        return false;
    };

    $scope.insertOnExistingTags = function(task_index, tag){
        if(typeof $scope.tasks[task_index].taskTags == "undefined"){
            $scope.tasks[task_index].taskTags = [];
        };
        
        $scope.tasks[task_index].taskTags.push({
            id:12,
            name:tag
        });
        
        $scope.resetTaskObj();
        $scope.tempTask.tag = null;
    };
    
    $scope.markTaskAsSelected = function(task_index){
        if($scope.tasks[task_index].is_in_edition == false){
            for (var ttask_index in $scope.tasks) {
                $scope.tasks[ttask_index].is_selected = false;
            }
            $scope.tasks[task_index].is_selected = (($scope.tasks[task_index].is_selected) ? false : true);
            $scope.selected_task_index = task_index;
        }
    };
    
    $scope.openUpdatePanel = function($event, task_index){
        $scope.closeTaskDetails();
        $scope.tasks[task_index].is_in_edition = true;
    };
    
    $scope.openNewTask = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        
        $scope.opened = true;
    };
    
    $scope.openDueDateDrop = function($event, task_index) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.datepickers[task_index].isopen = true;
    };
    
    $scope.keyPressedListener = function(event){
        console.log(event);
    };
    
    $scope.resetTaskObj = function(){
        $scope.tempTask = {
                "name": null,
                "notes": null,
                "category": "today",
                "tag": null,
                "tags": [],
                "area": null,
                "project": null,
                "due_date": null,
                "next_update": null,
                "creation_date": null,
                "is_active": true,
                "is_in_edition": false,
                "is_done": false
            };
    };
    
    $scope.saveNewTask = function(){
        
        toastr.success('Task "' + $scope.tempTask.name.substr(0,15) + '..." has been saved');
        
        $scope.tasks.push($scope.tempTask);
        
        $rootScope.sidebar.inbox = $scope.tasks.length; //update sidebar counter
        
        $scope.resetTaskObj();
        $scope.createDatePickers($scope.tasks.length);
        $scope.closeTaskDetails();
    };
    
    $scope.updateTaskStatus = function(task_index){
        if($scope.tasks[task_index].is_done){
            notification_legend = 'Task "' + $scope.tasks[task_index].name.substr(0,15) + '..." has been marked as done';
        } else {
            notification_legend = 'Task "' + $scope.tasks[task_index].name.substr(0,15) + '..." has been marked as pending';
        }
        
        toastr.success(notification_legend);
    };
    
    $scope.updateTaskName = function(task_index, task_name){
        // $scope.tasks[task_index].name = task_name;
        toastr.success('Task name has been modified with success!');
    };

    
}); // TasksController

// $(document).ready(function(){
//   $('ul.task-list>li').keydown(function( event ) {
//         console.log(event);
//     //   if ( event.which == 13 ) {
//     //      event.preventDefault();
//     //   }
//     //   xTriggered++;
//     //   var msg = "Handler for .keypress() called " + xTriggered + " time(s).";
//     //   $.print( msg, "html" );
//     //   $.print( event );
//     });
// });