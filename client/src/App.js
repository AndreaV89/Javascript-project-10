import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
import CoursesDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';

export default class App extends Component {
  // fetch('http://localhost:5000/api/courses')
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //   });

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />

          <Switch>
            <Route exact path="/" component={Courses} />
            <Route path="/courses/create" component={CreateCourse} />
            <Route path="/courses/:id/update" component={UpdateCourse} />
            <Route path="/courses/:id" component={CoursesDetail} />
            <Route path="/signin" component={UserSignIn} />
            <Route path="/signup" component={UserSignUp} />
            {/* <Route path="/signout" component={UserSignOut} /> */}
            {/* <Route component={NotFound} /> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
};


