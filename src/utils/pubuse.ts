// 获取assets静态资源
export const getAssetsFile = (url: string) => {
  return `http://gis.igeokey.com:12025/moxing/xy-img/${url}`
  // return new URL(`../assets/images/${url}`, import.meta.url).href;
}