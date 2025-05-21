import path from 'path';

/**
 * 获取根目录路径
 */
export function getRootPath() {
  return path.resolve(process.cwd());
}

/**
 * 获取src目录路径
 * @param srcName src默认文件名
 * @descrition 
 */
export function getSrcPath(srcName = 'src') {
  const rootPath = getRootPath();

  return `${rootPath}/${srcName}`;
}