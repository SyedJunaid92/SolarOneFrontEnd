import { Backdrop, Box, Icon, IconButton, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { PageHeadTitle } from "../utils/customsFunctions";
import BGImage from '../images/productlistbg.png'
import MenuIcon from '@mui/icons-material/Menu';
import useStyles from "./Products/products-jss";
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const {classes} = useStyles()
    const theme = useTheme()
    const navigate = useNavigate()
    const path = window.location.href?.split("/")?.[window.location.href?.split("/")?.length - 1]
    
    return (
        <div className={" min-h-screen " + (path == "product" && classes.mainDiv)}
        style={{
            backgroundImage: `url(${BGImage})`, 
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: 'center',
        }}>

           
            <div className="flex justify-center pt-3 relative mb-6">
                
                <img src={require("../images/logo.png")} style={{width:'60px', left:'15px',position:'absolute', cursor:"pointer"}} onClick={() => {
                    navigate("/app/home")
                   
                    }}/>

                
                <Typography
                    className={
                        " text-center "
                    }
                    sx={{ fontSize: "2rem", color: "#000D6B", }}
                    fontWeight={theme.typography.fontWeightBold}
                >
                    {PageHeadTitle[path]}
                </Typography>
                <IconButton sx={{ position: "absolute", right: '5px' }} onClick={() => {
                    navigate("/app/home")
                   
                    }}>
                    <MenuIcon sx={{ color: "#000D6B" }} />
                </IconButton>
            </div>

            <Outlet />

        </div>
    )



}

export default LandingPage