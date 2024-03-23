import React , {useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { CustomerListing, InventoryListing, Login, ProductListing, ProductOfListing, SalesListing } from "./pageListAsync";
import LandingPage from "../LandingPage";





const ApplicationRoutes = () => {
    let isLoggedIn = sessionStorage.getItem("token");
    const navigate = useNavigate()
 
   

    useEffect(() => {
        if (!isLoggedIn) {
             navigate("/login",{replace:true})
        }
      }, []);

    return (
      
            <Routes>
                <Route path="/" >
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Route>


                <Route path="/app" element={<LandingPage />}>
                    <Route path="/app/product" element={<ProductListing />} />
                    <Route path="/app/sale" element={<SalesListing />} />
                    <Route path="/app/customer" element={<CustomerListing />} />
                    <Route path="/app/productof" element={<ProductOfListing />} />
                    <Route path="/app/inventory" element={<InventoryListing />} />
                    <Route path="*" element={<Navigate to="/app/product" replace />} />
                </Route>



            </Routes>

      
    )
}


export default ApplicationRoutes