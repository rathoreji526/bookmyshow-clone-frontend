import { useLocation, useNavigate } from "react-router-dom"
import { manageMenu } from "../../config/ManageMenuconfig"

const ManageMenu = () => {
    const location = useLocation();
    const theaterId = location.state?.theaterId;
    const navigate = useNavigate();

    return (
        <div className="h-full w-full bg-slate-900 text-white flex items-center justify-center p-6">
            <div className="flex flex-col gap-4 w-full max-w-md bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-sm">
                {
                    manageMenu && manageMenu.map((data, idx) => {
                        return <button
                            key={idx}
                            className="group relative flex items-center justify-between p-4 duration-300 ease-in-out bg-gradient-to-r from-amber-600 to-amber-700 hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 shadow-lg hover:shadow-amber-600/30 text-white font-semibold rounded-xl border border-amber-500/30 cursor-pointer overflow-hidden"
                            onClick={() => {
                                navigate(data.navigate,{
                                    state:{
                                        theaterId:theaterId
                                    }
                                })
                            }}
                        >{data.name}</button>
                    })
                }
            </div>

        </div>
    )
}

export default ManageMenu
