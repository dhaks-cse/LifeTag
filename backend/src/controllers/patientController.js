const Patient = require("../models/Patient");

const createPatient = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      message: "Patient profile created successfully.",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientByMedicalId = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      medicalId: req.params.medicalId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      {
        medicalId: req.params.medicalId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient profile updated successfully.",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOneAndDelete({
      medicalId: req.params.medicalId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient profile deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const searchPatients = async (req, res, next) => {
  try {
    const keyword = req.query.q || "";

    const patients = await Patient.find({
      fullName: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientByMedicalId,
  updatePatient,
  deletePatient,
  searchPatients,
};