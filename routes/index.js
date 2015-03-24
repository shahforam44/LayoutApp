var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Predict Spring App'});
});

router.findAll = function(req, res, next) {
    res.send(req.session.layouts);
}
router.insertUpdate = function(req, res, next) {
    if(req.session.layouts === undefined) {
        req.session.layouts = {};
    }
    var jsonData = req.body;
    var layoutName = jsonData.layoutName;
    var layoutCells = jsonData.layoutCells;
    req.session.layouts[layoutName] = layoutCells;
    res.send(req.session.layouts);
}

module.exports = router;


