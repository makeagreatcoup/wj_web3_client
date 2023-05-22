import { useDispatch } from 'react-redux'
/*
 * @Author: 一鸣晶人 1015861859@qq.com
 * @Date: 2023-03-24 15:43:29
 * @LastEditors: 一鸣晶人 1015861859@qq.com
 * @LastEditTime: 2023-05-14 15:06:57
 * @FilePath: \project_web3\client\src\components\exchange\orders.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React,{useState,useEffect,useContext} from "react";

import {Tabs} from './tabs';
import {TablePart} from './part/table';
import { WalletContext } from "./dashboard";
import { useSelector } from "react-redux";
import { accountSelector, exchangeSelector, myOpenOrdersLoadedSelector, myOpenOrdersSelector, myOrdersLoadedSelector, myOrdersSelector, orderCancellingSelector } from "../../store/selector";
import { Spinner } from './part/spinner';

export const Orders = () => {
    const {currentAccount} = useContext(WalletContext)
    const dispatch=useDispatch()
    const exchange=useSelector(exchangeSelector)
    const signer=useSelector(accountSelector)

    const myOpenOrdersLoaded=useSelector(myOpenOrdersLoadedSelector)
    const myOrdersLoaded=useSelector(myOrdersLoadedSelector)
    const orderCancelling=useSelector(orderCancellingSelector)

    const myOpenOrders=useSelector((state)=>myOpenOrdersSelector(state,currentAccount));
    const myOrders=useSelector((state)=>myOrdersSelector(state,currentAccount));
    return (
        <div className="h-full">
        <Tabs type="1" mold="1" tabs={[
                      {label:"当前订单",content:
                      <div className={`h-full  justify-center items-center text-center w-full relative ${currentAccount?"":"flex"}`}>
                    {currentAccount
                            ? 
                            (orderCancelling?<Spinner />:
                            (
                              <div>
                                <TablePart orders={myOpenOrders} type="1" signer={signer} exchange={exchange} loaded={myOpenOrdersLoaded} dispatch={dispatch}/>
                              </div>
                              )
                              )
                            : (
                              <button
                                type="button"
                                className=" absolute flex flex-row justify-center items-center bg-[#2952e3]  rounded-full cursor-pointer hover:bg-[#2546bd] w-1/2 h-[50px]">
                                
                                <p className="text-white text-base font-semibold">
                                    请先连接钱包来查看
                                </p>
                            </button>
                            )}
                  </div>
                      
                      
                      },
                      {label:"订单历史",content:
                      <div className={`h-full  justify-center items-center w-full relative ${currentAccount?"":"flex"}`}>
                      {currentAccount
                              ? (
                                <div>
                                  <TablePart orders={myOrders} loaded={myOrdersLoaded}/>
                                </div>
                                )
                              : (
                                <button
                                  type="button"
                                  className=" absolute flex flex-row justify-center items-center bg-[#2952e3]  rounded-full cursor-pointer hover:bg-[#2546bd] w-1/2 h-[50px]">
                                  
                                  <p className="text-white text-base font-semibold">
                                      请先连接钱包来查看
                                  </p>
                              </button>
                              )}
                    </div>  
                    },
                    //   {label:"交易历史",content:
                    //   <div className={`h-full  justify-center items-center w-full relative ${currentAccount?"":"flex"}`}>
                    //   {currentAccount
                    //           ? (
                    //             <div>
                    //               <TablePart />
                    //             </div>
                    //             )
                    //           : (
                    //             <button
                    //               type="button"
                    //               className=" absolute flex flex-row justify-center items-center bg-[#2952e3]  rounded-full cursor-pointer hover:bg-[#2546bd] w-1/2 h-[50px]">
                                  
                    //               <p className="text-white text-base font-semibold">
                    //                   请先连接钱包来查看
                    //               </p>
                    //           </button>
                    //           )}
                    // </div>  
                    // },
                      ]}></Tabs>
        </div>
    );
  };