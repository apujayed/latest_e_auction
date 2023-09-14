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
            const AuctionRecords = await pb.collection('auctions').getFullList({
                sort: '-created',
            });
            if (AuctionRecords.length > 0) {                set_auction_record(AuctionRecords[0])
                if(AuctionRecords[0].Paused.length !== 0 ){
                    set_paused(true)
                }
            }
            const CatalogRecord = await pb.collection('catalog').getFullList({
            });
            
            // set_all_catalog(CatalogRecord)
            let filtered_catalog = []
            CatalogRecord.map((content) => {
                if (content.Season === EligibilityRecord[0].Season && content.Sale_number === parseInt(EligibilityRecord[0].Sale_Number)) {
                    filtered_catalog.push(content)
                }
            })
            set_catalog(filtered_catalog)
        })()
    }, [])
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
    useEffect(()=>{
        (async()=>{
            const filtered_auction_info = []
            const Auction_Info = await pb.collection('auction_info').getFullList({
                sort: '-created'
            });
            Auction_Info.map((content)=>{
                content.bidders.map((content2)=>{
                    if(content2 === pb.authStore.model.id){
                        filtered_auction_info.push(content.catalog)
                    }
                })
            })
            const CatalogRecord = await pb.collection('catalog').getFullList({
                sort: '-created',
            });
            let filtered_catalog = []
            CatalogRecord.map((content) => {
                filtered_auction_info.map((content2)=>{
                    if(content.id === content2){
                        filtered_catalog.push(content)
                    } 
                })
            })
            set_all_catalog(filtered_catalog)
        })()
    },[])
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
                    const price_m = price_max ? price_max + 1 : offer_price + 1;
                    const data = {
                        "price_max": price_m,
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
                const price_m = price_max ? price_max + 1 : offer_price + 1;
                const data = {
                    "catalog": catalog_id,
                    "price_max": price_m,
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
    return (
        <div className="max-w-lg mx-auto mt-12 px-4">
            {paused ? <div className="p-4 mt-12 bg-yellow-400 text-lg rounded-lg text-white">Auction is now paused!</div>: <div>
            {has_completed ? <div className="p-4 mt-12 bg-green-400 text-lg rounded-lg text-white">Auction has campleted!</div> : <div className='max-w-lg mx-auto mt-12 px-4'>
                <Timer completed={set_completed} auction_record={auction_record} />
                <Details set_price_max={set_price_max} set_input_default={set_input_default} set_catalog_id={set_catalog_id} set_offer_price={set_offer_price} catalog={catalog} auction_record={auction_record} />

            </div>}
                </div>}
        </div>
    )
}

export default BidderDashboard;
