import React, {Component} from 'react';
import './Navigator.css'
import logo from './images/logo.png'
import search from './search.svg'
import $ from "jquery";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faUser);

class Navigator extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {

        this.onLogin();

        // this.onLogout();

        this.onRegister();

        this.handleUserInfo();

    }

    onLogin = () => {

        let setUserId = this.props.handleLogin;

        $('#login').click(function () {
            $('.login-info-wrapper').show();
            $('.mask').show();
        })

        $('#login-info-button').click(function () {

            $('.login-info-wrapper').hide();
            $('.mask').hide();

            let userName = $('.login-info input[name = username]').val();
            // console.log(userName)

            let passWord = $('.login-info input[name = password]').val();
            // console.log(passWord)

            let userId;
            let firstName;
            let lastName;

            $.ajax({
                    url: 'http://localhost:3000/users/login',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        user_name: userName,
                        password: passWord,
                    }),
                })
                .done(function(data) {

                    console.log(data);

                    console.log("Successfully connected.");

                    userId = data.user_id;
                    setUserId(userId, data);
                    // console.log(userId);

                    firstName = data.firstname;
                    // console.log(firstName);

                    lastName = data.lastname;

                    $('#nav-search-wrapper').hide();

                    $('#nav-initial').hide();

                    $('#jumbotron-wrapper').hide();

                    // $('.search').addClass('login-margin');

                    $('.moto').hide();
                    
                    $('#welcome span').text('Welcome, ' + firstName);

                    $('#nav-login').show();

                    // $('.user-wrapper').show();

                    $('.random').hide();
                })
                .fail(function() {
                    console.log("Failed to connect.");
                })
                .always(function() {
                    console.log("Remote call completed.");
                })
        })

    }

    onRegister = () => {
        $('#register').click(function () {
            $('.register-info-wrapper').show();
            $('.mask').show();
        })

        $('#register-info-button').click(function () {
            $('.register-info-wrapper').hide();
            $('.mask').hide();

            let firstName = $('.register-info input[name = firstname]').val();
            console.log(firstName)

            let lastName = $('.register-info input[name = lastname]').val();
            console.log(lastName)

            let age = $('.register-info input[name = age]').val();
            console.log(age)

            let userGender = $('.register-info input[name = gender]').val();
            console.log(userGender)

            let userName = $('.register-info input[name = username]').val();
            console.log(userName)

            let passWord = $('.register-info input[name = password]').val();
            console.log(passWord)

            let email = $('.register-info input[name = email]').val();
            console.log(email)

            let phone = $('.register-info input[name = phone]').val();
            console.log(phone)

            let userTag = $('.register-info input[name = tag]').val();
            console.log(userTag)

            $.ajax({
                    url: 'http://localhost:3000/users/registerUsers',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        gender: userGender,
                        age: age,
                        firstname: firstName,
                        lastname: lastName,
                        password: passWord,
                        user_name: userName,
                        user_phone: phone,
                        user_email: email,
                        tag: userTag,
                    }),
                })
                .done(function(data) {
                    console.log(data);
                    console.log("Successfully connected.");
                })
                .fail(function() {
                    console.log("Failed to connect.");
                })
                .always(function() {
                    console.log("Remote call completed.");
                })
        })
    }
    
    handleUserInfo = () => {
        
        $('#welcome').click(function () {

            $('#jumbotron-wrapper').hide();
            $('.moto').hide();
            $('.search').hide();
            $('.container').hide();
            $('.PieChart').hide();

            $('.user-wrapper').show();
            $('#back').show();
        });
        
    }

    render() {
        return (
            <div>
                <div className="top-nav">
                    <a href="index.html" className="logo">
                        <img src={logo} alt="PureLive"/>
                    </a>
                    <div id="nav-search-wrapper">
                        <form method="get" action="index.html">
                            <img src={search} alt="search"/>
                            <input type="text" name="search" id="nav-search" placeholder="Search"/>
                        </form>
                    </div>
                    <ul id="nav-initial">
                        <a href="javascript:;">
                            <li>Become a host</li>
                        </a>
                        <a href="javascript:;">
                            <li>Help</li>
                        </a>
                        <a id="register" href="javascript:;">
                            <li>Sign up</li>
                        </a>
                        <a id="login" href="javascript:;">
                            <li>Log in</li>
                        </a>
                    </ul>

                    <ul id="nav-login">
                        <li id="welcome"><FontAwesomeIcon icon={faUser}/><span></span></li>
                        <a href="index.html"><li id="logout">Log out</li></a>
                    </ul>
                </div>

                <div className="mask"></div>

                <div className="login-info-wrapper">
                    <div className="login-info">
                        <table>
                            <tbody>
                            <tr>
                                <td><input type="text" name="username" placeholder="Please enter your username"/></td>
                            </tr>
                            <tr>
                                <td><input type="password" name="password" placeholder="Please enter your password"/></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="login-info-button-wrapper">
                        <button id="login-info-button" name="login-info-button">Log in</button>
                    </div>
                </div>

                <div className="register-info-wrapper">
                    <div className="register-info">
                        <table>
                            <tbody>
                            <tr>
                                <td><input type="text" name="firstname" placeholder="Please enter your firstname"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="lastname" placeholder="Please enter your lastname"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="gender" placeholder="Please enter your gender"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="age" placeholder="Please enter your age"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="username" placeholder="Please enter your username"/></td>
                            </tr>
                            <tr>
                                <td><input type="password" name="password" placeholder="Please enter your password"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="email" placeholder="Please enter your email"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="phone" placeholder="Please enter your phone"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="tag" placeholder="Please enter your tag"/></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="register-info-button-wrapper">
                        <button id="register-info-button" name="register-info-button">Sign up</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Navigator;