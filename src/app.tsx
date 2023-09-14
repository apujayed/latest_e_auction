import { Suspense, lazy, ComponentType, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';

import Loading from './components/loading/loading';
import store from './store';
import Layout from './pages/layout';

import { Toaster } from 'react-hot-toast';

import PocketBase from 'pocketbase';
import { serverURL,secretKey } from "./config";
import encryptData from './security/encryption';


const pb = new PocketBase(serverURL);

const App = () => {
  const Dashboard = lazy(() => import("./pages/dashboard"))
  const Login = lazy(() => import("./pages/login"))
  const NotFound = lazy(() => import("./pages/404"))
  const Create = lazy(() => import("./pages/create"))
  const Report = lazy(() => import("./pages/report"))
  const Settings = lazy(() => import("./pages/settings"))

  useEffect(()=>{
    (async()=>{
      const catalogs = await pb.collection('catalog').getFullList();
    encryptData(catalogs, `${secretKey}`, 'catalogs');
    })()
  },[])

  const withLayout = (Component: ComponentType) => (
    <Layout>
      <Component />
      <Toaster
        position="top-center"
      />
    </Layout>
  );

  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: withLayout(Dashboard),
    },
    {
      path: "/report",
      element: withLayout(Report),
    },
    {
      path: "/create",
      element: withLayout(Create),
    },
    {
      path: "/settings",
      element: withLayout(Settings),
    },
    {
      path: "*",
      element: withLayout(NotFound),
    },
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <Provider store={store}>
        {pb.authStore.isValid ? <RouterProvider router={router} /> : <Login />}
        
      </Provider>
    </Suspense>
  );
};

export default App;