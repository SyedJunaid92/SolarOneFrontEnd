import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Hidden, IconButton, ListItemText, Pagination, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import "../../styles/product.css";
import useStyles from "./products-jss";

import CloseIcon from "@mui/icons-material/Close";
import AddProduct from "./AddProduct";
import Colors from '../../utils/colors'
import EditProduct from "./EditProduct";
import BGImage from '../../images/productlistbg.png'
import { useSnackbar } from 'notistack'
import { deleteProduct, getAllProductPaginate } from "../../services/product.service";

const ProductsListing = () => {
  const theme = useTheme();
  const {classes} = useStyles()
  const { enqueueSnackbar } = useSnackbar();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [addProductModal, setAddProductModal] = useState(false)
  const [editProductModal, setEditProductModal] = useState(false)
  const [deleteProductModal, setDeleteProductModal] = useState(false)
  const [refreshData,setRefreshData] = useState(false)
  const [loading,setLoading] = useState(false)
  const [pageNumber,setPageNumber] = useState(1)
  const [totalPages,setTotalPages] = useState(1)
  const email = sessionStorage.getItem("email")
  const [selectedProduct,setSelectedProduct] = useState({})
  const [deleteLoading,setDeleteLoading] = useState(false)



  const [data,setData] = useState([])
  const BootstrapDialogTitle = (props) => {
    const { children, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }} {...other}>
        <Hidden mdDown>
          <img className="position-absolute" src={require("../../images/logo.png")} style={{ width: '50px', height: "50px", backgroundSize: 'cover' }} />

        </Hidden>
        <Typography textAlign="center" fontWeight={theme.typography.fontWeightBold} sx={{ color: Colors.products.headColor, fontSize: "2.5rem" }}>  {children} </Typography>


        <IconButton
          onClick={() => {
            if (addProductModal) {
              setAddProductModal(false)
            } else if (editProductModal) {
              setEditProductModal(false)
            } else if (deleteProductModal) {
              setDeleteProductModal(false)
            }

          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}

          disabled={deleteLoading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
    );
  };
  useEffect(()=>{
   
    getProductData(1)
    
  },[refreshData])

  const getProductData=async(page_number)=>{
    try{
      setLoading(true)
      const response = await getAllProductPaginate(email,"10", page_number)
      if(response?.data?.status == 200)
      {
        setPageNumber(page_number)
        setData(response.data.data)
        setTotalPages(response.data.totalPages);
        setLoading(false)
      }else{
        setData([])
        showAlert(response.data.message,"error")
        setLoading(false)
      }

    }catch(err)
    {
      setLoading(false);
        setData([])
          if (err.response) {
            showAlert(err.response.data.message?.toString(),"error");
          } else if (err.message) {
            showAlert(err.message,"error");
          } else if (err) {
            showAlert(err,"error");
          }

    }
  }

  const productDelete = async()=>{
    try{
      setDeleteLoading(true)
      const response = await deleteProduct(email,selectedProduct?._id)
      if(response?.data?.status == 200)
      {
        showAlert(response.data.message,"success")
       setRefreshData(!refreshData)
       setDeleteProductModal(false)
       setDeleteLoading(false)
      }else{
        setDeleteLoading(false)
        showAlert(response.data.message,"error")
       
      }

    }catch(err)
    {
      setDeleteLoading(false)
      if (err.response) {
        showAlert(err.response.data.message?.toString(),"error");
      } else if (err.message) {
        showAlert(err.message,"error");
      } else if (err) {
        showAlert(err,"error");
      }


    }
  }

  const showAlert = (message,type)=>{
        
    return(
      enqueueSnackbar(message,{variant:type,autoHideDuration:1000, anchorOrigin:{horizontal:"right", vertical:'top'}})
    )
  }

  const handlePaginationChange = async (event, page) => {
    await getProductData(page);
  };


  return (
    <div className=" min-h-screen" style={{
      backgroundImage: `url(${BGImage})`, backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: 'center',
    }} >

      {/* Add Product  */}
      <Dialog
        open={addProductModal}
        maxWidth="lg"
        fullWidth
        fullScreen
        onClose={() => setAddProductModal(false)}
        classes={{paper:classes.addCardBG}}
      >
        <BootstrapDialogTitle>Add Product</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          <AddProduct setAddProductModal={setAddProductModal} refreshData={refreshData} setRefreshData={setRefreshData} />

        </DialogContent>
      </Dialog>

      {/* Edit Product */}
      <Dialog
        open={editProductModal}
        maxWidth="lg"
        fullWidth
        fullScreen
        classes={{paper:classes.addCardBG}}
        onClose={() => setEditProductModal(false)}
      >
        <BootstrapDialogTitle>Edit Product</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          <EditProduct setEditProductModal={setEditProductModal} 
          refreshData={refreshData} setRefreshData={setRefreshData} 
          selectedProduct={selectedProduct} />

        </DialogContent>
      </Dialog>

      {/* Delete Product */}
      <Dialog
        open={deleteProductModal}
        maxWidth="sm"
        fullWidth

        onClose={() => {
          if(!deleteLoading)
          {
            setDeleteProductModal(false)
          }
        }}
      >
        <BootstrapDialogTitle>Delete Product</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          Are you sure to want Delete this Product?

        </DialogContent>
        <DialogActions className="justify-content-between">
          <Button variant="contained" disabled={deleteLoading} size="small" sx={{ backgroundColor: "#29B3FD", borderColor: "#29B3FD" }} onClick={()=>productDelete()} >Yes</Button>
          <Button variant="outlined"  disabled={deleteLoading} size="small" sx={{ borderColor: "#29B3FD" }} onClick={()=>{
            setSelectedProduct({})
            setDeleteProductModal(false)

          }} >No</Button>

        </DialogActions>
      </Dialog>




      <div className="flex justify-end position-relative pt-3 ">
        <Typography
          className={
            " text-center  " + (mdUp ? " listingProductTitle " : "")
          }
          sx={{ fontSize: "2rem", color: "#000D6B" }}
          fontWeight={theme.typography.fontWeightBold}
        >
          Products
        </Typography>
        <Button variant="outlined" size="small"
          sx={{ color: "#29B3FD", borderColor: "#29B3FD", borderRadius: '10px' }}
          onClick={() => setAddProductModal(true)}
        >
          Add +
        </Button>
      </div>

      <div className={"grid sm:grid-cols-1 md:grid-cols-2  gap-x-5 lg:px-28 px-8 " + classes.productCard}>
        {data?.map((item, index) => {
          return (
            <div className=" mb-4  shadow-lg  rounded-xl" key={index}>
              <div className="flex productListingCard pt-4 pr-2 pl-4 pb-2 ">
                <div>
                <div style={{
                      
                      width: "160px",
                      
                      height: "120px",
                     
                    }}>
                  <img
                    // src={require("../../images/cardImg.png")}
                    src={item.picture}
                    style={{
                      maxWidth: "160px",
                      width: "auto",
                      maxHeight: "120px",
                      height: "auto",
                      backgroundSize: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  </div>
                  <Typography className="mt-2 text-center ">
                    {item.code}
                  </Typography>
                </div>
                <div className="ps-2 w-full">
                  <div className="flex justify-between">
                    <Typography
                      fontWeight={theme.typography.fontWeightBold}
                      sx={{ color: "#515151", fontSize: "2rem", lineHeight: 1 }}
                    >
                      {item.name}
                    </Typography>
                    <div onClick={()=>setSelectedProduct(item)}>

                      <i className="ion-ios-create-outline productListingButton px-2 me-1  text-lg cursor-pointer" onClick={() => setEditProductModal(true)} />
                      <i className="ion-ios-trash-outline productListingButton px-2 ms-1  text-lg cursor-pointer" onClick={() => setDeleteProductModal(true)} />
                    </div>
                  </div>
                  <Typography className="mb-2" sx={{ fontSize: "9px" }}>
                    {item.company_name}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", wordBreak: "normal" }}>
                    {item.description}
                  </Typography>
                  <div className="flex justify-between">
                    {/* <ListItemText
                      primary="Stock"
                      secondary="11"
                      className=" text-textColor"
                      primaryTypographyProps={{ fontSize: "12px" }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    /> */}
                    <ListItemText
                      primary="Watt"
                      secondary={item.watt || ""}
                      className=" text-textColor"
                      primaryTypographyProps={{ fontSize: "12px" }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    />
                    {/* <ListItemText
                      primary="Sold"
                      secondary="22"
                      className=" text-textColor"
                      primaryTypographyProps={{ fontSize: "12px" }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    /> */}
                    <ListItemText
                      primary="Price"
                      secondary={`Rs${item.price}`}
                      className=" text-textColor"
                      primaryTypographyProps={{ fontSize: "12px" }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    />
                    <ListItemText
                      primary="Cost"
                      secondary={`Rs${item.cost}`}
                      className=" text-textColor"
                      primaryTypographyProps={{ fontSize: "12px" }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    />
                    {/* <ListItemText
                      primary="Alert"
                      secondary={item.alert}
                      className=" text-textColor"
                      primaryTypographyProps={{ fontSize: "12px" }}
                      secondaryTypographyProps={{ fontSize: "11px" }}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-center p-2">
        <Pagination
          count={totalPages}
          page={pageNumber}
          variant="outlined"
          color="primary"
        onChange={handlePaginationChange}
        />
      </div>

    </div>
  );
};

export default ProductsListing;
