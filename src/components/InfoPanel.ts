// 信息面板组件

export function setupInfoPanel() {
  const infoPanel = document.getElementById('info-panel');
  const layerInfo = document.getElementById('layer-info');
  
  if (!infoPanel || !layerInfo) {
    console.error('信息面板元素未找到');
    return null;
  }
  
  // 初始化信息面板
  layerInfo.innerHTML = `
    <p>点击任意网络层查看详细信息</p>
    <p>您可以使用鼠标：</p>
    <ul>
      <li>左键拖动：旋转视图</li>
      <li>右键拖动：平移视图</li>
      <li>滚轮：缩放视图</li>
    </ul>
    <p>使用下方按钮切换网络模型或播放动画</p>
  `;
  
  return {
    update: (layerData: any) => {
      if (!layerInfo) return;
      
      let protocolsList = layerData.protocols.map((p: string) => `<li>${p}</li>`).join('');
      let functionsList = layerData.functions.map((f: string) => `<li>${f}</li>`).join('');
      
      layerInfo.innerHTML = `
        <h3>${layerData.name}</h3>
        <p>${layerData.description}</p>
        
        <h4>主要功能：</h4>
        <ul>${functionsList}</ul>
        
        <h4>关键协议：</h4>
        <ul>${protocolsList}</ul>
        
        <h4>PDU：</h4>
        <p>${layerData.pdu}</p>
      `;
    }
  };
}
