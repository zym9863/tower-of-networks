// 控制组件
import { NetworkTower } from '../models/NetworkTower';

export function setupControls(networkTower: NetworkTower) {
  const osiModelBtn = document.getElementById('osi-model');
  const tcpModelBtn = document.getElementById('tcp-model');
  const encapsulationBtn = document.getElementById('encapsulation-btn');
  const decapsulationBtn = document.getElementById('decapsulation-btn');
  
  if (!osiModelBtn || !tcpModelBtn || !encapsulationBtn || !decapsulationBtn) {
    console.error('控制按钮元素未找到');
    return null;
  }
  
  // OSI模型按钮点击事件
  osiModelBtn.addEventListener('click', () => {
    osiModelBtn.classList.add('active');
    tcpModelBtn.classList.remove('active');
    networkTower.createOSIModel();
  });
  
  // TCP/IP模型按钮点击事件
  tcpModelBtn.addEventListener('click', () => {
    tcpModelBtn.classList.add('active');
    osiModelBtn.classList.remove('active');
    networkTower.createTCPIPModel();
  });
  
  // 数据封装动画按钮点击事件
  encapsulationBtn.addEventListener('click', () => {
    // 触发封装动画
    const event = new CustomEvent('start-encapsulation');
    window.dispatchEvent(event);
  });
  
  // 数据解封装动画按钮点击事件
  decapsulationBtn.addEventListener('click', () => {
    // 触发解封装动画
    const event = new CustomEvent('start-decapsulation');
    window.dispatchEvent(event);
  });
  
  return {
    osiModelBtn,
    tcpModelBtn,
    encapsulationBtn,
    decapsulationBtn
  };
}
