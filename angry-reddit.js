Subreddits = new Mongo.Collection('subreddits');

if (Meteor.isClient) {

  // This code only runs on the client
  angular.module('angry-reddit',['angular-meteor']);

  angular
  .module('angry-reddit')
  .controller('AngerCtrl',
    ['$scope',
     '$meteor',
    function ($scope, $meteor) {

      $scope.subreddits = $meteor.collection( function() {
        return Subreddits.find({}, { sort: { anger: -1 } })
      });

      $scope.addSub = function (newSub) {
        Meteor.http.get(
          'https://www.reddit.com/r/'+newSub.name+'/comments.json',
          function (error, result) {
            if (error) {
              $scope.error = error;
            } else {
              comments = result.data.data.children.map(function (whole_comment) {
                return whole_comment.data.body;
              }).join(' ');
            }
          }
        );
      };

  }]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
