import axios from "axios";

export const axiosInstace= axios.create({});

export const apiConnector = (method, url, bodyData, headers, params)=>{
    return axiosInstace({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    })
}