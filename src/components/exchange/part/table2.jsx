import React from "react"

import {Spinner} from "./spinner";

export const TablePart2 = ({type,loaded,orders,buyOrders,sellOrders}) => {
  const showOrder=(order)=>{
    return(
          <tr className={`order-${order.id}`} key={order.id}>
						<td className="text-left w-1/3  text-ssm" style={{color:['success','buy'].includes(order.typeClass) ?'#22c55e':'#E24056'}}>{order.tokenPrice}</td>
            <td className="text-center w-1/3 text-[10px]">{order.tokenAmount}</td>
						<td className="text-muted text-right w-1/3 text-[10px]">{order.formatshotTime}</td>

					</tr>
      
   )}

    //普通展示订单
    const showOrders=(orders)=>{
      return (
        <tbody>
          <tr >
          <th className="text-left w-1/3 text-[10px]">价格</th>
          <th className="text-center w-1/3 text-[10px]">数量</th>
          <th className="text-right w-1/3 text-[10px]">时间</th>
          </tr>
          {orders.map((order)=>showOrder(order))}
        </tbody>
      )
    }

    //展示订单簿
   const showOrderBook=(buyOrders,sellOrders)=>{
    const showBuyOrders=buyOrders.map((order)=>showOrder(order))
    const showSellOrders=sellOrders.map((order)=>showOrder(order))
    return(
      <tbody>
          {showBuyOrders}
          <tr>
            <th className="text-left w-1/3 text-[10px]">价格</th>
						<th className="text-center w-1/3 text-[10px]">数量</th>
						<th className="text-right w-1/3 text-[10px]">时间</th>
          </tr>
          {showSellOrders}   
      </tbody>
          
      
   )}

  return (
    <div className={`w-full  h-80 ${loaded?' overflow-y-scroll':''}`}>
      <table className="table-compact table w-full text-center">
        {loaded?
        (type==1?showOrderBook(buyOrders,sellOrders):showOrders(orders)):<Spinner type="table" />}
      </table>
    </div>
  )
}
