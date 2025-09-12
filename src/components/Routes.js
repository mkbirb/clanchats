/* File that defines all of the Navigation Routes for the Website for Abstraction*/

export const Routes = {
    HOME: '/home',
    SIGNUP: '/signUp',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    CHAT: (clan) => `/chat/${clan}`,
    CLANEMOJIS: (clan) => `/chat/${clan}/emojis`,
    CLANMEMBERLIST: (clan) => `/chat/${clan}/members`,
    CLANCALENDER: (clan) => `/chat/${clan}/calender`,
    CLANTIMETABLES: (clan) => `/chat/${clan}/timetables`,
    SPECIFICTIMETABLE: (clan, timetableID) => `/chat/${clan}/timetables/${timetableID}`,
    MEMORYBOARD: (clan) => `/chat/${clan}/memoryBoard`,
}

export const navigateTo = (router, route, ...params) => {
    if (typeof Routes[route] === 'function' && params.length > 0) {
        // If the Route given is a Function for Dynamic Routes, then navigate there
        router.push(Routes[route](...params));
    }
    else if (typeof Routes[route] === 'string') {
        // For Static Routes
        router.push(Routes[route]);
    }
    else {
        console.warn(`Invalid route or missing parameter: ${route}`);
    }
}
