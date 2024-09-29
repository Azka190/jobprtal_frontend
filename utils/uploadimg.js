export default async function uploadimg(token, file) {
  let headersList = {
    Authorization: `Bearer ${token}`,
  };

  let bodyContent = new FormData();
  bodyContent.append("files", file);

  let response = await fetch("http://localhost:1337/api/upload", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let res = await response.json();
  return res;
}
