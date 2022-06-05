
const app = {
    state: {
        userName: '',
        token:"",
    },
    mutations: {
        setUserName: (state, userName) => {
            state.userName = userName
        },
        setToken: (state, token) => {
            state.token = token
        }
    }
}
export default app;