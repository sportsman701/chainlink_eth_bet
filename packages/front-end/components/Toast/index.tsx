import {toast as alert} from "react-toastify";
import {Stack, Typography} from "@mui/material";

const styles = {
    successTitle: {
        color: "#0B4124",
        fontSize: "14px",
        fontWeight: "600"
    },
    successDescription: {
        color: "#166C3D",
        fontSize: "12px",
        fontWeight: "600"
    },
    errorTitle: {
        color: "#CC0136",
        fontSize: "14px",
        fontWeight: "600"
    },
    errorDescription: {
        color: "#435475",
        fontSize: "12px",
        fontWeight: "600"
    },
}

export function showToast(success: string, title: string, description: string, extra: null | JSX.Element = null) {
    switch (success) {
        case "success":
            alert(
                <Stack direction={"column"} justifyContent={"start"} alignItems={"start"}>
                    <Typography component={"span"} variant={"inherit"}
                                sx={styles.successTitle}>{title}</Typography>
                    <Typography component={"span"} variant={"inherit"}
                                sx={styles.successDescription}>{description}</Typography>
                    {extra != null ? extra : ''}
                </Stack>,
                {
                    autoClose: 5000,
                    type: 'success'
                }
            );
            break;
        case "error":
            alert(
                <Stack direction={"column"} justifyContent={"start"} alignItems={"start"}>
                    <Typography component={"span"} variant={"inherit"}
                                sx={styles.errorTitle}>{title}</Typography>
                    <Typography component={"span"} variant={"inherit"}
                                sx={styles.errorDescription}>{description}</Typography>
                    {extra != null ? extra : ''}
                </Stack>,
                {
                    autoClose: 5000,
                    type: 'error'
                }
            );
            break;
    }

}
