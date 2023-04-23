import JSEncrypt from "jsencrypt";

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQuecg60WkjVEqGcX/w8IAxl67UiqEE+J1p2Y09qKnTZscIiTs6QwJxV4iUrdD2FFVCpbpyh3HMhnDDx7sd31QEO70wBxfsH71rGtEXdSH/PXDRwAhoz6sLaQu9ek0ToVHn2qxQf7r6oaMkdo4E17iDWjowesHZ5bRbnj1r5Z5mQIDAQAB';

export function encrypt(obj) {
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)
    return encrypt.encrypt(obj)
}