import React from 'react';

import './FlatButton.css';

interface FlatButtonProps {
    className?: string;
    color?: string;
    background?: string;
    textColor?: string;
    children?: React.ReactNode;
    filled?: boolean;
    style?: React.CSSProperties;

    [key: string]: any;
}

const FlatButton: React.FC<FlatButtonProps> = (props) => {
    const { className, color, background, textColor, children, filled, style, ...restProps } = props;
    const buttonStyle = style || {};

    if (color) {
        buttonStyle.borderColor = color;

        if (filled) {
            buttonStyle.backgroundColor = color;
        }
    }

    if (background) {
        buttonStyle.backgroundColor = background;
    }

    if (textColor) {
        buttonStyle.color = textColor;
    }

    return (
        <button
            className={className ? `flat-button ${className}` : 'flat-button'}
            style={buttonStyle}
            {...restProps}
        >
            {children}
        </button>
    );
};

export default FlatButton;
