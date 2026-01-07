import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me')
};

// Discovery API
export const discoveryAPI = {
    getAll: (params) => api.get('/discovery', { params }),
    getTrending: (limit = 4) => api.get('/discovery/trending', { params: { limit } }),
    getById: (id) => api.get(`/discovery/${id}`),
    getTags: () => api.get('/discovery/tags'),
    create: (data) => api.post('/discovery', data),
    update: (id, data) => api.put(`/discovery/${id}`, data),
    delete: (id) => api.delete(`/discovery/${id}`)
};

// Listings API
export const listingsAPI = {
    getAll: (params) => api.get('/listings', { params }),
    getFeatured: (limit = 6) => api.get('/listings/featured', { params: { limit } }),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => api.post('/listings', data),
    update: (id, data) => api.put(`/listings/${id}`, data),
    delete: (id) => api.delete(`/listings/${id}`)
};

// Favorites API
export const favoritesAPI = {
    getAll: () => api.get('/favorites'),
    add: (type, id) => api.post(`/favorites/${type}/${id}`),
    remove: (type, id) => api.delete(`/favorites/${type}/${id}`),
    check: (type, id) => api.get(`/favorites/check/${type}/${id}`)
};

// Upload API
export const uploadAPI = {
    single: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    multiple: (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
export default api;
