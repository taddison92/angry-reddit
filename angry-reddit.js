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
        $scope.subreddits.push( newSub );
      };

  }]);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
