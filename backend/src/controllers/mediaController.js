const uploadMedia = (req, res) => {
  res.status(200).json({ message: "Media uploaded successfully!" });
};

const getMedia = (req, res) => {
  res.status(200).json({ message: "Media retrieved successfully!" });
};

module.exports = { uploadMedia, getMedia };
