import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NetworkTower } from './models/NetworkTower';
import { setupInfoPanel } from './components/InfoPanel';
import { setupControls } from './components/Controls';
import { setupEncapsulationAnimation } from './animations/EncapsulationAnimation';
import { setupDecapsulationAnimation } from './animations/DecapsulationAnimation';

// 全局变量，用于在其他组件中访问相机
declare global {
  interface Window {
    appCamera: THREE.PerspectiveCamera;
  }
}

// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);

// 创建加载管理器
const loadingManager = new THREE.LoadingManager(
  // 加载完成
  () => {
    const loadingAnimation = document.getElementById('loading-animation');
    if (loadingAnimation) {
      loadingAnimation.style.display = 'none';
    }
  },
  // 加载进度
  (_url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    console.log(`加载进度: ${progress.toFixed(2)}%`);
  }
);

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(7, 6, 12);

// 将相机添加到全局对象中，以便其他组件可以访问
window.appCamera = camera;

// 初始化渲染器
const container = document.getElementById('scene-container') as HTMLElement;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比以提高性能
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.7;
controls.zoomSpeed = 0.8;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 1.5;

// 添加灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 主光源
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(10, 15, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -15;
mainLight.shadow.camera.right = 15;
mainLight.shadow.camera.top = 15;
mainLight.shadow.camera.bottom = -15;
scene.add(mainLight);

// 补光
const fillLight = new THREE.DirectionalLight(0x8ebbff, 0.5);
fillLight.position.set(-10, 5, -10);
scene.add(fillLight);

// 添加环境光贴图
const envMapTexture = new THREE.CubeTextureLoader(loadingManager).load([
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park3Med/px.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park3Med/nx.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park3Med/py.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park3Med/ny.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park3Med/pz.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Park3Med/nz.jpg'
]);
scene.environment = envMapTexture;

// 添加地面
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.8,
  metalness: 0.2,
  envMapIntensity: 0.5
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add(ground);

// 创建网络塔模型
const networkTower = new NetworkTower(scene);
networkTower.createOSIModel(); // 默认显示OSI模型

// 设置信息面板
setupInfoPanel();

// 设置控制按钮
setupControls(networkTower);

// 设置动画
const encapsulationAnimation = setupEncapsulationAnimation(scene, networkTower);
const decapsulationAnimation = setupDecapsulationAnimation(scene, networkTower);

// 窗口大小调整处理
window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

// 添加背景粒子效果
function createParticles() {
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4285F4,
    size: 0.05,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return particles;
}

const particles = createParticles();

// 动画循环
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // 更新控制器
  controls.update();

  // 旋转粒子
  particles.rotation.y = elapsedTime * 0.05;

  // 更新动画
  encapsulationAnimation.update();
  decapsulationAnimation.update();

  // 渲染场景
  renderer.render(scene, camera);
}

// 开始动画循环
animate();
