export function objToQueryString(object) {
    if (!object) {
        return '';
    }
    return '?' +
        Object.keys(object).map((key) =>
            encodeURIComponent(key) + '=' + encodeURIComponent(object[key])
        ).join('&');
}
export function objToFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}
