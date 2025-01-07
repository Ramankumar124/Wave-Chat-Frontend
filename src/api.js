import axios from 'axios'

const api=axios.create({
    baseURL:'https://wave-chat-vywm.onrender.com/',
    withCredentials: true,  // This ensures cookies are sent
})
export default api;