import React from "react";
import {AppBar, Container, Toolbar, Typography, Box, Button} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";

const Header = () => {
    const { login, logout } = useAuth();
    const { account } = useActiveWeb3React();

    const is0x = account?.startsWith("0x");
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    <Box sx={{flexGrow: 1}}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{mr: 2}}
                            className="project-name"
                        >
                            ETH Bet
                        </Typography>
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Button className="connect-wallet-btn" variant="contained" color="info" onClick={() => account? logout(): login()} fullWidth={true}>
                            { !account ? "Connect Wallet" :  ("Disconnect " + account.substring(0, is0x ? 6 : 3) + "..." + account.substring(account.length - (is0x ? 4 : 3)))}
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;