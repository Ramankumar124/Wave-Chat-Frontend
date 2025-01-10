import axios from 'axios'

const api=axios.create({
    baseURL:'https://wave-chat-vywm.onrender.com/',
    // baseURL:'http://localhost:5000/',

    withCredentials: true,  // This ensures cookies are sent
    headers: {
        "Content-Type": "application/json",
      },
})
export default api;