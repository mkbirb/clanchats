import { handleGoogleAccountSubmit } from "../utils/handleGoogleAccountSubmit"
import googleIcon from '../images/googleIcon.png';

const GoogleLogin = ({type, changeUser, router}) => {
    return (
        <div className="cursor-pointer  !bg-white w-72 h-12 rounded-2xl flex items-center gap-5 justify-center !mb-5" onClick={(e) => handleGoogleAccountSubmit(e, changeUser, router)}>
            <img className="size-10" src={googleIcon.src} alt="Google Icon" />
            <p className="!text-xl !text-black !text-center !font-bold"> {type} with Google </p>
        </div>
    )
}

export default GoogleLogin