// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import PocketBase from 'pocketbase';

import { BsLayersHalf } from "react-icons/bs";

import Button from "../../button/button";
import Input from "../../input/input";

import { serverURL } from '../../../config';
import Details from "./details";
import Timer from "./timer";
import { toast } from "react-hot-toast";
import AllLot from "./AllLot";
import { RiPriceTag2Line } from "react-icons/ri";
import { HiOutlinePlusCircle } from "react-icons/hi";

const pb = new PocketBase(serverURL);
pb.autoCancellation(false)

function BidderDashboard() {
    const [catalog, set_catalog] = useState([]);
    const [auction_record, set_auction_record] = useState()
    const [has_completed, set_completed] = useState(false)
    const [offer_price, set_offer_price] = useState()
    const [input_default, set_input_default] = useState()
    const [catalog_id, set_catalog_id] = useState()
    const [price_max, set_price_max] = useState()
    const [all_catalog, set_all_catalog] = useState([])
    const [all_lot, set_all_lot] = useState(false)
    const [input_value, set_input_value] = useState()
    const [paused,set_paused] = useState(false)
    const [processing, set_processing] = useState(false)
  
    
  const [season, set_season] = useState('')
  const [sale_number, set_sale_number] = useState(0)
  const [current_broker_name, set_current_broker_name] = useState('')
 
  const [lastActivity, setLastActivity] = useState(Date.now());
  pb.collection('Eligibility').subscribe('*', function (e) {
    window.location.reload()
});
    const formRef = useRef(null);
    // const [input_value_default, set_input_value_default] = useState('')
    useEffect(() => {
        set_input_value('')
        // if (price_max !== undefined) {
        // }
    }, [price_max])
    useEffect(() => {
        (async () => {
            const EligibilityRecord = await pb.collection('Eligibility').getFullList({
                sort: '-created',
            });

            if(EligibilityRecord.length>0){
              set_sale_number(EligibilityRecord[0].Sale_Number)
              set_season(EligibilityRecord[0].Season)
            }
//get current broker name
const get_current_broker = await pb.collection('profiles').getFirstListItem(`id="${EligibilityRecord[0].Profile}"`)
            if(get_current_broker){
set_current_broker_name(get_current_broker.Company_name)
            }

            const AuctionRecords = await pb.collection('auctions').getFullList({
                sort: '-created',
            });
            if (AuctionRecords.length > 0) {
                set_auction_record(AuctionRecords[0])
                if(AuctionRecords[0].Paused.length !== 0 ){
                    set_paused(true)
                }
                
            }
            const UserID = await pb.collection('users').getFirstListItem(`reference="${EligibilityRecord[0].Profile}"`)
          
            const CatalogRecord = await pb.collection('catalog').getFullList({
            });
            let filtered_catalog = []
            CatalogRecord.map((content) => {
                if (content.Season === EligibilityRecord[0].Season && content.Sale_number === parseInt(EligibilityRecord[0].Sale_Number) && UserID.id === content.brokersID) {
                    filtered_catalog.push(content)
                }
            })
            set_all_catalog(filtered_catalog)
            set_catalog(filtered_catalog)
        })()
    }, [])
    const updateCatalog = ()=>{
        set_all_lot(!all_lot)
            (async () => {
                const EligibilityRecord = await pb.collection('Eligibility').getFullList({
                    sort: '-created',
                });
                const AuctionRecords = await pb.collection('auctions').getFullList({
                    sort: '-created',
                });
                if (AuctionRecords.length > 0) {
                    set_auction_record(AuctionRecords[0])
                    if(AuctionRecords[0].Paused.length !== 0 ){
                        set_paused(true)
                    }
                }
                const UserID = await pb.collection('users').getFirstListItem(`reference="${EligibilityRecord[0].Profile}"`)
                const CatalogRecord = await pb.collection('catalog').getFullList({
                });
                let filtered_catalog = []
                CatalogRecord.map((content) => {
                    if (content.Season === EligibilityRecord[0].Season && content.Sale_number === parseInt(EligibilityRecord[0].Sale_Number) && UserID.id === content.brokersID) {
                        filtered_catalog.push(content)
                    }
                })
                set_all_catalog(filtered_catalog)
            })()
    }
    // Subscribe to changes in any auctions record
    pb.collection('auctions').subscribe('*', function (e) {
        set_auction_record(e.record)
        set_completed(false)
        if(e.record.Paused.length !==0){
            set_paused(true)
        }
        else  if(e.record.Paused.length ===0){
            set_paused(false)
        }
    });

    
  // Function to reload the page
  const reloadPage = () => {
    window.location.reload();
  };

  // Function to handle user activity
  const handleActivity = () => {
    setLastActivity(Date.now());
  };

  // Set up activity listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  // Set up focus listener to reload after 10 seconds of inactivity
  useEffect(() => {
    const focusListener = () => {
      if (Date.now() - lastActivity >= 15000) {
        reloadPage();
      }
    };
    
    window.addEventListener('focus', focusListener);

    // Cleanup the focus event listener when the component unmounts
    return () => {
      window.removeEventListener('focus', focusListener);
    };
  }, [lastActivity]);

    // useEffect(()=>{
    //     (async()=>{
    //         const filtered_auction_info = []
    //         const Auction_Info = await pb.collection('auction_info').getFullList({
    //             sort: '-created'
    //         });
    //         Auction_Info.map((content)=>{
    //             content.bidders.map((content2)=>{
    //                 if(content2 === pb.authStore.model.id){
    //                     filtered_auction_info.push(content.catalog)
    //                 }
    //             })
    //         })
    //         const EligibilityRecord = await pb.collection('Eligibility').getFullList({
    //             sort: '-created',
    //         });
            
    //         const UserID = await pb.collection('users').getFirstListItem(`reference="${EligibilityRecord[0].Profile}"`)
    //         // console.log('userID',UserID.reference)
    //         if(UserID.reference){
    //             const CatalogRecord = await pb.collection('catalog').getFullList({
    //                 filter:`brokersID="jyp4qxd5orisn4y"`
    //             });

    //             let filtered_catalog = []
    //             CatalogRecord.map((content) => {
    //                 filtered_auction_info.map((content2)=>{
    //                     if(content.id === content2){
    //                         filtered_catalog.push(content)
    //                     } 
    //                 })
    //             })
    //             set_catalog(filtered_catalog)
    //             // set_all_catalog(filtered_catalog)
    //         }
    //     })()
    // },[])
    // useEffect(()=>{
    //     (async()=>{
    //         const filtered_auction_info = []
    //         const Auction_Info = await pb.collection('auction_info').getFullList({
    //             sort: '-created'
    //         });
    //         Auction_Info.map((content)=>{
    //             content.bidders.map((content2)=>{
    //                 if(content2 === pb.authStore.model.id){
    //                     filtered_auction_info.push(content.catalog)
    //                 }
    //             })
    //         })
    //         const CatalogRecord = await pb.collection('catalog').getFullList({
    //             sort: '-created',
    //         });
    //         let filtered_catalog = []
    //         CatalogRecord.map((content) => {
    //             filtered_auction_info.map((content2)=>{
    //                 if(content.id === content2){
    //                     filtered_catalog.push(content)
    //                 } 
    //             })
    //         })
    //         set_all_catalog(filtered_catalog)
    //     })()
    // },[all_lot])
    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = event.target;
        set_input_value(value)
    };
    const handle_send = (event) => {
        // set_input_value()
        event.preventDefault();
        const minimum_custom_value = price_max ? price_max * 0.4 : offer_price * 0.4;
        const upper_limit = price_max ? price_max + price_max * 0.4 : offer_price + offer_price * 0.4
        const lower_limit = price_max ? price_max - price_max * 0.4 : offer_price - offer_price * 0.4

        if(input_value <= upper_limit && input_value >= lower_limit){
            if(price_max && input_value > price_max){
                    if (formRef.current) {
      formRef.current.reset();
    }
                (async () => {
                    try {
                        const record = await pb.collection('auction_info').getFirstListItem(`catalog="${catalog_id}"`);
                        if (record) {
                            const bidders_array = record.bidders;
                            record.bidders.map((content) => {
                                if (content !== pb.authStore.model.id) {
                                    bidders_array.push(pb.authStore.model.id)
                                }
                            })
                            const status = input_value >= offer_price ? true : false
                            const data = {
                                "price_max": parseInt(input_value),
                                "bidders": bidders_array,
                                "bidder_current": pb.authStore.model.id,
                                "Status": status
        
                            };
                            try {
                                await pb.collection('auction_info').update(`${record.id}`, data);
                                toast('Offer price send')
                            }
                            catch (error) {
                                // 
                            }
                        }
        
                    }
                    catch (error) {
                        const bidders_array = []
                        bidders_array.push(pb.authStore.model.id)
                        const status = input_value >= offer_price ? true : false
                        const data = {
                            "catalog": catalog_id,
                            "price_max": input_value,
                            "bidders": bidders_array,
                            "bidder_current": pb.authStore.model.id,
                            "Status": status
                        };
        
                        try {
                            await pb.collection('auction_info').create(data);
                            toast('Offer price send')
                        }
                        catch (error) {
                            console.log(error)
                            toast('Something went wrong')
                        }
                    }
        
                })()
                
            }
            else if(!price_max){
                    if (formRef.current) {
      formRef.current.reset();
    }
                (async () => {
                    try {
                        const record = await pb.collection('auction_info').getFirstListItem(`catalog="${catalog_id}"`);
                        if (record) {
                            const bidders_array = record.bidders;
                            record.bidders.map((content) => {
                                if (content !== pb.authStore.model.id) {
                                    bidders_array.push(pb.authStore.model.id)
                                }
                            })
                            const status = input_value >= offer_price ? true : false
                            const data = {
                                "price_max": parseInt(input_value),
                                "bidders": bidders_array,
                                "bidder_current": pb.authStore.model.id,
                                "Status": status
        
                            };
                            try {
                                await pb.collection('auction_info').update(`${record.id}`, data);
                                toast('Offer price send')
                            }
                            catch (error) {
                                // 
                            }
                        }
        
                    }
                    catch (error) {
                        const bidders_array = []
                        bidders_array.push(pb.authStore.model.id)
                        const status = input_value >= offer_price ? true : false
                        const data = {
                            "catalog": catalog_id,
                            "price_max": input_value,
                            "bidders": bidders_array,
                            "bidder_current": pb.authStore.model.id,
                            "Status": status
                        };
        
                        try {
                            await pb.collection('auction_info').create(data);
                            toast('Offer price send')
                        }
                        catch (error) {
                            console.log(error)
                            toast('Something went wrong')
                        }
                    }
        
                })()
            }

        }       
        else{
            toast("Custom offer can't be less than current offer and can increase or decrease 40% at most")
        }

    }
    const increase_one = () => {
      (async () => {
          set_processing(true);
          try {
              const record = await pb.collection('auction_info').getFirstListItem(`catalog="${catalog_id}"`);
              if (record) {
                  const bidders_array = record.bidders;
                  record.bidders.map((content) => {
                      if (content !== pb.authStore.model.id) {
                          bidders_array.push(pb.authStore.model.id)
                      }
                  })
                  const price_m = price_max ? price_max + 1 : offer_price + 1;
                  const status = price_m >= offer_price ? true : false;
                  const data = {
                      "price_max": price_m,
                      "bidders": bidders_array,
                      "bidder_current": pb.authStore.model.id,
                      "Status": status

                  };
                  try {
                      await pb.collection('auction_info').update(`${record.id}`, data);
                      // toast('Offer price send')
                      set_processing(false)
                  }
                  catch (error) {
                      // 
                      set_processing(false)
                  }
              }

          }
          catch (error) {
              const bidders_array = []
              bidders_array.push(pb.authStore.model.id)
              const price_m = price_max ? price_max + 1 : offer_price + 1;
              const data = {
                  "catalog": catalog_id,
                  "price_max": price_m,
                  "bidders": bidders_array,
                  "bidder_current": pb.authStore.model.id,
                  "Status": true
              };

              try {
                  await pb.collection('auction_info').create(data);
                  set_processing(false)
                  toast('Offer price send')
              }
              catch (error) {
                  console.log(error)
                  set_processing(false)
                  toast('Something went wrong')
              }
          }
          // set_processing(false)
      })()
  }
  const handle_increase_one =()=>{
  if(!processing){
      increase_one()
  }
  else{
      // toast('Please wait...')
  }
  }
    return (
        <div className="max-w-lg mt-2 px-4 mx-auto">
           
      
          <div className="flex flex-row  bg-black/10 rounded-lg m-4  p-4 justify-center font-semibold">
            <div className="w-60  ">
            <p>
              <span className="text-black/50 my-px">Sale  : </span> {sale_number}
            </p>
            <p>
              <span className="text-black/50 my-px">Season : </span> {season}
            </p>
            <p>
              <span className="text-black/50 my-px">Total catalog : </span> {catalog.length}
            </p>
            <p>
              <span className="text-black/50 my-px">Broker :</span> {current_broker_name}
            </p>
            </div>
            <div className="w-40  flex flex-col  justify-center items-center">
              {/* <div className="flex flex-row gap-2 justify-center items-center w-full">
              <div onClick={updateCatalog} className="w-full">
              <Button name="My " type="submit" icon={BsLayersHalf} />
            </div>
            <div onClick={updateCatalog} className="w-full">
              <Button name="My " type="submit" icon={BsLayersHalf} />
            </div>
              </div> */}
              <div onClick={updateCatalog} className="w-full">
              <Button name="My Lot" type="submit" icon={BsLayersHalf} />
            </div>
            </div>
          </div>
    
          {/* <div className="flex justify-end">
            <div onClick={updateCatalog} className="w-28">
              <Button name="My Lot" type="submit" icon={BsLayersHalf} />
            </div>
          </div> */}
          {all_lot ? (
            <AllLot set_all_lot={set_all_lot} catalog={all_catalog} />
          ) : null}
          {paused ? (
            <div className="p-4 mt-2  m-4  bg-yellow-400 text-lg rounded-lg text-white">
              Auction is now paused!
            </div>
          ) : (
            <div>
              {has_completed ? (
                <div className="p-4 mt-2 m-4  bg-green-400 text-lg rounded-lg text-white">
                  Auction has campleted!
                </div>
              ) : (
                <div className="max-w-lg mx-auto mt-2 px-4">
                      <div className=" bg-black text-white rounded-lg  flex p-4 justify-center flex-col font-semibold">
                 
                  <Details
                    set_price_max={set_price_max}
                    set_input_default={set_input_default}
                    set_catalog_id={set_catalog_id}
                    set_offer_price={set_offer_price}
                    catalog={catalog}
                    auction_record={auction_record}
                  />
                   <Timer
                    completed={set_completed}
                    auction_record={auction_record}
                  />
                    </div>
                  <div className="h-2"></div>
                  <form onSubmit={handle_send} ref={formRef}>
                    <Input
                      title="Custom offer"
                      type="number"
                      defaultValue={input_value}
                      placeholder={"Custom offer here..."}
                      handle_input_change={handleInputChange}
                      icon={RiPriceTag2Line}
                    />
                    <div className="h-2"></div>
    
                    <Button name="Send Offer" type="submit" icon={BsLayersHalf} />
                  </form>
    
                  <div className="text-4xl my-4 select-none flex items-center justify-center text-black hover:text-black/70 cursor-pointer">
                    <div onClick={handle_increase_one}>
                      <HiOutlinePlusCircle />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
}

export default BidderDashboard;
