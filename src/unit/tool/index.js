export function objToQueryString(object) {
    if (!object) {
        return '';
    }
    return '?' +
        Object.keys(object).map((key) =>
            encodeURIComponent(key) + '=' + encodeURIComponent(object[key])
        ).join('&');
}