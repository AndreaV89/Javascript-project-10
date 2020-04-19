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

  async componentDidMount() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const course = await context.data.getCourse(this.props.match.params.id);
    if (course === null) {
      this.props.history.push('/notfound');
    }
    else if (course.owner.id !== authUser.id) {
      this.props.history.push('/forbidden');
    } else {
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
    const psw = atob(context.password);

    const {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    const course = {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      owner: authUser.id,
      errors,
    };

    context.data.updateCourse(course, authUser.emailAddress, psw)
      .then( errors => {
        if (errors === 403) {
          this.props.history.push('/forbidden');
        }
        else if (errors === 404) {
          this.props.history.push('/notfound');
        }
        else if (errors.length) {
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