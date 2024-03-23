export function numberWithCommas(amount){
  
    if(amount==='NaN' || isNaN(amount) || amount==='' || amount===undefined){
       return ''
    }else{
      return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }
  }
export function decimalNumber(value, to){
    let number = parseFloat(value || "0").toFixed(to)  
    return parseFloat(number)
  
  }
export const  PaymentMethod = ["Cash", "Bank AL Habib 00965-45297841", "Soneri Bank 00789-5464644644"]

export const PageHeadTitle = {
  sale :"Sales",
  product : "Products",
  customer : "Customers",
  productof : "ProductOf",
  inventory : "Inventory"
}