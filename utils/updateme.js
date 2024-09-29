export default async function updateme(token, data) {
  let headersList = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    data,
  });

  let response = await fetch("http://localhost:1337/api/user/me", {
    method: "PUT",
    body: bodyContent,
    headers: headersList,
  });

  let res = await response.text();
  return res;
}
