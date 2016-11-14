import React from 'react';
import { Link } from 'react-router'
import { primary, primaryText } from '../colors'
import { fullName } from '../../utils'

// Material theme
import {ToolbarGroup} from 'material-ui';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';

// Material CSS rules
const buttonText = {
  color: primaryText,
  padding: 0,
  transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
}

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleAccountMenuOpen = this.handleAccountMenuOpen.bind(this);
    this.handleAccountMenuClose = this.handleAccountMenuClose.bind(this);
  }

  handleAccountMenuOpen(evt) {
    evt.preventDefault();
    this.setState({
      open: true,
      anchorEl: evt.currentTarget
    });
  }

  handleAccountMenuClose() {
    this.setState({ open: false });
  }

  render() {
    const { user, logout } = this.props;
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
          loggedIn ?
            <div className="navbar-item">
              {/* Account Menu popover defined below */}
              <div className="profile-icon"
                onTouchTap={ this.handleAccountMenuOpen }>
                <img
                  src={ user.profile_pic_url }
                  alt={ fullName(user) } />
              </div>
            </div> :
            <div className="navbar-item">
              <Link to="/sign-in">
                <FlatButton
                  label="Sign In" labelStyle={buttonText}
                  hoverColor={primary} rippleColor={primary}
                />
              </Link>
            </div>
        }
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
          targetOrigin={{vertical: 'top', horizontal: 'right'}}
          onRequestClose={this.handleAccountMenuClose}>
          <Menu>
            <MenuItem
              primaryText="Sign Out"
              style={{ minHeight: '20px', lineHeight: '20px' }}
              onClick={ logout }/>
          </Menu>
        </Popover>
      </ToolbarGroup>
    )
  }
}
