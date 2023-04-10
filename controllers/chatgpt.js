const express = require('express')
const router = express.Router()
const db = require('../models')


// List all conversations
router.get('/conversations', (req, res) => {
    console.log('test test');
    const conversations = db.getConversations();
    res.render('users/conversations', { conversations });
  });
  
  // Retrieve a specific conversation and its responses
  router.get('/conversations/:id', (req, res) => {
    const conversationId = req.params.id;
    const conversation = db.getConversation(conversationId);
    const responses = db.getResponses(conversationId);
    res.render('conversation', { conversation, responses });
  });
  
  // Create a new conversation
  router.post('/conversations', (req, res) => {
    const conversationData = req.body;
    const conversation = db.createConversation(conversationData);
    res.redirect('/conversations');
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