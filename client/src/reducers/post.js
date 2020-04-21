import {
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  POST_DELETED,
  ADD_POST,
  GET_SINGLEPOST,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: {},
};

export default function (state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case GET_POST:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_SINGLEPOST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case POST_DELETED:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.id ? {...post, likes: payload.likes} : post
        ),
        loading: false,
      };
    default:
      return state;
  }
}
