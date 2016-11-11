import React from 'react';
import { Link } from 'react-router'
import { primary, primaryText } from '../colors'

// Material theme
import {ToolbarGroup} from 'material-ui';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

// Material CSS rules
const buttonText = {
  color: primaryText,
  padding: 0,
  transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
}

export default ({ user, logout }) => {
  const loggedIn = Object.keys(user).length;
  return (
    <ToolbarGroup style={{float: 'right'}}>
      <div className="navbar-item">
        <Link to="/">
          <FlatButton
            label="Discover" labelStyle={buttonText}
            hoverColor={primary} rippleColor={primary}
          />
        </Link>
      </div>
      {
        // /account
        loggedIn ? (
          <div className="navbar-item">
            <Link to="/goals">
              <FlatButton
                label="Goals" labelStyle={buttonText}
                hoverColor={primary} rippleColor={primary}
              />
            </Link>
          </div>
        ) : null
      }
      <div className="navbar-item">
        <Link to="/activity">
          <FlatButton
            label="Activity" labelStyle={buttonText}
            hoverColor={primary} rippleColor={primary}
          />
        </Link>
      </div>
      {
        // /login or /logout
        loggedIn ? (
          <div className="navbar-item">
            <FlatButton
              label="Sign Out" labelStyle={buttonText}
              hoverColor={primary} rippleColor={primary}
              onClick={logout}
            />
          </div>
        ) : (
          <div className="navbar-item">
            <Link to="/sign-in">
              <FlatButton
                label="Sign In" labelStyle={buttonText}
                hoverColor={primary} rippleColor={primary}
              />
            </Link>
          </div>
        )
      }
    </ToolbarGroup>
)};
