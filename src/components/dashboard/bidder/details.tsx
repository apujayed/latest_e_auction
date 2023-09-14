// @ts-nocheck
import React, { useEffect, useState } from "react";
import { TbMessage2 } from "react-icons/tb";
import CurrentCataloug from "./currentCatalog";
import PreviousCataloug from './previousCatalog';

function Details({ auction_record, catalog, set_offer_price, set_catalog_id, set_input_default, set_price_max }) {
  const [message, set_message] = useState('');
  const [minutes_passed, set_minutes_passed] = useState();
  const [current_catalog, set_current_catalog] = useState();
  const [previous_catalog, set_previous_catalog] = useState();

  useEffect(() => {
    set_current_catalog(catalog[minutes_passed])
    set_previous_catalog(catalog[minutes_passed - 1])
  }, [catalog]);




  useEffect(() => {
    let intervalId;
  
    const fetchCurrentTime = async () => {
      try {
        const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/GMT+6");
        const data = await response.json();
        const currentTime = data.unixtime;
        const currentTimenew = currentTime*1000;
        

        return currentTimenew;
      } catch (error) {
        console.error("Error fetching current time:", error);
        return null;
      }
    };
    if (auction_record !== undefined) {
      set_message(auction_record.Message)
      const startTime = new Date(auction_record.Start).getTime();
      const updateTime  = async () => {
     
        
      const currentTime = await fetchCurrentTime();
 
        const timeDifferenceMs = currentTime - startTime;
       
        
        const minutes = Math.floor(timeDifferenceMs / (1000 * 60));
        set_minutes_passed(minutes);
      };

      updateTime(); // Update time immediately

      intervalId = setInterval(updateTime, 1000); // Update time every 1 second
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [auction_record]);

  useEffect(() => {
    if (minutes_passed === undefined) {
      set_current_catalog(catalog[0])
    } else {
      set_current_catalog(catalog[minutes_passed])
      set_previous_catalog(catalog[minutes_passed - 1])
    }
  }, [minutes_passed]);

  return (
    <div className="bg-black text-white rounded-lg my-4 flex justify-center flex-col font-semibold">
      <div className="bg-white rounded-lg p-4 flex items-start text-black mb-4">
        <div className="text-2xl text-black/50 mr-2"><TbMessage2 /> </div>
        {message}
      </div>
      <CurrentCataloug set_price_max={set_price_max} set_input_default={set_input_default} set_catalog_id={set_catalog_id} set_offer_price={set_offer_price} current_catalog={current_catalog} />
      <div className='h-2'></div>
      {previous_catalog ? <div className="bg-white text-black p-4 rounded-lg">
        <PreviousCataloug current_catalog={previous_catalog} />
      </div> : null}
      <div className='h-2'></div>
    </div>
  );
}

export default Details;
