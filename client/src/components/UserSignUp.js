// Import modules
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    return (
      <div className="bounds">
      <div className="grid-33 centered signin">
        <h1>Sign Up</h1>
        <div>
          <ErrorsDisplay errors={errors} />
          <form onSubmit={this.submit}>
            <div>
              <input 
                id="firstName" 
                name="firstName" 
                type="text" 
                className="" 
                placeholder="First Name" 
                value={firstName} 
                onChange={this.change} />
            </div>
            <div>
              <input 
                id="lastName" 
                name="lastName" 
                type="text" 
                className="" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={this.change} />
            </div>
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
            <div>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                className="" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={this.change} />
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">Sign Up</button>
              <button className="button button-secondary" onClick={this.cancel}>Cancel</button></div>
          </form>
        </div>
        <p>&nbsp;</p>
        <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
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

    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    // Create the user object with the submitted info
    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    };
    
    if (password !== confirmPassword) {
      // If the 'Password' and the 'Confirm Password' fields doesn't match return an error
      this.setState({ errors: ['"Password" field must match "Confirm Password" field.']})
    } else {
      // Else call createUser method from context
      context.data.createUser(user)
      .then( errors => {
        if (errors.length) {
          // If there is errors returns them
          this.setState({ errors });
        } else {
          // Else, if the user is correctly created, sign in him and retirect to courses route
          context.actions.signIn(emailAddress, password)
            .then(() => {
              this.props.history.push('/');
            })
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error')
      })
    }
    
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