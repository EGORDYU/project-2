const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios');
const methodOverride = require('method-override');
require('dotenv').config();

const cryptoJs = require('crypto-js')

const apiKey = process.env.API_KEY;
router.use(methodOverride('_method'));




// List all favorite conversations
router.get('/favorites', async (req, res) => {
    const userId = req.cookies.userId;
    try {
      const decryptedUserId = cryptoJs.AES.decrypt(userId, process.env.ENC_KEY)
      const conversations = await db.conversation.findAll(
        {
          where: { userId: decryptedUserId, is_favorite: true },
          order: [['id', 'DESC']]
        }
      );
      if(!userId){
        res.send('please login')
      } else {
        res.render('favorites', { conversations });
      }
    } catch (error) {
      console.error(error);
      console.error(error.message);
      res.status(500).send('Please login to view favorite conversations');
    }
  });
  
  // Mark a conversation as favorite
  router.post('/favorites/:id', async (req, res) => {
    const conversationId = req.params.id;
  
    try {
      const conversation = await db.conversation.findByPk(conversationId);
      if (conversation) {
        conversation.is_favorite = true;
        await conversation.save();
        res.redirect(`favorites`);
      } else {
        res.status(404).send('Conversation not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error marking conversation as favorite');
    }
  });
  

  router.put('/favorites/:id', async (req, res) => {
    const conversationId = req.params.id;
    const isFavorite = req.body.isFavorite;
  
    try {
      const conversation = await db.conversation.findByPk(conversationId);
      if (conversation) {
        conversation.is_favorite = isFavorite !== undefined ? isFavorite : conversation.is_favorite;
        await conversation.save();
        res.redirect(`/users/favorites`);
      } else {
        res.status(404).send('Conversation not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating conversation favorite status');
    }
  });

  // Unmark a conversation as favorite
  router.delete('/favorites/:id', async (req, res) => {
    const conversationId = req.params.id;
  
    try {
      const conversation = await db.conversation.findByPk(conversationId);
      if (conversation) {
        conversation.is_favorite = false;
        await conversation.save();
        res.redirect(`favorites`);
      } else {
        res.status(404).send('Conversation not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error unmarking conversation as favorite');
    }
  });

  module.exports = router