import axios from "axios";

const fetchProof = async (req, res) => {
  const id  = req.query.fetchProofFaces
  const response = await axios.get(
    `https://us-central1-polymorphmetadata.cloudfunctions.net/getTransferProof?tokenIds=${id}&morph=1`
  );
  res.status(200).json(response.data)
};

export default fetchProof;
