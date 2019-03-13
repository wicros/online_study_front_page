import http from '../http.js'

export const sendSms = (params) => http('/api/v1/users/send_sms', 'post', params);

export const signUp = (params, config) => http('/api/v1/users/sign_up', 'post', params, config);

export const signIn = (params, config) => http('/api/v1/users/sign_in', 'post', params, config);

export const resetPassword = (params) => http('/api/v1/users/reset_password', 'post', params);