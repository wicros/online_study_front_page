import http from '../http.js'

export const getProducts = (params) => http('/api/v1/products/search', params);

export const getHomeProducts = () => http('/api/v1/products');

export const showProduct = (id) => http('/api/v1/products/' + id);