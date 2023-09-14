// @ts-nocheck
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import { serverURL } from '../../../config';
const pb = new PocketBase(serverURL);
pb.autoCancellation(false)

function CurrentCataloug({ current_catalog,set_catalog_id,set_offer_price,set_input_default,set_price_max }) {
    const [lot_number, set_lot_number] = useState()
    const [invoice_number, set_invoice_number] = useState()
    const [factory, set_factory] = useState()
    const [grade, set_grade] = useState()
    const [Offer_price, set_Offer_price] = useState()
    const [current_bidder, set_current_bidder] = useState()
    const [current_bidder_name, set_current_bidder_name] = useState()
    const [highest, set_highest] = useState()
    const [auction_info, set_auction_info] = useState()

    useEffect(()=>{
        if(highest !== undefined){
            set_price_max(highest)
        }
    },[highest])
    useEffect(() => {
        if (current_catalog !== undefined) {
            pb.collection('auction_info').subscribe('*', function (e) {
                if (e.record.catalog === current_catalog.id) {
                    set_highest(e.record.price_max)
                    set_current_bidder(e.record.bidder_current)
                }
            });
            set_catalog_id(current_catalog.id)
            set_offer_price(current_catalog.Offer_price)
            set_lot_number(current_catalog.Lot_number)
            set_invoice_number(current_catalog.Invoice)
            set_grade(current_catalog.Grade);
            (async () => {
                try {
                    set_Offer_price(current_catalog.Offer_price)
                    const FactoryRecord = await pb.collection('profiles').getFirstListItem(`id="${current_catalog.Factory}"`, {
                        expand: 'relField1,relField2.subRelField',
                    });
                    set_factory(FactoryRecord.Company_name)
                }
                catch (error) {
                    // 
                }
                // console.log()
                const record = await pb.collection('auction_info').getFirstListItem(`id="${current_catalog.id}"`, {
                    expand: 'relField1,relField2.subRelField',
                });
                if (record) {
                    set_highest(record.price_max)
                    set_input_default(record.price_max)
                    const record2 = await pb.collection('users').
                        getFirstListItem(`id="${record.bidder_current}"`);
                    if (record2) {
                        set_current_bidder(record2.username)
                    }
                }
                else{
                    set_highest('')
                }
            })()
        }
    }, [current_catalog])
    useEffect(()=>{
        set_current_bidder(undefined) 
        set_highest(undefined)
    },[current_catalog])
    useEffect(() => {
        (async () => {
            const record = await pb.collection('users').getFirstListItem(`id="${current_bidder}"`, {
                expand: 'relField1,relField2.subRelField',
            });
            if (record) {
                set_current_bidder_name(record.username)
            }
        })()

    }, [current_bidder])
    useEffect(()=>{
        if(current_catalog !== undefined){
            (async()=>{
                try{
                    const record = await pb.collection('auction_info').getFirstListItem(`catalog="${current_catalog.id}"`, {
                        expand: 'relField1,relField2.subRelField',
                    });
                    if(record){
                        set_highest(record.price_max)
                    }
                }
                catch(error){
                    console.log(error)
                }
            })()
        }
    },[current_catalog])
    return (
        <>
            <p><span className="text-white/50 my-px">lot number :</span>{lot_number}</p>
            <p><span className="text-white/50 my-px">Invoice number :</span>{invoice_number}</p>
            <p><span className="text-white/50 my-px">Factory :</span> {factory}</p>
            <p><span className="text-white/50 my-px">Grade :</span> {grade}</p>
            <p><span className="text-white/50 my-px">Offer_price :</span>{Offer_price}</p>
            {/* <p><span className="text-white/50 my-px mr-2">Current bidder :</span>{current_bidder_name ? current_bidder_name : '--'}</p> */}
            <p><span className="text-white/50 my-px mr-2">Highest bid:</span>{highest ? highest : '--'}</p>
        </>
    )
}

export default CurrentCataloug;
