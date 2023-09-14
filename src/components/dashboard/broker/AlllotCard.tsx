// @ts-nocheck
import { useEffect, useState } from "react";
import { secretKey, serverURL } from "../../../config";
import decryptData from "../../../security/decryption";
import PocketBase from "pocketbase";
import { BsCheckSquareFill } from "react-icons/bs";
import { MdCancel, MdOutlineCancel } from "react-icons/md";
import { toast } from "react-hot-toast";
const pb = new PocketBase(serverURL);
pb.autoCancellation(false);

function LotCard({ data }) {
  const [factory, set_factory] = useState("");
  const [warehouse, set_warehouse] = useState("");
  const [price_max, set_price_max] = useState("");
  const [record_id, set_record_id] = useState();
  const [Status, set_status] = useState(false);
  const [current_bidder, set_current_bidder] = useState("");
  useEffect(() => {
    const factory_record = decryptData(`${secretKey}`, "factories");
    factory_record.map((content) => {
      if (content.id === data.Factory) {
        set_factory(content.Company_name);
      }
    });
    const warehouse_record = decryptData(`${secretKey}`, "warehouses");
    if (warehouse_record) {
      warehouse_record.map((content) => {
        if (content.id === data.Warehose) {
          set_warehouse(content.Company_name);
        }
      });
    }
  }, []);
  useEffect(() => {
    (async () => {
      const record = await pb
        .collection("auction_info")
        .getFirstListItem(`catalog="${data.id}"`, {
          expand: "relField1,relField2.subRelField",
        });
      if (record) {
        set_record_id(record.id);
        set_status(record.Status);
        set_price_max(record.price_max);
        const record2 = await pb
          .collection("users")
          .getFirstListItem(`id="${record.bidder_current}"`);
        if (record2) {
          set_current_bidder(record2.username);
        }
      }
    })();
  }, [data]);
  const handle_sold = () => {
    if(!Status){
        if (record_id) {
            const data = {
              Status: true,
            };
            (async () => {
              try {
                await pb.collection("auction_info").update(`${record_id}`, data);
                toast.success("Status updated");
                window.location.reload();
              } catch (error) {
                //
              }
            })();
          } else {
            const data2 = {
              catalog: data.id,
              Status: true,
            };
            (async () => {
              try {
                await pb.collection("auction_info").create(data2);
                toast.success("Status updated");
                window.location.reload();
              } catch (error) {}
            })();
          }
    } else{
       toast.error('This lot already sold..!!')
    }
  };
  const handle_un_sold = () => {
   if(!Status){
    if (record_id) {
        const data = {
          Status: false,
        };
        (async () => {
          try {
            await pb.collection("auction_info").update(`${record_id}`, data);
            toast.success("Status updated");
            window.location.reload();
          } catch (error) {
            //
          }
        })();
      } else {
        const data2 = {
          catalog: data.id,
          Status: false,
        };
        (async () => {
          try {
            await pb.collection("auction_info").create(data2);
            toast.success("Status updated");
            window.location.reload();
          } catch (error) {}
        })();
      }
   } else{
    toast.error("This lot already sold!!")
   }
  };
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Lot_number}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {data.Invoice}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {factory}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {data.Grade}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {data.Net_weight}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Package}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Total_kg}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Grand_total}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Offer_price}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Collection}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Gross_weight}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Season}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {warehouse}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {data.Category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {current_bidder}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {price_max}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {Status ? (
          <div className="text-green-500 text-xl">
            <BsCheckSquareFill />
          </div>
        ) : (
          <div className="text-red-500 text-xl">
            <MdOutlineCancel />
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        <div className="flex items-center">
          <div onClick={handle_sold} className=" cursor-pointer text-xl mr-4">
            <BsCheckSquareFill />
          </div>{" "}
          <div onClick={handle_un_sold} className=" cursor-pointer text-2xl">
            <MdCancel />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default LotCard;
