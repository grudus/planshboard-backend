const http = require("http");

const API_HOST = "localhost";
const API_PORT = 8080;
let authToken = null;


function httpRequest(params, postData) {
    if (authToken) {
        params.headers = params.headers || {};
        params.headers["Authorization"] = authToken;
    }
    console.log(`\nExecute request "${params.path}" with data:`, postData);

    return new Promise(function(resolve, reject) {
        const req = http.request(params, res => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                console.error(`Invalid status code [${res.statusCode}]`);
            }
            let body = [];
            res.on("data", function(chunk) {
                body.push(chunk);
            });
            res.on("end", function() {
                try {
                    body = body.length ? JSON.parse(Buffer.concat(body).toString()) : null;
                } catch (e) {
                    reject(e);
                }
                console.log("Request ended with response: ", body);
                resolve({ body, headers: res.headers });
            });
        });
        req.on("error", function(err) {
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}


function postRequest(path, params) {
    const data = JSON.stringify(params);
    const options = {
        host: API_HOST,
        port: API_PORT,
        path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length,
        },
    };
    return httpRequest(options, data).then(res => res && res.body);
}

function getRequest(path) {
    const options = {
        host: API_HOST,
        port: API_PORT,
        path,
        method: "GET",
    };
    return httpRequest(options).then(res => res && res.body);
}

function postFormRequest(path, requestString) {
    const options = {
        host: API_HOST,
        port: API_PORT,
        path,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Content-Length": requestString.length,
        },
    };
    return httpRequest(options, requestString);
}


async function login(username, password) {
    const req = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
    const { headers } = await postFormRequest("/api/auth/login", req);
    const { authorization } = headers;
    authToken = authorization;
}

function createUser(username) {
    const data = { username, password: username, confirmPassword: username };
    return postRequest("/api/auth/registration", data);
}

function createBoardGame(name) {
    const data = {
        name,
        options: {
            gameType: "REGULAR",
            showPoints: true,
            showPosition: true,
            showNote: true,
            showDate: true,
            showTags: true,
        },
    };
    return postRequest("/api/board-games", data).then(({ id }) => id);
}

function createOpponent(opponentName, existingUserName = null) {
    const data = {
        opponentName,
        existingUserName,
    };
    return postRequest("/api/opponents", data).then(({ id }) => id);
}

function createPlay(boardGameId, opponentIds, tags = [], date = new Date(), note, finalResult) {
    const results = opponentIds.map(opponentId => ({ opponentId }));
    const data = {
        boardGameId,
        results,
        tags,
        date,
        note,
        finalResult,
    };
    return postRequest("/api/plays", data).then(({ id }) => id);
}

async function acceptOpponentRequest(opponentId) {
    const notifications = await getRequest("/api/notifications?limitPerPage=100");
// noinspection JSUnresolvedVariable
    const notificationId = notifications
        .filter(not => not.eventType === "OPPONENT_LINKED" && not.eventData.linkedOpponentId === opponentId)[0].id;
    const data = { notificationId };
    return postRequest("/api/opponent-notifications/accept", data);
}

(async function() {
    await createUser("grudus");
    await createUser("madzia");
    await login("grudus", "grudus");

    const notLinkedOpponent = await createOpponent("Maxym");
    const linkedOpponent = await createOpponent("madzia", "madzia");

    await login("madzia", "madzia");
    await acceptOpponentRequest(linkedOpponent);
    await createOpponent("gruuuuuuuuu", "grudus");
    await login("grudus", "grudus");

    const boardGame1 = await createBoardGame("Carcassone");
    const boardGame2 = await createBoardGame("Patchwork");

    await createPlay(boardGame1, [notLinkedOpponent, linkedOpponent], ["tag1", "ok"]);
    await createPlay(boardGame1, [notLinkedOpponent, linkedOpponent], ["tag1"], new Date(), "Note note");
    await createPlay(boardGame2, [linkedOpponent]);
})();



