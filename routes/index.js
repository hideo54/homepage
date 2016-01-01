var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'hideo54.com'});
});

router.get('/about', function(req, res, next) {
    res.render('about', {title: 'About'});
});

router.get('/activity', function(req, res, next) {
    res.render('activity', {title: 'Activity'});
});

router.get('/links', function(req, res, next) {
    res.render('links', {title: 'Links'});
});

module.exports = router;
