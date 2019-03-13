import http from '../http.js'

export const getCourses = (params) => http('/api/v1/courses/search', params);

export const getHomeCourses = () => http('/api/v1/courses');

export const getThemes = () => http('/api/v1/themes');

export const getSubjects = () => http('/api/v1/subjects');

export const showCourse = (id) => http('/api/v1/courses/' + id);

export const getVideoToken = (vid) => http('/api/v1/lessons/video_token?vid='+vid);
