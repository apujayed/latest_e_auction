import { HiMenuAlt4,HiLogout } from 'react-icons/hi'
import PocketBase from 'pocketbase';
import { serverURL } from '../../config';
const pb = new PocketBase(serverURL);


function Horizontal({ onMenuToggle }) {
    const handle_logout = ()=>{
        localStorage.clear()
        sessionStorage.clear()
        window.location.replace('/login')
    }
    return (
        <div className='h-20 shadow w-full flex items-center justify-between px-8 bg-white z-50'>
            <div  onClick={onMenuToggle} className='cursor-pointer text-3xl my-4 hover:text-secondary/50'>
                <HiMenuAlt4 />
            </div>
            <div className='flex flex-rowjustify-center items-center'>
                <div className='flex'>
                <img src="https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=579&q=80" 
     className="w-12 h-12 rounded-full p-2"
     alt="Image Description"/>

                    <span className='p-2'>{pb.authStore.model.username}</span>
                </div>
            <div onClick={handle_logout} className='p-2 text-3xl text-secondary/50 cursor-pointer hover:text-red-500 duration-300'>
                <HiLogout />
            </div>
            </div>
            {/* <img src='https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=579&q=80'
                 /> */}
        </div>
    )
}

export default Horizontal;
