import { createOsmBuildings, Geokey3DTileset, SplitDirection, ScreenSpaceEventHandler, ScreenSpaceEventType } from "geokey-gis";

/**
 * 分屏卷帘效果
 */
export async function splitShutter() {
  const slider = document.getElementById('slider');
  (slider?.style as any).display = 'block';
  const shutterHandler = new ScreenSpaceEventHandler(slider as HTMLCanvasElement);
  const tilesetLeft = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=xms_b3dm_xin')
  const tilesetRight = await Geokey3DTileset.fromUrl('http://14.22.86.227:12022/service/gis/3DModel/?serviceName=xms_b3dm_xin')
  const screenLeft = window.viewer.scene.primitives.add(tilesetLeft);
  const screenRight = window.viewer.scene.primitives.add(tilesetRight);
  let moveAction = false;

  screenLeft.splitDirection = SplitDirection.LEFT;
  screenRight.splitDirection = SplitDirection.RIGHT;

  window.viewer.zoomTo(screenLeft);

  slider && (window.viewer.scene.splitPosition = slider?.offsetLeft / (slider?.parentElement as HTMLElement)?.offsetWidth);

  function shutterMove(movement: any) {
    if (!moveAction) {
      return;
    }

    const reactiveOffset = movement.endPosition.x;
    const splitPosition = (slider?.offsetLeft + reactiveOffset) / (slider?.parentElement as HTMLElement)?.offsetWidth;
    (slider?.style as any).left = `${100 * splitPosition}%`;
    window.viewer.scene.splitPosition = splitPosition;
  }

  shutterHandler.setInputAction(() => {
    moveAction = true;
  }, ScreenSpaceEventType.LEFT_DOWN);
  shutterHandler.setInputAction(() => {
    moveAction = true;
  }, ScreenSpaceEventType.PINCH_START);
  shutterHandler.setInputAction(shutterMove, ScreenSpaceEventType.MOUSE_MOVE);
  shutterHandler.setInputAction(shutterMove, ScreenSpaceEventType.PINCH_MOVE);
  shutterHandler.setInputAction(() => {
    moveAction = false;
  }, ScreenSpaceEventType.LEFT_UP);
  shutterHandler.setInputAction(() => {
    moveAction = false;
  }, ScreenSpaceEventType.PINCH_END);
}

/**
 * 关闭所有加载的图层和分屏按键
 */
export function removeTiles() {
  const slider = document.getElementById('slider');
  (slider?.style as any).display = 'none';
  window.viewer.scene.primitives.removeAll();
}
