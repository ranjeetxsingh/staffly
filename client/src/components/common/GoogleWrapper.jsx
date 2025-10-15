import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from '../LoginRegister/GoogleLogin';

const GoogleWrapper = ({btnContent}) => (
  <GoogleOAuthProvider clientId="98180411366-sf7oqd45ruct2ssajsfqd43bgqpdlfr8.apps.googleusercontent.com">
    <GoogleLogin btnContent={btnContent} />
  </GoogleOAuthProvider>
);

export default GoogleWrapper;
