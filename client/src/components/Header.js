import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ context }) => {
  // Retrieve authenticated user from context
  const authUser = context.authenticatedUser;

  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo">Courses</h1>
        <nav>
          {// If a user is authenticated render the 'Sign Out' button, first name and last name of the user
            authUser ?
            <React.Fragment>
              <span>Welcome, {authUser.firstName} {authUser.lastName}!</span>
              <Link className="signout" to="/signout">Sign Out</Link>
            </React.Fragment>
          :
            // Else render the 'Sign Up' and 'Sign In' buttons 
            <React.Fragment>
              <Link className="signup" to="/signup">Sign Up</Link>
              <Link className="signin" to="/signIn">Sign In</Link>
            </React.Fragment>
          }

        </nav>
      </div>
    </div>
  );
};

export default Header;
