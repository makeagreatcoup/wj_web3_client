
import React,{useEffect,useState} from "react";
import { ethers } from 'ethers';

import {constractABI,constractAddress} from '../utils/constants';

export const TransactionContext=React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(constractAddress,constractABI,signer);
    return transactionContract;
}

export const TransactionsProvider = ({children})=>{
    const [currentAccount,setCurrentAcount] = useState(null);
    const [formData,setFormData] = useState({addressTo:'',amount:'',keyword:'',message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e,name)=>{
        setFormData((prev) => ({...prev,[name]:e.target.value}));
    };

    const getAllTransactions = async()=>{
        try{
            if(!ethereum) return alert("请先安装metamask！");
            const transactionContract=getEthereumContract();
            const data=await transactionContract.getAllTransactions();

            const dataValue=data.map((transaction)=>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
            setTransactions(dataValue);
        }catch(error){
            throw new Error("该浏览器不支持ethereum");
        }
    }

    const checkIfWalletExist = async () =>{
        const transactionContract = getEthereumContract();
        const transactionCount = await transactionContract.getTransactionCount();
        window.localStorage.setItem("transactionCount",transactionCount);
    }
    const connectWallet = async (type) =>{
        //有值连接，没值检查连接
        const method=type?'eth_requestAccounts':'eth_accounts';
        try{
            if(!ethereum) return alert("请先安装metamask！");
            const accounts = await ethereum.request({method: method});
            setCurrentAcount(accounts[0]);
            if(type){
                window.location.reload();
            }else{
                getAllTransactions();
            }
        }catch(error){
            throw new Error("该浏览器不支持ethereum");
        }
        
    }

    const sendTransaction = async()=>{
        try{
            if(!ethereum) return alert("请先安装metamask！");
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract=getEthereumContract();
            const parseAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method:'eth_sendTransaction',
                params:[{
                    from:currentAccount,
                    to:addressTo,
                    gas:'0x5208',   //21000GWEI
                    value:parseAmount._hex,
            }]});
            const transactionHash = await transactionContract.addToBlockchain(addressTo,parseAmount,message,keyword);
            setIsLoading(true);
            console.log(`正在上传数据---${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`完成---${transactionHash.hash}`);

            const transactionCount= await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

        }catch(error){
            console.log(error);
            throw new Error("该浏览器不支持ethereum");
        }

    }
    const connectingWallet = async ()=>{
        connectWallet(1);
    }
    useEffect(() =>{
        connectWallet();
        checkIfWalletExist();
    },[]);
    return (
        <TransactionContext.Provider
    value={{
        transactionCount,
        connectWallet:connectingWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        setFormData,
    }}
    >
        {children}
    </TransactionContext.Provider>
    )
}