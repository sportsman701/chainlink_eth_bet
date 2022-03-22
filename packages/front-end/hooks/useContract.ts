import {useMemo} from "react";
import {ethers} from 'ethers'
import etherBetSCJson from "../abi/ChainlinkEtherBet.json";
import useActiveWeb3React from "./useActiveWeb3React";
import {CHAIN_PARAMS} from "../config/constants";

export const useEtherBetContract = () => {
    const {library, chainId} = useActiveWeb3React()
    return useMemo(() => {
        const signerOrProvider = library?.getSigner() ?? new ethers.providers.StaticJsonRpcProvider(CHAIN_PARAMS[chainId].rpcUrls[0]);
        console.log('contract address', etherBetSCJson.address, signerOrProvider);
        return new ethers.Contract(etherBetSCJson.address, etherBetSCJson.abi, signerOrProvider);
    }, [library]);
}