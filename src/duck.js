import {range} from 'd3-array';
import phyllotaxis from './utils/phyllotaxis';

export const ADD_POINT = 'graph-editor/ADD_POINT';
export const REMOVE_POINT = 'graph-editor/REMOVE_POINT';
export const TOGGLE_LINK = 'graph-editor/TOGGLE_LINK';

const initialState = {
  points: range(1, 20).map(phyllotaxis(10)),
  links: [],
  nextId: 20
};

export const addPoint = (x, y) => ({
  type: ADD_POINT,
  x,
  y
});

export const removePoint = (id) => ({
  type: REMOVE_POINT,
  id
});

export const toggleLink = (id1, id2) => ({
  type: TOGGLE_LINK,
  id1,
  id2
});

export default (state = initialState, action) => {
  const {points, links, nextId} = state;

  if (!action) {
    debugger;
    return state;
  }

  switch (action.type) {
    case ADD_POINT:
      const {x, y} = action;
      return {
        links,
        points: [
          ...points,
          {x, y, id: nextId}
        ],
        nextId: nextId + 1
      };

    case REMOVE_POINT:
      return {
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
        points,
        nextId,
        links: newLinks
      };

    default:
      return state;
  }
};
