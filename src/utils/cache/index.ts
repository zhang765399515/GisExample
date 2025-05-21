import { SessionStorage, Storage } from '../storage';
import CacheKey from '@/utils/cache/key';

// 缓存
class Cache {
  getEditorButtonOpened = (): boolean => {
    return Storage.getItem(CacheKey.EditorButtonOpenedKey) || false;
  }
 
  getEditorOpened = (): boolean => {
    return Storage.getItem(CacheKey.EditorOpenedKey) || false;
  };

  setEditorOpened = (value: boolean) => {
    Storage.setItem(CacheKey.EditorOpenedKey, value);
  };
}

export default new Cache();
