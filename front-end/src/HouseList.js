import React, {Component} from 'react';
import './HouseList.css'
import $ from 'jquery'

class HouseList extends Component{

    constructor(props){
       super(props);

       this.state = {
           price: null,
           userId: null
       }
    }

    componentDidMount() {

        this.handleClickHouse();

        this.handleCancelView();

        this.handlePayment();

        this.handleConfirm();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.state.userId = this.props.userId;
    }

    handleClickHouse = () => {

        let handlePayment = this.handlePayment;

        $('.house-list .house-div img').click(function () {

            let houseInfo = '#house-info-' + $(this).attr('id');

            $('.house-list').css("border-top", "1px solid #ccc").css("padding-top", "24px");
            $(houseInfo).show().css("display", "flex")
            $('#jumbotron-wrapper').hide();
            $('.house-list-wrapper').css("margin-top", "100px");
            $('.moto').hide();
            $('.search').hide();
            $('.house-wrapper').hide();

            handlePayment();

        })
    }

    handleCancelView = () => {

        let clearPrice = this.clearPrice;


        $('.house-info-box button[name = cancel]').click(function () {

            $('.search').show();
            $('.house-wrapper').show();

            // $('#jumbotron-wrapper').show();
            $('.house-info').hide();
            $('.house-list').css("border-top", "none").css("padding-top", "0");
            $('.house-list-wrapper').css("margin-top", "0");

            clearPrice();
        });


    }

    getUserId = () => this.props.userId

    handleConfirm = () => {

        let getUserId = this.getUserId;

        $('.house-info-box button[name = confirm]').click(
            function () {

                let userId = getUserId();

                let houseID = $(this).attr('id').split('-').pop();

                let start = '.house-info-box .start-' + houseID;
                let startDate = $(start).val();


                let leave = '.house-info-box .leave-' + houseID;
                let leaveDate = $(leave).val();

                let houseInfo = {
                    houseId: houseID,
                    userId: userId,
                    startDate: startDate,
                    leaveDate: leaveDate
                }

                $.ajax({
                    url: 'http://localhost:3000/reservation/newReservation',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(houseInfo),
                    })
                    .done(function () {
                        alert("You have successfully reserve this house.")
                        $('.house-info').hide();

                        $('.search').show();
                        // $('.house-wrapper').show();
                    })
                    .fail(function() {
                        console.log("error");

                    })
                    .always(function() {
                        console.log("complete");
                    })
            }
        )
    }

    handlePayment = () => {

        let startTime;
        let start;

        $('.house-info-box input[name = start-time]').change(function () {
            startTime  = $(this).val();
            start = startTime.split('-').pop();
            // console.log(end)
        })


        let leaveTime;
        let end;

        let setPrice = this.setPrice;

        $('.house-info-box input[name = leave-time]').change(function () {

            leaveTime = $(this).val();

            end = leaveTime.split('-').pop();

            let id = $(this).attr('id').split('-').pop();

            let name = '.house-info-box .price-' + id;

            let price = $(name).text().split(':').pop();

            // console.log(price)

            let total = (Number(end) - Number(start)) * Number(price);

            // console.log(total);

            setPrice(total);
        })



    }

    setPrice = (price) => {

        this.setState({price: price});
    }

    clearPrice = () => {

        this.setState({price: null});
    }

    render() {
        return (
            <div className="house-list-wrapper">
                <div className="house-list">
                    {this.props.imageList.map((image, index) =>
                        <div key={index} className="house-div">
                            <div className="house-wrapper">
                                    <img onMouseOver={this.handleClickHouse} id={index} src={require('' + image.imgDir)} alt={'house-' + index}/>
                                    <div className="house-info-mini">
                                        <span>City:&nbsp;{image.city}</span>
                                        <span>Price/Night:&nbsp;{image.price}</span>
                                        <span>Score:&nbsp;{image.avgScore}</span>
                                    </div>
                            </div>
                            <div id={'house-info-' + index} className="house-info">
                                <div id={"house-" + index}><img src={require('' + image.imgDir)} alt={'house-' + index}/></div>
                                <div className="house-info-box">
                                    <br/>
                                    <p className="city">City:<span>{image.city}</span></p>
                                    <p className="address">Address:<span>{image.address}</span></p>
                                    <p className="house-tag">House Tag:<span>{image.tag}</span></p>
                                    <p className={"price-" + index}>Price/Night:<span>{image.price}</span></p>
                                    <p className="avg-score">Average Score:<span>{image.avgScore}</span></p>
                                    <br/>
                                    <hr/>
                                    <br/>
                                    <p>Start Date:<input className={'start-' + image.house_id} id={"start-" + index} type="date" name="start-time"/></p>
                                    <p>Leave Date:<input className={'leave-' + image.house_id} id={"leave-" + index} type="date" name="leave-time"/></p>
                                    <p>Total:<span>{this.state.price}</span></p>
                                    <button onClick={this.handleConfirm} id={"confirm-" + image.house_id} name="confirm">Confirm</button>
                                    <button onMouseOver={this.handleCancelView} id={"cancel-" + image.house_id} name="cancel">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default HouseList;