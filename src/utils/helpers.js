import { BigNumber,ethers } from 'ethers'

export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

export const DECIMALS = (10**18)

export const GREEN = 'success'
export const RED = 'error'


export const changeEther = (wei) => {
	// if(wei) {
	// 	return(wei / DECIMALS)
	// }
	// console.log(wei.toString())
	return ethers.utils.formatEther(wei.toString()).toString()
}
export const parseEther = (ether) => {
	return ethers.utils.parseEther(ether.toString()).toString()
}

export const tokens = (n) => changeEther(n)

export const formatBalance = (balance) => {
	const precision = 100
	balance = changeEther(balance)
	balance = Math.round(balance * precision) / precision 
	return balance
}

export function hexToNumber(hex) {
    return BigNumber.from(hex).toNumber()
}