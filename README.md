# Update Bot 
<img src="https://github.com/Sarthak-Dayal/Update-Bot/blob/master/assets/logo.png" width=100></img>

A simple, lightweight and intuitive Discord bot that helps you get news updates from the comfort of your server. Invite this bot to your server [here]( https://discord.com/api/oauth2/authorize?client_id=717776288269729803&permissions=8&scope=bot). Please note that since this bot is hosted for free on Heroku, it stops running after 23 days each month.


# Inspiration
This bot was originally created for a 400 person Discord server to get an easy way to manage news updates. The idea behind this bot is to provide users a simple and easy way to access news information from trusted news sources. It was extremely difficult for anyone to set up a simple bot to deliver news updates to their politics, gaming, or other server, and hence I got the idea to build a bot that would solve this problem. It then follows that I designed update bot to be as simple and intuitive to use as possible, while also providing a good experience for the user.

# Commands
1. `;help`: Shows a list of commands like the one here.
1. `;news`: Sends the current top article from Google News.
1. `;random`: Picks a random article among a few major headlines in Google News.
1. `;hook {webhookID} {webhook token}` Connects Update Bot to a user's premade Discord webhook where it sends the top headline every hour by calling `;news` automatically.
2. `;removehook {webhookID} {webhook token}` Disconnects update bot from a webhook that it was previously connected to.

# Technologies used
- [`node.js`](https://nodejs.org/en/)
- [`discord.js`](https://discord.js.org/#/)
- [`SQLite3`](https://www.sqlite.org/index.html)
- [`News API`](https://newsapi.org/)


# Contributing
I would love your help on this project! If you're interested in contributing, check out [Contributing.md](https://github.com/Sarthak-Dayal/Update-Bot/blob/master/Contributing.md)!

# Screenshots
![image](https://user-images.githubusercontent.com/63827830/121752991-fb212e80-cad6-11eb-8f3e-ff73525e73f2.png)
![image](https://user-images.githubusercontent.com/63827830/121753036-13914900-cad7-11eb-8f04-c61d2b4ecfce.png)
