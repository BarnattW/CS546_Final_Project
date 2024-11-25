import { dbConnection } from './mongoConnection.js';
// added some comments here
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const customers = getCollectionFn('customers');
export const sellers = getCollectionFn('sellers');
