import { useAuthStore } from '@/stores';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method: string) {
    return async (url: string, body: string) => {
        // const requestOptions = {
        //     method,
        //     headers: authHeader(url)
        // };
        // if (body) {
        //     requestOptions.headers['Content-Type'] = 'application/json';
        //     requestOptions.body = JSON.stringify(body);
        // }
        // const requestOptions = {
        //     method,
        //     headers: {
        //       "Content-type": "application/json",
        //     },
        //     body
        // };

        const options: Record<string, any> = {};
        options.method = method;
        options.headers = authHeader(url);
        if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = body;
        }
        const response = await fetch(url, options);
        return handleResponse(response);
    }
}

// helper functions

function authHeader(url: string) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    const isApiUrl = url.startsWith(import.meta.env.API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return { Authorization: ''};
    }
}

async function handleResponse(response: any) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    // check for error response
    if (!response.ok) {
        const { user, logout } = useAuthStore();
        if ([401, 403].includes(response.status) && user) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            logout();
        }

        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
    }

    return data;
}
