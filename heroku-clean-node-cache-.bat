heroku config:set NODE_MODULES_CACHE=false
git commit -am 'rebuild' --allow-empty
git push heroku master
heroku config:unset NODE_MODULES_CACHE