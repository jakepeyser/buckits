import React from 'react'
import FontIcon from 'material-ui/FontIcon'

// Check whether script is being run in browser or Node
export const isBrowser = () => {
  try {
    return window;
  } catch (e) {
    return false;
  }
}

// Return the average rating of the passed in stories
export const getAvgRating = (stories) => {
  if (!stories) return 0;
  const totalStars = stories.reduce((sum, story) => sum + story.rating, 0);
  return Math.ceil(totalStars / stories.length);
}

// Return formatted full name of user
export const fullName = user => `${user.first_name} ${user.last_name}`;

// Return JSX element containing stars related to the input rating
export const getStars = (rating) => {
  const starArray = new Array(5).fill().map((item, i) => {
    return rating > i ? 'star' : 'star_border';
  })
  return (
    <div className="stars">
    {
      starArray.map((val, i) =>
        <FontIcon key={i} className={'material-icons'}>
          { val }
        </FontIcon>
      )
    }
    </div>
  )
}
