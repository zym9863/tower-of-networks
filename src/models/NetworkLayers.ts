// 网络层定义

// OSI七层模型
export const OSILayers = [
  {
    id: 'application',
    name: '应用层',
    color: 0x4285F4,
    height: 1,
    description: '为应用程序提供网络服务的接口',
    functions: [
      '提供用户接口',
      '数据格式转换',
      '加密/解密',
      '会话管理'
    ],
    protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'DHCP', 'Telnet', 'SSH'],
    pdu: '数据 (Data)'
  },
  {
    id: 'presentation',
    name: '表示层',
    color: 0x0F9D58,
    height: 1,
    description: '处理数据格式、加密和压缩',
    functions: [
      '数据格式转换',
      '数据加密/解密',
      '数据压缩/解压缩'
    ],
    protocols: ['SSL/TLS', 'JPEG', 'MPEG', 'ASCII', 'EBCDIC'],
    pdu: '数据 (Data)'
  },
  {
    id: 'session',
    name: '会话层',
    color: 0xF4B400,
    height: 1,
    description: '建立、管理和终止会话',
    functions: [
      '会话建立、维护和终止',
      '会话恢复',
      '认证',
      '同步'
    ],
    protocols: ['NetBIOS', 'RPC', 'PPTP', 'SAP'],
    pdu: '数据 (Data)'
  },
  {
    id: 'transport',
    name: '传输层',
    color: 0xDB4437,
    height: 1,
    description: '提供端到端的连接服务',
    functions: [
      '分段和重组',
      '连接控制',
      '流量控制',
      '错误控制'
    ],
    protocols: ['TCP', 'UDP', 'SCTP'],
    pdu: '段 (Segment) / 数据报 (Datagram)'
  },
  {
    id: 'network',
    name: '网络层',
    color: 0x4285F4,
    height: 1,
    description: '提供路由和寻址功能',
    functions: [
      '逻辑寻址',
      '路由选择',
      '路径确定',
      '数据包转发'
    ],
    protocols: ['IP', 'ICMP', 'IGMP', 'IPsec', 'OSPF', 'BGP'],
    pdu: '数据包 (Packet)'
  },
  {
    id: 'datalink',
    name: '数据链路层',
    color: 0x0F9D58,
    height: 1,
    description: '提供节点到节点的数据传输',
    functions: [
      '物理寻址',
      '访问控制',
      '错误检测',
      '帧同步'
    ],
    protocols: ['Ethernet', 'PPP', 'HDLC', 'Frame Relay', 'ATM', 'ARP'],
    pdu: '帧 (Frame)'
  },
  {
    id: 'physical',
    name: '物理层',
    color: 0xF4B400,
    height: 1,
    description: '传输原始比特流',
    functions: [
      '比特传输',
      '物理介质规范',
      '电气/光学信号转换',
      '传输速率控制'
    ],
    protocols: ['RS-232', 'RS-449', 'V.35', 'V.24', 'RJ45', 'Ethernet物理层'],
    pdu: '比特 (Bit)'
  }
];

// TCP/IP四层模型
export const TCPIPLayers = [
  {
    id: 'application',
    name: '应用层',
    color: 0x4285F4,
    height: 1.5,
    description: '包含所有高层协议',
    functions: [
      '提供用户接口',
      '数据格式转换',
      '会话管理',
      '数据表示'
    ],
    protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'DHCP', 'Telnet', 'SSH', 'SNMP'],
    pdu: '数据 (Data)'
  },
  {
    id: 'transport',
    name: '传输层',
    color: 0xDB4437,
    height: 1,
    description: '提供端到端的连接服务',
    functions: [
      '分段和重组',
      '连接控制',
      '流量控制',
      '错误控制'
    ],
    protocols: ['TCP', 'UDP', 'SCTP'],
    pdu: '段 (Segment) / 数据报 (Datagram)'
  },
  {
    id: 'internet',
    name: '互联网层',
    color: 0x0F9D58,
    height: 1,
    description: '处理数据包路由',
    functions: [
      '逻辑寻址',
      '路由选择',
      '路径确定',
      '数据包转发'
    ],
    protocols: ['IP', 'ICMP', 'IGMP', 'IPsec', 'OSPF', 'BGP'],
    pdu: '数据包 (Packet)'
  },
  {
    id: 'link',
    name: '网络接口层',
    color: 0xF4B400,
    height: 1.5,
    description: '处理物理网络的访问',
    functions: [
      '物理寻址',
      '媒体访问控制',
      '信号编码',
      '物理传输'
    ],
    protocols: ['Ethernet', 'PPP', 'HDLC', 'Frame Relay', 'ATM', 'ARP', 'MAC', 'LLC'],
    pdu: '帧 (Frame) / 比特 (Bit)'
  }
];
