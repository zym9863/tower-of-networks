import * as THREE from 'three';
import { OSILayers, TCPIPLayers } from './NetworkLayers';

export class NetworkTower {
  private scene: THREE.Scene;
  private layers: THREE.Mesh[] = [];
  private layerData: any[] = [];
  private currentModel: 'osi' | 'tcp' = 'osi';
  private selectedLayer: THREE.Mesh | null = null;
  private layerLabels: THREE.Object3D[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private clickEnabled: boolean = true; // 添加点击启用标志，防止快速连续点击

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // 添加鼠标点击事件监听器
    window.addEventListener('click', this.onMouseClick.bind(this));
  }

  // 创建OSI七层模型
  public createOSIModel(): void {
    this.clearCurrentModel();
    this.currentModel = 'osi';
    this.layerData = OSILayers;

    let yPosition = 0;

    // 从底部向上创建每一层
    for (let i = this.layerData.length - 1; i >= 0; i--) {
      const layer = this.layerData[i];
      const mesh = this.createLayerMesh(layer, yPosition);

      this.layers.push(mesh);
      this.scene.add(mesh);

      // 添加层标签
      this.addLayerLabel(layer.name, yPosition + layer.height / 2, i);

      yPosition += layer.height;
    }
  }

  // 创建TCP/IP四层模型
  public createTCPIPModel(): void {
    this.clearCurrentModel();
    this.currentModel = 'tcp';
    this.layerData = TCPIPLayers;

    let yPosition = 0;

    // 从底部向上创建每一层
    for (let i = this.layerData.length - 1; i >= 0; i--) {
      const layer = this.layerData[i];
      const mesh = this.createLayerMesh(layer, yPosition);

      this.layers.push(mesh);
      this.scene.add(mesh);

      // 添加层标签
      this.addLayerLabel(layer.name, yPosition + layer.height / 2, i);

      yPosition += layer.height;
    }
  }

  // 创建单个网络层的3D网格
  private createLayerMesh(layer: any, yPosition: number): THREE.Mesh {
    // 使用圆角盒子几何体
    const geometry = new THREE.BoxGeometry(5, layer.height, 5);

    // 创建更高级的材质
    const material = new THREE.MeshPhysicalMaterial({
      color: layer.color,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.0
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, yPosition + layer.height / 2, 0);
    mesh.userData = { layerId: layer.id };

    // 添加边缘发光效果
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    mesh.add(edges);

    // 添加阴影
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  // 添加层标签
  private addLayerLabel(text: string, yPosition: number, index: number): void {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 512;
    canvas.height = 128;

    // 绘制背景
    context.fillStyle = 'rgba(30, 30, 30, 0.7)';
    context.roundRect(0, 0, canvas.width, canvas.height, 16);
    context.fill();

    // 绘制边框
    context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    context.lineWidth = 2;
    context.roundRect(0, 0, canvas.width, canvas.height, 16);
    context.stroke();

    // 绘制文本
    context.fillStyle = '#ffffff';
    context.font = 'Bold 32px "Noto Sans SC", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.set(4, yPosition, 3);
    sprite.scale.set(3, 0.75, 1);

    // 添加淡入动画
    sprite.material.opacity = 0;
    setTimeout(() => {
      const fadeIn = setInterval(() => {
        if (sprite.material.opacity < 1) {
          sprite.material.opacity += 0.05;
        } else {
          clearInterval(fadeIn);
        }
      }, 30);
    }, index * 100);

    this.layerLabels.push(sprite);
    this.scene.add(sprite);
  }

  // 清除当前模型
  private clearCurrentModel(): void {
    // 移除所有层
    for (const layer of this.layers) {
      this.scene.remove(layer);
    }

    // 移除所有标签
    for (const label of this.layerLabels) {
      this.scene.remove(label);
    }

    this.layers = [];
    this.layerLabels = [];
    this.selectedLayer = null;
  }

  // 处理鼠标点击事件
  private onMouseClick(event: MouseEvent): void {
    // 如果点击被禁用，直接返回
    if (!this.clickEnabled) return;

    // 禁用点击，防止快速连续点击
    this.clickEnabled = false;

    // 计算鼠标在归一化设备坐标中的位置
    const container = document.getElementById('scene-container');
    if (!container) {
      this.clickEnabled = true;
      return;
    }

    const rect = container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    // 从全局对象获取相机
    const camera = window.appCamera;
    if (!camera) {
      console.error('无法获取相机引用');
      this.clickEnabled = true;
      return;
    }

    this.raycaster.setFromCamera(this.mouse, camera);

    // 创建一个包含所有可点击对象的数组（包括层及其子对象）
    const allObjects: THREE.Object3D[] = [];
    this.layers.forEach(layer => {
      allObjects.push(layer);
      // 添加子对象（如边缘线段）
      layer.children.forEach(child => {
        allObjects.push(child);
      });
    });

    // 检查射线与哪些对象相交
    const intersects = this.raycaster.intersectObjects(allObjects);

    if (intersects.length > 0) {
      // 获取点击的对象
      const clickedObject = intersects[0].object;

      // 如果点击的是子对象（如边缘线段），则获取其父对象（网络层）
      const clickedLayer = clickedObject.parent && this.layers.includes(clickedObject.parent as THREE.Mesh)
        ? clickedObject.parent as THREE.Mesh
        : clickedObject as THREE.Mesh;

      // 确保点击的是网络层或其子对象
      if (this.layers.includes(clickedLayer) || this.layers.some(layer => layer.children.includes(clickedLayer))) {
        this.selectLayer(clickedLayer);
      }
    }

    // 500毫秒后重新启用点击
    setTimeout(() => {
      this.clickEnabled = true;
    }, 500);
  }

  // 选择一个层
  public selectLayer(layer: THREE.Object3D): void {
    // 确保我们有一个网络层对象，而不是其子对象
    let networkLayer: THREE.Mesh;

    // 如果是子对象，获取其父对象（网络层）
    if (layer.parent && this.layers.includes(layer.parent as THREE.Mesh)) {
      networkLayer = layer.parent as THREE.Mesh;
    } else if (this.layers.includes(layer as THREE.Mesh)) {
      networkLayer = layer as THREE.Mesh;
    } else {
      console.error('无法确定网络层对象');
      return;
    }

    // 重置之前选中的层
    if (this.selectedLayer) {
      const material = this.selectedLayer.material as THREE.MeshPhysicalMaterial;
      material.emissive.set(0x000000);

      // 移除之前的高亮效果
      const highlightElement = document.querySelector('.layer-highlight');
      if (highlightElement) {
        highlightElement.remove();
      }
    }

    // 高亮新选中的层
    this.selectedLayer = networkLayer;
    const material = networkLayer.material as THREE.MeshPhysicalMaterial;
    material.emissive.set(0x222222);

    // 创建视觉高亮效果
    this.createHighlightEffect(networkLayer);

    // 更新信息面板
    const layerId = networkLayer.userData.layerId;
    const layerInfo = this.layerData.find(l => l.id === layerId);

    if (layerInfo) {
      this.updateInfoPanel(layerInfo);
    }

    // 添加选择动画
    this.animateLayerSelection(networkLayer);
  }

  // 创建高亮效果
  private createHighlightEffect(layer: THREE.Object3D): void {
    // 获取层的世界位置
    const worldPosition = new THREE.Vector3();
    layer.getWorldPosition(worldPosition);

    // 将3D位置转换为屏幕位置
    const camera = window.appCamera;
    if (!camera) return;

    const container = document.getElementById('scene-container');
    if (!container) return;

    // 创建高亮元素
    const highlight = document.createElement('div');
    highlight.className = 'layer-highlight';
    container.appendChild(highlight);

    // 更新高亮元素位置
    this.updateHighlightPosition(layer, highlight);

    // 添加窗口调整和相机移动的监听器
    window.addEventListener('resize', () => this.updateHighlightPosition(layer, highlight));
    document.addEventListener('mousemove', () => this.updateHighlightPosition(layer, highlight));
  }

  // 更新高亮元素位置
  private updateHighlightPosition(layer: THREE.Object3D, highlight: HTMLElement): void {
    const camera = window.appCamera;
    if (!camera) return;

    const container = document.getElementById('scene-container');
    if (!container) return;

    // 获取层的世界位置
    const worldPosition = new THREE.Vector3();
    layer.getWorldPosition(worldPosition);

    // 将3D位置转换为屏幕位置
    const vector = worldPosition.clone();
    vector.project(camera);

    const rect = container.getBoundingClientRect();
    const x = (vector.x * 0.5 + 0.5) * rect.width;
    const y = (-(vector.y * 0.5) + 0.5) * rect.height;

    // 设置高亮元素的位置和大小
    highlight.style.width = '80px';
    highlight.style.height = '80px';
    highlight.style.left = `${x - 40}px`;
    highlight.style.top = `${y - 40}px`;
  }

  // 添加选择动画
  private animateLayerSelection(layer: THREE.Object3D): void {
    // 保存原始比例
    const originalScale = layer.scale.clone();

    // 放大动画
    const scaleUp = new THREE.Vector3(
      originalScale.x * 1.1,
      originalScale.y * 1.1,
      originalScale.z * 1.1
    );

    // 执行动画
    const duration = 200; // 毫秒
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 0.5) {
        // 放大阶段
        const t = progress * 2; // 0 到 1
        layer.scale.lerpVectors(originalScale, scaleUp, t);
      } else {
        // 缩小阶段
        const t = (progress - 0.5) * 2; // 0 到 1
        layer.scale.lerpVectors(scaleUp, originalScale, t);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // 更新信息面板
  private updateInfoPanel(layerInfo: any): void {
    const layerInfoElement = document.getElementById('layer-info');
    if (!layerInfoElement) return;

    // 创建新的内容元素
    const newContent = document.createElement('div');
    newContent.style.opacity = '0';
    newContent.style.transform = 'translateY(10px)';
    newContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    // 为协议和功能添加图标
    let protocolsList = layerInfo.protocols.map((p: string) => `<li><span class="icon">📡</span> ${p}</li>`).join('');
    let functionsList = layerInfo.functions.map((f: string) => `<li><span class="icon">✓</span> ${f}</li>`).join('');

    newContent.innerHTML = `
      <h3>${layerInfo.name}</h3>
      <p>${layerInfo.description}</p>

      <h4>主要功能：</h4>
      <ul>${functionsList}</ul>

      <h4>关键协议：</h4>
      <ul>${protocolsList}</ul>

      <div class="pdu-info">
        <h4>PDU：</h4>
        <p><span class="pdu-badge">${layerInfo.pdu}</span></p>
      </div>
    `;

    // 清空当前内容并添加新内容
    layerInfoElement.innerHTML = '';
    layerInfoElement.appendChild(newContent);

    // 触发动画
    setTimeout(() => {
      newContent.style.opacity = '1';
      newContent.style.transform = 'translateY(0)';
    }, 50);

    // 添加PDU徽章样式
    const style = document.createElement('style');
    style.textContent = `
      .pdu-badge {
        display: inline-block;
        background-color: rgba(66, 133, 244, 0.2);
        color: var(--primary-color);
        padding: 4px 10px;
        border-radius: 4px;
        font-weight: 500;
        border: 1px solid rgba(66, 133, 244, 0.3);
      }

      .pdu-info {
        margin-top: 1rem;
      }
    `;
    document.head.appendChild(style);
  }

  // 获取当前模型的所有层
  public getLayers(): THREE.Mesh[] {
    return this.layers;
  }

  // 获取当前模型类型
  public getCurrentModel(): string {
    return this.currentModel;
  }

  // 获取层数据
  public getLayerData(): any[] {
    return this.layerData;
  }
}
