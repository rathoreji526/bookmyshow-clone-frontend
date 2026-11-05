const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin shadow-lg shadow-amber-500/10"></div>
    </div>
  )
}

export default Loader;