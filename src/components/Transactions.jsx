import React, { useContext } from "react";
// import useFetch from "../hooks/useFetch";

import { TransactionContext } from "../context/TransactionContext";
import dummyData from "../utils/dummyData";
import { shortAddress } from "../utils/shortAddress";

const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, index }) => {
    return (
        <>
            <tr>
                <th>{index}</th>
                <td>
                    <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
                        <p className="text-white text-base">
                            {shortAddress(addressFrom)}
                        </p>
                    </a>
                </td>
                <td>
                    <a href={`https://goerli.etherscan.io/address/${addressTo}`} target="_blank"
                        rel="noreferrer">
                        <p className="text-white text-base">
                            {shortAddress(addressTo)}</p>
                    </a>
                </td>
                <td>
                    <p className="text-white text-base">{amount} ETH</p>
                </td>
                <td>
                    {message && (
                        <>
                            <p className="text-white text-base">{message}</p>
                        </>
                    )}
                </td>
                <td>
                    {keyword && (
                        <>
                            <p className="text-white text-base">{keyword}</p>
                        </>
                    )}
                </td>
                <td>
                    <p className="text-[#37c7da] font-bold">{timestamp}</p>
                </td>
            </tr>
        </>
    )
}

const Transactions = () => {
    const { transactions, currentAccount } = useContext(TransactionContext);
    return (
        <div className=" w-full justify-center items-center 
        gradient-bg-transactions">
            <div className="  md:p-12 py-12 px-4">
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2">
                        最新交易
                    </h3>
                ) : (
                    <h3 className="text-white text-3xl text-center my-2">
                        连接您的钱包查看最新交易
                    </h3>
                )}
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>发送方</th>
                                <th>接收方</th>
                                <th>币值</th>
                                <th>信息</th>
                                <th>关键字</th>
                                <th>时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...dummyData, ...transactions].reverse().map((transaction, i) => (
                                <TransactionsCard key={i} {...transaction} index={i} />
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>发送方</th>
                                <th>接收方</th>
                                <th>币值</th>
                                <th>信息</th>
                                <th>关键字</th>
                                <th>时间</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Transactions;