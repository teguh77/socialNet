import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import {connect} from 'react-redux';
import {getPost} from '../../actions/post';

const Post = ({getPost, post: {post}, match}) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);

  //props post harus disertakan juga soalnya nilai post pada postItem tergantung dari nilai post yang ada disini
  return <PostItem post={post} showAction={false} />;
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, {getPost})(Post);
