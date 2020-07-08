import React from 'react';

// import './HeaderItem.css';

interface HeaderItemProps {
    className?: string;
    children?: React.ReactNode;
    filled?: boolean;
    style?: React.CSSProperties;

    [key: string]: any;
}

const HeaderItem: React.FC<HeaderItemProps> = (props) => {
    const { className, color, background, textColor, children, filled, style, ...restProps } = props;
    const headerStyle = style || {};

    return (
        <div
            className={className ? `header-item ${className}` : 'header-item'}
            style={headerStyle}
            {...restProps}
        >
            {children}
        </div>
    );
};

export default HeaderItem;
