export const getIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json',{method: "GET",});
    const data = await response.json();
    return data?.ip;
  } catch (error) {
    return `${error}`
  }
};
