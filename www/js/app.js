var app = angular.module('dcuts', ['onsen', 'ui.router', 'firebase', 'angularFileUpload', 'ngTouch']);

app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        debugger
        return $sce.trustAsResourceUrl(val.replace('http', 'https'));
    };
}]);

app.run(function ($rootScope, $state) {
    var config = {
        apiKey: "AIzaSyC526CcdOTSJy5vjqGuH53HDvp4wWCxhOg ",
        databaseURL: "https://tamtest-f0aa4.firebaseio.com/",
        authDomain: "tamtest-f0aa4.firebaseapp.com"
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var usernameExtract = user.email.substring(0, user.email.indexOf('@'));
            $rootScope.user = usernameExtract;
            console.log('Signed in :', $rootScope.user);
            $state.go('main');
        } else {
            $state.go('login');
            console.log('Not signed in');
        }
    });

});

app.controller('AppController', function ($rootScope, $scope, $state, $firebaseArray) {

    var self = this;

    var ref = firebase.database().ref('/baseurl/videos');
    self.videos = $firebaseArray(ref);

    var allUsers = firebase.database().ref('/users');
    self.allUsersData = $firebaseArray(allUsers);

    self.loaderLight = false;

    self.videos.$loaded()
        .then(function () {
            $rootScope.totalVideos = self.videos.length;
            if (localStorage.getItem('oldVideoCount')) {
                if ($rootScope.totalVideos > localStorage.getItem('oldVideoCount')) {
                    $rootScope.newVideosCount = $rootScope.totalVideos - localStorage.getItem('oldVideoCount');
                    ons.notification.alert({ message: 'Check out the ' + $rootScope.newVideosCount + ' new videos !!' });
                } else {
                    $rootScope.newVideosCount = 0;
                }
            }
            localStorage.setItem('oldVideoCount', $rootScope.totalVideos);
            self.loaderLight = true;
        });

    self.allUsersData.$loaded()
        .then(function () {
            $rootScope.totalUsers = self.allUsersData.length;
        });

    self.videos.$watch(function (e) {
        if (e.event == 'child_added') {
            self.allUsersData.$loaded().then(function () {
                $rootScope.totalVideos = self.videos.length;
                if (localStorage.getItem('oldVideoCount')) {
                    if ($rootScope.totalVideos > localStorage.getItem('oldVideoCount')) {
                        $rootScope.newVideosCount = $rootScope.totalVideos - localStorage.getItem('oldVideoCount');
                        ons.notification.alert({ message: 'Check out the ' + $rootScope.newVideosCount + ' new videos !!' });
                    }
                }
                localStorage.setItem('oldVideoCount', $rootScope.totalVideos);
            });
        } else if (e.event == 'child_removed') {
            localStorage.setItem('oldVideoCount', self.videos.length);
        }
    });

    self.loader = false;

    $scope.$watch('$root.user', function () {
        self.user = $rootScope.user;
        if (self.user) {
            var userRef = firebase.database().ref('/users/' + self.user);
            $rootScope.userData = $firebaseArray(userRef);
        }
    });

    $scope.$watch('$root.newUrl', function () {
        self.videos.$add({
            url: $rootScope.newUrl,
            desc: self.desc
        });
        self.desc = "";
    });

    self.reset = function () {
        ons.notification.prompt({
            message: "Please enter your registered email",
            callback: function (email) {
                if (email) {

                    firebase.auth().sendPasswordResetEmail(email).then(function () {
                        console.log('Sent !!');
                        ons.notification.alert({
                            message: 'Password reset mail sent to -' + email + '!!'
                        });
                    }, function (error) {
                        console.log('Not sent !!');
                        ons.notification.alert({
                            message: error
                        });
                    });

                } else {
                    ons.notification.alert({
                        message: 'Enter a valid mail !!'
                    });
                }
            }
        });
    };

    self.signup = function (email, pass) {
        if (!email || !pass) {
            if (!email)
                self.emailCheck = true;
            if (!pass)
                self.passCheck = true;
        } else {
            self.loader = true;
            firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (result) {
                self.loader = false;
                $scope.$apply();
                self.user = result.email;
                console.log('signed with', self.user);
                $state.go('main');
                ons.createDialog('shareDialog.html').then(function (dialog) {
                    dialog.show();
                });
            }).catch(function (error) {
                self.loader = false;
                $scope.$apply();
                var errorMessage = error.message;
                ons.notification.alert({ message: errorMessage });
                console.log(errorMessage);
            });
            console.log(email, pass);
        }

    };



    self.login = function (email, pass) {
        if (!email || !pass) {
            if (!email && !pass)
                ons.notification.alert({ message: 'Input fields cannot be empty !!' });
            else if (!email)
                ons.notification.alert({ message: 'Email cannot be empty !!' });
            else if (!pass)
                ons.notification.alert({ message: 'Password cannot be empty !!' });
        } else {
            self.loader = true;
            firebase.auth().signInWithEmailAndPassword(email, pass).then(function (result) {
                self.loader = false;
                $scope.$apply();
                self.user = result.email;
                console.log('signed with', self.user);
                $state.go('main');
            }).catch(function (error) {
                self.loader = false;
                $scope.$apply();
                var errorMessage = error.message;
                ons.notification.alert({ message: errorMessage });
                console.log(errorMessage);
            });
        }
    };

    self.logout = function () {
        firebase.auth().signOut().then(function (result) {
            $state.go('login');
            console.log('Signed out successfully !!');
        }).catch(function (error) {
            console.log(error);
        });
    };

    self.rep = function (url) {
        return url.replace("http", "https").replace(".mp4", ".jpg");
    };

    self.selectedVideo = function (video) {

        $rootScope.avgRateSelectedVideo = video;

        self.videourl = video.url;
        self.videodesc = video.desc;
        $rootScope.star = 0;
        angular.forEach($rootScope.userData, function (value, key) {
            if (value.url == self.videourl) {
                $rootScope.star = value.rating;
            }
        });

        $rootScope.avgRate(video);
    };

    $rootScope.avgRate = function (video) {
        $rootScope.rateOne = 0;
        $rootScope.rateTwo = 0;
        $rootScope.rateThree = 0;
        $rootScope.rateFour = 0;
        $rootScope.rateFive = 0;
        angular.forEach(self.allUsersData, function (obj, key) {

            angular.forEach(obj, function (value, key) {
                if (!value) {
                } else if (value.url == self.videourl) {
                    if (value.rating == 5)
                        $rootScope.rateFive = $rootScope.rateFive + 1;
                    else if (value.rating == 4)
                        $rootScope.rateFour = $rootScope.rateFour + 1;
                    else if (value.rating == 3)
                        $rootScope.rateThree = $rootScope.rateThree + 1;
                    else if (value.rating == 2)
                        $rootScope.rateTwo = $rootScope.rateTwo + 1;
                    else if (value.rating == 1)
                        $rootScope.rateOne = $rootScope.rateOne + 1;
                }
            });

        });

        $rootScope.rateFive = ($rootScope.rateFive / $rootScope.totalUsers) * 100;
        $rootScope.rateFour = ($rootScope.rateFour / $rootScope.totalUsers) * 100;
        $rootScope.rateThree = ($rootScope.rateThree / $rootScope.totalUsers) * 100;
        $rootScope.rateTwo = ($rootScope.rateTwo / $rootScope.totalUsers) * 100;
        $rootScope.rateOne = ($rootScope.rateOne / $rootScope.totalUsers) * 100;
    };

    self.deleteVideo = function (video) {
        ons.notification.alert({
            message: 'Deleted successfully !!'
        });
        self.videos.$remove(video);
    };

    self.shareDialog = function () {
        ons.createDialog('shareDialog.html').then(function (dialog) {
            dialog.show();
        });
    };

    self.load = function (page) {
        $scope.splitter.content.load(page);
        $scope.splitter.left.close();
    };

    self.toggle = function () {
        $scope.splitter.left.toggle();
    };

});