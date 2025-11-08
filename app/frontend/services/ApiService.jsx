const API_BASE_URL = '/api/v1';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.errors ? JSON.stringify(errorData.errors) : `HTTP error! status: ${response.status}`;
        throw new Error(message);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

const ApiService = {
    get: (resource) => {
        return fetch(`${API_BASE_URL}/${resource}`).then(handleResponse);
    },

    post: (resource, data) => {
        return fetch(`${API_BASE_URL}/${resource}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    },

    update: (resource, id, data) => {
        return fetch(`${API_BASE_URL}/${resource}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    },

    delete: (resource, id) => {
        return fetch(`${API_BASE_URL}/${resource}/${id}`, {
            method: 'DELETE',
        }).then(handleResponse);
    },
};

export default ApiService;
