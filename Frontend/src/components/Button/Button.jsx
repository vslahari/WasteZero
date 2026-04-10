import React from 'react';
import './Button.css';

/**
 * Button Component with Variants
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} [props.variant='primary']
 * @param {React.ReactNode} props.children
 * @param {Function} [props.onClick]
 */
const Button = ({ variant = 'primary', children, onClick, ...props }) => {
    return (
        <button
            className={`btn btn-${variant}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
