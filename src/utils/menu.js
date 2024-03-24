
import PaymentsIcon from '@mui/icons-material/Payments';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

export default  [
    {
        name: "Sales",
        route: "/app/sale",
        icon: <PaymentsIcon />
    },
    {
        name: "Products",
        route: "/app/product",
        icon: <SolarPowerIcon />
    },
    {
        name: "Customers",
        route: "/app/customer",
        icon: <PersonOutlineIcon />
    },
    {
        name: "Inventory",
        route: "/app/inventory",
        icon:  <InventoryIcon />
    },
    {
        name: "ProductOf",
        route: "/app/productof",
        icon: <PersonAddAltIcon  />
    },
    
]