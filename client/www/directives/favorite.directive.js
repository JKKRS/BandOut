angular.module('main.favoriteDir', [])

.directive('favorite', function() {
  return {
    restrict : 'A',
    link : function(scope, element, attrs) {
      element.bind('click', function() {
        // Update scope so we know it's been clicked
        scope.$apply(function(){
             scope.obj.favClicked = true;
        });
        if (element.hasClass('ion-ios-heart-outline')) {
          element.removeClass('ion-ios-heart-outline');
          element.addClass('ion-ios-heart');
        }
        else if (element.hasClass('ion-ios-heart')) {
          element.removeClass('ion-ios-heart');
          element.addClass('ion-ios-heart-outline');
        }
      });
    }
  };
});
