const app = angular.module('test', ['ui.router','ngMaterial', 'md.data.table']);

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/users');
    $stateProvider
    .state('users', {
        url: '/users',
        views: {
            'uicontainer': {
                templateUrl: 'res/partials/user_list.html',
                controller: ['$scope', function($scope) {
                    $scope.users = [
                        { login: "octocat", id:583231, name: "The Octocat" },
                        { login: "myhduck", id:1555350, name: "YOHAN MOON" },
                        { login: "trevor", id:5945, name: "Trevor Wennblom" },
                        { login: "ogijun", id:8826, name: "Junya Ogino" },
                        { login: "mattn", id:10111, name: "mattn" },
                        { login: "reeze", id:14658, name: "Reeze Xia" },
                        { login: "othree", id:16474, name: "othree" },
                    ];
                }]
            }
        }
    })
    .state('user-detail', {
        url: '/users/:login',
        views: {
            'uicontainer': {
                templateUrl: 'res/partials/user_details.html',
                controller: ['$scope', '$state', 'GitHubUserDataService', function($scope, $state, GitHubUserDataService) {
                    $scope.userDetails = {};
                    $scope.getUserDetails = function() {
                        GitHubUserDataService.getUserDetails($state.params.login)
                            .then( response => {
                                $scope.userDetails = response.data;
                            })
                            .catch( () => console.log("Error while obtaining user details") );
                    }();
                }]
            }
        }
    })
    .state('user-repos', {
        url: '/users/:login/repos',
        views: {
            'uicontainer': {
                templateUrl: 'res/partials/user_repos.html',
                controller: ['$scope', '$state', 'GitHubUserDataService', function($scope, $state, GitHubUserDataService) {
                    $scope.userRepos = {};
                    $scope.login = $state.params.login;
                    $scope.checkRepos = function() {
                        GitHubUserDataService.getUserRepos($state.params.login)
                            .then( response => {
                                $scope.userRepos = response.data;
                            })
                            .catch( () => console.log("Error while obtaining user repos") );
                    }();
                }]
            }
        }
    })
}]);
