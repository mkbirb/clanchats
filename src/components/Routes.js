/* File that defines all of the Navigation Routes for the Website for Abstraction*/

export const Routes = {
    HOME: '/home',
    SIGNUP: '/signUp',
    LOGIN: '/login',
    CHAT: '/chat',
}

export const navigateTo = (router, route) => {
    if(Routes[route]) {
        // Go to specific URL
        router.push(Routes[route]);
    }
}
