import axios from "axios";

const fetchProofPolymorphs = async (req, res) => {
  const id  = req.query.fetchProofPolymorphs
  const response = await axios.get(
    `https://us-central1-polymorphmetadata.cloudfunctions.net/getTransferProof?txHash=${id}`
  );
  res.status(200).json(response.data)
};

export default fetchProofPolymorphs;
