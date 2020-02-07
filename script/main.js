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