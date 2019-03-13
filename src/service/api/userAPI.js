import http from '../http.js'

export const getUserProuducts = () => http('/api/v1/users/products');

export const getUserCourseStatus = (id) => http('/api/v1/users/course_status?course_id=' + id);

export const getUserInfo = () => http('/api/v1/users/profile');

export const updateUserInfo = (params) => http('/api/v1/users', 'post', params);

export const updatePassword = (params) => http('/api/v1/users/update_password', 'post', params);

export const updatePhone = (params) => http('/api/v1/users/update_phone', 'post', params);


