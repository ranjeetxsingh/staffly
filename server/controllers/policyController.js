const Policy = require("../models/Policy.js");

exports.getPolicies = async (req, res) => {
  const policies = await Policy.find().sort({ createdAt: -1 });
  res.json(policies);
};

exports.addPolicy = async (req, res) => {
  const { title, description, category, effectiveFrom, createdBy } = req.body;
  const policy = await Policy.create({ title, description, category, effectiveFrom, createdBy });
  res.status(201).json(policy);
};

exports.updatePolicy = async (req, res) => {
  const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(policy);
};
