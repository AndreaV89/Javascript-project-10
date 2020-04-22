// Import modules
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const SignOut = ({ context }) => {

  useEffect (() => {
    // Call signOut method from context
    context.actions.signOut();
  });

  // Redirect to courses list
  return (
    <Redirect to="/" />
  );
}

export default SignOut;
