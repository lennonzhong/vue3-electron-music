import headers from "../music/headers"
import { useAppConfig } from "../stores/appConfig"
const defaultHeaders = {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.27"
}

class Request {
    request(url, options) {
        return new Promise((resolve) => {
            fetch(url, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...headers[options.platform],
                    ...options.headers
                },
                credentials: 'include'
            }).then(response => {
                if (response.url.includes('callback')) {
                    return response.text();
                } else {
                    return response.json();
                }
            }).then(res => {
                resolve(res);
            })
        })
    }
    get(url, options) {
        return this.request(url, {
            method: 'get',
            platform: useAppConfig().platform,
            ...options
        })
    }
    post(url, data) {
        return this.request(url, {
            method: 'post',
            platform: useAppConfig().platform,
            body: JSON.stringify(data)
        })
    }
}

export default new Request()