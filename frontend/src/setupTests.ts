import "@testing-library/jest-dom/extend-expect";

jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();
window.fetch = jest.fn();
