import React from 'react';
import { Link } from 'react-router'
import NavbarMenu from './NavbarMenu'
import { primary, primaryText } from '../colors'

// Material theme
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui';
import FontIcon from 'material-ui/FontIcon';

export default (props) => (
  <Toolbar id="navbar" style={{backgroundColor: primary}}>
    <ToolbarGroup>
      <Link to="/">
        <ToolbarTitle style={{color: primaryText, padding: 0}} text="Buckets" />
      </Link>
    </ToolbarGroup>
    <NavbarMenu { ...props } />
  </Toolbar>
);
