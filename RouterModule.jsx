import React, { Component, Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Login = lazy(() => import('./src/Component/Login'));
const Registration = lazy(() => import('./src/Component/Registration'));
const Dashboard = lazy(() => import('./src/Component/Dashboard'));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Login />
            </Suspense>
        )
    },
    {
        path: "/registration",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Registration />
            </Suspense>
        )
    },
    {
        path: "/dashboard",
        element: (
            <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
            </Suspense>
        )
    }
]);

export default class RouterModule extends Component {
    render() {
        return (
            <div>
                <RouterProvider router={router} />
            </div>
        );
    }
}
