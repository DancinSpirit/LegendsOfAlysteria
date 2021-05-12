const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    type: {type: String},
    seasons: [{type: mongoose.Schema.Types.ObjectId, ref: "Season"}],
    songs: [{url: {type: String}, name: {type: String}}],
    images: [{url: {type: String}, name: {type: String}}],
  },
  {timestamps: true}
)

const Story = mongoose.model("Story", storySchema);

module.exports = Story;