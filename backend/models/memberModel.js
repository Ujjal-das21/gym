const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Customer Name"]
    },
    age: {
        type: Number,
        required: [true, "Please enter your age"]
    },
    address: {
        type: String,
        required: [true, "Please enter your Address"]
    },
    phone: {
        type: String,
        required: [true, "Please enter your phone number"],
        minLength: [10, "Phone number must be 10 digits"],
        maxLength: [10, "Phone number must be 10 digits"],

    },
    email: {
        type: String,
        required: [true, "please enter your email"]
    },
    avatar: {
        public_id: String,
        url: String

    },
    joining: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true,
    },
    membershipAmount: {
        type: Number,

    },
    membershipStart: {
        type: Date,
    },
    membershipPeriod: {
        type: Number,
    },
    membershipEnd: {
        type: Date,
    },
    signUpFee: {
        type: Number,
        default: 500
    }
},

);
Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
memberSchema.methods.setMembership = function () {
    var endDate = new Date();
    endDate = endDate.addDays(this.membershipPeriod);
    this.membershipEnd = endDate;
    this.membershipStart = new Date();

}
memberSchema.methods.recharge = function () {

 
    var endDate= new Date();
    endDate=endDate.addDays(this.membershipPeriod);
    this.membershipEnd=endDate;
    this.membershipStart=new Date();
    this.status = true;



}

module.exports = mongoose.model("Member", memberSchema);
