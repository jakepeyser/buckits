import React from 'react';
import { connect } from 'react-redux';
import Goals from './Goals';
import { likeGoal, unlikeGoal } from '../../redux/goals'
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

      return (
        <GoalsComponent
        categories={this.props.categories}
        curCategory={this.state.category}
        goals={goals}
        loggedIn={Object.keys(this.props.user).length}
        like={this.props.like}
        unlike={this.props.unlike}
        add={this.props.add}
        done={this.props.done}
        handleChange={this.handleChange}/>
      )
    }
  }
}

const mapStateToProps = ({ goals, categories, user }) =>
  ({ goals, categories, user });

const mapDispatchToProps = dispatch => ({
  like: (goalId) => dispatch(likeGoal(goalId)),
  unlike: (goalId) => dispatch(unlikeGoal(goalId)),
  add: (goalId) => console.log('Stub for add'),
  done: (goalId) => console.log('Stub for done')
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalSearchDecorator(Goals));
