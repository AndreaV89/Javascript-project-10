import React, { Component } from 'react';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  }

  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    // Retrieve authenticated user from context
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    
    return (
      <div className="bounds course--detail">
      <h1>Create Course</h1>
      <div>
        <ErrorsDisplay errors={errors} />
        <form onSubmit={this.submit} >
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <div>
                <input 
                  id="title" 
                  name="title" 
                  type="text" 
                  className="input-title course--title--input" 
                  placeholder="Course title..."
                  onChange={this.change}
                  value={title} />
              </div>
              <p>By {authUser.firstName} {authUser.lastName}</p>
            </div>
            <div className="course--description">
              <div>
                <textarea 
                  id="description" 
                  name="description" 
                  className="" 
                  placeholder="Course description..."
                  onChange={this.change}
                  value={description} >
                </textarea>
              </div>
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <div>
                    <input 
                      id="estimatedTime" 
                      name="estimatedTime" 
                      type="text" 
                      className="course--time--input"
                      placeholder="Hours"
                      onChange={this.change}
                      value={estimatedTime} />
                  </div>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <div>
                    <textarea 
                      id="materialsNeeded" 
                      name="materialsNeeded" 
                      className="" 
                      placeholder="List materials..."
                      onChange={this.change}
                      value={materialsNeeded} >
                    </textarea>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-100 pad-bottom">
            <button className="button" type="submit">Create Course</button>
            <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
          </div>
        </form>
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

    // Retrieve credentials for authentication from context
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const psw = atob(context.password);

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    // Create the course object with the submitted info
    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      owner: context.authenticatedUser.id,
      errors,
    };

    // Call createCourse method from context
    context.data.createCourse(course, authUser.emailAddress, psw)
      .then( errors => {
        if (errors.length) {
          // If there is errors returns them
          this.setState({ errors });
        } else {
          // Else redirect to courses list
          this.props.history.push('/');
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error')
      })
  } 

  /**
   * cancel method - handle the cancel button.
   */
  cancel = () => {
    // Redirect to courses list
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