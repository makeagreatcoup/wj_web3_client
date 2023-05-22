import {ethers } from 'ethers'

export const getAddressFromReg=(reg)=>{
    let wallet

    //  reg=/^0x6.*6$/
    const regex666=reg
    
    let isValid=false
    while(!isValid){
        wallet=ethers.Wallet.createRandom()
        isValid=regex666.test(wallet.address)
    }
    
    return wallet
}

let wallet
let reg=/^0x.*0$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*1$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*2$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*3$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*4$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*5$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*6$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*7$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*8$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

reg=/^0x.*9$/
wallet=getAddressFromReg(reg)
console.log(wallet.address+","+wallet.privateKey)

