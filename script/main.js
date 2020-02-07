const baseUrl = 'http://localhost:3000'

$(document).ready(function () {
    checkLogin()
    $(".register").click(function () {
        $(".other").show();
        $(".content").hide();
        $(".register").addClass('active');
        $(".login").removeClass('active');
    });
    $(".login").click(function () {
        $(".content").show();
        $(".other").hide();
        $(".login").addClass('active');
        $(".register").removeClass('active');
    });

    $("#login-box").on("submit", function (e) {
        e.preventDefault()
        const email = $("#email").val()
        const password = $("#password").val()
        fromLogin(email, password)
    })

    $("#reg-box").on("submit", function (e) {
        e.preventDefault()
        const email = $("#emailRegister").val()
        const password = $("#passwordRegister").val()
        const fullname = $("#fullnameRegister").val()
        fromRegister(email, password, fullname)
    })

    $("#myAllEvent").click(function (e) {
        e.preventDefault()
        checkLogin()
        allEvent()
    });

    $("#favorite").click(function (e) {
        e.preventDefault()
        checkLogin()
        addFavorite()
    })

    $("#myFavorite").click(function (e) {
        e.preventDefault()
        checkLogin()
        allFavorite()
    });
});

function onSignIn(googleUser) {
    const idToken = googleUser.getAuthResponse().id_token
    $.ajax({
        method: "POST",
        url: `${baseUrl}/users/login/google`,
        data: { idToken }
    })
        .done((response) => {
            localStorage.setItem('token', response.token)
            localStorage.setItem('id', response.user.id)
            localStorage.setItem('email', response.user.email)
            localStorage.setItem('fullname', response.user.fullname)
            checkLogin()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `welcome ${response.user.fullname}`,
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseJSON.message
            })
        })
}

function fromLogin(email, password) {
    $.ajax({
        method: "POST",
        url: `${baseUrl}/login`,
        data: {
            email,
            password
        }
    })
        .done((response) => {
            const { id, fullname, email } = response.user
            localStorage.setItem('token', response.token)
            localStorage.setItem('id', id)
            localStorage.setItem('fullname', fullname)
            localStorage.setItem('email', email)
            checkLogin()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `welcome ${response.user.fullname}`,
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseJSON
            })
        })
}

function fromRegister(email, password, fullname) {
    $.ajax({
        method: "POST",
        url: `${baseUrl}/users/register`,
        data: {
            fullname,
            email,
            password
        }
    })
        .done((response) => {
            const { id, fullname, email } = response.user
            localStorage.setItem('token', response.token)
            localStorage.setItem('id', id)
            localStorage.setItem('fullname', fullname)
            localStorage.setItem('email', email)
            checkLogin()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `welcome ${response.user.fullname}`,
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Status : ' + err.status,
                text: err.responseJSON
            })
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        checkLogin()
    });
}

function checkLogin() {
    if (localStorage.getItem("token") == null) {
        $("#main").show()
        $("#navbarApp").hide()
    } else {
        $("#main").hide()
        $("#navbarApp").fadeIn('slow')
    }
}

// EVENT

function allEvent() {
    $.ajax({
        url: `${baseUrl}/event`,
        method: "GET",
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((response) => {
            checkLogin()
            viewEvent(response)
        })
        .fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseJSON
            })
        })
}

function formatDate(date) {
    let current_datetime = date
    return moment(current_datetime).utc().format('DD/MM/YYYY')
}

function addFavorite(id) {
    $.ajax({
        method: "POST",
        url: `${baseUrl}/event/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((response) => {
            checkLogin()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Success add to Favorite`,
                showConfirmButton: false,
                timer: 1500
            })
        })
        .fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseJSON
            })
        })
}

function allFavorite() {
    checkLogin()
    $.ajax({
        url: `${baseUrl}/favorite`,
        method: "GET",
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((response) => {
            checkLogin()
            viewFavorite(response)
        })
        .fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseJSON
            })
        })
}

function editProfile() {
    const email = $('#email').val()
    const email = $('#password').val()
    const email = $('#fullname').val()
    $.ajax({
        url: `${baseUrl}/users/update`,
        method: "POST",
        data: {
            email,
            fullname,
            password
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(() => {
            checkLogin()
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("fullname").value = "";
        })
        .fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseJSON
            })
        })
}

// DISPLAY

function viewEvent(response) {
    $('#cardEvent').empty()
    response.forEach(data => {
        $('#cardEvent').append(`<div class="item">
            <div class="item-right">
                <span class="up-border"></span>
                <p class="day"></p>
                <span class="down-border"></span>
            </div>
            <div class="item-left">
                <div>
                    <img src="${data.performersImage}" style="min-width:355px;"
                        alt="" />
                </div>
                <p class="event">${data.type}</p>
                <h2 class="title">${data.title}</h2>
                <div style="margin-left:90px;">
                    <div class="sce">
                        <div class="icon">
                            <i class="fa fa-table"></i>
                        </div>
                        <p>${formatDate(data.announce_date)}</p>
                    </div>
                    <div class="fix"></div>
                    <div class="loc">
                        <div class="icon">
                            <i class="fa fa-map-marker"></i>
                        </div>
                        <p>${data.city}</p>
                    </div>
                </div>
                <div class="fix"></div>
                <a href="${data.url}">
                <button class="tickets ml-2">Tickets</button>
                </a>
                <button id="favorite" onclick="addFavorite('${data.id}')" class="fas fa-heart btn btn-danger"
                    style="padding: 6px 6px 7px;margin-left: 230px; margin-top: 13px;border-radius: 50px;"></button>
            </div>
        </div>`)
    })
}

function viewFavorite(response) {
    $('#cardFavorite').empty()
    response.Events.forEach(data => {
        $('#cardFavorite').append(`<div class="item">
            <div class="item-right">
                <span class="up-border"></span>
                <p class="day"></p>
                <span class="down-border"></span>
            </div>
            <div class="item-left">
                <div>
                    <img src="${data.performersImage}" style="min-width:355px;"
                        alt="" />
                </div>
                <p class="event">${data.type}</p>
                <h2 class="title">${data.title}</h2>
                <div style="margin-left:90px;">
                    <div class="sce">
                        <div class="icon">
                            <i class="fa fa-table"></i>
                        </div>
                        <p>${formatDate(data.announce_date)}</p>
                    </div>
                    <div class="fix"></div>
                    <div class="loc">
                        <div class="icon">
                            <i class="fa fa-map-marker"></i>
                        </div>
                        <p>${data.city}</p>
                    </div>
                </div>
                <div class="fix"></div>
                <a href="${data.url}">
                <button class="tickets ml-2 fas fa-plane"></button>
                </a>
                <button id="favorite" onclick="deleteFavorite('${data.id}')" class="fas fa-trash btn btn-danger"
                    style="padding: 6px 6px 7px;margin-left: 230px; margin-top: 13px;border-radius: 50px;"></button>
                    <div class="fb-share-button" data-href="${data.performersImage}" data-layout="button" data-size="large">
                    <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${data.performersImage}" class="fb-xfbml-parse-ignore">
                    Share
                    </a>
                    </div>
            </div>
        </div>`)
    })
}

