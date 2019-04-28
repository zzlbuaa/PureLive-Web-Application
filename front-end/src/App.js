import React, { Component } from 'react';
import './App.css';
import './PieChart.css';
import Navigator from './Navigator.js';
import Jumbotron from './Jumbotron.js';
import Search from './Search.js';
import MainSection from './MainSection.js';
import User from "./User.js";
import Footer from "./Footer.js";

import logo from './images/logo.png';

import ReactChartkick, { LineChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'


ReactChartkick.addAdapter(Chart)



class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            userId: null,
            user: {},
            imageList: [],
            postList: [],
            searchFlag: false,
            Pies: [1,2,3,4],
            averagePrice: 12,
            numberOfHouse: 2,
        }
    }

    handleLogin = (userId, user) => {
        this.setState({userId: userId});

        this.setState({user: user})

        console.log(this.state.userId);

    }

    handleLogOut = () => {
        this.setState({userId: null})
    }

    handleSearch = (data) => {
        this.setState({imageList: data, searchFlag: true})
        // console.log(this.state.imageList)
    }

    myCallBackForPie = (Piesfromsearch) => {
        console.log(Piesfromsearch);
        this.setState({Pies: Piesfromsearch});
        console.log(this.state.Pies);
    }

    callbackFromParentForAverage = (averageUpdate) => {
        console.log(averageUpdate);
        console.log("here");
        this.setState({averagePrice: averageUpdate});
        console.log(this.state.averagePrice);
    }

    callbackForNumberOfHouses = (houseNumberUpdate) => {
        console.log(houseNumberUpdate);
        console.log("here");
        this.setState({numberOfHouse: houseNumberUpdate});
        console.log(this.state.numberOfHouse);
    }

    render() {
        return (
          <div className="App">

            <Navigator handleLogin = {this.handleLogin} handleLogOut = {this.handleLogOut} loadUserPost = {this.loadUserPost}/>

            <Jumbotron/>

            <div className="moto login-margin">
              <img src={logo} alt="logo"/>
              <h1>Start your fantastic<br/>
                memory here.</h1>
            </div>

            <Search userId = {this.state.userId} handleSearch = {this.handleSearch}
                    callbackFromParentForPie={this.myCallBackForPie}
                    callbackFromParentForAverage={this.callbackFromParentForAverage}
                    callbackFromParentForNumberOfHouse={this.callbackForNumberOfHouses}/>

            <MainSection imageList={this.state.imageList} searchFlag={this.state.searchFlag} userId={this.state.userId}/>

              <div className="PieChart">
                  <p className="title">Price Distribution</p>
                  <p>Average Price: {this.state.averagePrice} Number of Houses: {this.state.numberOfHouse}</p>
                  <PieChart data={[["$0~$100", this.state.Pies[0] ], ["$100~$300", this.state.Pies[1]],["$300~$500", this.state.Pies[2]],[">=$500", this.state.Pies[3]]]} />
              </div>

            <User userId = {this.state.userId} user = {this.state.user}/>

            <Footer/>

          </div>
        );
    }
}

export default App;
