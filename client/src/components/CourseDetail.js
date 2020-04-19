import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

export default class CoursesDetail extends Component {

  constructor() {
    super();
    this.state = {
      course: {},
      owner: {}
    }
  }

  async componentDidMount() {
    const { context } = this.props;
    const course = await context.data.getCourse(this.props.match.params.id);
    if (course !== null) {
      this.setState({
        course: course,
        owner: course.owner,
      });
    } else {
      this.props.history.push('/notfound');
    }
  }

  handleDelete = e => {
    e.preventDefault();

    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const psw = atob(context.password);
    const course = this.state.course;

    context.data.deleteCourse(course, authUser.emailAddress, psw)
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

  render() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    return (
      <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            {authUser && authUser.id === this.state.owner.id ?
              <React.Fragment>
                <span>
                  <Link className="button" to={`/courses/${this.state.course.id}/update`}>Update Course</Link>
                  <Link className="button" to="/" onClick={this.handleDelete}>Delete Course</Link>
                </span>
                <Link className="button button-secondary" to="/">Return to List</Link>
              </React.Fragment>
            :
              <Link className="button button-secondary" to="/">Return to List</Link>
            }
          </div>
        </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{this.state.course.title}</h3>
            <p>By {this.state.owner.firstName} {this.state.owner.lastName}</p>
          </div>
          <div className="course--description">
            <ReactMarkdown source={this.state.course.description} />
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h4>Estimated Time</h4>
                <h3>{this.state.course.estimatedTime}</h3>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <ul>
                  <ReactMarkdown source={this.state.course.materialsNeeded} />
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    );
  }
};