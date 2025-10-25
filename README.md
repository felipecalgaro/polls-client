# 🖊️ Polls Client

## What I Learned

- Advanced form validation including dynamically addable fields with Zod and React Hook Form
- Real-time API connection using WebSocket
- User identification via cookies
  - This made possible for each vote to be remembered across user sessions

## Overview

This is the client portion of the Polls project, which is a platform where you can create a poll with multiple options, vote on one of them and see others voting in real-time.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Usage](#usage)
- [License](#license)

## Technologies Used

- [React](https://reactjs.org/) - JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for fast UI development.
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema declaration and validation library.
- [React Hook Form](https://react-hook-form.com/) - Performant forms with easy-to-use validation.
- [React Query](https://react-query.tanstack.com/) - Data fetching and caching library for React.
- [React Router Dom](https://reactrouter.com/) - Efficient pages navigation library for React.
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - Real-time connection between API and client.

## Features

- The poll creation is controlled by Zod and React Hook Form
  - The poll must have a title, a minimum of 2 options and a maximum of 5.
  - Eventual errors show up with self-explanatory messages near the wrongly filled elements.
- Each poll has an identifier and a unique page, that can be accessed by anyone
- The voted option is correctly outlined and identified by a session stored in cookies
- The voting system is implemented in real-time with WebSocketAPI
  - Whenever an option is voted on, it will immediately raise its vote count by one, and, in case the user voted on another option before, this one will have its count decreased by one.
  - Everyone that is on that page will be able to see the increase/decrease simultaneously.

## Usage

1. Create a poll with a title and some options:

![1](https://github.com/felipecalgaro/polls-client/assets/102491212/896df9eb-12be-4b62-b20c-d42fa6b67b65)

2. Vote on any option anytime you want, and only one option at a time:

![2](https://github.com/felipecalgaro/polls-client/assets/102491212/8d823002-ebca-4c08-bf18-913f7e8e2a01)

3. Invite some friends in order to see real-time voting:

![3](https://github.com/felipecalgaro/polls-client/assets/102491212/1663d91c-4c24-45de-a383-1dfa6589ffb6)

## License

This project is licensed under the MIT License.
