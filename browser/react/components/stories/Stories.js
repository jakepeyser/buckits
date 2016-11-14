import React from 'react';
import { fullName, getStars } from '../../utils'

export default ({ stories }) => {
  return (
    <div id="stories">
      <h2>{stories.length ? `${stories.length} Stories from the Frontlines` : 'No stories yet'}</h2>
      {
        stories.map(story =>
          <div key={story.id} className="review row">
            <div className="review-metadata col-xs-3">
              <div className="review-author">
                <div className="profile-icon">
                  <img
                    src={ story.user.profile_pic_url }
                    alt={ fullName(story.user) } />
                </div>
                <p>{ fullName(story.user) }</p>
              </div>
              { getStars(story.rating) }
            </div>
            <div className="review-comment col-xs-9">
              <p>{story.comment}</p>
            </div>
          </div>
        )
      }
    </div>
  )
}
