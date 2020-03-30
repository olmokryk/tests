app.service('GitHubUserDataService', ['$http',function($http) {
	this.getUserDetails = function(user) {
		return $http({
            url: "https://api.github.com/users/" + user,
            method: "GET"
        });
	};
    this.getUserRepos = function(user) {
        return $http({
            url: "https://api.github.com/users/" + user + "/repos",
            method: "GET"
        });
    };
}]);