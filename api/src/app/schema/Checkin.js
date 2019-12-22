import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const Schema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(paginate);

export default mongoose.model('Checkin', Schema);
