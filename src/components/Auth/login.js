import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { TextField, FormControlLabel,  Typography, Hidden, useMediaQuery, Button, Checkbox, InputAdornment, IconButton, Snackbar, Alert } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import '../../styles/login.css'
import { signInUser } from "../../services/auth.service";
import { useSnackbar } from 'notistack'
import {useNavigate} from 'react-router-dom'

const Login = ()=>{
    const theme = useTheme()
    const navigate= useNavigate()
    const { enqueueSnackbar } = useSnackbar();
    const mdDown = useMediaQuery(theme.breakpoints.down("md"))
    const [showPassword,setShowPassword] = useState(false)

    const [userEmail,setUserEmail] = useState("")
    const [userPassword,setUserPassword] = useState("")
    const [loading,setLoading] = useState(false)



    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

      const showAlert = (message,type)=>{
        
        return(
          enqueueSnackbar(message,{variant:type,autoHideDuration:1000, anchorOrigin:{horizontal:"right", vertical:'top'}})
        )
      }




      const loginUser = async()=>{
        try{
          setLoading(true);
          if(!userEmail?.trim()) throw "Please Enter Email"
          if(!userPassword?.trim()) throw "Please Enter Password"
          const response = await signInUser(userEmail,userPassword)
          if(response?.data?.status == 200)
          {

            sessionStorage.setItem("email", response.data.data.email)
            sessionStorage.setItem("token", response.data.data.token)
            setLoading(false);
         
            showAlert(response.data.message,"success")
            navigate("/app/home",{replace:true})

          }else{
            setLoading(false);
        
            showAlert(response.data.message,"error");

          }



        }catch(err)
        {
          setLoading(false);
        
          if (err.response) {
            showAlert(err.response.data.message?.toString(),"error");
          } else if (err.message) {
            showAlert(err.message,"error");
          } else if (err) {
            showAlert(err,"error");
          }

        }

      }
    

    return (
      <div>
            {/* Login Img */}
        <div className="flex justify-center pt-10">
        <img className="loginImg" src={require("../../images/solor-one-complete-logo.jpg")} alt="Solar One"  />

        </div>
        <div className={mdDown ?"flex justify-center mt-5" :"row"}>
        <Hidden mdDown>
        <div className="col-md-2 "> </div>
        </Hidden>
        <div className={mdDown ? "": "col-md-4 pe-5 "}>
            <div className=" font-bold text-nowrap text-4xl mb-5" >Sign In</div>
            <div className="mb-4">
                <Typography className="mb-2" >E-mail</Typography>
                <TextField
                    className="textField"
                    size="small"
                    fullWidth
                    placeholder="example@gmail.com" 
                    value={userEmail}
                    onChange={(e)=>setUserEmail(e.target.value)}

                />
            </div>
            <div className="mb-4">
                <Typography className="mb-2" >Password</Typography>
                <TextField
                    size="small"
                    className="textField"
                    fullWidth
                    placeholder="****" 
                    type={showPassword ? "text" : "password"}
                    value={userPassword}
                    onChange={(e)=>setUserPassword(e.target.value)}
                    InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className="textField"  sx={{borderLeft:'1px solid #000'}}>
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}

                />
            </div>
            <div className="flex justify-between mb-4">
            <div>
            <FormControlLabel
                control={<Checkbox />}
                label="Remeber me"
            
             />

            </div>
            <div className="flex items-center">
            <Typography fontWeight={theme.typography.fontWeightBold} sx={{textDecoration:"underline"}}  >Forgot Password?</Typography>

            </div>

            </div>
            <div>
                <Button variant="contained" fullWidth   sx={{backgroundColor:"#000D6B", borderRadius:"10px"}} disabled={loading} onClick={()=>loginUser()}>Sign In</Button>
            </div>
        </div>
        <Hidden mdDown>
        <div className="col-md-6">
        <img  src={require("../../images/solarImg.png")} alt="Solar Img" className="solar_img ps-2"  />

        </div>
        </Hidden>

        </div>
    </div>
    )

}

export default Login