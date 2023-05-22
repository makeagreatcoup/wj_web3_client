/**
 * 用户的交互函数，通过dispatch触发相应的action
 */
import {ethers} from "ethers"
import {web3Loaded,accountLoaded,tokenLoaded,exchangeLoaded,cancelOrdersLoaded,tradeOrdersLoaded,allOrdersLoaded, orderCancelled,orderCancelling,
balanceLoaded,balanceLoading,etherBalanceLoaded,tokenBalanceLoaded,exchangeEtherBalanceLoaded,exchangeTokenBalanceLoaded, buyOrderMaking, sellOrderMaking, orderMade,
} from "./action"
import {tokenABI,tokenAddress,exchangeABI,exchangeAddress} from '../utils/constants';
import { error } from "daisyui/src/colors";
import { ETHER_ADDRESS, changeEther, parseEther } from "../utils/helpers";

export const Loading=(dispatch)=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(web3Loaded(provider))
    return provider
}
export const AccountLoading=(dispatch,provider)=>{
    const account = provider.getSigner();
    dispatch(accountLoaded(account))
    return account
}

export const TokenLoading=(dispatch,provider)=>{
    try{
        const token = new ethers.Contract(tokenAddress, tokenABI, provider);
        dispatch(tokenLoaded(token))
        return token
    }catch(error){
        console.log("网络加载失败，请选择其他网络！")
        return null
    }
}

export const ExchangeLoading=(dispatch,provider)=>{
    try{
        const exchange = new ethers.Contract(exchangeAddress, exchangeABI, provider);
        dispatch(exchangeLoaded(exchange))
        return exchange
    }catch(error){
        console.log("网络加载失败，请选择其他网络！")
        return null
    }
}

export const AllOrdersLoading= async (dispatch,exchange)=>{
    //取消的订单
    // exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
    const cancelOrders =await getEventsArgs(exchange,"Cancel")
    dispatch(cancelOrdersLoaded(cancelOrders))

    //交易的订单
    const tradeOrders =await getEventsArgs(exchange,"Trade")
    dispatch(tradeOrdersLoaded(tradeOrders))
      
    //所有的订单
    const allOrders =await getEventsArgs(exchange,"Order")
    dispatch(allOrdersLoaded(allOrders))
}

//获取指定合约指定事件的参数列表
async function getEventsArgs(contract,eventName,start=0,end="latest"){
    return await contract.queryFilter(eventName,start,end).then((events) => {
        return events.map((event) => event.args)
    }).catch((error) => {
        console.log(error);
        return [];
    });
}


//------------------------------------------------------------------------
//取消订单事件
export const cancelOrder = async (dispatch,exchange,order,signer)=>{
    const tx=await exchange.connect(signer).cancelOrder(order.id)
    await tx.wait().then((receipt)=>{
        dispatch(orderCancelling())
    }).catch((error)=>{
        console.error(error)
    })
    
}

//------------------------------------------------------------------------
//订阅事件，当事件发生变化，收到消息并重新加载
export const subscribeEvents = async (dispatch,exchange,token,accountAddr)=>{
    //取消订单
    exchange.on("Cancel",(id,address)=>{
        dispatch(orderCancelled(id))
    })
    //修订单
    exchange.on("Trade",(id,address)=>{
        dispatch(balanceLoaded())
    })
    //新加订单
    exchange.on("Order",(id,user,from,fromAmount,to,toAmount,timestamp)=>{
        
        const order={
            id,user,from,fromAmount,to,toAmount,timestamp
        }
        dispatch(orderMade(order))
        // dispatch(balanceLoaded())
    })

    exchange.on("Deposit",async()=>{
        //更新余额
        await loadBalance(dispatch,accountAddr,exchange.provider,token,exchange)

        dispatch(balanceLoaded())
    })
    exchange.on("Withdraw",async()=>{
        //更新余额
        await loadBalance(dispatch,accountAddr,exchange.provider,token,exchange)

        dispatch(balanceLoaded())
    })
}

//-------------------------------------------------------
//加载所有的余额数据
export const loadBalance = async (dispatch,accountAddr,provider,token,exchange)=>{
    const ethBalance = await provider.getBalance(accountAddr)
    dispatch(etherBalanceLoaded(ethBalance))

    const tokenBalance = await token.balanceOf(accountAddr)
    dispatch(tokenBalanceLoaded(tokenBalance))

    const exchangeBalance = await exchange.balanceOf(ETHER_ADDRESS,accountAddr)
    dispatch(exchangeEtherBalanceLoaded(exchangeBalance))

    const exchangeTokenBalance = await exchange.balanceOf(token.address,accountAddr)
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

    dispatch(balanceLoaded())
}

//-------------------------------------------------------------------
//存款取款买入卖出相关
export const depositEther = async(dispatch, exchange, signer, amount) => {
	const tx=await exchange.connect(signer).depositEther({value:parseEther
    (amount)})
    await tx.wait().then((receipt)=>{
        console.log(receipt)
        dispatch(balanceLoading())

    }).catch((error)=>{
        console.error(error)
    })
}

export const withdrawEther = async(dispatch, exchange, signer, amount) => {
	const tx=await exchange.connect(signer).withdrawEther(parseEther
        (amount))
    await tx.wait().then((receipt)=>{
        console.log(receipt)
        dispatch(balanceLoading())
    }).catch((error)=>{
        console.error(error)
    })
}

export const depositToken = async(dispatch, signer,exchange,token, amount, account) => {
    const tx=await token.connect(signer).approve(exchange.address,parseEther(amount), { from: account })
    await tx.wait().then((receipt)=>{
        return receipt
    }).catch((error)=>{
        console.error(error)
    }).then(async(receipt)=>{
        
        const tx1= await exchange.connect(signer).depositToken(token.address,parseEther(amount), { from: account })
        await tx1.wait().then((receipt)=>{
            console.log(receipt)
            dispatch(balanceLoading())
        }).catch((error)=>{
            console.error(error)
        })
    })
    
}

export const withdrawToken = async(dispatch, signer,exchange, token, amount, account) => {
	const tx=await exchange.connect(signer).withdrawToken(token.address, parseEther(amount), { from: account })
	await tx.wait().then((receipt)=>{
        console.log(receipt)
        dispatch(balanceLoading())
    }).catch((error)=>{
        console.error(error)
    })
}

export const makeBuyOrder=async(dispatch,exchange,token,signer,order,account)=>{
    const from =token.address
    const fromAmount=parseEther(order.amount)
    const to=ETHER_ADDRESS
    const toAmount=parseEther((order.price*order.amount).toString())
    const tx=await exchange.connect(signer).makeOrder(from,fromAmount,to,toAmount,{from:account})
    tx.wait().then((receipt)=>{
        dispatch(buyOrderMaking())
    }).catch((error)=>{
        console.error(error)
    })
}
export const makeSellOrder=async(dispatch,exchange,token,signer,order,account)=>{
    const from =ETHER_ADDRESS
    const fromAmount=parseEther((order.price*order.amount).toString())
    const to=token.address
    const toAmount=parseEther(order.amount)
    const tx=await exchange.connect(signer).makeOrder(from,fromAmount,to,toAmount,{from:account})
    tx.wait().then((receipt)=>{
        dispatch(sellOrderMaking())
    }).catch((error)=>{
        console.error(error)
    })
}

// //平仓逻辑
// export const closePosition = async(dispatch,exchange,signer,orderId,account)=>{
//     const tx=await exchange.connect(signer).fillOrder(orderId, {from: account})
//     tx.wait().then((receipt)=>{
//         console.log(receipt)
        
//     }).catch((error)=>{
//         console.error(error)
//     })
// }