import React from 'react';
import { connect } from 'react-redux';
import Signin from './Signin';
import { login, signup } from '../../redux/user'

const initialState = {
  firstName: '', lastName: '', email: '',
  password: '', errors: {}
};

const SignInDecorator = Signin => {
  return class StatefulSignIn extends React.Component {
    constructor(props) {
      super(props);
      this.state = initialState;
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Update changed field and reset potential corresponding error
    handleChange(field, value) {
      let newState = {};
      newState[field] = value;
      if (this.state.errors[field]) {
        let newErrs = this.state.errors;
        delete newErrs[field]
        newState.errors = newErrs;
      }
      this.setState(newState);
    }

    handleSubmit(evt) {
      evt.preventDefault();
      // Check for errors
      const errs = this.validate();
      this.setState({ errors: errs })

      // If no errors, attempt to submit
      if (!Object.keys(errs).length) {
        const creds = {
          email: this.state.email,
          password: this.state.password
        };
        let submitFunc = this.props.login;
        if (this.props.route.form === 'sign-up') {
          creds.firstName = this.state.firstName;
          creds.lastName = this.state.lastName;
          submitFunc = this.props.signup;
        }
        submitFunc(creds, (err) => {
          let newState = err ?
            { errors: {
              submit: `There was an error with ${this.props.route.form}, please try again later`
            }} : initialState;
          this.setState(newState);
        });
      } else
        console.error(errs);
    }

    // Ensure the proper form fields are valid
    validate() {
      let errs = {};
      if (this.props.route.form === 'sign-up') {
        if (!this.state.firstName) errs.firstName = 'This field is required';
        if (!this.state.lastName) errs.lastName = 'This field is required';
      }
      if (!this.state.email) errs.email = 'This field is required';
      if (!this.state.password) errs.password = 'This field is required';
      return errs;
    }

    render() {
      return (
        <Signin
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          form={this.props.route.form}
          errors={this.state.errors}
        />
      )
    }
  }
}


const mapDispatchtoProps = dispatch => ({
  signup: (credentials, displayErr) => {
    dispatch(signup(credentials, displayErr));
  },
  login: (credentials, displayErr) => {
    dispatch(login(credentials, displayErr));
  }
})

export default connect(null, mapDispatchtoProps)(SignInDecorator(Signin));
