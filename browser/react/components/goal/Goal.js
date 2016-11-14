import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Gmaps, Marker } from 'react-gmaps';

export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curSnippet: props.goal.snippets ? props.goal.snippets[0] : null
    };
  }

  // Update selected snippet
  snippetChange(snippetId) {
    this.setState({
      curSnippet: this.props.goal.snippets.find(snip => snip.id === snippetId)
    });
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }

  render() {
    const { goal, category, loggedIn, like, unlike, add, done } = this.props;
    if (!goal || !category) return null;

    // Make sure current snippet is not from last selected goal
    const curSnip = this.state.curSnippet && goal.snippets.findIndex(snip => snip.id === this.state.curSnippet.id) !== -1 ?
      this.state.curSnippet : goal.snippets[0];
      console.log(goal.liked)
    return (
      <div id="goal">
        <Helmet title={ goal.name } />
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
        <div className="row">
          <div className="col-xs-12 col-md-8">
            <div className="goal-main-info">
            {
              goal.location ?
                <p className="goal-loc">{goal.location}</p>
                : null
            }
            {
              goal.price_range ?
                <p className="goal-price">
                  <span>{'$$$$'.substring(0, goal.price_range)}</span>
                  <span style={{color: '#efeff4'}}>{'$$$$'.substring(0, 4 - goal.price_range)}</span>
                </p>
                : null
            }
            {
              // Average Rating Here
            }
            </div>
          </div>
          {
            loggedIn ?
              <div className="goal-list-item-actions action-padders col-xs-12 col-md-4">
                <div className="add add-black"
                  onClick={() => add(goal.id)}/>
                <div className="done done-black"
                  onClick={() => done(goal.id)}/>
                <div className={`like like-black ${goal.liked ? 'liked' : ''}`}
                  onClick={() => goal.liked ? unlike(goal.id) : like(goal.id)}/>
              </div> : null
          }
        </div>
        <div className="row">
          <div className="snippets col-xs-12 col-md-8">
            <div className="snippet-titles col-xs-3">
            {
              goal.snippets && goal.snippets.map(snip =>
                <h3 key={snip.id}
                  className={ snip.id === curSnip.id ? 'selected-snippet' : '' }
                  onClick={ () => this.snippetChange(snip.id) }>
                  {snip.title}
                </h3>
              )
            }
            </div>
            <div className="snippet-text col-xs-9">
              <p>{curSnip.description}</p>
            </div>
          </div>
          <div className="col-xs-12 col-md-4">
          {
            goal.location ?
            <div className="goal-map">
              <Gmaps
                width={'100%'}
                height={'100%'}
                lat={goal.lat}
                lng={goal.lon}
                zoom={12}
                loadingMessage={`Loading ${goal.location} map view`}
                params={{v: '3.exp', key: 'AIzaSyA2MTggvEGbxImhvkXixjC3guHeGnHCwvI'}}
                onMapCreated={this.onMapCreated}>
                <Marker
                  lat={goal.lat}
                  lng={goal.lon} />
              </Gmaps>
            </div> : null
          }
          </div>
        </div>
      </div>
    )
  }
}

// export default ({ goal, category, loggedIn, like, unlike, add, done }) => {
//   console.log("goal snips:", goal.snippets)
//   if (!goal || !category) return null;
//   return (
//     <div id="goal">
//       <Helmet title={ goal.name } />
//       <div className="goal-banner">
//         <div className="goal-header">
//           <h3>{`We want to ${category.action}...`}</h3>
//           <h1>{goal.name}</h1>
//         </div>
//         <img
//           className="goal-banner-img"
//           alt={goal.name}
//           src={goal.banner_pic_url} />
//       </div>
//       <div className="row">
//         <div className="col-xs-12 col-md-8 col-lg-9">
//           <div className="row">
//             <div className="goal-main-info">
//             {
//               goal.location ?
//                 <p className="goal-loc">{goal.location}</p>
//                 : null
//             }
//             {
//               goal.price_range ?
//                 <p className="goal-price">
//                   <span>{'$$$$'.substring(0, goal.price_range)}</span>
//                   <span style={{color: '#efeff4'}}>{'$$$$'.substring(0, 4 - goal.price_range)}</span>
//                 </p>
//                 : null
//             }
//             {/* Average Rating Here */}
//             </div>
//           </div>
//           <div className="row">
//             <div className="snippet-titles col-xs-3">
//             {
//               goal.snippets && goal.snippets.map(snip =>
//                 <h3 key={snip.id}
//                   className={ snip.id === currentSnippet ? 'selected-snippet' : '' }
//                   onClick={ () => snippetChange(snip.id) }>
//                   {snip.title}
//                 </h3>
//               )
//             }
//             </div>
//             <div className="snippet-text col-xs-9">
//               <p>{curSnip.description}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
