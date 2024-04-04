const mongoose = require('mongoose');

const brewingLogSchema = new mongoose.Schema({
  adc1: [Number],
  adc2: [Number],
  total: [Number],
  size: [Number],
  bsize: [Number],
  temperature: [Number],
  thermometer: [Number],
  percent: [Number],
  coffeePowerWeight: [Number],
  period: Number,
  ratio: [Number],
  scale: [String],
  beanRatioArray: [Number],
  totalBeanRatioArray: [String]
});

const beanMixedSchema = new mongoose.Schema({
  weight: Number,
  ratio: Number,
  bakeDegree: Number
});

const fwjlSchema = new mongoose.Schema({
  fw: String,
  sw: String,
  tw: String,
  chd: String,
  yy: String,
  ph: String
});

const brewSchema = new mongoose.Schema({
  id: Number,
  json: {
    filterCupModel: Number,
    cupFactory: String,
    cupModel: String,
    cupType: Number,
    filterPaper: String,
    beanTypeSelected: String,
    singleBean: {
      name: String,
      weight: Number,
      bakeDate: String,
      bakeDegree: String
    },
    mixedBean: {
      bean1: beanMixedSchema,
      bean2: beanMixedSchema,
      bean3: beanMixedSchema,
      bean4: beanMixedSchema
    },
    fwjl: fwjlSchema,
    beanMoDouJi: String,
    beanKeDu: String,
    beanCuXi: String,
    beanBoilDuration: String,
    waterQuality: String,
    totalWeight: Number,
    waterPowderRatio: String,
    ratio: String,
    totalDuration: Number,
    jugTemperature: String,
    totalWaterInjection: Number,
    bestDrinkTemperature: String,
    stars: Number,
    extraNote: String,
    db: Number,
    tds: Number,
    extractionRate: Number,
    lowercolumn: Number,
    uppercolumn: Number,
    beforecolumn: Number,
    aftercolumn: Number,
    ls: Number,
    brewingLog: brewingLogSchema
  }
}, { timestamps: true });

const Brew = mongoose.model('Brew', brewSchema);

module.exports = Brew;
