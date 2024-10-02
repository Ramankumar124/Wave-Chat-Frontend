import api from "./api";


export const userData = async () => {
    try {
        const response = await api.get('/userData');
        console.log(response);
        
        return response.data; 
    } catch (err) {
        console.log(err.message);
    }
};
