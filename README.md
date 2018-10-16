# quiz app

## Deploying
#### For the backend:
* `git clone https://github.com/ishitap/quiz-backend.git && cd quiz-backend`
* `npm install && node app-

#### For the frontend:
* `git clone https://github.com/ishitap/quiz-frontend.git && cd quiz-frontend`
* `npm install && npm start`
* If, for whatever reason, your backend is not on localhost:5000, you can run `REACT_APP_BACKEND=your_backend npm start` instead of just `npm start`.

## Limitations
* cannot register a user in the UI. to register a user POST to `/api/users/register` with `{ username, password }` in the request body
* limited to no error handling. If there is an error there is no helpful modal or other recovery route. Usually the data will just not save and the error is returned in the response body, just not printed out for the user. 
* styling is very poor, and some not great UX decisions to make the app simpler

## Frontend component tree
- `App/`: entry point, router code is here
- `PageLayout/`: Overall structure/styling of each page
- `Login/`: Login page 
- `QuizDetail/`: HOC around PlayQuiz and EditQuiz that handles fetching the specific quiz and 404’ing if there’s a bad ID

- `QuizList`: list of quizzes when you are at the home page
- `EditQuiz/`: all the stuff that is on the page when you edit a quiz
- `PlayQuiz`/: all the stuff that is on the page when you play a quiz 

- `Question`: displays a question. Has two modes - edit & regular. Edit is enabled only when onSave is truthy
- `QuestionOptions`: displays the options for a question *used in Question)

## Sources & attribution:
- JWT/passport code from [here](https://appdividend.com/2018/07/18/react-redux-node-mongodb-jwt-authentication/)
- Followed [these rules](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1) from MongoDB about how to structure schema. 
- I'm not super familiar with Node/MongoDB best practices so I tried to do my best to structure the app meaningfully from what I've seen in other projects. 
