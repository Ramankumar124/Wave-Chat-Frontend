import api from "./api";


export const userData = async () => {
    try {
        const response = await api.get('/userData');
        return response.data; 
    } catch (err) {
        console.log(err);
    }
};
