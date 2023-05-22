/**
 * 这里的函数是定义行为给interaction使用，页面通过dispatch调用
 */

export function web3Loaded(connection){
    return{
        type:"LOADED",
        connection
    }
}

export function accountLoaded(account){
    return{
        type:"ACCOUNT_LOADED",
        account
    }
}
export function tokenLoaded(contract){
    return{
        type:"TOKEN_LOADED",
        contract
    }
}
export function exchangeLoaded(contract){
    return{
        type:"EXCHANGE_LOADED",
        contract
    }
}

export function cancelOrdersLoaded(cancelOrders){
    return{
        type:"CANCEL_ORDERS_LOADED",
        cancelOrders
    }
}

export function tradeOrdersLoaded(tradeOrders){
    return{
        type:"TRADE_ORDERS_LOADED",
        tradeOrders
    }
}

export function allOrdersLoaded(allOrders){
    return{
        type:"ALL_ORDERS_LOADED",
        allOrders
    }
}

export function orderCancelling() {
	return {
		type: 'ORDER_CANCELLING'
	}
}
export function orderCancelled(cancelId) {
	return {
		type: 'ORDER_CANCELLED',
		cancelId
	}
}

//-----------------------------------------------
//balance余额数据
export function balanceLoaded(){
    return{
        type:"BALANCE_LOADED",
        
    }
}
export function balanceLoading(){
    return{
        type:"BALANCE_LOADING",
        
    }
}

export function etherBalanceLoaded(balance){
    return{
        type:"ETHER_BALANCE_LOADED",
        balance
    }
}
export function tokenBalanceLoaded(balance){
    return{
        type:"TOKEN_BALANCE_LOADED",
        balance
    }
}
export function exchangeEtherBalanceLoaded(balance){
    return{
        type:"EXCHANGE_ETHER_BALANCE_LOADED",
        balance
    }
}
export function exchangeTokenBalanceLoaded(balance){
    return{
        type:"EXCHANGE_TOKEN_BALANCE_LOADED",
        balance
    }
}

//----------------------------------------------------------
//修改数据
export function etherDepositAmountChanged(amount) {
	return {
		type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
		amount
	}
}

export function etherWithdrawAmountChanged(amount) {
    return {
		type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
		amount
	}
}
export function tokenDepositAmountChanged(amount) {
	return {
		type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
		amount
	}
}
export function tokenWithdrawAmountChanged(amount) {
    return {
		type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
		amount
	}
}

//------------------------------------------------------
//新建订单相关
export function buyOrderAmountChanged(amount) {
	return {
		type: 'BUY_ORDER_AMOUNT_CHANGED',
		amount
	}
}

export function buyOrderPriceChanged(price) {
	return {
		type: 'BUY_ORDER_PRICE_CHANGED',
		price
	}
}

export function buyOrderMaking() {
	return {
		type: 'BUY_ORDER_MAKING',
	}
}

export function orderMade(order) {
	return {
		type: 'ORDER_MADE',
		order
	}
}

export function sellOrderAmountChanged(amount) {
	return {
		type: 'SELL_ORDER_AMOUNT_CHANGED',
		amount
	}
}

export function sellOrderPriceChanged(price) {
	return {
		type: 'SELL_ORDER_PRICE_CHANGED',
		price
	}
}

export function sellOrderMaking() {
	return {
		type: 'SELL_ORDER_MAKING',
	}
}