import {useEffect, useState} from "react";

const CountDown = (props: any) => {
    const {initSec = 0} = props;
    const [sec, setSecs] = useState(initSec);

    useEffect(() => {
        let counterInterval = setInterval(() => {
            if (sec > 0) {
                setSecs(sec - 1);
            }
            if (sec === 0) {
                clearInterval(counterInterval)
            }
        }, 1000)
        return () => {
            clearInterval(counterInterval);
        };
    });

    useEffect(() => {
        setSecs(initSec);
    }, [initSec]);

    const days = Math.floor(sec / (60 * 60 * 24));
    let divisor_for_next = sec % (60 * 60 * 24);
    const hours = Math.floor(divisor_for_next / (60 * 60));
    divisor_for_next = divisor_for_next % (60 * 60);
    const minutes = Math.floor(divisor_for_next / 60);
    const seconds = Math.ceil(divisor_for_next % 60);

    return (
        <h1 className="time-counter">
            {sec === 0 ? '00:00:00'
                : <>{days > 0 ? `${days} days` : ''} {hours > 9 ? `${hours}` : `0${hours}`}:{minutes > 9 ? `${minutes}` : `0${minutes}`}:{seconds > 9 ? `${seconds}` : `0${seconds}`}</>
            }
        </h1>
    )
}

export default CountDown;