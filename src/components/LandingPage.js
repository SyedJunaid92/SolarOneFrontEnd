import { Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { PageHeadTitle } from "../utils/customsFunctions";
import BGImage from '../images/productlistbg.png'

const LandingPage = () => {
    const theme = useTheme()
    const path = window.location.href?.split("/")?.[window.location.href?.split("/")?.length - 1]
    return (
        <div className=" min-h-screen" style={{
            backgroundImage: `url(${BGImage})`, backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: 'center',
        }}>
            <div className="flex justify-center pt-3">
                <Typography
                    className={
                        " text-center "
                    }
                    sx={{ fontSize: "2rem", color: "#000D6B", }}
                    fontWeight={theme.typography.fontWeightBold}
                >
                    {PageHeadTitle[path]}
                </Typography>
            </div>

            <Outlet />

        </div>
    )



}

export default LandingPage