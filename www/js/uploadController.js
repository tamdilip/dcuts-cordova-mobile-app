app.controller('uploadCtrl', function($rootScope, $scope, $upload){
    $.cloudinary.config("tif2g6it",{cloud_name: "tamdilip"});
	$scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            $scope.loader=true;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'https://api.cloudinary.com/v1_1/'+ $.cloudinary.config().cloud_name +'/upload',
                    fields: {'cloud_name': $.cloudinary.config().cloud_name,'api_key':712983653669878,'upload_preset':'tif2g6it'},
                    file: file
                }).progress(function (evt) {
                    $scope.progValue = parseInt(100.0 * evt.loaded / evt.total);
                    $('#prgbar').css('width', $scope.progValue+'%').attr('aria-valuenow', $scope.progValue); 
                    //console.log('progress: ' + $scope.progValue + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    $scope.progValue = 'Completed';
                    $rootScope.newUrl = data.url;
                    $scope.loader=false;
                    //console.log(data.url);
                });
            }
        }
    };
});