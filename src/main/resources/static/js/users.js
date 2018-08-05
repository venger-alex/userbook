const DEFAULT_ROWS_PER_PAGE = 5;
const DEFAULT_PAGES_STARTS_WITH = 1;
var USERS_PER_PAGE = DEFAULT_ROWS_PER_PAGE;
var CURRENT_PAGE = DEFAULT_PAGES_STARTS_WITH;

const removeChilds = function (node) {
    var first;
    while (first = node.firstChild) node.removeChild(first);
}


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
                    .append($('<td/>')
                        .append($('<button/>').click(function () {
                            editUser(parseInt(value['id']));
                        })
                            .append($('<span/>').html("Edit")))

                        .append($('<button/>').click(function () {
                            delUser(parseInt(value['id']));
                        })
                            .append($('<span/>').html("Delete")))

                    )
                );
        });
}

const renderPages = function (usersQuantity) {
    const pagesNode = document.getElementById("users-list-pages");
    removeChilds(pagesNode);

    const curPage = getCurrentPage();
    const usersPerPage = getUsersPerPage();
    const pagesQuantity = Math.ceil(usersQuantity / usersPerPage);
    const defPaginationEllipsis = "...";
    const pagesArray = pagination(curPage, pagesQuantity, defPaginationEllipsis);

    const renderPage =  function (value) {
        var spanNode = document.createElement("span");
        spanNode.className = "pages_buttons";
        spanNode.innerHTML = value;

        if (value === defPaginationEllipsis || parseInt(value) === curPage) {
            pagesNode.appendChild(spanNode);
        } else {
            let linkNode = document.createElement("a");
            linkNode.href = "/index.html?page=" + value + "&rows=" + usersPerPage;
            linkNode.className = "pages_buttons";
            linkNode.appendChild(spanNode);
            pagesNode.appendChild(linkNode);
        }
    }

    pagesArray.forEach(renderPage);
}

// Simple pagination algorithm
// url: https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
function pagination(c, m, ellipsis) {
    var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push(ellipsis);
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

function getCurrentPage() {
    const result = getParameterByName("page");
    return !result ? 0 : parseInt(result);
}

function getUsersPerPage() {
    const result = getParameterByName("rows");
    return !result ? 5 : parseInt(result);
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

function delUser(userId) {
    $.ajax({
        url: '/users/' + userId,
        type: "DELETE",
        success: function (){
            putMsg("Successful deletion of a user with an ID equal to " + userId);
            show('block');
            refreshPages();
            loadUsersByPage(CURRENT_PAGE, USERS_PER_PAGE);},
        error: function (){
            putMsg("While deleting a user with ID equal to " + userId + ", an error occurred");
            show('block');}
    })
}

function editUser(userId) {
    getUserById(userId);
}

var handleUserById = function renderEditWindow_jQuery(user) {
    putDataToEditWindow(user);
    showEditWindow('block');
}

function getUserById(userId) {
    $.ajax({
        url: '/users/' + userId,
        dataType: 'json',
        success: handleUserById,
        error: function () {
            putMsg("Can\'t read the user with ID equal to " + userId + ", an error occurred");
            show('block');
        }
    })
}

function putUser() {
    var userId = $("#user_id").val();
    var user = {
        id: userId,
        firstName: $("#user_first_name").val(),
        lastName: $("#user_last_name").val(),
        birthDay: $("#user_birth_day").val(),
        gender: $("#user_gender").val()
    };

    $.ajax({
        url: '/users/' + userId,
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function (){
            putMsg("Successful edit of a user with an ID equal to " + userId);
            show('block');
            refreshPages();
            loadUsersByPage(CURRENT_PAGE, USERS_PER_PAGE);},
        error: function (){
            putMsg("While editing a user with ID equal to " + userId + ", an error occurred");
            show('block');}
    })
}

function createUser() {

    var user = {
        firstName: $("#user_first_name").val(),
        lastName: $("#user_last_name").val(),
        birthDay: $("#user_birth_day").val(),
        gender: $("#user_gender").val()
    };

    $.ajax({
        url: '/users',
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function (){
            putMsg("Successful add of a user");
            show('block');
            refreshPages();
            loadUsersByPage(CURRENT_PAGE, USERS_PER_PAGE);},
        error: function (){
            putMsg("While adding a user, an error occurred");
            show('block');}
    })
}

function loadUsersQuantity(callback) {
    $.ajax({
        url: '/count',
        dataType: "json",
        success: callback
    })
}

function putMsg(msg) {
    document.getElementById('window_text').innerText = msg;
}

function putDataToEditWindowForAdd() {
    $("#title_edit_window").empty();
    $("#title_edit_window").append($('<h2/>').html("Add user"));


    $("#user_id").val("");
    $("#user_id").attr("disabled", true);
    $("#user_first_name").val("");
    $("#user_last_name").val("");
    $("#user_birth_day").val("");
    $("#user_gender").val("");


    $(".ok_edit_window").off();
    $(".ok_edit_window").click(function () {
        showEditWindow('none');
        createUser();

    });

}

function putDataToEditWindow(user) {
    $("#title_edit_window").empty();
    $("#title_edit_window").append($('<h2/>').html("Edit user"));
    $("#user_id").attr("disabled", false);

    $("#user_id").val(user['id']);
    $("#user_first_name").val(user['firstName']);
    $("#user_last_name").val(user['lastName']);
    $("#user_birth_day").val(user['birthDay']);
    $("#user_gender").val(user['gender']);

    $(".ok_edit_window").off();
    $(".ok_edit_window").click(function () {
        showEditWindow('none');
        putUser();
    });
}

function show(state){
    document.getElementById('window').style.display = state;
    document.getElementById('wrap').style.display = state;
}

function showEditWindow(state){
    document.getElementById('edit_window').style.display = state;
    document.getElementById('wrap').style.display = state;
}


function refreshPages() {
    loadUsersQuantity(renderPages);
}


$(document).ready(function(){
    CURRENT_PAGE = getParameterByName("page");
    if(!CURRENT_PAGE) {CURRENT_PAGE = DEFAULT_PAGES_STARTS_WITH;} else {CURRENT_PAGE = parseInt(CURRENT_PAGE);}
    USERS_PER_PAGE = getParameterByName('rows');
    if(!USERS_PER_PAGE) {USERS_PER_PAGE = DEFAULT_ROWS_PER_PAGE;} else {USERS_PER_PAGE = parseInt(USERS_PER_PAGE)}
    refreshPages();
    loadUsersByPage(CURRENT_PAGE, USERS_PER_PAGE);
});
