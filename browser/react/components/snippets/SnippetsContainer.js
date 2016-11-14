import React from 'react';
import { connect } from 'react-redux';
import Snippets from './Snippets'

const SnippetsDecorator = Snippets => {
  return class StatefulSnippets extends React.Component {
    constructor(props) {
      super(props);
      this.state = { snippetId: props.snippets[0].id };
      this.snippetChange = this.snippetChange.bind(this);
    }

    // Update selected snippet
    snippetChange(snippetId) {
      this.setState({ snippetId });
    }

    render() {
      return (
        <Snippets
          snippetChange={this.snippetChange}
          snippets={this.props.snippets}
          currentSnippet={this.state.snippetId}
        />
      )
    }
  }
}

const mapStateToProps = ({ currentGoal }) => ({
  snippets: currentGoal.snippets
});

export default connect(mapStateToProps)(SnippetsDecorator(Snippets));
