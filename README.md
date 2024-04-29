# Barter Hive App

Barter Hive is a social media website that primarily allows users to buy and sell goods with others around the world. The user can make an account, make posts that can either be for social reasons or as a sale posting. You can add friends and even instant message others on the site. This community is the perfect hub for user to blend social life with trading.

## Installation

Fork this repo, copy the SSH link, and type "git clone 'SSH link'" into your terminal in your desired directory.

Now you have two options:

 - On your local copy, type "pipenv install" to install all the necessary libraries for this project into your environment (you must already have pipenv setup). To run it on your local machine you can type "python app.py" from the server directory and "npm run dev" from the client directory.
 
 - Or you can use honcho to host the site from your computer by typing "pip install -r requirements.txt" to make sure you have all the needed libraries for this run. Then in the root directory, type "npm run build --prefix client" to make the build. Once the build is made, type "gunicorn --chdir server -k gevent -w 1 app:app" to run a production build on local port 8000 (gevent is necessary for the web socket used in this project).

 If you wish to just access the live site, here is the url: [Barter Hive](https://barter-hive.onrender.com/).

## Usage

Barter Hive allows a user to create an account and easily search other users on the site from anywhere around the world, create sale postings for others to see, instant message users to barter over buying or selling goods, add users who you constantly interact with as friends, customize your own social page, and endlessly scroll through everyone's posts in the home page. When a user is navigating the website, they will find that they have the ability to "want" or "pass" on certain posts based on whether or not the user likes the post (social or sale). The user will also be able to leave comments on posts, like comments, edit your own comments, or even delete your own comments. Finally images are can be uploaded as files for the posts (which can have mulitple images), for the user profile pic, or for the user banner pic. The website is currently deployed and live at the following link: [Barter Hive](https://barter-hive.onrender.com/).

## Sample GIF of Application

![Barter Hive GIF](/BarterHiveGif.gif)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Roadmap

I plan on eventually updating the css so that the site can have a light/dark mode that can be changed in the account settings.

Also I am planning on adding the capability for the user to edit or delete their own posts that they made.

I plan on changing the algorithm for which posts are shown first in the home page.

In addition, I plan on showing who "want"ed or "pass"ed on certain posts when you hover or click the wants or passes on the post in question.

Additionally, I plan on adding a filter/sort functionality to the home page so that users can find certain goods that are for sale or to just look for specific social media.

## License

[MIT](https://choosealicense.com/licenses/mit/)
