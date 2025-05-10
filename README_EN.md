# Tower of Networks: 3D Interactive Architecture Browser

[简体中文](README.md) | [English](README_EN.md)

![Tower of Networks](https://img.shields.io/badge/Tower%20of%20Networks-3D%20Interactive-4285F4)
![Three.js](https://img.shields.io/badge/Three.js-r176-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF)

A Three.js-based 3D interactive network architecture browser for visualizing the OSI seven-layer model and TCP/IP four-layer model, demonstrating the process of data packet encapsulation and decapsulation.

## 📋 Features

- **3D Interactive Network Model**: Displays the OSI seven-layer model and TCP/IP four-layer model in a 3D tower structure
- **Detailed Network Layer Information**: Click on any network layer to view its detailed functions, protocols, and PDU information
- **Data Encapsulation Animation**: Demonstrates how data is encapsulated from the application layer down to the physical layer
- **Data Decapsulation Animation**: Demonstrates how data is decapsulated from the physical layer up to the application layer
- **Fully Interactive Controls**: Rotate, pan, and zoom the 3D view using the mouse
- **Responsive Design**: Adapts to different screen sizes

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0+)
- [npm](https://www.npmjs.com/) (v8.0.0+) or [yarn](https://yarnpkg.com/) (v1.22.0+)

### Installation

1. Clone the repository

```bash
git clone https://github.com/zym9863/tower-of-networks.git
cd tower-of-networks
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🔍 Usage Guide

### Basic Operations

- **Left-click and drag**: Rotate the view
- **Right-click and drag**: Pan the view
- **Scroll wheel**: Zoom the view
- **Click on a network layer**: View detailed information about that layer

### Switch Network Models

- Click the **OSI Seven-Layer Model** button to switch to the OSI model
- Click the **TCP/IP Four-Layer Model** button to switch to the TCP/IP model

### Play Animations

- Click the **Data Encapsulation Animation** button to play the data encapsulation process
- Click the **Data Decapsulation Animation** button to play the data decapsulation process

## 🧩 Project Structure

```
tower-of-networks/
├── src/                    # Source code
│   ├── animations/         # Animation-related code
│   │   ├── EncapsulationAnimation.ts   # Data encapsulation animation
│   │   └── DecapsulationAnimation.ts   # Data decapsulation animation
│   ├── components/         # UI components
│   │   ├── Controls.ts     # Control buttons
│   │   └── InfoPanel.ts    # Information panel
│   ├── models/             # 3D models
│   │   ├── NetworkLayers.ts # Network layer definitions
│   │   └── NetworkTower.ts  # Network tower model
│   ├── main.ts             # Main entry file
│   └── style.css           # Global styles
├── index.html              # HTML entry
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.js          # Vite configuration
```

## 🔧 Technology Stack

- [Three.js](https://threejs.org/) - 3D graphics library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript superset
- [Vite](https://vitejs.dev/) - Modern frontend build tool

## 📚 Network Model Explanation

### OSI Seven-Layer Model

1. **Physical Layer** - Transmits raw bit streams
2. **Data Link Layer** - Provides node-to-node data transfer
3. **Network Layer** - Provides routing and addressing functions
4. **Transport Layer** - Provides end-to-end connection services
5. **Session Layer** - Establishes, manages, and terminates sessions
6. **Presentation Layer** - Handles data formatting, encryption, and compression
7. **Application Layer** - Provides an interface for network services to applications

### TCP/IP Four-Layer Model

1. **Network Interface Layer** - Handles physical network access
2. **Internet Layer** - Handles packet routing
3. **Transport Layer** - Provides end-to-end connection services
4. **Application Layer** - Contains all higher-level protocols

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- The [Three.js](https://threejs.org/) team for their excellent 3D library
- All creators and maintainers of network protocols and standards
