// node.js's built in crypto lib
// const crypto = require('crypto')


//hashing
//one way process -- a string that has been hashed
//regardless of the input, the hash is awlays the same size
//canot be 'un hashed'


//sha256 
// const hash = crypto.createHash('sha256')


// hash.update('a') //create a hash of the letter 'a'

// const digest = hash.digest('hex')
// console.log('sha256:', digest)


// const userPass = 'abcd123'

// function makeHash(string) {
//     const hash = crypto.createHash('sha256')


// hash.update(string) //create a hash of the letter 'a'

// const digest = hash.digest('hex')
// return digest

// }

// const loginPassword = 'abcd123'

// console.log(makeHash(userPass) === makeHash(loginPassword));



// const bcrypt = require('bcrypt')

// const userPassword = 'hello123'
// const hashedPassword = bcrypt.hashSync(userPassword, 12)

// console.log(bcrypt.compareSync('hello123'), hashedPassword)

//encryption
//two way process where data is 'locked' in an encrypted string using a key and that key can remove the data from the string

// const cryptoJs  = require('crypto-js')

// const stringToEncrypt = 'hello I am a secret message'

// const encryptionKey = 'myKey'


// //Advanced Encryption Standard
// const myEncryption = cryptoJs.AES.encrypt(stringToEncrypt,encryptionKey)
// console.log(myEncryption.toString())
// const decryptedMessage = cryptoJs.AES.decrypt(myEncryption.toString(), encryptionKey)
// console.log(decryptedMessage.toString(cryptoJs.enc.Utf8));