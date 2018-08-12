const removeChilds = function (node) {
    var first;
    while (first = node.firstChild) node.removeChild(first);
}

const renderUsers = function(userList) {
    const userTableNode = document.getElementById("users-list");
    const headerNode = document.getElementById("users-list-header");
    headerNode.style.display = "none";
    document.body.appendChild(headerNode);
    removeChilds(userTableNode);
    userTableNode.appendChild(headerNode);
    headerNode.style.display = "table-row";

    const renderUser = function(value) {
        const trNode = document.createElement("tr");

        const tdIdNode = document.createElement("td");
        tdIdNode.innerText = value['id'];
        trNode.appendChild(tdIdNode);

        const tdFirstNameNode = document.createElement("td");
        tdFirstNameNode.innerText = value['firstName'];
        trNode.appendChild(tdFirstNameNode);

        const tdLastNameNode = document.createElement("td");
        tdLastNameNode.innerText = value['lastName'];
        trNode.appendChild(tdLastNameNode);

        const tdBirthDayNode = document.createElement("td");
        tdBirthDayNode.innerText = value['birthDay'];
        trNode.appendChild(tdBirthDayNode);

        const tdGenderNode = document.createElement("td");
        tdGenderNode.innerText = value['gender'];
        trNode.appendChild(tdGenderNode);

        const tdUpdateNode = document.createElement("td");
        const buttonUpdateNode = document.createElement("button");
        buttonUpdateNode.className = "update_user_button";
        buttonUpdateNode.innerHTML = "Update"
        buttonUpdateNode.addEventListener('click', function (ev) {
            let clazzErrMsg = "edit-input-error-message";
            delErrorMsgs(clazzErrMsg);
            editUser(parseInt(value['id']));
        });
        tdUpdateNode.appendChild(buttonUpdateNode);
        trNode.appendChild(tdUpdateNode);

        const tdDelNode = document.createElement("td");
        const buttonDelNode = document.createElement("button");
        buttonDelNode.className = "delete_user_button";
        buttonDelNode.innerHTML = "Delete"
        buttonDelNode.addEventListener('click', function (ev) {
            delUser(parseInt(value['id']));
        });
        tdDelNode.appendChild(buttonDelNode);
        trNode.appendChild(tdDelNode);

        userTableNode.appendChild(trNode);

    }

    userList.forEach(renderUser);
}

const renderPages = function (usersQuantity) {
    const pagesNode = document.getElementById("users-list-pages");
    removeChilds(pagesNode);

    const curPage = getCurrentPage();
    const usersPerPage = getUsersPerPage();
    const pagesQuantity = Math.ceil(usersQuantity / usersPerPage);
    const pagesArray = generatePagesArray(pagesQuantity);

    const renderPage =  function (value) {
        var linkNode = document.createElement("a");
        linkNode.href = "/index.html?page=" + value + "&rows=" + usersPerPage;
        linkNode.className = "pages_buttons";
        linkNode.innerHTML = value;

        if (parseInt(value) === curPage) {
            linkNode.className += " current_page";
        }

        pagesNode.appendChild(linkNode);
    }

    pagesArray.forEach(renderPage);
}

function generatePagesArray(quantity) {
    var range = [];

    for (let i = 1; i <= quantity; i++) {
        range.push(i);
    }
    return range;
}

function getCurrentPage() {
    const result = getParameterByName("page");
    return !result ? 1 : parseInt(result);
}

function getUsersPerPage() {
    const result = getParameterByName("rows");
    return !result ? 5 : parseInt(result);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadUsersByPage(page, rows, callback) {
    $.ajax({
        url: '/usersbypage?page=' + (page-1) + '&rows=' + rows,
        dataType: "json",
        success: callback
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
            refreshUsers();},
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
    var userId = $("#edit_user_id").val();
    var user = {
        id: userId,
        firstName: $("#edit_user_first_name").val(),
        lastName: $("#edit_user_last_name").val(),
        birthDay: $("#edit_user_birth_day").val(),
        gender: $("#edit_user_gender").val()
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
            refreshUsers();},
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
            refreshUsers();},
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

function putDataToEditWindow(user) {
    $("#edit_user_id").val(user['id']);
    $("#edit_user_first_name").val(user['firstName']);
    $("#edit_user_last_name").val(user['lastName']);
    $("#edit_user_birth_day").val(user['birthDay']);
    $("#edit_user_gender").val(user['gender']);
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

function refreshUsers() {
    const curPage = getCurrentPage();
    const usersPerPage = getUsersPerPage();
    loadUsersByPage(curPage, usersPerPage, renderUsers);
}

function isValidDate(val) {
    var val_r = val.split("-");
    var curDate = new Date(val_r[0], parseInt(val_r[1])-1, val_r[2]);
    return (
        curDate.getFullYear() == val_r[0]
        && (curDate.getMonth()+1) == val_r[1]
        && curDate.getDate() == val_r[2]
    );
}

function isValidGender(val) {
    return ("MALE" == val || "FEMALE" == val);
}

function CustomValidation() {
    this.clearValidity();
}

CustomValidation.prototype = {
    invalidities: [],

    checkValidity: function (input) {
        var flagHasError = false;
        var validity = input.validity;

        if (validity.patternMismatch) {
            this.addInvalidity("This is the wrong pattern for this field");
            flagHasError = true;
        }

        if(!input.value) {
            this.addInvalidity("Required field");
            flagHasError = true;
        }

        if(input.type === "date") {
            if(!isValidDate(input.value)) {
                this.addInvalidity("Not valid date");
                flagHasError = true;
            }
        }

        if(input.id == "user_gender") {
            if(!isValidGender(input.value)) {
                this.addInvalidity("Not valid gender (MALE, FEMALE)");
                flagHasError = true;
            }
        }

        return flagHasError;
    },

    addInvalidity: function (message) {
        this.invalidities.push(message);
    },

    getInvalidities: function () {
        return this.invalidities.join(' \n');
    },

    getInvaliditiesForHTML: function() {
        return this.invalidities.join(' <br>');
    },

    clearValidity: function () {
        while (this.invalidities[0]) {
            this.invalidities.pop();
        }
    }
}
function validateInput(input, clazz) {
    let flagIsError = false;
    var inputCustomValidation = new CustomValidation();
    flagIsError = inputCustomValidation.checkValidity(input);
    var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
    input.insertAdjacentHTML('afterend', '<p class=' + clazz + '>' + customValidityMessageForHTML + '</p>');
    return flagIsError;
}

function delErrorMsgs(clazz) {
    var errorMsgs = document.getElementsByClassName(clazz);
    while (errorMsgs[0]) {
        errorMsgs[0].parentNode.removeChild(errorMsgs[0]);
    }
}

function isValidAddUserForm() {
    var flagIsError = false;

    let clazzErrMsg = "add-input-error-message";

    delErrorMsgs(clazzErrMsg);

    var input = document.getElementById("user_first_name");
    var valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    input = document.getElementById("user_last_name");
    valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    input = document.getElementById("user_birth_day");
    valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    input = document.getElementById("user_gender");
    valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    return !flagIsError;
}

function isValidEditUserForm() {
    var flagIsError = false;

    let clazzErrMsg = "edit-input-error-message";

    delErrorMsgs(clazzErrMsg);

    var input = document.getElementById("edit_user_first_name");
    var valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    input = document.getElementById("edit_user_last_name");
    valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    input = document.getElementById("edit_user_birth_day");
    valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    input = document.getElementById("edit_user_gender");
    valueFlagIsError = validateInput(input, clazzErrMsg);
    flagIsError = flagIsError ? flagIsError : valueFlagIsError;

    return !flagIsError;
}

$(document).ready(function(){
    refreshPages();
    refreshUsers();
});
