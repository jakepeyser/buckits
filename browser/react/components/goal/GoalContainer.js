import { connect } from 'react-redux';
import Goal from './Goal';
import { likeGoal, unlikeGoal } from '../../redux/goals'

const mapStateToProps = ({ goals, currentGoal, categories, user }) => {
  let goal = goals.find(goal => goal.id === currentGoal);
  return {
    goal,
    category: goal && categories.find(category => category.id === goal.category_id),
    loggedIn: Object.keys(user).length
  }
};

const mapDispatchToProps = dispatch => ({
  like: goalId => dispatch(likeGoal(goalId)),
  unlike: goalId => dispatch(unlikeGoal(goalId)),
  add: goalId => console.log('Stub for add'),
  done: goalId => console.log('Stub for done')
});

export default connect(mapStateToProps, mapDispatchToProps)(Goal);
