export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf_token="))
      ?.split("=")[1];
    if (token) options.headers["XSRF-TOKEN"] = token;
  }

  options.credentials = 'include';

  const res = await fetch(url, options);

  if (res.status >= 400) throw res;

  return res;
}