export default class GeoPosition {
    static get({
        enableHighAccuracy = false,
        timeout = 1000 * 60 * 3,
        maximumAge = 0

    }) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy,
                    timeout,
                    maximumAge
                }
            )
        })
    }

    static watch(successFunc, errorFunc = () => { }, {
        enableHighAccuracy = false,
        timeout = 1000 * 60 * 3,
        maximumAge = 0
    }) {
        return navigator.geolocation.watchPosition(
            successFunc,
            errorFunc,
            {
                enableHighAccuracy,
                timeout,
                maximumAge
            }
        )
    }

    static unwatch(id) {
        navigator.geolocation.clearWatch(id)
    }
}