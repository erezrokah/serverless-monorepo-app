export const authorize = jest.fn();
export const parseHash = jest.fn();

const WebAuth = jest.fn().mockImplementation(() => {
  return { authorize, parseHash };
});

export { WebAuth };
