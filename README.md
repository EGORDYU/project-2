# AI website prompt saver

My website will be a simple ask AI website. It will allow the user to ask the CHATGPT(API) questions and receive answers, then it will allow the user to save certain prompts to be seen by the user at a later time if needed, a stretch goal I would also hope to have is letting users share their prompts if they wanted to be seen by other users.

## Choice of API: ChatGPT.

![alt text](./project2.png)
![alt text](./project2-wireframe.png)





| Verb   | Url                      | CRUD   | Description                                         | View            |
| ------ | ------------------------ | ------ | --------------------------------------------------- | --------------- |
| GET    | /                        | Read   | Home view                                           | Home            |
| GET    | /conversations           | Read   | List all conversations                              | Conversations   |
| GET    | /conversations/:id       | Read   | Retrieve a specific conversation and its responses  | Conversation    |
| POST   | /conversations           | Create | Create a new conversation                           | Conversations   |
| POST   | /conversations/:id       | Create | Add a new response to a conversation                | Conversation    |
| GET    | /favorites               | Read   | List all user's favorites with comments             | Favorites       |
| PUT    | /favorites/:id           | Update | Update a comment under a favorite                   | Favorites       |
| POST   | /favorites               | Create | Add a new favorite                                  | Favorites       |
| DELETE | /favorites/:id           | Delete | Delete a favorite                                   | Favorites       |







## User Stories:
Have a question that will be relevant later, ask the AI the question and favourite it.
Be able to go back to see the answer to the question and your thoughts on it.
Be able to see other peoples questions and see what their thoughts on the answers were.

## MVP goals:
Be able to ask chatgpt a question and receive a relevant answer.
Be able to add the question prompt and answer to a favourites page, as well as a comment associated with it.
Light and dark theme.

## Stretch goals:
Be able to see other users public questions and comments on said questions.
Be able to like and comment on their questions/answers.







