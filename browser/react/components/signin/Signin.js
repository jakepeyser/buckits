import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { TextField, RaisedButton } from 'material-ui';
import { primary, primaryText } from '../colors';

export default ({ handleChange, handleSubmit, form, errors }) => {
  const actionText = form === 'sign-in' ? 'Sign In' : 'Sign Up';
  return (
    <div id="sign-in" className="row">
      <Helmet title={ actionText } />
      <form className="sign-in-form" onSubmit={ handleSubmit }>
        {
          form === 'sign-up' ? (
            <div>
              <div className="col-xs-12 col-md-6">
                <TextField
                  floatingLabelText="First Name"
                  errorText={ errors.firstName }
                  fullWidth={ true }
                  onChange={(evt) => handleChange('firstName', evt.target.value) }
                />
              </div>
              <div className="col-xs-12 col-md-6">
                <TextField
                  floatingLabelText="Last Name"
                  errorText={ errors.lastName }
                  fullWidth={ true }
                  onChange={(evt) => handleChange('lastName', evt.target.value) }
                />
              </div>
            </div>
          ) : null
        }
        <div className="col-xs-12">
          <TextField
            floatingLabelText="Email"
            errorText={ errors.email }
            type="email"
            fullWidth={ true }
            onChange={(evt) => handleChange('email', evt.target.value) }
          />
        </div>
        <div className="col-xs-12">
          <TextField
            floatingLabelText="Password"
            errorText={ errors.password }
            type="password"
            fullWidth={ true }
            onChange={(evt) => handleChange('password', evt.target.value) }
          />
        </div>
        <div className="sign-in-form-submit-div">
          {
            errors.submit ? (
              <span className="form-submit-error">{ errors.submit }</span>
            ) : null
          }
          <RaisedButton
            label={ actionText }
            type="submit"
            backgroundColor={primary}
            labelColor={primaryText}
            style={{ marginTop: '.5em', marginBottom: '.5em' }}
          />
          {
            form === 'sign-up' ? (
              <span>
                Already a member? Go ahead and&nbsp;
                <Link to="/sign-in">sign in</Link>
              </span>
            ) : (
              <span>
                Don't have an account? Come&nbsp;
                <Link to="/sign-up">sign up</Link>
                &nbsp;and join us
              </span>
            )
          }
        </div>
      </form>
    </div>
  )
}
