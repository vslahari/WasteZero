
import React from 'react';

const RegisterIllustration = () => {
    return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px', position: 'relative' }}>
            {/* Placeholder for "Woman with Coffee" Illustration */}
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="180" fill="#E8F5E9" opacity="0.5" />

                {/* Abstract representation of Person */}
                <g transform="translate(100, 50)">
                    <path d="M100 80 Q100 40 130 40 Q160 40 160 80 L160 120 L100 120 Z" fill="#4CAF50" />
                    <circle cx="130" cy="100" r="30" fill="#1E293B" />

                    {/* Coffee Cup */}
                    <rect x="150" y="150" width="30" height="40" fill="#795548" />
                </g>

                {/* Leaf Background Element */}
                <path d="M50 350 Q0 300 50 200 Q200 100 250 250 Q100 400 50 350" fill="#81C784" opacity="0.2" />

                <text x="50%" y="90%" textAnchor="middle" fill="#555" fontSize="14">
                    (Placeholder: Woman with Coffee Illustration)
                </text>
            </svg>
        </div>
    );
};

export default RegisterIllustration;
