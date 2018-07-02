const express = require("express");
const router = express.Router();

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find().exec()
    .then(docs => {
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: 'No entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const dateTime = new Date();
  const product = new Product({
    key: req.body.key,
    value: req.body.value,
    timestamp: dateTime
  });
  product.save()
    .then(result => {
      var dt = result.timestamp;
      var hourTime = dt.getUTCHours();
      var minTime = dt.getUTCMinutes();
      var timeStamp = hourTime > 12 ? hourTime - 12 + ':' + minTime + ' PM' : hourTime + ':' + minTime + ' AM';
      res.status(201).json({
        key: result.key,
        value: result.value,
        timeStamp: timeStamp
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:key", (req, res, next) => {
  const keyValue = req.params.key;
  const datetimestamp = req.query.timestamp ? req.query.timestamp : (new Date()).getTime();
  Product.find({ key: keyValue, timestamp: { $lte: new Date(parseInt(datetimestamp)) } }).sort({ timestamp: -1 })
    .exec()
    .then(doc => {
      if(doc.length > 0)
        res.status(200).json({
          value: doc[0].value
        });
      else
        res.status(404).json({message: "No valid entry found for provided time stamp"})
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:key", (req, res, next) => {
  const keyValue = req.params.key;
  Product.deleteMany({ key: {$in: [keyValue]} })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
