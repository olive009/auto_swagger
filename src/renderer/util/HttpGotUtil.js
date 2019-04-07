import got from 'got';

const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';
const METHOD_PATCH = 'PATCH';
const METHOD_DELETE = 'DELETE';
const METHOD_HEAD = 'HEAD';
const METHOD_OPTIONS = 'OPTIONS';

function sendHttpRequest(currentRequest) {
    const options = {
        json: true,
        body: currentRequest.data
    };
    if (currentRequest.method === METHOD_GET) {
        let url = updateUrlParam(currentRequest);
        console.log('sending request to: ' + url);
        return got(url);
    } else if (currentRequest.method === METHOD_POST) {
        console.log('sending request to: ' + currentRequest.scheme + currentRequest.url);
        return got.post(currentRequest.scheme + currentRequest.url, options);
    } else if (currentRequest.method === METHOD_PUT) {
        console.log('sending request to: ' + currentRequest.scheme + currentRequest.url);
        return got.put(currentRequest.scheme + currentRequest.url, options);
    } else if (currentRequest.method === METHOD_PATCH) {
        // TODO:
    } else if (currentRequest.method === METHOD_DELETE) {
        let url = updateUrlParam(currentRequest);
        console.log('sending request to: ' + url);
        return got.delete(url);
    } else if (currentRequest.method === METHOD_HEAD) {
        // TODO:
    } else if (currentRequest.method === METHOD_OPTIONS) {
        // TODO:
    }
}

function updateUrlParam(currentRequest) {
    let url = updateUrlScheme(currentRequest);
    if (currentRequest.data) {
        let keys = Object.keys(currentRequest.data);
        keys.forEach(key => {
            let paramString = '{' + key + '}';
            if (url.includes(paramString)) {
                url = url.replace(paramString, currentRequest.data[key]);
            } else {
                // add ? if not exist
                if (!url.includes('?')) {
                    url += '?';
                }
                url += key + '=' + currentRequest.data[key];
            }
        });
    }
    return url;
}

function updateUrlScheme(currentRequest) {
    if (currentRequest.url.startsWith('http')) {
        return currentRequest.url;
    } else {
        return currentRequest.scheme + currentRequest.url;
    }
}

export { sendHttpRequest };
