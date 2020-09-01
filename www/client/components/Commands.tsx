import React, { Component } from 'react';
import './App.css';
import './Commands.css';

class Commands extends Component<{}, {items: any, isLoaded: boolean}> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch('/commands.json').then(res => {
            return res.json();
        }).then((users: any) => {
            this.setState({
                isLoaded: true,
                items: users,
            })
        })
    }

    render() {

        var { isLoaded, items} = this.state;

        console.log(items);
        console.log(isLoaded);

        if (!isLoaded) {
            return (
                <div>Loading Commands...</div>
            )
        } else {
            return (
                <div className="Commands">
                    {items.map((command: any) => {
                        return (
                            <div className="command-item">
                                <div className="title">~{command.name} {command.aliases.length !== 0 && <span className="aliases">({command.aliases.join(', ')})</span>}</div>
                                <div className="description">{command.description}</div>
                                <div className="usage">~{command.usage}</div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
} 

export default Commands;
