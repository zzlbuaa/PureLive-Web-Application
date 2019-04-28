import React, {Component} from 'react';
import './Search.css'
import $ from 'jquery'

class Search extends Component {

    constructor(props){
        super(props);
        this.state = {
            userId: null
        }
    }

    onSearch = () => {

        let userId = this.props.userId;
        let updateHouse = this.props.handleSearch;

        let Pies = this.props.callbackFromParentForPie;

        let averagePrice = this.props.callbackFromParentForAverage;

        let houseNumber = this.props.callbackFromParentForNumberOfHouse;

        let cityName = $('.input input[name = destination]').val();
        console.log(cityName);
        let checkInTime = $('.input input[name = check-in-time]').val();
        console.log(checkInTime);
        let checkOutTime = $('.input input[name = check-out-time]').val();
        console.log(checkOutTime);

        if(userId === null){

            $.ajax({
                url: 'http://localhost:3000/search/info/countHouse/'+cityName,
                type: 'GET',
            })
                .done(function (data) {
                    console.log(data);
                    houseNumber(data.countHouse);
                    console.log("sucesssssssssssssss");
                })
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
                    console.log("complete");
                })
            $.ajax({
                url: 'http://localhost:3000/search/info/range/'+cityName,
                type: 'GET',
            })
                .done(function (data) {
                    console.log(data);
                    Pies(data);
                    console.log("sucesssssssssssssss");
                })
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
                    console.log("complete");
                })
            $.ajax({
                url: 'http://localhost:3000/search/info/avgPrice/'+cityName,
                type: 'GET',
            })
                .done(function (data) {
                    console.log(data);
                    averagePrice(data.avgPrice);
                    console.log("sucesssssssssssssss");
                })
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
                    console.log("complete");
                })

            $.ajax({
                    url: 'http://localhost:3000/search/info',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        city: cityName,
                        startDate: checkInTime,
                        leaveDate: checkOutTime,
                    }),
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

        }else {

            this.setState({userId: userId});

            $.ajax({
                url: 'http://localhost:3000/search/info/countHouse/'+cityName,
                type: 'GET',
            })
                .done(function (data) {
                    console.log(data);
                    houseNumber(data.countHouse);
                    console.log("sucesssssssssssssss");
                })
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
                    console.log("complete");
                })
            $.ajax({
                url: 'http://localhost:3000/search/info/range/'+cityName,
                type: 'GET',
            })
                .done(function (data) {
                    console.log(data);
                    Pies(data);
                    console.log("sucesssssssssssssss");
                })
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
                    console.log("complete");
                })
            $.ajax({
                url: 'http://localhost:3000/search/info/avgPrice/'+cityName,
                type: 'GET',
            })
                .done(function (data) {
                    console.log(data);
                    averagePrice(data.avgPrice);
                    console.log("sucesssssssssssssss");
                })
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
                    console.log("complete");
                })

            $.ajax({
                url: 'http://localhost:3000/search/info',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    city: cityName,
                    startDate: checkInTime,
                    leaveDate: checkOutTime,
                    user_id: userId,
                }),
            })
            .done(function(data) {
                    console.log(data);
                    updateHouse(data);
             })
            .fail(function() {
                    console.log("error");
             })
             .always(function() {
                    console.log("complete");
             })
        }
        $('.PieChart').show()
    }
    
    render() {
        return (
            <div className="search login-margin">
                    <table border="0">
                        <tbody>
                        <tr>
                            <td className="Where">Where</td>
                            <td className="When">Check-In</td>
                            <td className="Guests">Check-Out</td>
                        </tr>
                        <tr className="input">
                            <td><input type="text" name="destination" placeholder="Destination, City"/></td>
                            <td><input type="date" name="check-in-time"/></td>
                            <td><input type="date" name="check-out-time"/></td>
                        </tr>
                        </tbody>
                    </table>

                    <button onClick={this.onSearch} id="search-button" name="search-button">Search</button>
            </div>
        );
    }
}

export default Search;