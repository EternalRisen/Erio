import React from 'react';
import HeaderItem from './HeaderItem';

import './Header.css';

interface HeaderProps {
    className?: string;
    color?: string;
    background?: string;
    textColor?: string;
    children?: React.ReactNode;
    filled?: boolean;
    style?: React.CSSProperties;

    [key: string]: any;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { className, color, background, textColor, children, filled, style, ...restProps } = props;
    const headerStyle = style || {};

    return (
        <div
            className={className ? `header ${className}` : 'header'}
            style={headerStyle}
            {...restProps}
        >
            <div className="header-left">
                <HeaderItem link="/commands">Commands</HeaderItem>
                <HeaderItem link="https://discord.com/oauth2/authorize?client_id=699892206126760026&scope=bot&permissions=37088576">Invite Me!</HeaderItem>
            </div>
            <div className="header-right">
                <HeaderItem link="/">Dashboard</HeaderItem>
            </div>
            {children}
        </div>
    );
};

export default Header;
