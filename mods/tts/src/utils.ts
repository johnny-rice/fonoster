import crypto from "crypto";

/**
 * Uses the input text and options to generate a filename. This is
 * later used to cache a file generated by a TTS engine.
 *
 * @param {string} - the text to synthetize
 * @param {object} - json object with configuration for the TTS engine
 * @param {sting} - resulting format. Defaults to '.wav'
 * @returns {string} compute filename
 */
const computeFilename = (text: string, options: any = {}, format = "wav") => {
  const flat = require("flat");
  let c = text;
  if (options.cachingFields) {
    const flatObj = flat(options);
    c = options.cachingFields
      .map((opt: string) => flatObj[opt])
      .sort()
      .join();
  }
  return (
    crypto.createHash("md5").update(`${text},${c}`).digest("hex") + "." + format
  );
};

/**
 * Takes a json object and creates a query formatted string
 *
 * @param {object} - a one level json object with the synth options
 * @returns {string} a string with the format like 'key=value&'
 */
const optionsToQueryString = (obj: any): string =>
  Object.keys(obj)
    .map((key: string) => `${key}=${obj[key].toString()}`)
    .join("&");

/**
 * Gets the path to a file as input and transcode to
 * a new format compatible with Asterisk
 *
 * @param {string} fileIn - path to original file which is expected to be .wav
 * @param {string} fileOut - path resulting file in a format understod by asterisk
 * @returns {Promise<string>} path to the resulting file
 */
const transcode = (fileIn: string, fileOut: string): Promise<string> =>
  new Promise((resolve, reject) => {
    // We need a new instance to avoid collisions
    const sox = require("sox-audio")();
    sox.on("error", (err: any, stdout: any, stderr: any) =>
      reject(`Cannot process audio: ${err.message}`)
    );
    sox.input(fileIn);

    // TODO: Investigate other formats that can produce a better audio quality
    sox.output(fileOut).outputSampleRate(8000).outputFileType("wav");
    sox.run();
    sox.on("end", () => resolve(fileOut));
  });

export {computeFilename, transcode, optionsToQueryString};
