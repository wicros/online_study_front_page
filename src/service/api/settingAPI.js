import http from '../http.js'

export const getMinistries = () => http('/api/v1/ministries');