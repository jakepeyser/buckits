import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Gmaps, Marker } from 'react-gmaps';
import Badge from 'material-ui/Badge';
import Stories from '../stories/Stories'
import { getAvgRating, getStars } from '../../utils'

export default class Goal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { curSnippet: props.goal.snippets[0] };
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
            <div className="goal-rating">
              { getStars(getAvgRating(goal.stories)) }
              <a href={`/goals/${goal.id}#stories`}>{`${goal.stories.length} reviews`}</a>
            </div>
            </div>
          </div>
          {
            loggedIn ?
              <div className="goal-list-item-actions action-padders col-xs-12 col-md-4">
                <div className="add add-black"
                  onClick={() => add(goal.id)}/>
                <div className="done done-black"
                  onClick={() => done(goal.id)}/>
                <Badge
                  badgeContent={goal.likes}
                  primary={true}
                  style={{padding: '10px 10px 10px 0px'}}
                  badgeStyle={{ width: '22px', height: '22px', backgroundColor: 'red', border: '1px solid white'}}>
                  <div className={`like like-black ${goal.liked ? 'liked' : ''}`}
                    onClick={() => goal.liked ? unlike(goal.id) : like(goal.id)}/>
                </Badge>
              </div> : null
          }
        </div>
        <div className="row">
          <div className="snippets col-xs-12 col-md-8">
            <div className="snippet-titles col-xs-3">
            {
              goal.snippets && goal.snippets.map(snip =>
                <h3 key={snip.id}
                  className={ snip.id === this.state.curSnippet.id ? 'selected-snippet' : '' }
                  onClick={ () => this.snippetChange(snip.id) }>
                  {snip.title}
                </h3>
              )
            }
            </div>
            <div className="snippet-text col-xs-9">
              {
                this.state.curSnippet.description.split('\n').map((item, i) =>
                  <p key={i}>{ item.replace(/\[\d+\]/g, '') }</p>
                )
              }
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
            <div className="goal-pics">
            {
              goal.pictures && goal.pictures.slice(0, 6).map(pic =>
                <div key={pic.id} className="goal-pic">
                  <img
                    className="goal-pic-img"
                    src={pic.picture_url} />
                </div>
              )
            }
            </div>
          </div>
          <div className="col-xs-12 col-md-8">
            <Stories stories={goal.stories}/>
          </div>
        </div>
      </div>
    )
  }
}
