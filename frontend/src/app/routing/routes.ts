export const appRoutes = {
    auth: {
        login: "/auth/login",
        registration: "/auth/registration",
        base: "/auth",
    },
    boardGames: {
        list: "/board-games",
        add: "/board-games/new",
    },
    plays: "/plays",
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
    boardGames: {
        list: "/api/board-games",
    },
};

export const routesWithoutNav = [appRoutes.auth.base];
