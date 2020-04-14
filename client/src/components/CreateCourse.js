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
    const authUser = context.authenticatedUser;
    const psw = context.password;

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      owner: context.authenticatedUser.id,
      errors,
    };

    context.data.createCourse(course, authUser.emailAddress, psw)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          this.props.history.push('/');
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error')
      })
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