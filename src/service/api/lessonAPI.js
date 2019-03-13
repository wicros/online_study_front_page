import http from '../http.js'

export const updateLessonStatus = (params) => http('/api/v1/lesson_statuses/update', 'post', params);

export const getTest = (id) => http('/api/v1/tests/' + id);

export const getLessons = (course_id) => http('/api/v1/lessons?course_id=' + course_id);
