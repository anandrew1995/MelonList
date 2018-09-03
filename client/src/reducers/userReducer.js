export default function reducer(state = {
    name: '',
    authToken: '',
    loggedIn: false,
}, action) {
    switch(action.type) {
        case 'LOG_OUT':
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('loggedIn');
            return {
                ...state,
                name: '',
                authToken: '',
                loggedIn: false
            };
        case 'UPDATE_USER':
            for (const item in action.payload) {
                sessionStorage.setItem(item, action.payload[item])
            };
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
