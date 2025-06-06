/* File that defines all of the Navigation Routes for the Website for Abstraction*/

export const Routes = {
    HOME: '/home',
    SIGNUP: '/signUp',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    CHAT: (clan) => `/chat/${clan}`,
    CLANEMOJIS: (clan) => `/chat/${clan}/emojis`,
}

export const navigateTo = (router, route, param = null) => {
    if (typeof Routes[route] === 'function' && param) {
        // If the Route given is a Function for Dynamic Routes, then navigate there
        router.push(Routes[route](param))
    }
    else if (typeof Routes[route] === 'string') {
        // For Static Routes
        router.push(Routes[route]);
    }
    else {
        console.warn(`Invalid route or missing parameter: ${route}`);
    }
}
