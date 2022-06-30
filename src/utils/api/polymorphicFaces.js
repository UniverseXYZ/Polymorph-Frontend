import axios from 'axios';

/**
 * @param {string} id NFT id
 * @returns
 */
export const getPolymorphicFacesMeta = async (id) => {
  const request = await axios(`${process.env.REACT_APP_FACES_IMAGES_URL}${id}`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (request.status !== 200) {
    console.error(`Error while trying to GET meta for Polymorph with ID: ${id}`);
  }
  return request;
};