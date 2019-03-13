import http from '../http.js'

export const getBanners = () => http('/api/v1/banners');