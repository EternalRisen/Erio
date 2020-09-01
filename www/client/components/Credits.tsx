import React, { Component } from 'react';
import './App.css';
import './Credits.css';

class Credits extends Component<{}, {items: any, isLoaded: boolean}> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch('/credits.json').then(res => {
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
                <div>Loading User(s)...</div>
            )
        } else {
            return (
                <div className="developers">
                    {items.map((user: any) => {
                        return (
                            <div key={user.tag} className='dev'>
                                <img width="20%" height="20%" className='avatar' src={user.avatar}/>
                                <p className='name'>{user.name}</p>
                                <p className="role">{user.role}</p>
                                <br />
                                <div>
                                    <p className="intro">{user.intro}</p>
                                    <p className="custom-message">{user.message}</p>
                                    <p className="github">{user.github} <a href={user.site}>here</a></p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
} 

export default Credits;
