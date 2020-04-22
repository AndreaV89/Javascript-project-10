// Import modules
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    password: Cookies.get('psw') || null,
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

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  // SignIn method - return the user that have provided emailAddress and password
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    const encodedPassword = btoa(password);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
          password: encodedPassword,
        };
      });
      // Set cookies
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
      Cookies.set("psw", encodedPassword, { expires: 1 });
    }

    return user;
  }

  // SignOut method - Set authenticatedUser and password to null and remove cookies
  signOut = () => {
    this.setState({ 
      authenticatedUser: null,
      password: null,
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('psw');
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

