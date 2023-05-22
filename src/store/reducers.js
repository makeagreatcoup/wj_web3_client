/**
 * 触发对应action返回state
 * 监视器，监视action被触发，redux显示state，可添加数据
 * 还可用于选择器selector，处理获取的数据
 */
import {combineReducers} from 'redux';
import {hexToNumber} from "../utils/helpers"

function web3(state = {},action){
    switch(action.type){
        case 'LOADED':
            return {...state,connection:action.connection}
        case 'ACCOUNT_LOADED':
            return {...state,account:action.account}
        case 'ETHER_BALANCE_LOADED':
            return { ...state, balance: action.balance }
        default:
            return state
    }
}

function token(state = {},action){
    switch(action.type){
        case 'TOKEN_LOADED':
            return {...state,loaded:true,contract:action.contract}
        case 'TOKEN_BALANCE_LOADED':
            return {...state,balance:action.balance}
        default:
            return state
    }
}

function exchange(state = {},action){
    let index,data,order
    switch(action.type){
        case 'EXCHANGE_LOADED':
            return {...state,loaded:true,contract:action.contract}
        case 'CANCEL_ORDERS_LOADED':
            return {...state,cancelOrders:{loaded:true,data:action.cancelOrders}}
        case 'TRADE_ORDERS_LOADED':
            return {...state,tradeOrders:{loaded:true,data:action.tradeOrders}}
        case 'ALL_ORDERS_LOADED':
            return {...state,allOrders:{loaded:true,data:action.allOrders}}
        case 'ORDER_CANCELLING':
            return { ...state, orderCancelling: true }
        case 'ORDER_CANCELLED':
            index = state.allOrders.data.findIndex(
                order => hexToNumber(order.id) === hexToNumber(action.cancelId))

            order = state.allOrders.data[index]
            return { ...state, orderCancelling: false,
                cancelOrders: {
                    ...state.cancelOrders,
                    data: [...state.cancelOrders.data, order]
                }
            }
        case 'EXCHANGE_ETHER_BALANCE_LOADED':
            return { ...state, etherBalance: action.balance }
        case 'EXCHANGE_TOKEN_BALANCE_LOADED':
            return { ...state, tokenBalance: action.balance }
        case 'BALANCE_LOADING':
            return { ...state, balanceLoading: true }
        case 'BALANCE_LOADED':
            return { ...state, balanceLoading: false }

        case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
            return { ...state, etherDepositAmount: action.amount }
        case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
			return { ...state, etherWithdrawAmount: action.amount }
		case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
			return { ...state, tokenDepositAmount: action.amount }
		case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
			return { ...state, tokenWithdrawAmount: action.amount }


        case 'ORDER_MADE':
            index = state.allOrders.data.findIndex(order => hexToNumber(order.id) === hexToNumber(action.order.id))

            if(index === -1) {
                data = [...state.allOrders.data, action.order]
            } else {
                data = state.allOrders.data
            }

            return {
                ...state,
                allOrders: {
                    ...state.allOrders,
                    data
                },
                buyOrder: {
                    ...state.buyOrder,
                    making: false
                },
                sellOrder: {
                    ...state.sellOrder,
                    making: false
                }
            }
        case 'BUY_ORDER_AMOUNT_CHANGED':
            return { ...state, buyOrder: { ...state.buyOrder, amount: action.amount } }
        case 'BUY_ORDER_PRICE_CHANGED':
            return { ...state, buyOrder: { ...state.buyOrder, price: action.price } }
        case 'BUY_ORDER_MAKING':
            return { ...state, buyOrder: { ...state.buyOrder, amount: null, price: null, making: true } }
        case 'SELL_ORDER_AMOUNT_CHANGED':
            return { ...state, sellOrder: { ...state.sellOrder, amount: action.amount } }
        case 'SELL_ORDER_PRICE_CHANGED':
            return { ...state, sellOrder: { ...state.sellOrder, price: action.price } }
        case 'SELL_ORDER_MAKING':
            return { ...state, sellOrder: { ...state.sellOrder, amount: null, price: null, making: true } }
    
        default:
            return state
    }
}

const rootReducer =combineReducers({
    web3,token,exchange
})

export default rootReducer