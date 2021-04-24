

const accounts = require('../models/accounts.models')
const transactions = require('../models/transaction.models')


const addUser = (req,res)=>{
   
    const {id, cash, credit}  = req.body
    
        const newUser = new accounts({
            id : id, 
            cash: cash, 
            credit: credit
        })
        console.log(newUser)
        newUser.save((err) => {
            if (err) return res.status(400).send({"error": err})
            return res.status(200).send({"success": newUser})
        });

    //}

}

const getAllUsers = async (req,res)=>{
    const users = await accounts.find()
    return res.send(users)

}

const getAllTransactions = async (req,res)=>{
    const actions = await transactions.find()
    return res.send(actions)

}

const getUserById = async (req, res) =>{
    const {id} = req.params
    
    const user = await accounts.find({user_id: `${id}`})

    if(!user){
        return res.send("Account does not exist in the system")

    }
    return res.send(user)  
 
}


const deposit = async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ["cash"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Updates most only be regarding cash amount'})
    }
    
    try{
        const user = await accounts.findByIdAndUpdate(req.params.id, {$inc: {cash: req.body.cash}}, {new:true, runValidators: true })
    
        if(!user){
            return res.status(404).send("Account does not exist in the system")
    
        }
        if(req.body.cash <0){
            return res.status(400).send({error: 'Depoist must be a positive value'})
        }
        const transaction = new transactions({
            //to : req.params.id, 
            toAccount : user.id, 
            operationName: "deposit", 
            amount: req.body.cash
        })
        transaction.save((err) => {
            if (err) return res.json({"error": err})
            return res.json({"success": transaction})
        })

        //return res.status(200).json(user)

    } catch(error){
        res.status(400).send({"error":error})
    }

}

const updateCredit = async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ["credit"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Updates most only be regarding credit amount'})
    }
    
    try{
        const user = await accounts.findByIdAndUpdate(req.params.id, {credit: req.body.credit}, {new:true, runValidators: true })
    
        if(!user){
            return res.status(404).send("Account does not exist in the system")
    
        }
        if(req.body.credit <0){
            return res.status(400).send({error: 'Credit must be a positive value'})
        }

        const transaction = new transactions({
            //to : req.params.id, 
            toAccount : user.id, 
            operationName: "Credit update", 
            amount: req.body.credit
        })
        transaction.save((err) => {
            if (err) return res.json({"error": err})
            return res.json({"success": transaction})
        })
        //return res.status(200).json(user)

    } catch(error){
        res.status(400).send({"error":error})
    }

}

const withdrawMoney = async(req, res) =>{

    const {withdraw} =req.body
    const {id} = req.params

    try{
        const user = await accounts.findOne({id: id})
        if (!user) {
            return res.status(404).send({ error: 'No such account in the system' })
        }
        if ((user.credit + user.cash) < withdraw) {
            return res.status(400).send({ error: 'Not a valid action' })
        }

        const userUpdate = await accounts.findByIdAndUpdate(user._id, { $inc: { cash: -withdraw } }, { new: true, runValidators: true })
        console.log(userUpdate)

        const transaction = new transactions({
            toAccount : userUpdate.id, 
            operationName: "Withdraw", 
            amount: req.body.withdraw
        })
        transaction.save((err) => {
            if (err) return res.json({"error": err})
            return res.json({"success": transaction})
        })
    }
    catch (error) {
        res.status(400).json(error)
    }

}

const transferMoney = async (req, res) =>{
    const {sendingId, reciveingId, amount} = req.body

    try{
        const send = await accounts.findOne({id: sendingId})
        const recieve = await accounts.findOne({id: reciveingId})

        if(amount < 0){
            return res.status(400).send('Transfer amount should be positive')
        }
        if(send === recieve || ( (send.cash + send.credit) < amount )){
            return res.status(400).send('Not a valid action')
        }

        const sending = await accounts.findByIdAndUpdate(send._id, { $inc: { cash: -amount } }, { new: true, runValidators: true });
        const recieving = await accounts.findByIdAndUpdate(send._id, { $inc: { cash: amount } }, { new: true, runValidators: true });

        const transaction = new transactions({
            toAccount : sending.id, 
            fromAccount: recieving.id,
            operationName: "Transfer", 
            amount: req.body.amount
        })
        transaction.save((err) => {
            if (err) return res.json({"error": err})
            return res.json({"success": transaction})
        })

    } catch (error) {
        res.status(400).json(error)
    }


     
}


module.exports = {
    getAllUsers,
    addUser,
    getUserById,
    deposit,
    updateCredit,
    withdrawMoney,
    transferMoney,

    getAllTransactions
}