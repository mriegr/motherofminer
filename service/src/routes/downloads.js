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
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }
  if (req.query.os && req.query.processor && req.query.public_wallet_id && req.query.port) {
    const options = {};
    if (req.query.ram_size_in_gb) {
      options.ram_size_in_gb = parseInt(req.query.ram_size_in_gb, 10);
    }
    if (req.query.cpu_core_count) {
      options.cpu_core_count = parseInt(req.query.cpu_core_count, 10);
    }
    __miner.getMiner(req.query.os, req.query.processor, req.query.public_wallet_id, req.query.port, options)
    .then(
      (stream) => {
        res.setHeader('Content-Type', 'application/zip, application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=minekitten.miner.${req.query.os}.${req.query.processor}.zip`);
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
        ip,
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

router.get('/stats/clearclearclear', (req, res, next) => {
  __stats.clear_stats()
    .then(() => {
      res.json({
        message: 'Stats cleared'
      });
    }).catch(e => errorHandler(e, res));
});

router.get('/stats/downloads', (req, res, next) => {
  __stats.get_stats()
    .then((stats) => {
      res.json({
        total: stats.length,
        stats
      });
    }).catch(e => errorHandler(e, res));
});


module.exports = router;
