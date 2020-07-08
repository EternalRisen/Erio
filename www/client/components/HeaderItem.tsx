import React from 'react';

import './HeaderItem.css';

interface HeaderItemProps {
    className?: string;
    children?: React.ReactNode;
    filled?: boolean;
    style?: React.CSSProperties;
    link?: string;

    [key: string]: any;
}

const HeaderItem: React.FC<HeaderItemProps> = (props) => {
    const { className, color, background, textColor, children, filled, style, link, ...restProps } = props;
    const headerStyle = style || {};

    if (props.link) {
        return (
            <div
                className={className ? `header-item ${className}` : 'header-item'}
                style={headerStyle}
                {...restProps}
            >
                <a href={props.link}>{children}</a>
        </div>
        )
    } else {
        return (
            <div
                className={className ? `header-item ${className}` : 'header-item'}
                style={headerStyle}
                {...restProps}
            >
                {children}
                
            </div>
        );
    }
};

export default HeaderItem;
