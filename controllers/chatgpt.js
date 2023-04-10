const express = require('express')
const router = express.Router()
const db = require('../models')
const axios = require('axios');
require('dotenv').config();




const apiKey = process.env.API_KEY;

// List all conversations
  router.get('/conversations', async (req, res) => {
    try {
      const conversations = await db.conversation.findAll();
      res.render('users/conversations', { conversations });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving conversations');
    }
  });
  
  // Create a new conversation
  router.post('/conversations', (req, res) => {
    const prompt = req.body.prompt;
    const maxTokens = req.body.maxTokens || 100; // default to 100 if not provided
    const userId = req.cookies.userId;
  
    // Make API call to GPT API
    axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: prompt,
        max_tokens: maxTokens,
        n: 1,
        stop: '\n',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      })
      .then(response => {
        const generatedText = response.data.choices[0].text;
        const conversationData = {
          userId: userId,
          prompt: prompt,
          generatedText: generatedText,
          date: new Date().toISOString() // Add date to conversationData object
        };
        db.conversation.create(conversationData); // Insert conversationData into the database
        res.redirect('/conversations');
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error generating conversation');
      });
  });
  
  // Add a new response to a conversation
  router.post('/conversations/:id', (req, res) => {
    const conversationId = req.params.id;
    const responseData = req.body;
    const response = db.createResponse(conversationId, responseData);
    res.redirect(`/conversations/${conversationId}`);
  });
  
  // List all user's favorites with comments
  router.get('/responses', (req, res) => {
    const favorites = db.getFavorites();
    res.render('favorites', { favorites });
  });
  
  // Update a comment under a favorite
  router.put('/responses/:id', (req, res) => {
    const responseId = req.params.id;
    const comment = req.body.comment;
    db.updateComment(responseId, comment);
    res.redirect('/responses');
  });
  
  // Add a new favorite
  router.post('/responses', (req, res) => {
    const favoriteData = req.body;
    db.createFavorite(favoriteData);
    res.redirect('/responses');
  });
  
  // Delete a favorite
  router.delete('/responses/:id', (req, res) => {
    const responseId = req.params.id;
    db.deleteFavorite(responseId);
    res.redirect('/responses');
  });

  module.exports = router