const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {type: String},
    sections: [{name:{type:String},
      text:[{type:String}],
      actionsNum: {type: Number},
      actions:[
        {name:{type: String},
        description:{type:String},
        rewards:{type:String},
        cost:{type:String},
        length:{type:String},
        difficulty:{type:String},
        danger:{type:String},
        actionSlots:[{type:String}],
        moneySlot:{type:String},
        customAction:{type:String},
        subChoices:[
          {name:{type:String},
          description:{type:String},
          unlockedDueTo:{type:String}}
        ]}
    ]}]
  },
  {timestamps: true}
)

const Model = mongoose.model("Actions", schema);

module.exports = Model;