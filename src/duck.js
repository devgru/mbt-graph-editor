import {range} from 'd3-array';
import phyllotaxis from './utils/phyllotaxis';

export const ADD_POINT = 'graph-editor/ADD_POINT';
export const REMOVE_POINT = 'graph-editor/REMOVE_POINT';
export const TOGGLE_LINK = 'graph-editor/TOGGLE_LINK';
export const APPLY_STATE = 'graph-editor/APPLY_STATE';
export const CATCH_NETWORK_FAILURE = 'graph-editor/CATCH_NETWORK_FAILURE';

const HOST = 'http://localhost:9182';

const initialState = {
  points: range(1, 20).map(phyllotaxis(10)),
  links: [],
  nextId: 20,
  loading: true,
  failed: false
};

const dispatchToServer = (fn) => (...args) => async (dispatch) => {
  const action = fn(...args);
  dispatch(action);
  if (window) {
    try {
      await fetch(`${HOST}/dispatch`, {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action)
      });
    } catch (error) {
      dispatch({
        type: CATCH_NETWORK_FAILURE,
        error
      });
    }
  }
};

export const addPoint = dispatchToServer((x, y) => ({
  type: ADD_POINT,
  x,
  y
}));

export const removePoint = dispatchToServer((id) => ({
  type: REMOVE_POINT,
  id
}));

export const toggleLink = dispatchToServer((id1, id2) => ({
  type: TOGGLE_LINK,
  id1,
  id2
}));

export const loadStore = () => async (dispatch) => {
  try {
    const response = await fetch(`${HOST}/getState`);
    const state = await response.json();
    dispatch({
      type: APPLY_STATE,
      state
    });
  } catch (error) {
    dispatch({
      type: CATCH_NETWORK_FAILURE,
      error
    });
  }
};

export default (state = initialState, action) => {
  const {points, links, nextId} = state;

  switch (action.type) {
    case APPLY_STATE:
      return {
        ...action.state,
        loading: false
      };

    case ADD_POINT:
      const {x, y} = action;
      return {
        ...state,
        points: [
          ...points,
          {x, y, id: nextId}
        ],
        nextId: nextId + 1
      };

    case REMOVE_POINT:
      return {
        ...state,
        links: links
          .filter(({id1, id2}) => id1 !== action.id && id2 !== action.id),
        points: points
          .filter(({id}) => id !== action.id)
      };

    case TOGGLE_LINK:
      let {id1, id2} = action;
      if (id1 > id2) {
        [id1, id2] = [id2, id1];
      }

      const linksWithoutThisLink = links
        .filter(link => link.id1 !== id1 || link.id2 !== id2);

      const newLinks = linksWithoutThisLink.length === links.length
        ? [...links, {id1, id2}]
        : linksWithoutThisLink;

      return {
        ...state,
        links: newLinks
      };

    case CATCH_NETWORK_FAILURE:
      console.error(action.error);
      return {
        ...state,
        failed: true
      };

    default:
      return state;
  }
};
