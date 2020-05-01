import PRODUCTS from '../../data/demo-data';

const initialState = {
  availableProducts: PRODUCTS,
  userPoducts: PRODUCTS.filter(product => product.ownerId === 'u1')
};

export default (state= initialState, action) => {
  return state;
};
