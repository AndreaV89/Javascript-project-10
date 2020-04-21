// Import modules
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <ErrorsDisplay errors={errors} />
            <form onSubmit={this.submit}>
              <div>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text" 
                  className="" 
                  placeholder="Email Address" 
                  value={emailAddress} 
                  onChange={this.change} />
              </div>
              <div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  className="" 
                  placeholder="Password" 
                  value={password} 
                  onChange={this.change} />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Sign In</button>
                <button className="button button-secondary" onClick={this.cancel}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    );
  }

  /**
   * change method - Helper that change the value of each component's state, as the user type.
   */
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  /**
   * submit method - Handle the submit button
   */
  submit = (e) => {
    e.preventDefault();
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { emailAddress, password } = this.state;

    // Call signIn method from context
    context.actions.signIn(emailAddress, password)
      .then( user => {
        if (user === null) {
          // If the user not exists return an error
          this.setState(() => {
            return { errors: [ 'Sign-in was unsuccessful' ] };
          });
        } else {
          // Else redirect to previous location if there are
          this.props.history.push(from);
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      })
  }

  /**
   * cancel method - handle the cancel button.
   */
  cancel = () => {
    this.props.history.push('/');
  }
};

/**
 * ErrorDisplay function - Function that renders errors if there are any.
 * @param {object} errors - An object of errors. 
 */
function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;

  // If there are at least one error render, create the markup
  if (errors.length) {
    errorsDisplay = (
      <div>
        <h2 className="validation--errors--label">Validation errors</h2>
        <div className="validation-errors">
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  return errorsDisplay;
}