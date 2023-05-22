import React from 'react'
import { cancelOrder } from '../../../store/interaction'
import { Spinner } from './spinner'

export const TablePart = ({orders,type,exchange,dispatch,signer,loaded}) => {
  
  const tdClass=(type,data,data2)=>{
    return (
      <td style={{color:['success','buy'].includes(type) ?'#22c55e':'#E24056'}}>{data}{data2}
            </td>
    )
  }

  return (
    <div className=" w-full  h-48 overflow-y-auto ">
      <table className="table-compact table table-fixed w-full ">
        <thead>
        <tr className="text-center">
            <th className='w-1/12'>序号</th>
            <th>订单id</th>
            <td>数量</td>
            <td>单价(eth)</td>
            <td>总价(eth)</td>
            <td>时间</td>
            <th>{type === "1" ? "操作":""}</th>
          </tr>
          
        </thead>
        {loaded?
        <tbody>
        {orders.map((order,index) => (
          <tr className="text-center" key={order.id}>
            <td>{index+1}</td>
            <td>{order.id}</td> 
            {tdClass(order.typeClass,order.orderSign,order.tokenAmount)}
            {tdClass(order.typeClass,order.tokenPrice)}
            {tdClass(order.typeClass,order.etherAmount)}
            <td>{order.formatChineseTime}</td>
            <td >
            {type === "1" ? 
              <a className="underline hover:cursor-pointer" onClick={(e)=>{
                cancelOrder(dispatch,exchange,order,signer)
              }}>取消</a>:<a></a>
              }</td>
          </tr>
        ))}
      </tbody>
        :<Spinner type="table" />}
        
      </table>
    </div>
  )
}
