// BUILD YOUR SERVER HERE
const express = require('express')
const user = require('./users/model')
const server = express()
server.use(express.json())

server.put('/api/users/:id', async (req, res)=>{
    try{
    const possUser = await user.findById(req.params.id)
    if (!possUser){
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        if (!req.body.name || !req.body.bio){
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
    } else {
        const updatedUser = await user.update(
                req.params.id,
                req.body,
            )
            res.status(200).json(updatedUser)
            }
        }
    } catch(err) {
        res.status(500).json({
            message: 'error updating users',
            err: err.message,
            stack: err.stack
        })
    }
})




server.delete('/api/users/:id', async (req, res)=>{
    const possUser = await user.findById(req.params.id)
    if (!possUser){
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        const deleteStuff = await user.remove(possUser.id)
        res.status(200).json(deleteStuff)
    }
})

server.post('/api/users', (req, res)=>{
    const User = req.body;
    if (!User.name || !User.bio){
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    }else{
        user.insert(User)
        .then(stuff => {
            res.status(201).json(stuff)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error creating users',
                err: err.message,
                stack: err.stack
            })
        })
    }
})

server.get('/api/users', (req, res)=>{
    user.find()
    .then(users => {
        res.json(users)
    })
    .catch(err =>{
        res.status(500).json({
            message: 'error getting users',
            err: err.message,
            stack: err.stack
        })
    })
})

server.get('/api/users/:id', (req, res)=>{
    user.findById(req.params.id)
    .then(users => {
        if (!users){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }
        res.json(users)
    })
    .catch(err =>{
        res.status(500).json({
            message: 'error getting users',
            err: err.message,
            stack: err.stack
        })
    })
})

server.use('*', (req, res)=>{
    req.statusCode(404).json({
        message: 'not found'
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
