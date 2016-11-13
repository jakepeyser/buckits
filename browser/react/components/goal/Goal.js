import React from 'react';
import { Link } from 'react-router';
import { AutoComplete, SelectField, MenuItem } from 'material-ui'

export default ({ goal, category, loggedIn, like, unlike, add, done }) => {
  if (!goal) return null;
  return (
    <div id="goal">
      <div className="goal-banner">
        <div className="goal-header">
          <h3>{`We want to ${category.action}...`}</h3>
          <h1>{goal.name}</h1>
        </div>
        <img
          className="goal-banner-img"
          alt={goal.name}
          src={goal.banner_pic_url} />
      </div>
    </div>
  )
}
