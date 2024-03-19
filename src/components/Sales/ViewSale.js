import {

    Avatar,
    MenuItem,
    TextField,
    Typography,
 
} from "@mui/material";
import React, {  useState } from "react";
import Colors from "../../utils/colors";
import "../../styles/sales.css";
import {
    PaymentMethod,
    decimalNumber,
    numberWithCommas,
} from "../../utils/customsFunctions";
import { useTheme } from "@mui/material/styles";

const ViewSales = (props) => {
    const { data } = props;
    const theme = useTheme();
    const [invoiceDetail, setInvoiceDetail] = useState(
        data.sale_details || []
    );
    const [selectedCustomer, setSelectedCustomer] = useState({name:data?.customer_name, id:data?.customer_id});
    const [vehicleNo, setVehicleNo] = useState(data.vehicle_number || "");
    const [details, setDetails] = useState(data.details || "");
    const [paymentMethod, setPaymentMethod] = useState(data.payment_method || "");
 
    const getRow = (dataArray) =>
        dataArray.map((data, index) => (
            <tr className="item-row" key={index.toString()}>
                <td className="item-name">
                    <div className="delete-wpr flex items-center gap-x-1">
                        <Avatar
                            src={data.picture}
                            sx={{
                                width: "25px",
                                height: "25px",
                                border: `2px solid ${Colors.sales.borderColor}`,
                            }}
                            variant="circular"
                        />
                        <span>{data?.code}</span>
                    </div>
                </td>
                <td className="description">
                    <span>{data.name}</span>
                </td>
                <td className="textAlign">
                    <span>{data.price}</span>
                </td>
                <td className="textAlign">
                    <span>{numberWithCommas(data.qty)}</span>
                </td>
                <td className="textAlign">
                    <span>{numberWithCommas(data.discount)}</span>
                </td>
                <td className="textAlign">
                    <span>{numberWithCommas(data.product)}</span>
                </td>
                <td className="textAlign">
                    {numberWithCommas(
                        decimalNumber(data.qty * data.price, 2) - data.discount
                    )}
                </td>
            </tr>
        ));

    const getSubtotal = (dataTable) => {
        let t = 0;
        for (let i = 0; i < dataTable.length; i += 1) {
            t += decimalNumber(dataTable[i].price * dataTable[i].qty, 2);
        }

        return decimalNumber(t, 2);
    };
    const getDiscount = (dataTable) => {
        let t = 0;
        for (let i = 0; i < dataTable.length; i += 1) {
            t += +dataTable[i].discount;
        }

        return decimalNumber(t, 2);
    };

    return (
        <div className="mt-5">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-x-3">
                <div className=" col-span-2">
                    {invoiceDetail?.length > 0 && (
                        <div id="page-wrap">
                            <table id="items">
                                <thead>
                                    <tr>
                                        <th className="textAlign">Product Code</th>
                                        <th className="textAlign">Product Name</th>
                                        <th className="textAlign">Unit Price</th>
                                        <th className="textAlign">Qty</th>
                                        <th className="textAlign">Discount</th>
                                        <th className="textAlign">Product Of</th>
                                        <th className="textAlign">Total</th>
                                    </tr>
                                </thead>
                                <tbody>{getRow(invoiceDetail)}</tbody>
                            </table>
                            <div className="grid grid-cols-3">
                                <div className=" col-span-2 bg-[#5AC6FF4F] ">
                                    <div className="flex items-center mb-3">
                                        <Typography
                                            fontWeight={theme.typography.fontWeightBold}
                                            className="ps-2"
                                            sx={{ color: Colors.sales.headColor, fontSize: "1.6rem" }}
                                        >
                                            Sub Total :
                                        </Typography>
                                        <Typography className="ms-3" sx={{ fontSize: "1.3rem" }}>
                                            {" "}
                                            {`Rs ${numberWithCommas(
                                                getSubtotal(invoiceDetail)
                                            )}`}{" "}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center ">
                                        <Typography
                                            fontWeight={theme.typography.fontWeightBold}
                                            className="ps-2"
                                            sx={{ color: Colors.sales.headColor, fontSize: "1.6rem" }}
                                        >
                                            Discount &nbsp;:
                                        </Typography>
                                        <Typography className="ms-3" sx={{ fontSize: "1.3rem" }}>
                                            {" "}
                                            {`Rs ${numberWithCommas(
                                                getDiscount(invoiceDetail)
                                            )}`}{" "}
                                        </Typography>
                                    </div>
                                </div>
                                <div className=" bg-[#568BA799] flex flex-col items-center justify-center ">
                                    <div className=" text-white font-bold text-xl">
                                        Grand Total{" "}
                                    </div>
                                    <div className="text-white font-bold text-2xl">
                                        {`Rs. ${numberWithCommas(
                                            getSubtotal(invoiceDetail) - getDiscount(invoiceDetail)
                                        )}`}{" "}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="mb-3">
                        <TextField
                            label="Customer Name"
                            fullWidth
                            size="small"
                            sx={{
                                borderColor: Colors.sales.borderColor,
                                input: {
                                    "&::placeholder": {
                                        color: Colors.sales.placeHolderColor,
                                    },
                                },
                            }}
                            inputProps={{ readOnly:true }}
                            value={selectedCustomer.name}
                            onChange={(e) => {
                                setSelectedCustomer({
                                    name: e.target.value?.split("-")?.[1],
                                    id: e.target.value?.split("-")?.[0],
                                });
                            }}
                        />
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
                                        color: Colors.sales.placeHolderColor,
                                    },
                                },
                            }}
                            value={vehicleNo}
                            onChange={(e) => setVehicleNo(e.target.value)}
                            inputProps={{ readOnly:true }}
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
                                        color: Colors.sales.placeHolderColor,
                                    },
                                },
                            }}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            inputProps={{ readOnly:true }}
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
                                            fontWeight: theme.typography.fontWeightBold,
                                        },
                                    },
                                },
                            }}
                            size="small"
                            sx={{
                                borderColor: Colors.sales.borderColor,
                                input: {
                                    "&::placeholder": {
                                        color: Colors.sales.placeHolderColor,
                                    },
                                },
                            }}
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            inputProps={{ readOnly:true }}
                        >
                            {PaymentMethod.map((item) => {
                                return (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSales;
