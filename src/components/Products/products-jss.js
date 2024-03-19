import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme, _params, classes) => ({

    productCard:{
        marginTop:theme.spacing(7),
        minWidth:'1200px',
        [theme.breakpoints.down("sm")]:{
            minWidth:'600px',
            paddingRight:'8px',
            paddingLeft:'8px'

        }
    },
    addCardBG:{
        backgroundImage: `url(${require("../../images/addproductbg.png")})`, 
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'center',
    }


}))

export default useStyles;