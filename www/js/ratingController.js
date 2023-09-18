app.controller('appController', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.starRating1 = $rootScope.star;
    $scope.hoverRating1 = 0;
    $scope.click1 = function (param, url) {
        $scope.newRate(url, param);
    };

    $scope.mouseHover1 = function (param) {
        $scope.hoverRating1 = param;
    };

    $scope.mouseLeave1 = function (param) {
        $scope.hoverRating1 = param + '*';
    };

    $scope.exists = false;
    $scope.newRate = function (url, rate) {
        angular.forEach($rootScope.userData, function (value, key) {
            if (value.url == url) {
                $scope.exists = true;
                $scope.id = $rootScope.userData.indexOf(value);
            }
        });

        if ($scope.exists) {
            $rootScope.userData[$scope.id].rating = rate;
            $rootScope.userData.$save($scope.id);
            $rootScope.avgRate($rootScope.avgRateSelectedVideo);
        } else {
            $rootScope.userData.$add({
                url: url,
                rating: rate
            });
            $rootScope.avgRate($rootScope.avgRateSelectedVideo);
        }
    };


}]);

app.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                    <img ng-src='{{((hoverValue + _rating) <= $index) && \"images/star-empty-lg.png\" || \"images/star-fill-lg.png\"}}' \
                    ng-Click='isolatedClick($index + 1)' \
                    ng-mouseenter='isolatedMouseHover($index + 1)' \
                    ng-mouseleave='isolatedMouseLeave($index + 1)'></img> \
            </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;

            $scope.isolatedClick = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope.rating = $scope._rating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                });
            };

            $scope.isolatedMouseHover = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = 0;
                $scope.hoverValue = param;
                $scope.mouseHover({
                    param: param
                });
            };

            $scope.isolatedMouseLeave = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = $scope.rating;
                $scope.hoverValue = 0;
                $scope.mouseLeave({
                    param: param
                });
            };
        }
    };
});