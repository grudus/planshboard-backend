import { fetchRequest, postFormRequest } from "./httpUtils";

const MOCK_BACKEND_URL = "http://mock.backend";
beforeEach(() => {
    process.env.REACT_APP_BACKEND_URL = MOCK_BACKEND_URL;
});

test("Should return response object when no text in response", async () => {
    const mockResponse = { text: () => Promise.resolve(), statusText: "1" };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);
    const response = (await fetchRequest({ path: "", body: "", type: "get" })) as Response;
    expect(response.statusText).toBe(mockResponse.statusText);
});

test("Should return json when response has text", async () => {
    const mockResponse = { text: () => Promise.resolve(`{"value": "test-value"}`) };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);
    const response: any = await fetchRequest({ path: "", body: "", type: "get" });
    expect(response.value).toBe("test-value");
});

test("Should reject when error status", async () => {
    expect.assertions(1);
    const mockResponse = { text: () => Promise.resolve({ status: 400 }) };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);
    await fetchRequest({ path: "", body: "", type: "get" }).catch(e => {
        expect(e).not.toBeNull();
    });
});

test("Should normalize path starting with slash", async () => {
    const mockResponse = { text: () => Promise.resolve() };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);
    await fetchRequest({ path: "/auth", body: "", type: "get" });
    expect(window.fetch).toBeCalledWith(`${MOCK_BACKEND_URL}/auth`, expect.anything());
});

test("Should normalize path starting without slash", async () => {
    const mockResponse = { text: () => Promise.resolve() };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);
    await fetchRequest({ path: "auth", body: "", type: "get" });
    expect(window.fetch).toBeCalledWith(`${MOCK_BACKEND_URL}/auth`, expect.anything());
});

test("Should normalize path starting without http", async () => {
    const mockResponse = { text: () => Promise.resolve() };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);
    await fetchRequest({ path: "http://planshboard.com/auth", body: "", type: "get" });
    expect(window.fetch).toBeCalledWith(`http://planshboard.com/auth`, expect.anything());
});

test("Should execute post request with form data", async () => {
    const mockResponse = { text: () => Promise.resolve() };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);

    await postFormRequest({ path: "/path", body: { alfa: "beta", a: "b" }, type: "post" }, "token");
    expect(window.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            body: "alfa=beta&a=b",
            method: "post",
        }),
    );
});

test("Should execute post-form request with valid headers", async () => {
    const mockResponse = { text: () => Promise.resolve() };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);

    await postFormRequest({ path: "/path", body: { alfa: "beta", a: "b" }, type: "post" }, "token");
    expect(window.fetch).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
            headers: expect.objectContaining({
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            }),
        }),
    );
});
