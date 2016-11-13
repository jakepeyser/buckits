import React from 'react';
import { connect } from 'react-redux';
import Goals from './Goals';
const initialState = {
  search: '', category: 0
};

const GoalSearchDecorator = GoalsComponent => {
  return class StatefulGoals extends React.Component {
    constructor(props) {
      super(props);
      this.state = initialState;
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(field, value) {
      let newState = {};
      newState[field] =  value;
      this.setState(newState);
    }

    render() {
      // Filter goals by search string and selected category
      const goals = this.props.goals.filter((goal) => {
        return goal.name.toLowerCase()
          .indexOf(this.state.search.toLowerCase()) !== -1 &&
          (!this.state.category || this.state.category === goal.category_id);
      })
      console.log(goals)
      return (
        <GoalsComponent
        categories={this.props.categories}
        curCategory={this.state.category}
        goals={goals}
        handleChange={this.handleChange}/>
      )
    }
  }
}

const mapStateToProps = ({ goals, categories }) =>
  ({ goals, categories });

export default connect(mapStateToProps)(GoalSearchDecorator(Goals));
