export default {
  uri: process.env.MONGO_URI,
  config: {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  },
};
