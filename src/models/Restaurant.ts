import * as mongoose from "mongoose";
import { model } from "mongoose";

const restaurantSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  city_id: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  short_name: { type: String, required: true },
  description: { type: String },
  cover: { type: String, required: true },
  location: { type: Object, required: true },
  cuisines: { type: Array, required: true },
  open_time: { type: String, required: true },
  close_time: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  delivery_time: { type: Number, required: true },
  isClose: { type: Boolean, required: true, default: false },
  status: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  totalRating: { type: Number, required: true, default: 0 },
  created_at: { type: Date, required: true, default: new Date() },
  updated_at: { type: Date, required: true, default: new Date() },
});

// restaurantSchema.index({ location: "2dsphere" }, { background: true });

export default model("restaurant", restaurantSchema);
