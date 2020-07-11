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
    plays: {
        list: "/plays",
        add: "/plays/new",
        edit: "/plays/:id",
    },
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
        frequent: "/api/opponents/frequent",
        create: "/api/opponents",
        update: (id: number) => `/api/opponents/${id}`,
        single: (id: number) => `/api/opponents/${id}`,
    },
    play: {
        create: "/api/plays",
        list: "/api/plays",
    },
    tags: {
        getWithPlaysCount: "/api/tags",
    },
};

export const routesWithoutNav = [appRoutes.auth.base];
export const routesWithoutAuth = [appRoutes.auth.base];
