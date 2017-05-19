import fetch from "isomorphic-fetch"

export const HttpMethod = {
    Get: "get",
    Post: "post",
    Put: "put",
    Delete: "delete"
}

export class ExternalRequestError extends Error {
    constructor(response, body) {
        super()

        this.status = response.status
        this.headers = response.headers

        try {
            this.body = JSON.parse(body)
        } catch (e) {
            this.body = body
        }
    }
}

export default class Fetch {
    static _authorization = null
    static _authorizationHeader = null

    static makeRequest(url, method, options = { headers: {} }, body) {
        let mergedOptions = {
            method,
            body: options.headers && options.headers["Content-Type"] !== "application/json" ? body : JSON.stringify(body),
            headers: this.makeHeaders(options.headers || {})
        }

        if (method === HttpMethod.Get) {
            delete options.body
        }

        return fetch(url, mergedOptions)
            .then(response => {
                if (response.status < 400) {
                    if (response.headers.get("content-type").includes("json")) {
                        return response.json()
                    } else {
                        return response.text()
                    }
                } else {
                    return response.text().then(body => {
                        throw new ExternalRequestError(response, body)
                    })
                }
            })
    }

    static makeHeaders(headers) {
        let mergedHeaders = new Headers()

        mergedHeaders.set("Accept", "application/json")
        mergedHeaders.set("Content-Type", "application/json")
        
        if (Fetch._authorization) {
            mergedHeaders.set("Authorization", Fetch._authorization)
        }

        for (let key in headers) {
            mergedHeaders.append(key, headers[key])
        }

        return mergedHeaders
    }

    static get(url, options) {
        return this.makeRequest(url, HttpMethod.Get, options)
    }

    static post(url, body, options) {
        return this.makeRequest(url, HttpMethod.Post, options, body)
    }

    static delete(url, body, options) {
        return this.makeRequest(url, HttpMethod.Delete, options, body)
    }

    static put(url, body, options) {
        return this.makeRequest(url, HttpMethod.Put, options, body)
    }

    static authorize(token, headerName = "Authorization") {
        this._authorization = token
        this._authorizationHeader = headerName
    }
}