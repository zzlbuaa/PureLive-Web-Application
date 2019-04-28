import React, { Component } from 'react';
import './Footer.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faEnvelope, faPhone} from '@fortawesome/free-solid-svg-icons';

library.add(faMap, faEnvelope, faPhone);

class Footer extends Component {
    render() {
        return (
            <div className="footer-wrapper">
                <footer className="footer">
                    <p className="title">Pure Live</p>
                    <p>"Help you find the best memory for your trip."</p>
                    <ul>
                        <li>
                            <p><FontAwesomeIcon icon={faMap}/></p>
                            <p>PureLive office, IL</p>
                        </li>
                        <li>
                            <p><FontAwesomeIcon icon={faEnvelope}/></p>
                            <p>info@PureLive.com</p>
                        </li>
                        <li>
                            <p><FontAwesomeIcon icon={faPhone}/></p>
                            <p>+1 217 305 3159</p>
                        </li>
                    </ul>
                </footer>
            </div>
        );
    }
}

export default Footer;