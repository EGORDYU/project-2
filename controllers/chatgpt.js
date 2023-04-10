const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios');
require('dotenv').config();

const cryptoJs = require('crypto-js')

const apiKey = process.env.API_KEY;

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
  try {
    const conversations = await db.conversation.findAll(
      {
        order: [["is_favorite","ASC"],['id', 'DESC']]
      }
    );
    console.log(conversations); // Add this line to log the conversations to the console
    res.render('users/conversations', { conversations });
  } catch (error) {
    console.error(error);
    console.error(error.message); // Add this line to log the error message to the console
    res.status(500).send('Error retrieving conversations');
  }
});

// Create a new conversation
router.post('/conversation', (req, res) => {
  // const conversationId = req.params.id;
  const prompt = req.body.prompt;
  maxTokens = req.body.maxTokens; // default to 100 if not provided
  const userId = req.cookies.userId;

  maxTokens = maxTokens? parseInt(maxTokens):100;

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
      is_favourite: false,
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
  

  module.exports = router