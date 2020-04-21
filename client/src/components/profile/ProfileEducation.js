import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';

const ProfileEducation = ({
  education: {school, degree, fieldofstudy, current, to, from, description}
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      <Moment format='YYYY/MM/DD'>{moment.utc(from)}</Moment> -{' '}
      {!to ? ' Now' : <Moment format='YYYY/MM/DD'>{moment.utc(to)}</Moment>}
    </p>
    <p>
      <strong>Degree: </strong> {degree}
    </p>
    <p>
      {fieldofstudy && (
        <Fragment>
          <strong>Field Of Study: </strong>
          <span>{fieldofstudy}</span>
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

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEducation;
