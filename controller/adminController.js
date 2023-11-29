const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { admin } = require("../models");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // validasi jika email sudah kepake
    const user = await admin.findOne({ where: { email: email } });
    if (user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists!");
    }

    // validasi minimum password length
    const passwordLength = password.length >= 8;
    if (!passwordLength) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Minimum password length must be 8 characters or more"
      );
    }

    // enkripsi password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // register user baru
    const newAdmins = await admin.create({
      name,
      password: hashedPassword,
      email,
    });

    res.status(201).json({
      status: "success",
      data: {
        newAdmins,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message, // Mengambil pesan error dari instance ApiError
      });
    } else {
      // Handle other types of errors
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // cari user berdasarkan email
  const admins = await admin.findOne({
    where: {
      email,
    },
  });

  // gagal melanjutkan karena username nya tidak ada
  if (!admins) {
    throw new ApiError(httpStatus.NOT_FOUND, "admin doesn't exist");
  }

  // check password user, jika success login dapat response intinya TOKEN
  if (admins && bcrypt.compareSync(password, admins.password)) {
    // generate token utk user yg success login
    const token = jwt.sign(
      {
        id: admins.id,
        username: admins.name,
        email: admins.email,
      },
      "rahasia"
    );

    res.status(200).json({
      status: "Success",
      data: {
        username: admins.name,
        email: admins.email,
        token,
      },
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Password");
  }
});

const updateAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body; // Dapatkan data yang akan diperbarui dari body request

  // Cari pengguna berdasarkan ID
  const admins = await admin.findByPk(id);

  // Jika pengguna tidak ditemukan
  if (!admins) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Perbarui data pengguna
  admins.name = name;
  admins.email = email;

  // Jika password ada dalam body request, hash password baru dan perbarui
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    admins.password = hashedPassword;
  }

  await admins.save();

  res.status(200).json({
    status: "success",
    data: {
      admins,
    },
  });
});

//GET ALL
const findAllAdmin = catchAsync(async (req, res) => {
  const adminData = await admin.findAll();
  res.status(200).json({
    status: "success",
    data: {
      admin: adminData,
    },
  });
});

// GET BY ID
const findAdminById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const admins = await admin.findByPk(id);

  if (!admins) {
    throw new ApiError(404, `Admin with this id ${id} is not found`);
  }

  res.status(200).json({
    status: "success",
    data: {
      admins,
    },
  });
});

// DELETE
const deleteAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;

  const admins = await admin.findByPk(id);

  if (!admins) {
    throw new ApiError(404, `Admin with this id ${id} is not found`);
  }

  await admin.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    status: "success",
    message: `Admin dengan id ${id} terhapus`,
  });
});

module.exports = {
  register,
  login,
  updateAdmin,
  findAllAdmin,
  findAdminById,
  deleteAdmin,
};
