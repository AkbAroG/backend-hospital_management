import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  if (!firstName) return next(new ErrorHandler("First Name is missing!", 400));
  if (!lastName) return next(new ErrorHandler("Last Name is missing!", 400));
  if (!email) return next(new ErrorHandler("Email is missing!", 400));
  if (!phone) return next(new ErrorHandler("Phone is missing!", 400));
  if (!nic) return next(new ErrorHandler("NIC is missing!", 400));
  if (!dob) return next(new ErrorHandler("DOB is missing!", 400));
  if (!gender) return next(new ErrorHandler("Gender is missing!", 400));
  if (!appointment_date) return next(new ErrorHandler("Appointment Date is missing!", 400));
  if (!department) return next(new ErrorHandler("Department is missing!", 400));
  if (!doctor_firstName || !doctor_lastName) return next(new ErrorHandler("Doctor is missing!", 400));
  if (!address) return next(new ErrorHandler("Address is missing!", 400));
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
    paymentInfo: {
      paymentId: "",
      status: "Pending",
      amount: 0,
    },
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});

export const getStats = catchAsyncErrors(async (req, res, next) => {
  const allAppointments = await Appointment.find();

  // Today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayAppointments = allAppointments.filter((a) => {
    const d = new Date(a.createdAt || a._id.getTimestamp());
    return d >= today && d < tomorrow;
  });

  // Status counts
  const pending = allAppointments.filter((a) => a.status === "Pending").length;
  const accepted = allAppointments.filter((a) => a.status === "Accepted").length;
  const rejected = allAppointments.filter((a) => a.status === "Rejected").length;

  // Payment stats
  const paidAppointments = allAppointments.filter((a) => a.paymentInfo?.status === "Paid");
  const pendingPayments = allAppointments.filter((a) => a.paymentInfo?.status === "Pending").length;
  const totalRevenue = paidAppointments.reduce((sum, a) => sum + (a.paymentInfo?.amount || 0), 0);

  // Last 7 days appointments grouped by date
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const count = allAppointments.filter((a) => {
      const d = new Date(a.createdAt || a._id.getTimestamp());
      return d >= day && d < nextDay;
    }).length;

    last7Days.push({
      date: day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      appointments: count,
    });
  }

  // Department distribution
  const deptMap = {};
  allAppointments.forEach((a) => {
    deptMap[a.department] = (deptMap[a.department] || 0) + 1;
  });
  const departmentData = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

  res.status(200).json({
    success: true,
    stats: {
      totalAppointments: allAppointments.length,
      todayAppointments: todayAppointments.length,
      pending,
      accepted,
      rejected,
      paidCount: paidAppointments.length,
      pendingPayments,
      totalRevenue,
      last7Days,
      departmentData,
    },
  });
});
export const getMyAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find({ patientId: req.user._id });
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const cancelAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }
  appointment.status = "Rejected";
  await appointment.save();
  res.status(200).json({
    success: true,
    message: "Appointment Cancelled!",
  });
});

export const rescheduleAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { appointment_date } = req.body;
  let appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }
  appointment.appointment_date = appointment_date;
  appointment.status = "Pending";
  await appointment.save();
  res.status(200).json({
    success: true,
    message: "Appointment Rescheduled!",
  });
});
