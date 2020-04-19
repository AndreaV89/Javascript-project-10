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



  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

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

    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    };
    
    if (password !== confirmPassword) {
      this.setState({ errors: ['"Password" field must match "Confirm Password" field.']})
    } else {
      context.data.createUser(user)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
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

  cancel = () => {
    this.props.history.push('/');
  }
};

function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;

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