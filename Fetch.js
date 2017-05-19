import fetch from "isomorphic-fetch"

export const HttpMethod = {
    Get: "get",
    Post: "post",
    Put: "put",
    Delete: "delete"
}

export class FetchError extends Error {
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

export class Fetch {
   static _authorization = null
   static _authorizationHeader = null

    static async makeRequest(url, method, options = { headers: {} }, body) { 
        let response
        let mergedOptions = {
            method,
            body: options.headers["content-type"] && options.headers["content-type"] !== "application/json" ? body : JSON.stringify(body),
            headers: this.makeHeaders(options.headers || {})
        }

        if (method === HttpMethod.Get) {
            delete options.body
        }

        response = await fetch(url, mergedOptions) 

        if (response.status < 400) {
            switch (response.headers.get("content-type")) {
                case "application/json":
                    return await response.json()
                default:
                    return await response.text()
            }
        } else {
            let body = await response.text() 
            
            throw new FetchError(response, body)
        }
    }

    static makeHeaders(headers) {
        let mergedHeaders = new Headers()

        mergedHeaders.set("accept", "application/json")
        mergedHeaders.set("content-Type", "application/json")
        
        if (Fetch._authorization) {
            mergedHeaders.set("authorization", Fetch._authorization)
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