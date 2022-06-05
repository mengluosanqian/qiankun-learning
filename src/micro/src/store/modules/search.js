import Vue from 'vue';


const search = {
    state: {
        word: "",
        scenceId: "",
        searchChange: "",
    },
    mutations: {
        setWord: (state, data) => {
            localStorage.setItem("word", JSON.stringify(data))
            state.word = JSON.parse(localStorage.getItem("word"));
        },
        setScenceId: (state, data) => {
            localStorage.setItem("scenceId", JSON.stringify(data))
            state.scenceId = JSON.parse(localStorage.getItem("scenceId"));
        },
        setSearchChange: (state, data) => {
            localStorage.setItem("searchChange", JSON.stringify(data));
            state.searchChange = JSON.parse(localStorage.getItem("searchChange"));
        }
    },
    actions: {

    }
}
export default search;