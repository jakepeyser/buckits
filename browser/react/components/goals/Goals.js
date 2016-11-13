import React from 'react';
import { Link } from 'react-router';
import { AutoComplete, SelectField, MenuItem } from 'material-ui'

export default ({ goals, categories, curCategory, handleChange }) =>
  <div id="goals-search">
    <div className="row">
      <div className="col-xs-12 col-sm-8 col-md-9">
        <AutoComplete
          dataSource={ goals.map(goal => goal.name) }
          floatingLabelText="Search"
          fullWidth={ true }
          onUpdateInput={ text => handleChange('search', text) } />
      </div>
      <div className="col-xs-offset-1 col-xs-10 col-sm-offset-0 col-sm-4 col-md-3">
        <SelectField
          floatingLabelText="Category"
          value={ curCategory }
          fullWidth={ true }
          onChange={ (evt, key, value) => handleChange('category', value) } >
          <MenuItem value={0} primaryText="All" />
          {
            categories && categories.map(category =>
              <MenuItem
                key={category.id}
                value={category.id}
                primaryText={category.category} />
            )
          }
        </SelectField>
      </div>
    </div>
    <div className="goal-list">
    {
      goals && goals.map(goal =>
        <div key={goal.id} className="goal-list-item">
          {
            goal.location ?
              <p className="goal-list-item-loc">{goal.location}</p>
              : null
          }
          <div className="goal-list-item-banner">
            <h3>{goal.name}</h3>
            <div className="goal-list-item-actions">
            </div>
          </div>
          <Link to={`/goals/${goal.id}`}>
            <div className="goal-list-pic-wrapper">
              <img
                className="goal-list-pic"
                alt={goal.name}
                src={goal.banner_pic_url} />
            </div>
          </Link>
        </div>
      )
    }
    </div>
  </div>
