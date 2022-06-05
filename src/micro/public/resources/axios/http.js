(function (global) {
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
    //axios.defaults.headers['Token'] = 'eyJhbGciOiJIUzI1NiJ9.eyJOTyI6IjExNzQ3Iiwic3ViIjoi5byg5oGS5bOwIiwiaXNGcm9tTmV3TG9naW4iOiJ0cnVlIiwiYXV0aGVudGljYXRpb25EYXRlIjoiMjAyMC0wMy0xN1QxNjoyMzo1Ni43MDArMDg6MDBbQXNpYS9TaGFuZ2hhaV0iLCJzdWNjZXNzZnVsQXV0aGVudGljYXRpb25IYW5kbGVycyI6IlF1ZXJ5RGF0YWJhc2VBdXRoZW50aWNhdGlvbkhhbmRsZXIiLCJpc3MiOiJUb2tlbiIsIlVTRVJfSUQiOiLlvKDmgZLls7AiLCJVU0VSX05BTUUiOiLlvKDmgZLls7AiLCJFTUFJTCI6InpoZkBjZXN0Yy5jbiIsIk5BTUUiOiLlvKDmgZLls7AiLCJjcmVkZW50aWFsVHlwZSI6IlVzZXJuYW1lUGFzc3dvcmRDcmVkZW50aWFsIiwiT1BFUkFUT1JfSUQiOiI0NDY3IiwiRktfREVQVCI6IjEwNTAxIiwiYXV0aGVudGljYXRpb25NZXRob2QiOiJRdWVyeURhdGFiYXNlQXV0aGVudGljYXRpb25IYW5kbGVyIiwibG9uZ1Rlcm1BdXRoZW50aWNhdGlvblJlcXVlc3RUb2tlblVzZWQiOiJmYWxzZSIsImZyb20iOiJnYXRld2F5IiwiZXhwIjoxNTg0NTE5ODM2LCJpYXQiOjE1ODQ0MzM0MzYsImp0aSI6ImQ0ZDc2OWNlLTE5Y2YtNDJhYy05Y2ZiLWYxODVmODJlYWI5NCJ9.oVilhyZ8sCG0eC8veubvv5eL0W5YwHXA8Cz7eY46Gc8';
    //axios.defaults.headers['Token'] = 'eyJhbGciOiJIUzI1NiJ9.eyJOTyI6IjEiLCJzdWIiOiJzeXNhZG1pbiIsImlzRnJvbU5ld0xvZ2luIjoiZmFsc2UiLCJhdXRoZW50aWNhdGlvbkRhdGUiOiIyMDIwLTAzLTI2VDEwOjI4OjE5LjIwMFpbRXRjL1VUQ10iLCJzdWNjZXNzZnVsQXV0aGVudGljYXRpb25IYW5kbGVycyI6IlF1ZXJ5RGF0YWJhc2VBdXRoZW50aWNhdGlvbkhhbmRsZXIiLCJpc3MiOiJUb2tlbiIsIlVTRVJfSUQiOiJzeXNhZG1pbiIsIlVTRVJfTkFNRSI6InN5c2FkbWluIiwiRU1BSUwiOiJzeXNhZG1pbkB0ZXN0LmNvbSIsIk5BTUUiOiJzeXNhZG1pbiIsImNyZWRlbnRpYWxUeXBlIjoiVXNlcm5hbWVQYXNzd29yZENyZWRlbnRpYWwiLCJPUEVSQVRPUl9JRCI6IjEiLCJGS19ERVBUIjoiMTAwMDAxIiwiYXV0aGVudGljYXRpb25NZXRob2QiOiJRdWVyeURhdGFiYXNlQXV0aGVudGljYXRpb25IYW5kbGVyIiwibG9uZ1Rlcm1BdXRoZW50aWNhdGlvblJlcXVlc3RUb2tlblVzZWQiOiJmYWxzZSIsImZyb20iOiJnYXRld2F5IiwiZXhwIjoxNTg1MzEwNTc2LCJpYXQiOjE1ODUyMjQxNzYsImp0aSI6ImQ0OThhNzBmLWEzZTgtNGFiOC1iYTJmLWE1ODY3NmYyZTM1YiJ9.GTRaUECafhBMkAKSSc3CxntAK0cb_Kcs2L6xW9oUQR8'
    axios.interceptors.request.use(config => {
        config.timeout = 5 * 60 * 1000; // 5分钟
        return config;
    }, error => Promise.reject(error));
    axios.interceptors.response.use(response => {
        const { data } = response;
        return data;
    }, error => {
        console.log('response1', response);
        if (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                    //...
                }
            }
        }
        return error;
    });
})(window);