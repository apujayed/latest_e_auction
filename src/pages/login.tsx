import { useState, ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import PocketBase from 'pocketbase';


import Input from '../components/input/input';
import Button from '../components/button/button';

import { PiPassword } from 'react-icons/pi';
import { HiArrowRight } from 'react-icons/hi'
import { MdOutlineAlternateEmail } from 'react-icons/md';

import { serverURL,secretKey } from '../config';
import encryptData from '../security/encryption';

const pb = new PocketBase(serverURL);

interface LoginFormState {
    username: string;
    password: string;
}

function LoginPage(): JSX.Element {
    const [formState, setFormState] = useState<LoginFormState>({
        username: '',
        password: '',
    });


    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const authenticate = async () => {
        try {
            const { username, password } = formState;
            const user = await pb.collection('users').authWithPassword(username, password)
            const profile = await pb.collection('profiles').getFullList({
                sort: '-created',
                filter: `id = "${user.record.reference}"`
            });
            encryptData(profile, `${secretKey}`, 'profile');
            const factories = await pb.collection('profiles').getFullList({
                sort: '-created',
                filter: 'Account_type = "Factory"'
            });
            encryptData(factories, `${secretKey}`, 'factories');
            const warehouses = await pb.collection('profiles').getFullList({
                sort: '-created',
                filter: 'Account_type = "Warehouse"'
            });
            encryptData(warehouses, `${secretKey}`, 'warehouses');
            const leafs = await pb.collection('rating').getFullList({
                sort: '-created',
                filter: 'Type = "Leaf"'
            });
            encryptData(leafs, `${secretKey}`, 'leafs');
            const liquors = await pb.collection('rating').getFullList({
                sort: '-created',
                filter: 'Type = "Liquor"'
            });
            encryptData(liquors, `${secretKey}`, 'liquors');
            window.location.replace('/dashboard')
        } catch (error: any) {
            toast.error(error);
        }
    }
    const handleFormSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        toast.promise(
            authenticate(),
            {
                loading: 'Please wait...',
                success: <b>Login successfull</b>,
                error: <b>Login failed, Retry login with correct credentials</b>,
            }
        );
    };
    return (
        <div className='p-4'>
            <div className="mx-auto shadow sm:p-8 p-4 max-w-md rounded-lg mt-12">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold leading-tight text-black">
                        Welcome Back!
                    </h2>
                    <p className="max-w-md  my-2 text-base text-black/50">
                        Enter your username and password to login
                    </p>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <Input
                        title="Username"
                        type="text"
                        placeholder="Enter your username here..."
                        handle_input_change={handleInputChange}
                        icon={MdOutlineAlternateEmail}
                    />
                    <div className="h-2"></div>
                    <Input
                        title="Password"
                        type="password"
                        placeholder="Enter your password here..."
                        handle_input_change={handleInputChange}
                        icon={PiPassword}
                    />
                    <div className="h-3"></div>
                    <Button name="Login" type='submit' icon={HiArrowRight} />
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

