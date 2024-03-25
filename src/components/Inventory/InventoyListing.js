import React, { useState, useEffect } from "react";
import BGImage from '../../images/productlistbg.png'
import {
    Button,
    Paper,
    Table,
    TableContainer,
    Typography,
    TableHead,
    TableRow,
    TableCell,
    Dialog,
    DialogTitle,
    DialogContent,
    Hidden,
    IconButton,
    Pagination,
    Avatar,
    TableBody,
    Tooltip,
    DialogActions,
    TextField,
    CircularProgress
  } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Colors from '../../utils/colors'
import CloseIcon from "@mui/icons-material/Close";
import useStyles from "./inventory-jss";
import { useSnackbar } from 'notistack'
import AddInventory from "./AddInventory";
import { getAllInventoryPaginate, updateInventoryQuantity } from "../../services/inventory.service";
import AddIcon from '@mui/icons-material/Add';
import Loading from "../Loading";

const InventoryListing = () => {
    const theme = useTheme();
  const email = sessionStorage.getItem("email")
    const { classes, cx } = useStyles()
    const { enqueueSnackbar } = useSnackbar();
    const [addInventoryModal, setAddInventoryModal] = useState(false)
    const [refreshData, setRefreshData] = useState(false)
    const [data, setData] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [textFieldData,setTextFieldData] = useState([])
    const [updateQuantityLoading,setUpdateQuantityLoading] = useState([])

      const showAlert = (message, type) => {

        return (
          enqueueSnackbar(message, { variant: type, autoHideDuration: 1000, anchorOrigin: { horizontal: "right", vertical: 'top' } })
        )
      }
    
      const BootstrapDialogTitle = (props) => {
        const { children, ...other } = props;
    
        return (
          <DialogTitle sx={{ m: 0, p: 2, pb: 1 }} {...other}>
            <Hidden mdDown>
              <img className="position-absolute" src={require("../../images/logo.png")} style={{ width: '50px', height: "50px", backgroundSize: 'cover' }} />
    
            </Hidden>
            <Typography textAlign="center" fontWeight={theme.typography.fontWeightBold} sx={{ color: Colors.inventory.headColor, fontSize: "2.5rem" }}>  {children} </Typography>
    
    
            <IconButton
              onClick={() => {
                if (addInventoryModal) {
                  setAddInventoryModal(false)
                } 
    
              }}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
              
    
    
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        );
      };

      useEffect(()=>{
        getInventoryData(1)
        setTextFieldData([])

      },[refreshData])

      const getInventoryData = async (page_number) => {
        try {
          setLoading(true)
          const response = await getAllInventoryPaginate(email, "10", page_number)
          if (response?.data?.status == 200) {
            setPageNumber(page_number)
            setData(response.data.data)
            setTotalPages(response.data.totalPages);
            setLoading(false)
          } else {
            setData([])
            showAlert(response.data.message, "error")
            setLoading(false)
          }
    
        } catch (err) {
          setLoading(false);
          setData([])
          if (err.response) {
            showAlert(err.response.data.message?.toString(), "error");
          } else if (err.message) {
            showAlert(err.message, "error");
          } else if (err) {
            showAlert(err, "error");
          }
    
        }
      }

      const handlePaginationChange = async (event, page) => {
        setTextFieldData([])
        await getInventoryData(page);
      };

      const updateQuantity = async (_id,index) => {
        try {
          updateQuantityLoading[index] = true
          setUpdateQuantityLoading([...updateQuantityLoading])
          const response = await updateInventoryQuantity(email,_id,+textFieldData[index])
          if (response?.data?.status == 200) {
            setRefreshData(!refreshData)
            updateQuantityLoading[index] = false
          setUpdateQuantityLoading([...updateQuantityLoading])
          } else {
            
            showAlert(response.data.message, "error")
            updateQuantityLoading[index] = false
            setUpdateQuantityLoading([...updateQuantityLoading])
          }
    
        } catch (err) {
          updateQuantityLoading[index] = false
          setUpdateQuantityLoading([...updateQuantityLoading])
          if (err.response) {
            showAlert(err.response.data.message?.toString(), "error");
          } else if (err.message) {
            showAlert(err.message, "error");
          } else if (err) {
            showAlert(err, "error");
          }
    
        }
      }

    return (

        <div >

        {/* Add Inventory  */}
      <Dialog
        open={addInventoryModal}
        maxWidth="xs"
        fullWidth
        // fullScreen
        onClose={() => setAddInventoryModal(false)}
        classes={{ paper: classes.modalBG }}
      >
        <BootstrapDialogTitle>Add Inventory</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          <AddInventory setAddInventoryModal={setAddInventoryModal} refreshData={refreshData} setRefreshData={setRefreshData} />

        </DialogContent>
      </Dialog>

            {/* <div className="flex justify-center">
                <Typography
                    className={
                        " text-center "
                    }
                    sx={{ fontSize: "2rem", color: Colors.inventory.headColor, }}
                    fontWeight={theme.typography.fontWeightBold}
                >
                    Inventory
                </Typography>
                
            </div> */}

            <Paper className="mx-2 md:mx-28" style={{ minHeight: "50vh" }} elevation={24}>
                    <div className="flex justify-end mb-0 mr-2">
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: Colors.inventory.buttonColor }}
                            className="mt-1"
                            onClick={() => setAddInventoryModal(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 30 30"
                            >
                                <path
                                    fill="white"
                                    d="M14.97 2.973A2 2 0 0013 5v8H5a2 2 0 100 4h8v8a2 2 0 104 0v-8h8a2 2 0 100-4h-8V5a2 2 0 00-2.03-2.027z"
                                ></path>
                            </svg>
                            <span style={{ marginLeft: "5px" }}>Add</span>
                        </Button>
                    </div>

                  {loading ? <Loading />  : <TableContainer sx={{ overflow: "auto" }}>
          <Table className={cx(classes.table, classes.hover)}>
            <TableHead>
              <TableRow>
                <TableCell
                  
                  align="left"
                  sx={{ width: "1%" }}
                >

                </TableCell>
                <TableCell
                  style={{
                    color: Colors.inventory.headColor,
                  }}
                  
                >
                  Product Code
                </TableCell>
                <TableCell
                  style={{
                    color: Colors.inventory.headColor,
                  }}
                  
                >
                  
                  Product Name
                </TableCell>
                <TableCell
                  style={{
                    color: Colors.inventory.headColor,
                  }}
                  
                >
                  Product Of
                </TableCell>

                <TableCell
                  style={{
                    color: Colors.inventory.headColor,
                  }}
                  
                >
                  Qty
                </TableCell>
                <TableCell
                  style={{
                    color: Colors.inventory.headColor,
                  }}
                  
                >
                  Add Qty
                </TableCell>
                <TableCell
                  style={{
                    color: Colors.inventory.headColor,
                  }}
                  
                >
                 Total
                </TableCell>


                <TableCell
                  style={{
                    color: Colors.inventory.headColor,
                  }}
                  sx={{ width: "7%" }}
                  align="center"
                >
                  Add
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => {
                return (
                  <>
                    <TableRow key={item._id}>
                      <TableCell ><Avatar  sx={{ width: 60, height: 60, fontSize: "2rem" }} src={item.product_picture ? item.product_picture : ""}/></TableCell>
                      <TableCell style={{wordBreak:"normal"}} >{item.product_code}</TableCell>
                      <TableCell style={{wordBreak:"normal"}} >{item.product_name}</TableCell>
                      <TableCell >
                        {item?.product_of_name}
                      </TableCell>
                      <TableCell >
                        {item?.quantity}
                      </TableCell>
                      <TableCell >
                        <TextField  size="small"   
                        value={textFieldData[index] || ""}
                        inputProps={{readOnly:updateQuantityLoading[index], inputMode:"numeric"}}
                        
                        onChange={(e)=>{
                          textFieldData[index] = e.target.value?.replace(/[^0-9]/gi, "")
                          setTextFieldData([...textFieldData])

                        }}
                        sx={{width:'50px', color: Colors.customer.textFieldColor, borderColor: Colors.customer.borderColor }}/>
                      </TableCell>
                      <TableCell >
                        {+item?.quantity + (+textFieldData[index] || 0)}
                      </TableCell>
                      <TableCell>
                        <div className=" flex ">
                        <Tooltip title="Add Quantity">
                          <IconButton   onClick={()=>updateQuantity(item._id,index)} disabled={!textFieldData[index] || +textFieldData[index] <=0  || updateQuantityLoading[index]} >
                           {updateQuantityLoading[index] ? <CircularProgress size="1rem" sx={{color:Colors.inventory.borderColor}}/> :  <AddIcon sx={{color:Colors.inventory.borderColor}} />}
                          </IconButton>
                        </Tooltip>
                        
                        </div>
                      </TableCell>
                    
                    </TableRow>
                  </>
                );
              })}
            </TableBody>

          </Table>

                    </TableContainer>}

        {data?.length > 0 && !loading &&
          <div className=" flex justify-center p-2">
            <Pagination
              count={totalPages}
              page={pageNumber}
              variant="outlined"
              color="primary"
              onChange={handlePaginationChange}
            />
          </div>}

                </Paper>

        </div>
    )
}




export default InventoryListing