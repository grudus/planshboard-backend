export const appRoutes = {
    auth: {
        login: "/auth/login",
        registration: "/auth/registration",
        base: "/auth",
        logout: "/auth/logout",
    },
    boardGame: {
        list: "/board-games",
        add: "/board-games/new",
        edit: "/board-games/:id",
    },
    opponents: {
        list: "/opponents",
        edit: "/opponents/:id",
        add: "/opponents/new",
    },
    plays: "/count",
    stats: "/stats",
    ranking: "/ranking",
    notifications: "/notifications",
    settings: "/settings",
    home: "/",
};

export const apiRoutes = {
    auth: {
        login: "/api/auth/login",
        registration: "/api/auth/registration",
        checkUsername: (username: string) => `/api/auth/registration/exists?username=${username}`,
    },
    user: {
        current: "/api/users/me",
    },
    boardGame: {
        list: "/api/board-games",
        single: (id: number) => `/api/board-games/${id}`,
    },
    opponent: {
        list: "/api/opponents",
        create: "/api/opponents",
        update: (id: number) => `/api/opponents/${id}`,
        single: (id: number) => `/api/opponents/${id}`,
    },
};

export const routesWithoutNav = [appRoutes.auth.base];
export const routesWithoutAuth = [appRoutes.auth.base];
