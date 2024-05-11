from pymongo import MongoClient
from bson.objectid import ObjectId

def get_database():
    # CONNECTION_STRING = 'mongodb+srv://doadmin:06w7Z18nf3Pep59b@comtily-563c93f3.mongo.ondigitalocean.com/admin?tls=true&authSource=admin'
    CONNECTION_STRING = 'mongodb://localhost:27017'
    client = MongoClient(CONNECTION_STRING)
    return client['svn']

if __name__ == '__main__':
   dbname = get_database()
   collection_name = dbname['posts']

posts = [
    {
    'title': 'Introduction',
    'tags': [],
    'category': '',
    'date': '2024-05-09',
    'content': """
# Introduction

I have wanted a blog for who knows what reason for many years. A couple of years ago I had a blog that was related to Cyber Security, but I was basically copying and pasting the content of other blogs. Then I created one that was going to be the life of a working dad of 4 children. This didn't pan out due to me not wanting to post consistently.

So here we are. I am making my first post on this blog. Where is this headed, I have no idea. I am writing the code and the posts as I go along so features may suddenly appear. I may ramble, use improper English, or have spelling/grammar errors. Eventually I might have a comments section or the ability to vote on the content, but well people can be mean and I am not ready for that yet.

Have a good day!! Thank you for reading my inaugural post.

![Photo by Guillaume Hankenne from Pexels](https://images.pexels.com/photos/2792077/pexels-photo-2792077.jpeg?auto=compress&cs=tinysrgb&h=250)
"""
    },
]

for post in posts:
    collection_name.update_one({'title': {'$eq': post['title']}, 'date': {'$eq': post['date']}}, {'$set': post}, upsert=True)
