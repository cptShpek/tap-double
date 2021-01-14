const cryptoRandomString = require("crypto-random-string");
const Referral = require("../models/Referral");

exports.getUniqueLinkCode = async () => {
  const hash = cryptoRandomString({ length: 10 });
  const isExist = await Referral.findOne({ linkCode: hash });

  if (isExist) {
    return getUniqueLinkCode();
  }

  return hash;
};
