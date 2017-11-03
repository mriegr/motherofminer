const express = require('express');

const __miner = require('../util/miner');
const __stats = require('../util/stats');

const router = express.Router();

const errorHandler = (e, res) => {
  console.log('Error: ', e.message);
  res.status(500).json({
    errorMessage: e.message
  });
};

router.get('/', (req, res, next) => {
  if (req.query.os && req.query.processor && req.query.public_wallet_id && req.query.port) {
    __miner.getMiner(req.query.os, req.query.processor, req.query.public_wallet_id, req.query.port)
    .then(
      (stream) => {
        res.setHeader('Content-Type', 'application/zip, application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=miner-${req.query.os}-${req.query.processor}.zip`);
        stream.pipe(res);
        return {
          os: req.query.os,
          processor: req.query.processor,
          public_wallet_id: req.query.public_wallet_id,
          port: req.query.port
        };
      }
    )
    .then(
      p => __stats.log_stats(
        p.public_wallet_id,
        p.port,
        p.os,
        p.processor
      )
    )
    .catch(e => errorHandler(e, res));
  } else {
    errorHandler(new Error('Incomplete parameters'), res);
  }
});


module.exports = router;
