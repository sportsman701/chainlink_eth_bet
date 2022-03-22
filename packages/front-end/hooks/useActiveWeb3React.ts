import {useEffect, useRef, useState} from "react";
import {useWeb3React} from '@web3-react/core'

const useActiveWeb3React = () => {
  const { library, chainId, ...web3React } = useWeb3React()
  const ref = useRef(library)
  const [provider, setProvider] = useState(library)

  useEffect(() => {
    if (library !== ref.current) {
      setProvider(library)
      ref.current = library
    }
  }, [library])

  return { library: provider, chainId: chainId ?? parseInt(process.env.REACT_APP_CHAIN_ID ?? '80001', 10), ...web3React }
}

export default useActiveWeb3React
