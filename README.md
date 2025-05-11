# Whistle Finance

<p align="center">
  <img src="/public/images/whistle-logo.svg" alt="Whistle Finance Logo" width="200" />
</p>

## Deployed Smart Contracts at westend asset hub (polkadot0

- **Loan Storage Contract**: [0x96dfc97779d32f09988D6490159B4EcF4b31aBeE](https://assethub-westend.subscan.io/account/0x96dfc97779d32f09988d6490159b4ecf4b31abee)
- **Whistle Loan Contract**: [0x62f5477Da2559EcA1Bc2412da40a3f6Bc40062d9](https://assethub-westend.subscan.io/account/0x62f5477da2559eca1bc2412da40a3f6bc40062d9)

## Decentralized Microfinance Platform on Westend Asset Hub (Polkadot)

Whistle Finance is a decentralized microfinance platform that enables communities to create self-sustaining lending ecosystems powered by trust and blockchain technology. Built on the Westend Asset Hub (Polkadot), it provides a secure and transparent way for community members to request loans, stake funds, and participate in community governance.

## 🌟 Features

- **Community-Based Lending**: Join existing communities or create your own lending ecosystem
- **Loan Requests**: Submit loan requests with purpose, amount, and repayment terms
- **Staking Mechanism**: Stake funds to support loan requests from trusted community members
- **On-Chain Activities**: View and track all blockchain transactions within your community
- **Mobile Wallet Support**: Full compatibility with MetaMask mobile and other wallets
- **Interactive Dashboard**: Visualize community statistics, loan history, and more

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4, Framer Motion for animations
- **Blockchain**: Westend Asset Hub (Polkadot), ethers.js, wagmi
- **Data Visualization**: ApexCharts for interactive graphs
- **Smart Contracts**: Solidity contracts for loan management and staking

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Basic understanding of blockchain concepts

## 🚀 Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/whistle-finance.git
   cd whistle-finance
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Mobile Wallet Compatibility

Whistle Finance is fully compatible with mobile wallets, including MetaMask Mobile. We've implemented special transaction handling to ensure compatibility with different wallet types:

- **Transaction Utilities**: Custom utilities to create MetaMask-compatible transaction configurations
- **Legacy Transaction Support**: Fallback to legacy transaction types when needed
- **Gas Estimation**: Automatic gas estimation for smooth transaction processing

## 🏗️ Project Structure

```
whistle-finance/
├── contracts/                # Smart contract source files
│   ├──LoanStorage.sol    # Main staking contract
│   └── WhistleLoan.sol            # Token contract
├── public/                   # Static assets
│   ├── animations/           # Lottie animations
│   ├── images/               # Images and icons
│   └── videos/               # Video content including ads
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── community/        # Community dashboard pages
│   │   ├── connect/          # Wallet connection page
│   │   ├── lend/             # Lending/staking page
│   │   ├── my-activities/    # User activity tracking
│   │   ├── my-communities/   # Community management
│   │   └── request/          # Loan request page
│   ├── components/           # Reusable React components
│   │   ├── AdVideo.tsx       # Advertisement video component
│   │   ├── DynamicWidgetContainer.tsx # Dynamic SDK integration
│   │   └── WalletProvider.tsx # Wallet connection provider
│   ├── config/               # Configuration files
│   │   ├── chains.ts         # Blockchain network configs
│   │   └── WS_Abi.ts         # Contract ABIs
│   ├── hooks/                # Custom React hooks
│   └── utils/                # Utility functions
│       └── transactionUtils.ts # Transaction handling utilities
└── package.json             # Project dependencies
```

## 🔄 Key Workflows

### Connecting a Wallet

We use MetaMask for wallet connections, which provides a seamless experience across devices:

1. Navigate to the Connect page
2. Choose your preferred wallet (MetaMask)
3. Approve the connection request in your wallet
4. You'll be automatically redirected to the My Communities page

### Requesting a Loan

1. Navigate to the Request page
2. Fill in the loan purpose, amount, and repayment period
3. Submit the request using your connected wallet
4. Track the status of your loan request in the Community dashboard

### Staking for a Loan

1. Navigate to the Lend page
2. Browse available loan requests
3. Select a request to support
4. Stake funds using your connected wallet
5. Monitor your staking activity in the My Activities page

## 🧪 Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

## 📦 Deployment

The application can be deployed to various platforms:

### Build for Production

```bash
npm run build
# or
yarn build
```


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework
- [Wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [Polkadot](https://polkadot.network/) - Blockchain platform
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

---

<p align="center">Built with ❤️ by the Whistle Finance Team</p>
