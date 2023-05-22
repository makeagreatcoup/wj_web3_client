import React,{useState,useEffect,useContext} from "react";
import {useDispatch,useSelector} from 'react-redux'
import {Tabs} from './tabs';
import { WalletContext } from "./dashboard";
import {accountSelector, balancesLoadingSelector, buyOrderSelector, etherBalanceSelector, etherDepositAmountSelector, etherWithdrawAmountSelector, exchangeEtherBalanceSelector, exchangeSelector, exchangeTokenBalanceSelector, sellOrderSelector, tokenBalanceSelector, tokenDepositAmountSelector, tokenSelector, tokenWithdrawAmountSelector} from '../../store/selector';
import { Spinner } from "./part/spinner";
import { buyOrderAmountChanged, buyOrderPriceChanged, etherDepositAmountChanged, etherWithdrawAmountChanged, sellOrderAmountChanged, sellOrderPriceChanged, tokenDepositAmountChanged,tokenWithdrawAmountChanged } from "../../store/action";
import { depositEther, depositToken, makeBuyOrder, makeSellOrder, withdrawEther, withdrawToken } from "../../store/interaction";

console.log(3)
export const Trade = () => {
  const {currentAccount} = useContext(WalletContext)
  console.log(4)

  const dispatch=useDispatch()
  const exchange=useSelector(exchangeSelector)
  const signer=useSelector(accountSelector)
  const token=useSelector(tokenSelector)

  const balancesLoading=useSelector(balancesLoadingSelector)
  const etherBalance=useSelector(etherBalanceSelector)
  const tokenBalance=useSelector(tokenBalanceSelector)
  const exchangeEtherBalance=useSelector(exchangeEtherBalanceSelector)
  const exchangeTokenBalance=useSelector(exchangeTokenBalanceSelector)

  const etherDepositAmount=useSelector(etherDepositAmountSelector)
  const etherWithdrawAmount=useSelector(etherWithdrawAmountSelector)
  const tokenDepositAmount=useSelector(tokenDepositAmountSelector)
  const tokenWithdrawAmount=useSelector(tokenWithdrawAmountSelector)

  const buyOrder=useSelector(buyOrderSelector)
  const sellOrder=useSelector(sellOrderSelector)

  console.log(buyOrder)
  console.log(sellOrder)
  const showBuyOrder = buyOrder.making
  const showSellOrder = sellOrder.making 
  const showBuyTotal = buyOrder.amount && buyOrder.price
  const showSellTotal = sellOrder.amount && sellOrder.price

  return (
    <div className="grid lg:h-full bg-default divide-y divide-white divide-opacity-30">
      <div className=" h-full">
                <Tabs tabs={[
                    {label:"存入",content:
                  <div className={`h-full ${currentAccount?'':'flex justify-center items-center relative'}`}>
                    {currentAccount
                            ? 
                            balancesLoading?<Spinner />:
                            (
                              <div>
                                <table className="table table-compact table-dark table-sm small w-full">
                                <thead>
                                  <tr>
                                    <th>代币</th>
                                    <th>个人</th>
                                    <th>交易所</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>ETH</td>
                                    <td>{etherBalance}</td>
                                    <td>{exchangeEtherBalance}</td>
                                  </tr>
                                </tbody>
                              </table>
                              <form className="grid grid-cols-3 gap-2" onSubmit={(event) => {
                                  event.preventDefault()
                                  depositEther(dispatch, exchange, signer, etherDepositAmount)
                                }}>
                                  <div className="col-span-2">
                                    <input
                                    type="text"
                                    placeholder="ETH数量"
                                    onChange={(e) => dispatch( etherDepositAmountChanged(e.target.value))}
                                    className="form-control form-control-sm bg-dark text-white"
                                    required />
                                  </div>
                                  <div className="col-span-1">
                                    <button type="submit" className="btn btn-primary btn-block btn-sm">存入eth</button>
                                  </div>
                                </form>
                                <table className="table table-compact table-dark table-sm small w-full">
                                <tbody>
                                  <tr>
                                    <td>WJB</td>
                                    <td>{tokenBalance}</td>
                                    <td>{exchangeTokenBalance}</td>
                                  </tr>
                                </tbody>
                              </table>
                              <form className="grid grid-cols-3 gap-2" onSubmit={(event) => {
                                  event.preventDefault()
                                  depositToken(dispatch,signer, exchange, token, tokenDepositAmount,currentAccount)
                                }}>
                                  <div className="col-span-2">
                                    <input
                                    type="text"
                                    placeholder="代币数量"
                                    onChange={(e) => dispatch( tokenDepositAmountChanged(e.target.value))}
                                    className="form-control form-control-sm bg-dark text-white"
                                    required />
                                  </div>
                                  <div className="col-span-1">
                                    <button type="submit" className="btn btn-primary btn-block btn-sm">存入代币</button>
                                  </div>
                                </form>
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
                    {label:"取出",content:
                    <div className={`h-full ${currentAccount?'':'flex justify-center items-center relative'}`}>
                    {currentAccount
                            ? balancesLoading?<Spinner />:
                            (
                              <div>
                                <table className="table table-compact table-dark table-sm small w-full">
                                <thead>
                                  <tr>
                                    <th>代币</th>
                                    <th>个人</th>
                                    <th>交易所</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>ETH</td>
                                    <td>{etherBalance}</td>
                                    <td>{exchangeEtherBalance}</td>
                                  </tr>
                                </tbody>
                              </table>
                              <form className="grid grid-cols-3 gap-2" onSubmit={(event) => {
                                  event.preventDefault()
                                  withdrawEther(dispatch, exchange, signer, etherWithdrawAmount)
                                }}>
                                  <div className="col-span-2">
                                    <input
                                    type="text"
                                    placeholder="ETH数量"
                                    onChange={(e) => dispatch( etherWithdrawAmountChanged(e.target.value))}
                                    className="form-control form-control-sm bg-dark text-white"
                                    required />
                                  </div>
                                  <div className="col-span-1">
                                    <button type="submit" className="btn btn-primary btn-block btn-sm">提取eth</button>
                                  </div>
                                </form>
                                <table className="table table-compact table-dark table-sm small w-full">
                                <tbody>
                                  <tr>
                                    <td>WJB</td>
                                    <td>{tokenBalance}</td>
                                    <td>{exchangeTokenBalance}</td>
                                  </tr>
                                </tbody>
                              </table>
                              <form className="grid grid-cols-3 gap-2" onSubmit={(event) => {
                                  event.preventDefault()
                                  withdrawToken(dispatch,signer,  exchange, token,tokenWithdrawAmount,currentAccount)
                                }}>
                                  <div className="col-span-2">
                                    <input
                                    type="text"
                                    placeholder="代币数量"
                                    onChange={(e) => dispatch( tokenWithdrawAmountChanged(e.target.value))}
                                    className="form-control form-control-sm bg-dark text-white"
                                    required />
                                  </div>
                                  <div className="col-span-1">
                                    <button type="submit" className="btn btn-primary btn-block btn-sm">提取代币</button>
                                  </div>
                                </form>
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
                    }]}></Tabs>
      </div>

      <div className="h-full ">
      <Tabs tabs={[
                    {label:"买入",content:
                    <div className={`h-full ${currentAccount?'':'flex justify-center items-center relative'}`}>
                    {currentAccount
                            ? showBuyOrder?<Spinner />:
                            (
                              <div>
                              <form className="grid grid-cols-3 gap-2" onSubmit={(event) => {
                                  event.preventDefault()
                                  makeBuyOrder(dispatch,exchange, token, signer,buyOrder,currentAccount)
                                }}>
                                  <table className="table table-compact table-dark table-sm small w-full">
                                    <tr>
                                      <td>
                                        <label>购买数量</label>
                                      </td>
                                      <td>
                                        <div className="col-span-2">
                                          <input
                                          type="text"
                                          placeholder="数量"
                                          onChange={(e) => dispatch( buyOrderAmountChanged(e.target.value))}
                                          className="form-control form-control-sm bg-dark text-white"
                                          required />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <label>购买单价</label>
                                      </td>
                                      <td>
                                          <div className="col-span-2">
                                            <input
                                            type="text"
                                            placeholder="单价"
                                            onChange={(e) => dispatch( buyOrderPriceChanged(e.target.value))}
                                            className="form-control form-control-sm bg-dark text-white"
                                            required />
                                      </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <button type="submit" className="btn btn-primary btn-block btn-sm">买入代币</button>
                                      </td>
                                    </tr>
                                  </table>
                                  { showBuyTotal ? <small>总价: {buyOrder.amount * buyOrder.price} ETH</small> : null }
                                </form>
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
                  </div>},
                    {label:"卖出",content:
                    <div className={`h-full ${currentAccount?'':'flex justify-center items-center relative'}`}>
                    {currentAccount
                            ? showSellOrder?<Spinner />:
                            (
                              <div>
                                
                              <form className="grid grid-cols-3 gap-2" onSubmit={(event) => {
                                  event.preventDefault()
                                  makeSellOrder(dispatch, exchange, token,signer, sellOrder,currentAccount)
                                }}>

                                  <table className="table table-compact table-dark table-sm small w-full">
                                    <tr>
                                      <td>
                                        <label>卖出数量</label>
                                      </td>
                                      <td>
                                        <div className="col-span-2">
                                          <input
                                          type="text"
                                          placeholder="数量"
                                          onChange={(e) => dispatch( sellOrderAmountChanged(e.target.value))}
                                          className="form-control form-control-sm bg-dark text-white"
                                          required />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <label>卖出单价</label>
                                      </td>
                                      <td>
                                        <div className="col-span-2">
                                          <input
                                          type="text"
                                          placeholder="单价"
                                          onChange={(e) => dispatch( sellOrderPriceChanged(e.target.value))}
                                          className="form-control form-control-sm bg-dark text-white"
                                          required />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <button type="submit" className="btn btn-primary btn-block btn-sm">卖出代币</button>
                                      </td>
                                    </tr>
                                  </table>
                                  { showSellTotal ? <small>总价: {sellOrder.amount * sellOrder.price} ETH</small> : null }
                                </form>
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
                  </div>}]}></Tabs>
      </div>
    </div>
  )
}
