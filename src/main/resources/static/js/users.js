var USERS_PER_PAGE = 5;
var CURRENT_PAGE = 0;

var renderUsers_jQuery = function(userList) {
    $("tr:has(td)").remove();

    $.each(userList,
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

var renderPages_jQuery = function(usersQuantity) {
    var pagesDiv = document.getElementById("users-list-pages");
    while (pagesDiv.firstChild) {
        pagesDiv.removeChild(pagesDiv.firstChild);
    }

    var pagesQuantity = Math.ceil(usersQuantity/USERS_PER_PAGE);

    var pagesArray = pagination(1, pagesQuantity);

    $.each(pagesArray,
        function (index, value) {
            $("#users-list-pages")
                .append($('<a/>').attr("href", "#").attr("class", "pages_buttons").click(function () {
                    loadUsersByPage(index);
                })
                    .append($('<span/>').html(value)))
            ;
        }
    );
}

// Simple pagination algorithm
// url: https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
function pagination(c, m) {
    var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (var i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (var i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

function loadUsersByPage(page) {
    $.ajax({
        url: '/usersbypage?page=' + page,
        dataType: "json",
        success: renderUsers_jQuery
    })
}

function loadUsersQuantity() {
    $.ajax({
        url: '/count',
        dataType: "json",
        success: renderPages_jQuery
    })
}

$(document).ready(function(){
    loadUsersQuantity();
    loadUsersByPage(CURRENT_PAGE);
});



