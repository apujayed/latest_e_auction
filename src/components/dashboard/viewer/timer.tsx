// @ts-nocheck
import moment from "moment";
import { useEffect, useState } from "react";
function Timer({ auction_record,completed}) {
    const [time, setTime] = useState('00');
    useEffect(() => {
        let intervalId;
        if (auction_record !== undefined) {
            const startTime = auction_record.Start;
            const specificTime = moment(startTime, 'MMMM Do YYYY, h:mm:ss a');
            const updateTime = () => {
                const currentTime = moment();
                const timeDifferenceMs = currentTime.diff(specificTime);
                const minutes = Math.floor(timeDifferenceMs / (1000 * 60));
                const seconds = Math.floor((timeDifferenceMs / 1000) % 60);
                if(auction_record.Paused.length ===0){
                    setTime(60 - seconds);
                    if(auction_record.catalougs.length<=minutes){
                    
                        completed(true)
                    }else{
                        completed(false)
                    }
                    
                }
                if(auction_record.Paused.length !==0){
                    const startTime = moment(`${auction_record.Start}`, 'MMMM Do YYYY, h:mm:ss a');
                    const pausedTime = moment(`${auction_record.Paused}`, 'MMMM Do YYYY, h:mm:ss a');
                    
                    const timeDifferenceMs = pausedTime.diff(startTime);
                    const seconds = Math.floor((timeDifferenceMs / 1000) % 60);
                    
                    setTime(60-seconds)
                }
            };
            updateTime();
            intervalId = setInterval(updateTime, 1000);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [auction_record]);

    return <div className="text-7xl text-center my-8">00:{time}</div>;
}

export default Timer;