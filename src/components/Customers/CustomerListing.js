import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import Colors from '../../utils/colors'
import useStyles from "./customer-jss-";
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
  DialogActions
} from "@mui/material";
import AddCustomer from "./AddCustomer";
import { deleteCustomer, getAllCustomerPaginate } from "../../services/customer.service";
import { useSnackbar } from 'notistack'
import ViewCustomer from "./ViewCustomer";
import EditIcon from '@mui/icons-material/Edit';
import EditCustomer from "./EditCustomer";
import DeleteIcon from '@mui/icons-material/Delete';
import BGImage from '../../images/productlistbg.png'
import Loading from "../Loading";


const CustomerListing = () => {
  const theme = useTheme();
  const { classes, cx } = useStyles()
  const { enqueueSnackbar } = useSnackbar();
  const [addCustomerModal, setAddCustomerModal] = useState(false)
  const [editCustomerModal, setEditCustomerModal] = useState(false)
  const [viewCustomerModal, setViewCustomerModal] = useState(false)
  const [deleteCustomerModal, setDeleteCustomerModal] = useState(false)
  const [refreshData, setRefreshData] = useState(false)
  const [data, setData] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const email = sessionStorage.getItem("email")
  const [loading, setLoading] = useState(false)
  const [selectedCustomer,setSelectedCustomer] = useState({})
  const [deleteLoading,setDeleteLoading] = useState(false)

  useEffect(() => {

    getCustomerData(1)

  }, [refreshData])

  const getCustomerData = async (page_number) => {
    try {
      setLoading(true)
      const response = await getAllCustomerPaginate(email, "10", page_number)
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
        <Typography textAlign="center" fontWeight={theme.typography.fontWeightBold} sx={{ color: Colors.customer.headColor, fontSize: "2.5rem" }}>  {children} </Typography>


        <IconButton
          onClick={() => {
            if (addCustomerModal) {
              setAddCustomerModal(false)
            } else if (editCustomerModal) {
              setEditCustomerModal(false)
            } else if (viewCustomerModal) {
              setViewCustomerModal(false)
            }else if(deleteCustomerModal)
            {
              setDeleteCustomerModal(false)
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

  const handlePaginationChange = async (event, page) => {
    await getCustomerData(page);
  };

  const customerDelete = async()=>{
    try{
      setDeleteLoading(true)
      const response = await deleteCustomer(email,selectedCustomer?._id)
      if(response?.data?.status == 200)
      {
        showAlert(response.data.message,"success")
       setRefreshData(!refreshData)
       setDeleteCustomerModal(false)
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



  return (
    <div >

      {/* Add Customer  */}
      <Dialog
        open={addCustomerModal}
        maxWidth="xs"
        fullWidth
        // fullScreen
        onClose={() => setAddCustomerModal(false)}
        classes={{ paper: classes.modalBG }}
      >
        <BootstrapDialogTitle>Add Customer</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          <AddCustomer setAddCustomerModal={setAddCustomerModal} refreshData={refreshData} setRefreshData={setRefreshData} />

        </DialogContent>
      </Dialog>

      {/* View Customer  */}
      <Dialog
        open={viewCustomerModal}
        maxWidth="xs"
        fullWidth
        // fullScreen
        onClose={() => setViewCustomerModal(false)}
        classes={{ paper: classes.modalBG }}
      >
        <BootstrapDialogTitle>View Customer</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          <ViewCustomer data={selectedCustomer} />

        </DialogContent>
      </Dialog>

      {/* View Customer  */}
      <Dialog
        open={editCustomerModal}
        maxWidth="xs"
        fullWidth
        // fullScreen
        onClose={() => setEditCustomerModal(false)}
        classes={{ paper: classes.modalBG }}
      >
        <BootstrapDialogTitle>Edit Customer</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          <EditCustomer data={selectedCustomer} setEditCustomerModal={setEditCustomerModal} refreshData={refreshData} setRefreshData={setRefreshData} />

        </DialogContent>
      </Dialog>

      {/* Delete Product */}
      <Dialog
        open={deleteCustomerModal}
        maxWidth="sm"
        fullWidth

        onClose={() => {
          if(!deleteLoading)
          {
            setDeleteCustomerModal(false)
          }
        }}
      >
        <BootstrapDialogTitle>Delete Customer</BootstrapDialogTitle>
        <DialogContent className="pt-2">
          Are you sure to want Delete this Customer?

        </DialogContent>
        <DialogActions className="justify-content-between">
          <Button variant="contained" disabled={deleteLoading} size="small" sx={{ backgroundColor: "#29B3FD", borderColor: "#29B3FD" }} onClick={()=>customerDelete()} >Yes</Button>
          <Button variant="outlined"  disabled={deleteLoading} size="small" sx={{ borderColor: "#29B3FD" }} onClick={()=>{
            setSelectedCustomer({})
            setDeleteCustomerModal(false)

          }} >No</Button>

        </DialogActions>
      </Dialog>



      {/* <div className="flex justify-center">
        <Typography
          className={
            " text-center "
          }
          sx={{ fontSize: "2rem", color: Colors.customer.headColor, }}
          fontWeight={theme.typography.fontWeightBold}
        >
          Customers
        </Typography>
      </div> */}

      <Paper className=" mx-28" style={{ minHeight: "50vh" }} elevation={15}>
        <div className="flex justify-end mb-0 mr-2">
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: Colors.customer.buttonColor }}
            className="mt-1"
            onClick={() => setAddCustomerModal(true)}
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

        {loading ? <Loading /> : <TableContainer sx={{ overflow: "auto" }}>
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
                    color: Colors.customer.headColor,
                  }}
                  
                >
                  Name
                </TableCell>
                <TableCell
                  style={{
                    color: Colors.customer.headColor,
                  }}
                  
                >
                  CNIC
                </TableCell>
                <TableCell
                  style={{
                    color: Colors.customer.headColor,
                  }}
                  
                >
                  Contact No.
                </TableCell>


                <TableCell
                  style={{
                    color: Colors.customer.headColor,
                  }}
                  sx={{ width: "7%" }}
                  align="center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => {
                return (
                  <>
                    <TableRow key={item._id}>
                      <TableCell ><Avatar onClick={()=>{
                        setSelectedCustomer(item)
                        setViewCustomerModal(true)
                      }} className=" cursor-pointer" sx={{ width: 60, height: 60, fontSize: "2rem" }} src={item.profile_picture ? item.profile_picture : ""}>{item.profile_picture ? "" : item.name?.slice(0,2)?.toUpperCase()}</Avatar></TableCell>
                      <TableCell style={{wordBreak:"normal"}} >{item.name}</TableCell>
                      <TableCell style={{wordBreak:"normal"}} >{item.cnic}</TableCell>
                      <TableCell >
                        {item?.contact_no}
                      </TableCell>
                      <TableCell>
                        <div className=" flex ">
                        <Tooltip title="Edit Customer">
                          <IconButton onClick={()=>{
                            setSelectedCustomer(item)
                            setEditCustomerModal(true)

                          }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Customer">
                          <IconButton onClick={()=>{
                            setSelectedCustomer(item)
                            setDeleteCustomerModal(true)

                          }}>
                            <DeleteIcon />
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


export default CustomerListing