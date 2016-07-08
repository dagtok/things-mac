var taskerApp = angular.module('taskerApp',
  [
    'ngRoute',
    'appControllers',
    'ui.bootstrap',
    'ui.utils'
    ])
.constant('FIREBASE_URL', 'https://attendanceldcapp.firebaseio.com/');

var appControllers = angular.module('appControllers',[]);

taskerApp.run(function($rootScope, $http) {
    //$rootScope.test = new Date();
    $rootScope.sidebar = {
      inbox: null,
      today: null,
      nexts: null,
      scheduled: null,
      someday: null,
      projects: null
    };
    // $rootScope.sidebar.today = 2;
    
    //Lists active projects
    // $http.get('api/inbox.json').
    // success(function(data, status, headers, config) {
    //     $rootScope.tasks.inbox = data;
    // }).
    // error(function(data, status, headers, config) {
    //   // called asynchronously if an error occurs
    // });
    
    //Lists areas
    //Lists archive
    //Trash
});

taskerApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/tasks', {
      templateUrl: 'views/tasks.html',
      controller:  'TasksController'
    }).
    when('/buttons', {
      templateUrl: 'views/buttons.html'
    }).
    when('/grid', {
      templateUrl: 'views/grid.html'
    }).
    when('/icons', {
      templateUrl: 'views/icons.html'
    }).
    when('/timeline', {
      templateUrl: 'views/timeline.html'
    }).
    when('/profile', {
      templateUrl: 'views/profile.html'
    }).
    when('/signin', {
      templateUrl: 'views/signin.html'
    }).
    when('/email', {
      templateUrl: 'views/email.html'
    }).
    otherwise({
      redirectTo: '/tasks'
    });
}]);