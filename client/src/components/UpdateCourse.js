import React, { Component } from 'react';

export default class UpdateCourse extends Component {

  constructor() {
    super();
    this.state = {
      course: {},
      owner: {},
      id: '',
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      errors: [],
    }
  }

  // Get the course when the component get mounted
  async componentDidMount() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const course = await context.data.getCourse(this.props.match.params.id);
    if (course === null) {
      // If the course not exist redirect to /notfound route
      this.props.history.push('/notfound');
    }
    else if (course.owner.id !== authUser.id) {
      // If the current user is not the owner of the course redirect to /forbidden route
      this.props.history.push('/forbidden');
    } else {
      // else set the state with the information about the selected course
      this.setState({
        course: course,
        owner: course.owner,
        id: course.id,
        title: course.title,
        description: course.description,
        estimatedTime: course.estimatedTime,
        materialsNeeded: course.materialsNeeded,
      });
    } 
  }

  render() {
    return (
      <div className="bounds course--detail">
      <h1>Update Course</h1>
      <div>
        <ErrorsDisplay errors={this.state.errors} />
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
                  value={this.state.title} />
              </div>
              <p>By {this.state.owner.firstName} {this.state.owner.lastName}</p>
            </div>
            <div className="course--description">
              <div>
                <textarea 
                  id="description" 
                  name="description" 
                  className="" 
                  placeholder="Course description..."
                  onChange={this.change}
                  value={this.state.description} >
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
                      value={this.state.estimatedTime} />
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
                      value={this.state.materialsNeeded} >
                    </textarea>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-100 pad-bottom">
            <button className="button" type="submit">Update Course</button>
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
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    // Create the course object with the new info
    const course = {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      owner: authUser.id,
      errors,
    };

    // Call updateCourse method from context
    context.data.updateCourse(course, authUser.emailAddress, psw)
      .then( errors => {
        if (errors === 403) {
          // If the user is not authorized redirect to /forbidden route
          this.props.history.push('/forbidden');
        }
        else if (errors === 404) {
          // If the course doesn't exist redirect to /notfound route
          this.props.history.push('/notfound');
        }
        else if (errors.length) {
          // If there is errors returns them
          this.setState({ errors });
        } else {
          // Else redirect to updated course
          this.props.history.push(`/courses/${this.state.course.id}`);
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
    this.props.history.push(`/courses/${this.state.course.id}`);
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