import { Autocomplete, Avatar, MenuItem, TextField, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Colors from "../../utils/colors";
import '../../styles/sales.css'
import { PaymentMethod, decimalNumber, numberWithCommas } from "../../utils/customsFunctions";
import { useTheme } from "@mui/material/styles";
import { getAllCustomer } from "../../services/customer.service";
import { getAllProduct } from "../../services/product.service";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { useSnackbar } from 'notistack'
import { saleAdd } from "../../services/sale.service";
import { getAllInventory } from "../../services/inventory.service";
import { getAllproductOf } from "../../services/productOf.service";


const AddSales = (props) => {
    const {setAddSaleModal , refreshData,
        setRefreshData} = props
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const email = sessionStorage.getItem("email")
    const [invoiceDetail, setInvoiceDetail] = useState([])
    const [allCustomer, setAllCustomer] = useState([])
    const [allProduct, setAllProduct] = useState([])
    const [selectProduct, setSelectProduct] = useState("")
    const [selectedCustomer, setSelectedCustomer] = useState({})
    const [vehicleNo,setVehicleNo] = useState("")
    const [details,setDetails] = useState("")
    const [paymentMethod,setPaymentMethod] = useState("")
    const [loading,setLoading] = useState(false)
    const [allProductOf,setAllProductOf] = useState([])
    const [allInventory,setAllInventory] = useState([])

    useEffect(() => {
        const getCustomerData = async () => {
            try {
                const response = await getAllCustomer(email)
                if (response.status == 200) {
                    setAllCustomer(response.data.data)
                } else {
                    setAllCustomer([])
                }

            } catch (err) {
                setAllCustomer([])
            }
        }
        const getProductData = async () => {
            try {
                const response = await getAllProduct(email)
                if (response.status == 200) {
                    setAllProduct(response.data.data)
                } else {
                    setAllProduct([])
                }

            } catch (err) {
                setAllProduct([])

            }
        }
        const getInventoryData = async () => {
            try {
                const response = await getAllInventory(email)
                if (response.status == 200) {
                    setAllInventory(response.data.data)
                } else {
                    setAllInventory([])
                }

            } catch (err) {
                setAllInventory([])
            }
        }

        const getProductOfData = async () => {
            try {
                const response = await getAllproductOf(email)
                if (response.status == 200) {
                    setAllProductOf(response.data.data)
                } else {
                    setAllProductOf([])
                }

            } catch (err) {
                setAllInventory([])
            }
        }

        getCustomerData()
        getProductData()
        getInventoryData()
        getProductOfData()

    }, [])


    const newProductAdd = (code, name, price, picture, watt) => ({
        code,
        name,
        price: parseFloat(price || "0"),
        qty: "",
        discount: "",
        product_of: "",
        total: "",
        picture,
        watt,
        product_of_id:""
    });

    const updateItem = (id, itemAttributes) => {
        try {
            const index = invoiceDetail.findIndex(x => x.code === id);
            
            if (index === -1) {
                console.error('Something wen\'t wrong');
            } else {
                const data = [
                    ...invoiceDetail.slice(0, index),
                    { ...invoiceDetail[index], ...itemAttributes },
                    ...invoiceDetail.slice(index + 1)
                ];
                console.log("date---", data)
                setInvoiceDetail([...data])
            }


        } catch (err) {
            console.log("Error====", err)
        }
    };
    const handleChangeTable = (name, id,event) => {
        
        if(name == "product_of")
        {
            updateItem(id, { [name]: event.target.value?.split("-")?.[0], product_of_id:event.target.value?.split("-")?.[1] });


        }else{
            updateItem(id, { [name]: event.target.value });

        }

        
    };

    const handleChangePrice = (name, id,event)  => {

        updateItem(id, { [name]: event.target.value?.replace(/[^0-9]/gi, "") });

    };
    const getRow = dataArray => dataArray.map((data, index) => (
        <tr className="item-row" key={index.toString()}>
            <td className="item-name">
                <div className="delete-wpr flex items-center gap-x-1">
                    <Avatar src={data.picture} sx={{ width: '25px', height: '25px', border: `2px solid ${Colors.sales.borderColor}`, }} variant="circular" />
                    <span>{data?.code}</span>

                    <a className="delete" href="#" onClick={(e) => handleRemoveRow(e, data)} title="Remove row">X</a>
                </div>
            </td>
            <td className="description">
                <span>{data.name}</span>
            </td>
            <td className="textAlign">
                <span>{data.watt}</span>
            </td>
            <td className="textAlign">
                <span>{data.price}</span>
            </td>
            <td className="textAlign">
                <textarea value={numberWithCommas(data.qty)} onChange={(e)=>
                {
                    if(data.product_of)
                    {
                        handleInventoryItem("qty", data, e)
                    }else{
                        handleChangePrice('qty', data?.code,e)
                    }
                }} />   
            </td>
            <td className="textAlign">
                <textarea value={numberWithCommas(data.discount)} onChange={(e)=>handleChangePrice('discount', data?.code,e)} />
            </td>
            <td className="textAlign">
                <TextField  
                size="small"
                fullWidth
                sx={{ color: Colors.customer.textFieldColor, borderColor: Colors.customer.borderColor, border:0 }}
                select
                value={`${data.product_of}-${data.product_of_id}` || ""}
                onChange={(e)=>{
                    // if(+data.qty > 0)
                    // {
                        handleInventoryItem("product_of", data, e)

                    // }else{
                    //     handleChangeTable("product_of", data.code, e)
                    // }

                }}
                >
                {allProductOf.map(item=>{
                    return <MenuItem key={item._id} value={`${item.name}-${item._id}`}>{item.name}</MenuItem>
                })}

                </TextField>
            </td>
            <td className="textAlign" >

                {numberWithCommas(decimalNumber(data.qty * data.price, 2) - data.discount)}

            </td>

        </tr>
    ));

    const handleInventoryItem =(name,data,event)=>{
        if(name == "product_of")
        {
        let findInventoryItem = allInventory.find(item => item.product_code == data.code && item.product_of_id == event.target.value?.split("-")?.[1])
        if(findInventoryItem)
        {
            if(+findInventoryItem.quantity >= +data.qty)
            {
                handleChangeTable(name, data.code, event)
            }else{
                showAlert(`Max Quantity Limit is ${findInventoryItem.quantity}`,"error")
            }
        }else{
            showAlert(`This Product is not Available in Inventory`,"error")
        }
    }else if(name == "qty")
    {
        let findInventoryItem = allInventory.find(item => item.product_code == data.code && item.product_of_id == data.product_of_id)
        if(findInventoryItem)
        {
            if(+findInventoryItem.quantity >= +event.target.value?.replace(/[^0-9]/gi, ""))
            {
                handleChangePrice(name, data.code, event)
            }else{
                showAlert(`Max Quantity Limit is ${findInventoryItem.quantity}`,"error")
            }
        }else{
            showAlert(`This Product is not Available in Inventory`,"error")
        }

    }

    }


    const handleRemoveRow = (e, target) => {
        e.preventDefault();
        setInvoiceDetail([...invoiceDetail.filter(item => item.code != target.code)])


    };

    const getSubtotal = (dataTable) => {
        let t = 0;
        for (let i = 0; i < dataTable.length; i += 1) {
            t += (decimalNumber(dataTable[i].price * dataTable[i].qty, 2));
        }

        return decimalNumber(t, 2);



    }
    const getDiscount = (dataTable) => {
        let t = 0;
        for (let i = 0; i < dataTable.length; i += 1) {
            t += parseFloat(dataTable[i].discount);
        }

        return decimalNumber(t, 2);



    }

    
    const saleAddData = async()=>{
        try{
            if(invoiceDetail?.length == 0) throw "Please Select Products"
            if(!selectedCustomer?.name?.trim()) throw "Please Select Customer"
            if(!paymentMethod?.trim()) throw "Please Select Payment Mehod"
            setLoading(true)
            const response =await saleAdd(email,invoiceDetail,selectedCustomer?.name,selectedCustomer?.id,getDiscount(invoiceDetail), getSubtotal(invoiceDetail),getSubtotal(invoiceDetail) - getDiscount(invoiceDetail),selectedCustomer?.id == "Walk-In Customer" ? "Walk-In" : "Regular",vehicleNo,details,paymentMethod)
    
            if(response?.data?.status == 200)
            {
                setLoading(false);
                setRefreshData(!refreshData)
                showAlert(response.data.message,"success")
                setAddSaleModal(false)
    
    
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
    
    const showAlert = (message,type)=>{
            
        return(
          enqueueSnackbar(message,{variant:type,autoHideDuration:2000, anchorOrigin:{horizontal:"right", vertical:'top'}})
        )
      }

    return (
        <div className="mt-5">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-x-3">
                <div className=" col-span-2">
                    <div style={{ padding: "0 0 0 20px" }}>
                        <Autocomplete
                            disableClearable={!selectProduct}
                            size="small"
                            sx={{
                                width: "100%",
                            }}
                            options={
                                !allProduct
                                    ? [{ name: "Loading...", id: 0 }]
                                    : allProduct.filter(item => invoiceDetail.findIndex(item2 => item2.code == item.code) == -1)
                            }
                            getOptionLabel={(option) => `${option?.name} (${option?.code})` || ""}
                            onClose={(event, reason) => {
                                if (reason != "selectOption") {
                                    selectProduct
                                        ? allProduct.find(
                                            (item) => item._id == selectProduct
                                        )?.name || setSelectProduct("")
                                        : setSelectProduct("");
                                }
                            }}
                            inputValue={selectProduct || ""}
                            value={selectProduct || ""}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Product name or Product Code"
                                    margin="none"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        borderColor: Colors.sales.borderColor,
                                        input: {
                                            "&::placeholder": {
                                                color: Colors.sales.placeHolderColor
                                            }
                                        }
                                    }}
                                    onChange={(e) => {
                                        setSelectProduct(e.target.value)
                                    }}
                                />
                            )}
                            onChange={(e, value) => {
                                if (value?.code) {
                                    setSelectProduct("")
                                    setInvoiceDetail([...invoiceDetail, newProductAdd(value?.code, value?.name, value?.price, value?.picture, value?.watt)])
                                }
                            }}
                            renderOption={(props, option, { inputValue }) => {
                                const matches = match(`${option?.name} (${option?.code})` , inputValue, {
                                    insideWords: true,
                                });
                                const parts = parse(`${option?.name} (${option?.code})`, matches);
                                return (
                                    <li {...props} key={option?._id}>
                                        <div>
                                            {parts.map((part, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        fontWeight: part.highlight ? 700 : 400,
                                                    }}
                                                >
                                                    {part.text}
                                                </span>
                                            ))}
                                        </div>
                                    </li>
                                );
                            }}
                        />


                    </div>
                    {invoiceDetail?.length > 0 &&
                        <div id="page-wrap">
                            <table id="items">
                                <thead>
                                    <tr>
                                        <th className="textAlign">Product Code</th>
                                        <th className="textAlign">Product Name</th>
                                        <th className="textAlign">Watt</th>
                                        <th className="textAlign">Unit Price</th>
                                        <th className="textAlign">Qty</th>
                                        <th className="textAlign">Discount</th>
                                        <th className="textAlign">Product Of</th>
                                        <th className="textAlign">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getRow(invoiceDetail)}





                                </tbody>
                            </table>
                            <div className="grid grid-cols-3">
                                <div className=" col-span-2 bg-[#5AC6FF4F] ">
                                    <div className="flex items-center mb-3">
                                        <Typography fontWeight={theme.typography.fontWeightBold} className="ps-2" sx={{ color: Colors.sales.headColor, fontSize: '1.6rem' }} >Sub Total :</Typography>
                                        <Typography className="ms-3" sx={{ fontSize: '1.3rem' }} >   {`Rs ${numberWithCommas(getSubtotal(invoiceDetail))}`} </Typography>
                                    </div>
                                    <div className="flex items-center ">
                                        <Typography fontWeight={theme.typography.fontWeightBold} className="ps-2" sx={{ color: Colors.sales.headColor, fontSize: '1.6rem' }} >Discount &nbsp;:</Typography>
                                        <Typography className="ms-3" sx={{ fontSize: '1.3rem' }} >   {`Rs ${numberWithCommas(getDiscount(invoiceDetail))}`} </Typography>
                                    </div>

                                </div>
                                <div className=" bg-[#568BA799] flex flex-col items-center justify-center ">
                                    <div className=" text-white font-bold text-xl">Grand Total </div>
                                    <div className="text-white font-bold text-2xl">{`Rs. ${numberWithCommas(getSubtotal(invoiceDetail) - getDiscount(invoiceDetail))}`} </div>

                                </div>

                            </div>
                        </div>}

                </div>
                <div >
                    <div className="mb-3">
                        <TextField
                            label="Customer Name"
                            select
                            fullWidth
                            size="small"
                            sx={{
                                borderColor: Colors.sales.borderColor,
                                input: {
                                    "&::placeholder": {
                                        color: Colors.sales.placeHolderColor
                                    }
                                }
                            }}

                            value={selectedCustomer.name}
                            onChange={(e)=>{
                                setSelectedCustomer({name:e.target.value?.split("-")?.[1],
                                id:e.target.value?.split("-")?.[0]})
                            }}

                        >
                            <MenuItem value={"Walk In Customer-Walk In Customer"}>Walk-In Customer</MenuItem>
                            {allCustomer.map(item => {
                                return (
                                    <MenuItem key={item._id} value={`${item._id}-${item.name}`} >{item.name}</MenuItem>
                                )
                            })}
                        </TextField>
                    </div>
                    <div className="mb-3">
                        <TextField
                            size="small"
                            label="Vehicle No"
                            fullWidth
                            sx={{
                                borderColor: Colors.sales.borderColor,
                                input: {
                                    "&::placeholder": {
                                        color: Colors.sales.placeHolderColor
                                    }
                                }
                            }}

                            value={vehicleNo}
                            onChange={(e)=>setVehicleNo(e.target.value)}

                        />
                    </div>
                    <div className="mb-3">
                        <TextField
                            size="small"
                            label="Details"
                            multiline
                            rows={5}
                            fullWidth
                            sx={{
                                borderColor: Colors.sales.borderColor,
                                input: {
                                    "&::placeholder": {
                                        color: Colors.sales.placeHolderColor
                                    }
                                }
                            }}
                            value={details}
                            onChange={(e)=>setDetails(e.target.value)}

                        />
                    </div>
                    <div className="mb-3">
                        <TextField
                            label="Payment Method"
                            select
                            fullWidth
                            SelectProps={{
                                MenuProps: {
                                    sx: {
                                        ".MuiList-root": {
                                            backgroundColor: Colors.sales.dropDownMenuColor,
                                            fontWeight: theme.typography.fontWeightBold
                                        }
                                    }
                                }
                            }}
                            size="small"
                            sx={{
                                borderColor: Colors.sales.borderColor,
                                input: {
                                    "&::placeholder": {
                                        color: Colors.sales.placeHolderColor
                                    }
                                }
                            }}
                            value={paymentMethod}
                            onChange={(e)=>setPaymentMethod(e.target.value)}

                        >
                            {PaymentMethod.map(item => {
                                return (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                )
                            })}
                        </TextField>
                    </div>
                    <div className="mb-3">
                <Button className="fw-bold"
                     onClick={()=>saleAddData()}
                    disabled={loading}
                    sx={{ backgroundColor: Colors.sales.buttonColor }} fullWidth variant="contained" >Proceed</Button>

            </div>

                </div>

            </div>

        </div>
    )
}

export default AddSales