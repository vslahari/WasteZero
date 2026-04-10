import React from 'react';
import './SplitCard.css';

const SplitCard = ({ leftContent, rightContent }) => {
    return (
        <div className="split-card">
            <div className="split-card-left">
                {leftContent}
            </div>
            <div className="split-card-right">
                {rightContent}
            </div>
        </div>
    );
};

export default SplitCard;
