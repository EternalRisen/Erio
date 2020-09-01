import React, { Component } from 'react';
import './App.css';
import './Users.css';

class User extends Component<{}, {items: any, isLoaded: boolean}> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        fetch('/users.json').then(res => {
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
                <div className="Users">
                    {items.map((user: any) => {
                        return (
                            <div key={user.tag} className='user'>
                                <img width="20%" height="20%" className='avatar' src={user.avatar}/>
                                <p className='user-tag'>{user.tag}</p>
                                <p className='user-id'>{user.id}</p>
                                <p className='creation-date'>{user.createdAt}</p>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
} 

export default User;
