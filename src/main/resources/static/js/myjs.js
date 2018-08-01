$(document).ready(function(){
    $.ajax({
        url: '/all',
        dataType: "json",
        success: function(jsondata){
            $("tr:has(td)").remove();

            $.each(jsondata, 
                function (index, value) {

                    $("#users-list")
                        .append($('<tr/>')
                            .append($('<td/>').html(value['id']))
                            .append($('<td/>').html(value['firstName']))
                            .append($('<td/>').html(value['lastName']))
                            .append($('<td/>').html(value['birthDay']))
                            .append($('<td/>').html(value['gender']))
                        );
                });

        }
    })
});