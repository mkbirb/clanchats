// For the User Panel that can be displayed above the Message List
// Parameter is the User Object that contains Username Profile Picture etc
const UserPanel = ({currentUser}) => {
    return (
        <>
            <div className="flex flex-2 bg-[#ff893d] relative group !p-3">
                <div className="flex-shrink-0 justify-center items-center w-[20%]">
                    <img src={currentUser.profilePicture} className="rounded-full aspect-square object-cover w-[70%] h-[70%]" />
                </div>
                <div className="flex flex-col relative w-[75%]">
                    <p className="font-bold text-2xl">{currentUser.username}</p>
                    
                    <div className="relative group  cursor-pointer">
                        <p className="truncate text-lg">{currentUser.wordStatus}</p>
                        
                        <div className="
                            absolute left-1/2 -translate-x-1/2 top-full mt-1 
                            hidden group-hover:block
                            bg-black text-white text-sm px-2 py-1 rounded shadow-lg
                            z-50 !max-w-[500px]"  
                        >
                            <p className="break-words whitespace-normal">{currentUser.wordStatus}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default UserPanel;