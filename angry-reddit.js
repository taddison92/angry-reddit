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

      $scope.addSub = function (subName) {
        Meteor.http.get(
          'https://www.reddit.com/r/'+subName+'/comments.json',
          function (error, result) {
            if (error) {
              $scope.error = error;
            } else {
              comments = result.data.data.children.map(function (whole_comment) {
                return whole_comment.data.body;
              }).join(' ');

              Meteor.call('analyzeText', comments, subName);
            }
          }
        );
      };

  }]);
}

if (Meteor.isServer) {
  Meteor.methods({
    'analyzeText': function (comments, subName) {
      alchemy_post = {
        apikey: 'be71e16a887a9f39f79a353afff85d555ebb2711',
        text: comments,
        outputMode: 'json',
      }
      var response = Meteor.http.post(
        'http://gateway-a.watsonplatform.net/calls/text/TextGetEmotion',
        { params: alchemy_post,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

      Subreddits.upsert({
        name: subName
      }, {
        name: subName,
        anger: Math.floor(response.data.docEmotions.anger * 100)
      });
    }
  });
}
