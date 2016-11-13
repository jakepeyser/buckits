// Check whether script is being run in browser or Node
export const isBrowser = () => {
  try {
    return this === window;
  } catch (e) {
    return false;
  }
}
