const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const time = require('express-timestamp');
const app = express();
const url = require('url');
const querystirng = require('querystring');

app.use(time.init)

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find().exec()
    .then(docs => {
      console.log(docs);
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
  var dateTime = new Date();
  const product = new Product({
    key: req.body.key,
    value: req.body.value,
    timestamp: dateTime
  });
  product.save()
    .then(result => {
      var dt = result.timestamp;
      var hourTime = dt.getHours();
      var minTime = dt.getMinutes();
      var timeStamp = hourTime > 12 ? hourTime - 12 + ':' + minTime + 'PM' : hourTime + ':' + minTime + 'AM';
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: {
          key: result.key,
          value: result.value,
          timeStamp: timeStamp
        },
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
  var datetimestamp = req.query.timestamp;
  if (datetimestamp) {
    Product.find({ key: keyValue, timestamp: datetimestamp })
      .exec()
      .then(doc => {
        console.log("From timestamp", doc);
        if (doc) {
          res.status(200).json({
            value: doc[0].value
          });
        } else {
          res.status(404).json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
  else {
    Product.find({ key: keyValue }).sort({ timestamp: -1 }).limit(1)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            value: doc[0].value
          });
        } else {
          res.status(404).json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
});

router.delete("/:key", (req, res, next) => {
  const id = req.params.key;
  Product.findOneAndRemove({ key: id })
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
