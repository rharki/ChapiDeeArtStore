
angular.module('mainController', ['masterServices'])

    .controller('mainCtrl', ['Master', "$scope", function(Master, $scope) {

        // console.log('testing mainController');
        var app = this;
        app.loadme = true;
        $scope.loading = false;
        $scope.message = "";

        $scope.testing = "Rahul";

        $scope.sendEmail = function() {
            console.log("sending email");
            // console.log($scope.formname);
            $scope.loading = false;
            sendEmailQueryDetails = {};
            sendEmailQueryDetails.emailname = $scope.formname;
            sendEmailQueryDetails.emailemail = $scope.formemail;
            sendEmailQueryDetails.emailmessage = $scope.formmessage;
            console.log(sendEmailQueryDetails.emailname);
            console.log(sendEmailQueryDetails.emailemail);
            console.log(sendEmailQueryDetails.emailmessage);
            Master.sendEmailQuery(sendEmailQueryDetails).then(function(data) {
                $scope.loading = true;
                if (!data.data.success) {
                    $scope.message = "Cannot send email, please retry!";
                    console.log(data.data.message);
                } else {
                    $scope.message = "Email sent successfully!";
                    console.log(data.data.message);
                }
            });

        };

    }]);
