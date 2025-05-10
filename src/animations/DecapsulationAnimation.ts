// 数据解封装动画
import * as THREE from 'three';
import { NetworkTower } from '../models/NetworkTower';

export function setupDecapsulationAnimation(scene: THREE.Scene, networkTower: NetworkTower) {
  let isAnimating = false;
  let dataPacket: THREE.Mesh | null = null;
  let currentLayerIndex = 0;
  let animationStep = 0;
  let layers: THREE.Mesh[] = [];
  let layerData: any[] = [];
  
  // 创建数据包
  function createDataPacket(position: THREE.Vector3, size: number, color: number): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    scene.add(mesh);
    
    return mesh;
  }
  
  // 开始解封装动画
  function startAnimation() {
    if (isAnimating) return;
    
    // 获取当前模型的层
    layers = networkTower.getLayers();
    layerData = networkTower.getLayerData();
    
    if (layers.length === 0) return;
    
    isAnimating = true;
    currentLayerIndex = 0; // 从底层开始
    animationStep = 0;
    
    // 创建初始数据包（从底层开始）
    const bottomLayer = layers[0];
    const position = new THREE.Vector3().copy(bottomLayer.position);
    position.y -= 2; // 在底层下方创建
    
    dataPacket = createDataPacket(position, 1.5, 0xF4B400);
    
    // 更新信息面板
    updateInfoPanel('开始数据解封装过程...');
  }
  
  // 更新动画
  function updateAnimation() {
    if (!isAnimating || !dataPacket) return;
    
    const currentLayer = layers[currentLayerIndex];
    
    switch (animationStep) {
      case 0: // 移动到当前层
        const targetY = currentLayer.position.y;
        dataPacket.position.y += 0.05;
        
        if (dataPacket.position.y >= targetY) {
          dataPacket.position.y = targetY;
          animationStep = 1;
          
          // 更新信息面板
          const layer = layerData[layers.length - 1 - currentLayerIndex];
          updateInfoPanel(`在${layer.name}移除${layer.pdu}头部...`);
        }
        break;
        
      case 1: // 在当前层停留并变小（表示解封装）
        const scale = dataPacket.scale.x - 0.02;
        dataPacket.scale.set(scale, scale, scale);
        
        if (scale <= 0.8) {
          animationStep = 2;
        }
        break;
        
      case 2: // 移动到上一层
        currentLayerIndex++;
        
        if (currentLayerIndex < layers.length) {
          animationStep = 0;
        } else {
          // 动画完成
          isAnimating = false;
          updateInfoPanel('数据解封装完成！数据已传递到应用层。');
          
          // 3秒后移除数据包
          setTimeout(() => {
            if (dataPacket) {
              scene.remove(dataPacket);
              dataPacket = null;
            }
          }, 3000);
        }
        break;
    }
  }
  
  // 更新信息面板
  function updateInfoPanel(message: string) {
    const layerInfoElement = document.getElementById('layer-info');
    if (!layerInfoElement) return;
    
    layerInfoElement.innerHTML = `
      <h3>数据解封装动画</h3>
      <p>${message}</p>
      <p>解封装过程：数据包在向上传递过程中，每一层都会移除该层的头部信息。</p>
    `;
  }
  
  // 监听开始解封装动画事件
  window.addEventListener('start-decapsulation', startAnimation);
  
  return {
    update: updateAnimation,
    isAnimating: () => isAnimating
  };
}
