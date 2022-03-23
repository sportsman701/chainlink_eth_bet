import {useEffect, useState} from "react";
import type {NextPage} from 'next'
import {Box, TextField, Button, Grid, Divider, Typography} from '@mui/material';
import Head from 'next/head'
import styles from '../styles/Home.module.css';
import {useEtherBetContract} from "../hooks/useContract";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import BetterCard, {EtherBet, parseBetterData} from "../components/BetterCard";
import {BigNumber} from "@ethersproject/bignumber";
import {formatWithDecimals} from "../utils/decimal";
import CountDown from "../components/CountDown";

interface BetData {
    betters: EtherBet[];
    tpPrice: BigNumber,
    totalEth: BigNumber,
    depositedEth: BigNumber,
    endTp: Date,
    isWithdrew: boolean
}

const Home: NextPage = () => {
    const etherBetContract = useEtherBetContract();
    const {account} = useActiveWeb3React();

    const [betData, setBetData] = useState<BetData | null>(null);
    const [lastETHPrice, setLastETHPrice] = useState<BigNumber | null>(null);


    useEffect(() => {
        const fetchEthPrice = async () => {
            const [price, timeStamp]: Array<BigNumber> = await etherBetContract.getLatestPrice();
            setLastETHPrice(price.mul(BigNumber.from(1e10)));
        }
        fetchEthPrice();

        const updateBetters = async () => {
            const data1 = await etherBetContract.getBetterData(0);
            const data2 = await etherBetContract.getBetterData(1);
            const tpPrice = await etherBetContract.tpPrice();
            const totalEth = await etherBetContract.totalEth();
            const depositedEth = await etherBetContract.depositedEth();
            const endTp = await etherBetContract.endTp();
            const isWithdrew = await etherBetContract.isWithdrew();
            setBetData({
                betters: [parseBetterData(data1), parseBetterData(data2)],
                tpPrice: tpPrice,
                totalEth: totalEth,
                depositedEth: depositedEth,
                endTp: new Date(endTp.toNumber() * 1000),
                isWithdrew: isWithdrew
            });
        };

        etherBetContract.on('Deposit', async function(_){
            console.log('Deposit Event');
            updateBetters();
        });
        etherBetContract.on('Withdraw', async function(_){
            console.log('Withdraw Event');
            updateBetters();
        });

        updateBetters();
        console.log('effect');
    }, [account, etherBetContract]);

    const targetDate = betData?.endTp ? (betData.endTp.getFullYear() + ':' + (betData.endTp.getMonth() + 1) + ':' + betData.endTp.getDate()) + ' 00:00:00' : ' - ';
    const initSecCounter = (betData?.endTp && betData.endTp.getTime() > new Date().getTime()) ? (betData.endTp.getTime() - new Date().getTime()) / 1000 : 0;

    console.log('initSec', initSecCounter);
    return (
        <div className={styles.container}>
            <Head>
                <title>Ether Bet</title>
                <meta name="description" content="ETH Betting system using Chainlink"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to ETH Bet
                </h1>
                <p className={styles.description}>
                    Target Date: {targetDate} <br/>
                    Target ETH Price: ${betData?.tpPrice ? formatWithDecimals(betData.tpPrice) : ' -'}
                </p>
                <h2 className="current-eth-price">
                    Current ETH Price: ${lastETHPrice ? formatWithDecimals(lastETHPrice) : ' - '}
                </h2>

                <CountDown initSec={initSecCounter}/>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 2,
                    }}
                >
                    <Typography variant="h5" color="text.secondary">
                        Total Betting Amount:
                    </Typography>
                    <Typography component="h2" variant="h3" color="text.primary" className="total-eth-amount">
                        {betData?.totalEth ? formatWithDecimals(betData.totalEth) : '-'}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        MATIC
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 2,
                    }}
                >
                    <Typography variant="h5" color="text.secondary">
                        Deposited Amount:
                    </Typography>
                    <Typography component="h2" variant="h3" color="text.primary">
                        {betData?.depositedEth ? formatWithDecimals(betData.depositedEth) : '-'}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        MATIC
                    </Typography>
                </Box>

                <Divider variant="middle"/>
                {/* Cards */}
                <Box
                    sx={{
                        m: 2,
                        maxWidth: '100%'
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <BetterCard index={0} better={betData?.betters[0] ?? null} tpPrice={betData?.tpPrice ?? null} endTp={betData?.endTp ?? null}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <BetterCard index={1} better={betData?.betters[1] ?? null} tpPrice={betData?.tpPrice ?? null} endTp={betData?.endTp ?? null}/>
                        </Grid>
                    </Grid>
                </Box>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Created by Hosokawa Zen
                </a>
            </footer>
        </div>
    )
}

export default Home
