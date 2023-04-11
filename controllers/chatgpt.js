const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios');
const methodOverride = require('method-override');
require('dotenv').config();

const cryptoJs = require('crypto-js')

const apiKey = process.env.API_KEY;
router.use(methodOverride('_method'));

// List all conversations
router.get('/conversation/:id', async (req, res) => {
  
  try {
    const conversation = await db.conversation.findByPk(req.params.id);
    const responses = await db.response.findAll({ where: { conversation_id: conversation.id } });
    res.render('users/conversation', { conversation, responses });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving conversation '+error);
  }
});

// Start a new conversation
router.get('/conversations', async (req, res) => {
  const userId = req.cookies.userId;
  try {
    const decryptedUserId = cryptoJs.AES.decrypt(userId, process.env.ENC_KEY)
    const conversations = await db.conversation.findAll(
      {
        where: { userId: decryptedUserId },
        order: [["is_favorite","ASC"],['id', 'DESC']]
      }
    );
    if(!userId){
      res.send('please login')
    } else {
      res.render('users/conversations', { conversations });
    }
  } catch (error) {
    console.error(error);
    console.error(error.message); // Add this line to log the error message to the console
    res.status(500).send('Please login to view conversations');
  }
});

// Create a new conversation
router.post('/conversation', (req, res) => {
  // const conversationId = req.params.id;
  const prompt = req.body.prompt;
  maxTokens = req.body.maxTokens; // default to 100 if not provided
  const userId = req.cookies.userId;

  maxTokens = maxTokens? parseInt(maxTokens):1000;

  const decryptedUserId = cryptoJs.AES.decrypt(userId, process.env.ENC_KEY)
    // if( !prompt ) prompt = "Alice in Wonderland";

  // Make API call to GPT API
  axios.post('https://api.openai.com/v1/chat/completions', {
    model: "gpt-3.5-turbo",
    messages: [
      {
      role: "user",
      content: prompt
      }
    ],
    max_tokens: maxTokens,
    n: 1
  }, 
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  })
  .then(async response => {
    const generatedText = response.data.choices[0].message.content;
    const responseData = {
      message: prompt, // Save the prompt as the first response message
      is_conversation: 'true', // Indicate that this is the start of a new conversation
    };
    const conversationData = {
      userId: decryptedUserId,
      prompt: prompt,
      generated_text: generatedText,
      is_favourite: false,
      date: new Date().toISOString()
    };

    const createdConversation = await db.conversation.create(conversationData);
    responseData.conversationId = createdConversation.id;
    await db.response.create(responseData); // Insert responseData into the database
    
    res.redirect(`/users/conversations`);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error generating conversation '+error);
  });
});
  
// Add a comment to a conversation
router.post('/conversation/:id/comments', async (req, res) => {
  const conversationId = req.params.id;
  const comment = req.body.comment;
  const isFavourite = req.body.isFavourite;

  try {
    const newComment = await db.response.create({
      comment: comment,
      is_conversation: false,
      conversation_id: conversationId,
      is_favourite: false,
    });

    res.redirect(`/users/conversation/${conversationId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding comment to conversation');
  }
});

// Delete a conversation
router.delete('/conversation/:id', async (req, res) => {
  const conversationId = req.params.id;

  try {
    // Delete all responses associated with the conversation
    await db.response.destroy({ where: { conversation_id: conversationId } });

    // Delete the conversation itself
    await db.conversation.destroy({ where: { id: conversationId } });

    res.redirect('/users/conversations');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting conversation');
  }
});

  module.exports = router