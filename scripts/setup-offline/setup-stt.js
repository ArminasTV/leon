import { shell } from 'execa'
import fs from 'fs'

import log from '@/helpers/log'
import os from '@/helpers/os'

/**
 * Setup offline speech-to-text
 */
export default () => new Promise(async (resolve, reject) => {
  log.info('Setting up offline speech-to-text...')

  const destDeepSpeechFolder = 'bin/deepspeech'
  const tmpDir = 'scripts/tmp'
  const deepSpeechVersion = '0.5.0'
  // const archiveName = `deepspeech-${deepSpeechVersion}-models.tar.gz`
  const archiveName = 'model_tflite_fr.tar.xz'
  let downloader = 'wget'
  if (os.get().type === 'macos') {
    downloader = 'curl -L -O'
  }

  if (!fs.existsSync(`${destDeepSpeechFolder}/lm.binary`)) {
    try {
      log.info('Downloading pre-trained model...')
      // await shell(`cd ${tmpDir} && ${downloader} https://github.com/mozilla/DeepSpeech/releases/download/v${deepSpeechVersion}/${archiveName}`)
      await shell(`cd ${tmpDir} && ${downloader} https://github.com/Common-Voice/commonvoice-fr/releases/download/v0.6.0-fr-0.3.4/${archiveName}`)
      log.success('Pre-trained model download done')
      log.info('Unpacking...')
      // await shell(`cd ${tmpDir} && tar xvfz ${archiveName}`)
      await shell(`cd ${tmpDir} && tar -xJf ${archiveName}`)
      log.success('Unpack done')
      log.info('Moving...')
      await shell(`mv -f ${tmpDir}/deepspeech-${deepSpeechVersion}-models/* ${destDeepSpeechFolder} && rm -rf ${tmpDir}/${archiveName} ${tmpDir}/models`)
      log.success('Move done')
      log.success('Offline speech-to-text installed')

      resolve()
    } catch (e) {
      log.error(`Failed to install offline speech-to-text: ${e}`)
      reject(e)
    }
  } else {
    log.success('Offline speech-to-text is already installed')
    resolve()
  }
})
