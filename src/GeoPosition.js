export default class GeoPosition {
    static defaultOptions = {
        enableHighAccuracy: false,
        timeout: 1000 * 60 * 3,
        maximumAge: 0
    }

    static get(options) { 
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { ...this.defaultOptions, ...options })
        })
    }

    static watch(successFunc, errorFunc = () => { }, options = {}) { 
        return navigator.geolocation.watchPosition(successFunc, errorFunc, { ...this.defaultOptions, ...options })
    }

    static unwatch(id) {
        navigator.geolocation.clearWatch(id)
    }
}