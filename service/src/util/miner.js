const Archiver = require('archiver');
const configurationFileGenerator = require('./configurationFileTemplate');
// const clone = require('clone');

const Util = {
  miner: null,
  minerPath: {
    windows: {
      amd: 'win-xmr-stak-amd-1.4.0',
      cpu: 'win-xmr-stak-cpu-1.5.0',
      nvidia: 'win-xmr-stak-nvidia-1.4.0-CUDA9'
    },
    mac: {
      cpu: 'mac-xmr-stak-cpu',
      nvidia: 'mac-xmr-stak-nvidia'
    }
  },
  initMiner: () => {
    return new Promise((resolve, reject) => {
      try {
        if (Util.miner) {
          console.log('Miner already initialized');
        } else {
          console.log('Initializing miner');
          Util.miner = {};
          const arr_os = Object.getOwnPropertyNames(Util.minerPath);
          for (let i = 0, len = arr_os.length; i < len; i++) {
            const arr_processor = Object.getOwnPropertyNames(
              Util.minerPath[arr_os[i]]
            );
            Util.miner[arr_os[i]] = {};
            for (
              let j = 0, len_processor = arr_processor.length;
              j < len_processor;
              j++
            ) {
              const zip = Archiver('zip', {
                zlib: { level: 9 }
              });
              zip.directory(
                `data/${Util.minerPath[arr_os[i]][arr_processor[j]]}`,
                false
              );
              Util.miner[arr_os[i]][arr_processor[j]] = zip;
            }
          }
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  getMiner: (os, processor, public_wallet_id, pool_port, options) => {
    return new Promise((resolve, reject) => {
      try {
        if (!Util.minerPath.hasOwnProperty(os)) {
          throw new Error('Requested operating system is not supported');
        }
        if (!Util.minerPath[os].hasOwnProperty(processor)) {
          throw new Error('Requested processor is not supported');
        }
        const zip = Archiver('zip', {
          zlib: { level: 9 }
        });
        zip.directory(
            `data/${Util.minerPath[os][processor]}`,
            false
          );
        const scriptName = (os === 'windows') ? 'config.txt' : 'start.sh';
        zip.append(configurationFileGenerator[os][processor](public_wallet_id, pool_port, options), { name: scriptName });
        zip.finalize();
        resolve(zip);
      } catch (e) {
        reject(e);
      }
    });
  },
  // getMinerFromCache: (os, processor) => {
  //   return Util.initMiner().then(() => {
  //     return new Promise((resolve, reject) => {
  //       try {
  //         if (!Util.minerPath.hasOwnProperty(os)) {
  //           throw new Error('Requested operating system is not supported');
  //         }
  //         if (!Util.minerPath[os].hasOwnProperty(processor)) {
  //           throw new Error('Requested processor is not supported');
  //         }
  //         const zip = Util.miner[os][processor];
  //         const scriptName = (os === 'windows') ? 'config.txt' : 'start.sh';
  //         zip.append(configurationFileGenerator[os][processor](public_wallet_id, pool_port), { name: scriptName });
  //         zip.finalize();
  //         resolve(zip);
  //       } catch (e) {
  //         reject(e);
  //       }
  //     });
  //   });
  // },
};

module.exports = Util;
