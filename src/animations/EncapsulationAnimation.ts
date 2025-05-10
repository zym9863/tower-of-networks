// 数据封装动画
import * as THREE from 'three';
import { NetworkTower } from '../models/NetworkTower';

export function setupEncapsulationAnimation(scene: THREE.Scene, networkTower: NetworkTower) {
  let isAnimating = false;
  let dataPacket: THREE.Mesh | null = null;
  let dataTrail: THREE.Points | null = null;
  let currentLayerIndex = 0;
  let animationStep = 0;
  let layers: THREE.Mesh[] = [];
  let layerData: any[] = [];
  let animationSpeed = 0.05;
  let particleSystem: THREE.Points | null = null;

  // 创建数据包
  function createDataPacket(position: THREE.Vector3, size: number, color: number): THREE.Mesh {
    // 使用八面体几何体
    const geometry = new THREE.OctahedronGeometry(size, 2);

    // 创建更高级的材质
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
      emissive: color,
      emissiveIntensity: 0.2
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // 添加发光效果
    addGlowEffect(mesh, color);

    return mesh;
  }

  // 添加发光效果
  function addGlowEffect(mesh: THREE.Mesh, color: number): void {
    // 创建粒子系统
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorObj = new THREE.Color(color);

    for (let i = 0; i < particlesCount; i++) {
      const radius = 0.5 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    mesh.add(particleSystem);
  }

  // 创建数据轨迹
  function createDataTrail(color: number): THREE.Points {
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const colors = new Float32Array(particlesCount * 3);

    const colorObj = new THREE.Color(color);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      sizes[i] = 0;

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    return points;
  }

  // 更新数据轨迹
  function updateDataTrail() {
    if (!dataTrail || !dataPacket) return;

    const positions = dataTrail.geometry.attributes.position.array as Float32Array;
    const sizes = dataTrail.geometry.attributes.size.array as Float32Array;

    // 将所有点向后移动
    for (let i = positions.length / 3 - 1; i > 0; i--) {
      positions[i * 3] = positions[(i - 1) * 3];
      positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
      positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];

      sizes[i] = sizes[i - 1] * 0.98; // 逐渐缩小
    }

    // 设置第一个点为当前数据包位置
    positions[0] = dataPacket.position.x;
    positions[1] = dataPacket.position.y;
    positions[2] = dataPacket.position.z;
    sizes[0] = 0.1;

    dataTrail.geometry.attributes.position.needsUpdate = true;
    dataTrail.geometry.attributes.size.needsUpdate = true;
  }

  // 开始封装动画
  function startAnimation() {
    if (isAnimating) return;

    // 获取当前模型的层
    layers = networkTower.getLayers();
    layerData = networkTower.getLayerData();

    if (layers.length === 0) return;

    isAnimating = true;
    currentLayerIndex = layers.length - 1;
    animationStep = 0;

    // 创建初始数据包（从顶层开始）
    const topLayer = layers[layers.length - 1];
    const position = new THREE.Vector3().copy(topLayer.position);
    position.y += 3; // 在顶层上方创建

    // 创建数据包和轨迹
    dataPacket = createDataPacket(position, 0.4, 0x4285F4);
    dataTrail = createDataTrail(0x4285F4);

    // 添加入场动画
    dataPacket.scale.set(0, 0, 0);
    const targetScale = new THREE.Vector3(1, 1, 1);

    const duration = 500; // 毫秒
    const startTime = Date.now();

    const scaleUp = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      dataPacket!.scale.lerpVectors(new THREE.Vector3(0, 0, 0), targetScale, progress);

      if (progress < 1) {
        requestAnimationFrame(scaleUp);
      } else {
        // 更新信息面板
        updateInfoPanel('开始数据封装过程...', 'start');
      }
    };

    scaleUp();
  }

  // 更新动画
  function updateAnimation() {
    if (!isAnimating || !dataPacket) return;

    // 更新数据轨迹
    if (dataTrail) {
      updateDataTrail();
    }

    // 旋转数据包
    dataPacket.rotation.y += 0.02;
    dataPacket.rotation.x += 0.01;

    // 更新粒子系统
    if (particleSystem) {
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length / 3; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // 添加一些随机运动
        positions[ix] += (Math.random() - 0.5) * 0.01;
        positions[iy] += (Math.random() - 0.5) * 0.01;
        positions[iz] += (Math.random() - 0.5) * 0.01;

        // 限制粒子不要飞太远
        const distance = Math.sqrt(
          positions[ix] * positions[ix] +
          positions[iy] * positions[iy] +
          positions[iz] * positions[iz]
        );

        if (distance > 1) {
          positions[ix] *= 0.99;
          positions[iy] *= 0.99;
          positions[iz] *= 0.99;
        }
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    const currentLayer = layers[currentLayerIndex];

    switch (animationStep) {
      case 0: // 移动到当前层
        const targetY = currentLayer.position.y;
        dataPacket.position.y -= animationSpeed;

        if (dataPacket.position.y <= targetY) {
          dataPacket.position.y = targetY;
          animationStep = 1;

          // 更新信息面板
          const layer = layerData[layers.length - 1 - currentLayerIndex];
          updateInfoPanel(`在${layer.name}添加${layer.pdu}头部...`, 'encapsulate', layer);

          // 高亮当前层
          highlightLayer(currentLayer);
        }
        break;

      case 1: // 在当前层停留并变大（表示封装）
        const scale = dataPacket.scale.x + 0.02;
        dataPacket.scale.set(scale, scale, scale);

        if (scale >= 1.3) {
          animationStep = 2;

          // 改变数据包颜色以匹配当前层
          const layer = layerData[layers.length - 1 - currentLayerIndex];
          changeDataPacketColor(dataPacket, layer.color);
        }
        break;

      case 2: // 移动到下一层
        currentLayerIndex--;

        if (currentLayerIndex >= 0) {
          animationStep = 0;

          // 重置之前高亮的层
          resetLayerHighlight();
        } else {
          // 动画完成
          completeAnimation();
        }
        break;
    }
  }

  // 高亮当前层
  function highlightLayer(layer: THREE.Mesh) {
    const material = layer.material as THREE.MeshPhysicalMaterial;
    material.emissive.set(0x333333);
    material.emissiveIntensity = 0.5;
  }

  // 重置层高亮
  function resetLayerHighlight() {
    for (const layer of layers) {
      const material = layer.material as THREE.MeshPhysicalMaterial;
      material.emissive.set(0x000000);
      material.emissiveIntensity = 0;
    }
  }

  // 改变数据包颜色
  function changeDataPacketColor(mesh: THREE.Mesh, color: number) {
    const material = mesh.material as THREE.MeshPhysicalMaterial;

    // 创建颜色过渡动画
    const startColor = new THREE.Color(material.color.getHex());
    const endColor = new THREE.Color(color);

    const duration = 500; // 毫秒
    const startTime = Date.now();

    const animateColor = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentColor = new THREE.Color();
      currentColor.lerpColors(startColor, endColor, progress);

      material.color.set(currentColor);
      material.emissive.set(currentColor);

      if (progress < 1) {
        requestAnimationFrame(animateColor);
      }
    };

    animateColor();
  }

  // 完成动画
  function completeAnimation() {
    if (!dataPacket) return;

    isAnimating = false;
    updateInfoPanel('数据封装完成！数据包已准备好通过物理层传输。', 'complete');

    // 添加完成动画
    const startPosition = dataPacket.position.clone();
    const endPosition = new THREE.Vector3(startPosition.x, -5, startPosition.z);

    const duration = 1500; // 毫秒
    const startTime = Date.now();

    const animateExit = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数使动画更自然
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      dataPacket!.position.lerpVectors(startPosition, endPosition, easeOutCubic);

      // 旋转和缩放
      dataPacket!.rotation.y += 0.05;
      dataPacket!.rotation.x += 0.03;

      if (progress < 1) {
        requestAnimationFrame(animateExit);
      } else {
        // 清理
        setTimeout(() => {
          if (dataPacket) {
            scene.remove(dataPacket);
            dataPacket = null;
          }
          if (dataTrail) {
            scene.remove(dataTrail);
            dataTrail = null;
          }
          resetLayerHighlight();
        }, 500);
      }
    };

    animateExit();
  }

  // 更新信息面板
  function updateInfoPanel(message: string, stage: string = 'start', layer?: any) {
    const layerInfoElement = document.getElementById('layer-info');
    if (!layerInfoElement) return;

    // 创建新的内容元素
    const newContent = document.createElement('div');
    newContent.style.opacity = '0';
    newContent.style.transform = 'translateY(10px)';
    newContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    let content = '';

    switch (stage) {
      case 'start':
        content = `
          <h3>数据封装动画</h3>
          <div class="animation-info">
            <div class="animation-icon">📦</div>
            <div class="animation-text">
              <p>${message}</p>
              <p class="animation-desc">封装过程：应用层数据在向下传递过程中，每一层都会添加该层的头部信息。</p>
            </div>
          </div>
          <div class="animation-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">0%</div>
          </div>
        `;
        break;

      case 'encapsulate':
        if (!layer) break;

        const progress = Math.round(((layers.length - 1 - currentLayerIndex) / layers.length) * 100);

        content = `
          <h3>数据封装动画</h3>
          <div class="animation-info">
            <div class="animation-icon" style="color: #${layer.color.toString(16).padStart(6, '0')}">📦</div>
            <div class="animation-text">
              <p>${message}</p>
              <p class="animation-desc">当前层：<span class="layer-name">${layer.name}</span></p>
              <p class="animation-desc">PDU：<span class="pdu-badge">${layer.pdu}</span></p>
            </div>
          </div>
          <div class="animation-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">${progress}%</div>
          </div>
        `;
        break;

      case 'complete':
        content = `
          <h3>数据封装动画</h3>
          <div class="animation-info">
            <div class="animation-icon" style="color: #4CAF50">✅</div>
            <div class="animation-text">
              <p>${message}</p>
              <p class="animation-desc">封装完成：数据已经从应用层传递到物理层，添加了所有必要的头部信息。</p>
            </div>
          </div>
          <div class="animation-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 100%"></div>
            </div>
            <div class="progress-text">100%</div>
          </div>
        `;
        break;
    }

    newContent.innerHTML = content;

    // 清空当前内容并添加新内容
    layerInfoElement.innerHTML = '';
    layerInfoElement.appendChild(newContent);

    // 触发动画
    setTimeout(() => {
      newContent.style.opacity = '1';
      newContent.style.transform = 'translateY(0)';
    }, 50);

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
      .animation-info {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        background-color: rgba(66, 133, 244, 0.1);
        border-radius: var(--radius-sm);
        padding: 1rem;
      }

      .animation-icon {
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .animation-text {
        flex: 1;
      }

      .animation-desc {
        color: var(--text-tertiary);
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }

      .layer-name {
        font-weight: 500;
        color: var(--primary-color);
      }

      .pdu-badge {
        display: inline-block;
        background-color: rgba(66, 133, 244, 0.2);
        color: var(--primary-color);
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 500;
        font-size: 0.85rem;
        border: 1px solid rgba(66, 133, 244, 0.3);
      }

      .animation-progress {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .progress-bar {
        flex: 1;
        height: 8px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background-color: var(--primary-color);
        border-radius: 4px;
        transition: width 0.5s ease;
      }

      .progress-text {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-secondary);
        width: 40px;
        text-align: right;
      }
    `;
    document.head.appendChild(style);
  }

  // 监听开始封装动画事件
  window.addEventListener('start-encapsulation', startAnimation);

  return {
    update: updateAnimation,
    isAnimating: () => isAnimating
  };
}
