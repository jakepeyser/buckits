import { connect } from 'react-redux';
import Goal from './Goal';
import { likeGoal, unlikeGoal } from '../../redux/goals'

const mapStateToProps = ({ currentGoal, categories, user }) => ({
  goal: currentGoal,
  category: categories.find(category => category.id === currentGoal.category_id),
  loggedIn: Object.keys(user).length
});

const mapDispatchToProps = dispatch => ({
  like: goalId => dispatch(likeGoal(goalId)),
  unlike: goalId => dispatch(unlikeGoal(goalId)),
  add: goalId => console.log('Stub for add'),
  done: goalId => console.log('Stub for done')
});

export default connect(mapStateToProps, mapDispatchToProps)(Goal);
