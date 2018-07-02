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
      console.log("the timestamp: ", docs[5].timestamp.getTime());
      console.log("the timestamp: ", docs[6].timestamp.getTime());
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
      var timeStamp = hourTime > 12 ? hourTime - 12 + ':' + minTime + ' PM' : hourTime + ':' + minTime + ' AM';
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
  var i;
  var resValue = '';
  var datetimestamp = req.query.timestamp;
  if (datetimestamp) {
    Product.find({ key: keyValue }).sort({ timestamp: -1 })
      .exec()
      .then(doc => {
        datetimestamp = parseInt(datetimestamp);
        if (doc.length > 0) {
          for (i = 0; i < doc.length; i++) {
            if (doc[i].timestamp.getTime() === datetimestamp) {
              resValue = doc[i].value;
            }
            else if (i !== doc.length - 1) {
              if (doc[i].timestamp.getTime() > datetimestamp && doc[i + 1].timestamp.getTime() < datetimestamp) {
                resValue = doc[i + 1].value;
              }
              else if (doc[i].timestamp.getTime() < datetimestamp) {
                resValue = doc[i].value;
              }
            }
          }
          if (resValue) {
            res.status(200).json({
              value: doc[0].value
            });
          }
          else {
            res.status(404).json({ message: "No valid entry found for giving timestamp" });
          }
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
    Product.find({ key: keyValue }).sort({ timestamp: -1 })
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

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove({ _id: id })
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
