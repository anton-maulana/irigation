import Marker from '../models/marker';
import BaseCtrl from './base';
import * as dotenv from 'dotenv';

const Pusher = require('pusher');

dotenv.load({ path: '.env' });

export default class MarkerCtrl {
  model = Marker;
  private pusher =  Pusher;

  constructor (pusher: any) {
    this.pusher = pusher;
  }

  // Insert
  insert = async (req, res) => {
    try {
      console.log(req.body);
      let existDevice = await this.model.findOne({ device_id: Number(req.body.device_id)});
      console.log(existDevice);
      if (existDevice) {
        await Marker.findOneAndUpdate({ _id: existDevice._id }, req.body);
        existDevice = await this.model.findOne({device_id: req.body.device_id});
      } else {
        existDevice = await new this.model(req.body).save();
      }

      this.pusher.trigger('realtime-marker', 'posts', {
        body: existDevice,
        time: new Date(),
      });

      res.status(201).json(existDevice);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Get all
  getAll = async (req, res) => {
    try {
      const docs = await this.model.find({}).sort({order_number: 1});
      res.status(200).json(docs);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Count all
  count = async (req, res) => {
    try {
      const count = await this.model.count();
      res.status(200).json(count);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Get by id
  get = async (req, res) => {
    try {
      const obj = await this.model.findOne({ _id: req.params.id });
      res.status(200).json(obj);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Update by id
  update = async (req, res) => {
    try {
      await this.model.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.sendStatus(200);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Delete by id
  delete = async (req, res) => {
    try {
      await this.model.findOneAndRemove({ _id: req.params.id });
      res.sendStatus(200);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
