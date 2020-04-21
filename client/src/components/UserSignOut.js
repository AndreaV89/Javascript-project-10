// Import modules
import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({ context }) => {
  // Call signOut method from context
  context.actions.signOut();

  // Redirect to courses list
  return (
    <Redirect to="/" />
  );
}
