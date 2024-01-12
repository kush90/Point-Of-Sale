import axios from 'axios';
import { API_URL, setNetworkHeader } from './Helper';

export const post = async (url, obj) => {
    return await axios.post(
        `${API_URL}/${url}`, obj, setNetworkHeader()
    );
}

export const get = async (url) => {
    return await axios.get(
        `${API_URL}/${url}`, setNetworkHeader()
    );
}

export const patch = async (url,obj) => {
    return await axios.patch(
        `${API_URL}/${url}`, obj,setNetworkHeader()
    );
}

export const remove = async (url) => {
    return await axios.delete(
        `${API_URL}/${url}`,setNetworkHeader()
    );
}