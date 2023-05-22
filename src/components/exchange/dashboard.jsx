/*
 * @Author: 一鸣晶人 1015861859@qq.com
 * @Date: 2023-03-23 10:44:12
 * @LastEditors: 一鸣晶人 1015861859@qq.com
 * @LastEditTime: 2023-04-16 14:01:23
 * @FilePath: \project_web3\client\src\components\exchange\dashboard.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Nav} from './nav';
import {Orders} from './orders';
import {Content} from './content';
import {Trade} from './trade';

import React,{useEffect,useState,createContext} from "react";
import { ethers } from 'ethers';
import {useDispatch,useSelector} from 'react-redux'

import {Loading,AccountLoading,TokenLoading,ExchangeLoading,AllOrdersLoading, subscribeEvents, loadBalance} from "../../store/interaction"
import {accountSelector} from '../../store/selector';


console.log(1)
export const WalletContext=createContext();

const Dashboard = () => {

    const dispatch=useDispatch()
    console.log(2)
    const [walletConnected,setWalletConnected] = useState(null)
    const [currentAccount,setCurrentAcount] = useState(null);
    async function checkWalletConnection() {
        if (typeof window.ethereum !== "undefined") {
            try{
                const provider = Loading(dispatch);
            
                const account=await AccountLoading(dispatch,provider).getAddress()
                if(!window.ethereum.isConnected()){
                    setWalletConnected(false)
                }
                setCurrentAcount(account)
                console.log("已连接钱包:", account);
            }catch(e){
                console.log("请先登录钱包");
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            }
        } else {
            console.log("请先安装metamask");
            window.ethereum.enable()
        }
      }
      
      const getEthereumContract = async() => {
        const provider = Loading(dispatch);
        
        const account=AccountLoading(dispatch,provider)
      
        const token=TokenLoading(dispatch,provider)
        const exchange=ExchangeLoading(dispatch,provider)

        const allorder= await AllOrdersLoading(dispatch,exchange);

        await loadBalance(dispatch,currentAccount,provider,token,exchange)
        await subscribeEvents(dispatch,exchange,token,currentAccount)
    }

    
    const loadBlockchainData = async() =>{
        getEthereumContract()
        
    }
    

    return (
        <WalletContext.Provider value={{walletConnected,setWalletConnected,checkWalletConnection,loadBlockchainData,currentAccount}}>
            <div className="min-h-screen flex flex-col overflow-hidden">
                <Nav />
                <div className="dark:bg-gray-800 dark:text-gray-50 flex-1 flex flex-col">
                    <div className="container grid grid-cols-12 mx-auto h-full flex-1">
                        <div className=" grid  bg-no-repeat bg-cover  lg:col-span-9 h-full  grid-rows-5 ">
                            <div className="p-1 row-span-3 col-span-9">
                                
                                <Content />
                            </div>
                            <div className="col-span-9 p-1 divide-y divide-gray-700  row-span-2">
                                <div className=" h-full">
                                    <Orders />
                                </div>
                            </div>
                        </div>
                        <div className=" p-2 col-span-3 lg:h-full md:float-none">
                            
                            <Trade />
                        </div>
                    </div>
                </div>
            </div>

        </WalletContext.Provider>
        
    )
}

export default Dashboard
