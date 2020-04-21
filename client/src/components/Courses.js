// Import modules
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Courses extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
    }
  }

  // Get the courses when the component get mounted
  async componentDidMount() {
    const { context } = this.props;
    const courses = await context.data.getCourses();
    // If the courses exist
    if (courses !== null) {
      this.setState(() => {
        return {
          courses: courses,
        };
      });
    } else {
      // else redirect to /error route.
      this.props.history.push('/error');
    }
  }
  
  render() {

    // Create the markup for each course in courses array
    const courses = this.state.courses.map(course => 
      <div className="grid-33" key={course.id}>
        <Link className="course--module course--link" to={`/courses/${course.id}`}>
          <h4 className="course--label">Course</h4>
          <h3 className="course--title">{course.title}</h3>
        </Link>
      </div>
    );

    return (
      <div className="bounds">
        {courses}
        <div className="grid-33">
          <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
          </Link>
        </div>
      </div>
    );
  }
};