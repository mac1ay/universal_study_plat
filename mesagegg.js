import axios from "axios";


export const getMessage = async () => {
    const response = await axios.get(process.env.CAT_URL);
    return response?.data[0].url;
}