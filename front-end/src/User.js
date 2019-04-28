import React, {Component} from 'react';
import './User.css';
import $ from 'jquery'

import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMinusCircle} from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faMinusCircle);

class User extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            user: {},
            postList: [],
            unfinishedList: [],
            finishedList: [],
            wishListTravel:[],
            wishListFriend: []
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {


        // console.log('=======will receive props')
        // // console.log(nextProps.userId)

        // console.log(nextProps)



        this.setState({user: nextProps.user});
        this.loadUserPost(nextProps.userId);

    }

    componentDidMount() {

        this.onTabChange();

        this.onAddHouse();

        this.onGoBack();

        this.onUpdateUserInfo();
    }

    getUserId = () => this.props.userId

    // getUser = () => this.props.user

    onGoBack = () => {

        $('#go-back').click(function () {

            $('#back').hide();

            $('.search').show();
            $('.container').show();
            $('.house-wrapper').show();
            $('.PieChart').show();

            $('.user-wrapper').hide();
        })

    }

    setUserId = (userId) => {
        this.setState({userId: userId});
    }

    // setUser = (user) => {
    //     this.setState({user: user})
    // }

    onTabChange = () => {

        let getUserId = this.getUserId;
        let setUserId = this.setUserId;

        // let getUser = this.getUser;
        // let setUser = this.setUser;


        let loadUnfinishedOrder = this.loadUnfinishedOrder;
        let loadFinishedOrder = this.loadFinishedOrder;
        let loadWishTravel = this.loadWishListTravel;
        let loadWishFriend = this.loadWishListFriend;

        $('.tab-navigation-wrapper ul li a').click(function () {

            $(".tab-navigation-wrapper ul li a.active").removeClass('active');
            $(this).addClass('active');

            let str = $(this).text();
            let userId = getUserId();
            setUserId(userId);

            $('.my-house').hide();
            $('.unfinished-order').hide();
            $('.finished-order').hide()
            $('.wish').hide();

            if (str == 'My House') {

                $('.my-house').show();

            } else if (str == 'Unfinished Orders') {

                loadUnfinishedOrder(userId);
                $('.unfinished-order').show();

            } else if (str == 'Finished Orders') {

                loadFinishedOrder(userId);
                $('.finished-order').show();

            } else if (str == 'Wish List') {

                loadWishTravel(userId);
                loadWishFriend(userId);
                $('.wish').show();

            }
        })
    }

    onAddHouse = () => {

        let getUserId = this.getUserId;
        let updatePostList = this.onUpdatePostList;

        $('#add-house-button').click(function () {
            $('.add-house-info-wrapper').show();
            $('.mask').show();
        })


        let path;
        $('.add-house-info input[name = file]').change(function () {

            path = $('.add-house-info input[name = file]').val();

        })

        $('#add-house-info-button').click(function () {
            $('.add-house-info-wrapper').hide();
            $('.mask').hide();

            let userId = getUserId();
            // console.log(userId);

            let availableDate = $('.add-house-info input[name = available-date]').val();
            // console.log(availableDate);

            let tag = $('#post-tag :selected').val()
            // console.log(tag)

            let price = $('.add-house-info input[name = price]').val();
            // console.log(price);

            let address = $('.add-house-info input[name = address]').val();
            // console.log(address);

            let city = $('.add-house-info input[name = city]').val();
            // console.log(city);
            let filePath = './images/house/';
            filePath += path.replace(/^.*[\/\\]/, "");
            //
            console.log(filePath);
            let postHouse = {
                user_id: userId,
                availableDates: availableDate,
                address: address,
                city: city,
                price: price,
                tag: tag,
                imgDir: filePath
            }

            $.ajax({
                url: 'http://localhost:3000/houses/postHouses',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(postHouse),
            })
            .done(function(data) {

                // console.log(data.result);
                let houseId = data.result;
                let newPost = {house_Id: houseId, imgDir: filePath, price: price, city: city};
                updatePostList(newPost);

            })
            .fail(function() {
                    console.log("error");
            })
            .always(function() {
                    console.log("complete");
            })

        })
    }

    onUpdatePostList = (newPost) => {
        this.setState(prevState => ({postList: [...prevState.postList, newPost]}))
    }

    onCancelOrder = () => {

        let loadUnfinishedOrder = this.loadUnfinishedOrder;
        let userId = this.state.userId;

        $('.icon-minus').click(function () {

            let reservationId = $(this).attr('id').split('-').pop();
            console.log(reservationId);

            $.ajax({
                url: 'http://localhost:3000/reservation/' + reservationId,
                type: 'DELETE',
                dataType: 'json',
            })
                .done(function(data) {

                    if(data.result){
                        loadUnfinishedOrder(userId);
                    }

                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                })
        })


    }

    onCommentOrder = () => {

        let onSubmitComment = this.onSubmitComment;

        $('.unfinished-image').click(function () {


            let reservationId = $(this).attr('id').split('-').pop();
            let id = '#comment-house-wrapper-' + reservationId;
            $('.mask').show();
            $(id).show();

            let submit = '.submit-' + reservationId;


            $(submit).click(function () {
                $(id).hide();
                $('.mask').hide();
                onSubmitComment(reservationId);
            })
        })

    }

    onSubmitComment = (reservationId) => {

        let getUserId = this.getUserId;

        let loadUnfinishedOrder = this.loadUnfinishedOrder;

        let commentId = '#comment-' + reservationId;
        let scoreId = '#score-' + reservationId;

        let comment = $(commentId).val();
        let score = $(scoreId).val();

        console.log(comment);
        console.log(score)

        let result = {
            reservationId: reservationId,
            houseReview: comment,
            resScore: score
        }

        console.log(result);

        $.ajax({
            url: 'http://localhost:3000/reservation/comment',
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(result)
        })
            .done(function(data) {

                console.log('==========comment')
                console.log(data);

                let userId = getUserId();
                console.log(userId);

                if(data.result){
                    loadUnfinishedOrder(userId);
                }

            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            })

    }

    onUpdateUserInfo = () => {

        let getUserId = this.getUserId;

        $('.user-info-update-button').click(function () {

            $('.mask').show();

            $('.update-info').show();



        })

        $('#submit-user-button').click(function () {

            let userId = getUserId();
            console.log(userId);


            $('.mask').hide();

            $('.update-info').hide();

            let email = $('#user-email').val();
            console.log(email);

            let phone = $('#user-phone').val();
            console.log(phone)

            let result = {
                user_id: userId,
                user_phone: phone,
                user_email: email
            }
            console.log(result);

            $.ajax({
                url: 'http://localhost:3000/users/update',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(result)
            })
                .done(function(data) {
                    console.log(data);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                })

        })

    }


    setPostList = (postList) => {
        this.setState({postList: postList})
    }

    setUnfinishedOrder = (unfinished) => {
        this.setState({unfinishedList: unfinished})
    }

    setFinishedOrder = (finished) => {
        this.setState({finishedList: finished})
    }

    setWishListTravel = (travel) => {
        this.setState({wishListTravel: travel})
    }

    setWishListFriend = (friend) => {
        this.setState({wishListFriend: friend})
    }

    loadUserPost = (userId) => {

        let setPostList = this.setPostList;

        $.ajax({
            url: 'http://localhost:3000/houses/myHouse/' + userId,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
            // console.log(data)
            setPostList(data)
            // console.log(data)
        })
        .fail(function() {
            console.log("error");
         })
        .always(function() {
            console.log("complete");
        })
    }

    loadUnfinishedOrder = (userId) => {

        let setUnfinishedOrder = this.setUnfinishedOrder;
        let onCancelOrder = this.onCancelOrder;
        let onCommentOrder = this.onCommentOrder;

        $.ajax({
            url: 'http://localhost:3000/reservation/unfinished/' + userId,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
                setUnfinishedOrder(data);
                onCancelOrder();
                onCommentOrder();
        })
        .fail(function() {
                console.log("error");
        })
        .always(function() {
                console.log("complete");
        })

    }

    loadFinishedOrder = (userId) => {

        let setFinishedOrder = this.setFinishedOrder;

        $.ajax({
            url: 'http://localhost:3000/reservation/finished/' + userId,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {

                // console.log('=========finished');
                // console.log(data);
                setFinishedOrder(data)
         })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            })
    }

    loadWishListTravel = (userId) => {

        let setWishListTravel = this.setWishListTravel;

        $.ajax({
            url: 'http://localhost:3000/wishList/travel/' + userId,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {

            // console.log('====user-travel====')
            // console.log(data)
            setWishListTravel(data)
        })
        .fail(function() {
                console.log("error");
        })
        .always(function() {
                console.log("complete");
        })

    }

    loadWishListFriend = (userId) => {

        let setWishListFriend = this.setWishListFriend;

        $.ajax({
            url: 'http://localhost:3000/wishList/travel/friend/' + userId,
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {

                // console.log('====user-friend====')
                // console.log(data)
                setWishListFriend(data)
        })
        .fail(function() {
                console.log("error");
        })
        .always(function() {
                console.log("complete");
        })

    }

    render() {
        return (
            <div className="user-wrapper">

                <div className="tab-navigation-wrapper">

                    <div className="user-info-wrapper">
                        <span>My Info</span>
                        <hr/>
                    </div>

                    <div className="display-block-wrapper user-info-flex">
                        <button id="add-photo-button" className="add-photo">
                            <span><FontAwesomeIcon icon={faPlus}/>Your Photo</span>
                        </button>
                        <div className="user-info">
                            <div>
                                <p>First Name:<span>{this.state.user.firstname}</span></p>
                                <p>Last Name:<span>{this.state.user.lastname}</span></p>
                                <p>Email:<span>{this.state.user.user_email}</span></p>
                                <p>Phone:<span>{this.state.user.user_phone}</span></p>
                                <div className="user-info-update-wrapper"><button className="user-info-update-button">Update</button></div>
                            </div>
                            <div className="update-info">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td><input id={'user-email'} type="text" name="email" placeholder="Please enter new email."/></td>
                                    </tr>
                                    <tr>
                                        <td><input id={'user-phone'} type="text" name="phone" placeholder="Please enter new phone number."/></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className="submit-user-wrapper">
                                    <button id="submit-user-button" name="submit-user-button">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ul>
                        <li>
                            <a href="javascript:;" className="active">My House</a>
                        </li>
                        <li>
                            <a href="javascript:;">Unfinished Orders</a>
                        </li>
                        <li>
                            <a href="javascript:;">Finished Orders</a>
                        </li>
                        <li>
                            <a href="javascript:;">Wish List</a>
                        </li>
                    </ul>
                </div>

                <div className="display-block-wrapper">

                    <div className="display-block my-house">
                        {this.state.postList.map((post) =>
                            <div key={post.house_id} id={'user-post-' + post.house_id} className={"post-" + post.house_id}>
                                    <img src={require('' + post.imgDir)} />
                                    <div className="house-info-mini">
                                        <span>City:&nbsp;{post.city}</span>
                                        <span>Price/Night:&nbsp;{post.price}</span>
                                        <span>Score:&nbsp;{post.avgScore}</span>
                                    </div>
                            </div>)
                        }
                        <div>
                            <button id="add-house-button" className="add-house">
                                <span><FontAwesomeIcon icon={faPlus}/>Add a house</span>
                            </button>
                        </div>
                    </div>

                    <div className="display-block unfinished-order">
                        {this.state.unfinishedList.map((order) =>
                            <div key={order.reservationId} id={'user-unfinished-' + order.reservationId} className={"unfinished"}>
                                    <img src={require('' + order.imgDir)} id={"image-" + order.reservationId} className="unfinished-image"/>
                                    <div className="icon-minus" id = { 'icon-minus-' + order.reservationId} >
                                        <FontAwesomeIcon icon={faMinusCircle} />
                                    </div>
                                    <div id={'comment-house-wrapper-' + order.reservationId} className="comment-house">
                                        <div className="login-info">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td><input id={'comment-' + order.reservationId} type="text" name="comment" placeholder="Please enter your comments for this house."/></td>
                                                </tr>
                                                <tr>
                                                    <td><input id={'score-' + order.reservationId} type="text" name="score" placeholder="Please enter scores for this house."/></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="login-info-button-wrapper">
                                            <button id="login-info-button" name="login-info-button" className={'submit-' + order.reservationId}>Submit</button>
                                        </div>
                                    </div>
                                    <div className="house-info-mini">
                                        <span>Start Date:&nbsp;{order.startDate}</span>
                                        <span>Leave Date:&nbsp;{order.leaveDate}</span>
                                    </div>
                            </div>)
                        }
                    </div>

                    <div className="display-block finished-order">
                        {this.state.finishedList.map((order) =>
                            <div key={order.reservationId} id={'user-finished-' + order.reservationId} className={"finished-" + order.reservationId}>
                                    <img src={require('' + order.imgDir)}  />
                                    <div className="house-info-mini">
                                        <span>Reviews:&nbsp;{order.houseReview}</span>
                                    </div>
                            </div>)
                        }
                    </div>

                    <div className="wish">
                        <div className="wish-wrapper">
                            <span>My Travel Plan</span>
                            <hr/>
                        </div>
                        <div className="display-block">
                            {this.state.wishListTravel.map((travel) =>
                                <div key={travel.trip_id} id={'user-wishTravel-' + travel.trip_id} className="wish-list">
                                    <p>City:<span>{travel.cityName}</span></p>
                                    <p>Description:<span>{travel.description}</span></p>
                                    <p>Arrive Date:<span>{travel.arriveDate}</span></p>
                                    <p>Leave Date:<span>{travel.leaveDate}</span></p>
                                </div>)
                            }
                        </div>

                        <div className="wish-wrapper">
                            <span>Recommended for you</span>
                            <hr/>
                        </div>
                        <div className="display-block">
                            {this.state.wishListFriend.map((friend) =>
                                <div key={friend.id_user} id={'user-wishFriend-' + friend.id_user} className="wish-list">
                                    <p>First Name:<span>{friend.firstname}</span></p>
                                    <p>Last Name:<span>{friend.lastname}</span></p>
                                    <p>Gender:<span>{friend.gender}</span></p>
                                    <p>Age:<span>{friend.age}</span></p>
                                    <p>Arrive Date:<span>{friend.arriveDate}</span></p>
                                    <p>Leave Date:<span>{friend.leaveDate}</span></p>
                                    <p>Phone:<span>{friend.phone}</span></p>
                                    <p>Email:<span>{friend.email}</span></p>
                                    <p>Relationship:<span>{friend.tag == '0' ? 'Single' : 'In a relationship'}</span></p>
                                    <p>Expected Price:<span>{friend.avgPrice}</span></p>
                                    <p>Similarity:<span>{friend.similarity}</span></p>
                                </div>)
                            }
                        </div>
                    </div>

                </div>

                <div className="mask"></div>
                <div className="add-house-info-wrapper">
                    <div className="add-house-info">
                        <table>
                            <tbody>
                            <tr>
                                <td><input type="date" name="available-date" placeholder="Please enter available date"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="price" placeholder="Please enter price"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="address" placeholder="Please enter address"/></td>
                            </tr>
                            <tr>
                                <td><input type="text" name="city" placeholder="Please enter city"/></td>
                            </tr>
                            <tr>
                                <td>
                                    <select name="tag" id="post-tag">
                                        <option value="0">Luxury/Exclusive Stay</option>
                                        <option value="1">Downtown</option>
                                        <option value="2">Free Parking</option>
                                        <option value="3">Comfy Cozy Space</option>
                                        <option value="4">Quiet Room</option>
                                        <option value="5">Easy Transportation</option>
                                        <option value="6">Fantastic View</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><input type="file" name="file"/></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="add-house-info-button-wrapper">
                        <button id="add-house-info-button" name="add-house-button">Add a house</button>
                    </div>
                </div>
                <div id="back">
                    <button id="go-back">Go Back</button>
                </div>
            </div>
        );
    }
}

export default User;