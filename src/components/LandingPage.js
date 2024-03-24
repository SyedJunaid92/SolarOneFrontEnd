import { Backdrop, Box, Icon, IconButton, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { PageHeadTitle } from "../utils/customsFunctions";
import BGImage from '../images/productlistbg.png'
import MenuIcon from '@mui/icons-material/Menu';
import menu from "../utils/menu";
import {   useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const theme = useTheme()
    const navigate = useNavigate()
    const path = window.location.href?.split("/")?.[window.location.href?.split("/")?.length - 1]
    const [openMenu, setOpenMenu] = useState(false)
    const smDown = useMediaQuery(theme.breakpoints.down("sm"))
    return (
        <div className=" min-h-screen" 
        style={{
            backgroundImage: `url(${BGImage})`, 
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: 'center',
        }}>

            <Backdrop
                sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}
                open={openMenu}
                onClick={() => setOpenMenu(false)}
            >
                <Box sx={{ backgroundColor: '#fff', top: 52, width:smDown ? "90vw" :"50%", borderRadius:'10px', }} className="  absolute " >
                    <Typography sx={{ color: "#000D6B", fontWeight: 'bold', fontSize: '26px' }} textAlign="center" className="pt-3"  >Menu</Typography>
                    <div className=" grid xs:grid-cols-2  md:grid-cols-3 justify-center pb-3">
                    {menu.map(item=>{
                        return(
                            <div key={item.name}>
                            <ListItemButton sx={{color:"#000D6B", textAlign:'center'}} 
                            onClick={()=>{
                                navigate(item.route)

                            }}>
                                <ListItemText primary={
                                <div>
                                <Icon sx={{color:"#000D6B", height:'fit-content'}}>
                                    {item.icon}
                                </Icon>

                                </div>} 
                                    secondary={item.name}
                                />
                            </ListItemButton>
                        </div>)
                    })}

                    </div>
                </Box>
            </Backdrop>
            <div className="flex justify-center pt-3 relative">
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
                    setOpenMenu(true)
                    if (openMenu) {
                            document.body.style.overflow = 'hidden'; // Disable scrolling
                            } else {
                            document.body.style.overflow = 'auto'; // Enable scrolling
                            }
                    }}>
                    <MenuIcon sx={{ color: "#000D6B" }} />
                </IconButton>
            </div>

            <Outlet />

        </div>
    )



}

export default LandingPage