// @ts-nocheck
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import moment from "moment";

import { AiOutlineMessage } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { BsFillPlayCircleFill, BsLayersHalf, BsStopCircleFill } from "react-icons/bs";

import Button from "../../button/button";
import Input from "../../input/input";

import { serverURL,secretKey } from '../../../config';
import Details from "./details";
import Timer from "./timer";
import { toast } from "react-hot-toast";
import decryptData from "../../../security/decryption";
import AllLot from "./AllLot";

const pb = new PocketBase(serverURL);
pb.autoCancellation(false)

function BrokerDashboard() {
    const [eligibility, set_eligibility] = useState();
    const [catalog, set_catalog] = useState([]);
    // const [broker, set_broker] = useState('')
    const [season, set_season] = useState('')
    const [message, set_message] = useState('')
    const [paused, set_paused]  = useState(false)
    const [all_catalog,set_all_catalog] = useState([])
    // const [auc_catalog, set_auc_catalog] = useState([])
    // real-time update
    const [all_lot, set_all_lot] = useState(false)
    const [sale_number, set_sale_number] = useState(0)
    const [auction_record, set_auction_record] = useState()
    const [auction_id, set_auction_id] = useState()
    const [has_completed, set_completed] = useState(false)
    const [auc_c, set_auc_c] = useState(false)
    // let filtered_catalog =[]
    // Subscribe to changes in any Eligibility record
    pb.collection('Eligibility').subscribe('*', function (e) {
        window.location.reload()
    });
    useEffect(() => {
        (async () => {
            const EligibilityRecord = await pb.collection('Eligibility').getFullList({
                sort: '-created',
            });
            let profile_data = decryptData(`${secretKey}`,'profile');
            // console.log(EligibilityRecord[0].Profile,pb.authStore.model.id)
            if(EligibilityRecord[0].Profile === profile_data[0].id){
                set_auc_c(EligibilityRecord[0].Completed)
                set_eligibility(true)
                set_eligibility(EligibilityRecord[0])
                    set_season(EligibilityRecord[0].Season)
                    set_sale_number(EligibilityRecord[0].Sale_Number)
            }

            const AuctionRecords = await pb.collection('auctions').getFullList({
                sort: '-created',
            });
            if (AuctionRecords.length > 0) {
                set_auction_record(AuctionRecords[0])
                set_auction_id(AuctionRecords[0].id)
                if(AuctionRecords[0].Paused.length > 0){
                    set_paused(true)
                }
                // console.log(AuctionRecords)
            }
            const CatalogRecord = await pb.collection('catalog').getFullList({
                filter:`brokersID="${pb.authStore.model.id}"`
            });
            set_all_catalog(CatalogRecord)
            let filtered_catalog =[]
            CatalogRecord.map((content)=>{
                if(content.Season === EligibilityRecord[0].Season && content.Sale_number === parseInt(EligibilityRecord[0].Sale_Number)){
                    filtered_catalog.push(content)
                }
            })
            set_catalog(filtered_catalog)
            // set_auc_catalog()
            const brokerRecord: any = localStorage.getItem('profiles')
            const parsedBrokerRecord = JSON.parse(brokerRecord);
            // set_broker(parsedBrokerRecord.Company_name);
        })()

    }, [])

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
  
  
      
    const start_bid = () => {
        (async () => {
            const currentTime = await fetchCurrentTime();
            const eligibility_record = await pb.collection('Eligibility').getFullList({
                sort: '-created',
            });
            if (!eligibility_record[0].Completed) {
                if (auction_record === undefined) {
                    let catalouge_array = [];
                    const date = new Date(currentTime);

                    let startDate =date.toISOString(); // Get the current date and time in ISO format
             
                    catalog.map((content) => {
                        catalouge_array.push(content.id);
                    });
                    const data = {
                        "Message": "Auction has just started...",
                        "catalougs": catalouge_array,
                        "broker": pb.authStore.model.id,
                        "Start": startDate, // Use the formatted date and time here
                        "Paused": ""
                    };
                    try {
                        (async () => {
                            await pb.collection('auctions').create(data);
                            const data2 = {
                                "Completed": true
                            };
                            await pb.collection('Eligibility').update(`${eligibility.id}`, data2);
                            toast("Your catalogs are now active");
                            window.location.reload();
                        })();
                    }
                    catch (error) {
                        toast.error(error.message);
                    }
                }
                else {
                    let catalouge_array = [];
                    const date = new Date(currentTime);

                    let startDate =date.toISOString();  // Get the current date and time in ISO format
                    catalog.map((content) => {
                        catalouge_array.push(content.id);
                    });
    
                    const data_up = {
                        "Message": "Auction has just started...",
                        "catalougs": catalouge_array,
                        "broker": pb.authStore.model.id,
                        "Start": startDate, // Use the formatted date and time here
                        "Paused": ""
                    };
                    try {
                        (async () => {
                            await pb.collection('auctions').update(`${auction_id}`, data_up);
                            const data2 = {
                                "Completed": true
                            };
                            await pb.collection('Eligibility').update(`${eligibility.id}`, data2);
                            toast("Your catalogs are now active");
                            window.location.reload();
                        })();
                    }
                    catch (error) {
                        toast.error(error.message);
                    }
                }
            }
            else {
                set_auc_c(true);
            }
        })();
    };
    
    

    const stop_bid = () => {
        if (auction_record !== undefined && auction_record.Paused.length === 0) {
            (async () => {
                const currentTime = await fetchCurrentTime();
                const date = new Date(currentTime);
    
                let startDate = date.toISOString();
                const data = {
                    "Paused": startDate
                }
                try {
                    await pb.collection('auctions').update(`${auction_id}`, data);
                    set_paused(true);
                    toast.success('Your catalog is now paused');
                } catch (error) {
                    toast.error(error.message);
                }
            })();
        } else {
            (async () => {
               
                const startTime = new Date(auction_record.Start);
                const pausedTime = new Date(auction_record.Paused);
        
                const timeDifferenceMs = pausedTime - startTime;
                console.log(timeDifferenceMs);
                
                const minutes = Math.floor((timeDifferenceMs / 1000) / 60);
                const seconds = Math.floor((timeDifferenceMs / 1000) % 60);
        
              
                const inittime = await fetchCurrentTime();
                const currentTime = new Date(inittime);
    
        
        
                // Subtract minutes and seconds from the existing time
                currentTime.setMinutes(currentTime.getMinutes() - minutes);
                currentTime.setSeconds(currentTime.getSeconds() - seconds);
        
                // Format and display the modified time
                const formattedTime = currentTime.toISOString();
                console.log(formattedTime);
                
        
    
                const data = {
                    "Paused": "",
                    "Start": formattedTime
                }
                try {
                    await pb.collection('auctions').update(`${auction_id}`, data);
                    set_paused(false);
                    toast.success('Your catalog is now active');
                } catch (error) {
                    toast.error(error.message);
                }
            })();



           
            // (async () => {
            //     const data = {
            //         "Paused": "",
            //         "Start": formattedTime
            //     }
            //     try {
            //         await pb.collection('auctions').update(`${auction_id}`, data);
            //         set_paused(false);
            //         toast.success('Your catalog is now active');
            //     } catch (error) {
            //         toast.error(error.message);
            //     }
            // })();
        }
    }
    


    const send_message = (event) => {
        event.preventDefault()
        if (auction_id) {
            (async () => {
                const data = {
                    "Message": message
                }
                try {
                    await pb.collection('auctions').update(`${auction_id}`, data);
                    toast.success('Message send successfully!')
                }
                catch (error) {
                    toast.error(error.message)
                }
            })()
        }
    }

    pb.collection('auctions').subscribe(`${auction_id}`, function (e) {
        set_auction_record(e.record)
    });

    
    return (
        <>
        <div className="max-w-lg mt-2 px-4 mx-auto">
           
      
            {eligibility ? <>
<div className={`flex justify-end`}>
<div className="w-72 flex">
                   
                </div>
            </div>
            <div className="flex flex-row  bg-black/10 rounded-lg my-4  p-4 justify-center font-semibold">
        <div className="w-60  ">
        <p>
          <span class="text-black/50 my-px">Sale  : </span> {sale_number}
        </p>
        <p>
          <span class="text-black/50 my-px">Season : </span> {season}
        </p>
        <p>
          <span class="text-black/50 my-px">Total catalog : </span> {catalog.length}
        </p>
        <p>
          <span class="text-black/50 my-px">Broker :</span>
        </p>
        </div>
        <div className="w-40  flex flex-col  justify-center items-center">
          <div className="flex flex-row gap-2 justify-center items-center w-full">
          
          {!auc_c ? <div onClick={start_bid} className="w-28">
                    <Button name="Start" type='submit' icon={BsFillPlayCircleFill} />
                    </div> : null}

                 
                    {has_completed ? null :                     <div onClick={stop_bid} className="w-28">
                       <Button name={paused ? 'Resume' : 'Pause'} type='submit' icon={BsStopCircleFill} /> 
                    
                    </div>}

          </div>
          <div onClick={(()=>{set_all_lot(!all_lot)})} className="w-28">
                    <Button name="All Lot" type='submit' icon={BsLayersHalf} />
                </div>
        </div>
      </div>
            
            </> :
             <div className="bg-black h-32 rounded-lg max-w-lg my-4 p-4 text-white text-xl flex text-center items-center justify-center">
                You are not eligable for e-auction Or re-load this page 
                </div>}
                {all_lot ?<AllLot set_all_lot={set_all_lot} catalog={all_catalog}/>:null }
            {!has_completed ? <> <form onSubmit={send_message}>
                <Input
                    istitle={false}
                    title="Type your message here"
                    type="text"
                    placeholder="Your message here..."
                    handle_input_change={((e) => {
                        set_message(e.target.value)
                    })}
                    icon={AiOutlineMessage}
                />
             
              <div className="w-full h-full">
              <Button name="Send" type='submit' icon={IoSend} />
              </div>
            </form>
            <div className=" bg-black text-white rounded-lg my-4 flex p-4 justify-center flex-col font-semibold">
            <Details catalog={catalog} auction_record={auction_record} />
            <Timer completed={set_completed} auction_record={auction_record} />
          
            </div>
            </>:<div></div>}

        </div> 
        </>
    )
}

export default BrokerDashboard;
