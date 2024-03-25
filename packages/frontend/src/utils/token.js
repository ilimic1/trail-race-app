const key = "token";

export function setToken(value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(err);
  }
}

export function getToken(defaultValue) {
  console.log("getToken::defaultValue", defaultValue);
  try {
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  } catch (err) {
    return defaultValue;
  }
}
