import { useEffect, useState } from "react";
import PocketBase from 'pocketbase';
import { serverURL,secretKey } from '../../../config';
import Card from "./Cardcopy";
import decryptData from "../../../security/decryption";
const pb = new PocketBase(serverURL);
pb.autoCancellation(false)

function Action() {
    const [records, setRecords] = useState([])
    useEffect(() => {
        (async() => {
            const ID = pb.authStore.model.id;    
            const catalog_records = decryptData(`${secretKey}`,'catalogs');
            // const profile_records = decryptData(`${secretKey}`,'profile');
            const filtered_catalog =[]
            const Eligibility_records = await pb.collection('Eligibility').getFullList({
                sort: '-created',
            });

            catalog_records.map((content)=>{
                (async()=>{ 
                    if(content.brokersID === ID && content.Season === Eligibility_records[0].Season && content.Sale_number === parseInt(Eligibility_records[0].Sale_Number)){
                        filtered_catalog.push(content)
                    }
                })()
            })
            setRecords(filtered_catalog)
        })()
    }, [])
    return (
        <div className="shadow-md bg-white rounded-lg h-fit m-4">
            <div className="py-3 px-6 border-b border-dashed">
                <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold tracking-tight text-slate-900">Your catalog</h4>
                </div>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <div className="border rounded-lg shadow-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Num.</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lot Num.</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">

                                    {
                                        records.map((content) => {
                                            return <Card data={content} />
                                        })
                                    }


                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Action;