const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    user_id : {type:Schema.Types.ObjectId, ref : 'User'},
    createdAt : {type : Date, default : Date.now}
},{
    toJSON: {virtuals:true},
    toObject : {virtuals : true}
});

schema.plugin(mongoosePaginate);

var Order = mongoose.model('Order', schema);

module.exports = Order;