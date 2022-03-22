import {useCallback} from "react";
import {UnsupportedChainIdError, useWeb3React} from "@web3-react/core";
import {InjectedConnector} from '@web3-react/injected-connector'
import {CHAIN_ID, CHAIN_PARAMS} from "../config/constants";
import {showToast} from "../components/Toast";

const injected = new InjectedConnector({
    supportedChainIds: [
        CHAIN_ID.POLYGON,
        CHAIN_ID.MUMBAI
    ],
})

interface WindowChain {
    ethereum?: {
        isMetaMask?: true
        request: (...args: any[]) => void
    }
    web3?: any
}

const useAuth = () => {
    const {activate, chainId, deactivate} = useWeb3React();
    const login = useCallback(() => {
        activate(injected, async (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
                const provider = (window as WindowChain).ethereum
                if (provider) {
                    try {
                        const _chainId = chainId || CHAIN_ID.MUMBAI;
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [CHAIN_PARAMS[_chainId]],
                        })
                        activate(injected);
                    } catch (error) {
                        console.warn(error)
                        return false
                    }
                } else {
                    console.warn("Can't setup the Polygon network on metamask because window.ethereum is undefined")
                    return false
                }
            } else {
                showToast("error", error.name, error.message);
            }
        })
    }, [activate, chainId])

    return { login, logout: deactivate }
}

export default useAuth