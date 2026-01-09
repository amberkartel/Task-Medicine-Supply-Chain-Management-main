const express = require("express");
const {
  addMedicine,
  getAllMedicines,
  getMedicineHistory,
  getMedicineStage,
  getFullMedicineHistory, // <-- added for Option A
} = require("../controllers/medicineController");

const router = express.Router();

router.post("/add", addMedicine);
router.get("/", getAllMedicines);
router.get("/:id/history", getMedicineHistory);
router.get("/:id/stage", getMedicineStage);

// Option A route: fetch full medicine history from blockchain
router.get("/:id/full-history", getFullMedicineHistory);

module.exports = router;
