import JSEncrypt from 'jsencrypt'
import { getRSA } from "@/api/login";

export function deepClone<T>(value: T): T {
  /** 空 */
  if (!value) return value;
  /** 数组 */
  if (Array.isArray(value)) return value.map(item => deepClone(item)) as unknown as T;
  /** 日期 */
  if (value instanceof Date) return new Date(value) as unknown as T;
  /** 普通对象 */
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]: [string, any]) => {
        return [k, deepClone(v)];
      })
    ) as unknown as T;
  }
  /** 基本类型 */
  return value;
}

export function randomNumber() {
  let randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomNum.toString();
}

export function rsa(password: string) {
  return new Promise((resolve, reject) => {
    const randomStr = randomNumber();
    getRSA(randomStr).then((res: any) => {
      if (res.code == 200) {
        const pubKey = res.data.publicKey;
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(pubKey)//设置公钥
        const rsaPassWord = encryptor.encrypt(password)  // 对内容进行加密
        resolve({
          rsaPassWord: rsaPassWord,
          randomStr: randomStr,
        });
      }
    });
  })
}