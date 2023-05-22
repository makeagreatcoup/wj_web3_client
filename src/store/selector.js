import {create, get, groupBy, maxBy, minBy} from 'lodash'
import { createSelector } from "@reduxjs/toolkit"
import moment from "moment"
import {hexToNumber,formatBalance} from "../utils/helpers"

import {ETHER_ADDRESS,changeEther,tokens,GREEN,RED} from "../utils/helpers"

const account=state=>get(state,"web3.account","")
export const accountSelector=createSelector(account,a=>a)

const tokenIsLoaded=state=>get(state,"token.loaded",false)
export const tokenIsLoadedSelector=createSelector(tokenIsLoaded,t=>t)

const token = state => get(state, 'token.contract')
export const tokenSelector = createSelector(token, t => t)

const exchangeIsLoaded=state=>get(state,"exchange.loaded",false)
export const exchangeIsLoadedSelector=createSelector(exchangeIsLoaded,t=>t)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

export const allLoadedSelector=createSelector(tokenIsLoaded,exchangeIsLoaded,(t1,t2)=>(t1&&t2))


//所有订单
const allOrdersLoaded=state=>get(state,"exchange.allOrders.loaded",false)
const allOrders=state=>get(state,"exchange.allOrders.data",[])

//取消的订单
const cancelOrdersLoaded=state=>get(state,"exchange.cancelOrders.loaded",false)
export const cancelOrdersLoadedSeletor=createSelector(cancelOrdersLoaded,loaded=>loaded)

const cancelOrders=state=>get(state,"exchange.cancelOrders.data",[])
export const cancelOrdersSelector=createSelector(cancelOrders,o=>o)

//交易的订单
const tradeOrdersLoaded=state=>get(state,"exchange.tradeOrders.loaded",false)
export const tradeOrdersLoadedSeletor=createSelector(tradeOrdersLoaded,loaded=>loaded)

const tradeOrders=state=>get(state,"exchange.tradeOrders.data",[])
export const tradeOrdersSelector=createSelector(tradeOrders,
    (orders)=>{
        //升序
        orders=orders.sort((a,b)=>a.timestamp-b.timestamp)

        orders=decorateTradeOrders(orders)
        //按时间降序
        orders=orders.sort((a,b)=>b.timestamp-a.timestamp)

        return orders

})
//装饰交易订单的数据
const decorateTradeOrders=(orders)=>{
    let previousOrder
    return (
        orders.map((order)=>{
            order=decorateOrder(order)
            previousOrder=decorateOrder(orders[0])
            order=decorateTradeOrder(order,previousOrder)
            previousOrder=order
            return order
        })
    )
}
//装饰订单数据
const decorateOrder=(order)=>{

    let etherAmount,tokenAmount
    if(order.from === ETHER_ADDRESS){
        etherAmount=order.fromAmount
        tokenAmount=order.toAmount
    }else{
        etherAmount=order.toAmount
        tokenAmount=order.fromAmount
    }

    const precision=100000
    let tokenPrice=(etherAmount/tokenAmount)
    tokenPrice=Math.round(tokenPrice*precision)/precision
    return (
        {
            ...order,
            id:hexToNumber(order.id),
            etherAmount:changeEther(etherAmount),
            tokenAmount:tokens(tokenAmount),
            tokenPrice,
            formatTime:moment.unix(order.timestamp).format('h:mm:ss a M/D'),
            formatshotTime:moment.unix(order.timestamp).format('LTS'),
            formatChineseTime:moment.unix(order.timestamp).format('lll'),
        }
    )

}
const decorateTradeOrder=(order,previousOrder)=>{
    let typeClass 
    if(previousOrder.id === order.id){
        typeClass= GREEN
    }
    if(previousOrder.tokenPrice<=order.tokenPrice){
        typeClass= GREEN
    }else{
        typeClass= RED
    }

    return (
        {
            ...order,
            typeClass
        }
    )
}

const openOrders = state =>{
    const all=allOrders(state)
    const cancel=cancelOrders(state)
    const trade=tradeOrders(state)
    //排除已取消订单和已完成订单
    const openOrders=all.filter(o=>!cancel.find(co=>
        hexToNumber(co.id)===hexToNumber(o.id)
    ) && !trade.find(t=>
        hexToNumber(t.id)===hexToNumber(o.id)
    ))
    return openOrders
}

const orderBookLoaded=state=>cancelOrdersLoaded(state) && tradeOrdersLoaded(state) && allOrdersLoaded(state)
export  const orderBookLoadedSelector=createSelector(orderBookLoaded,loaded=>loaded)

//订单簿数据
export const orderBookSelector=createSelector(openOrders,
    (orders)=>{
        orders=decorateOrderBookOrders(orders)
        orders=groupBy(orders,o=>o.orderType)
        const buy=get(orders,"buy",[])
        const sell=get(orders,"sell",[])
        orders={
            ...orders,
            buyOrders:buy.sort((a,b)=>b.tokenPrice-a.tokenPrice),
            sellOrders:sell.sort((a,b)=>a.tokenPrice-b.tokenPrice),
        }
        return orders

})
const decorateOrderBookOrders=(orders)=>{
    return (
        orders.map((order)=>{
            order=decorateOrder(order)
            order=decorateOrderBookOrder(order)
            return order
        }  
        )
    )
}
const decorateOrderBookOrder=(order)=>{
    const orderType = order.to === ETHER_ADDRESS ? "buy" : "sell"
    return (
        {
            ...order,
            
            orderType,
            typeClass: orderType === "buy" ? GREEN : RED,
            orderTradeClass: orderType === "buy" ? 'sell' : 'buy',
        }
        )
}


//我的交易订单数据
export const myOrdersLoadedSelector=createSelector(tradeOrdersLoaded,loaded=>loaded)

export const myOrdersSelector=createSelector(
    tradeOrders,
    //重点，忽略传递的第一个参数，
    //如果不传state，selector在action执行之后，将获取不到action得到的结果数据；
    //如果不忽略第一个参数state，直接写account，得到的account为state对象
    (_,account)=>account,                       
    (orders,account)=>{
        orders=orders.filter(
            o=>o.user===account||o.userFill ===account)
            orders=decorateMyOrders(orders,account)
        return orders

}

)
const decorateMyOrders=(orders,account)=>{
    return (
        orders.map((order)=>{
            order=decorateOrder(order)
            order=decorateMyOrder(order,account)
            return order
        }  
        )
    )
}

const decorateMyOrder=(order,account)=>{
    const orderType = 
    order.user === account ? 
    order.to === ETHER_ADDRESS ? "buy" : "sell" : 
    order.to === ETHER_ADDRESS ? "sell" : "buy" 
    return (
        {
            ...order,
            orderType,
            typeClass: orderType === "buy" ? GREEN : RED,
            orderSign: orderType === "buy" ? '+' : '-',
        }
        )
}

//我的未完成的订单
export const myOpenOrdersLoadedSelector=createSelector(orderBookLoaded,loaded=>loaded)
export const myOpenOrdersSelector=createSelector(openOrders,
    //重点，忽略传递的第一个参数，
    //如果不传state，selector在action执行之后，将获取不到action得到的结果数据；
    //如果不忽略第一个参数state，直接写account，得到的account为state对象
    (state,account)=>account, 
    (orders,account)=>{
        orders=orders.filter(
            o=>o.user===account)
            orders=decorateMyOpenOrders(orders)
            orders=orders.sort((a,b)=>b.timestamp-a.timestamp)
        return orders

})
const decorateMyOpenOrders=(orders)=>{
    return (
        orders.map((order)=>{
            order=decorateOrder(order)
            order=decorateMyOpenOrder(order)
            return order
        })
    )
}

const decorateMyOpenOrder=(order)=>{
    const orderType = order.to === ETHER_ADDRESS ? "buy" : "sell"
    return (
        {
            ...order,
            orderType,
            typeClass: orderType === "buy" ? GREEN : RED,
        }
        )
}


//------------------------------------------------
//取消订单状态
const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(orderCancelling, (status) => status)

const orderFilling = state => get(state, 'exchange.orderFilling', false)
export const orderFillingSelector = createSelector(orderFilling, (status) => status)

//-------------------------------------------------
//余额相关数据
const balancesLoading = state => get(state, 'exchange.balanceLoading', true)
export const balancesLoadingSelector = createSelector(balancesLoading, status => status)

const etherBalance = state => get(state, 'web3.balance', 0)
export const etherBalanceSelector = createSelector(
	etherBalance,
	(balance) => {
		return formatBalance(balance)
	}
)

const tokenBalance = state => get(state, 'token.balance', 0)
export const tokenBalanceSelector = createSelector(
	tokenBalance,
	(balance) => {
		return formatBalance(balance)
	}
)


const exchangeEtherBalance = state => get(state, 'exchange.etherBalance', 0)
export const exchangeEtherBalanceSelector = createSelector(
	exchangeEtherBalance,
	(balance) => {
		return formatBalance(balance)
	}
)

const exchangeTokenBalance = state => get(state, 'exchange.tokenBalance', 0)
export const exchangeTokenBalanceSelector = createSelector(
	exchangeTokenBalance,
	(balance) => {
		return formatBalance(balance)
	}
)

const etherDepositAmount = state => get(state, 'exchange.etherDepositAmount',null)
export const etherDepositAmountSelector = createSelector(etherDepositAmount, amount => amount)

const etherWithdrawAmount = state => get(state, 'exchange.etherWithdrawAmount', null)
export const etherWithdrawAmountSelector = createSelector(etherWithdrawAmount, amount => amount)

const tokenDepositAmount = state => get(state, 'exchange.tokenDepositAmount', null)
export const tokenDepositAmountSelector = createSelector(tokenDepositAmount, amount => amount)

const tokenWithdrawAmount = state => get(state, 'exchange.tokenWithdrawAmount', null)
export const tokenWithdrawAmountSelector = createSelector(tokenWithdrawAmount, amount => amount)

const buyOrder = state => get(state, 'exchange.buyOrder', {})
export const buyOrderSelector = createSelector(buyOrder, order => order)

const sellOrder = state => get(state, 'exchange.sellOrder', {})
export const sellOrderSelector = createSelector(sellOrder, order => order)

//-------------------------------------------------
// chart图表数据
export const priceChartLoadedSelector = createSelector(tradeOrdersLoaded, loaded => loaded)
export const priceChartSelector = createSelector(tradeOrders, (orders) => {
    orders = orders.sort((a,b) => a.timestamp - b.timestamp)
		orders = orders.map((o) => decorateOrder(o))
		let secondLastOrder, lastOrder
		[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
		const lastPrice = get(lastOrder, 'tokenPrice', 0)
		const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

		return({
			lastPrice,
			lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
			series: [{
				data: buildGraphData(orders)
			}]
		})
})
const buildGraphData = (orders) => {
    orders=groupBy(orders,(o)=>moment.unix(o.timestamp).startOf('hour').format())
    const hours = Object.keys(orders)
	const graphData = hours.map((hour) => {
		const group = orders[hour]
		const open = group[0]
		const high = maxBy(group, 'tokenPrice')
		const low = minBy(group, 'tokenPrice')
		const close = group[group.length - 1]

		return({
			x: new Date(hour),
			y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
		})
	})
	return graphData
}
