export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    // try refresh
    const refreshRes = await fetch(`${API.users()}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
      throw new Error("Session expired");
    }

    const newToken = await refreshRes.text();
    localStorage.setItem("accessToken", newToken);

    return fetchWithAuth(url, options);
  }

  return res;
}
