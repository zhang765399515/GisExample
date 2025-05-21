import { defineStore } from 'pinia';
import cache from '@/utils/cache';

export const appStore = defineStore('appStore', {
  state: () => ({
    // 是否展示打开源代码
    isShowSource: cache.getEditorButtonOpened(),
    // monaco 是否展开
    editorOpened: cache.getEditorOpened()
  }),
  actions: {
    setSourceCodeButtonVisible() {
      this.isShowSource = !this.isShowSource;
    },
    setEditorOpened() {
      this.editorOpened = !this.editorOpened;
    }
  }
});
