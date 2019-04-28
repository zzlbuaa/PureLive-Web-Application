import React, {Component} from 'react';
import './MainSection.css';
import HouseList from './HouseList.js'

class MainSection extends Component {

    constructor(props){

        super(props);

        this.state = {
            imageRandom : [
                {
                    "house_id": 23,
                    "availableDates": "2019-03-31T05:00:00.000Z",
                    "price": 710,
                    "address": "1000Stoughton",
                    "city": "Shanghai",
                    "user_id": 5655,
                    "avgScore": 4.6,
                    "finishedRes": 0,
                    "tag": "comfortable",
                    "imgDir": './images/house/house-one.jpg'
                },
                {
                    "house_id": 39,
                    "availableDates": "2019-03-31T05:00:00.000Z",
                    "price": 930,
                    "address": "1000Stoughton",
                    "city": "Chongqing",
                    "user_id": 5655,
                    "avgScore": 4.8,
                    "finishedRes": 0,
                    "tag": "comfortable",
                    "imgDir": './images/house/house-two.jpg'
                },
                {
                    "house_id": 239,
                    "availableDates": "2019-03-31T05:00:00.000Z",
                    "price": 1100,
                    "address": "1000Stoughton",
                    "city": "Chengdu",
                    "user_id": 5655,
                    "avgScore": 4.7,
                    "finishedRes": 0,
                    "tag": "clean",
                    "imgDir": './images/house/house-three.jpg'
                },
                {
                    "house_id": 99,
                    "availableDates": "2019-03-31T05:00:00.000Z",
                    "price": 520,
                    "address": "1000Stoughton",
                    "city": "Beijing",
                    "user_id": 5655,
                    "avgScore": 4.8,
                    "finishedRes": 0,
                    "tag": "comfortable",
                    "imgDir": './images/house/house-four.jpg'
                },
                {
                    "house_id": 399,
                    "availableDates": "2019-03-31T05:00:00.000Z",
                    "price": 770,
                    "address": "1000Stoughton",
                    "city": "Xiamen",
                    "user_id": 5655,
                    "avgScore": 4.9,
                    "finishedRes": 0,
                    "tag": "comfortable",
                    "imgDir": './images/house/house-five.jpg'
                },
                {
                    "house_id": 3,
                    "availableDates": "2019-03-31T05:00:00.000Z",
                    "price": 960,
                    "address": "1000Stoughton",
                    "city": "Dali",
                    "user_id": 5655,
                    "avgScore": 4.6,
                    "finishedRes": 0,
                    "tag": "comfortable",
                    "imgDir": './images/house/house-six.jpg'
                }
            ],
        }
    }


    render() {
        return (
            <div className="container">
               <HouseList imageList={this.props.searchFlag ? this.props.imageList : this.state.imageRandom} userId={this.props.userId}/>
            </div>
        );
    }
}

export default MainSection;