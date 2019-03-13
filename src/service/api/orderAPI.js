import http from '../http.js'

export const getOrders = () => http('/api/v1/orders');

export const createOrder = (params) => http('/api/v1/orders', 'post', params);

export const cancelOrders = (params) => http('/api/v1/orders/destroy', 'post', params);

export const goToAlipay = (params) => http('/api/v1/global_alipay/create_forex_trade/generate_url', 'post', params);

