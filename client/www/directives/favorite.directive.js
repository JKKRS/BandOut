angular.module('starter.favoriteDir', [])

.directive('favorite', function() {
  return {
    restrict : 'A',
    link : function(scope, element, attrs) {
      var addOrRemove = false;
      // scope.favClass = "ion-ios-heart-outline";
      element.bind('click', function() {
        if (element.hasClass('ion-ios-heart-outline')) {
          element.removeClass('ion-ios-heart-outline');
          element.addClass('ion-ios-heart');
        } else

        if (element.hasClass('ion-ios-heart')) {
          element.removeClass('ion-ios-heart');
          element.addClass('ion-ios-heart-outline');
        }
      });
    }
  };
});