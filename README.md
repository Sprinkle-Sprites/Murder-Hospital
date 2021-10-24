# Murder Hospital

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Game Play](#game-play)
- [Getting Started](#getting-started)
- [Next Steps](#next-steps)
- [Creators](#creators)
- [Docs](#docs)

# Introduction

Murder Hospital is a horror-themed escape room game. Players wander a creepy hospital, looking for clues and trying to escape before the hospital's resident physician traps them there forever.

We took features of some of our favorite board games and combined it with puzzles and clues to create a unique online escape room experience.

Watch our full 4-minute demo video [here](linktbd).

# Tech Stack

- Javascript
- Node.js
- Express
- Phaser3
- Vue.js
- Heroku

# Game Play
- When your character arrives in the waiting room, roll the dice by clicking “Investigate a Room” to the right of the board. It will send you into a room in the hospital to explore.
- You have 30 seconds to check the room for clues by walking into things.
- After 30 seconds, or after you interact with an object in the room, you’ll be sent back to the main room to roll the dice again.
- [Room Demo Here](https://www.screencast.com/t/6r0m8kWhCun)
- Once you think you have figured out the code to escape, click the “Try to Exit” button to the right. You will not be able to leave the exit room without trying a code, so make sure you have a guess before you try.
- If your code is right, you’ll be able to leave. If not, you’ll have to try again.
- You have one hour to find all the clues and escape. If not, we’re sorry. The Doctor is not what you’d call a “good guy.”

# Getting Started

Fork and clone this repo. Then,
````javascript
npm install
````
Serve live reloading at localhost:8080
````javascript
npm run serve
````
Build for production
````javascript
npm run build
````
Serve your production build
```javascript
npm start
````

# Next Steps

Our biggest priority for the future of Murder Hospital is to make it multi-player using Socket.io. The multiplayer version will have the following additional features:
- Users can create a private room to play with up to 6 friends.
- They can also select an avatar to play as
- Chat with other players to discuss clues and strategies

In addition to multiplayer-functionality, we'd also like to add the following:
- Text animation for the pop-up messages
- Randomize the clue colliders and clues to allow for repeat play

# Creators

* Gabriella (Gabby) Apeadu: [GitHub](https://github.com/gapeadu) | [LinkedIn](https://www.linkedin.com/in/gabriellaap/)
* Helena Bliss: [GitHub](https://github.com/hbliss2) | [LinkedIn](https://www.linkedin.com/in/helena-bliss/)
* Nicole Buendia: [GitHub](https://github.com/nbuendia) | [LinkedIn](https://www.linkedin.com/in/nicole-buendia/)
* Sarah Sheppard: [GitHub](https://github.com/sheppas) | [LinkedIn](https://www.linkedin.com/in/sheppas/)


# Docs
Boilerplate: https://github.com/Sun0fABeach/vue-phaser3

Vue: https://v3.vuejs.org/guide/introduction.html

Phaser 3: https://photonstorm.github.io/phaser3-docs/
