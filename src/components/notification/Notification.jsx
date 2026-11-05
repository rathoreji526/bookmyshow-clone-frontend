import { useEffect, useState } from 'react';

const Notification = ({ message, type }) => {
    const [isOpen, setisOpen] = useState(false);

    useEffect(() => {
        if (message) {
            setisOpen(true);
            const timer = setTimeout(() => {
                setisOpen(false);
            }, 5000);

            return () => clearTimeout(timer);
        } else {
            setisOpen(false);
        }
    }, [message]);
    if (!message) return null;

    return (
        <div className={`fixed left-1/2 -translate-x-1/2 z-50 w-[90vw] md:w-[40vw] px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-center text-white font-medium text-sm tracking-wide transition-all duration-500 ease-in-out ${isOpen ? 'top-6 opacity-100 scale-100' : '-top-20 opacity-0 scale-95'
            } ${type === 'Error'
                ? 'bg-red-600/90 border border-red-500/40 shadow-red-950/40'
                : 'bg-emerald-600/90 border border-emerald-500/40 shadow-emerald-950/40'
            }`}>
            {message}
        </div>
    )
}

export default Notification