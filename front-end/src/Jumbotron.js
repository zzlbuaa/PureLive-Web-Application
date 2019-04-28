import React, { Component } from 'react';
import './Jumbotron.css'
import $ from 'jquery';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronLeft, faChevronRight)

class Jumbotron extends Component{
    //
    // constructor(props){
    //     super(props);
    // }

    componentDidMount() {

        function nextSlide() {

            let currentSlide = $('.slide.active');
            let nextSlide = currentSlide.next();
            let currentDot = $('.dot.active');
            let nextDot = currentDot.next();

            currentSlide.fadeOut(800).removeClass('active');
            nextSlide.fadeIn(800).addClass('active');

            currentDot.removeClass('active');
            nextDot.addClass('active');

            if (nextSlide.length === 0) {
                $('.slide').first().fadeIn(800).addClass('active');
                $('.dot').first().addClass('active');
            }
        }

        $('#right-jumbotron-arrow').click(function() {
            nextSlide();
        });

        // Left(previous) arrow
        function prevSlide() {

            let currentSlide = $('.slide.active');
            let prevSlide = currentSlide.prev();
            let currentDot = $('.dot.active');
            let prevDot = currentDot.prev();

            currentSlide.fadeOut(800).removeClass('active');
            prevSlide.fadeIn(800).addClass('active');
            currentDot.removeClass('active');
            prevDot.addClass('active');

            if(prevSlide.length === 0) {
                $('.slide').last().fadeIn(800).addClass('active');
                $('.dot').first().addClass('active');
            }
        }

        $('#left-jumbotron-arrow').click(function() {
            prevSlide();
        });

        setInterval(nextSlide, 4000);
    }

    render() {
        return (
            <div id="jumbotron-wrapper">
                <div id="jumbotron-arrow-wrapper">
                    <div className="jumbotron-arrow" id="left-jumbotron-arrow"><FontAwesomeIcon icon={faChevronLeft} className="arrow" />
                    </div>
                    <div className="jumbotron-arrow" id="right-jumbotron-arrow"><FontAwesomeIcon icon={faChevronRight} className="arrow" />
                    </div>
                </div>
                <div id="slides-wrapper">
                    <div id="slide-one" className="slide active">
                        <h1>Why book an expensive hotel when you can book a cheap appartment</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fermentum mi lacus, quis
                            gravida lorem congue sed. Sed nec pharetra.</p>
                    </div>
                    <div id="slide-two" className="slide">
                        <h1>We have you covered anywhere you go</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fermentum mi lacus, quis
                            gravida lorem congue sed. Sed nec pharetra.</p>
                    </div>
                    <div id="slide-three" className="slide">
                        <h1>We believe in a world where anyone can belong</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fermentum mi lacus, quis
                            gravida lorem congue sed. Sed nec pharetra.</p>
                    </div>
                </div>
                <div id="slides-dots">
                    <div className="dot active"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        );
    }
}

export default Jumbotron;