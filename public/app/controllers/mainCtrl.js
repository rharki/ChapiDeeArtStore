
angular.module('mainController', ['masterServices'])

    .controller('mainCtrl', ['Master', "$scope", function(Master, $scope) {

        // console.log('testing mainController');
        var app = this;
        app.loadme = true;
        $scope.loading = false;
        $scope.message = "";

        $scope.testing = "Rahul";

        $scope.sendEmail = function() {
            // console.log("sending email");
            $scope.loading = false;
            sendEmailQueryDetails = {};
            sendEmailQueryDetails.emailmessage = $scope.formmessage;
            sendEmailQueryDetails.emailname = $scope.formname;
            sendEmailQueryDetails.emailemail = $scope.formemail;
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
