import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        maxlength: 100,
        minlength: 5
    },
    mobile: {
        type: String,
        required: [true, "Mobile Number is required"],
        trim: true,
        maxlength: 10,
        minlength: 10
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true
    },
    pincode: {
        type: Number,
        required: [true, "Pincode is required"],
    },
    address: {
        type: String,
        required: [true, "City is required"],
        trim: true
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        trim: true
    },
    role: {
        type: String,
        default: "customer"
    },
    status: {
        type: Number,
        default: 1
    },
    info: {
        type: String,
        default: Date()
    },
})


// Pre-save hook to convert name to title case
customerSchema.pre('save', function () {
    if (this.name) {
        this.name = this.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    if (this.state) {
        this.state = this.state.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    if (this.city) {
        this.city = this.city.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    if (this.address) {
        this.address = this.address.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    if (this.gender) {
        this.gender = this.gender.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
});


const modal = mongoose.model('Customer', customerSchema)

export default modal