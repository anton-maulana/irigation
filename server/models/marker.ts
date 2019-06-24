import * as mongoose from 'mongoose';

const markerSchema = new mongoose.Schema({
  device_id: Number,
  lat: Number,
  long: Number,
  active: Boolean,
  order_number: Number,
  location_name: String,
  descriptions: String,
});

const Marker = mongoose.model('Marker', markerSchema);

export default Marker;
