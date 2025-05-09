import * as THREE from "three";
 
// 定义纹理映射，方便扩展状态
const STATE_TEXTURE_MAP = {
  摄像头: "./image/摄像头.png",
};
 
// 标注位置对应的模型对象obj
function createSprite(obj, state, scale = [50, 50, 1], yOffset = 5 / 2) {
  const texLoader = new THREE.TextureLoader();
  const textureUrl = STATE_TEXTURE_MAP[state];
 
  if (!textureUrl) {
    console.error(`未找到状态 ${state} 对应的纹理图片`);
    return;
  }
 
  return new Promise((resolve, reject) => {
    texLoader.load(
      textureUrl,
      (texture) => {
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        // 控制精灵大小
        sprite.scale.set(...scale);
        sprite.position.y = yOffset; // 标签底部箭头和空对象标注点重合
        obj.add(sprite); // tag会标注在空对象obj对应的位置
        resolve(sprite);
      },
      undefined,
      (error) => {
        console.error(
          `纹理加载失败: ${textureUrl}, 错误信息: ${error.message}`
        );
        reject(error);
      }
    );
  });
}
 
export default createSprite;