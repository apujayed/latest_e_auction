// @ts-nocheck
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import { serverURL } from '../../../config';
const pb = new PocketBase(serverURL);
pb.autoCancellation(false)

function PreviousCataloug({ current_catalog }) {
    const [lot_number, set_lot_number] = useState()
    const [invoice_number, set_invoice_number] = useState()
    const [factory, set_factory] = useState()
    const [status, set_status] = useState()

    useEffect(()=>{
        if(current_catalog !== undefined){
            (async()=>{
                try{
                    const record = await pb.collection('auction_info').getFirstListItem(`catalog="${current_catalog.id}"`, {
                        expand: 'relField1,relField2.subRelField',
                    });
                    if(record){
                        set_status(record.Status)
                    }
                }
                catch(error){
                    console.log(error)
                }
            })()
        }
    },[current_catalog])
    useEffect(()=>{
        if(current_catalog !== undefined){
            set_lot_number(current_catalog.Lot_number)
            set_invoice_number(current_catalog.Invoice)
        }
    },[current_catalog])
    return (
        <>
            <p><span className="text-black/50 my-px">lot number :</span>{lot_number}</p>
            <p><span className="text-black/50 my-px">Invoice number :</span>{invoice_number}</p>
            <p><span className="text-black/50 my-px">Status :</span> {status ? 'Sold' : 'Unsold'}</p>
        </>
    )
}

export default PreviousCataloug;
