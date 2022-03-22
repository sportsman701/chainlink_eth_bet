import * as React from 'react';
import {useCallback, useState} from "react";
import {BigNumber} from "@ethersproject/bignumber";
import {Card, CardContent, Typography, Box, Link} from "@mui/material";
import {formatWithDecimals} from "../../utils/decimal";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import {useEtherBetContract} from "../../hooks/useContract";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LoadingButton from '@mui/lab/LoadingButton';
import {showToast} from "../Toast";
import {getPloygonScanLink} from "../../utils/scan";

export type EtherBet = {
    addr: string;
    fundAmt: BigNumber;
    flag: boolean;
    isDeposited: boolean;
}

export function parseBetterData(data: Array<any>) {
    const [addr, fundAmt, flag, isDeposited] = data;
    const bet: EtherBet = {
        addr,
        fundAmt,
        flag,
        isDeposited
    };
    return bet;
}

interface Props {
    index: number;
    better: EtherBet | null;
    tpPrice: BigNumber | null;
    endTp: Date | null;
}

const BetterCard: React.FC<Props> = (props) => {
    const {index, better, tpPrice, endTp} = props;
    const {account} = useActiveWeb3React();
    const etherBetContract = useEtherBetContract();
    const [depositing, setDepositing] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);

    const isSelf = better?.addr && account && better.addr.toLocaleLowerCase() === account.toLocaleLowerCase();
    const isEnd = endTp && endTp.getTime() < new Date().getTime();

    const onDeposit = useCallback(async () => {
        if (better?.fundAmt && isSelf) {
            setDepositing(true);
            try{
                const tx = await etherBetContract.deposit({value: better.fundAmt});
                await tx.wait();
                setDepositing(false);
                showToast("success", "Success", "You betting Fund was deposited successfully",
                    (<div><Link target={"_blank"} href={getPloygonScanLink(tx.hash, 'transaction')}>
                    <Typography variant="subtitle2">
                        View on PolygonScan
                    </Typography>
                    </Link></div>));
            } catch (e) {
                showToast("error", "Failed", "Transaction was failed");
            }
        }
    }, [better, isSelf, etherBetContract]);

    const onWithdraw = useCallback(async () => {
        if (isEnd && isSelf) {
            setWithdrawing(true);
            try{
                const tx = await etherBetContract.withdraw();
                await tx.wait();
                setWithdrawing(false);
                showToast("success", "Success", "Withdraw transaction was executed successfully",
                    (<div><Link target={"_blank"} href={getPloygonScanLink(tx.hash, 'transaction')}>
                        <Typography variant="subtitle2">
                            View on PolygonScan
                        </Typography>
                    </Link></div>));
            } catch (error: any) {
                showToast("error", "Failed", "Transaction was failed");
            }
        }
    }, [isSelf, etherBetContract, isEnd]);

    return (
        <Card sx={{minWidth: 275}} className={"better_" + index}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    Better {index + 1} {isSelf ? ' (You)' : ''}
                </Typography>
                {
                    better && tpPrice &&
                    <Typography sx={{fontSize: 16, mb: 3}} color="text.secondary" className="better-flag">
                        ETH Price will be {better.flag ? 'over' : 'below'} than
                        ${formatWithDecimals(tpPrice)} {better.flag ? <TrendingUpIcon/> : <TrendingDownIcon/>}
                    </Typography>
                }
                <Typography variant="h5" component="div" className="better-address">
                    {better?.addr}
                </Typography>
                <Typography sx={{mb: 2}} color="text.secondary" className="better-amount">
                    Betting: {better ? formatWithDecimals(better.fundAmt) : '-'} MATIC
                </Typography>
                <Typography variant="body2" color={(better?.isDeposited) ? "success.main" : "error.main"}>
                    {(better?.isDeposited) ? 'Deposited' : 'Did not deposit'}
                </Typography>
                {
                    isSelf &&
                    <Box sx={{mt: 4}}>
                        {
                            better?.isDeposited ?
                                <LoadingButton variant="contained" loading={depositing} disabled={!account || !isEnd} onClick={onWithdraw}>Withdraw</LoadingButton>
                                :
                                <LoadingButton variant="contained" loading={depositing} disabled={!account || !!isEnd} onClick={onDeposit}>Deposit</LoadingButton>
                        }
                    </Box>
                }
            </CardContent>
        </Card>
    );
}

export default BetterCard;