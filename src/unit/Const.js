import fetch from 'isomorphic-fetch';

export function executeFetch(...args) {
    return new Promise(async (resolve, reject) => {
        let response = {}, result = "";
        args[1].credentials='include';
        // console.log(args[1].credentials);
        try {
            response = await fetch(...args);
            result = await response.json();
        } catch(e) {
            reject(e);
        }
        response.status === 200 ? resolve(result) : reject(result);
    });
}

export const hostname = 'http://localhost.8080';

