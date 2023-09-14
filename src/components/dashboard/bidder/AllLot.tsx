import { FaTimes } from "react-icons/fa";
import LotCard from "./AlllotCard";

function AllLot({ catalog, set_all_lot }) {
    return (
        <div className="h-screen w-screen flex justify-center px-4 pt-12 bg-black/10 inset-0 fixed z-50">
            <div className="shadow-md max-w-md lg:max-w-2xl bg-white rounded-lg h-fit">
                <div className="py-3 px-6 border-b border-dashed">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold tracking-tight text-slate-900">My lot (Running Broker)</h4>
                        <div className="cursor-pointer" onClick={(() => { set_all_lot(false) })}>
                            <FaTimes />
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lot </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factory</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net weight</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Pkg</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Total</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Grand Total</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Offer price</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Collection</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Gross weight</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Season</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Category</th>
                                            {/* <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Current bidder</th> */}
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Price max</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">

                                        {catalog.map((content) => {
                                            return <LotCard data={content} />
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllLot;
