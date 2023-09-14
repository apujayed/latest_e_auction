// @ts-nocheck
import { useEffect, useState } from "react";

function Timer({ auction_record, completed }) {
  const [time, setTime] = useState('00');
  const [minute_pass, set_minute_pass] = useState('00');
  const [server_time, setServerTime] = useState('00');
  
  useEffect(() => {
    let intervalId;
    
    const fetchCurrentTime = async () => {
      try {
        const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/GMT+6");
        const data = await response.json();
        const currentTime = data.unixtime;
        const currentTimenew = currentTime*1000;
        
        setServerTime(data.datetime.toString());
        return currentTimenew;
      } catch (error) {
        console.error("Error fetching current time:", error);
        return null;
      }
    };
    
    const updateTimer = async () => {
      const startTime = new Date(auction_record.Start).getTime();
      // console.log(startTime);
      
      const currentTime = await fetchCurrentTime();
      
      if (currentTime !== null) {
        const timeDifferenceMs = currentTime - startTime;
        const minutes = Math.floor(timeDifferenceMs / (1000 * 60));
        const seconds = Math.floor((timeDifferenceMs / 1000) % 60);
        set_minute_pass(minutes)
        if (auction_record.Paused.length === 0) {
          setTime(60 - seconds);
          
          if (auction_record.catalougs.length <= minutes) {
            completed(true);
          } else {
            completed(false);
          }
        }
        
        if (auction_record.Paused.length !== 0) {
          const pausedTime = new Date(auction_record.Paused).getTime();
          
          
          const timeDifferenceMs = pausedTime - startTime;
          const seconds = Math.floor((timeDifferenceMs / 1000) % 60);
          
          setTime(60 - seconds);
        }
      }
    };
    
    updateTimer();
    intervalId = setInterval(updateTimer, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [auction_record]);

  return (
    <>
    <div className="text-3xl text-center">00:{time}</div>
    <p>{server_time}</p>
    <p>{minute_pass}</p>
    </>
  );
}

export default Timer;
