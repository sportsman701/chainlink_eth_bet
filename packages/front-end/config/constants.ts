export const CHAIN_ID = {
    POLYGON: 137,
    //Testnet
    MUMBAI: 80001,
}

export const CHAIN_PARAMS = {
    [CHAIN_ID.POLYGON]: {
        chainId: '0x89',
        chainName: 'Polygon',
        nativeCurrency: {
            name: 'Matic Token',
            symbol: 'MATIC',
            decimals: 18,
        },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com'],
    },
    [CHAIN_ID.MUMBAI]: {
        chainId: '0x13881',
        chainName: 'Mumbai',
        nativeCurrency: {
            name: 'Matic Token',
            symbol: 'MATIC',
            decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    }
}