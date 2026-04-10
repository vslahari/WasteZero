import React from 'react';
import './Card.css';

/**
 * Card Component with Variants
 * @param {Object} props
 * @param {'default' | 'glass' | 'featured'} [props.variant='default']
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 */
const Card = ({ variant = 'default', title, children, ...props }) => {
    return (
        <div className={`card card-${variant}`} {...props}>
            {title && <div className="card-title">{title}</div>}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default Card;
