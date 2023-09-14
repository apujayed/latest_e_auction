// @ts-nocheck
import { useEffect, useState } from "react";
import { secretKey,serverURL } from "../../../config";
import decryptData from "../../../security/decryption";
import PocketBase from 'pocketbase';
import { BsCheckSquareFill } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
const pb = new PocketBase(serverURL);
pb.autoCancellation(false)
function LotCard({data,statusSELECTED,set_sell_data,sell_data}) {
    const [broker_name,set_broker_name] = useState('')
    const [factory,set_factory] = useState('')
    const [warehouse, set_warehouse] = useState('')
    const [price_max, set_price_max] = useState('')
    const [Status,set_status] = useState(false)
    const [not, set_not] = useState(true)
    const [current_bidder, set_current_bidder] = useState('')

    // console.log(statusSELECTED);
    useEffect(()=>{
       

        const factory_record = decryptData(`${secretKey}`,'factories')
        factory_record.map((content)=>{
            if(content.id === data.Factory){
                set_factory(content.Company_name)
            }
        })
        const warehouse_record = decryptData(`${secretKey}`,'warehouses')
        if(warehouse_record){

            warehouse_record.map((content)=>{
                if(content.id === data.Warehose){
                    set_warehouse(content.Company_name)
                }
            })
        }
      
        (async()=>{
            

            
            const record = await pb.collection('auction_info').getFirstListItem(`catalog="${data.id}"`, {
                expand: 'relField1,relField2.subRelField',
            });
            if(record){
               
                
                if(record.bidder_current === pb.authStore.model.id && record.Status === statusSELECTED){
                 
                   
                    set_not(false)
                    // console.log(record.bidder_current,pb.authStore.model.id)
                    set_status(record.Status)
                    set_price_max(record.price_max)

                    const rowData = {
                        Lot_number: data.Lot_number,
                        Invoice: data.Invoice,
                        Factory: factory,
                        Grade: data.Grade,
                        Net_weight: data.Net_weight,
                        Package: data.Package,
                        Total_kg: data.Total_kg,
                        Grand_total: data.Grand_total,
                        Offer_price: data.Offer_price,
                        Collection: data.Collection,
                        Gross_weight: data.Gross_weight,
                        Season: data.Season,
                        Warehouse: warehouse,
                        Category: data.Category,
                        PriceMax: price_max,
                        Status: Status ? "Sold" : "Unsold",
                    };
                    set_sell_data((prevDataArray) => [...prevDataArray, rowData]);

                    const record2 = await pb.collection('users').
                    getFirstListItem(`id="${record.bidder_current}"`);
                    if(record2)
                    {
                        set_current_bidder(record2.username)
                    }
                }
                else{
                    set_not(true)
                }
            }

            const get_user_id = await pb.collection('catalog').getFirstListItem(`id="${data.id}"`, {
                expand: 'relField1,relField2.subRelField',
            });
            if(get_user_id){

                const get_broker_id = await pb.collection('users').getFirstListItem(`id="${get_user_id.brokersID}"`, {
                    expand: 'relField1,relField2.subRelField',
                });
                if(get_broker_id){
    
                    const get_reference_id = await pb.collection('profiles').getFirstListItem(`id="${get_broker_id.reference}"`, {
                        expand: 'relField1,relField2.subRelField',
                    });
                    if(get_reference_id){
                        set_broker_name(get_reference_id.Company_name);
        
        
                    }
                    
    
                }

            }

        })()
       
    },[statusSELECTED])
    useEffect(()=>{
        const rowData = {
            Lot_number: data.Lot_number,
            Invoice: data.Invoice,
            Factory: factory,
            Broker: broker_name,
            Grade: data.Grade,
            Net_weight: data.Net_weight,
            Package: data.Package,
            Total_kg: data.Total_kg,
            Grand_total: data.Grand_total,
            Offer_price: data.Offer_price,
            Collection: data.Collection,
            Gross_weight: data.Gross_weight,
            Season: data.Season,
            Warehouse: warehouse,
            Category: data.Category,
            PriceMax: price_max,
            Status: Status ? "Sold" : "Unsold",
        };
     
        if (factory && warehouse) {
            set_sell_data((prevDataArray) => [...prevDataArray, rowData]);
        }
      },[factory,warehouse])
    return (
        <>
            {!not ? <>
                <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{data.Lot_number}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{data.Invoice}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{broker_name}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{factory}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{warehouse}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{data.Grade}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{data.Package}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{data.Net_weight}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{data.Grand_total}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{data.Offer_price}</td>
    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{data.Gross_weight}</td> */}
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{data.Season}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{data.Category}</td>
    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{current_bidder}</td> */}
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{price_max}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{Status ? <div className="text-green-500 text-xl"><BsCheckSquareFill /></div> : <div className="text-red-500 text-xl"><MdOutlineCancel /></div>}</td>
</tr> </>:null}
        </>
    )
}

export default LotCard;
