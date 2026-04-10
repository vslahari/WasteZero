import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../auth/RegisterForm';
import './RegisterPage.css';

// Assets
import Character from '../../assets/Character.svg';
import TopLeftPlant from '../../assets/Top left plant.svg';
import RightSideLeaf from '../../assets/Right side leaf.svg';
import BottomRightPlant from '../../assets/Bottom right.svg';

const RegisterPage = () => {
    return (
        <div className="register-page-container">
            {/* Background/Decor Assets */}
            <img src={TopLeftPlant} alt="" className="decor-top-left" />
            <img src={RightSideLeaf} alt="" className="decor-right-side" />

            <div className="register-content-wrapper">
                <img src={Character} alt="Character" className="decor-character" />

                {/* Main Card Panel - 493x645 */}
                <div className="register-card-panel">
                    <RegisterForm />

                    <img src={BottomRightPlant} alt="" className="decor-bottom-right" />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
