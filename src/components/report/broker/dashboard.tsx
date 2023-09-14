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
import ComboBoxComponent from "../../combobox/combobox";
import { MdOutlinePointOfSale } from "react-icons/md";

const pb = new PocketBase(serverURL);
pb.autoCancellation(false)

function BrokerDashboard() {
    const [eligibility, set_eligibility] = useState();
    const [catalog, set_catalog] = useState([]);
    // const [broker, set_broker] = useState('')
    
    const [season, setSEASON] = useState([])
    const [message, set_message] = useState('')
    const [paused, set_paused]  = useState(false)
    const [all_catalog,set_all_catalog] = useState([])
    const [fltr_catalog, set_fltr_catalog] = useState([])

    // real-time update
    const [all_lot, set_all_lot] = useState(false)
    const [sale_number, set_sale_number] = useState(0)
    const [auction_record, set_auction_record] = useState()
    const [auction_id, set_auction_id] = useState()
    const [has_completed, set_completed] = useState(false)
    const [auc_c, set_auc_c] = useState(false)
    const [seasonSELECTED,setSeasonSELECTED] = useState()
    const [saleSELECTED,setSaleSELECTED] = useState()
    // let filtered_catalog =[]
    const [statusSELECTED,setStatusSELECTED] = useState(true)

    const handleChange = (event) => {
      const selectedBool = event.target.value === 'true'; // Convert the selected value to a boolean
      setStatusSELECTED(selectedBool);
    };
    useEffect(() => {
        (async () => {
            try {

                const records = await pb.collection('profiles').getFullList({
                    sort: '-created',
                    filter: 'Account_type="Broker"'
                });
                // setData(records)
                const records2 = decryptData(`${secretKey}`, 'catalogs')
                
                const uniqueSeasons = [...new Set(records2.map(item => item.Season))];
                const uniqueSaleNumbers = [...new Set(records2.map(item => item.Sale_number))];
                setSEASON(uniqueSeasons)
                const e_record = await pb.collection('Eligibility').getFullList();
                // set_e_record(e_record[0])
                setSeasonSELECTED(e_record[0].Season)
                setSaleSELECTED(e_record[0].Sale_Number)
           
            }
            catch (error: any) {
                toast.error(error.message)
            }
        })()

    }, [])
    useEffect(() => {
        (async () => {
            // const e_record = await pb.collection('Eligibility').getFullList();
            // setSeasonSELECTED(e_record[0].Season)
            // setSaleSELECTED(e_record[0].Sale_Number)
            const CatalogRecord = await pb.collection('catalog').getFullList({
                sort: '+created',
                filter:`brokersID="${pb.authStore.model.id}"`
            });
            // set_all_catalog(CatalogRecord)
            // console.log(CatalogRecord)
            let filtered_catalog =[]
            CatalogRecord.map((content)=>{
                if(content.Season === seasonSELECTED && content.Sale_number === parseInt(saleSELECTED)){
                    filtered_catalog.push(content)
                }
            })
            set_all_catalog(filtered_catalog)
        })()

    }, [seasonSELECTED,saleSELECTED,statusSELECTED])
    const handleInputChange =(event)=>{
        setSaleSELECTED(event.target.value) 
    }
    return (

<div>
<div className="flex mt-6 justify-between items-center p-4 sm:w-[600px] mx-auto">
                    <div className="w-1/2">
                    <p className="mb-2">Select season</p>
                    <ComboBoxComponent selected={seasonSELECTED} data={season} change={setSeasonSELECTED} />
                    </div>
                    <div className="w-2"></div>
                    <div className="w-1/2">
                    <Input
                        title="Sale Number"
                        type="number"
                        defaultValue={saleSELECTED}
                        placeholder="Sale number here..."
                        handle_input_change={handleInputChange}
                        icon={MdOutlinePointOfSale}
                    />
                    </div>
                    <div className="w-2"></div>
                    <div className="w-1/2">
                    <p className="mb-2">Status</p>
                    <select    className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-black caret-black"
         id="myDropdown" value={statusSELECTED.toString()} onChange={handleChange}>
        <option value="true">Sold</option>
        <option value="false">Unsold</option>
      </select>  </div>

                    </div> 
<AllLot set_all_lot={set_all_lot} catalog={all_catalog}  statusSELECTED={statusSELECTED} />
<br />
</div>
    )
}

export default BrokerDashboard;
