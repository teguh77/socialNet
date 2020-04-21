import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';

const ProfileExperience = ({
  experience: {company, title, location, current, to, from, description}
}) => (
  <div>
    <h3 className='text-dark'>{company}</h3>
    <p>
      <Moment format='YYYY/MM/DD'>{moment.utc(from)}</Moment> -{' '}
      {!to ? ' Now' : <Moment format='YYYY/MM/DD'>{moment.utc(to)}</Moment>}
    </p>
    <p>
      <strong>Position: </strong> {title}
    </p>
    <p>
      {location && (
        <Fragment>
          <strong>Location: </strong>
          <span>{location}</span>
        </Fragment>
      )}
    </p>
    <p>
      {description && (
        <Fragment>
          <strong>Description: </strong>
          <span>{description}</span>
        </Fragment>
      )}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
