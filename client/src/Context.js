import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    password: localStorage.getItem('psw') || null,
  }

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const authenticatedUser = this.state.authenticatedUser;
    const password = this.state.password;

    const value = {
      authenticatedUser,
      password,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
      }
    }

    console.log(this.state.password);

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
          password: password,
        };
      });
      // Set cookies
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
      console.log(password);
      localStorage.setItem("psw", password);
    }

    return user;
  }

  signOut = () => {
    this.setState({ 
      authenticatedUser: null,
      password: null,
    });
    Cookies.remove('authenticatedUser');
    localStorage.removeItem("psw");
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

