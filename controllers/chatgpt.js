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

    const users = await db.user.findAll();

    res.render('users/conversation', { conversation, responses, users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving conversation '+error);
  }
});

// Start a new conversation
router.get('/conversations', async (req, res) => {
  const userId = res.locals.user? res.locals.user.id:0;
  // const userId = req.cookies.userId;

  try {
    // const decryptedUserId = cryptoJs.AES.decrypt(userId, process.env.ENC_KEY)
    const conversations = await db.conversation.findAll(
      {
        where: { userId: userId },
        order: [["is_favorite","DESC"],['id', 'DESC']]
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
  const userId = res.locals.user? res.locals.user.id:0;

  maxTokens = maxTokens? parseInt(maxTokens):1000;

  // const decryptedUserId = cryptoJs.AES.decrypt(userId, process.env.ENC_KEY)
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
      user_id: 0
    };
    const conversationData = {
      userId: userId,
      prompt: prompt,
      // generated_text: generatedText,
      is_favorite: false,
      date: new Date().toISOString()
    };

    const createdConversation = await db.conversation.create(conversationData);

    responseData.conversation_id = createdConversation.id;
    responseData.comment = generatedText;
    await db.response.create(responseData); // Insert responseData into the database
    
    await db.conversation.sync();

    res.redirect(`/users/conversation/${createdConversation.id}`);
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

  const userId = res.locals.user? res.locals.user.id:0;
  
  try {
    const newComment = await db.response.create({
      comment: comment,
      is_conversation: false,
      conversation_id: conversationId,
      is_favourite: false,
      user_id: userId
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

router.post('/conversation/:id/favorite', async (req, res) => {
  const conversationId = req.params.id;

  try {
    const conversation = await db.conversation.findByPk(conversationId);
    conversation.is_favorite = true;
    await conversation.save();
    res.redirect(`/users/conversation/${conversationId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error marking conversation as favorite');
  }
});

router.post('/conversation/:id/unfavorite', async (req, res) => {
  const conversationId = req.params.id;

  try {
    const conversation = await db.conversation.findByPk(conversationId);
    conversation.is_favorite = req.body.isFavorite === undefined ? false : true;
    await conversation.save();
    res.redirect(`/users/conversation/${conversationId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error marking conversation as unfavorite');
  }
});

// Update a conversation
router.put('/conversation/:id', async (req, res) => {
  const conversationId = req.params.id;
  const prompt = req.body.prompt;
  const isFavorite = req.body.isFavorite;

  try {
    const conversation = await db.conversation.findByPk(conversationId);
    if (conversation) {
      conversation.prompt = prompt || conversation.prompt;
      conversation.is_favorite = isFavorite !== undefined ? isFavorite : conversation.is_favorite;
      await conversation.save();
      res.redirect(`/users/conversation/${conversationId}`);
    } else {
      res.status(404).send('Conversation not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating conversation');
  }
});

// Update a conversation
router.post('/conversation/:id', async (req, res) => {
  const conversationId = req.params.id;
  const prompt = req.body.prompt;
  const isFavorite = req.body.isFavorite;

  try {
    const conversation = await db.conversation.findByPk(conversationId);
    if (conversation) {
      const responseData = {
        // message: prompt, // Save the updated prompt as the first response message
        is_conversation: 'true', // Indicate that this is the start of a new conversation
        user_id: 0 // special user id for chatgpt
      };

      // Make API call to GPT API
      axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: conversation.prompt
          }
        ],
        max_tokens: response.comment.length,
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

        conversation.prompt = conversation.prompt;
        // conversation.generated_text = generatedText;
        conversation.is_favorite = isFavorite !== undefined ? isFavorite : conversation.is_favorite;
        await conversation.save();

        responseData.user_id = 0;
        responseData.comment = generatedText;
        responseData.conversation_id = conversation.id;
        await db.response.create(responseData); // Insert responseData into the database

        const updatedResponses = await db.response.findAll({ where: { conversation_id: conversation.id } });
        res.render('users/conversation', { conversation, responses: updatedResponses });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error generating conversation '+error);
      });
    } else {
      res.status(404).send('Conversation not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating conversation');
  }
});



  module.exports = router