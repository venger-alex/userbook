const DEFAULT_ROWS_PER_PAGE = 5;
const DEFAULT_PAGINATION_ELLIPSIS = '...';
const DEFAULT_PAGES_STARTS_WITH = 1;
var USERS_PER_PAGE = DEFAULT_ROWS_PER_PAGE;
var CURRENT_PAGE = DEFAULT_PAGES_STARTS_WITH;

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
    $("#users-list-pages").empty();

    var pagesQuantity = Math.ceil(usersQuantity/USERS_PER_PAGE);

    var pagesArray = pagination(CURRENT_PAGE, pagesQuantity);

    $.each(pagesArray,
        function (index, value) {
            if(value == DEFAULT_PAGINATION_ELLIPSIS || parseInt(value) == CURRENT_PAGE) {
                $("#users-list-pages").append($('<span/>').html(value)).attr("class", "pages_buttons");
            } else {
                $("#users-list-pages")
                    .append($('<a/>')
                        .attr("href", "/index.html?page=" + value + "&rows=" + USERS_PER_PAGE)
                        .attr("class", "pages_buttons")
                        .append($('<span/>').html(value)))
                ;
            }
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
                rangeWithDots.push(DEFAULT_PAGINATION_ELLIPSIS);
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

//
// url: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadUsersByPage(page, rows) {
    $.ajax({
        url: '/usersbypage?page=' + (parseInt(page)-1) + '&rows=' + rows,
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
    CURRENT_PAGE = getParameterByName('page');
    if(!CURRENT_PAGE) {CURRENT_PAGE = DEFAULT_PAGES_STARTS_WITH;} else {CURRENT_PAGE = parseInt(CURRENT_PAGE);}
    USERS_PER_PAGE = getParameterByName('rows');
    if(!USERS_PER_PAGE) {USERS_PER_PAGE = DEFAULT_ROWS_PER_PAGE;} else {USERS_PER_PAGE = parseInt(USERS_PER_PAGE)}
    loadUsersQuantity();
    loadUsersByPage(CURRENT_PAGE, USERS_PER_PAGE);
});
