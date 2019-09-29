import fetch from "unfetch"

export const HttpMethod = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch",
}

export class FetchError extends Error {
    constructor({ method, url, status, body, headers }) {
        super(`${method.toUpperCase()} ${url} failed: ${status}`)

        this.status = status
        this.url = url
        this.method = method
        this.headers = headers

        try {
            this.body = JSON.parse(body)
        } catch (e) {
            this.body = body
        }
    }
}

export class Fetch {
    static defaultHeaders = {
        "content-type": "application/json"
    }

    static async request(url, {
        method = HttpMethod.GET,
        body,
        headers: incomingHeaders = {}
    } = {}) {
        let headers = { ...this.defaultHeaders, ...incomingHeaders } 
        let response = await fetch(url, {
            method,
            body: headers["content-type"] === "application/json" ? JSON.stringify(body) : body,
            headers
        })

        if (response.ok) {
            if (response.headers.get("content-type") === "application/json") {
                return await response.json()
            } else {
                return await response.text()
            }
        } else {
            let { status, headers } = response
            let body = await response.text()

            throw new FetchError({ body, status, url, method, headers })
        }
    }

    static get(url, headers) {
        return this.request(url, {
            headers
        })
    }

    static post(url, body, headers) {
        return this.request(url, {
            method: HttpMethod.POST,
            headers,
            body
        })
    }

    static put(url, body, headers) {
        return this.request(url, {
            method: HttpMethod.PUT,
            headers,
            body
        })
    }

    static delete(url, body, headers) {
        return this.request(url, {
            method: HttpMethod.DELETE,
            headers,
            body
        })
    }

    static patch(url, body, headers) {
        return this.request(url, {
            method: HttpMethod.PATCH,
            headers,
            body
        })
    }

    static addDefaultHeader(headerName, value) {
        this.defaultHeaders = {
            ...this.defaultHeaders,
            [headerName]: value
        }
    }
    
    static removeDefaultHeader(headerName) {
        delete this.defaultHeaders[headerName]
    }

    static authorize(value, headerName = "Authorization") {
        this.addDefaultHeader(headerName, value)
    }
}