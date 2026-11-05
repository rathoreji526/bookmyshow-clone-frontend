import axios from "axios";
import { useState, useEffect } from "react";
import Notification from '../../../../../components/notification/Notification'
import Loader from "../../../../../components/loader/Loader";
const baseURL = 'https://bookmyshow-backend-o592.onrender.com/'

const PreviewScreen = () => {
    const formData = JSON.parse(sessionStorage.getItem('addScreenFormData')) || { totalRows: 0, seatsPerRow: 0 };
    const [seatLayout, setSeatLayout] = useState([]);
    const [response, setResponse] = useState('');
    const [responseCode, setResponseCode] = useState();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (formData.totalRows && formData.seatsPerRow) {
            const initialLayout = Array.from({ length: formData.totalRows }).map((_, rowIndex) => {
                const rowChar = String.fromCharCode(65 + (Number(formData.totalRows) - Number(rowIndex + 1)));

                return {
                    rowName: rowChar,
                    startSeat: 1,
                    endSeat: Number(formData.seatsPerRow),
                    seatType: "SILVER"
                };
            });
            setSeatLayout(initialLayout);
        }
    }, [formData.totalRows, formData.seatsPerRow]);

    // Handle input changes for a specific row
    const handleInputChange = (index, field, value) => {
        const updatedLayout = [...seatLayout];
        updatedLayout[index][field] = value;
        setSeatLayout(updatedLayout);
    };

    // Final Payload to send to Backend
    const handleSaveLayout = async () => {
        const finalPayload = {
            theaterId: formData.theaterId || "", // Agar session me ho toh
            screenName: formData.screenName || "", // Agar session me ho toh
            totalRows: Number(formData.totalRows),
            seatsPerRow: Number(formData.seatsPerRow),
            layout: seatLayout
        };

        setLoading(true);
        try {
            const response = await axios.post(
                baseURL + 'apis/screen/add-screen',
                finalPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setResponse(response.data);
            setResponseCode(response.status);
        } catch (e) {
            setResponse(e.response?.data);
            setResponseCode(e.status);

        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="flex w-full flex-col gap-6 m-4 items-center">
            {
                response && <Notification
                    key={Date.now()}
                    message={response}
                    type={responseCode < 400 ? 'Success' : 'Error'}
                />
            }
            {
                loading && <Loader />
            }

            {/* Visual Seat Preview */}
            <div className="flex flex-col gap-3 items-center bg-gray-900 p-6 rounded-lg w-3/4">
                <h3 className="text-white font-bold mb-2">Live Seat Preview</h3>
                {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1">
                        {Array.from({ length: row.endSeat }).map((_, seatIndex) => (
                            <div
                                key={seatIndex}
                                className={`w-8 h-8 border border-gray-400 flex items-center justify-center text-xs rounded font-semibold ${row.seatType === 'PREMIUM'
                                    ? 'bg-amber-500 text-white'
                                    : row.seatType === 'GOLD'
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-gray-200 text-black'
                                    }`}
                            >
                                {row.rowName}{seatIndex + 1}
                            </div>
                        ))}
                    </div>
                ))}
                <div className="border w-3/4 mt-6 text-center border-amber-200 text-white py-1 bg-gray-800 rounded">
                    All eyes this side (Screen)
                </div>
            </div>

            {/* Row Configuration Form */}
            <div className="flex flex-col gap-4 w-3/4 bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800">Configure Each Row Layout</h3>

                {seatLayout.map((row, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white p-3 rounded border border-gray-300">

                        {/* Row Name Display / Input */}
                        <div className="w-1/6">
                            <label className="block text-xs font-semibold text-gray-600">Row Name</label>
                            <input
                                type="text"
                                value={row.rowName}
                                onChange={(e) => handleInputChange(index, 'rowName', e.target.value)}
                                className="outline-0 w-full border p-1 rounded text-center font-bold"
                            />
                        </div>

                        {/* Start Seat */}
                        <div className="w-1/6">
                            <label className="block text-xs font-semibold text-gray-600">Start Seat</label>
                            <input
                                type="number"
                                value={row.startSeat}
                                onChange={(e) => handleInputChange(index, 'startSeat', Number(e.target.value))}
                                className="outline-0 w-full border p-1 rounded text-center"
                            />
                        </div>

                        {/* End Seat */}
                        <div className="w-1/6">
                            <label className="block text-xs font-semibold text-gray-600">End Seat</label>
                            <input
                                type="number"
                                value={row.endSeat}
                                onChange={(e) => handleInputChange(index, 'endSeat', Number(e.target.value))}
                                className="outline-0 w-full border p-1 rounded text-center"
                            />
                        </div>

                        {/* Seat Type Dropdown */}
                        <div className="w-2/6">
                            <label className="block text-xs font-semibold text-gray-600">Seat Type</label>
                            <select
                                value={row.seatType}
                                onChange={(e) => handleInputChange(index, 'seatType', e.target.value)}
                                className="outline-0 w-full border p-1.5 rounded bg-white text-sm"
                            >
                                <option value="SILVER">SILVER</option>
                                <option value="GOLD">GOLD</option>
                                <option value="PREMIUM">PREMIUM</option>
                            </select>
                        </div>

                    </div>
                ))}

                <button
                    onClick={handleSaveLayout}
                    className="mt-4 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
                >
                    Save Screen Layout
                </button>
            </div>

        </div>
    );
};

export default PreviewScreen;