import reducer from "./application";

it("throws an error with an unsupported type", () => {
  expect(() => reducer({}, { type: "HAMBURGER" })).toThrowError(
    /tried to reduce with unsupported action type/i
  );
});
